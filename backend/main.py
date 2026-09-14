import re
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from postgrest.exceptions import APIError
from database import supabase
from mailer import send_email, generate_new_booking_admin_email, generate_client_outreach_email, OWNER_EMAIL

app = FastAPI(
    title="G&K Auto Detailing & Stereo Services API",
    description="Full-stack FastAPI backend with Supabase and SMTP mailing integration.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def clean_price(price_str: Optional[str]) -> Optional[float]:
    """
    Sanitizes price strings (e.g., '$25', '$25.00', '25.50') by stripping currency symbols
    and non-numeric characters so PostgreSQL NUMERIC fields accept the value.
    Returns None safely if parsing fails rather than raising an unhandled ValueError.
    """
    if price_str is None:
        return None
    try:
        cleaned = re.sub(r"[^\d.]", "", str(price_str))
        return float(cleaned) if cleaned else None
    except (ValueError, TypeError):
        return None


# ==========================================
# PYDANTIC SCHEMAS
# ==========================================

class ServiceCreate(BaseModel):
    title: str
    description: str
    price: Optional[str] = None


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None


class BookingCreate(BaseModel):
    service_id: Optional[str] = None
    service_title: str
    booking_date: str  # Format: YYYY-MM-DD
    time_slot: str
    client_name: str
    client_email: EmailStr
    client_phone: str
    message: Optional[str] = None


class BookingStatusUpdate(BaseModel):
    status: str  # pending, confirmed, cancelled


class ClientReachoutRequest(BaseModel):
    custom_message: str


class ScheduleCreate(BaseModel):
    type: str  # recurring_slot, day_off_weekly, slot_override, date_off_override
    day_of_week: Optional[int] = None  # 0=Sunday, 6=Saturday
    time_slot: Optional[str] = None
    specific_date: Optional[str] = None  # YYYY-MM-DD
    is_available: Optional[bool] = True


class BlogCreate(BaseModel):
    title: str
    content: str
    image_url: str


class BlogLikeUpdate(BaseModel):
    action: str = "increment"  # "increment" or "decrement"


# ==========================================
# 1. HEALTH & KEEP-ALIVE
# ==========================================

@app.get("/")
def health_check():
    """UptimeRobot keep-alive endpoint."""
    return {"status": "ok", "message": "G&K Auto API is active"}


# ==========================================
# 2. SERVICES MANAGEMENT
# ==========================================

@app.get("/api/services")
def get_services():
    try:
        res = supabase.table("services").select("*").order("created_at", desc=False).execute()
        return res.data
    except APIError as e:
        print(f"SUPABASE ERROR (get_services): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/services", status_code=status.HTTP_201_CREATED)
def create_service(service: ServiceCreate):
    service_dict = service.model_dump()
    
    # Sanitize price for database compatibility
    if service_dict.get("price") is not None:
        service_dict["price"] = clean_price(service_dict["price"])

    try:
        res = supabase.table("services").insert(service_dict).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create service")
        return res.data[0]
    except APIError as e:
        # Print diagnostic info to server log console
        print(f"SUPABASE INSERT ERROR: message={e.message} | code={e.code} | details={e.details} | hint={e.hint}")
        if e.code == "42501":
            raise HTTPException(
                status_code=403, 
                detail="Row-Level Security violation. Ensure SUPABASE_SERVICE_ROLE_KEY is configured."
            )
        # Return detailed exception hint to frontend for easy debugging
        hint_str = f" (Hint: {e.hint})" if e.hint else ""
        details_str = f" - {e.details}" if e.details else ""
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}{details_str}{hint_str}")


@app.put("/api/services/{service_id}")
def update_service(service_id: str, service: ServiceUpdate):
    update_data = {k: v for k, v in service.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")
        
    # Sanitize price if present in update payload
    if "price" in update_data and update_data["price"] is not None:
        update_data["price"] = clean_price(update_data["price"])

    try:
        res = supabase.table("services").update(update_data).eq("id", service_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Service not found or update failed")
        return res.data[0]
    except APIError as e:
        print(f"SUPABASE ERROR (update_service): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.delete("/api/services/{service_id}")
def delete_service(service_id: str):
    try:
        res = supabase.table("services").delete().eq("id", service_id).execute()
        return {"status": "success", "message": "Service deleted successfully"}
    except APIError as e:
        print(f"SUPABASE ERROR (delete_service): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


# ==========================================
# 3. BOOKING ENGINE & AVAILABILITY MATRIX
# ==========================================

@app.get("/api/availability")
def get_availability(date: str = Query(..., description="Target date in YYYY-MM-DD format")):
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD")

    # Day of week: Python Monday=0 to Sunday=6. Convert to Sunday=0 to Saturday=6
    day_of_week = (dt.weekday() + 1) % 7

    try:
        # Check 1: Date Off Override
        date_off_res = supabase.table("schedules").select("*") \
            .eq("type", "date_off_override") \
            .eq("specific_date", date).execute()
        if date_off_res.data:
            return []

        # Check 2: Day Off Weekly
        day_off_res = supabase.table("schedules").select("*") \
            .eq("type", "day_off_weekly") \
            .eq("day_of_week", day_of_week).execute()
        if day_off_res.data:
            return []

        # Check 3: Base Recurring Slots
        recurring_res = supabase.table("schedules").select("time_slot") \
            .eq("type", "recurring_slot").execute()
        
        available_slots = set([item["time_slot"] for item in recurring_res.data if item.get("time_slot")])

        # Check 4: Slot Overrides (Additions or Removals)
        overrides_res = supabase.table("schedules").select("time_slot", "is_available") \
            .eq("type", "slot_override") \
            .eq("specific_date", date).execute()

        for override in overrides_res.data:
            slot = override.get("time_slot")
            if slot:
                if override.get("is_available", True):
                    available_slots.add(slot)
                else:
                    available_slots.discard(slot)

        # Check 5: Existing Active Bookings
        bookings_res = supabase.table("bookings").select("time_slot") \
            .eq("booking_date", date) \
            .neq("status", "cancelled").execute()

        booked_slots = set([item["time_slot"] for item in bookings_res.data if item.get("time_slot")])
        
        # Filter out booked slots
        final_slots = list(available_slots - booked_slots)
        
        # Standard Time Slot Sort Helper
        def time_sort_key(slot_str):
            try:
                start_part = slot_str.split("-")[0].strip()
                return datetime.strptime(start_part, "%I:%M %p")
            except Exception:
                return datetime.min

        final_slots.sort(key=time_sort_key)
        return final_slots
    except APIError as e:
        print(f"SUPABASE ERROR (get_availability): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate):
    booking_dict = booking.model_dump()
    booking_dict["status"] = "pending"
    
    try:
        res = supabase.table("bookings").insert(booking_dict).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to save booking")
        
        created_booking = res.data[0]

        # Trigger Automated Email Notification to Business Owner
        admin_html = generate_new_booking_admin_email(created_booking)
        send_email(
            to_email=OWNER_EMAIL,
            subject=f"New Booking: {created_booking['service_title']} - {created_booking['client_name']}",
            html_body=admin_html
        )

        return created_booking
    except APIError as e:
        print(f"SUPABASE ERROR (create_booking): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.get("/api/bookings")
def get_bookings():
    try:
        res = supabase.table("bookings").select("*").order("created_at", desc=True).execute()
        return res.data
    except APIError as e:
        print(f"SUPABASE ERROR (get_bookings): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.patch("/api/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, status_payload: BookingStatusUpdate):
    new_status = status_payload.status.lower()
    if new_status not in ["pending", "confirmed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    try:
        res = supabase.table("bookings").update({"status": new_status}).eq("id", booking_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Booking not found")

        updated_booking = res.data[0]

        # Automatically notify client of booking confirmation/cancellation
        outreach_msg = f"Your booking status for {updated_booking['service_title']} on {updated_booking['booking_date']} at {updated_booking['time_slot']} has been updated to: {new_status.upper()}."
        client_html = generate_client_outreach_email(
            client_name=updated_booking["client_name"],
            status=new_status,
            custom_message=outreach_msg
        )
        send_email(
            to_email=updated_booking["client_email"],
            subject=f"Booking Update - G&K Auto Detailing ({new_status.capitalize()})",
            html_body=client_html
        )

        return updated_booking
    except APIError as e:
        print(f"SUPABASE ERROR (update_booking_status): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/bookings/{booking_id}/reachout")
def reachout_to_client(booking_id: str, payload: ClientReachoutRequest):
    try:
        res = supabase.table("bookings").select("*").eq("id", booking_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking = res.data[0]
        client_html = generate_client_outreach_email(
            client_name=booking["client_name"],
            status=booking["status"],
            custom_message=payload.custom_message
        )

        email_sent = send_email(
            to_email=booking["client_email"],
            subject="Message from G&K Auto Detailing & Stereo Services",
            html_body=client_html
        )

        if not email_sent:
            raise HTTPException(status_code=500, detail="Failed to deliver email to client")

        return {"status": "success", "message": f"Email sent successfully to {booking['client_email']}"}
    except APIError as e:
        print(f"SUPABASE ERROR (reachout_to_client): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


# ==========================================
# 4. TIME SLOT & SCHEDULE CONFIGURATION
# ==========================================

@app.get("/api/schedules")
def get_schedules():
    try:
        res = supabase.table("schedules").select("*").order("created_at", desc=False).execute()
        return res.data
    except APIError as e:
        print(f"SUPABASE ERROR (get_schedules): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/schedules", status_code=status.HTTP_201_CREATED)
def create_schedule_rule(rule: ScheduleCreate):
    try:
        res = supabase.table("schedules").insert(rule.model_dump()).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create schedule rule")
        return res.data[0]
    except APIError as e:
        print(f"SUPABASE ERROR (create_schedule_rule): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.delete("/api/schedules/{schedule_id}")
def delete_schedule_rule(schedule_id: str):
    try:
        res = supabase.table("schedules").delete().eq("id", schedule_id).execute()
        return {"status": "success", "message": "Schedule rule deleted successfully"}
    except APIError as e:
        print(f"SUPABASE ERROR (delete_schedule_rule): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


# ==========================================
# 5. BLOG SYSTEM
# ==========================================

@app.get("/api/blogs")
def get_blogs():
    try:
        res = supabase.table("blogs").select("*").order("created_at", desc=True).execute()
        return res.data
    except APIError as e:
        print(f"SUPABASE ERROR (get_blogs): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/blogs", status_code=status.HTTP_201_CREATED)
def create_blog(blog: BlogCreate):
    try:
        res = supabase.table("blogs").insert(blog.model_dump()).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create blog post")
        return res.data[0]
    except APIError as e:
        print(f"SUPABASE ERROR (create_blog): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.delete("/api/blogs/{blog_id}")
def delete_blog(blog_id: str):
    try:
        res = supabase.table("blogs").delete().eq("id", blog_id).execute()
        return {"status": "success", "message": "Blog post deleted successfully"}
    except APIError as e:
        print(f"SUPABASE ERROR (delete_blog): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")


@app.post("/api/blogs/{blog_id}/like")
def toggle_blog_like(blog_id: str, payload: BlogLikeUpdate):
    try:
        # Fetch current blog post
        res = supabase.table("blogs").select("likes").eq("id", blog_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Blog post not found")

        current_likes = res.data[0].get("likes", 0)
        new_likes = current_likes + 1 if payload.action == "increment" else max(0, current_likes - 1)

        update_res = supabase.table("blogs").update({"likes": new_likes}).eq("id", blog_id).execute()
        return update_res.data[0]
    except APIError as e:
        print(f"SUPABASE ERROR (toggle_blog_like): {e.message}")
        raise HTTPException(status_code=400, detail=f"Database error: {e.message}")
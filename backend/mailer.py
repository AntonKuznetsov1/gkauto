import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "emailsystem95@gmail.com")
SMTP_PASS = os.getenv("SMTP_PASS", "abqj zpmc kgqt ogoe")
OWNER_EMAIL = os.getenv("OWNER_EMAIL", "gandkautodetailing1@gmail.com")


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Sends an HTML formatted email using native smtplib via Gmail SMTP."""
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"G&K Auto Detailing System <{SMTP_USER}>"
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach HTML content
        msg.attach(MIMEText(html_body, "html"))

        # Connect to SMTP Server with TLS security
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        print(f"Email successfully dispatched to: {to_email}")
        return True
    except Exception as e:
        print(f"Error dispatching email to {to_email}: {str(e)}")
        return False


def generate_new_booking_admin_email(booking_data: dict) -> str:
    """Formats an HTML notification email sent to the owner for new bookings."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; font-size: 15px; line-height: 1.6; }}
        .header {{ background-color: #70bae6; color: #ffffff; padding: 24px; text-align: center; }}
        .header h2 {{ margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; }}
        .body {{ padding: 24px; }}
        .detail-row {{ display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 10px 0; }}
        .label {{ font-weight: 600; color: #475569; }}
        .value {{ color: #0f172a; text-align: right; font-weight: 500; }}
        .message-box {{ background-color: #f1f5f9; padding: 12px; border-radius: 8px; margin-top: 15px; font-style: italic; border-left: 4px solid #70bae6; }}
        .footer {{ background-color: #0f172a; color: #94a3b8; padding: 16px; text-align: center; font-size: 13px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>New Booking Request</h2>
        </div>
        <div class="body">
          <p>A new service reservation has been placed on the website:</p>
          <div class="detail-row"><span class="label">Client Name:</span><span class="value">{booking_data.get('client_name')}</span></div>
          <div class="detail-row"><span class="label">Email:</span><span class="value">{booking_data.get('client_email')}</span></div>
          <div class="detail-row"><span class="label">Phone:</span><span class="value">{booking_data.get('client_phone')}</span></div>
          <div class="detail-row"><span class="label">Requested Service:</span><span class="value">{booking_data.get('service_title')}</span></div>
          <div class="detail-row"><span class="label">Date:</span><span class="value">{booking_data.get('booking_date')}</span></div>
          <div class="detail-row"><span class="label">Time Slot:</span><span class="value">{booking_data.get('time_slot')}</span></div>
          
          {f'<div class="message-box"><strong>Client Note:</strong> "{booking_data.get("message")}"</div>' if booking_data.get("message") else ''}
        </div>
        <div class="footer">
          G&K Auto Detailing & Stereo Services &bull; Calgary, AB
        </div>
      </div>
    </body>
    </html>
    """


def generate_client_outreach_email(client_name: str, status: str, custom_message: str) -> str:
    """Formats an HTML email sent to clients when status updates or custom messages are sent."""
    status_display = status.upper() if status else "UPDATE"
    header_color = "#70bae6" if status != "cancelled" else "#ef4444"

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; font-size: 15px; line-height: 1.6; }}
        .header {{ background-color: {header_color}; color: #ffffff; padding: 24px; text-align: center; }}
        .header h2 {{ margin: 0; font-size: 22px; letter-spacing: 0.5px; }}
        .body {{ padding: 24px; }}
        .msg-container {{ background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; white-space: pre-wrap; color: #1e293b; }}
        .footer {{ background-color: #0f172a; color: #94a3b8; padding: 16px; text-align: center; font-size: 13px; }}
        .contact {{ margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>G&K Auto Detailing & Stereo Services</h2>
        </div>
        <div class="body">
          <p>Hello <strong>{client_name}</strong>,</p>
          <p>We have an update regarding your booking request (Status: <strong>{status_display}</strong>):</p>
          
          <div class="msg-container">{custom_message}</div>

          <div class="contact">
            <strong>Contact Info:</strong><br/>
            Phone: (403) 293-8989<br/>
            Email: gandkautodetailing1@gmail.com<br/>
            Address: 125- 7 Westwinds Cres NE, Calgary, AB, Canada, T3J 5H2
          </div>
        </div>
        <div class="footer">
          Thank you for choosing G&K Auto Detailing & Stereo Services!
        </div>
      </div>
    </body>
    </html>
    """
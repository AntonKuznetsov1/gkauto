import axios from 'axios';

/**
 * Base URL Resolution:
 * Uses Vite environment variable `VITE_API_BASE_URL` in production (Render backend),
 * falling back to local FastAPI server on `http://localhost:8000`.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Centralized Axios Instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout limit
});

/**
 * Global Response Interceptor
 * Intercepts errors to provide clean, consistent error messages across UI components.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const serverMessage = error.response.data?.detail || error.response.data?.message;
      errorMessage = serverMessage || `Server Error (${error.response.status})`;
      console.warn(`[API Error ${error.response.status}]:`, serverMessage || error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'Unable to reach the server. Please check your network connection.';
      console.warn('[API Network Error]: No response received from backend.', error.request);
    } else {
      // Something happened setting up the request
      errorMessage = error.message;
      console.warn('[API Client Error]:', error.message);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

/* ==========================================================================
   1. HEALTH ENDPOINT
   ========================================================================== */

/**
 * Verifies backend operational status.
 * @returns {Promise<Object>} Server status response.
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

/* ==========================================================================
   2. SERVICES API (/api/services)
   ========================================================================== */

/**
 * Fetches all offered shop services.
 * @returns {Promise<Array>} Array of service items.
 */
export const getServices = async () => {
  const response = await apiClient.get('/api/services');
  return response.data;
};

/**
 * Adds a new service catalog entry.
 * @param {Object} serviceData - { title, description, price? }
 * @returns {Promise<Object>} Created service data.
 */
export const createService = async (serviceData) => {
  const response = await apiClient.post('/api/services', serviceData);
  return response.data;
};

/**
 * Updates an existing service catalog entry.
 * @param {string|number} serviceId - ID of service to edit.
 * @param {Object} serviceData - Updated service details.
 * @returns {Promise<Object>} Updated service data.
 */
export const updateService = async (serviceId, serviceData) => {
  const response = await apiClient.put(`/api/services/${serviceId}`, serviceData);
  return response.data;
};

/**
 * Deletes a service entry.
 * @param {string|number} serviceId - ID of service to remove.
 * @returns {Promise<Object>} Confirmation message or status.
 */
export const deleteService = async (serviceId) => {
  const response = await apiClient.delete(`/api/services/${serviceId}`);
  return response.data;
};

/* ==========================================================================
   3. BOOKINGS & AVAILABILITY API (/api/bookings, /api/availability)
   ========================================================================== */

/**
 * Retrieves available time slots for a specific date.
 * @param {string} dateString - Target date in YYYY-MM-DD format.
 * @returns {Promise<Object>} Available time slots data.
 */
export const getAvailability = async (dateString) => {
  const response = await apiClient.get('/api/availability', {
    params: { date: dateString },
  });
  return response.data;
};

/**
 * Submits customer booking request and triggers owner notification email.
 * @param {Object} bookingPayload - Customer and booking details.
 * @returns {Promise<Object>} Created booking result.
 */
export const createBooking = async (bookingPayload) => {
  const response = await apiClient.post('/api/bookings', bookingPayload);
  return response.data;
};

/**
 * Fetches all bookings for Admin Dashboard monitoring.
 * @returns {Promise<Array>} List of all bookings.
 */
export const getAllBookings = async () => {
  const response = await apiClient.get('/api/bookings');
  return response.data;
};

/**
 * Updates booking status (e.g., 'pending', 'confirmed', 'cancelled').
 * @param {string|number} bookingId - ID of booking to update.
 * @param {string} status - New status string.
 * @returns {Promise<Object>} Updated booking item.
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await apiClient.patch(`/api/bookings/${bookingId}/status`, { status });
  return response.data;
};

/**
 * Dispatches custom outreach email from shop owner to client via SMTP.
 * @param {string|number} bookingId - ID of booking target.
 * @param {string} message - Email body text.
 * @returns {Promise<Object>} Dispatch result status.
 */
export const sendClientOutreach = async (bookingId, message) => {
  const response = await apiClient.post(`/api/bookings/${bookingId}/reachout`, { message });
  return response.data;
};

/* ==========================================================================
   4. SCHEDULE & TIME SLOT API (/api/schedules)
   ========================================================================== */

/**
 * Fetches recurring slots, weekly days off, and date overrides.
 * @returns {Promise<Array>} Array of schedule rules.
 */
export const getSchedules = async () => {
  const response = await apiClient.get('/api/schedules');
  return response.data;
};

/**
 * Adds a new scheduling rule or time override.
 * @param {Object} scheduleData - Scheduling rule configuration.
 * @returns {Promise<Object>} Created schedule object.
 */
export const createSchedule = async (scheduleData) => {
  const response = await apiClient.post('/api/schedules', scheduleData);
  return response.data;
};

/**
 * Removes a scheduling rule.
 * @param {string|number} scheduleId - ID of schedule rule to remove.
 * @returns {Promise<Object>} Deletion result confirmation.
 */
export const deleteSchedule = async (scheduleId) => {
  const response = await apiClient.delete(`/api/schedules/${scheduleId}`);
  return response.data;
};

/* ==========================================================================
   5. BLOG POSTS API (/api/blogs)
   ========================================================================== */

/**
 * Fetches all blog posts sorted chronologically.
 * @returns {Promise<Array>} Array of blog post items.
 */
export const getBlogs = async () => {
  const response = await apiClient.get('/api/blogs');
  return response.data;
};

/**
 * Saves a new blog post.
 * @param {Object} blogPayload - { title, content, image_url }
 * @returns {Promise<Object>} Created blog post.
 */
export const createBlog = async (blogPayload) => {
  const response = await apiClient.post('/api/blogs', blogPayload);
  return response.data;
};

/**
 * Deletes a blog post.
 * @param {string|number} blogId - ID of blog post to delete.
 * @returns {Promise<Object>} Deletion status.
 */
export const deleteBlog = async (blogId) => {
  const response = await apiClient.delete(`/api/blogs/${blogId}`);
  return response.data;
};

/**
 * Increments or decrements a blog post's like count.
 * @param {string|number} blogId - ID of targeted blog post.
 * @param {'increment'|'decrement'} action - Action to perform.
 * @returns {Promise<Object>} Updated blog object with new like count.
 */
export const toggleBlogLike = async (blogId, action) => {
  const response = await apiClient.post(`/api/blogs/${blogId}/like`, { action });
  return response.data;
};

export default apiClient;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't clear if checking /auth/me on initial load
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Option to handle session expiration
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

// Profile endpoints
export const getStudentProfile = () => api.get('/profile');
export const updateStudentProfile = (data) => api.put('/profile', data);

// Scholarship endpoints
export const fetchScholarships = (params) => api.get('/scholarships', { params });
export const fetchScholarshipById = (id) => api.get(`/scholarships/${id}`);
export const fetchFilterOptions = () => api.get('/scholarships/meta/filters');
export const createScholarship = (data) => api.post('/scholarships', data);
export const updateScholarship = (id, data) => api.put(`/scholarships/${id}`, data);
export const deleteScholarship = (id) => api.delete(`/scholarships/${id}`);

// Recommendation endpoints
export const fetchRecommendations = () => api.get('/recommendations');
export const simulateRecommendation = (payload) => api.post('/recommendations/simulate', payload);

// Application endpoints
export const fetchUserApplications = (status) => api.get('/applications', { params: { status } });
export const toggleSaveScholarship = (scholarshipId) => api.post(`/applications/save/${scholarshipId}`);
export const submitApplication = (scholarshipId, notes) => api.post(`/applications/apply/${scholarshipId}`, { notes });
export const updateAppStatus = (id, data) => api.put(`/applications/${id}/status`, data);
export const fetchAdminApplications = (params) => api.get('/applications/admin/all', { params });

// Notification endpoints
export const fetchNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');

// Analytics endpoints
export const fetchAdminAnalytics = () => api.get('/analytics/admin');
export const fetchStudentAnalytics = () => api.get('/analytics/student');

export default api;

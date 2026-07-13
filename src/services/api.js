import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Configure standard API base URL from import.meta.env
 * Falls back to localhost:5000 in development.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds request timeout
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
/**
 * Automatically injects the JWT Authorization Bearer token into headers
 * of every outgoing backend request if a token is present in localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
/**
 * Processes responses globally.
 * - Handles 401 Unauthorized by purging tokens and forcing login redirection.
 * - Handles network/connection drops by alerting the user via toast.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if it is a network error (no response received from server)
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-error-toast', // prevent toast spamming
      });
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Unauthorized - Token has expired or is invalid
    if (status === 401) {
      const token = localStorage.getItem('crm-token');
      if (token) {
        localStorage.removeItem('crm-token');
        toast.error('Session expired. Please log in again.');
      }
      
      // Perform clean redirect to login page
      // Prevent infinite redirect loops if we are already on /login or /register
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

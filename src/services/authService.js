import api from './api.js';

/**
 * Authentication Service Client wrapper interfacing with auth backend endpoints.
 * All functions unwrap the Axios response, returning direct payload data.
 */
const authService = {
  /**
   * Registers a new user.
   * @param {string} name - User's full name.
   * @param {string} email - Unique email address.
   * @param {string} password - User password (min 6 characters).
   * @returns {Promise<Object>} Response payload containing user data and JWT token.
   */
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Authenticates user credentials.
   * @param {string} email - Registered email.
   * @param {string} password - User password.
   * @returns {Promise<Object>} Response payload containing user profile and JWT token.
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * De-authenticates user. Clears the local session token.
   * The backend authentication is stateless, so local token destruction suffices.
   */
  logout: () => {
    localStorage.removeItem('crm-token');
  },

  /**
   * Resolves the active user profile details.
   * @returns {Promise<Object>} Response payload containing user profile document.
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Updates name or password parameters on the active profile.
   * @param {Object} data - Update data containing { name, currentPassword, newPassword }.
   * @returns {Promise<Object>} Response payload containing the updated user document.
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },
};

export default authService;

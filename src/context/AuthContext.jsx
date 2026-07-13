import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext(null);

/**
 * Authentication state provider.
 * Manages user credentials, access tokens, and persistence across page reloads.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Restores user profile session if token exists in localStorage on startup.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          const profileResponse = await authService.getProfile();
          // Assuming structure { success: true, data: { id, name, email } } or direct user object
          // Let's handle both. Previously: successResponse returns { success: true, data: userObj }
          const userData = profileResponse.data || profileResponse;
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to initialize session from token:', error);
          // Purge corrupted/expired token session
          localStorage.removeItem('crm-token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Log in user using email and password credentials.
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // Response shape: { success: true, data: { user: {...}, token: "..." } }
      const payload = response.data || response;
      const { user: loggedInUser, token: accessToken } = payload;

      localStorage.setItem('crm-token', accessToken);
      setToken(accessToken);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Register a new user account.
   */
  const register = useCallback(async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      // Response shape: { success: true, data: { user: {...}, token: "..." } }
      const payload = response.data || response;
      const { user: registeredUser, token: accessToken } = payload;

      localStorage.setItem('crm-token', accessToken);
      setToken(accessToken);
      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Terminate user session and purge state details.
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsLoading(false);
    
    // Redirect cleanly
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume authentication details.
 * @returns {Object} User session parameters and registration/login functions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

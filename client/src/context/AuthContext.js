import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axios';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        try {
          const res = await axiosInstance.get('/api/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setAuthToken();
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data.msg || 'Authentication failed');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      // Load user after registration
      const userRes = await axiosInstance.get('/api/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log('Attempting login with:', formData);
      const res = await axiosInstance.post('/api/auth/login', formData);
      console.log('Login response:', res.data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        console.log('Token stored in localStorage');
        
        // Load user after login
        const userRes = await axiosInstance.get('/api/auth/me');
        console.log('User data:', userRes.data);
        setUser(userRes.data);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        console.error('No token received in login response');
        setError('Login failed - no token received');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await axiosInstance.put('/api/users/profile', formData);
      setUser(res.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Update failed');
      return false;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
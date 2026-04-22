// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
      
      // Auto-redirect based on role when page loads (only if on home)
      if (response.data.role === 'admin' && window.location.pathname === '/') {
        window.location.href = '/admin';
      } else if (response.data.role === 'tutor' && window.location.pathname === '/') {
        window.location.href = '/tutor-dashboard';
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    
    // Redirect based on role using window.location for reliability
    if (userData.role === 'admin') {
      window.location.href = '/admin';
    } else if (userData.role === 'tutor') {
      window.location.href = '/tutor-dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const register = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    
    // Redirect based on role using window.location for reliability
    if (userData.role === 'admin') {
      window.location.href = '/admin';
    } else if (userData.role === 'tutor') {
      window.location.href = '/tutor-dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const logout = () => {
    // 1. Clear token from storage
    localStorage.removeItem('token');
    
    // 2. Clear user state
    setUser(null);
    
    // 3. Clear StuG Bot chat history for this user
    const userId = user?._id || 'guest';
    localStorage.removeItem(`stugbot-chat-${userId}`);
    
    // 4. ✅ Redirect to home page using window.location (most reliable)
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
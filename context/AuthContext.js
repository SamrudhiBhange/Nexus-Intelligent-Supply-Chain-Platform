import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser, mockLogin, mockRegister, isBackendAvailable } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendAvailable, setBackendAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLoggedIn();
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const available = await isBackendAvailable();
      setBackendAvailable(available);
      console.log(`🔍 Backend status: ${available ? '✅ Available' : '❌ Unavailable'}`);
    } catch (err) {
      console.log('🔍 Backend check failed, using mock mode');
      setBackendAvailable(false);
    }
  };

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        // Try to get current user from API
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (apiError) {
          // If API fails, use stored user
          console.log('Using stored user data');
          setUser(JSON.parse(userStr));
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    
    try {
      let response;
      
      if (backendAvailable) {
        console.log('🔐 Attempting real login');
        response = await loginUser({ email, password });
      } else {
        console.log('🔄 Using mock login');
        response = await mockLogin({ email, password });
      }
      
      const { token, user: userData } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('✅ Login successful:', userData.email);
      
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError('');
    setLoading(true);
    
    try {
      console.log('📝 Registration process starting...');
      console.log('Backend available:', backendAvailable);
      
      let response;
      
      if (backendAvailable) {
        console.log('🔐 Attempting real registration');
        response = await registerUser(userData);
      } else {
        console.log('🔄 Using mock registration');
        response = await mockRegister(userData);
      }
      
      const { token, user: userDataResponse } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDataResponse));
      setUser(userDataResponse);
      
      console.log('✅ Registration successful:', userDataResponse.email);
      
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      console.error('❌ Registration error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  const forgotPassword = async (email) => {
    setError('');
    try {
      // Mock API call for forgot password
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            message: 'Password reset instructions sent to your email (mock)' 
          });
        }, 1000);
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset instructions';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const checkBackendAvailability = async () => {
    return await isBackendAvailable();
  };

  const value = {
    user,
    loading,
    error,
    backendAvailable,
    login,
    register,
    logout,
    forgotPassword,
    setError,
    checkBackendAvailability
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
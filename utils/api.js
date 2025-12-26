import axios from 'axios';

// Create axios instance with better configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Check if backend is available
export const isBackendAvailable = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.log('Backend not available, using mock API');
    return false;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    console.log('📤 Sending registration request:', { 
      ...userData, 
      password: '*******' 
    });
    
    const response = await api.post('/auth/register', userData);
    
    console.log('✅ Registration successful:', response.data);
    
    // Store token and user
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Registration API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log('🔑 Sending login request:', { 
      email: credentials.email, 
      password: '*********' 
    });
    
    const response = await api.post('/auth/login', credentials);
    
    console.log('✅ Login successful:', response.data);
    
    // Store token and user
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login API error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log('⚠️ Falling back to localStorage user');
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    throw new Error('No user session found');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.log('Logout API error (proceeding anyway):', error.message);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return { success: true, message: 'Logged out successfully' };
};

// Test API connection
export const testApi = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
};

// Mock APIs for testing (fallback when backend is not available)
export const mockRegister = (userData) => {
  console.log('🔄 Using mock registration for:', userData.email);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        company: userData.company,
        createdAt: new Date().toISOString(),
        role: 'user',
        demoMode: true
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
      
      console.log('✅ Mock registration successful');
      
      resolve({
        success: true,
        message: 'Registration successful (demo mode)',
        user: mockUser,
        token: 'mock-token-' + Date.now()
      });
    }, 1500);
  });
};

export const mockLogin = (credentials) => {
  console.log('🔄 Using mock login for:', credentials.email);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = {
        id: 1,
        name: credentials.email.includes('demo') ? 'Demo User' : 'Test User',
        email: credentials.email,
        company: 'Demo Company',
        role: 'admin',
        demoMode: true
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
      
      resolve({
        success: true,
        message: 'Login successful (demo mode)',
        user: mockUser,
        token: 'mock-token-' + Date.now()
      });
    }, 1500);
  });
};

// Export axios instance for direct use
export default api;
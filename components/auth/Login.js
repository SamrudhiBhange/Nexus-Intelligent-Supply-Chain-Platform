import React, { useState, useEffect } from 'react';
import { loginUser, testApi, isBackendAvailable } from '../../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginFailed(false);
    setDebugInfo('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('📤 Login attempt:', { email: formData.email });
      setDebugInfo(`Connecting to backend...`);
      
      // Prepare login data
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      // Use your API service
      const result = await loginUser(loginData);
      
      console.log('✅ Login successful:', result);
      setDebugInfo('✅ Login successful! Redirecting...');
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      setLoginFailed(true);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        if (error.response.status === 401) {
          setErrors({ general: errorData?.message || 'Invalid email or password' });
        } else if (error.response.status === 400) {
          setErrors({ general: errorData?.message || 'Bad request. Please check your input.' });
        } else {
          setErrors({ general: errorData?.message || `Server error (${error.response.status})` });
        }
      } else if (error.request) {
        // Network error
        setErrors({ 
          general: 'Cannot connect to server. Please check: 1) Backend is running, 2) CORS is configured, 3) Network connection'
        });
        setDebugInfo('Network error - using demo mode?');
      } else {
        // Other errors
        setErrors({ general: error.message || 'Login failed. Please try again.' });
      }
    }
  };

  const testApiConnection = async () => {
    setDebugInfo('Testing API connection...');
    try {
      const result = await testApi();
      setDebugInfo(`✅ API Test Successful: ${result.message}`);
      setBackendStatus('available');
    } catch (error) {
      setDebugInfo(`❌ API Test Failed: ${error.message}`);
      setBackendStatus('unavailable');
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@nexusscm.com',
      password: 'anypassword'
    });
    setErrors({});
    setDebugInfo('Demo credentials loaded. Use any password.');
  };

  const fillSampleCredentials = () => {
    setFormData({
      email: 'samrudhi@example.com',
      password: 'password123'
    });
    setErrors({});
  };

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isAvailable = await isBackendAvailable();
        setBackendStatus(isAvailable ? 'available' : 'unavailable');
        if (!isAvailable) {
          setDebugInfo('⚠️ Backend not detected. Using localStorage for demo.');
        }
      } catch (error) {
        setBackendStatus('unavailable');
        setDebugInfo('⚠️ Cannot reach backend. Using localStorage for demo.');
      }
    };
    
    checkBackend();
    
    // Load saved email if remember me was checked
    const savedEmail = localStorage.getItem('savedEmail');
    const remembered = localStorage.getItem('rememberMe');
    
    if (remembered === 'true' && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Welcome back to Nexus SCM</p>
          
          {/* Backend status indicator */}
          {/* <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            marginTop: '8px',
            fontSize: '12px',
            color: backendStatus === 'available' ? '#059669' : '#dc2626'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendStatus === 'available' ? '#10b981' : '#ef4444',
              animation: backendStatus === 'checking' ? 'pulse 1.5s infinite' : 'none'
            }} />
            {backendStatus === 'available' && 'Backend connected ✓'}
            {backendStatus === 'unavailable' && 'Backend not detected (demo mode)'}
            {backendStatus === 'checking' && 'Checking backend...'}
          </div> */}

          {/* Debug buttons */}
          {/* <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={testApiConnection}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test API
            </button>
            <button 
              onClick={fillDemoCredentials}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                background: '#e0f2fe',
                border: '1px solid #0ea5e9',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Demo User
            </button>
            <button 
              onClick={fillSampleCredentials}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                background: '#f0fdf4',
                border: '1px solid #22c55e',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sample User
            </button>
          </div>*/}
        </div> 

        {loginFailed && (
          <div className="error-message">
            <strong>Login failed.</strong>
            {errors.general && <div style={{ marginTop: '8px' }}>{errors.general}</div>}
            {errors.email && <div style={{ marginTop: '4px' }}>Email: {errors.email}</div>}
            {errors.password && <div style={{ marginTop: '4px' }}>Password: {errors.password}</div>}
            
            {debugInfo && (
              <div style={{ 
                marginTop: '10px', 
                fontSize: '12px', 
                backgroundColor: '#fef2f2',
                padding: '8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {debugInfo}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="demo@nexusscm.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '-7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '16px'
                }}
                disabled={isLoading}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
                disabled={isLoading}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
            style={{ 
              opacity: isLoading ? 0.7 : 1, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/register" className="auth-link">Create Account</a>
            </p>
            {/* <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Demo account: demo@nexusscm.com (any password works)
            </p> */}
            {backendStatus === 'unavailable' && (
              <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                ⚠️ Backend not detected - using localStorage demo mode
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
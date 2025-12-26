import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', // Backend expects 'name' not firstName+lastName
    email: '',
    password: '', // Add password field
    phone: '', // Optional for now
    company: '', // Backend expects 'company' not 'companyName'
    subscriptionPlan: 'Basic'
  });

  const [errors, setErrors] = useState({});
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

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

  const handleSubscriptionChange = (plan) => {
    setFormData({
      ...formData,
      subscriptionPlan: plan
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company Name is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationFailed(false);
    setRegistrationSuccess(false);
    setDebugInfo('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data EXACTLY as backend expects
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        company: formData.company.trim(),
        // Include subscription plan if backend supports it
        subscriptionPlan: formData.subscriptionPlan
      };
      
      console.log('📤 Sending registration data:', registrationData);
      setDebugInfo(`Endpoint: http://localhost:5000/api/auth/register`);
      
      // Use port 5000 from your backend
      const API_URL = 'http://localhost:5000';
      
      // Make API call
      const response = await axios.post(`${API_URL}/api/auth/register`, registrationData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Registration successful:', response.data);
      
      // Registration successful
      setRegistrationSuccess(true);
      setRegistrationFailed(false);
      
      // Store token if available
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        subscriptionPlan: 'Basic'
      });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setIsLoading(false);
      setRegistrationFailed(true);
      
      if (error.response) {
        // Server responded with error
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        // Handle specific errors
        if (error.response.status === 409) {
          setErrors({ email: 'Email already registered. Please use a different email or login.' });
        } else if (error.response.status === 400) {
          if (error.response.data.message) {
            setErrors({ general: error.response.data.message });
          }
        } else if (error.response.data && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        setErrors({ general: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000' });
      } else {
        // Other errors
        console.error('Error:', error.message);
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      setDebugInfo('Testing connection to http://localhost:5000...');
      const response = await axios.get('http://localhost:5000/api/test', {
        timeout: 5000
      });
      setDebugInfo(`✅ API Test Successful: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setDebugInfo(`❌ API Test Failed: ${error.message}\nMake sure backend is running on port 5000.`);
    }
  };

  // Quick fill with sample data for testing
  const fillSampleData = () => {
    setFormData({
      name: 'Samrudhi Bhange',
      email: 'samrudhi@example.com',
      password: 'password123',
      phone: '+918485812746',
      company: 'Deloitte',
      subscriptionPlan: 'Basic'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join SwiftLink Solutions to streamline your supply chain</p>
          
          {/* Debug buttons - remove in production */}
          {/* <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              onClick={testApiConnection}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test API
            </button> 
            <button 
              onClick={fillSampleData}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: '#e0f2fe',
                border: '1px solid #0ea5e9',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fill Sample
            </button>
          </div>*/}
        </div>

        {registrationFailed && !registrationSuccess && (
          <div className="error-message">
            <strong>Registration failed.</strong>
            {errors.general && <div style={{ marginTop: '8px' }}>{errors.general}</div>}
            {errors.email && <div style={{ marginTop: '4px' }}>Email: {errors.email}</div>}
            
            {/* Debug info */}
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

        {registrationSuccess && (
          <div className="success-message">
            <h3>🎉 Registration Successful!</h3>
            <p>Welcome to Nexus SCM!</p>
            <p>Redirecting to Login Page...</p>
          </div>
        )}

        {!registrationSuccess && (
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name (not first/last name) */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Demo User"
                disabled={isLoading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

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
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Phone Number (Optional) */}
            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="optional">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+91 8888877777"
                disabled={isLoading}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Company Name */}
            <div className="form-group">
              <label className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`form-input ${errors.company ? 'error' : ''}`}
                placeholder="Google LLC"
                disabled={isLoading}
              />
              {errors.company && <span className="error-text">{errors.company}</span>}
            </div>

            {/* Subscription Plan */}
            <div className="form-group">
              <label className="form-label">Subscription Plan</label>
              <div className="subscription-plans">
                <div 
                  className={`plan-card ${formData.subscriptionPlan === 'Basic' ? 'selected' : ''}`}
                  onClick={() => !isLoading && handleSubscriptionChange('Basic')}
                  style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                >
                  <div className="plan-header">
                    <input
                      type="radio"
                      name="subscriptionPlan"
                      checked={formData.subscriptionPlan === 'Basic'}
                      onChange={() => {}}
                      className="plan-radio"
                      disabled={isLoading}
                    />
                    <span className="plan-name">Basic</span>
                    <span className="plan-price">Rs.2600/month</span>
                  </div>
                  <div className="plan-features">
                    <div className="feature">
                      <span className="checkmark">✓</span>
                      <span>Up to 10 users</span>
                    </div>
                    <div className="feature">
                      <span className="checkmark">✓</span>
                      <span>Basic inventory</span>
                    </div>
                  </div>
                </div>

                <div 
                  className={`plan-card ${formData.subscriptionPlan === 'Professional' ? 'selected' : ''}`}
                  onClick={() => !isLoading && handleSubscriptionChange('Professional')}
                  style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                >
                  <div className="plan-header">
                    <input
                      type="radio"
                      name="subscriptionPlan"
                      checked={formData.subscriptionPlan === 'Professional'}
                      onChange={() => {}}
                      className="plan-radio"
                      disabled={isLoading}
                    />
                    <span className="plan-name">Professional</span>
                    <span className="plan-price">Rs.7000/month</span>
                  </div>
                  <div className="plan-features">
                    <div className="feature">
                      <span className="checkmark">✓</span>
                      <span>Up to 50 users</span>
                    </div>
                    <div className="feature">
                      <span className="checkmark">✓</span>
                      <span>Advanced analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account? <a href="/login" className="auth-link">Login</a>
              </p>
              {/* <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Demo account: demo@nexusscm.com / any password
              </p> */}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
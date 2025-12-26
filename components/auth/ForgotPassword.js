import React, { useState } from 'react';
import './Auth.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    // Here you would typically make an API call
    console.log('Forgot password request for:', formData.email);
    setIsSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: '' });
    }, 5000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <h3>Reset Link Sent!</h3>
            <p>We've sent password reset instructions to <strong>{formData.email}</strong>.</p>
            <p>Please check your email and follow the instructions.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="back-btn"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button type="submit" className="submit-btn">
              Send Reset Instructions
            </button>

            <div className="auth-footer">
              <p>
                Remember your password? <a href="/login" className="auth-link">Login</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
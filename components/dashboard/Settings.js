import React, { useState } from 'react';
import './Dashboard.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Nexus SCM',
      email: 'info@nexusscm.com',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      inventoryAlerts: true,
      supplierUpdates: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: '',
    },
    integrations: {
      quickbooks: false,
      shopify: true,
      xero: false,
      zapier: true,
    },
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-cog', color: '#3b82f6' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', color: '#f59e0b' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt', color: '#ef4444' },
    { id: 'integrations', label: 'Integrations', icon: 'fas fa-plug', color: '#8b5cf6' },
    { id: 'team', label: 'Team', icon: 'fas fa-users', color: '#10b981' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card', color: '#ec4899' },
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Singapore',
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@nexusscm.com', role: 'Administrator', status: 'active', avatarColor: '#3b82f6' },
    { id: 2, name: 'Jane Smith', email: 'jane@nexusscm.com', role: 'Manager', status: 'active', avatarColor: '#10b981' },
    { id: 3, name: 'Bob Johnson', email: 'bob@nexusscm.com', role: 'Viewer', status: 'pending', avatarColor: '#f59e0b' },
    { id: 4, name: 'Alice Brown', email: 'alice@nexusscm.com', role: 'Editor', status: 'active', avatarColor: '#ec4899' },
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, you would make an API call here
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      general: {
        companyName: 'Nexus SCM',
        email: 'info@nexusscm.com',
        phone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
      },
      notifications: {
        emailNotifications: true,
        orderNotifications: true,
        inventoryAlerts: true,
        supplierUpdates: true,
        marketingEmails: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        ipWhitelist: '',
      },
      integrations: {
        quickbooks: false,
        shopify: true,
        xero: false,
        zapier: true,
      },
    });
    alert('Settings reset to defaults!');
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
          <i className="fas fa-cog"></i>
        </div>
        <div>
          <h3>General Settings</h3>
          <p className="section-description">Configure your company information and system preferences</p>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="card-header">
          <h4>Company Information</h4>
          <p>Basic details about your organization</p>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>
                <i className="fas fa-building"></i>
                Company Name
              </label>
              <input
                type="text"
                value={settings.general.companyName}
                onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                placeholder="Enter company name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Contact Email
              </label>
              <input
                type="email"
                value={settings.general.email}
                onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                placeholder="Enter contact email"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.general.phone}
                onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                placeholder="Enter phone number"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="card-header">
          <h4>System Preferences</h4>
          <p>Configure system-wide settings</p>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>
                <i className="fas fa-globe"></i>
                Timezone
              </label>
              <div className="select-wrapper">
                <i className="fas fa-chevron-down"></i>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                  className="form-select"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-money-bill-wave"></i>
                Currency
              </label>
              <div className="select-wrapper">
                <i className="fas fa-chevron-down"></i>
                <select
                  value={settings.general.currency}
                  onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                  className="form-select"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <i className="far fa-calendar"></i>
                Date Format
              </label>
              <div className="date-format-options">
                {[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ].map(format => (
                  <button
                    key={format.value}
                    className={`format-option ${settings.general.dateFormat === format.value ? 'active' : ''}`}
                    onClick={() => handleInputChange('general', 'dateFormat', format.value)}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          <i className="fas fa-bell"></i>
        </div>
        <div>
          <h3>Notification Settings</h3>
          <p className="section-description">Configure how and when you receive notifications</p>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="card-header">
          <h4>Email Notifications</h4>
          <p>Manage your email notification preferences</p>
        </div>
        <div className="card-body">
          <div className="toggle-list">
            {Object.entries(settings.notifications).map(([key, value]) => {
              const labels = {
                emailNotifications: { title: 'Email Notifications', desc: 'Receive all email notifications' },
                orderNotifications: { title: 'Order Updates', desc: 'Get notified about new orders and status changes' },
                inventoryAlerts: { title: 'Inventory Alerts', desc: 'Receive low stock and out of stock alerts' },
                supplierUpdates: { title: 'Supplier Updates', desc: 'Get updates about supplier changes and deliveries' },
                marketingEmails: { title: 'Marketing Emails', desc: 'Receive promotional emails and newsletters' },
              };
              
              return (
                <div key={key} className="toggle-item">
                  <div className="toggle-info">
                    <h4>{labels[key]?.title || key}</h4>
                    <p>{labels[key]?.desc}</p>
                  </div>
                  <div className="toggle-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleToggle('notifications', key)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-status">
                      {value ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
          <i className="fas fa-shield-alt"></i>
        </div>
        <div>
          <h3>Security Settings</h3>
          <p className="section-description">Configure security preferences and access controls</p>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="card-header">
          <h4>Authentication & Access</h4>
          <p>Manage login security and access controls</p>
        </div>
        <div className="card-body">
          <div className="toggle-item">
            <div className="toggle-info">
              <div className="security-badge">
                <i className="fas fa-lock"></i>
                <span>Recommended</span>
              </div>
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={() => handleToggle('security', 'twoFactorAuth')}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-status">
                {settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="security-slider">
            <div className="slider-header">
              <h4>
                <i className="fas fa-clock"></i>
                Session Timeout
              </h4>
              <span className="slider-value">{settings.security.sessionTimeout} minutes</span>
            </div>
            <p>Automatically log out after inactivity</p>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="slider-input"
            />
            <div className="slider-labels">
              <span>5 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
          
          <div className="security-slider">
            <div className="slider-header">
              <h4>
                <i className="fas fa-key"></i>
                Password Expiry
              </h4>
              <span className="slider-value">{settings.security.passwordExpiry} days</span>
            </div>
            <p>Require password change every X days</p>
            <input
              type="range"
              min="30"
              max="365"
              step="30"
              value={settings.security.passwordExpiry}
              onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
              className="slider-input"
            />
            <div className="slider-labels">
              <span>30 days</span>
              <span>180 days</span>
              <span>365 days</span>
            </div>
          </div>
          
          <div className="security-input">
            <div className="input-header">
              <h4>
                <i className="fas fa-network-wired"></i>
                IP Whitelist
              </h4>
            </div>
            <p>Restrict access to specific IP addresses (comma-separated)</p>
            <textarea
              value={settings.security.ipWhitelist}
              onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
              placeholder="Example: 192.168.1.1, 10.0.0.1"
              rows={3}
              className="ip-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
          <i className="fas fa-users"></i>
        </div>
        <div>
          <h3>Team Management</h3>
          <p className="section-description">Manage team members and their permissions</p>
        </div>
        <button className="add-member-btn">
          <i className="fas fa-plus"></i>
          Add Team Member
        </button>
      </div>
      
      <div className="settings-card">
        <div className="card-header">
          <h4>Team Members</h4>
          <p>People who have access to this workspace</p>
        </div>
        <div className="card-body">
          <div className="team-list">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member">
                <div className="member-avatar" style={{ backgroundColor: member.avatarColor }}>
                  {member.name.charAt(0)}
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p>{member.email}</p>
                </div>
                <div className="member-role">
                  <span className="role-tag" style={{ 
                    backgroundColor: member.role === 'Administrator' ? '#dbeafe' : 
                                   member.role === 'Manager' ? '#dcfce7' : 
                                   member.role === 'Editor' ? '#fef3c7' : '#f3f4f6',
                    color: member.role === 'Administrator' ? '#1d4ed8' : 
                           member.role === 'Manager' ? '#059669' : 
                           member.role === 'Editor' ? '#d97706' : '#6b7280'
                  }}>
                    <i className={`fas fa-${member.role === 'Administrator' ? 'crown' : 
                                   member.role === 'Manager' ? 'user-tie' : 
                                   member.role === 'Editor' ? 'edit' : 'eye'}`}></i>
                    {member.role}
                  </span>
                </div>
                <div className="member-status">
                  <span className={`status-dot ${member.status}`}></span>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </div>
                <div className="member-actions">
                  <button className="icon-btn small">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="icon-btn small danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="card-header">
          <h4>Role Permissions</h4>
          <p>Understand what each role can do</p>
        </div>
        <div className="card-body">
          <div className="roles-grid">
            {[
              { role: 'Administrator', icon: 'crown', color: '#3b82f6', desc: 'Full access to all settings and data' },
              { role: 'Manager', icon: 'user-tie', color: '#10b981', desc: 'Can manage inventory, orders, and reports' },
              { role: 'Editor', icon: 'edit', color: '#f59e0b', desc: 'Can edit inventory and process orders' },
              { role: 'Viewer', icon: 'eye', color: '#6b7280', desc: 'Read-only access to dashboard and reports' },
            ].map(role => (
              <div key={role.role} className="role-card">
                <div className="role-icon" style={{ backgroundColor: role.color + '20', color: role.color }}>
                  <i className={`fas fa-${role.icon}`}></i>
                </div>
                <h5>{role.role}</h5>
                <p>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'team':
        return renderTeamSettings();
      default:
        return (
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
                <i className="fas fa-plug"></i>
              </div>
              <div>
                <h3>{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
                <p className="section-description">Coming soon! This section is currently under development.</p>
              </div>
            </div>
            <div className="settings-card">
              <div className="empty-state">
                <i className="fas fa-tools fa-3x"></i>
                <h4>Under Construction</h4>
                <p>This feature is being actively developed and will be available soon.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Settings ⚙️</h1>
          <p className="dashboard-subtitle">Configure your workspace preferences and team settings</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={handleReset}>
            <i className="fas fa-redo"></i>
            Reset to Defaults
          </button>
          <button className="primary-btn" onClick={handleSave}>
            <i className="fas fa-save"></i>
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Container */}
      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="sidebar-header">
            <h3>Settings Menu</h3>
            <p>Navigate between different settings</p>
          </div>
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  borderLeftColor: activeTab === tab.id ? tab.color : 'transparent',
                  backgroundColor: activeTab === tab.id ? tab.color + '10' : 'transparent'
                }}
              >
                <div className="nav-icon" style={{ 
                  backgroundColor: tab.color + '20',
                  color: tab.color 
                }}>
                  <i className={tab.icon}></i>
                </div>
                <div className="nav-content">
                  <span className="nav-label">{tab.label}</span>
                  <span className="nav-desc">Configure {tab.label.toLowerCase()} settings</span>
                </div>
                {activeTab === tab.id && (
                  <i className="fas fa-chevron-right nav-arrow" style={{ color: tab.color }}></i>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {renderActiveTab()}
          
          {/* Support Footer */}
          <div className="settings-footer">
            <div className="footer-card">
              <div className="footer-icon">
                <i className="fas fa-life-ring"></i>
              </div>
              <div className="footer-content">
                <h4>Need help with settings?</h4>
                <p>Our support team is here to help you configure your preferences</p>
              </div>
              <div className="footer-actions">
                <button className="help-btn">
                  <i className="fas fa-question-circle"></i>
                  Help Center
                </button>
                <button className="contact-btn">
                  <i className="fas fa-headset"></i>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
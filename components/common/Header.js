import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Common.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New order received #ORD-1234', time: '5 min ago', read: false },
    { id: 2, text: 'Inventory low for Product A', time: '1 hour ago', read: false },
    { id: 3, text: 'Supplier delivery confirmed', time: '2 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle">
          <i className="fas fa-bars"></i>
        </button>
        <div className="breadcrumb">
          <span>SwiftLink Solutions</span>
          <i className="fas fa-chevron-right"></i>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-btn" title="Search">
            <i className="fas fa-search"></i>
          </button>
          
          <div className="notifications-dropdown">
            <button 
              className="header-btn" 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              title="Notifications"
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="mark-read">Mark all as read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon">
                        <i className="fas fa-bell"></i>
                      </div>
                      <div className="notification-content">
                        <p>{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <Link to="/notifications">View all notifications</Link>
                </div>
              </div>
            )}
          </div>
          
          <button className="header-btn" title="Help">
            <i className="fas fa-question-circle"></i>
          </button>
        </div>

        <div className="user-profile">
          <button 
            className="profile-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="profile-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'User'}</span>
              <span className="profile-role">{user?.role || 'Admin'}</span>
            </div>
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {showProfileMenu && (
            <div className="dropdown-menu profile-menu">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4>{user?.name || 'User'}</h4>
                  <p>{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <div className="menu-items">
                <Link to="/profile" className="menu-item">
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </Link>
                <Link to="/settings" className="menu-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
                <Link to="/help" className="menu-item">
                  <i className="fas fa-life-ring"></i>
                  <span>Help & Support</span>
                </Link>
                <div className="menu-divider"></div>
                <button onClick={handleLogout} className="menu-item logout">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
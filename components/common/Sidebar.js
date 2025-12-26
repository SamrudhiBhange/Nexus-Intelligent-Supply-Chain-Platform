import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Common.css';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard', badge: null },
    { path: '/inventory', icon: 'fas fa-boxes', label: 'Inventory', badge: '3' },
    { path: '/suppliers', icon: 'fas fa-truck', label: 'Suppliers', badge: null },
    { path: '/orders', icon: 'fas fa-shopping-cart', label: 'Orders', badge: '12' },
    { path: '/analytics', icon: 'fas fa-chart-line', label: 'Analytics', badge: null },
    { path: '/reports', icon: 'fas fa-file-alt', label: 'Reports', badge: null },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings', badge: null },
  ];

  const secondaryItems = [
    { path: '/help', icon: 'fas fa-life-ring', label: 'Help Center' },
    { path: '/documentation', icon: 'fas fa-book', label: 'Documentation' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-link"></i>
          {!collapsed && <span>SwiftLink Solutions</span>}
        </div>
        <button 
          className="sidebar-collapse" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className={`nav-section-title ${collapsed ? 'collapsed' : ''}`}>
            {!collapsed && 'MAIN NAVIGATION'}
          </h3>
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
                  }
                  title={collapsed ? item.label : ''}
                >
                  <i className={item.icon}></i>
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className={`nav-section-title ${collapsed ? 'collapsed' : ''}`}>
            {!collapsed && 'SUPPORT'}
          </h3>
          <ul className="nav-menu">
            {secondaryItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
                  }
                  title={collapsed ? item.label : ''}
                >
                  <i className={item.icon}></i>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={`sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
        <div className="user-card">
          <div className="user-avatar">
            <span>SB</span>
          </div>
          {!collapsed && (
            <div className="user-info">
              <h4>Samrudhi Bhange</h4>
              <p>Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
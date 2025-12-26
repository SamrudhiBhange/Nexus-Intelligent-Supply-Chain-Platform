import React, { useState } from 'react';
import './Dashboard.css';

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tabs = [
    { id: 'all', label: 'All Suppliers', count: 24, icon: 'fas fa-users', color: '#6b7280', bg: '#f3f4f6' },
    { id: 'active', label: 'Active', count: 18, icon: 'fas fa-check-circle', color: '#10b981', bg: '#d1fae5' },
    { id: 'pending', label: 'Pending', count: 4, icon: 'fas fa-clock', color: '#f59e0b', bg: '#fef3c7' },
    { id: 'inactive', label: 'Inactive', count: 2, icon: 'fas fa-times-circle', color: '#ef4444', bg: '#fee2e2' },
  ];

  const suppliers = [
    {
      id: 1,
      name: 'Tech Supplies Inc',
      contact: 'John Smith',
      email: 'john@techsupplies.com',
      phone: '+1 (555) 123-4567',
      products: 'Electronics, Components',
      rating: 4.8,
      status: 'active',
      orders: 124,
      reliability: '98%',
      leadTime: '2-3 days',
      contract: 'Annual'
    },
    {
      id: 2,
      name: 'Office World Ltd',
      contact: 'Sarah Johnson',
      email: 'sarah@officeworld.com',
      phone: '+1 (555) 987-6543',
      products: 'Office Supplies, Furniture',
      rating: 4.5,
      status: 'active',
      orders: 89,
      reliability: '95%',
      leadTime: '3-5 days',
      contract: 'Quarterly'
    },
    {
      id: 3,
      name: 'Global Raw Materials',
      contact: 'Mike Chen',
      email: 'mike@globalraw.com',
      phone: '+1 (555) 456-7890',
      products: 'Raw Materials',
      rating: 4.2,
      status: 'pending',
      orders: 0,
      reliability: 'N/A',
      leadTime: 'Pending',
      contract: 'Negotiating'
    },
    {
      id: 4,
      name: 'Packaging Solutions',
      contact: 'Emma Wilson',
      email: 'emma@packaging.com',
      phone: '+1 (555) 789-0123',
      products: 'Packaging Materials',
      rating: 4.9,
      status: 'active',
      orders: 156,
      reliability: '99%',
      leadTime: '1-2 days',
      contract: 'Annual'
    },
    {
      id: 5,
      name: 'Electro Components',
      contact: 'David Lee',
      email: 'david@electro.com',
      phone: '+1 (555) 234-5678',
      products: 'Electronic Components',
      rating: 3.9,
      status: 'inactive',
      orders: 45,
      reliability: '87%',
      leadTime: '5-7 days',
      contract: 'None'
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesTab = activeTab === 'all' || supplier.status === activeTab;
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'inactive': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < Math.floor(rating) ? 'filled' : ''}`}
        style={{
          color: i < Math.floor(rating) ? '#f59e0b' : '#e5e7eb'
        }}
      ></i>
    ));
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Supplier Management 🤝</h1>
          <p className="dashboard-subtitle">Manage vendor relationships, track performance, and optimize your supply chain</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="fas fa-file-contract"></i>
            View Contracts
          </button>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Add New Supplier
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe' }}>
                <i className="fas fa-truck" style={{ color: '#0284c7' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                94%
              </span>
            </div>
            <h3 className="stat-value">94%</h3>
            <p className="stat-title">On-time Delivery</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7' }}>
                <i className="fas fa-star" style={{ color: '#16a34a' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                98%
              </span>
            </div>
            <h3 className="stat-value">4.7</h3>
            <p className="stat-title">Avg. Quality Rating</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
                <i className="fas fa-handshake" style={{ color: '#d97706' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +3
              </span>
            </div>
            <h3 className="stat-value">24</h3>
            <p className="stat-title">Active Suppliers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe' }}>
                <i className="fas fa-dollar-sign" style={{ color: '#7c3aed' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                12.5%
              </span>
            </div>
            <h3 className="stat-value">$245K</h3>
            <p className="stat-title">Total Spend</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Supplier Directory</h3>
            <p className="card-subtitle">{filteredSuppliers.length} suppliers found</p>
          </div>
          <div className="filter-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search suppliers, contacts, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <select className="sort-select">
              <option>Sort by: Rating</option>
              <option>Sort by: Name</option>
              <option>Sort by: Orders</option>
              <option>Sort by: Reliability</option>
            </select>
            <button className="filter-btn">
              <i className="fas fa-sliders-h"></i>
              More Filters
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="category-filters">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`category-filter-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                borderColor: activeTab === tab.id ? tab.color : 'transparent',
                color: activeTab === tab.id ? tab.color : '#6b7280'
              }}
            >
              <i className={tab.icon}></i>
              {tab.label}
              <span className="filter-count" style={{ 
                backgroundColor: tab.bg,
                color: tab.color
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="card-body">
          {filteredSuppliers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search fa-3x"></i>
              <h4>No suppliers found</h4>
              <p>Try adjusting your search or filter criteria</p>
              <button className="secondary-btn" onClick={() => { setSearchTerm(''); setActiveTab('all'); }}>
                <i className="fas fa-redo"></i>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="suppliers-table-container">
              <div className="table-header">
                <div className="table-col">Supplier</div>
                <div className="table-col">Contact</div>
                <div className="table-col">Products</div>
                <div className="table-col">Rating</div>
                <div className="table-col">Performance</div>
                <div className="table-col">Status</div>
                <div className="table-col">Actions</div>
              </div>
              
              <div className="table-body">
                {filteredSuppliers.map(supplier => (
                  <div key={supplier.id} className="table-row">
                    <div className="table-col">
                      <div className="supplier-cell">
                        <div className="supplier-avatar" style={{ 
                          backgroundColor: supplier.status === 'active' ? '#10b98120' : 
                                         supplier.status === 'pending' ? '#f59e0b20' : '#ef444420',
                          color: getStatusColor(supplier.status)
                        }}>
                          {supplier.name.charAt(0)}
                        </div>
                        <div className="supplier-info">
                          <h4 className="supplier-name">{supplier.name}</h4>
                          <p className="supplier-id">ID: SUP-{supplier.id.toString().padStart(4, '0')}</p>
                          <div className="supplier-meta">
                            <span className="meta-item">
                              <i className="fas fa-clock"></i>
                              {supplier.leadTime}
                            </span>
                            <span className="meta-item">
                              <i className="fas fa-file-contract"></i>
                              {supplier.contract}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="contact-cell">
                        <h4 className="contact-name">{supplier.contact}</h4>
                        <div className="contact-details">
                          <p>
                            <i className="fas fa-envelope"></i>
                            {supplier.email}
                          </p>
                          <p>
                            <i className="fas fa-phone"></i>
                            {supplier.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="products-cell">
                        <span className="products-tag">
                          <i className="fas fa-tag"></i>
                          {supplier.products}
                        </span>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="rating-cell">
                        <div className="stars">
                          {renderStars(supplier.rating)}
                        </div>
                        <div className="rating-value">
                          <span className="value">{supplier.rating}</span>
                          <span className="total">/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="performance-cell">
                        <div className="performance-metric">
                          <div className="metric-header">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Orders</span>
                          </div>
                          <span className="metric-value">{supplier.orders}</span>
                        </div>
                        <div className="performance-metric">
                          <div className="metric-header">
                            <i className="fas fa-chart-line"></i>
                            <span>Reliability</span>
                          </div>
                          <span className="metric-value" style={{ 
                            color: supplier.reliability === 'N/A' ? '#6b7280' : 
                                   parseFloat(supplier.reliability) > 95 ? '#10b981' : 
                                   parseFloat(supplier.reliability) > 90 ? '#f59e0b' : '#ef4444'
                          }}>
                            {supplier.reliability}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <span 
                        className="status-tag"
                        style={{ 
                          backgroundColor: getStatusBg(supplier.status),
                          color: getStatusColor(supplier.status)
                        }}
                      >
                        <i className={`fas fa-${supplier.status === 'active' ? 'check-circle' : 
                                         supplier.status === 'pending' ? 'clock' : 'times-circle'}`}></i>
                        {supplier.status === 'active' ? 'Active' : 
                         supplier.status === 'pending' ? 'Pending' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="table-col">
                      <div className="action-cell">
                        <button className="action-btn" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn" title="Edit Supplier">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn" title="Send Message">
                          <i className="fas fa-comment"></i>
                        </button>
                        <button className="action-btn primary" title="Create Order">
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="pagination">
            <button className="pagination-btn">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="pagination-page">Page 1 of 3</span>
            <button className="pagination-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="results-count">
              Showing {filteredSuppliers.length} of {suppliers.length} suppliers
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Quick Supplier Actions</h3>
          <p className="section-subtitle">Common supplier management operations</p>
        </div>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-file-invoice"></i>
            </div>
            <h4>Create Purchase Order</h4>
            <p>Generate new purchase order</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <h4>Performance Report</h4>
            <p>Generate supplier analytics</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="fas fa-bell"></i>
            </div>
            <h4>Set Alerts</h4>
            <p>Configure delivery alerts</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-exchange-alt"></i>
            </div>
            <h4>Compare Suppliers</h4>
            <p>Compare vendor performance</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
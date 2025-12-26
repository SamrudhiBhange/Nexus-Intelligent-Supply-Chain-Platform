import React, { useState } from 'react';
import './Dashboard.css';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const statusOptions = [
    { id: 'all', label: 'All Orders', count: 1248, icon: 'fas fa-shopping-cart', color: '#6b7280', bg: '#f3f4f6' },
    { id: 'pending', label: 'Pending', count: 24, icon: 'fas fa-clock', color: '#f59e0b', bg: '#fef3c7' },
    { id: 'processing', label: 'Processing', count: 18, icon: 'fas fa-cog', color: '#3b82f6', bg: '#dbeafe' },
    { id: 'shipped', label: 'Shipped', count: 156, icon: 'fas fa-shipping-fast', color: '#8b5cf6', bg: '#ede9fe' },
    { id: 'delivered', label: 'Delivered', count: 1024, icon: 'fas fa-check-circle', color: '#10b981', bg: '#d1fae5' },
    { id: 'cancelled', label: 'Cancelled', count: 26, icon: 'fas fa-times-circle', color: '#ef4444', bg: '#fee2e2' },
  ];

  const orders = [
    {
      id: 'ORD-1234',
      customer: 'Acme Corporation',
      date: '2024-01-15',
      amount: '$2,450.00',
      items: 5,
      status: 'delivered',
      priority: 'normal',
      payment: 'paid'
    },
    {
      id: 'ORD-1235',
      customer: 'Globex Inc',
      date: '2024-01-15',
      amount: '$1,850.50',
      items: 3,
      status: 'processing',
      priority: 'high',
      payment: 'pending'
    },
    {
      id: 'ORD-1236',
      customer: 'Soylent Corp',
      date: '2024-01-14',
      amount: '$3,200.00',
      items: 8,
      status: 'shipped',
      priority: 'normal',
      payment: 'paid'
    },
    {
      id: 'ORD-1237',
      customer: 'Initech',
      date: '2024-01-14',
      amount: '$950.75',
      items: 2,
      status: 'pending',
      priority: 'normal',
      payment: 'pending'
    },
    {
      id: 'ORD-1238',
      customer: 'Umbrella Corp',
      date: '2024-01-13',
      amount: '$4,500.00',
      items: 12,
      status: 'delivered',
      priority: 'high',
      payment: 'paid'
    },
    {
      id: 'ORD-1239',
      customer: 'Stark Industries',
      date: '2024-01-13',
      amount: '$1,250.00',
      items: 4,
      status: 'cancelled',
      priority: 'normal',
      payment: 'refunded'
    },
    {
      id: 'ORD-1240',
      customer: 'Wayne Enterprises',
      date: '2024-01-12',
      amount: '$3,750.00',
      items: 7,
      status: 'shipped',
      priority: 'high',
      payment: 'paid'
    },
  ];

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option?.color || '#6b7280';
  };

  const getStatusBg = (status) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option?.bg || '#f3f4f6';
  };

  const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option?.icon || 'fas fa-shopping-cart';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getPriorityBg = (priority) => {
    switch(priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      default: return '#d1fae5';
    }
  };

  const getPaymentColor = (payment) => {
    switch(payment) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'refunded': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentBg = (payment) => {
    switch(payment) {
      case 'paid': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'refunded': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Order Management 📋</h1>
          <p className="dashboard-subtitle">Track, manage, and fulfill customer orders efficiently</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="fas fa-download"></i>
            Export Orders
          </button>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Create New Order
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="stats-grid">
        {statusOptions.map(option => (
          <div 
            key={option.id}
            className={`stat-card ${statusFilter === option.id ? 'active' : ''}`}
            onClick={() => setStatusFilter(option.id)}
            style={{ 
              border: statusFilter === option.id ? `2px solid ${option.color}` : '1px solid #f3f4f6',
              cursor: 'pointer'
            }}
          >
            <div className="stat-card-content">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{ 
                  backgroundColor: option.bg,
                  color: option.color
                }}>
                  <i className={option.icon}></i>
                </div>
                <div className="stat-trend-indicator">
                  <span className="trend-dot" style={{ backgroundColor: option.color }}></span>
                  <span className="trend-text" style={{ color: option.color }}>
                    {option.id === 'delivered' ? '+12.5%' : option.id === 'cancelled' ? '-2.3%' : '+5.4%'}
                  </span>
                </div>
              </div>
              <h3 className="stat-value">{option.count.toLocaleString()}</h3>
              <p className="stat-title">{option.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Summary Card */}
      <div className="dashboard-card revenue-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Revenue Overview</h3>
            <p className="card-subtitle">Last 30 days performance</p>
          </div>
          <div className="time-filters">
            <button className="time-filter active">30 Days</button>
            <button className="time-filter">90 Days</button>
            <button className="time-filter">1 Year</button>
          </div>
        </div>
        <div className="card-body">
          <div className="revenue-metrics">
            <div className="revenue-metric">
              <div className="metric-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="metric-content">
                <h4 className="metric-value">$45,289</h4>
                <p className="metric-label">Total Revenue</p>
                <span className="metric-change positive">
                  <i className="fas fa-arrow-up"></i>
                  12.5%
                </span>
              </div>
            </div>
            
            <div className="revenue-metric">
              <div className="metric-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
                <i className="fas fa-calendar"></i>
              </div>
              <div className="metric-content">
                <h4 className="metric-value">$12,450</h4>
                <p className="metric-label">This Month</p>
                <span className="metric-change positive">
                  <i className="fas fa-arrow-up"></i>
                  8.2%
                </span>
              </div>
            </div>
            
            <div className="revenue-metric">
              <div className="metric-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="metric-content">
                <h4 className="metric-value">$372</h4>
                <p className="metric-label">Avg. Order Value</p>
                <span className="metric-change positive">
                  <i className="fas fa-arrow-up"></i>
                  4.7%
                </span>
              </div>
            </div>
            
            <div className="revenue-metric">
              <div className="metric-icon" style={{ backgroundColor: '#ede9fe', color: '#8b5cf6' }}>
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="metric-content">
                <h4 className="metric-value">1,248</h4>
                <p className="metric-label">Total Orders</p>
                <span className="metric-change positive">
                  <i className="fas fa-arrow-up"></i>
                  15.3%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Orders</h3>
            <p className="card-subtitle">{filteredOrders.length} orders found</p>
          </div>
          <div className="filter-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search orders, customers, or IDs..." />
            </div>
            <select className="sort-select">
              <option>Sort: Newest First</option>
              <option>Sort: Oldest First</option>
              <option>Sort: Amount High-Low</option>
              <option>Sort: Amount Low-High</option>
            </select>
            <button className="filter-btn">
              <i className="fas fa-sliders-h"></i>
              More Filters
            </button>
          </div>
        </div>

        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search fa-3x"></i>
              <h4>No orders found</h4>
              <p>Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="orders-table-container">
              <div className="table-header">
                <div className="table-col select-col">
                  <input type="checkbox" />
                </div>
                <div className="table-col">Order ID</div>
                <div className="table-col">Customer</div>
                <div className="table-col">Date</div>
                <div className="table-col">Amount</div>
                <div className="table-col">Status</div>
                <div className="table-col">Priority</div>
                <div className="table-col">Payment</div>
                <div className="table-col">Actions</div>
              </div>
              
              <div className="table-body">
                {filteredOrders.map(order => (
                  <div key={order.id} className="table-row">
                    <div className="table-col select-col">
                      <input type="checkbox" />
                    </div>
                    
                    <div className="table-col">
                      <div className="order-id-cell">
                        <i className="fas fa-hashtag"></i>
                        <strong>{order.id}</strong>
                        <span className="items-count">{order.items} items</span>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <h4 className="customer-name">{order.customer}</h4>
                          <p className="customer-view">View details</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="date-cell">
                        <i className="far fa-calendar"></i>
                        {order.date}
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <div className="amount-cell">
                        <i className="fas fa-dollar-sign"></i>
                        <strong>{order.amount}</strong>
                      </div>
                    </div>
                    
                    <div className="table-col">
                      <span 
                        className="status-tag"
                        style={{ 
                          backgroundColor: getStatusBg(order.status),
                          color: getStatusColor(order.status)
                        }}
                      >
                        <i className={getStatusIcon(order.status)}></i>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="table-col">
                      <span 
                        className="priority-tag"
                        style={{ 
                          backgroundColor: getPriorityBg(order.priority),
                          color: getPriorityColor(order.priority)
                        }}
                      >
                        <i className={`fas fa-${order.priority === 'high' ? 'exclamation' : 'check'}`}></i>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </span>
                    </div>
                    
                    <div className="table-col">
                      <span 
                        className="payment-tag"
                        style={{ 
                          backgroundColor: getPaymentBg(order.payment),
                          color: getPaymentColor(order.payment)
                        }}
                      >
                        <i className={`fas fa-${order.payment === 'paid' ? 'check-circle' : 'clock'}`}></i>
                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      </span>
                    </div>
                    
                    <div className="table-col">
                      <div className="action-cell">
                        <button className="action-btn" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn" title="Edit Order">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn" title="Print Invoice">
                          <i className="fas fa-print"></i>
                        </button>
                        <div className="dropdown">
                          <button className="action-btn more-btn">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="bulk-actions">
            <div className="selected-count">
              <input type="checkbox" />
              <span>0 orders selected</span>
            </div>
            <div className="bulk-action-buttons">
              <button className="bulk-action-btn">
                <i className="fas fa-check"></i>
                Mark as Processed
              </button>
              <button className="bulk-action-btn">
                <i className="fas fa-truck"></i>
                Update Shipping
              </button>
              <button className="bulk-action-btn">
                <i className="fas fa-file-invoice"></i>
                Generate Invoices
              </button>
              <button className="bulk-action-btn danger">
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
          
          <div className="pagination">
            <button className="pagination-btn">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="pagination-page">Page 1 of 3</span>
            <button className="pagination-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="results-count">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Quick Order Actions</h3>
          <p className="section-subtitle">Frequently used order operations</p>
        </div>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-bolt"></i>
            </div>
            <h4>Quick Order</h4>
            <p>Fast order creation</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-exchange-alt"></i>
            </div>
            <h4>Bulk Update</h4>
            <p>Update multiple orders</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="fas fa-undo"></i>
            </div>
            <h4>Returns</h4>
            <p>Process returns & refunds</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h4>Analytics</h4>
            <p>Order performance insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
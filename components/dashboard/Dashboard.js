import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Total Orders', value: '1,248', change: '+12.5%', icon: 'fas fa-shopping-cart', color: '#3b82f6' },
    { title: 'Inventory Value', value: '$45,289', change: '+8.2%', icon: 'fas fa-boxes', color: '#10b981' },
    { title: 'Active Suppliers', value: '48', change: '+3', icon: 'fas fa-truck', color: '#f59e0b' },
    { title: 'Pending Orders', value: '24', change: '-4', icon: 'fas fa-clock', color: '#ef4444' },
  ];

  const recentOrders = [
    { id: 'ORD-1234', customer: 'Acme Corp', date: '2024-01-15', amount: '$2,500', status: 'delivered' },
    { id: 'ORD-1235', customer: 'Globex Inc', date: '2024-01-14', amount: '$1,850', status: 'processing' },
    { id: 'ORD-1236', customer: 'Soylent Corp', date: '2024-01-14', amount: '$3,200', status: 'shipped' },
    { id: 'ORD-1237', customer: 'Initech', date: '2024-01-13', amount: '$950', status: 'pending' },
    { id: 'ORD-1238', customer: 'Umbrella Corp', date: '2024-01-12', amount: '$4,500', status: 'delivered' },
  ];

  const lowStockItems = [
    { product: 'Laptop Pro M1', sku: 'LP-M1-2023', stock: 5, threshold: 10 },
    { product: 'Wireless Mouse X', sku: 'WM-X-2023', stock: 8, threshold: 15 },
    { product: 'USB-C Hub', sku: 'UCH-2023', stock: 3, threshold: 10 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back! 👋</h1>
          <p className="dashboard-subtitle">Here's what's happening with your supply chain today.</p>
        </div>
        <div className="header-actions">
          <div className="date-range-picker">
            <i className="fas fa-calendar-alt"></i>
            <span>Last 30 days</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <button className="download-report-btn">
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color + '20' }}>
                  <i className={stat.icon} style={{ color: stat.color }}></i>
                </div>
                <span className={`stat-change-badge ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  <i className={`fas fa-${stat.change.startsWith('+') ? 'arrow-up' : 'arrow-down'}`}></i>
                  {stat.change}
                </span>
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <div className="stat-trend">
                <div className="trend-line" style={{ 
                  background: stat.change.startsWith('+') 
                    ? 'linear-gradient(90deg, #10b981, #10b98180)' 
                    : 'linear-gradient(90deg, #ef4444, #ef444480)'
                }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Recent Orders Card */}
        <div className="content-left">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Recent Orders</h3>
                <p className="card-subtitle">Latest transactions and shipments</p>
              </div>
              <button className="card-action-btn">
                <i className="fas fa-arrow-right"></i>
                View All
              </button>
            </div>
            <div className="card-body">
              <div className="orders-table">
                <div className="table-header">
                  <div className="table-col">Order ID</div>
                  <div className="table-col">Customer</div>
                  <div className="table-col">Date</div>
                  <div className="table-col">Amount</div>
                  <div className="table-col">Status</div>
                </div>
                <div className="table-body">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="table-row">
                      <div className="table-col order-id">
                        <i className="fas fa-hashtag"></i>
                        {order.id}
                      </div>
                      <div className="table-col customer">
                        <div className="customer-avatar">
                          {order.customer.charAt(0)}
                        </div>
                        {order.customer}
                      </div>
                      <div className="table-col date">
                        <i className="far fa-calendar"></i>
                        {order.date}
                      </div>
                      <div className="table-col amount">
                        <i className="fas fa-dollar-sign"></i>
                        {order.amount}
                      </div>
                      <div className="table-col">
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(order.status) + '15',
                            color: getStatusColor(order.status),
                            border: `1px solid ${getStatusColor(order.status)}30`
                          }}
                        >
                          <i className={`fas fa-${order.status === 'delivered' ? 'check-circle' : 
                            order.status === 'processing' ? 'cog' : 
                            order.status === 'shipped' ? 'shipping-fast' : 'clock'}`}></i>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="content-right">
          <div className="dashboard-card alert-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Low Stock Alerts</h3>
                <p className="card-subtitle">Items that need attention</p>
              </div>
              <button className="card-action-btn danger">
                <i className="fas fa-exclamation-circle"></i>
                Reorder All
              </button>
            </div>
            <div className="card-body">
              <div className="stock-list">
                {lowStockItems.map(item => (
                  <div key={item.sku} className="stock-item">
                    <div className="stock-item-header">
                      <div className="stock-product-info">
                        <div className="product-avatar">
                          <i className="fas fa-box"></i>
                        </div>
                        <div>
                          <h4 className="product-name">{item.product}</h4>
                          <p className="product-sku">SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="stock-indicator">
                        <span className={`stock-level-tag ${item.stock < 5 ? 'critical' : 'warning'}`}>
                          <i className="fas fa-exclamation-triangle"></i>
                          {item.stock < 5 ? 'Critical' : 'Low'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="stock-progress">
                      <div className="progress-info">
                        <span className="current-stock">{item.stock} units</span>
                        <span className="threshold-stock">Min: {item.threshold}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${(item.stock / item.threshold) * 100}%`,
                            backgroundColor: item.stock < item.threshold * 0.3 ? '#ef4444' : 
                                          item.stock < item.threshold * 0.6 ? '#f59e0b' : '#10b981'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="stock-actions">
                      <button className="reorder-btn">
                        <i className="fas fa-sync-alt"></i>
                        Reorder Now
                      </button>
                      <button className="view-details-btn">
                        <i className="fas fa-eye"></i>
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Quick Actions</h3>
          <p className="section-subtitle">Frequently used operations</p>
        </div>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <i className="fas fa-plus"></i>
            </div>
            <h4>Create Order</h4>
            <p>Start a new purchase order</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-box"></i>
            </div>
            <h4>Add Inventory</h4>
            <p>Update stock levels</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-file-invoice"></i>
            </div>
            <h4>Generate Report</h4>
            <p>Create detailed reports</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h4>View Analytics</h4>
            <p>Business insights</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-truck"></i>
            </div>
            <h4>Manage Suppliers</h4>
            <p>Vendor information</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
              <i className="fas fa-cog"></i>
            </div>
            <h4>Settings</h4>
            <p>System configuration</p>
          </button>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="inventory-summary">
        <div className="section-header">
          <h3 className="section-title">Inventory Overview</h3>
          <p className="section-subtitle">Stock status at a glance</p>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon-wrapper" style={{ background: '#e0f2fe' }}>
              <i className="fas fa-boxes" style={{ color: '#0284c7' }}></i>
            </div>
            <div className="summary-content">
              <h4>Total Products</h4>
              <p className="summary-value">124</p>
              <div className="summary-trend">
                <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                <span className="trend-text">+12 this month</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon-wrapper" style={{ background: '#dcfce7' }}>
              <i className="fas fa-check-circle" style={{ color: '#16a34a' }}></i>
            </div>
            <div className="summary-content">
              <h4>In Stock</h4>
              <p className="summary-value">98</p>
              <div className="summary-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '79%', backgroundColor: '#10b981' }}></div>
                </div>
                <span className="progress-text">79% of total</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon-wrapper" style={{ background: '#fef3c7' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#d97706' }}></i>
            </div>
            <div className="summary-content">
              <h4>Low Stock</h4>
              <p className="summary-value">12</p>
              <div className="summary-trend">
                <i className="fas fa-exclamation" style={{ color: '#f59e0b' }}></i>
                <span className="trend-text warning">Needs attention</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon-wrapper" style={{ background: '#fee2e2' }}>
              <i className="fas fa-times-circle" style={{ color: '#dc2626' }}></i>
            </div>
            <div className="summary-content">
              <h4>Out of Stock</h4>
              <p className="summary-value">14</p>
              <div className="summary-trend">
                <i className="fas fa-clock" style={{ color: '#ef4444' }}></i>
                <span className="trend-text danger">Requires reorder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
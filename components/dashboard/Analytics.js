import React, { useState } from 'react';
import './Dashboard.css';

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  const [activeChart, setActiveChart] = useState('revenue');

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$245,289', 
      change: '+12.5%', 
      target: '$250,000',
      icon: 'fas fa-dollar-sign',
      color: '#10b981',
      trend: 'up'
    },
    { 
      title: 'Average Order Value', 
      value: '$245', 
      change: '+8.2%', 
      target: '$250',
      icon: 'fas fa-shopping-cart',
      color: '#3b82f6',
      trend: 'up'
    },
    { 
      title: 'Customer Retention', 
      value: '89.5%', 
      change: '+3.1%', 
      target: '90%',
      icon: 'fas fa-users',
      color: '#8b5cf6',
      trend: 'up'
    },
    { 
      title: 'Inventory Turnover', 
      value: '4.2x', 
      change: '+0.5x', 
      target: '4.5x',
      icon: 'fas fa-rotate',
      color: '#f59e0b',
      trend: 'up'
    },
  ];

  const topProducts = [
    { 
      name: 'Laptop Pro M1', 
      revenue: '$45,200', 
      units: 34, 
      growth: '+25%',
      category: 'Electronics',
      trend: 'up'
    },
    { 
      name: 'Office Chair Pro', 
      revenue: '$28,500', 
      units: 95, 
      growth: '+18%',
      category: 'Furniture',
      trend: 'up'
    },
    { 
      name: 'Wireless Mouse X', 
      revenue: '$12,300', 
      units: 246, 
      growth: '+32%',
      category: 'Electronics',
      trend: 'up'
    },
    { 
      name: 'Monitor 27" 4K', 
      revenue: '$38,700', 
      units: 45, 
      growth: '+15%',
      category: 'Electronics',
      trend: 'up'
    },
  ];

  const performanceMetrics = [
    { 
      label: 'Order Fulfillment Rate', 
      value: '98.5%', 
      status: 'excellent',
      icon: 'fas fa-check-circle',
      target: '98%'
    },
    { 
      label: 'On-time Delivery', 
      value: '96.2%', 
      status: 'good',
      icon: 'fas fa-truck',
      target: '95%'
    },
    { 
      label: 'Return Rate', 
      value: '2.8%', 
      status: 'good',
      icon: 'fas fa-undo',
      target: '3%'
    },
    { 
      label: 'Customer Satisfaction', 
      value: '4.8/5', 
      status: 'excellent',
      icon: 'fas fa-star',
      target: '4.5'
    },
  ];

  const chartOptions = [
    { id: 'revenue', label: 'Revenue', icon: 'fas fa-chart-line' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart' },
    { id: 'inventory', label: 'Inventory', icon: 'fas fa-boxes' },
    { id: 'customers', label: 'Customers', icon: 'fas fa-users' },
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Analytics Dashboard 📊</h1>
          <p className="dashboard-subtitle">Gain insights into your business performance and trends</p>
        </div>
        <div className="header-actions">
          <div className="date-selector">
            <button 
              className={`date-btn ${period === 'week' ? 'active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              7D
            </button>
            <button 
              className={`date-btn ${period === 'month' ? 'active' : ''}`}
              onClick={() => setPeriod('month')}
            >
              1M
            </button>
            <button 
              className={`date-btn ${period === 'quarter' ? 'active' : ''}`}
              onClick={() => setPeriod('quarter')}
            >
              3M
            </button>
            <button 
              className={`date-btn ${period === 'year' ? 'active' : ''}`}
              onClick={() => setPeriod('year')}
            >
              1Y
            </button>
          </div>
          <button className="primary-btn">
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color + '20' }}>
                  <i className={stat.icon} style={{ color: stat.color }}></i>
                </div>
                <div className="stat-target">
                  <span>Target: {stat.target}</span>
                </div>
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <div className="stat-trend">
                <div className="trend-info">
                  <span className={`trend-badge ${stat.trend}`}>
                    <i className={`fas fa-arrow-${stat.trend}`}></i>
                    {stat.change}
                  </span>
                  <span className="trend-label">vs last period</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ 
                    width: '85%',
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="dashboard-card chart-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Performance Overview</h3>
            <p className="card-subtitle">Key metrics and trends over time</p>
          </div>
          <div className="chart-tabs">
            {chartOptions.map(option => (
              <button
                key={option.id}
                className={`chart-tab ${activeChart === option.id ? 'active' : ''}`}
                onClick={() => setActiveChart(option.id)}
              >
                <i className={option.icon}></i>
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-header">
                <h4>{activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Trend</h4>
                <span className="chart-period">Last {period === 'week' ? '7 days' : 
                                               period === 'month' ? '30 days' : 
                                               period === 'quarter' ? '90 days' : '12 months'}</span>
              </div>
              <div className="chart-visual">
                <div className="chart-grid">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="chart-bar" style={{ 
                      height: `${Math.random() * 80 + 20}%`,
                      background: `linear-gradient(to top, ${activeChart === 'revenue' ? '#10b981' : 
                                                           activeChart === 'orders' ? '#3b82f6' : 
                                                           activeChart === 'inventory' ? '#f59e0b' : '#8b5cf6'}, 
                                                           ${activeChart === 'revenue' ? '#10b98180' : 
                                                           activeChart === 'orders' ? '#3b82f680' : 
                                                           activeChart === 'inventory' ? '#f59e0b80' : '#8b5cf680'})`
                    }}></div>
                  ))}
                </div>
              </div>
              <div className="chart-footer">
                <div className="chart-legend">
                  <span className="legend-item">
                    <div className="legend-dot" style={{ backgroundColor: '#10b981' }}></div>
                    Actual
                  </span>
                  <span className="legend-item">
                    <div className="legend-dot" style={{ backgroundColor: '#d1d5db' }}></div>
                    Target
                  </span>
                </div>
                <div className="chart-summary">
                  <div className="summary-item">
                    <span className="summary-label">Peak</span>
                    <span className="summary-value">$12,450</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Average</span>
                    <span className="summary-value">$8,920</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Growth</span>
                    <span className="summary-value positive">+12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Grid */}
      <div className="dashboard-content">
        {/* Top Products Card */}
        <div className="content-left">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Top Performing Products</h3>
                <p className="card-subtitle">Highest revenue generators this period</p>
              </div>
              <button className="card-action-btn">
                <i className="fas fa-arrow-right"></i>
                View All Products
              </button>
            </div>
            <div className="card-body">
              <div className="products-table">
                <div className="table-header">
                  <div className="table-col">Product</div>
                  <div className="table-col">Revenue</div>
                  <div className="table-col">Units</div>
                  <div className="table-col">Growth</div>
                </div>
                <div className="table-body">
                  {topProducts.map((product, index) => (
                    <div key={index} className="table-row">
                      <div className="table-col">
                        <div className="product-cell">
                          <div className="product-rank">
                            <span className="rank-number">{index + 1}</span>
                            <div className="rank-trend">
                              <i className={`fas fa-arrow-${product.trend}`}></i>
                            </div>
                          </div>
                          <div className="product-info">
                            <h4 className="product-name">{product.name}</h4>
                            <p className="product-category">{product.category}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-col">
                        <span className="revenue-value">{product.revenue}</span>
                      </div>
                      
                      <div className="table-col">
                        <div className="units-cell">
                          <span className="units-value">{product.units}</span>
                          <span className="units-label">units</span>
                        </div>
                      </div>
                      
                      <div className="table-col">
                        <span className={`growth-tag ${product.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                          <i className={`fas fa-arrow-${product.trend}`}></i>
                          {product.growth}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Card */}
        <div className="content-right">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Performance Metrics</h3>
                <p className="card-subtitle">Key operational KPIs</p>
              </div>
              <span className="updated-badge">
                <i className="fas fa-sync-alt"></i>
                Updated today
              </span>
            </div>
            <div className="card-body">
              <div className="metrics-grid">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon" style={{ 
                        backgroundColor: metric.status === 'excellent' ? '#d1fae5' : '#dbeafe',
                        color: metric.status === 'excellent' ? '#10b981' : '#3b82f6'
                      }}>
                        <i className={metric.icon}></i>
                      </div>
                      <div className="metric-target">
                        <span className="target-label">Target</span>
                        <span className="target-value">{metric.target}</span>
                      </div>
                    </div>
                    <h3 className="metric-value">{metric.value}</h3>
                    <p className="metric-label">{metric.label}</p>
                    <div className="metric-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ 
                          width: metric.status === 'excellent' ? '95%' : '88%',
                          backgroundColor: metric.status === 'excellent' ? '#10b981' : '#3b82f6'
                        }}></div>
                      </div>
                      <span className={`status-badge status-${metric.status}`}>
                        {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Quick Insights</h3>
          <p className="section-subtitle">Actionable recommendations based on your data</p>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="insight-content">
              <h4>Revenue Growth Opportunity</h4>
              <p>Increase inventory for top 3 products to boost revenue by 15%</p>
              <button className="insight-btn">
                <i className="fas fa-arrow-right"></i>
                Take Action
              </button>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <i className="fas fa-truck"></i>
            </div>
            <div className="insight-content">
              <h4>Delivery Optimization</h4>
              <p>Consolidate shipments to reduce delivery costs by 8%</p>
              <button className="insight-btn">
                <i className="fas fa-arrow-right"></i>
                Optimize Now
              </button>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-boxes"></i>
            </div>
            <div className="insight-content">
              <h4>Inventory Alert</h4>
              <p>12 products will reach reorder point within 7 days</p>
              <button className="insight-btn">
                <i className="fas fa-arrow-right"></i>
                Review Inventory
              </button>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-star"></i>
            </div>
            <div className="insight-content">
              <h4>Customer Retention</h4>
              <p>Personalized offers can improve retention by 5%</p>
              <button className="insight-btn">
                <i className="fas fa-arrow-right"></i>
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
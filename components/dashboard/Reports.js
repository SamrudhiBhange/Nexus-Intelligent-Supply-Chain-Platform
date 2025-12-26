import React, { useState } from 'react';
import './Dashboard.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const reportCategories = [
    {
      id: 'inventory',
      name: 'Inventory Reports',
      icon: 'fas fa-boxes',
      color: '#3b82f6',
      reports: [
        { id: 'stock-level', name: 'Stock Level Report', description: 'Current stock levels across all products', icon: 'fas fa-box', frequency: 'Daily', lastRun: 'Today, 8:00 AM' },
        { id: 'low-stock', name: 'Low Stock Alert', description: 'Products below reorder point', icon: 'fas fa-exclamation-triangle', frequency: 'Real-time', lastRun: 'Now' },
        { id: 'turnover', name: 'Inventory Turnover', description: 'Inventory turnover rates by category', icon: 'fas fa-rotate', frequency: 'Monthly', lastRun: 'Jan 1, 2024' },
        { id: 'valuation', name: 'Inventory Valuation', description: 'Total inventory value by location', icon: 'fas fa-dollar-sign', frequency: 'Weekly', lastRun: 'Jan 14, 2024' },
      ]
    },
    {
      id: 'sales',
      name: 'Sales Reports',
      icon: 'fas fa-chart-line',
      color: '#10b981',
      reports: [
        { id: 'revenue', name: 'Revenue Analysis', description: 'Sales revenue trends and forecasts', icon: 'fas fa-money-bill-wave', frequency: 'Daily', lastRun: 'Today, 9:00 AM' },
        { id: 'top-products', name: 'Top Products', description: 'Best-selling products analysis', icon: 'fas fa-star', frequency: 'Weekly', lastRun: 'Jan 14, 2024' },
        { id: 'customer-sales', name: 'Customer Sales', description: 'Sales by customer segmentation', icon: 'fas fa-users', frequency: 'Monthly', lastRun: 'Jan 1, 2024' },
        { id: 'seasonal', name: 'Seasonal Trends', description: 'Seasonal sales patterns', icon: 'fas fa-calendar-alt', frequency: 'Quarterly', lastRun: 'Oct 1, 2023' },
      ]
    },
    {
      id: 'orders',
      name: 'Order Reports',
      icon: 'fas fa-shopping-cart',
      color: '#f59e0b',
      reports: [
        { id: 'order-summary', name: 'Order Summary', description: 'Complete order overview and status', icon: 'fas fa-list-alt', frequency: 'Real-time', lastRun: 'Now' },
        { id: 'fulfillment', name: 'Fulfillment Report', description: 'Order fulfillment performance', icon: 'fas fa-truck', frequency: 'Daily', lastRun: 'Today, 10:00 AM' },
        { id: 'returns', name: 'Returns Analysis', description: 'Product returns and reasons', icon: 'fas fa-undo', frequency: 'Weekly', lastRun: 'Jan 14, 2024' },
        { id: 'backorders', name: 'Backorder Status', description: 'Pending and backordered items', icon: 'fas fa-clock', frequency: 'Real-time', lastRun: 'Now' },
      ]
    },
    {
      id: 'supplier',
      name: 'Supplier Reports',
      icon: 'fas fa-truck',
      color: '#8b5cf6',
      reports: [
        { id: 'performance', name: 'Supplier Performance', description: 'Supplier reliability and quality metrics', icon: 'fas fa-chart-bar', frequency: 'Monthly', lastRun: 'Jan 1, 2024' },
        { id: 'lead-time', name: 'Lead Time Analysis', description: 'Supplier delivery time trends', icon: 'fas fa-shipping-fast', frequency: 'Weekly', lastRun: 'Jan 14, 2024' },
        { id: 'cost', name: 'Cost Analysis', description: 'Supplier cost comparisons', icon: 'fas fa-file-invoice-dollar', frequency: 'Monthly', lastRun: 'Jan 1, 2024' },
        { id: 'compliance', name: 'Compliance Report', description: 'Supplier contract compliance', icon: 'fas fa-file-contract', frequency: 'Quarterly', lastRun: 'Oct 1, 2023' },
      ]
    },
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Sales Summary', category: 'Sales', date: '2024-01-15', status: 'completed', size: '2.4 MB', format: 'PDF' },
    { id: 2, name: 'Inventory Valuation', category: 'Inventory', date: '2024-01-14', status: 'completed', size: '1.8 MB', format: 'Excel' },
    { id: 3, name: 'Supplier Performance Q4', category: 'Supplier', date: '2024-01-12', status: 'completed', size: '3.2 MB', format: 'PDF' },
    { id: 4, name: 'Daily Stock Alert', category: 'Inventory', date: '2024-01-15', status: 'processing', size: '0.5 MB', format: 'Excel' },
  ];

  const scheduledReports = [
    { id: 1, name: 'Weekly Revenue Report', schedule: 'Every Monday, 8:00 AM', nextRun: 'Jan 22, 2024', recipients: '5 users' },
    { id: 2, name: 'Monthly Inventory Turnover', schedule: '1st of each month', nextRun: 'Feb 1, 2024', recipients: '3 users' },
    { id: 3, name: 'Daily Low Stock Alert', schedule: 'Daily, 6:00 AM', nextRun: 'Tomorrow, 6:00 AM', recipients: '8 users' },
  ];

  const handleReportSelection = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleGenerateReport = () => {
    if (selectedReports.length === 0) {
      alert('Please select at least one report to generate.');
      return;
    }

    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      alert(`Successfully generated ${selectedReports.length} report(s)!`);
      setSelectedReports([]);
    }, 2000);
  };

  const handleScheduleReport = () => {
    alert('Schedule report feature coming soon!');
  };

  const getCategoryIcon = (categoryId) => {
    const category = reportCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : 'fas fa-file-alt';
  };

  const getCategoryColor = (categoryId) => {
    const category = reportCategories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  const activeCategory = reportCategories.find(cat => cat.id === activeTab) || reportCategories[0];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Reports & Analytics 📈</h1>
          <p className="dashboard-subtitle">Generate, schedule, and analyze business reports</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={handleScheduleReport}>
            <i className="fas fa-calendar-plus"></i>
            Schedule Report
          </button>
          <button 
            className={`primary-btn ${selectedReports.length === 0 ? 'disabled' : ''}`}
            onClick={handleGenerateReport}
            disabled={selectedReports.length === 0 || generatingReport}
          >
            {generatingReport ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-file-export"></i>
                Generate Selected ({selectedReports.length})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe' }}>
                <i className="fas fa-file-alt" style={{ color: '#0284c7' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +8
              </span>
            </div>
            <h3 className="stat-value">42</h3>
            <p className="stat-title">Total Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7' }}>
                <i className="fas fa-history" style={{ color: '#16a34a' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +24%
              </span>
            </div>
            <h3 className="stat-value">156</h3>
            <p className="stat-title">Generated This Month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
                <i className="fas fa-clock" style={{ color: '#d97706' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +3
              </span>
            </div>
            <h3 className="stat-value">12</h3>
            <p className="stat-title">Scheduled Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe' }}>
                <i className="fas fa-user-check" style={{ color: '#7c3aed' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +5
              </span>
            </div>
            <h3 className="stat-value">24</h3>
            <p className="stat-title">Active Subscribers</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reports-container">
        {/* Categories Sidebar */}
        <div className="reports-sidebar">
          <div className="sidebar-header">
            <h3>Report Categories</h3>
            <p>Browse reports by category</p>
          </div>
          <div className="category-list">
            {reportCategories.map(category => (
              <button
                key={category.id}
                className={`category-card ${activeTab === category.id ? 'active' : ''}`}
                onClick={() => setActiveTab(category.id)}
                style={{ 
                  borderLeft: `4px solid ${activeTab === category.id ? category.color : 'transparent'}`,
                  backgroundColor: activeTab === category.id ? category.color + '10' : 'transparent'
                }}
              >
                <div className="category-icon" style={{ 
                  backgroundColor: category.color + '20',
                  color: category.color 
                }}>
                  <i className={category.icon}></i>
                </div>
                <div className="category-content">
                  <h4>{category.name}</h4>
                  <p>{category.reports.length} reports available</p>
                </div>
                {activeTab === category.id && (
                  <i className="fas fa-chevron-right category-arrow" style={{ color: category.color }}></i>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Content */}
        <div className="reports-content">
          {/* Category Reports */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{activeCategory.name}</h3>
                <p className="card-subtitle">Select reports to generate or schedule</p>
              </div>
              <div className="header-actions">
                <button 
                  className="select-all-btn"
                  onClick={() => {
                    const allReportIds = activeCategory.reports.map(r => r.id);
                    if (selectedReports.length === allReportIds.length) {
                      setSelectedReports([]);
                    } else {
                      setSelectedReports(allReportIds);
                    }
                  }}
                >
                  {selectedReports.length === activeCategory.reports.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="reports-grid">
                {activeCategory.reports.map(report => (
                  <div 
                    key={report.id}
                    className={`report-card ${selectedReports.includes(report.id) ? 'selected' : ''}`}
                    onClick={() => handleReportSelection(report.id)}
                  >
                    <div className="report-header">
                      <div className="report-icon" style={{ 
                        backgroundColor: activeCategory.color + '20',
                        color: activeCategory.color 
                      }}>
                        <i className={report.icon}></i>
                      </div>
                      <div className="report-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleReportSelection(report.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="report-content">
                      <h4>{report.name}</h4>
                      <p>{report.description}</p>
                      <div className="report-meta">
                        <span className="meta-item">
                          <i className="fas fa-clock"></i>
                          {report.frequency}
                        </span>
                        <span className="meta-item">
                          <i className="fas fa-history"></i>
                          Last run: {report.lastRun}
                        </span>
                      </div>
                    </div>
                    <div className="report-actions">
                      <button 
                        className="quick-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReports([report.id]);
                          setTimeout(() => handleGenerateReport(), 100);
                        }}
                      >
                        <i className="fas fa-bolt"></i>
                        Generate Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent & Scheduled Reports */}
          <div className="reports-bottom">
            {/* Recent Reports */}
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Recent Reports</h3>
                  <p className="card-subtitle">Recently generated reports</p>
                </div>
                <button className="card-action-btn">
                  <i className="fas fa-history"></i>
                  View All
                </button>
              </div>
              <div className="card-body">
                <div className="recent-reports">
                  {recentReports.map(report => (
                    <div key={report.id} className="recent-report">
                      <div className="report-type" style={{ 
                        backgroundColor: getCategoryColor(report.category.toLowerCase()) + '20',
                        color: getCategoryColor(report.category.toLowerCase())
                      }}>
                        <i className={getCategoryIcon(report.category.toLowerCase())}></i>
                      </div>
                      <div className="report-info">
                        <h4>{report.name}</h4>
                        <div className="report-details">
                          <span className="detail-item">
                            <i className="far fa-calendar"></i>
                            {report.date}
                          </span>
                          <span className="detail-item">
                            <i className="fas fa-file"></i>
                            {report.format}
                          </span>
                          <span className="detail-item">
                            <i className="fas fa-database"></i>
                            {report.size}
                          </span>
                        </div>
                      </div>
                      <div className="report-status">
                        <span className={`status-badge status-${report.status}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                        <div className="report-actions">
                          <button className="icon-btn small">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="icon-btn small">
                            <i className="fas fa-share"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduled Reports */}
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Scheduled Reports</h3>
                  <p className="card-subtitle">Automated report generation</p>
                </div>
                <button className="card-action-btn">
                  <i className="fas fa-plus"></i>
                  Add Schedule
                </button>
              </div>
              <div className="card-body">
                <div className="scheduled-reports">
                  {scheduledReports.map(schedule => (
                    <div key={schedule.id} className="scheduled-report">
                      <div className="schedule-info">
                        <div className="schedule-icon">
                          <i className="fas fa-calendar-check"></i>
                        </div>
                        <div>
                          <h4>{schedule.name}</h4>
                          <div className="schedule-details">
                            <span className="detail-item">
                              <i className="fas fa-clock"></i>
                              {schedule.schedule}
                            </span>
                            <span className="detail-item">
                              <i className="fas fa-users"></i>
                              {schedule.recipients}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="schedule-next">
                        <span className="next-label">Next Run:</span>
                        <span className="next-date">{schedule.nextRun}</span>
                        <button className="icon-btn small">
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Formats */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Export Formats</h3>
          <p className="section-subtitle">Choose your preferred output format</p>
        </div>
        <div className="formats-grid">
          <div className="format-card">
            <div className="format-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="fas fa-file-pdf"></i>
            </div>
            <h4>PDF Format</h4>
            <p>Print-ready documents with charts</p>
            <div className="format-stats">
              <span className="stat">High quality</span>
              <span className="stat">Charts included</span>
            </div>
          </div>
          
          <div className="format-card">
            <div className="format-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-file-excel"></i>
            </div>
            <h4>Excel Format</h4>
            <p>Spreadsheets with raw data</p>
            <div className="format-stats">
              <span className="stat">Editable data</span>
              <span className="stat">Formulas included</span>
            </div>
          </div>
          
          <div className="format-card">
            <div className="format-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <h4>Dashboard View</h4>
            <p>Interactive charts and filters</p>
            <div className="format-stats">
              <span className="stat">Interactive</span>
              <span className="stat">Real-time data</span>
            </div>
          </div>
          
          <div className="format-card">
            <div className="format-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-envelope"></i>
            </div>
            <h4>Email Delivery</h4>
            <p>Automated email reports</p>
            <div className="format-stats">
              <span className="stat">Scheduled</span>
              <span className="stat">Multi-recipient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
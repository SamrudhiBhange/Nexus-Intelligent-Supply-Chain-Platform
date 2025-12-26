import React, { useState } from 'react';
import './Dashboard.css';

const Inventory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Products', icon: 'fas fa-boxes', color: '#3b82f6' },
    { id: 'electronics', name: 'Electronics', icon: 'fas fa-laptop', color: '#8b5cf6' },
    { id: 'office', name: 'Office Supplies', icon: 'fas fa-clipboard-list', color: '#10b981' },
    { id: 'furniture', name: 'Furniture', icon: 'fas fa-chair', color: '#f59e0b' },
    { id: 'raw', name: 'Raw Materials', icon: 'fas fa-industry', color: '#ef4444' },
  ];

  const inventoryItems = [
    { 
      id: 1, 
      name: 'Laptop Pro M1', 
      sku: 'LP-M1-2023', 
      category: 'electronics',
      price: '$1,299',
      stock: 45,
      threshold: 10,
      supplier: 'Tech Supplies Inc',
      lastUpdated: '2024-01-15',
      status: 'good'
    },
    { 
      id: 2, 
      name: 'Wireless Mouse X', 
      sku: 'WM-X-2023', 
      category: 'electronics',
      price: '$49.99',
      stock: 120,
      threshold: 20,
      supplier: 'Peripheral Co',
      lastUpdated: '2024-01-14',
      status: 'good'
    },
    { 
      id: 3, 
      name: 'Office Chair Pro', 
      sku: 'OC-PRO-2023', 
      category: 'furniture',
      price: '$299',
      stock: 25,
      threshold: 5,
      supplier: 'Furniture Works',
      lastUpdated: '2024-01-13',
      status: 'good'
    },
    { 
      id: 4, 
      name: 'A4 Paper Pack', 
      sku: 'A4-500-2023', 
      category: 'office',
      price: '$24.99',
      stock: 500,
      threshold: 100,
      supplier: 'Paper Products Ltd',
      lastUpdated: '2024-01-12',
      status: 'good'
    },
    { 
      id: 5, 
      name: 'USB-C Hub', 
      sku: 'UCH-2023', 
      category: 'electronics',
      price: '$89.99',
      stock: 8,
      threshold: 10,
      supplier: 'Tech Supplies Inc',
      lastUpdated: '2024-01-11',
      status: 'low'
    },
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#fee2e2' };
    if (stock < threshold) return { label: 'Low Stock', color: '#f59e0b', bg: '#fef3c7' };
    if (stock < threshold * 2) return { label: 'Medium Stock', color: '#3b82f6', bg: '#dbeafe' };
    return { label: 'In Stock', color: '#10b981', bg: '#d1fae5' };
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : 'fas fa-box';
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Inventory Management 📦</h1>
          <p className="dashboard-subtitle">Track, manage, and optimize your inventory in real-time</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="fas fa-download"></i>
            Export
          </button>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Add New Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe' }}>
                <i className="fas fa-boxes" style={{ color: '#0284c7' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +12.5%
              </span>
            </div>
            <h3 className="stat-value">124</h3>
            <p className="stat-title">Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7' }}>
                <i className="fas fa-check-circle" style={{ color: '#16a34a' }}></i>
              </div>
              <span className="stat-change-badge positive">
                <i className="fas fa-arrow-up"></i>
                +8.2%
              </span>
            </div>
            <h3 className="stat-value">98</h3>
            <p className="stat-title">In Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#d97706' }}></i>
              </div>
              <span className="stat-change-badge negative">
                <i className="fas fa-arrow-up"></i>
                +3
              </span>
            </div>
            <h3 className="stat-value">12</h3>
            <p className="stat-title">Low Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2' }}>
                <i className="fas fa-times-circle" style={{ color: '#dc2626' }}></i>
              </div>
              <span className="stat-change-badge negative">
                <i className="fas fa-arrow-up"></i>
                +2
              </span>
            </div>
            <h3 className="stat-value">14</h3>
            <p className="stat-title">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Inventory Items</h3>
            <p className="card-subtitle">{filteredItems.length} products found</p>
          </div>
          <div className="filter-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search products, SKU, or supplier..."
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
              <option>Sort: Recently Added</option>
              <option>Sort: Stock Level</option>
              <option>Sort: Price</option>
              <option>Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-filter-btn ${filter === category.id ? 'active' : ''}`}
              onClick={() => setFilter(category.id)}
              style={{ 
                borderColor: filter === category.id ? category.color : 'transparent',
                color: filter === category.id ? category.color : '#6b7280'
              }}
            >
              <i className={category.icon}></i>
              {category.name}
            </button>
          ))}
        </div>

        <div className="card-body">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search fa-3x"></i>
              <h4>No products found</h4>
              <p>Try adjusting your search or filter criteria</p>
              <button className="secondary-btn" onClick={() => { setSearchTerm(''); setFilter('all'); }}>
                <i className="fas fa-redo"></i>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="inventory-table">
              <div className="table-header">
                <div className="table-col">Product</div>
                <div className="table-col">Category</div>
                <div className="table-col">Stock Level</div>
                <div className="table-col">Price</div>
                <div className="table-col">Supplier</div>
                <div className="table-col">Actions</div>
              </div>
              <div className="table-body">
                {filteredItems.map(item => {
                  const stockStatus = getStockStatus(item.stock, item.threshold);
                  const category = categories.find(cat => cat.id === item.category);
                  
                  return (
                    <div key={item.id} className="table-row">
                      <div className="table-col">
                        <div className="product-info">
                          <div className="product-avatar" style={{ backgroundColor: category?.color + '20', color: category?.color }}>
                            <i className={getCategoryIcon(item.category)}></i>
                          </div>
                          <div>
                            <h4 className="product-name">{item.name}</h4>
                            <p className="product-sku">{item.sku}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-col">
                        <span className="category-tag" style={{ 
                          backgroundColor: category?.color + '15',
                          color: category?.color,
                          border: `1px solid ${category?.color}30`
                        }}>
                          <i className={category?.icon}></i>
                          {category?.name}
                        </span>
                      </div>
                      
                      <div className="table-col">
                        <div className="stock-info">
                          <div className="stock-meter">
                            <div 
                              className="stock-fill"
                              style={{ 
                                width: `${(item.stock / (item.threshold * 3)) * 100}%`,
                                backgroundColor: stockStatus.color
                              }}
                            ></div>
                          </div>
                          <div className="stock-details">
                            <span className="stock-count">{item.stock} units</span>
                            <span 
                              className="stock-status"
                              style={{ 
                                backgroundColor: stockStatus.bg,
                                color: stockStatus.color
                              }}
                            >
                              <i className={`fas fa-${stockStatus.label === 'In Stock' ? 'check' : 'exclamation'}`}></i>
                              {stockStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-col">
                        <span className="price-tag">{item.price}</span>
                      </div>
                      
                      <div className="table-col">
                        <div className="supplier-info">
                          <div className="supplier-avatar">
                            {item.supplier.charAt(0)}
                          </div>
                          <span className="supplier-name">{item.supplier}</span>
                        </div>
                      </div>
                      
                      <div className="table-col">
                        <div className="action-buttons">
                          <button className="icon-btn small">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="icon-btn small">
                            <i className="fas fa-chart-line"></i>
                          </button>
                          <button className="icon-btn small danger">
                            <i className="fas fa-trash"></i>
                          </button>
                          <button className="icon-btn small primary">
                            <i className="fas fa-sync-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          </div>
          <div className="results-count">
            Showing {filteredItems.length} of {inventoryItems.length} products
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3 className="section-title">Quick Inventory Actions</h3>
          <p className="section-subtitle">Common inventory management tasks</p>
        </div>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-upload"></i>
            </div>
            <h4>Bulk Import</h4>
            <p>Import multiple products</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-chart-pie"></i>
            </div>
            <h4>Stock Report</h4>
            <p>Generate stock analysis</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h4>Low Stock Alert</h4>
            <p>View critical items</p>
          </button>
          
          <button className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-file-export"></i>
            </div>
            <h4>Export Data</h4>
            <p>Download inventory data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Streamline Your Supply Chain with Nexus SCM</h1>
          <p>Comprehensive supply chain management platform for modern businesses. Manage inventory, suppliers, orders, and analytics in one place.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Supply Chain Management" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Everything You Need for Supply Chain Management</h2>
          <p>Powerful features to optimize your operations</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-boxes"></i>
            </div>
            <h3>Inventory Management</h3>
            <p>Track stock levels, manage warehouses, and automate reordering with real-time inventory control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Supplier Management</h3>
            <p>Manage supplier relationships, track performance, and streamline procurement processes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h3>Order Processing</h3>
            <p>Process orders efficiently, track shipments, and manage customer communications seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Analytics & Reporting</h3>
            <p>Gain insights with advanced analytics, custom reports, and performance dashboards.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Supply Chain?</h2>
          <p>Join thousands of businesses using Nexus SCM to optimize their operations.</p>
          <Link to="/register" className="btn-primary btn-large">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
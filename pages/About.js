import React from 'react';
import './Pages.css';

const About = () => {
  return (
    <div className="about">
      <div className="page-header">
        <h1>About Nexus SCM</h1>
        <p>Our mission to revolutionize supply chain management</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, Nexus SCM emerged from a simple observation: businesses were struggling with fragmented supply chain management systems. 
              We set out to create a unified platform that brings together all aspects of supply chain operations in one intuitive interface.
            </p>
            <p>
              Today, Nexus SCM serves businesses of all sizes, from startups to enterprises, helping them streamline operations, reduce costs, and improve efficiency.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Our Story" />
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <p className="mission-statement">
            To empower businesses with intelligent supply chain management solutions that drive efficiency, transparency, and growth.
          </p>
          <div className="mission-cards">
            <div className="mission-card">
              <i className="fas fa-bullseye"></i>
              <h3>Innovation</h3>
              <p>Continuously evolving our platform with cutting-edge technology to meet changing business needs.</p>
            </div>
            <div className="mission-card">
              <i className="fas fa-handshake"></i>
              <h3>Partnership</h3>
              <p>Building lasting relationships with our clients by understanding and addressing their unique challenges.</p>
            </div>
            <div className="mission-card">
              <i className="fas fa-chart-line"></i>
              <h3>Excellence</h3>
              <p>Delivering exceptional value through reliable, scalable, and user-friendly solutions.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
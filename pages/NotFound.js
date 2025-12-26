import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="btn-primary">
        <i className="fas fa-home"></i>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
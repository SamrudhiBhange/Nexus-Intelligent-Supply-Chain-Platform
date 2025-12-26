import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Layout Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './components/dashboard/Dashboard';
import Inventory from './components/dashboard/Inventory';
import Suppliers from './components/dashboard/Suppliers';
import Orders from './components/dashboard/Orders';
import Analytics from './components/dashboard/Analytics';
import Settings from './components/dashboard/Settings';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Loading Nexus SCM...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {user && <Header />}
      <div className="app-container">
        {user && <Sidebar />}
        <main className={user ? 'main-content' : 'auth-content'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
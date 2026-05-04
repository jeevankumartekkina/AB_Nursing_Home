import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded auth for initial version
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card glass-panel">
        <h2>Admin Dashboard</h2>
        <p>Please enter the administrator password to manage the website.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

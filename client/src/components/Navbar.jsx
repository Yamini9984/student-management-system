import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthData, getStoredUser } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Student Management System
        </Link>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/students">
                Students
              </Link>
              <span className="text-white">{user.name}</span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-light btn-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

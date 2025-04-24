import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </li>
      <li className="nav-item">
        <Link to="/saved-properties" className="nav-link">Saved Properties</Link>
      </li>
      {user && (user.role === 'agent' || user.role === 'admin') && (
        <>
          <li className="nav-item">
            <Link to="/my-properties" className="nav-link">My Listings</Link>
          </li>
          <li className="nav-item">
            <Link to="/enquiries" className="nav-link">Enquiries</Link>
          </li>
        </>
      )}
      <li className="nav-item">
        <button onClick={onLogout} className="btn btn-link nav-link">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link to="/register" className="nav-link">Register</Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">Login</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Home Hive
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/properties" className="nav-link">Properties</Link>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
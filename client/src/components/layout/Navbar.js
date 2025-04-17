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
      <li>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </li>
      <li>
        <Link to="/saved-properties" className="nav-link">Saved Properties</Link>
      </li>
      {user && (user.role === 'agent' || user.role === 'admin') && (
        <>
          <li>
            <Link to="/my-properties" className="nav-link">My Listings</Link>
          </li>
          <li>
            <Link to="/enquiries" className="nav-link">Enquiries</Link>
          </li>
        </>
      )}
      <li>
        <button onClick={onLogout} className="btn btn-link nav-link">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/register" className="nav-link">Register</Link>
      </li>
      <li>
        <Link to="/login" className="nav-link">Login</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          RealEstate Finder
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/properties" className="nav-link">Properties</Link>
          </li>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>RealEstate Finder</h3>
            <p>
              Find your dream home with our extensive listings of properties for sale and rent.
              Whether you're looking for a house, apartment, or commercial space, we've got you covered.
            </p>
            <div className="social-links">
              <a href="#!" className="social-link">
                <FaFacebook />
              </a>
              <a href="#!" className="social-link">
                <FaTwitter />
              </a>
              <a href="#!" className="social-link">
                <FaInstagram />
              </a>
              <a href="#!" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/properties">Properties</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Property Types</h3>
            <ul className="footer-links">
              <li>
                <Link to="/properties">Houses</Link>
              </li>
              <li>
                <Link to="/properties">Apartments</Link>
              </li>
              <li>
                <Link to="/properties">Condos</Link>
              </li>
              <li>
                <Link to="/properties">Land</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>123 Real Estate Street</p>
            <p>Property City, PC 12345</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@realestatefinder.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} RealEstate Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
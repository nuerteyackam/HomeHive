import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-md-4">
            <h3 className="text-uppercase fw-bold">RealEstate Finder</h3>
            <p className="text-muted">
              Find your dream home with our extensive listings of properties for sale and rent.
              Whether you're looking for a house, apartment, or commercial space, we've got you covered.
            </p>
            <div className="d-flex gap-3">
              <a href="#!" className="text-white fs-4">
                <FaFacebook />
              </a>
              <a href="#!" className="text-white fs-4">
                <FaTwitter />
              </a>
              <a href="#!" className="text-white fs-4">
                <FaInstagram />
              </a>
              <a href="#!" className="text-white fs-4">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h5 className="text-uppercase fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-muted text-decoration-none">Properties</Link>
              </li>
              <li>
                <Link to="/login" className="text-muted text-decoration-none">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-muted text-decoration-none">Register</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold">Property Types</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/properties" className="text-muted text-decoration-none">Houses</Link>
              </li>
              <li>
                <Link to="/properties" className="text-muted text-decoration-none">Apartments</Link>
              </li>
              <li>
                <Link to="/properties" className="text-muted text-decoration-none">Condos</Link>
              </li>
              <li>
                <Link to="/properties" className="text-muted text-decoration-none">Land</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold">Contact Us</h5>
            <p className="text-muted mb-1">123 Real Estate Street</p>
            <p className="text-muted mb-1">Property City, PC 12345</p>
            <p className="text-muted mb-1">Phone: (123) 456-7890</p>
            <p className="text-muted">Email: info@realestatefinder.com</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            &copy; {currentYear} RealEstate Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
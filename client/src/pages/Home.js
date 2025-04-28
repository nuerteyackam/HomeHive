import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyContext from '../context/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';

const Home = () => {
  const { properties, getProperties, loading } = useContext(PropertyContext);

  useEffect(() => {
    getProperties();
    // eslint-disable-next-line
  }, []);

  // Get only the 6 most recent properties
  const recentProperties = properties.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Home</h1>
          <p className="hero-subtitle">Browse our selection of quality properties</p>
          <form className="hero-search" onSubmit={e => { e.preventDefault(); window.location.href = '/properties'; }}>
            <input type="text" placeholder="Search by city, address, or property type..." />
            <button type="submit">Search</button>
          </form>
        </div>
        {/* Decorative SVG shapes for modern look */}
        <svg className="hero-svg-shape" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',right:0,top:0,opacity:0.15,zIndex:1}}>
          <circle cx="300" cy="100" r="100" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="200" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34dbb4" />
              <stop offset="1" stopColor="#ff9800" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="hero-svg-shape" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',left:0,bottom:0,opacity:0.12,zIndex:1}}>
          <rect x="0" y="100" width="200" height="100" rx="50" fill="#34dbb4" />
        </svg>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-subtitle">Explore our handpicked selection of featured properties</p>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="featured-grid">
            {recentProperties.map((property) => (
              <div className="featured-card" key={property.id}>
                <div className="featured-image">
                  <img src={property.primary_image || '/default-property.jpg'} alt={property.title} />
                  <span className="featured-badge">{property.status}</span>
                </div>
                <div className="featured-content">
                  <div className="featured-price">${property.price.toLocaleString()}</div>
                  <div className="featured-title">{property.title}</div>
                  <div className="featured-location">{property.city}, {property.state}</div>
                  <div className="featured-features">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.square_feet.toLocaleString()} sqft</span>
                  </div>
                  <Link to={`/properties/${property.id}`} className="btn btn-primary" style={{marginTop:'1rem'}}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center" style={{marginTop:'3rem'}}>
          <Link to="/properties" className="cta-button primary">View All Properties</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <div className="feature-title">Wide Range of Properties</div>
            <div className="feature-description">From apartments to family homes, we have properties to suit every need and budget.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <div className="feature-title">Best Price Guarantee</div>
            <div className="feature-description">We ensure you get the best deal for your dream property.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <div className="feature-title">Expert Agents</div>
            <div className="feature-description">Our professional agents will guide you through every step of your journey.</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-title">Ready to Start Your Journey?</div>
          <div className="cta-description">Sign up now or browse all properties to find your perfect home today.</div>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Sign Up</Link>
            <Link to="/properties" className="cta-button secondary">Browse Properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
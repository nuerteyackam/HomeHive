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
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Find Your Dream Home</h1>
          <p>Browse our selection of quality properties</p>
          <Link to="/properties" className="btn btn-primary">
            View Properties
          </Link>
        </div>
      </div>

      <section className="featured-properties">
        <div className="container">
          <h2>Featured Properties</h2>
          <p>Explore our handpicked selection of featured properties</p>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="property-grid">
              {recentProperties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  saved={false}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/properties" className="btn btn-secondary">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🏠</div>
              <h3>Wide Range of Properties</h3>
              <p>From apartments to family homes, we have properties to suit every need and budget.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Best Price Guarantee</h3>
              <p>We ensure you get the best deal for your dream property.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👨‍💼</div>
              <h3>Expert Agents</h3>
              <p>Our professional agents will guide you through every step of your journey.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
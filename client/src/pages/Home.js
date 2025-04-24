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
      {/* Hero Section */}
      <div className="hero text-white py-5" style={{ background: 'linear-gradient(90deg,rgb(15, 22, 29),rgb(24, 19, 33))' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Find Your Dream Home</h1>
          <p className="lead">Browse our selection of quality properties</p>
          <Link to="/properties" className="btn btn-light btn-lg mt-3">
            View Properties
          </Link>
        </div>
      </div>

      {/* Featured Properties Section */}
      <section className="featured-properties py-5">
        <div className="container">
          <h2 className="text-center mb-4">Featured Properties</h2>
          <p className="text-center text-muted mb-5">
            Explore our handpicked selection of featured properties
          </p>

          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {recentProperties.map((property) => (
                <div className="col-md-4" key={property.id}>
                  <div className="card shadow-sm h-100">
                    <PropertyCard property={property} saved={false} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/properties" className="btn btn-outline-primary btn-lg">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-4">Why Choose Us</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-center shadow-sm h-100">
                <div className="card-body">
                  <div className="feature-icon display-4 text-primary">🏠</div>
                  <h3 className="mt-3">Wide Range of Properties</h3>
                  <p className="text-muted">
                    From apartments to family homes, we have properties to suit every need and budget.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center shadow-sm h-100">
                <div className="card-body">
                  <div className="feature-icon display-4 text-primary">💰</div>
                  <h3 className="mt-3">Best Price Guarantee</h3>
                  <p className="text-muted">
                    We ensure you get the best deal for your dream property.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center shadow-sm h-100">
                <div className="card-body">
                  <div className="feature-icon display-4 text-primary">👨‍💼</div>
                  <h3 className="mt-3">Expert Agents</h3>
                  <p className="text-muted">
                    Our professional agents will guide you through every step of your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
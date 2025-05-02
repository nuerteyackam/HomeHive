import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PropertyContext from '../context/PropertyContext';
import axios from 'axios';
//import "./Dashboard.css";

const Dashboard = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { savedProperties, myProperties, getSavedProperties, getMyProperties } = useContext(PropertyContext);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profileUpdated, setProfileUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        password: ''
      });
      // Fetch saved analyses
      const fetchAnalyses = async () => {
        try {
          const response = await axios.get('/api/investment-analyses');
          setSavedAnalyses(response.data);
        } catch (error) {
          console.error('Error fetching analyses:', error);
        }
      };
      fetchAnalyses();
    }
    
    getSavedProperties();
    
    if (user && (user.role === 'agent' || user.role === 'admin')) {
      getMyProperties();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileUpdated(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Only send fields that are not empty
    const updateData = {};
    if (profileData.name) updateData.name = profileData.name;
    if (profileData.email) updateData.email = profileData.email;
    if (profileData.password) updateData.password = profileData.password;
    
    const success = await updateProfile(updateData);
    if (success) {
      setProfileUpdated(true);
      // Clear password field after successful update
      setProfileData({ ...profileData, password: '' });
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=34dbb4&color=fff`}
            alt="Profile"
            className="sidebar-profile-img"
          />
          <div className="sidebar-profile-name">{user.name}</div>
          <div className="sidebar-profile-email">{user.email}</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/saved-properties">Saved Properties</Link></li>
            {(user.role === 'agent' || user.role === 'admin') && (
              <li><Link to="/my-properties">My Properties</Link></li>
            )}
            {(user.role === 'agent' || user.role === 'admin') && (
              <li><Link to="/create-property">Add Property</Link></li>
            )}
            <li>
              <button className="logout-btn-modern" onClick={() => { logout(); navigate('/login'); }}>
                <span role="img" aria-label="logout">🚪</span> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        <div className="dashboard-content-grid">
          {/* Profile Section */}
          <section className="profile-section">
            <h2>Your Profile</h2>
            {profileUpdated && (
              <div className="alert alert-success">Profile updated successfully!</div>
            )}
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleProfileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
            {/* New Card Below Profile Update */}
            <div className="profile-extra-card">
              <h3>Account Status</h3>
              <p><b>Role:</b> {user.role}</p>
              <p><b>Member since:</b> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
              {/* Add more info if needed */}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stat-card">
              <h3>Saved Properties</h3>
              <p className="stat-value">{savedProperties.length}</p>
              <Link to="/saved-properties" className="btn btn-outline">View All</Link>
            </div>
            {(user.role === 'agent' || user.role === 'admin') && (
              <div className="stat-card">
                <h3>Your Listings</h3>
                <p className="stat-value">{myProperties.length}</p>
                <Link to="/my-properties" className="btn btn-outline">View All</Link>
              </div>
            )}
            {(user.role === 'user' || user.role === 'buyer' || user.role === 'agent' || user.role === 'admin') && (
              <div className="stat-card">
                <h3>Investment Analyses</h3>
                <p className="stat-value">{savedAnalyses.length}</p>
                <Link to="/analytics" className="btn btn-outline">View All</Link>
              </div>
            )}
          </section>

          {/* Recently Saved Properties */}
          <section className="recent-section">
            <h2>Recently Saved Properties</h2>
            {savedProperties.length === 0 ? (
              <p>You haven't saved any properties yet.</p>
            ) : (
              <div className="saved-properties-list">
                {savedProperties.slice(0, 3).map(property => (
                  <div key={property.id} className="saved-property-card">
                    <div className="saved-property-image">
                      {property.primary_image ? (
                        <img src={property.primary_image} alt={property.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="saved-property-info">
                      <h3>{property.title}</h3>
                      <p className="saved-property-price">${property.price.toLocaleString()}</p>
                      <p>{property.city}, {property.state}</p>
                      <Link to={`/properties/${property.id}`} className="btn btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                {savedProperties.length > 3 && (
                  <Link to="/saved-properties" className="btn btn-outline">
                    View All Saved Properties
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Recently Saved Analyses */}
          {(user.role === 'user' || user.role === 'buyer' || user.role === 'agent' || user.role === 'admin') && (
            <section className="recent-section">
              <h2>Recent Investment Analyses</h2>
              {savedAnalyses.length === 0 ? (
                <p>You haven't created any investment analyses yet.</p>
              ) : (
                <div className="saved-properties-list">
                  {savedAnalyses.slice(0, 3).map(analysis => (
                    <div key={analysis.id} className="saved-property-card">
                      <div className="saved-property-info">
                        <h3>Analysis for ${parseFloat(analysis.purchase_price).toLocaleString()}</h3>
                        <p className="saved-property-price">ROI: {parseFloat(analysis.roi).toFixed(2)}%</p>
                        <p>Monthly Cash Flow: ${parseFloat(analysis.cash_flow).toFixed(2)}</p>
                        <p>Rental Yield: {parseFloat(analysis.rental_yield).toFixed(2)}%</p>
                        <p>Created: {new Date(analysis.created_at).toLocaleDateString()}</p>
                        <Link to="/analytics" className="btn btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                  {savedAnalyses.length > 3 && (
                    <Link to="/analytics" className="btn btn-outline">
                      View All Analyses
                    </Link>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
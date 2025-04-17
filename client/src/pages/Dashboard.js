import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PropertyContext from '../context/PropertyContext';

const Dashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { savedProperties, myProperties, getSavedProperties, getMyProperties } = useContext(PropertyContext);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profileUpdated, setProfileUpdated] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        password: ''
      });
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
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        
        <div className="dashboard-grid">
          <div className="dashboard-sidebar">
            <div className="profile-section">
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
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="stats-section">
              <div className="stat-card">
                <h3>Saved Properties</h3>
                <p className="stat-value">{savedProperties.length}</p>
                <Link to="/saved-properties" className="btn btn-outline">View All</Link>
              </div>
              
              {(user.role === 'agent' || user.role === 'admin') && (
                <>
                  <div className="stat-card">
                    <h3>Your Listings</h3>
                    <p className="stat-value">{myProperties.length}</p>
                    <Link to="/my-properties" className="btn btn-outline">View All</Link>
                  </div>
                  <div className="stat-card">
                    <h3>Add New Listing</h3>
                    <p className="stat-description">Create a new property listing</p>
                    <Link to="/create-property" className="btn btn-primary">Add Property</Link>
                  </div>
                </>
              )}
            </div>
            
            <div className="recent-section">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
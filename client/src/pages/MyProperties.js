import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyContext from '../context/PropertyContext';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MyProperties = () => {
  const { myProperties, getMyProperties, loading, deleteProperty } = useContext(PropertyContext);

  useEffect(() => {
    getMyProperties();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      await deleteProperty(id);
    }
  };

  return (
    <div className="my-properties-page">
      <div className="container">
        <div className="page-header">
          <h1>My Property Listings</h1>
          <Link to="/create-property" className="btn btn-primary">
            Add New Property
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : myProperties.length === 0 ? (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>You haven't created any property listings yet</p>
            <Link to="/create-property" className="btn btn-primary">
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="my-properties-list">
            <table className="property-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProperties.map(property => (
                  <tr key={property.id}>
                    <td className="property-image">
                      {property.primary_image ? (
                        <img src={property.primary_image} alt={property.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>
                      <Link to={`/properties/${property.id}`}>{property.title}</Link>
                    </td>
                    <td>${property.price.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${property.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>{property.city}, {property.state}</td>
                    <td className="actions">
                      <Link to={`/edit-property/${property.id}`} className="btn-icon" title="Edit Property">
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(property.id)} 
                        className="btn-icon delete" 
                        title="Delete Property"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;
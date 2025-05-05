import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, edit
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('/api/properties/admin/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProperties(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || 'Error fetching properties');
      setProperties([]);
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (propertyId, updates) => {
    try {
      await axios.put(`/api/properties/admin/${propertyId}`, updates, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMessage('Property updated successfully');
      fetchProperties();
      setEditingProperty(null);
      setViewMode('list');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating property');
    }
  };

  const handleStatusUpdate = async (propertyId, updates) => {
    try {
      await axios.put(`/api/properties/admin/${propertyId}/status`, updates, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMessage('Property status updated');
      fetchProperties();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating property status');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/properties/admin/${propertyId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccessMessage('Property deleted successfully');
        fetchProperties();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting property');
      }
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setViewMode('edit');
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setViewMode('list');
  };

  const PropertyList = () => (
    <div className="property-table table-responsive">
      {properties && properties.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Agent</th>
              <th>Status</th>
              <th className="price-column">Price</th>
              <th>Featured</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.agent_name}</td>
                <td>
                  <select
                    className="form-control form-control-sm status-select"
                    value={property.status}
                    onChange={(e) =>
                      handleStatusUpdate(property.id, { status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </td>
                <td className="price-column">${property.price.toLocaleString()}</td>
                <td>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input featured-checkbox"
                      checked={property.featured}
                      onChange={() =>
                        handleStatusUpdate(property.id, { featured: !property.featured })
                      }
                    />
                  </div>
                </td>
                <td>
                  <select
                    className="form-control form-control-sm status-select"
                    value={property.verification_status}
                    onChange={(e) =>
                      handleStatusUpdate(property.id, {
                        verification_status: e.target.value,
                      })
                    }
                  >
                    <option value="pending" className="verification-pending">Pending</option>
                    <option value="verified" className="verification-verified">Verified</option>
                    <option value="rejected" className="verification-rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <div className="property-actions">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(property)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">
          {loading ? 'Loading properties...' : 'No properties found.'}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="property-management">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Property Management</h2>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Content */}
      {viewMode === 'list' && !editingProperty && <PropertyList />}
      {viewMode === 'edit' && editingProperty && (
        <div className="edit-form">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Edit Property</h3>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProperty(editingProperty.id, editingProperty);
          }}>
            <div className="form-group mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={editingProperty.title}
                onChange={(e) => setEditingProperty({
                  ...editingProperty,
                  title: e.target.value
                })}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={editingProperty.description}
                onChange={(e) => setEditingProperty({
                  ...editingProperty,
                  description: e.target.value
                })}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingProperty.price}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    price: parseFloat(e.target.value)
                  })}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label>Bedrooms</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingProperty.bedrooms}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    bedrooms: parseInt(e.target.value)
                  })}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label>Bathrooms</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingProperty.bathrooms}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    bathrooms: parseFloat(e.target.value)
                  })}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Square Feet</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingProperty.square_feet}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    square_feet: parseInt(e.target.value)
                  })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Property Type</label>
                <select
                  className="form-control"
                  value={editingProperty.property_type}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    property_type: e.target.value
                  })}
                  required
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mb-3">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.address}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    address: e.target.value
                  })}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>City</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.city}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    city: e.target.value
                  })}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>State</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.state}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    state: e.target.value
                  })}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.zip_code}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    zip_code: e.target.value
                  })}
                  required
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={editingProperty.featured}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    featured: e.target.checked
                  })}
                />
                <label className="form-check-label">Featured Property</label>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement; 
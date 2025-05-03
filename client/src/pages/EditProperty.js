import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyContext from '../context/PropertyContext';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, updateProperty, property, loading, error } = useContext(PropertyContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    property_type: '',
    status: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: '',
    longitude: '',
    images: ['']
  });

  useEffect(() => {
    getPropertyById(id);
    // eslint-disable-next-line 
  }, [id]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        square_feet: property.square_feet || '',
        property_type: property.property_type || 'Single Family',
        status: property.status || 'For Sale',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        images: property.images && property.images.length > 0 
          ? property.images.map(img => img.image_url) 
          : ['']
      });
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert numeric fields from strings to numbers
    const propertyData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      square_feet: parseInt(formData.square_feet),
      // Filter out empty image URLs
      images: formData.images.filter(url => url.trim() !== '')
    };
    
    // Add coordinates if provided
    if (formData.latitude) propertyData.latitude = parseFloat(formData.latitude);
    if (formData.longitude) propertyData.longitude = parseFloat(formData.longitude);
    
    const updatedProperty = await updateProperty(id, propertyData);
    if (updatedProperty) {
      navigate(`/properties/${id}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-property">
      <div className="container">
        <h1>Edit Property</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price* ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="property_type">Property Type*</label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Single Family">Single Family</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Multi Family">Multi Family</option>
                  <option value="Land">Land</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status*</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Property Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms*</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms*</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="square_feet">Square Feet*</label>
                <input
                  type="number"
                  id="square_feet"
                  name="square_feet"
                  value={formData.square_feet}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Location</h2>
            <div className="form-group">
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip_code">ZIP Code*</label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude (optional)</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.000001"
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude (optional)</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.000001"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Images</h2>
            <p className="form-note">Add image URLs (first image will be the primary image)</p>
            
            {formData.images.map((image, index) => (
              <div key={index} className="form-row image-row">
                <div className="form-group image-input">
                  <label htmlFor={`image-${index}`}>Image URL {index === 0 ? '(Primary)' : ''}</label>
                  <input
                    type="url"
                    id={`image-${index}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeImageField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addImageField}
            >
              Add Another Image
            </button>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Update Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
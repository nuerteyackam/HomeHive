import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropertyContext from '../context/PropertyContext';
import AuthContext from '../context/AuthContext';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const { property, getPropertyById, loading, saveProperty, removeSavedProperty, savedProperties, getSavedProperties, createEnquiry } = useContext(PropertyContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    getPropertyById(id);
    if (isAuthenticated) {
      getSavedProperties();
    }
    // eslint-disable-next-line
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && savedProperties.length > 0) {
      const saved = savedProperties.some(prop => prop.id === parseInt(id));
      setIsSaved(saved);
    }
  }, [savedProperties, id, isAuthenticated]);

  const handleSave = async () => {
    if (isSaved) {
      await removeSavedProperty(id);
      setIsSaved(false);
    } else {
      await saveProperty(id);
      setIsSaved(true);
    }
  };

  const handleEnquiryChange = (e) => {
    setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...enquiryData,
      property_id: id
    };
    
    const result = await createEnquiry(formData);
    if (result) {
      setEnquirySent(true);
      setEnquiryData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

  if (loading || !property) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="property-detail">
      <div className="container">
        <div className="property-header">
          <div>
            <h1 className="property-title">{property.title}</h1>
            <p className="property-address">
              <FaMapMarkerAlt /> {property.address}, {property.city}, {property.state} {property.zip_code}
            </p>
          </div>
          <div className="property-price-container">
            <h2 className="property-price">${property.price.toLocaleString()}</h2>
            <span className="property-status">{property.status}</span>
            {isAuthenticated && (
              <button className="btn-save" onClick={handleSave}>
                {isSaved ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                {isSaved ? ' Saved' : ' Save'}
              </button>
            )}
          </div>
        </div>

        <div className="property-gallery">
          {property.images && property.images.length > 0 ? (
            <Slider {...sliderSettings}>
              {property.images.map((image, index) => (
                <div key={index} className="property-image">
                  <img src={image.image_url} alt={`Property ${index + 1}`} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="no-images">No images available</div>
          )}
        </div>

        <div className="property-content">
          <div className="property-main">
            <div className="property-features">
              <div className="feature">
                <FaBed className="feature-icon" />
                <div>
                  <span className="feature-value">{property.bedrooms}</span>
                  <span className="feature-label">{property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
              </div>
              <div className="feature">
                <FaBath className="feature-icon" />
                <div>
                  <span className="feature-value">{property.bathrooms}</span>
                  <span className="feature-label">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
              </div>
              <div className="feature">
                <FaRuler className="feature-icon" />
                <div>
                  <span className="feature-value">{property.square_feet.toLocaleString()}</span>
                  <span className="feature-label">Square Feet</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-type">{property.property_type}</div>
              </div>
            </div>

            <div className="property-section">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
          </div>

          <div className="property-sidebar">
            <div className="agent-card">
              <h3>Contact Agent</h3>
              <p className="agent-name">{property.agent_name}</p>
              <p className="agent-email">{property.agent_email}</p>
              
              {enquirySent ? (
                <div className="alert alert-success">
                  Your enquiry has been sent! The agent will contact you soon.
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={enquiryData.name}
                      onChange={handleEnquiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={enquiryData.email}
                      onChange={handleEnquiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={enquiryData.phone}
                      onChange={handleEnquiryChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={enquiryData.message}
                      onChange={handleEnquiryChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
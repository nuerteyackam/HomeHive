import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaHeart, FaRegHeart } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import PropertyContext from '../../context/PropertyContext';

const PropertyCard = ({ property, saved }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { saveProperty, removeSavedProperty } = useContext(PropertyContext);

  const handleSave = async (e) => {
    e.preventDefault();
    if (saved) {
      await removeSavedProperty(property.id);
    } else {
      await saveProperty(property.id);
    }
  };

  return (
    <div className="property-card">
      <div className="property-card-image">
        <Link to={`/properties/${property.id}`}>
          {property.primary_image ? (
            <img src={property.primary_image} alt={property.title} />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </Link>
        <div className="property-card-badge">{property.status}</div>
        {isAuthenticated && (
          <button
            className="property-card-favorite"
            onClick={handleSave}
            aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          >
            {saved ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>
      <div className="property-card-content">
        <h3 className="property-card-price">${property.price.toLocaleString()}</h3>
        <h4 className="property-card-title">
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h4>
        <p className="property-card-address">
          {property.address}, {property.city}, {property.state} {property.zip_code}
        </p>
        <div className="property-card-features">
          <div className="property-card-feature">
            <FaBed /> {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
          </div>
          <div className="property-card-feature">
            <FaBath /> {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
          </div>
          <div className="property-card-feature">
            <FaRuler /> {property.square_feet.toLocaleString()} sqft
          </div>
        </div>
        <div className="property-card-type">{property.property_type}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
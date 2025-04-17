import React, { useContext, useEffect } from 'react';
import PropertyContext from '../context/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';

const SavedProperties = () => {
  const { savedProperties, getSavedProperties, loading } = useContext(PropertyContext);

  useEffect(() => {
    getSavedProperties();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="saved-properties-page">
      <div className="container">
        <h1>Saved Properties</h1>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : savedProperties.length === 0 ? (
          <div className="no-results">
            <h3>No saved properties found</h3>
            <p>Properties you save will appear here</p>
          </div>
        ) : (
          <div className="property-grid">
            {savedProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property}
                saved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
import React, { useContext, useEffect } from 'react';
import PropertyContext from '../context/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilter from '../components/properties/PropertyFilter';

const Properties = () => {
  const { filteredProperties, getProperties, loading, savedProperties } = useContext(PropertyContext);

  useEffect(() => {
    getProperties();
    // eslint-disable-next-line
  }, []);

  // Check if a property is saved
  const isPropertySaved = (id) => {
    return savedProperties.some(prop => prop.id === id);
  };

  return (
    <div className="properties-page">
      <div className="container">
        <h1>Browse Properties</h1>
        
        <div className="properties-layout">
          <div className="filter-sidebar">
            <PropertyFilter />
          </div>
          
          <div className="properties-content">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="no-results">
                <h3>No properties found</h3>
                <p>Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="property-grid">
                {filteredProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    saved={isPropertySaved(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
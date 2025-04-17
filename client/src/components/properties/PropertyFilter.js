import React, { useContext, useEffect } from 'react';
import PropertyContext from '../../context/PropertyContext';

const PropertyFilter = () => {
    const { filter, updateFilter, filterProperties } = useContext(PropertyContext);
  
    const handleChange = (e) => {
      updateFilter({ [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      filterProperties();
    };
  
    useEffect(() => {
      // Apply initial filters when component mounts
      filterProperties();
      // eslint-disable-next-line
    }, []);
  
    return (
      <form className="property-filter" onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={filter.city}
              onChange={handleChange}
              className="filter-input"
              placeholder="Search by city"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={filter.state}
              onChange={handleChange}
              className="filter-input"
              placeholder="Search by state"
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filter.minPrice}
              onChange={handleChange}
              className="filter-input"
              placeholder="Min price"
              min="0"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filter.maxPrice}
              onChange={handleChange}
              className="filter-input"
              placeholder="Max price"
              min="0"
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="beds">Beds</label>
            <select
              id="beds"
              name="beds"
              value={filter.beds}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="baths">Baths</label>
            <select
              id="baths"
              name="baths"
              value={filter.baths}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="1.5">1.5+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={filter.type}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Any</option>
              <option value="Single Family">Single Family</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Multi Family">Multi Family</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary filter-button">
          Apply Filters
        </button>
      </form>
    );
  };
  
  export default PropertyFilter;
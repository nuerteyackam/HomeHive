import { createContext, useState } from 'react';
import axios from 'axios';

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filter, setFilter] = useState({
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    type: '',
    status: 'For Sale'
  });

  // Get all properties
  const getProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/properties');
      setProperties(res.data);
      setFilteredProperties(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.msg || 'Error fetching properties');
      setLoading(false);
    }
  };

  // Get property by ID
  const getPropertyById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/properties/${id}`);
      setProperty(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.msg || 'Error fetching property');
      setLoading(false);
    }
  };

  // Create property
  const createProperty = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/properties', formData);
      setMyProperties([res.data, ...myProperties]);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data.msg || 'Error creating property');
      setLoading(false);
      return null;
    }
  };

  // Update property
  const updateProperty = async (id, formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/properties/${id}`, formData);
      setMyProperties(
        myProperties.map(prop => prop.id === id ? res.data : prop)
      );
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data.msg || 'Error updating property');
      setLoading(false);
      return null;
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/api/properties/${id}`);
      setMyProperties(myProperties.filter(prop => prop.id !== id));
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Error deleting property');
      setLoading(false);
      return false;
    }
  };

  // Get saved properties
  const getSavedProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users/saved-properties');
      setSavedProperties(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.msg || 'Error fetching saved properties');
      setLoading(false);
    }
  };

  // Save property
  const saveProperty = async (id) => {
    try {
      await axios.post(`/api/properties/${id}/save`);
      // Update saved properties list if it's loaded
      if (savedProperties.length > 0) {
        const propToSave = properties.find(p => p.id === id);
        if (propToSave) {
          setSavedProperties([...savedProperties, propToSave]);
        }
      }
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Error saving property');
      return false;
    }
  };

  // Remove saved property
  const removeSavedProperty = async (id) => {
    try {
      await axios.delete(`/api/properties/${id}/save`);
      setSavedProperties(savedProperties.filter(prop => prop.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Error removing saved property');
      return false;
    }
  };

  // Get my properties
  const getMyProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users/properties');
      setMyProperties(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.msg || 'Error fetching your properties');
      setLoading(false);
    }
  };

  // Get enquiries
  const getEnquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/enquiries');
      setEnquiries(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.msg || 'Error fetching enquiries');
      setLoading(false);
    }
  };

  // Create enquiry
  const createEnquiry = async (formData) => {
    try {
      const res = await axios.post('/api/enquiries', formData);
      return res.data;
    } catch (err) {
      setError(err.response?.data.msg || 'Error sending enquiry');
      return null;
    }
  };

  // Update enquiry status
  const updateEnquiryStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/enquiries/${id}`, { status });
      setEnquiries(
        enquiries.map(enq => enq.id === id ? res.data : enq)
      );
      return true;
    } catch (err) {
      setError(err.response?.data.msg || 'Error updating enquiry');
      return false;
    }
  };

  // Filter properties
  const filterProperties = () => {
    let filtered = properties;
    
    if (filter.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filter.city.toLowerCase())
      );
    }
    
    if (filter.state) {
      filtered = filtered.filter(p => 
        p.state.toLowerCase().includes(filter.state.toLowerCase())
      );
    }
    
    if (filter.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filter.minPrice));
    }
    
    if (filter.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filter.maxPrice));
    }
    
    if (filter.beds) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filter.beds));
    }
    
    if (filter.baths) {
      filtered = filtered.filter(p => p.bathrooms >= parseFloat(filter.baths));
    }
    
    if (filter.type) {
      filtered = filtered.filter(p => p.property_type === filter.type);
    }
    
    if (filter.status) {
      filtered = filtered.filter(p => p.status === filter.status);
    }
    
    setFilteredProperties(filtered);
  };

  // Update filter
  const updateFilter = (newFilter) => {
    setFilter({ ...filter, ...newFilter });
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        property,
        savedProperties,
        myProperties,
        enquiries,
        loading,
        error,
        filteredProperties,
        filter,
        getProperties,
        getPropertyById,
        createProperty,
        updateProperty,
        deleteProperty,
        getSavedProperties,
        saveProperty,
        removeSavedProperty,
        getMyProperties,
        getEnquiries,
        createEnquiry,
        updateEnquiryStatus,
        filterProperties,
        updateFilter,
        clearError
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyContext;
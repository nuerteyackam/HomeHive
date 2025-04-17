import React, { useContext, useEffect, useState } from 'react';
import PropertyContext from '../context/PropertyContext';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaCheck, FaClock, FaTimesCircle } from 'react-icons/fa';

const Enquiries = () => {
  const { enquiries, getEnquiries, loading, updateEnquiryStatus } = useContext(PropertyContext);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getEnquiries();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateEnquiryStatus(id, status);
  };

  const getFilteredEnquiries = () => {
    if (statusFilter === 'all') {
      return enquiries;
    }
    return enquiries.filter(enquiry => enquiry.status === statusFilter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'responded':
        return <FaCheck className="status-icon responded" />;
      case 'closed':
        return <FaTimesCircle className="status-icon closed" />;
      default:
        return null;
    }
  };

  const filteredEnquiries = getFilteredEnquiries();

  return (
    <div className="enquiries-page">
      <div className="container">
        <h1>Property Enquiries</h1>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'responded' ? 'active' : ''}`}
            onClick={() => setStatusFilter('responded')}
          >
            Responded
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'closed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('closed')}
          >
            Closed
          </button>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="no-results">
            <h3>No enquiries found</h3>
            {statusFilter !== 'all' ? (
              <p>No {statusFilter} enquiries at the moment</p>
            ) : (
              <p>You haven't received any enquiries yet</p>
            )}
          </div>
        ) : (
          <div className="enquiries-list">
            {filteredEnquiries.map(enquiry => (
              <div key={enquiry.id} className="enquiry-card">
                <div className="enquiry-header">
                  <div className="enquiry-property">
                    <h3>
                      <Link to={`/properties/${enquiry.property_id}`}>
                        {enquiry.property_title || `Property #${enquiry.property_id}`}
                      </Link>
                    </h3>
                    <span className="enquiry-date">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="enquiry-status">
                    {getStatusIcon(enquiry.status)}
                    <span className={`status-text ${enquiry.status}`}>
                      {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="enquiry-body">
                  <div className="enquiry-contact">
                    <h4>{enquiry.name}</h4>
                    <p>
                      <FaEnvelope /> {enquiry.email}
                    </p>
                    {enquiry.phone && (
                      <p>
                        <FaPhone /> {enquiry.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="enquiry-message">
                    <h4>Message:</h4>
                    <p>{enquiry.message}</p>
                  </div>
                </div>
                
                <div className="enquiry-actions">
                  <select
                    value={enquiry.status}
                    onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <a 
                    href={`mailto:${enquiry.email}?subject=RE: Enquiry for ${enquiry.property_title || `Property #${enquiry.property_id}`}`} 
                    className="btn btn-primary"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;
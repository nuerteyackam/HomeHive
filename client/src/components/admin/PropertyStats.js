import React from 'react';
import PropTypes from 'prop-types';

const PropertyStats = ({ stats }) => {
  if (!stats) return null;

  const { general_stats, property_types, monthly_trends } = stats;

  return (
    <div className="property-stats">
      {/* General Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body">
              <h5 className="card-title">Total Properties</h5>
              <p className="stats-number">{general_stats.total_properties}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body">
              <h5 className="card-title">Available</h5>
              <p className="stats-number">{general_stats.available_properties}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body">
              <h5 className="card-title">Sold</h5>
              <p className="stats-number">{general_stats.sold_properties}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body">
              <h5 className="card-title">Average Price</h5>
              <p className="stats-number">${parseFloat(general_stats.average_price).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Status */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Property Status</h5>
            </div>
            <div className="card-body">
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Available:</span>
                  <span className="status-value">{general_stats.available_properties}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Pending:</span>
                  <span className="status-value">{general_stats.pending_properties}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Sold:</span>
                  <span className="status-value">{general_stats.sold_properties}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Rented:</span>
                  <span className="status-value">{general_stats.rented_properties}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Verification Status</h5>
            </div>
            <div className="card-body">
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Pending:</span>
                  <span className="status-value">{general_stats.pending_verification}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Verified:</span>
                  <span className="status-value">{general_stats.verified_properties}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Rejected:</span>
                  <span className="status-value">{general_stats.rejected_properties}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Featured:</span>
                  <span className="status-value">{general_stats.featured_properties}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Property Types Distribution</h5>
            </div>
            <div className="card-body">
              <div className="property-types-grid">
                {property_types.map(type => (
                  <div key={type.property_type} className="property-type-item">
                    <span className="type-label">{type.property_type}:</span>
                    <span className="type-value">{type.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Monthly Trends (Last 6 Months)</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>New Listings</th>
                      <th>Properties Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly_trends.map(trend => (
                      <tr key={trend.month}>
                        <td>{new Date(trend.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                        <td>{trend.new_listings}</td>
                        <td>{trend.sold_properties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PropertyStats.propTypes = {
  stats: PropTypes.shape({
    general_stats: PropTypes.object.isRequired,
    property_types: PropTypes.array.isRequired,
    monthly_trends: PropTypes.array.isRequired
  })
};

export default PropertyStats; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import setAuthToken from '../utils/setAuthToken';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [formData, setFormData] = useState({
    purchasePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '',
    rent: '',
    tax: '',
    insurance: '',
    appreciationRate: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Ensure token is set before making requests
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      console.log('Analytics Debug:', {
        user,
        role: user.role,
        hasToken: !!localStorage.token
      });
      fetchAnalyses();
    }
  }, [user, navigate]);

  const fetchAnalyses = async () => {
    try {
      // Ensure token is set for this request
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      const response = await axios.get('/api/investment-analyses');
      console.log('Analyses fetched:', response.data);
      setAnalyses(response.data);
    } catch (error) {
      console.error('Error fetching analyses:', error.response || error);
      setError('Failed to fetch analyses. Please try logging out and back in.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateMetrics = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validate inputs
      const numericValues = {
        purchasePrice: parseFloat(formData.purchasePrice),
        downPayment: parseFloat(formData.downPayment),
        interestRate: parseFloat(formData.interestRate),
        loanTerm: parseFloat(formData.loanTerm),
        rent: parseFloat(formData.rent),
        tax: parseFloat(formData.tax),
        insurance: parseFloat(formData.insurance),
        appreciationRate: parseFloat(formData.appreciationRate)
      };

      // Check for invalid numbers
      if (Object.values(numericValues).some(isNaN)) {
        throw new Error('Please enter valid numbers for all fields');
      }

      const response = await axios.post('/api/investment-analyses', numericValues);
      setResults(response.data);
      fetchAnalyses();
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while calculating metrics');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/investment-analyses/${id}`);
      // Refresh the analyses list after deletion
      fetchAnalyses();
    } catch (error) {
      console.error('Error deleting analysis:', error);
      setError('Failed to delete analysis');
    }
  };

  const marketTrendLinks = [
    {
      id: 'historical-trends',
      title: 'Historical Price Trends',
      url: 'https://www.zillow.com/research/',
      description: 'Comprehensive housing market data and trends'
    },
    {
      id: 'city-performance',
      title: 'City-wise Performance',
      url: 'https://www.realtor.com/research/',
      description: 'Detailed city-by-city real estate market analysis'
    },
    {
      id: 'demand-patterns',
      title: 'Demand Patterns',
      url: 'https://www.redfin.com/news/data-center/',
      description: 'Real-time housing demand and market activity'
    },
    {
      id: 'seasonal-fluctuations',
      title: 'Seasonal Fluctuations',
      url: 'https://www.nar.realtor/research-and-statistics/housing-statistics',
      description: 'Seasonal housing market trends and patterns'
    }
  ];

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Investment Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        <div className="analysis-form-container">
          <h2>Investment Analysis Tool</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={calculateMetrics} className="analysis-form">
            <div className="form-group">
              <label>Purchase Price ($)</label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Down Payment (%)</label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Interest Rate (%)</label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Loan Term (years)</label>
              <input
                type="number"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Monthly Rent ($)</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Annual Tax ($)</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Annual Insurance ($)</label>
              <input
                type="number"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Annual Appreciation Rate (%)</label>
              <input
                type="number"
                name="appreciationRate"
                value={formData.appreciationRate}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="calculate-btn" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate Metrics'}
            </button>
          </form>
        </div>

        {results && (
          <div className="results-container">
            <h2>Analysis Results</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Return on Investment (ROI)</h3>
                <p className="metric-value">{parseFloat(results.roi).toFixed(2)}%</p>
              </div>
              <div className="metric-card">
                <h3>Monthly Cash Flow</h3>
                <p className="metric-value">${parseFloat(results.cash_flow).toFixed(2)}</p>
              </div>
              <div className="metric-card">
                <h3>Rental Yield</h3>
                <p className="metric-value">{parseFloat(results.rental_yield).toFixed(2)}%</p>
              </div>
              <div className="metric-card">
                <h3>Break-even Point</h3>
                <p className="metric-value">{parseFloat(results.break_even_point).toFixed(1)} months</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="market-trends-container">
        <h2>Market Trend Insights</h2>
        <div className="trend-links-grid">
          {marketTrendLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="trend-link-card"
            >
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="saved-analyses-container">
        <h2>Saved Analyses</h2>
        {analyses.length > 0 ? (
          <div className="analyses-grid">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="analysis-card">
                <h3>Analysis for ${parseFloat(analysis.purchase_price).toLocaleString()}</h3>
                <div className="analysis-details">
                  <p><strong>ROI:</strong> {parseFloat(analysis.roi).toFixed(2)}%</p>
                  <p><strong>Cash Flow:</strong> ${parseFloat(analysis.cash_flow).toFixed(2)}/month</p>
                  <p><strong>Rental Yield:</strong> {parseFloat(analysis.rental_yield).toFixed(2)}%</p>
                  <p><strong>Break-even Point:</strong> {parseFloat(analysis.break_even_point).toFixed(1)} months</p>
                  <p><strong>Date:</strong> {new Date(analysis.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <button 
                  className="delete-analysis-btn"
                  onClick={() => handleDelete(analysis.id)}
                  title="Delete Analysis"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No saved analyses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics; 
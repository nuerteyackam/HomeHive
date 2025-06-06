import axios from 'axios';

// Ensure the base URL is properly formatted
const getBaseUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  // Remove any trailing slashes
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Create axios instance with base URL
const instance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    // Debug log
    console.log('Making request to:', config.baseURL + config.url, {
      method: config.method,
      headers: config.headers
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default instance; 
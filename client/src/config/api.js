import axios from 'axios';

// Get the API URL from environment variables or use a default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to handle auth tokens
api.interceptors.request.use(
    (config) => {
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden
                    break;
                default:
                    // Handle other errors
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api; 
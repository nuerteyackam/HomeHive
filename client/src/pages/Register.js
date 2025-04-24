import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user', // Default role is 'user'
  });
  const [passwordError, setPasswordError] = useState('');
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password match error when either password field changes
    if (e.target.name === 'password' || e.target.name === 'password2') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Check if passwords match
    if (formData.password !== formData.password2) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Remove password2 from data sent to the server
    const { password2, ...registerData } = formData;

    const success = await register(registerData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="auth-container card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="text-center mb-4">Register</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              minLength="6"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password2" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="form-control"
              required
              minLength="6"
            />
            {passwordError && <p className="text-danger mt-2">{passwordError}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="user">Regular User</option>
              <option value="agent">Real Estate Agent</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
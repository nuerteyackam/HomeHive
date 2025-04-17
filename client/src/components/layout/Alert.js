import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import PropertyContext from '../../context/PropertyContext';

const Alert = () => {
  const { error: authError, clearError: clearAuthError } = useContext(AuthContext);
  const { error: propertyError, clearError: clearPropertyError } = useContext(PropertyContext);

  const error = authError || propertyError;

  const handleDismiss = () => {
    if (authError) clearAuthError();
    if (propertyError) clearPropertyError();
  };

  if (!error) return null;

  return (
    <div className="alert-container">
      <div className="alert alert-danger">
        <span>{error}</span>
        <button className="alert-close" onClick={handleDismiss}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
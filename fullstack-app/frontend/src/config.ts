// API Configuration
// Automatically detect backend URL based on environment

const getBackendURL = (): string => {
  // In development
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  }
  
  // In production, use the backend URL from environment variable
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Default fallback (shouldn't be used in production)
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBackendURL();

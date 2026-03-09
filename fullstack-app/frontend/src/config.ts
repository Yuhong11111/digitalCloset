// API Configuration
// Automatically detect backend URL based on environment

const getBackendURL = (): string => {
  // In production, prioritize environment variable
  if (process.env.REACT_APP_BACKEND_URL) {
    const url = process.env.REACT_APP_BACKEND_URL.trim();
    // Remove trailing slash if present
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // In development, default to localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Fallback
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBackendURL();

if (process.env.NODE_ENV !== 'test') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

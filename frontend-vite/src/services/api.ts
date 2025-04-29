import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from auth store
    const token = useAuthStore.getState().token;
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status } = error.response;
      
      // Handle unauthorized (expired or invalid token)
      if (status === 401) {
        // Logout user
        useAuthStore.getState().logout();
        // Redirect to login page (if using react-router)
        window.location.href = '/login';
      }
      
      // Handle forbidden
      if (status === 403) {
        console.error('Forbidden resource');
      }
      
      // Handle not found
      if (status === 404) {
        console.error('Resource not found');
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error, no response received');
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

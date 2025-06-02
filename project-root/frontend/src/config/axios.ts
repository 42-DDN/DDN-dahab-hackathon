import axios from 'axios';

// Configure axios globally for the entire application
axios.defaults.baseURL = 'http://56.228.19.249:5200'; // Updated to use EC2 IP
axios.defaults.withCredentials = true;

// Request interceptor to ensure cookies are always sent
axios.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is always true
    config.withCredentials = true;
    
    // Ensure Content-Type is set for POST/PUT requests
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // If unauthorized and it's not a login attempt, redirect to login
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      // Clear local storage
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;

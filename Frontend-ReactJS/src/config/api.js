import axios from 'axios';

// Uses relative URL in Docker production (Port 80 via Nginx proxy)
// Defaults to http://localhost:9000 only when running 'npm start' on port 3000/5173
export const API_BASE_URL = 
  (window.location.port === '3000' || window.location.port === '5173')
    ? 'http://localhost:9000'
    : '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamic Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

// Automatically uses relative URL when served via Nginx in Docker (Port 80)
// Defaults to http://localhost:9000 when running npm start on Port 3000/5173
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
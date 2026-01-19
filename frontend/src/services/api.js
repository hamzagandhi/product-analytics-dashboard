import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, password, age, gender) =>
    api.post('/auth/register', { username, password, age, gender }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password })
};

export const trackAPI = {
  track: (featureName) =>
    api.post('/track', { feature_name: featureName })
};

export const analyticsAPI = {
  getAnalytics: (params) =>
    api.get('/analytics', { params })
};

export default api;



import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Add Persona API calls
export const personaAPI = {
  create: async (personaData) => {
    const response = await api.post('/personas', personaData);
    return response.data;
  },

  getMyPersona: async () => {
    const response = await api.get('/personas/me');
    return response.data;
  },

  delete: async () => {
    const response = await api.delete('personas/me');
    return response.data;
  },
  
  update: async (personaData) => {
    const response = await api.put('/personas/me', personaData);
    return response.data;
  }

};

export default api;



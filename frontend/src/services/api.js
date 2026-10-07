import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use process.env.REACT_APP_API_URL if using Create React App
});
// Intercept requests to attach the auth token
api.interceptors.request.use(
  (config) => {
    // We will store our Zustand state in localStorage under 'auth-storage'
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state && state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
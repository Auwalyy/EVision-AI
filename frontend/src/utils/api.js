import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ev_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || err)
);

export const getLocations = (params) => api.get('/locations', { params });
export const getLocation = (id) => api.get(`/locations/${id}`);
export const getRecommendations = (params) => api.get('/recommendations', { params });
export const getRecommendation = (id) => api.get(`/recommendations/${id}`);
export const generateRecommendations = () => api.post('/recommendations/generate');
export const getAnalytics = () => api.get('/analytics');
export const getUsers = () => api.get('/auth/users');
export const uploadCSV = (formData) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const createLocation = (data) => api.post('/locations', data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);
export const getHealth = () => api.get('/health');

export default api;

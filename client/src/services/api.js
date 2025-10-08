import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  createOrUpdate: (userData) => api.post('/users', userData),
  getProfile: (uid) => api.get(`/users/${uid}`),
  updateProfile: (uid, data) => api.put(`/users/${uid}`, data),
  deleteUser: (uid) => api.delete(`/users/${uid}`),
};

export const expenseAPI = {
  create: (expenseData) => api.post('/expenses', expenseData),
  getAll: (userId) => api.get('/expenses', { params: { userId } }),
  getById: (id) => api.get(`/expenses/${id}`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: (userId, startDate, endDate) =>
    api.get('/expenses/stats', { params: { userId, startDate, endDate } }),
  getInsights: (userId, month, year) =>
    api.get('/expenses/insights', { params: { userId, month, year } }),
};

export default api;

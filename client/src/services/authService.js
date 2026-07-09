import axios from 'axios';

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authApi.post('/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await authApi.get('/me');
  return response.data.data;
};

export const getUsersCount = async () => {
  const response = await authApi.get('/users');
  return response.data.count;
};

export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

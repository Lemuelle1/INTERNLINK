import api from './api.js';

export const register = async (name, email, password, role) => {
  const res = await api.post('/auth/register', { name, email, password, role });
  if (res.token) { localStorage.setItem('token', res.token); window.location = '/pages/dashboard.html'; }
  return res;
};

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.token) { localStorage.setItem('token', res.token); window.location = '/pages/dashboard.html'; }
  return res;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location = '/pages/login.html';
};

export const getCurrentUser = () => api.get('/auth/me');

export const guardPage = () => {
  if (!localStorage.getItem('token')) window.location = '/pages/login.html';
};

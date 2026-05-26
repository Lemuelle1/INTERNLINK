import api from './api.js';

export const register = async (name, email, password, role) => {
  const res = await api.post('/auth/register', { name, email, password, role });
  if (res.token && res.user) {
    localStorage.setItem('token', res.token);
    if (res.user.role === 'admin') {
      window.location = '/pages/admin/dashboard.html';
    } else {
      window.location = '/pages/dashboard.html';
    }
  }
  return res;
};

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.token && res.user) {
    localStorage.setItem('token', res.token);
    if (res.user.role === 'admin') {
      window.location = '/pages/admin/dashboard.html';
    } else {
      window.location = '/pages/dashboard.html';
    }
  }
  return res;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location = '/pages/login.html';
};

export const getCurrentUser = () => api.get('/auth/me');

export const guardPage = async (requiredRole = '') => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location = '/pages/login.html';
    return null;
  }
  
  try {
    const user = await getCurrentUser();
    if (!user || !user._id) {
      localStorage.removeItem('token');
      window.location = '/pages/login.html';
      return null;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'admin') {
        window.location = '/pages/admin/dashboard.html';
      } else {
        window.location = '/pages/dashboard.html';
      }
      return null;
    }
    return user;
  } catch (err) {
    console.error('Page guard error:', err);
    localStorage.removeItem('token');
    window.location = '/pages/login.html';
    return null;
  }
};

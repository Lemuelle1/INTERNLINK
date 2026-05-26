import api from './api.js';

export const getUserProfile = () => api.get('/auth/me');

export const updateProfile = (profileData) => api.put('/users/profile', profileData);

export const uploadCV = (formData) => api.upload('/users/upload-cv', formData);

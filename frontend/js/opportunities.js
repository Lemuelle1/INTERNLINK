import api from './api.js';

export const getOpportunities = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.search) params.append('search', filters.search);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return api.get(`/opportunities${query}`);
};

export const getOpportunityById = (id) => api.get(`/opportunities/${id}`);

export const createOpportunity = (oppData) => api.post('/opportunities', oppData);

export const updateOpportunity = (id, oppData) => api.put(`/opportunities/${id}`, oppData);

export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);

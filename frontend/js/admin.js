import api from './api.js';

export const getAllApplications = () => api.get('/applications');

export const getOpportunityApplications = (oppId) => api.get(`/applications/opportunity/${oppId}`);

export const updateApplicationStatus = (appId, status) => 
  api.put(`/applications/${appId}/status`, { status });

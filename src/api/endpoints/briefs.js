import { api } from '../client';

export const briefsAPI = {
  // Brief creation
  createTextBrief: (data) => 
    api.post('/briefs/create-text', data),
  
  createFileBrief: (formData) => 
    api.upload('/briefs/create-file', formData),
  
  // Brief CRUD
  getBriefs: (params = {}) => 
    api.get('/briefs', { params }),
  
  getBrief: (briefId) => 
    api.get(`/briefs/${briefId}`),
  
  updateBrief: (briefId, data) => 
    api.put(`/briefs/${briefId}`, data),
  
  deleteBrief: (briefId) => 
    api.delete(`/briefs/${briefId}`),
  
  // AI operations
  extractBriefData: (briefId) => 
    api.post(`/briefs/${briefId}/extract`),
  
  generatePricingSuggestions: (briefId) => 
    api.post(`/briefs/${briefId}/pricing-suggestions`),
  
  assessRisk: (briefId) => 
    api.post(`/briefs/${briefId}/risk-assessment`),
  
  // Clarifications
  addClarification: (briefId, data) => 
    api.post(`/briefs/${briefId}/clarifications`, data),
  
  getClarifications: (briefId) => 
    api.get(`/briefs/${briefId}/clarifications`),
  
  sendClarificationEmail: (briefId, data) => 
    api.post(`/briefs/${briefId}/clarification-email`, data),
  
  // Conversion
  convertToDeal: (briefId, data) => 
    api.post(`/briefs/${briefId}/convert-to-deal`, data),
  
  // Templates
  saveBriefAsTemplate: (briefId, name) => 
    api.post(`/briefs/${briefId}/save-template`, { name }),
  
  getBriefTemplates: () => 
    api.get('/briefs/templates'),
  
  // Analytics
  getBriefAnalytics: () => 
    api.get('/briefs/analytics'),
  
  getDashboardStats: () => 
    api.get('/briefs/dashboard/stats'),
  
  // Search
  searchBriefs: (query) => 
    api.get('/briefs/search', { params: { q: query } }),
};
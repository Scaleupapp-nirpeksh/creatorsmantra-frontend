import { api } from '../client';

export const rateCardsAPI = {
  // Public endpoints
  getPublicRateCard: (shortCode) => 
    api.get(`/ratecards/public/${shortCode}`),
  
  // Rate card CRUD
  createRateCard: (data) => 
    api.post('/ratecards', data),
  
  getRateCards: (params = {}) => 
    api.get('/ratecards', { params }),
  
  getRateCard: (id) => 
    api.get(`/ratecards/${id}`),
  
  updateRateCard: (id, data) => 
    api.put(`/ratecards/${id}`, data),
  
  deleteRateCard: (id) => 
    api.delete(`/ratecards/${id}`),
  
  // Operations
  cloneRateCard: (id, name) => 
    api.post(`/ratecards/${id}/clone`, { name }),
  
  saveAsTemplate: (id, templateName) => 
    api.post(`/ratecards/${id}/save-as-template`, { templateName }),
  
  // Templates
  getRateCardTemplates: () => 
    api.get('/ratecards/templates'),
  
  // AI features
  generateAISuggestions: (data) => 
    api.post('/ratecards/ai-suggestions', data),
  
  // Bulk operations
  bulkUpdateRates: (updates) => 
    api.post('/ratecards/bulk-update', updates),
  
  // Packages
  createPackage: (rateCardId, packageData) => 
    api.post(`/ratecards/${rateCardId}/packages`, packageData),
  
  updatePackage: (rateCardId, packageId, data) => 
    api.put(`/ratecards/${rateCardId}/packages/${packageId}`, data),
  
  deletePackage: (rateCardId, packageId) => 
    api.delete(`/ratecards/${rateCardId}/packages/${packageId}`),
  
  // PDF generation
  generatePDF: (id) => 
    api.download(`/ratecards/${id}/pdf`, `ratecard-${id}.pdf`),
  
  // Sharing
  shareRateCard: (id, shareData) => 
    api.post(`/ratecards/${id}/share`, shareData),
  
  // Analytics
  getRateCardAnalytics: (id) => 
    api.get(`/ratecards/${id}/analytics`),
  
  // Version history
  getVersionHistory: (id) => 
    api.get(`/ratecards/${id}/versions`),
  
  restoreVersion: (id, versionId) => 
    api.post(`/ratecards/${id}/restore-version`, { versionId }),
  
  // Categories & platforms
  getCategories: () => 
    api.get('/ratecards/categories'),
  
  getPlatforms: () => 
    api.get('/ratecards/platforms'),
  
  // Search
  searchRateCards: (query) => 
    api.get('/ratecards/search', { params: { q: query } }),
};
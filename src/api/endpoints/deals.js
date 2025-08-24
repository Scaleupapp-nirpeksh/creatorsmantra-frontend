import { api } from '../client';

export const dealsAPI = {
  // Health check
  health: () => 
    api.get('/deals/health'),
  
  // Deal CRUD
  createDeal: (data) => 
    api.post('/deals', data),
  
  getDeals: (params = {}) => 
    api.get('/deals', { params }),
  
  getDeal: (dealId) => 
    api.get(`/deals/${dealId}`),
  
  updateDeal: (dealId, data) => 
    api.put(`/deals/${dealId}`, data),
  
  deleteDeal: (dealId) => 
    api.delete(`/deals/${dealId}`),
  
  // Deal operations
  archiveDeal: (dealId, archived = true) => 
    api.put(`/deals/${dealId}/archive`, { archived }),
  
  updateDealStage: (dealId, stage, reason) => 
    api.put(`/deals/${dealId}/stage`, { stage, reason }),
  
  // Communications
  addCommunication: (dealId, data) => 
    api.post(`/deals/${dealId}/communications`, data),
  
  getCommunications: (dealId) => 
    api.get(`/deals/${dealId}/communications`),
  
  updateCommunication: (dealId, commId, data) => 
    api.put(`/deals/${dealId}/communications/${commId}`, data),
  
  // Deliverables
  addDeliverable: (dealId, data) => 
    api.post(`/deals/${dealId}/deliverables`, data),
  
  updateDeliverable: (dealId, deliverableId, data) => 
    api.put(`/deals/${dealId}/deliverables/${deliverableId}`, data),
  
  // Quick actions
  performQuickAction: (dealId, action, data) => 
    api.post(`/deals/${dealId}/actions/${action}`, data),
  
  // Pipeline
  getPipelineOverview: () => 
    api.get('/deals/pipeline/overview'),
  
  getDealsByStage: (stage) => 
    api.get(`/deals/pipeline/${stage}`),
  
  getAttentionNeeded: () => 
    api.get('/deals/attention'),
  
  // Brands
  getBrands: () => 
    api.get('/deals/brands'),
  
  getBrand: (brandId) => 
    api.get(`/deals/brands/${brandId}`),
  
  updateBrand: (brandId, data) => 
    api.put(`/deals/brands/${brandId}`, data),
  
  // Templates
  createTemplate: (data) => 
    api.post('/deals/templates', data),
  
  getTemplates: () => 
    api.get('/deals/templates'),
  
  updateTemplate: (templateId, data) => 
    api.put(`/deals/templates/${templateId}`, data),
  
  deleteTemplate: (templateId) => 
    api.delete(`/deals/templates/${templateId}`),
  
  // Analytics
  getRevenueAnalytics: (params) => 
    api.get('/deals/analytics/revenue', { params }),
  
  getDealInsights: () => 
    api.get('/deals/analytics/insights'),
  
  getDealSummary: () => 
    api.get('/deals/analytics/summary'),
  
  // Bulk operations
  bulkUpdateDeals: (dealIds, updates) => 
    api.put('/deals/bulk', { dealIds, updates }),
  
  // Metadata
  getDealMetadata: () => 
    api.get('/deals/metadata'),
};
import { api } from '../client';

export const contractsAPI = {
  // Contract CRUD
  createContract: (data) => 
    api.post('/contracts', data),
  
  getContracts: (params = {}) => 
    api.get('/contracts', { params }),
  
  getContract: (contractId) => 
    api.get(`/contracts/${contractId}`),
  
  updateContract: (contractId, data) => 
    api.put(`/contracts/${contractId}`, data),
  
  deleteContract: (contractId) => 
    api.delete(`/contracts/${contractId}`),
  
  // Contract status
  updateStatus: (contractId, status, reason) => 
    api.put(`/contracts/${contractId}/status`, { status, reason }),
  
  signContract: (contractId, signature) => 
    api.post(`/contracts/${contractId}/sign`, { signature }),
  
  // Templates
  createTemplate: (data) => 
    api.post('/contracts/templates', data),
  
  getTemplates: () => 
    api.get('/contracts/templates'),
  
  getTemplate: (templateId) => 
    api.get(`/contracts/templates/${templateId}`),
  
  updateTemplate: (templateId, data) => 
    api.put(`/contracts/templates/${templateId}`, data),
  
  deleteTemplate: (templateId) => 
    api.delete(`/contracts/templates/${templateId}`),
  
  // Clauses
  addClause: (contractId, clause) => 
    api.post(`/contracts/${contractId}/clauses`, clause),
  
  updateClause: (contractId, clauseId, data) => 
    api.put(`/contracts/${contractId}/clauses/${clauseId}`, data),
  
  deleteClause: (contractId, clauseId) => 
    api.delete(`/contracts/${contractId}/clauses/${clauseId}`),
  
  // Milestones
  addMilestone: (contractId, milestone) => 
    api.post(`/contracts/${contractId}/milestones`, milestone),
  
  updateMilestone: (contractId, milestoneId, data) => 
    api.put(`/contracts/${contractId}/milestones/${milestoneId}`, data),
  
  getMilestones: (contractId) => 
    api.get(`/contracts/${contractId}/milestones`),
  
  // Documents
  uploadDocument: (contractId, formData) => 
    api.upload(`/contracts/${contractId}/documents`, formData),
  
  getDocuments: (contractId) => 
    api.get(`/contracts/${contractId}/documents`),
  
  downloadDocument: (contractId, documentId) => 
    api.download(`/contracts/${contractId}/documents/${documentId}`, `contract-doc-${documentId}`),
  
  // Review
  requestReview: (contractId, reviewers) => 
    api.post(`/contracts/${contractId}/review`, { reviewers }),
  
  submitReview: (contractId, review) => 
    api.post(`/contracts/${contractId}/review/submit`, review),
  
  // Analytics
  getContractAnalytics: () => 
    api.get('/contracts/analytics'),
  
  getRiskAssessment: (contractId) => 
    api.get(`/contracts/${contractId}/risk-assessment`),
  
  // Export
  exportContract: (contractId, format) => 
    api.download(`/contracts/${contractId}/export`, `contract-${contractId}.${format}`, { params: { format } }),
};
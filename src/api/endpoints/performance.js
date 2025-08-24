import { api } from '../client';

export const performanceAPI = {
  // Health check
  health: () => 
    api.get('/performance/health'),
  
  // Campaign Performance
  createCampaign: (data) => 
    api.post('/performance/campaigns', data),
  
  getCampaigns: (params = {}) => 
    api.get('/performance/campaigns', { params }),
  
  getCampaign: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}`),
  
  updateCampaign: (campaignId, data) => 
    api.put(`/performance/campaigns/${campaignId}`, data),
  
  deleteCampaign: (campaignId) => 
    api.delete(`/performance/campaigns/${campaignId}`),
  
  // Content Performance
  createContent: (campaignId, data) => 
    api.post(`/performance/campaigns/${campaignId}/content`, data),
  
  getContent: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/content`),
  
  updateContent: (campaignId, contentId, data) => 
    api.put(`/performance/campaigns/${campaignId}/content/${contentId}`, data),
  
  deleteContent: (campaignId, contentId) => 
    api.delete(`/performance/campaigns/${campaignId}/content/${contentId}`),
  
  // Metrics
  updateMetrics: (campaignId, contentId, metrics) => 
    api.post(`/performance/campaigns/${campaignId}/content/${contentId}/metrics`, metrics),
  
  getMetrics: (campaignId, contentId) => 
    api.get(`/performance/campaigns/${campaignId}/content/${contentId}/metrics`),
  
  // Platform connections
  connectPlatform: (platform, credentials) => 
    api.post('/performance/platforms/connect', { platform, credentials }),
  
  disconnectPlatform: (platform) => 
    api.delete(`/performance/platforms/${platform}`),
  
  syncPlatformData: (platform) => 
    api.post(`/performance/platforms/${platform}/sync`),
  
  getPlatformStatus: () => 
    api.get('/performance/platforms/status'),
  
  // Analytics
  getCampaignAnalytics: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/analytics`),
  
  getContentAnalytics: (contentId) => 
    api.get(`/performance/content/${contentId}/analytics`),
  
  getPerformanceDashboard: () => 
    api.get('/performance/dashboard'),
  
  getROIAnalysis: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/roi`),
  
  // Reports
  generateReport: (type, params) => 
    api.post('/performance/reports/generate', { type, params }),
  
  getReports: () => 
    api.get('/performance/reports'),
  
  downloadReport: (reportId) => 
    api.download(`/performance/reports/${reportId}/download`, `report-${reportId}.pdf`),
  
  // Benchmarks
  getBenchmarks: (industry, platform) => 
    api.get('/performance/benchmarks', { params: { industry, platform } }),
  
  compareToBenchmark: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/benchmark`),
  
  // Goals
  setGoals: (campaignId, goals) => 
    api.post(`/performance/campaigns/${campaignId}/goals`, goals),
  
  getGoals: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/goals`),
  
  getGoalProgress: (campaignId) => 
    api.get(`/performance/campaigns/${campaignId}/goals/progress`),
};
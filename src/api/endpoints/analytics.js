import { api } from '../client';

export const analyticsAPI = {
  // Health check
  health: () => 
    api.get('/analytics/health'),
  
  getDocs: () => 
    api.get('/analytics/docs'),
  
  // Dashboard analytics
  getDashboard: (params = {}) => 
    api.get('/analytics/dashboard', { params }),
  
  getCustomDashboard: (data) => 
    api.post('/analytics/dashboard/custom', data),
  
  // Revenue analytics
  getRevenue: (params = {}) => 
    api.get('/analytics/revenue', { params }),
  
  getRevenueBreakdown: (params = {}) => 
    api.get('/analytics/revenue/breakdown', { params }),
  
  // Deal analytics
  getDealFunnel: (params = {}) => 
    api.get('/analytics/deals/funnel', { params }),
  
  getDealPerformance: (params = {}) => 
    api.get('/analytics/deals/performance', { params }),
  
  // AI Insights
  getInsights: (params = {}) => 
    api.get('/analytics/insights', { params }),
  
  generateInsights: (data) => 
    api.post('/analytics/insights/generate', data),
  
  updateInsightStatus: (insightId, status) => 
    api.patch(`/analytics/insights/${insightId}/status`, { status }),
  
  // Trends
  getTrends: (params = {}) => 
    api.get('/analytics/trends', { params }),
  
  // Forecasting
  getForecast: (params = {}) => 
    api.get('/analytics/forecast', { params }),
  
  // Risk analysis
  getRiskAnalysis: (params = {}) => 
    api.get('/analytics/risk', { params }),
  
  // Cache management
  clearCache: () => 
    api.delete('/analytics/cache'),
  
  getCacheStats: () => 
    api.get('/analytics/cache/stats'),
  
  // Export
  exportAnalytics: (type, params) => 
    api.download(`/analytics/export/${type}`, `analytics-${type}-${Date.now()}.csv`, { params }),
  
  // Comparison
  getCreatorComparison: (creatorIds) => 
    api.get('/analytics/agency/comparison', { params: { creatorIds } }),
  
  // Custom queries
  runCustomQuery: (query) => 
    api.post('/analytics/query', { query }),
};
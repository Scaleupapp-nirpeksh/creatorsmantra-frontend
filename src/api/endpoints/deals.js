/**
 * Deals API Endpoints - Complete Implementation
 * Path: src/api/endpoints/deals.js
 * 
 * FIXED: Updated to use correct field names that backend expects
 * - brand (not brandName)
 * - dealValue (not value)
 * - platform (required field)
 */

import { api } from '../client';

export const dealsAPI = {
  // ==================== Health Check ====================
  
  // Check if deals service is running
  health: () => 
    api.get('/deals/health'),
  
  // ==================== Deal CRUD Operations ====================
  
  createDeal: (data) => {
    // Don't flatten the structure, send as-is
    return api.post('/deals', data);
  },
  
  // Get all deals with filters
  getDeals: (params = {}) => {
    // Clean params
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    
    return api.get('/deals', { params: cleanParams });
  },
  
  // Get single deal by ID
  getDeal: (dealId) => 
    api.get(`/deals/${dealId}`),
  
  // Update existing deal - FIXED TO USE CORRECT FIELD NAMES
  updateDeal: (dealId, data) => {
    // Clean update data with correct field mapping
    const cleanData = {};
    
    // Map fields with correct names
    if (data.title !== undefined) cleanData.title = data.title;
    if (data.brand !== undefined) cleanData.brand = data.brand; // NOT brandName
    if (data.dealValue !== undefined) cleanData.dealValue = parseFloat(data.dealValue); // NOT value
    if (data.platform !== undefined) cleanData.platform = data.platform;
    if (data.stage !== undefined) cleanData.stage = data.stage;
    
    // Handle all other fields
    const directCopyFields = [
      'brandWebsite', 'brandCategory', 'brandInstagram',
      'contactName', 'contactEmail', 'contactPhone', 'contactDesignation',
      'deadline', 'campaignStartDate', 'campaignEndDate',
      'brief', 'notes', 'paymentTerms', 'paymentMethod',
      'gstApplicable', 'gstNumber', 'advancePercentage',
      'priority', 'status', 'tags',
      'contractRequired', 'exclusivityRequired', 'usageRights',
      'currency', 'deliverables'
    ];
    
    directCopyFields.forEach(field => {
      if (data[field] !== undefined) {
        cleanData[field] = data[field];
      }
    });
    
    // Special handling for deliverables
    if (data.deliverables) {
      cleanData.deliverables = data.deliverables.map(d => ({
        type: d.type,
        quantity: parseInt(d.quantity) || 1,
        description: d.description || 'Content creation',
        status: d.status || 'pending',
        ...(d.deadline && { deadline: d.deadline })
      }));
    }
    
    return api.put(`/deals/${dealId}`, cleanData);
  },
  
  // Delete deal
  deleteDeal: (dealId) => 
    api.delete(`/deals/${dealId}`),
  
  // ==================== Deal Operations ====================
  
  // Archive or unarchive a deal
  archiveDeal: (dealId, archived = true) => 
    api.put(`/deals/${dealId}/archive`, { archived }),
  
  // Update deal stage (move in pipeline)
  updateDealStage: (dealId, stage, reason = null) => 
    api.put(`/deals/${dealId}/stage`, { 
      stage, 
      ...(reason && { reason })
    }),
  
  // ==================== Communications ====================
  
  // Add communication to deal
  addCommunication: (dealId, data) => 
    api.post(`/deals/${dealId}/communications`, data),
  
  // Get all communications for a deal
  getCommunications: (dealId) => 
    api.get(`/deals/${dealId}/communications`),
  
  // Update specific communication
  updateCommunication: (dealId, commId, data) => 
    api.put(`/deals/${dealId}/communications/${commId}`, data),
  
  // ==================== Deliverables ====================
  
  // Add deliverable to deal
  addDeliverable: (dealId, data) => 
    api.post(`/deals/${dealId}/deliverables`, data),
  
  // Update deliverable
  updateDeliverable: (dealId, deliverableId, data) => 
    api.put(`/deals/${dealId}/deliverables/${deliverableId}`, data),
  
  // ==================== Quick Actions ====================
  
  // Perform quick action on deal
  performQuickAction: (dealId, action, data = {}) => 
    api.post(`/deals/${dealId}/actions/${action}`, data),
  
  // Common quick actions
  quickActions: {
    sendReminder: (dealId) => 
      api.post(`/deals/${dealId}/actions/send-reminder`, {}),
    
    markAsUrgent: (dealId) => 
      api.post(`/deals/${dealId}/actions/mark-urgent`, {}),
    
    requestApproval: (dealId) => 
      api.post(`/deals/${dealId}/actions/request-approval`, {}),
    
    generateInvoice: (dealId) => 
      api.post(`/deals/${dealId}/actions/generate-invoice`, {})
  },
  
  // ==================== Pipeline Management ====================
  
  // Get pipeline overview with all stages
  getPipelineOverview: () => 
    api.get('/deals/pipeline/overview'),
  
  // Get deals by specific stage
  getDealsByStage: (stage) => 
    api.get(`/deals/pipeline/${stage}`),
  
  // Get deals that need attention
  getAttentionNeeded: () => 
    api.get('/deals/attention'),
  
  // ==================== Brands Management ====================
  
  // Get all brands
  getBrands: () => 
    api.get('/deals/brands'),
  
  // Get specific brand
  getBrand: (brandId) => 
    api.get(`/deals/brands/${brandId}`),
  
  // Update brand information
  updateBrand: (brandId, data) => 
    api.put(`/deals/brands/${brandId}`, data),
  
  // ==================== Templates ====================
  
  // Create deal template
  createTemplate: (data) => 
    api.post('/deals/templates', data),
  
  // Get all templates
  getTemplates: () => 
    api.get('/deals/templates'),
  
  // Update template
  updateTemplate: (templateId, data) => 
    api.put(`/deals/templates/${templateId}`, data),
  
  // Delete template
  deleteTemplate: (templateId) => 
    api.delete(`/deals/templates/${templateId}`),
  
  // Apply template to new deal
  applyTemplate: (templateId) => 
    api.get(`/deals/templates/${templateId}/apply`),
  
  // ==================== Analytics & Reports ====================
  
  // Get revenue analytics
  getRevenueAnalytics: (params = {}) => {
    const defaultParams = {
      startDate: params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: params.endDate || new Date().toISOString(),
      groupBy: params.groupBy || 'day'
    };
    
    return api.get('/deals/analytics/revenue', { 
      params: { ...defaultParams, ...params }
    });
  },
  
  // Get deal insights
  getDealInsights: () => 
    api.get('/deals/analytics/insights'),
  
  // Get deal summary
  getDealSummary: () => 
    api.get('/deals/analytics/summary'),
  
  // Get conversion funnel
  getConversionFunnel: (params = {}) => 
    api.get('/deals/analytics/funnel', { params }),
  
  // Get performance metrics
  getPerformanceMetrics: (params = {}) => 
    api.get('/deals/analytics/performance', { params }),
  
  // ==================== Bulk Operations ====================
  
  // Bulk update multiple deals - FIXED FIELD NAMES
  bulkUpdateDeals: (dealIds, updates) => {
    // Map field names if needed
    const mappedUpdates = { ...updates };
    if ('brand' in updates) mappedUpdates.brand = updates.brand;
    if ('dealValue' in updates) mappedUpdates.dealValue = updates.dealValue;
    
    return api.put('/deals/bulk', { 
      dealIds: Array.isArray(dealIds) ? dealIds : [dealIds],
      updates: mappedUpdates
    });
  },
  
  // Bulk delete deals
  bulkDeleteDeals: (dealIds) => 
    api.delete('/deals/bulk', { 
      data: { dealIds: Array.isArray(dealIds) ? dealIds : [dealIds] }
    }),
  
  // Bulk archive deals
  bulkArchiveDeals: (dealIds, archived = true) => 
    api.put('/deals/bulk/archive', { 
      dealIds: Array.isArray(dealIds) ? dealIds : [dealIds],
      archived 
    }),
  
  // Bulk move deals to stage
  bulkMoveToStage: (dealIds, stage) => 
    api.put('/deals/bulk/stage', { 
      dealIds: Array.isArray(dealIds) ? dealIds : [dealIds],
      stage 
    }),
  
  // ==================== Metadata & Configuration ====================
  
  // Get deal metadata (stages, statuses, etc.)
  getDealMetadata: () => 
    api.get('/deals/metadata'),
  
  // Get deal stages configuration
  getStages: () => 
    api.get('/deals/metadata/stages'),
  
  // Get deal statuses
  getStatuses: () => 
    api.get('/deals/metadata/statuses'),
  
  // Get priority levels
  getPriorities: () => 
    api.get('/deals/metadata/priorities'),
  
  // ==================== Search & Filters ====================
  
  // Search deals
  searchDeals: (query, filters = {}) => 
    api.get('/deals/search', { 
      params: { q: query, ...filters }
    }),
  
  // Get saved filters
  getSavedFilters: () => 
    api.get('/deals/filters'),
  
  // Save a filter
  saveFilter: (filter) => 
    api.post('/deals/filters', filter),
  
  // Delete saved filter
  deleteFilter: (filterId) => 
    api.delete(`/deals/filters/${filterId}`),
  
  // ==================== Notes & Activities ====================
  
  // Add note to deal
  addNote: (dealId, note) => 
    api.post(`/deals/${dealId}/notes`, { 
      content: note.content || note,
      type: note.type || 'general'
    }),
  
  // Get deal notes
  getNotes: (dealId) => 
    api.get(`/deals/${dealId}/notes`),
  
  // Add activity log
  addActivity: (dealId, activity) => 
    api.post(`/deals/${dealId}/activities`, activity),
  
  // Get deal activities
  getActivities: (dealId) => 
    api.get(`/deals/${dealId}/activities`),
  
  // ==================== Documents & Files ====================
  
  // Upload document
  uploadDocument: (dealId, formData) => 
    api.post(`/deals/${dealId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // Get deal documents
  getDocuments: (dealId) => 
    api.get(`/deals/${dealId}/documents`),
  
  // Delete document
  deleteDocument: (dealId, documentId) => 
    api.delete(`/deals/${dealId}/documents/${documentId}`),
  
  // ==================== Export & Import ====================
  
  // Export deals to CSV
  exportDeals: (filters = {}) => 
    api.get('/deals/export', { 
      params: filters,
      responseType: 'blob'
    }),
  
  // Import deals from CSV
  importDeals: (formData) => 
    api.post('/deals/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // ==================== Utility Functions ====================
  
  // Validate deal data before submission
  validateDeal: (data) => {
    // Map fields to backend format for validation
    const mappedData = {
      ...data,
      brand: data.brand || data.brandName,
      dealValue: data.dealValue || data.value,
      platform: data.platform || 'instagram'
    };
    return api.post('/deals/validate', mappedData);
  },
  
  // Get duplicate deals - FIXED field name
  checkDuplicates: (brand, title) => 
    api.get('/deals/duplicates', { 
      params: { brand, title } // Changed from brandName to brand
    }),
  
  // Get deal history/changelog
  getDealHistory: (dealId) => 
    api.get(`/deals/${dealId}/history`),
  
  // Restore deleted deal
  restoreDeal: (dealId) => 
    api.post(`/deals/${dealId}/restore`),
  
  // ==================== Helper Methods ====================
  
  // Format deal for display - UPDATED TO HANDLE BOTH FIELD NAMES
  formatDeal: (deal) => ({
    ...deal,
    value: parseFloat(deal.dealValue || deal.value) || 0,
    formattedValue: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: deal.currency || 'INR'
    }).format(deal.dealValue || deal.value || 0),
    formattedDeadline: deal.deadline 
      ? new Date(deal.deadline).toLocaleDateString('en-IN')
      : 'No deadline',
    stageName: deal.stage?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }),
  
  // Get stage color
  getStageColor: (stage) => {
    const colors = {
      lead: '#8B5CF6',
      negotiation: '#3B82F6',
      confirmed: '#10B981',
      content_creation: '#F59E0B',
      delivered: '#6366F1',
      paid: '#22C55E',
      lost: '#EF4444'
    };
    return colors[stage] || '#6B7280';
  },
  
  // Calculate deal health score
  calculateHealth: (deal) => {
    let score = 100;
    const now = new Date();
    const deadline = new Date(deal.deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) score -= 30;
    else if (daysLeft < 7) score -= 15;
    
    if (!deal.contractSigned) score -= 20;
    if (!deal.brief) score -= 10;
    if (!deal.deliverables?.length) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }
};

// Export as default as well for compatibility
export default dealsAPI;
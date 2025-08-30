// src/api/endpoints/briefs.js
import { api } from '../client';

export const briefsAPI = {
  // ============================================
  // BRIEF CREATION
  // ============================================
  
  createTextBrief: (data) =>
    api.post('/briefs/create-text', {
      rawText: data.rawText,
      notes: data.notes,
      tags: data.tags
    }),

  createFileBrief: (fileData, progressCallback = null) => {
    const formData = new FormData();
    formData.append('briefFile', fileData.file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (progressCallback) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(progress);
      };
    }

    return api.post('/briefs/create-file', formData, config);
  },

  // ============================================
  // BRIEF RETRIEVAL
  // ============================================

  getDashboardStats: () =>
    api.get('/briefs/dashboard/stats'),

  getBriefMetadata: () =>
    api.get('/briefs/metadata'),

  getCreatorBriefs: (filters = {}) =>
    api.get('/briefs', { params: {
      status: filters.status,
      inputType: filters.inputType,
      page: filters.page || 1,
      limit: filters.limit || 20,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
      search: filters.search,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      estimatedValueMin: filters.estimatedValueMin,
      estimatedValueMax: filters.estimatedValueMax
    }}),

  getBriefsByStatus: (status) =>
    api.get(`/briefs/status/${status}`),

  getBriefById: (briefId) =>
    api.get(`/briefs/${briefId}`),

  getBriefSummary: (briefId) =>
    api.get(`/briefs/${briefId}/summary`),

  // ============================================
  // BRIEF UPDATES
  // ============================================

  updateBrief: (briefId, data) =>
    api.patch(`/briefs/${briefId}`, {
      creatorNotes: data.creatorNotes,
      tags: data.tags,
      status: data.status
    }),

  updateBriefStatus: (briefId, status, reason = '') =>
    api.patch(`/briefs/${briefId}/status`, {
      status,
      reason
    }),

  updateCreatorNotes: (briefId, notes) =>
    api.patch(`/briefs/${briefId}/notes`, {
      notes
    }),

  updateBriefTags: (briefId, tags) =>
    api.patch(`/briefs/${briefId}/tags`, {
      tags
    }),

  bulkUpdateBriefs: (briefIds, updateData) =>
    api.patch('/briefs/bulk-update', {
      briefIds,
      updateData
    }),

  // ============================================
  // AI PROCESSING
  // ============================================

  triggerAIExtraction: (briefId, options = {}) =>
    api.post(`/briefs/${briefId}/extract`, {
      forceReprocess: options.forceReprocess || false,
      extractionOptions: options.extractionOptions
    }),

  getExtractionStatus: (briefId) =>
    api.get(`/briefs/${briefId}/extraction-status`),

  // ============================================
  // CLARIFICATION MANAGEMENT
  // ============================================

  generateClarificationEmail: (briefId) =>
    api.post(`/briefs/${briefId}/clarification-email`),

  addClarificationQuestion: (briefId, question, category = 'other', priority = 'medium') =>
    api.post(`/briefs/${briefId}/clarifications`, {
      question,
      category,
      priority
    }),

  answerClarificationQuestion: (briefId, questionId, answer) =>
    api.patch(`/briefs/${briefId}/clarifications/${questionId}`, {
      answer
    }),

  // ============================================
  // DEAL CONVERSION
  // ============================================

  getDealPreview: (briefId) =>
    api.get(`/briefs/${briefId}/deal-preview`),

  convertToDeal: (briefId, dealOverrides = {}) =>
    api.post(`/briefs/${briefId}/convert-to-deal`, {
      brandName: dealOverrides.brandName,
      campaignName: dealOverrides.campaignName,
      platform: dealOverrides.platform,
      amount: dealOverrides.amount,
      gstApplicable: dealOverrides.gstApplicable,
      tdsApplicable: dealOverrides.tdsApplicable,
      responseDeadline: dealOverrides.responseDeadline,
      contentDeadline: dealOverrides.contentDeadline,
      priority: dealOverrides.priority,
      dealNotes: dealOverrides.dealNotes
    }),

  // ============================================
  // SEARCH & UTILITY
  // ============================================

  searchBriefs: (searchData) =>
    api.post('/briefs/search', {
      query: searchData.query,
      filters: searchData.filters,
      page: searchData.page || 1,
      limit: searchData.limit || 20,
      sortBy: searchData.sortBy || 'relevance',
      sortOrder: searchData.sortOrder || 'desc'
    }),

  deleteBrief: (briefId) =>
    api.delete(`/briefs/${briefId}`)
};

// Export helper functions for common operations
export const briefHelpers = {
  // Check if user has AI access based on subscription
  hasAIAccess: (subscription) => {
    return ['pro', 'elite', 'agency_starter', 'agency_pro'].includes(subscription);
  },

  // Check if user can perform bulk operations
  canUseBulkOperations: (subscription) => {
    return ['pro', 'elite', 'agency_starter', 'agency_pro'].includes(subscription);
  },

  // Format brief status for display
  formatBriefStatus: (status) => {
    const statusMap = {
      'draft': 'Draft',
      'analyzed': 'Analyzed', 
      'needs_clarification': 'Needs Clarification',
      'ready_for_deal': 'Ready for Deal',
      'converted': 'Converted',
      'archived': 'Archived'
    };
    return statusMap[status] || status;
  },

  // Format input type for display  
  formatInputType: (inputType) => {
    const typeMap = {
      'text_paste': 'Text Paste',
      'file_upload': 'File Upload'
    };
    return typeMap[inputType] || inputType;
  },

  // Format deliverable type for display
  formatDeliverableType: (type) => {
    const typeMap = {
      'instagram_post': 'Instagram Post',
      'instagram_reel': 'Instagram Reel', 
      'instagram_story': 'Instagram Story',
      'youtube_video': 'YouTube Video',
      'youtube_shorts': 'YouTube Shorts',
      'linkedin_post': 'LinkedIn Post',
      'twitter_post': 'Twitter Post',
      'blog_post': 'Blog Post',
      'other': 'Other'
    };
    return typeMap[type] || type;
  },

  // Get status color for UI
  getStatusColor: (status) => {
    const colorMap = {
      'draft': 'gray',
      'analyzed': 'blue',
      'needs_clarification': 'yellow', 
      'ready_for_deal': 'green',
      'converted': 'purple',
      'archived': 'gray'
    };
    return colorMap[status] || 'gray';
  },

  // Get risk level color
  getRiskColor: (riskLevel) => {
    const colorMap = {
      'low': 'green',
      'medium': 'yellow',
      'high': 'red'
    };
    return colorMap[riskLevel] || 'gray';
  },

  // Calculate completion percentage display
  formatCompletionPercentage: (percentage) => {
    if (percentage >= 90) return { text: 'Complete', color: 'green' };
    if (percentage >= 70) return { text: 'Mostly Complete', color: 'blue' };
    if (percentage >= 40) return { text: 'In Progress', color: 'yellow' };
    return { text: 'Incomplete', color: 'red' };
  },

  // Format currency values
  formatCurrency: (amount, currency = 'INR') => {
    if (!amount || amount === 0) return 'Not specified';
    
    if (currency === 'INR') {
      // Format Indian currency with lakhs/crores
      if (amount >= 10000000) { // 1 Crore
        return `₹${(amount / 10000000).toFixed(1)}Cr`;
      } else if (amount >= 100000) { // 1 Lakh
        return `₹${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) { // 1 Thousand
        return `₹${(amount / 1000).toFixed(1)}K`;
      }
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Calculate days since creation
  getDaysOld: (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Format brief age for display
  formatBriefAge: (createdAt) => {
    const days = briefHelpers.getDaysOld(createdAt);
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  },

  // Get subscription limits
  getSubscriptionLimits: (tier) => {
    const limits = {
      starter: { 
        maxBriefsPerMonth: 10, 
        maxFileSize: '5MB', 
        aiFeatures: false 
      },
      pro: { 
        maxBriefsPerMonth: 25, 
        maxFileSize: '10MB', 
        aiFeatures: true 
      },
      elite: { 
        maxBriefsPerMonth: 'Unlimited', 
        maxFileSize: '25MB', 
        aiFeatures: true 
      },
      agency_starter: { 
        maxBriefsPerMonth: 'Unlimited', 
        maxFileSize: '25MB', 
        aiFeatures: true 
      },
      agency_pro: { 
        maxBriefsPerMonth: 'Unlimited', 
        maxFileSize: '50MB', 
        aiFeatures: true 
      }
    };
    
    return limits[tier] || limits.starter;
  },

  // Validate file before upload
  validateFileUpload: (file, subscription) => {
    const limits = briefHelpers.getSubscriptionLimits(subscription);
    const allowedTypes = [
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'
      };
    }
    
    // Check file size
    const maxSize = {
      starter: 5 * 1024 * 1024,      // 5MB
      pro: 10 * 1024 * 1024,         // 10MB  
      elite: 25 * 1024 * 1024,       // 25MB
      agency_starter: 25 * 1024 * 1024, // 25MB
      agency_pro: 50 * 1024 * 1024   // 50MB
    };
    
    const sizeLimit = maxSize[subscription] || maxSize.starter;
    
    if (file.size > sizeLimit) {
      const maxSizeMB = Math.round(sizeLimit / (1024 * 1024));
      return {
        valid: false,
        error: `File size exceeds limit of ${maxSizeMB}MB for ${subscription} plan.`
      };
    }
    
    return { valid: true };
  }
};
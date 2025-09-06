// src/api/endpoints/contracts.js
import { api } from '../client';

export const contractsAPI = {
  // ===========================================
  // DASHBOARD ENDPOINTS
  // ===========================================
  
  /**
   * Get contracts list with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (draft, active, completed, cancelled)
   * @param {string} params.brandName - Filter by brand name
   * @param {string} params.riskLevel - Filter by risk level (low, medium, high)
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Results per page (default: 20)
   * @param {string} params.search - Search query for contract name/brand
   * @param {string} params.sortBy - Sort field (createdAt, riskScore, brandName)
   * @param {string} params.sortOrder - Sort direction (asc, desc)
   */
  getContracts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filtering parameters
    if (params.status) queryParams.append('status', params.status);
    if (params.brandName) queryParams.append('brandName', params.brandName);
    if (params.riskLevel) queryParams.append('riskLevel', params.riskLevel);
    if (params.search) queryParams.append('search', params.search);
    
    // Add pagination
    queryParams.append('page', params.page || 1);
    queryParams.append('limit', params.limit || 20);
    
    // Add sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return api.get(`/contracts?${queryParams.toString()}`);
  },

  /**
   * Upload contract file with metadata
   * @param {FormData} formData - Contains file and metadata
   * @param {Function} onUploadProgress - Progress callback function
   */
  uploadContract: (formData, onUploadProgress) => 
    api.post('/contracts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    }),

  /**
   * Get dashboard analytics summary
   * @returns {Object} Analytics data including:
   * - totalContracts: number
   * - riskDistribution: { low: number, medium: number, high: number }
   * - avgRiskScore: number
   * - contractsByStatus: { draft: number, active: number, etc. }
   * - recentUploads: number (last 30 days)
   * - subscriptionUsage: { used: number, limit: number }
   */
  getDashboardAnalytics: () => 
    api.get('/contracts/analytics'),

  /**
   * Update contract status
   * @param {string} contractId - Contract ID
   * @param {string} status - New status (draft, active, completed, cancelled)
   * @param {string} notes - Optional status change notes
   */
  updateContractStatus: (contractId, status, notes = '') => 
    api.patch(`/contracts/${contractId}/status`, { status, notes }),

  /**
   * Delete contract
   * @param {string} contractId - Contract ID to delete
   */
  deleteContract: (contractId) => 
    api.delete(`/contracts/${contractId}`),

  /**
   * Bulk update contract statuses
   * @param {Array<string>} contractIds - Array of contract IDs
   * @param {string} status - New status to apply
   * @param {string} notes - Optional bulk update notes
   */
  bulkUpdateStatus: (contractIds, status, notes = '') => 
    api.post('/contracts/bulk-status', { 
      contractIds, 
      status, 
      notes 
    }),

  /**
   * Bulk delete contracts
   * @param {Array<string>} contractIds - Array of contract IDs to delete
   */
  bulkDeleteContracts: (contractIds) => 
    api.post('/contracts/bulk-delete', { contractIds }),

  // ===========================================
  // CONTRACT DETAILS ENDPOINTS
  // ===========================================

  /**
   * Get single contract with full details and analysis
   * @param {string} contractId - Contract ID
   * @returns {Object} Contract with:
   * - id, name, brandName, fileName, fileUrl
   * - status, createdAt, updatedAt
   * - analysisStatus, riskScore, riskLevel
   * - aiAnalysis: { clauseAnalysis, redFlags, missingClauses, etc. }
   */
  getContract: (contractId) => 
    api.get(`/contracts/${contractId}`),

  /**
   * Trigger AI analysis for a contract
   * @param {string} contractId - Contract ID to analyze
   * @param {boolean} forceReanalysis - Force re-analysis even if already analyzed
   */
  analyzeContract: (contractId, forceReanalysis = false) => 
    api.post(`/contracts/${contractId}/analyze`, { forceReanalysis }),

  /**
   * Get AI-generated negotiation points (read-only display)
   * @param {string} contractId - Contract ID
   * @returns {Object} Negotiation insights:
   * - prioritizedPoints: Array of negotiation suggestions
   * - riskMitigation: Array of risk reduction strategies
   * - marketComparison: Industry benchmark data
   * - recommendedChanges: Specific clause improvements
   */
  getNegotiationPoints: (contractId) => 
    api.get(`/contracts/${contractId}/negotiation-points`),

  /**
   * Get contract analysis status
   * @param {string} contractId - Contract ID
   * @returns {Object} Analysis status and progress
   */
  getAnalysisStatus: (contractId) => 
    api.get(`/contracts/${contractId}/analysis-status`),

  // ===========================================
  // UTILITY ENDPOINTS
  // ===========================================

  /**
   * Get user's contract upload limits and usage
   * @returns {Object} Subscription limits:
   * - currentUsage: number
   * - monthlyLimit: number (-1 for unlimited)
   * - canUpload: boolean
   * - subscriptionTier: string
   */
  getUploadLimits: () => 
    api.get('/contracts/upload-limits'),

  /**
   * Get contract file download URL
   * @param {string} contractId - Contract ID
   * @returns {Object} Download information
   */
  getDownloadUrl: (contractId) => 
    api.get(`/contracts/${contractId}/download`),

  /**
   * Search contracts by content (if text extraction available)
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   */
  searchContractContent: (query, filters = {}) => 
    api.post('/contracts/search', { query, ...filters }),

  /**
   * Get contract activity feed
   * @param {string} contractId - Contract ID (optional, for specific contract)
   * @param {number} limit - Number of activities to return
   */
  getActivityFeed: (contractId = null, limit = 10) => {
    const endpoint = contractId 
      ? `/contracts/${contractId}/activity`
      : '/contracts/activity';
    return api.get(`${endpoint}?limit=${limit}`);
  },
};

// Contract Helper Functions
export const contractHelpers = {
  /**
   * Validate file before upload
   */
  validateFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    return {
      isValid: file.size <= maxSize && allowedTypes.includes(file.type),
      error: file.size > maxSize ? 'File too large' : !allowedTypes.includes(file.type) ? 'Invalid file type' : null
    };
  },

  /**
   * Format risk score for display
   */
  formatRiskScore: (score) => ({
    value: score,
    level: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
    color: score >= 70 ? '#dc2626' : score >= 40 ? '#f59e0b' : '#10b981'
  }),

  /**
   * Format contract status
   */
  formatStatus: (status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    badge: status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'secondary'
  }),

  /**
   * Check upload limits
   */
  canUpload: (usage, limit) => limit === -1 || usage < limit
};

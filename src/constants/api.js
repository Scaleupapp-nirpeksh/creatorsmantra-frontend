/**
 * CreatorsMantra Frontend - API Constants
 * Centralized API configuration and endpoint definitions
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description API base URLs, endpoints, headers, and request configurations
 * @path src/constants/api.js
 */

// ============================================
// BASE CONFIGURATION
// ============================================

// API Base URL - automatically detects environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_BASE_URL || 'https://api.creatorsmantra.com'
  : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// API Version
export const API_VERSION = 'v1';

// Full API URL
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// File upload limits by subscription tier
export const FILE_UPLOAD_LIMITS = {
  starter: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  pro: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'],
  },
  elite: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'text/plain'],
  },
  agency_starter: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'text/plain'],
  },
  agency_pro: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'text/plain'],
  },
};

// Request timeout configurations
export const TIMEOUT_CONFIG = {
  default: 10000, // 10 seconds
  upload: 60000,  // 60 seconds for file uploads
  download: 30000, // 30 seconds for downloads
  ai: 45000,      // 45 seconds for AI processing
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const AUTH_ENDPOINTS = {
  // Phone & OTP
  CHECK_PHONE: '/auth/check-phone',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  
  // Authentication
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGIN_OTP: '/auth/login-otp',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // Profile management
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  INVITE_MANAGER: '/auth/invite-manager',
  ACCEPT_MANAGER_INVITATION: '/auth/accept-manager-invitation',
  DELETE_ACCOUNT: '/auth/account',
  
  // Utility endpoints
  SUBSCRIPTION_TIERS: '/auth/subscription-tiers',
  FEATURE_ACCESS: '/auth/feature-access',
  SUGGESTED_RATES: '/auth/suggested-rates',
};

// ============================================
// DEAL CRM ENDPOINTS
// ============================================

export const DEAL_ENDPOINTS = {
  // Basic CRUD
  LIST: '/deals',
  CREATE: '/deals',
  GET: '/deals/:dealId',
  UPDATE: '/deals/:dealId',
  DELETE: '/deals/:dealId',
  ARCHIVE: '/deals/:dealId/archive',
  
  // Pipeline management
  PIPELINE_OVERVIEW: '/deals/pipeline/overview',
  GET_BY_STAGE: '/deals/pipeline/:stage',
  UPDATE_STAGE: '/deals/:dealId/stage',
  ATTENTION: '/deals/attention',
  
  // Communications
  ADD_COMMUNICATION: '/deals/:dealId/communications',
  GET_COMMUNICATIONS: '/deals/:dealId/communications',
  UPDATE_COMMUNICATION: '/deals/:dealId/communications/:commId',
  
  // Deliverables
  ADD_DELIVERABLE: '/deals/:dealId/deliverables',
  UPDATE_DELIVERABLE: '/deals/:dealId/deliverables/:deliverableId',
  
  // Brand profiles
  BRANDS: '/deals/brands',
  GET_BRAND: '/deals/brands/:brandId',
  UPDATE_BRAND: '/deals/brands/:brandId',
  
  // Templates
  TEMPLATES: '/deals/templates',
  CREATE_TEMPLATE: '/deals/templates',
  UPDATE_TEMPLATE: '/deals/templates/:templateId',
  DELETE_TEMPLATE: '/deals/templates/:templateId',
  
  // Analytics
  REVENUE_ANALYTICS: '/deals/analytics/revenue',
  DEAL_INSIGHTS: '/deals/analytics/insights',
  DEAL_SUMMARY: '/deals/analytics/summary',
  
  // Quick actions
  QUICK_ACTION: '/deals/:dealId/actions/:action',
  BULK_UPDATE: '/deals/bulk',
  
  // Metadata
  METADATA: '/deals/metadata',
};

// ============================================
// INVOICE ENDPOINTS
// ============================================

export const INVOICE_ENDPOINTS = {
  // Basic operations
  LIST: '/invoices',
  GET: '/invoices/:invoiceId',
  UPDATE: '/invoices/:invoiceId',
  DELETE: '/invoices/:invoiceId',
  
  // Creation endpoints
  CREATE_INDIVIDUAL: '/invoices/create-individual',
  CREATE_CONSOLIDATED: '/invoices/create-consolidated',
  
  // Deal management
  AVAILABLE_DEALS: '/invoices/available-deals',
  
  // Tax management
  TAX_PREFERENCES: '/invoices/tax-preferences',
  UPDATE_TAX_PREFERENCES: '/invoices/tax-preferences',
  CALCULATE_TAX_PREVIEW: '/invoices/calculate-tax-preview',
  
  // Payment tracking
  RECORD_PAYMENT: '/invoices/:invoiceId/payments',
  GET_PAYMENT_HISTORY: '/invoices/:invoiceId/payments',
  VERIFY_PAYMENT: '/invoices/payments/:paymentId/verify',
  
  // PDF generation
  GENERATE_PDF: '/invoices/:invoiceId/generate-pdf',
  DOWNLOAD_PDF: '/invoices/:invoiceId/download-pdf',
  
  // Reminders
  SCHEDULE_REMINDERS: '/invoices/:invoiceId/schedule-reminders',
  PROCESS_REMINDERS: '/invoices/process-reminders',
  
  // Analytics
  ANALYTICS: '/invoices/analytics',
  DASHBOARD: '/invoices/dashboard',
};

// ============================================
// RATE CARD ENDPOINTS
// ============================================

export const RATE_CARD_ENDPOINTS = {
  // Basic CRUD
  LIST: '/',
  CREATE: '/',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  CLONE: '/:id/clone',
  
  // Templates
  TEMPLATES: '/templates',
  SAVE_AS_TEMPLATE: '/:id/save-as-template',
  
  // AI features
  AI_SUGGESTIONS: '/ai-suggestions',
  BULK_UPDATE: '/bulk-update',
  
  // Package management
  CREATE_PACKAGE: '/:id/packages',
  UPDATE_PACKAGE: '/:id/packages/:packageId',
  DELETE_PACKAGE: '/:id/packages/:packageId',
  
  // PDF generation
  GENERATE_PDF: '/:id/pdf',
  
  // Sharing
  SHARE: '/:id/share',
  PUBLIC: '/public/:shortCode',
  
  // Analytics
  ANALYTICS: '/:id/analytics',
  
  // Version control
  VERSIONS: '/:id/versions',
  RESTORE_VERSION: '/:id/restore-version',
};

// ============================================
// BRIEF ANALYZER ENDPOINTS
// ============================================

export const BRIEF_ENDPOINTS = {
  // Creation
  CREATE_TEXT: '/briefs/create-text',
  CREATE_FILE: '/briefs/create-file',
  
  // Basic operations
  LIST: '/briefs',
  GET: '/briefs/:briefId',
  UPDATE: '/briefs/:briefId',
  DELETE: '/briefs/:briefId',
  UPDATE_STATUS: '/briefs/:briefId/status',
  UPDATE_NOTES: '/briefs/:briefId/notes',
  UPDATE_TAGS: '/briefs/:briefId/tags',
  
  // AI processing
  TRIGGER_EXTRACTION: '/briefs/:briefId/extract',
  GET_EXTRACTION_STATUS: '/briefs/:briefId/extraction-status',
  
  // Clarifications
  GENERATE_CLARIFICATION_EMAIL: '/briefs/:briefId/clarification-email',
  ADD_CLARIFICATION: '/briefs/:briefId/clarifications',
  ANSWER_CLARIFICATION: '/briefs/:briefId/clarifications/:questionId',
  
  // Deal conversion
  GET_DEAL_PREVIEW: '/briefs/:briefId/deal-preview',
  CONVERT_TO_DEAL: '/briefs/:briefId/convert-to-deal',
  
  // Management
  GET_BY_STATUS: '/briefs/status/:status',
  BULK_UPDATE: '/briefs/bulk-update',
  SEARCH: '/briefs/search',
  
  // Dashboard
  DASHBOARD_STATS: '/briefs/dashboard/stats',
  METADATA: '/briefs/metadata',
  GET_SUMMARY: '/briefs/:briefId/summary',
};

// ============================================
// PERFORMANCE VAULT ENDPOINTS
// ============================================

export const PERFORMANCE_ENDPOINTS = {
  // Campaign management
  CREATE_CAMPAIGN: '/performance/campaigns',
  GET_CAMPAIGNS: '/performance/campaigns',
  GET_CAMPAIGN: '/performance/campaigns/:campaignId',
  UPDATE_CAMPAIGN: '/performance/campaigns/:campaignId',
  DELETE_CAMPAIGN: '/performance/campaigns/:campaignId',
  BULK_UPDATE_CAMPAIGNS: '/performance/campaigns/bulk',
  
  // Screenshot management
  UPLOAD_SCREENSHOT: '/performance/campaigns/:campaignId/screenshots',
  GET_SCREENSHOTS: '/performance/campaigns/:campaignId/screenshots',
  DELETE_SCREENSHOT: '/performance/screenshots/:screenshotId',
  ANALYZE_SCREENSHOT: '/performance/screenshots/:screenshotId/analyze',
  
  // AI analysis
  GENERATE_ANALYSIS: '/performance/campaigns/:campaignId/analyze',
  GET_ANALYSIS: '/performance/campaigns/:campaignId/analysis',
  REGENERATE_ANALYSIS: '/performance/campaigns/:campaignId/analysis',
  
  // Report generation
  GENERATE_REPORT: '/performance/campaigns/:campaignId/reports',
  GET_CAMPAIGN_REPORTS: '/performance/campaigns/:campaignId/reports',
  GET_ALL_REPORTS: '/performance/reports',
  DOWNLOAD_REPORT: '/performance/reports/:reportId/download',
  SHARE_REPORT: '/performance/reports/:reportId/share',
  BULK_GENERATE_REPORTS: '/performance/reports/bulk',
  
  // Analytics
  OVERVIEW: '/performance/overview',
  ANALYTICS: '/performance/analytics',
  TOP_CAMPAIGNS: '/performance/top-campaigns',
  INSIGHTS: '/performance/insights',
  
  // Settings
  GET_SETTINGS: '/performance/settings',
  UPDATE_SETTINGS: '/performance/settings',
  UPDATE_BRANDING: '/performance/settings/branding',
  UPLOAD_LOGO: '/performance/settings/logo',
  
  // Utility
  HEALTH: '/performance/health',
  METADATA: '/performance/metadata',
  ROUTES: '/performance/routes',
};

// ============================================
// CONTRACT ENDPOINTS
// ============================================

export const CONTRACT_ENDPOINTS = {
  // Upload and creation
  UPLOAD: '/contracts/upload',
  ANALYZE: '/contracts/:contractId/analyze',
  
  // Basic operations
  LIST: '/contracts',
  GET: '/contracts/:contractId',
  UPDATE_STATUS: '/contracts/:contractId/status',
  DELETE: '/contracts/:contractId',
  
  // Negotiation
  GET_NEGOTIATION_POINTS: '/contracts/:contractId/negotiation-points',
  GENERATE_NEGOTIATION_EMAIL: '/contracts/:contractId/negotiation-email',
  SAVE_NEGOTIATION: '/contracts/:contractId/negotiations',
  GET_NEGOTIATION_HISTORY: '/contracts/:contractId/negotiations',
  
  // Resources
  GET_TEMPLATES: '/contracts/templates',
  GET_CLAUSE_ALTERNATIVES: '/contracts/clause-alternatives/:clauseType',
  
  // Analytics
  ANALYTICS: '/contracts/analytics',
  
  // Integration
  CONVERT_TO_DEAL: '/contracts/:contractId/convert-to-deal',
  
  // Documentation
  DOCS: '/contracts/docs',
};

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

export const ANALYTICS_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/analytics/dashboard',
  CUSTOM_DASHBOARD: '/analytics/dashboard/custom',
  
  // Revenue intelligence
  REVENUE: '/analytics/revenue',
  REVENUE_BREAKDOWN: '/analytics/revenue/breakdown',
  
  // Deal performance
  DEALS_FUNNEL: '/analytics/deals/funnel',
  DEAL_PERFORMANCE: '/analytics/deals/performance',
  
  // AI insights
  INSIGHTS: '/analytics/insights',
  GENERATE_INSIGHTS: '/analytics/insights/generate',
  UPDATE_INSIGHT_STATUS: '/analytics/insights/:insightId/status',
  
  // Trend analysis
  TRENDS: '/analytics/trends',
  FORECAST: '/analytics/forecast',
  
  // Risk analytics
  RISK: '/analytics/risk',
  
  // Performance correlation
  PERFORMANCE: '/analytics/performance',
  
  // Cache management
  CLEAR_CACHE: '/analytics/cache',
  GET_CACHE_STATS: '/analytics/cache/stats',
  
  // Export and reporting
  EXPORT: '/analytics/export',
  
  // Benchmarking
  BENCHMARKS: '/analytics/benchmarks',
  
  // Agency features
  AGENCY_OVERVIEW: '/analytics/agency/overview',
  CREATOR_COMPARISON: '/analytics/agency/comparison',
  
  // Utility
  HEALTH: '/analytics/health',
  DOCS: '/analytics/docs',
};

// ============================================
// SUBSCRIPTION ENDPOINTS
// ============================================

export const SUBSCRIPTION_ENDPOINTS = {
  // Payment verification
  VERIFY_PAYMENT: '/subscriptions/payments/verify',
  GET_PENDING_PAYMENTS: '/subscriptions/payments/pending',
  GET_PAYMENT_DETAILS: '/subscriptions/payments/:paymentId',
  UPLOAD_PAYMENT_SCREENSHOT: '/subscriptions/payments/:paymentId/screenshot',
  VERIFY_PAYMENT_MANUALLY: '/subscriptions/payments/:paymentId/verify',
  
  // Billing
  CURRENT_BILLING: '/subscriptions/billing/current',
  BILLING_HISTORY: '/subscriptions/billing/history',
  
  // Subscription management
  OVERVIEW: '/subscriptions/overview',
  UPGRADE: '/subscriptions/upgrade',
  GET_UPGRADES: '/subscriptions/upgrades',
  PROCESS_UPGRADE: '/subscriptions/upgrades/:upgradeId/process',
  CANCEL: '/subscriptions/cancel',
  
  // Renewal management
  SEND_REMINDERS: '/subscriptions/reminders/send',
  GET_REMINDERS: '/subscriptions/reminders',
  UPDATE_AUTO_RENEWAL: '/subscriptions/auto-renewal',
  
  // Utility
  HEALTH: '/subscriptions/health',
  TIERS: '/subscriptions/tiers',
  FEATURES: '/subscriptions/features/:tier',
  STATS: '/subscriptions/stats',
};

// ============================================
// HTTP STATUS CODES
// ============================================

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// ============================================
// REQUEST HEADERS
// ============================================

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export const MULTIPART_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // Note: Content-Type will be set automatically for FormData
};

// ============================================
// PAGINATION DEFAULTS
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
  DEFAULT_SORT: 'createdAt',
  DEFAULT_ORDER: 'desc',
};

// ============================================
// CACHE KEYS
// ============================================

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  SUBSCRIPTION_INFO: 'subscription_info',
  DEAL_METADATA: 'deal_metadata',
  BRAND_PROFILES: 'brand_profiles',
  INVOICE_TEMPLATES: 'invoice_templates',
  TAX_PREFERENCES: 'tax_preferences',
  RATE_CARD_TEMPLATES: 'rate_card_templates',
  PERFORMANCE_SETTINGS: 'performance_settings',
  ANALYTICS_DASHBOARD: 'analytics_dashboard',
};

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Authorization
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Business logic
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Replace URL parameters with actual values
 * @param {string} endpoint - API endpoint with parameters
 * @param {object} params - Parameters to replace
 * @returns {string} - URL with replaced parameters
 */
export const replaceUrlParams = (endpoint, params = {}) => {
  let url = endpoint;
  
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

/**
 * Build query string from parameters
 * @param {object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Get full API URL for endpoint
 * @param {string} endpoint - API endpoint
 * @param {object} urlParams - URL parameters to replace
 * @param {object} queryParams - Query parameters
 * @returns {string} - Full API URL
 */
export const getApiUrl = (endpoint, urlParams = {}, queryParams = {}) => {
  const urlWithParams = replaceUrlParams(endpoint, urlParams);
  const queryString = buildQueryString(queryParams);
  
  return `${API_URL}${urlWithParams}${queryString}`;
};

/**
 * Get file upload configuration for subscription tier
 * @param {string} tier - Subscription tier
 * @returns {object} - Upload configuration
 */
export const getUploadConfig = (tier = 'starter') => {
  return FILE_UPLOAD_LIMITS[tier] || FILE_UPLOAD_LIMITS.starter;
};

// ============================================
// EXPORTS
// ============================================

export default {
  API_BASE_URL,
  API_VERSION,
  API_URL,
  AUTH_ENDPOINTS,
  DEAL_ENDPOINTS,
  INVOICE_ENDPOINTS,
  RATE_CARD_ENDPOINTS,
  BRIEF_ENDPOINTS,
  PERFORMANCE_ENDPOINTS,
  CONTRACT_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  SUBSCRIPTION_ENDPOINTS,
  HTTP_STATUS,
  DEFAULT_HEADERS,
  MULTIPART_HEADERS,
  PAGINATION,
  CACHE_KEYS,
  ERROR_CODES,
  FILE_UPLOAD_LIMITS,
  TIMEOUT_CONFIG,
  replaceUrlParams,
  buildQueryString,
  getApiUrl,
  getUploadConfig,
};

// Debug helper for development
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 CreatorsMantra API Configuration Loaded', {
    baseUrl: API_BASE_URL,
    version: API_VERSION,
    endpoints: {
      auth: Object.keys(AUTH_ENDPOINTS).length,
      deals: Object.keys(DEAL_ENDPOINTS).length,
      invoices: Object.keys(INVOICE_ENDPOINTS).length,
      analytics: Object.keys(ANALYTICS_ENDPOINTS).length,
    },
    errorCodes: Object.keys(ERROR_CODES).length,
  });
}
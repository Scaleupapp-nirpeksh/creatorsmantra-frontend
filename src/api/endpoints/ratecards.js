/**
 * Rate Card API Endpoints - Complete Implementation
 * Handles all rate card related API calls for CreatorsMantra platform
 * 
 * @filepath src/api/endpoints/ratecards.js
 * @author CreatorsMantra Frontend Team
 * @version 2.0.0
 */

import { api } from '../client';

export const rateCardAPI = {
  // ============================================
  // PUBLIC ENDPOINTS (No Authentication Required)
  // ============================================
  
  /**
   * Gets a public rate card by its public ID.
   * @param {string} publicId - The public identifier of the rate card.
   * @param {string} [password] - Optional password for protected rate cards.
   * @returns {Promise} API response with public rate card data
   */
  getPublicRateCard: (publicId, password = null) => {
    const config = {};
    if (password) {
      config.headers = { 'x-rate-card-password': password };
    }
    return api.get(`/ratecards/public/${publicId}`, config);
  },

  // ============================================
  // CORE RATE CARD MANAGEMENT
  // ============================================

  /**
   * Creates a new rate card with initial metrics to get AI suggestions.
   * @param {object} data - The rate card creation data
   * @param {string} data.title - Rate card title
   * @param {string} [data.description] - Optional description
   * @param {object} data.metrics - Creator metrics (platforms, niche, location, etc.)
   * @returns {Promise} API response with created rate card and AI suggestions
   */
  createRateCard: (data) => {
    console.log('API: Creating rate card with data:', data);
    return api.post('/ratecards', data);
  },

  /**
   * Fetches all rate cards for the logged-in user.
   * @param {object} params - Query parameters
   * @param {string} [params.status='all'] - Filter by status (all, draft, active, archived)
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [params.limit=10] - Number of items per page
   * @returns {Promise} API response with rate cards array and pagination info
   */
  getRateCards: (params = {}) => {
    const queryParams = {
      status: params.status || 'all',
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    };
    console.log('API: Fetching rate cards with params:', queryParams);
    return api.get('/ratecards', { params: queryParams });
  },

  /**
   * Fetches a single rate card by its ID.
   * @param {string} id - The rate card's unique ID
   * @returns {Promise} API response with detailed rate card data
   */
  getRateCard: (id) => {
    console.log('API: Fetching rate card with ID:', id);
    return api.get(`/ratecards/${id}`);
  },

  /**
   * Soft deletes a rate card (marks as deleted but keeps in database).
   * @param {string} id - The rate card's unique ID
   * @returns {Promise} API response confirming deletion
   */
  deleteRateCard: (id) => {
    console.log('API: Deleting rate card with ID:', id);
    return api.delete(`/ratecards/${id}`);
  },

  // ============================================
  // RATE CARD UPDATES
  // ============================================

  /**
   * Updates a rate card's metrics and regenerates AI pricing suggestions.
   * @param {string} id - The rate card's unique ID
   * @param {object} data - Updated metrics data
   * @param {Array} data.platforms - Array of platform metrics
   * @returns {Promise} API response with updated rate card and new AI suggestions
   */
  updateMetrics: (id, data) => {
    console.log('API: Updating metrics for rate card:', id, 'with data:', data);
    return api.put(`/ratecards/${id}/metrics`, data);
  },

  /**
   * Updates the pricing (deliverables) of a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {object} data - Updated pricing data
   * @param {Array} data.deliverables - Array of platform deliverables with rates
   * @returns {Promise} API response with updated rate card
   */
  updatePricing: (id, data) => {
    console.log('API: Updating pricing for rate card:', id, 'with data:', data);
    return api.put(`/ratecards/${id}/pricing`, data);
  },

  /**
   * Updates the professional details (terms, usage rights, etc.) of a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {object} data - Updated professional details
   * @param {object} [data.paymentTerms] - Payment terms configuration
   * @param {object} [data.usageRights] - Usage rights and licensing
   * @param {string} [data.revisionPolicy] - Revision policy text
   * @param {string} [data.cancellationTerms] - Cancellation terms
   * @param {string} [data.additionalNotes] - Additional notes
   * @returns {Promise} API response with updated rate card
   */
  updateProfessionalDetails: (id, data) => {
    console.log('API: Updating professional details for rate card:', id, 'with data:', data);
    return api.put(`/ratecards/${id}/professional-details`, data);
  },

  // ============================================
  // PACKAGE MANAGEMENT
  // ============================================

  /**
   * Creates a new package deal within a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {object} data - New package data
   * @param {string} data.name - Package name
   * @param {string} [data.description] - Package description
   * @param {Array} data.items - Array of package items with platform, deliverableType, quantity
   * @param {number} data.packagePrice - Total package price
   * @param {object} [data.validity] - Package validity period
   * @param {boolean} [data.isPopular] - Whether to mark as popular
   * @returns {Promise} API response with updated rate card including new package
   */
  createPackage: (id, data) => {
    console.log('API: Creating package for rate card:', id, 'with data:', data);
    return api.post(`/ratecards/${id}/packages`, data);
  },

  /**
   * Updates an existing package in a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {string} packageId - The package's unique ID
   * @param {object} data - Updated package data
   * @returns {Promise} API response with updated package info
   */
  updatePackage: (id, packageId, data) => {
    console.log('API: Updating package:', packageId, 'for rate card:', id, 'with data:', data);
    return api.put(`/ratecards/${id}/packages/${packageId}`, data);
  },

  /**
   * Deletes a package from a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {string} packageId - The package's unique ID
   * @returns {Promise} API response confirming package deletion
   */
  deletePackage: (id, packageId) => {
    console.log('API: Deleting package:', packageId, 'from rate card:', id);
    return api.delete(`/ratecards/${id}/packages/${packageId}`);
  },

  // ============================================
  // PUBLISHING & SHARING
  // ============================================

  /**
   * Publishes a rate card, making it publicly accessible with a unique link.
   * @param {string} id - The rate card's unique ID
   * @returns {Promise} API response with public URL, public ID, and QR code
   */
  publishRateCard: (id) => {
    console.log('API: Publishing rate card:', id);
    return api.post(`/ratecards/${id}/publish`);
  },

  /**
   * Updates the sharing settings for a public rate card.
   * @param {string} id - The rate card's unique ID
   * @param {object} data - Updated sharing settings
   * @param {boolean} [data.allowDownload] - Allow PDF downloads
   * @param {boolean} [data.showContactForm] - Show contact information
   * @param {boolean} [data.requirePassword] - Require password for access
   * @param {string} [data.password] - Access password
   * @param {number} [data.expiryDays] - Days until expiry
   * @returns {Promise} API response with updated sharing settings
   */
  updateShareSettings: (id, data) => {
    console.log('API: Updating share settings for rate card:', id, 'with data:', data);
    return api.put(`/ratecards/${id}/share-settings`, data);
  },

  // ============================================
  // EXPORT & DOCUMENTATION
  // ============================================

  /**
   * Generates and downloads a PDF version of the rate card.
   * @param {string} id - The rate card's unique ID
   * @returns {Promise} Blob response for PDF download
   */
  generatePDF: (id) => {
    console.log('API: Generating PDF for rate card:', id);
    return api.get(`/ratecards/${id}/pdf`, { 
      responseType: 'blob',
      timeout: 30000 // 30 second timeout for PDF generation
    });
  },

  // ============================================
  // VERSION HISTORY & ANALYTICS
  // ============================================

  /**
   * Gets the version history for a rate card.
   * @param {string} id - The rate card's unique ID
   * @param {object} params - Pagination options
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @returns {Promise} API response with history records and pagination
   */
  getRateCardHistory: (id, params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      ...params
    };
    console.log('API: Fetching history for rate card:', id, 'with params:', queryParams);
    return api.get(`/ratecards/${id}/history`, { params: queryParams });
  },

  /**
   * Restores a rate card to a previous version from its history.
   * @param {string} id - The rate card's unique ID
   * @param {string} historyId - The history record's unique ID to restore from
   * @returns {Promise} API response with restored rate card
   */
  restoreFromHistory: (id, historyId) => {
    console.log('API: Restoring rate card:', id, 'from history:', historyId);
    return api.post(`/ratecards/${id}/restore/${historyId}`);
  },

  /**
   * Fetches analytics data for a rate card (views, engagement, etc.).
   * @param {string} id - The rate card's unique ID
   * @returns {Promise} API response with analytics data
   */
  getAnalytics: (id) => {
    console.log('API: Fetching analytics for rate card:', id);
    return api.get(`/ratecards/${id}/analytics`);
  },

  // ============================================
  // AI & ADVANCED FEATURES
  // ============================================

  /**
   * Generates AI pricing suggestions based on creator metrics.
   * @param {object} metrics - Creator metrics for AI analysis
   * @param {Array} metrics.platforms - Platform metrics (followers, engagement)
   * @param {string} metrics.niche - Creator's niche/category
   * @param {object} metrics.location - Location information
   * @returns {Promise} API response with AI pricing suggestions
   */
  generateAISuggestions: (metrics) => {
    console.log('API: Generating AI suggestions with metrics:', metrics);
    return api.post('/ratecards/ai-suggestions', metrics);
  },

  /**
   * Clones an existing rate card to create a new one.
   * @param {string} id - The rate card's unique ID to clone
   * @returns {Promise} API response with cloned rate card
   */
  cloneRateCard: (id) => {
    console.log('API: Cloning rate card:', id);
    return api.post(`/ratecards/${id}/clone`);
  },

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Builds properly structured rate card creation data.
   * @param {object} params - Rate card parameters
   * @param {string} params.title - Rate card title
   * @param {string} [params.description] - Optional description
   * @param {object} params.metrics - Creator metrics
   * @returns {object} Properly structured rate card data
   */
  buildRateCardData: ({
    title = 'My Rate Card',
    description = '',
    metrics
  }) => {
    const data = {
      title: title.trim(),
      description: description.trim(),
      metrics: {
        platforms: metrics.platforms || [],
        niche: metrics.niche || 'other',
        location: {
          city: metrics.location?.city || '',
          cityTier: metrics.location?.cityTier || 'tier1',
          state: metrics.location?.state || ''
        },
        languages: metrics.languages || ['english'],
        experience: metrics.experience || 'beginner'
      }
    };

    console.log('Built rate card data:', data);
    return data;
  },

  /**
   * Builds properly structured package data.
   * @param {object} params - Package parameters
   * @param {string} params.name - Package name
   * @param {string} [params.description] - Package description
   * @param {Array} params.items - Package items
   * @param {number} params.packagePrice - Package price
   * @param {object} [params.validity] - Validity period
   * @returns {object} Properly structured package data
   */
  buildPackageData: ({
    name,
    description = '',
    items = [],
    packagePrice,
    validity = { value: 30, unit: 'days' },
    isPopular = false
  }) => {
    const data = {
      name: name.trim(),
      description: description.trim(),
      items: items.map(item => ({
        platform: item.platform,
        deliverableType: item.deliverableType,
        quantity: parseInt(item.quantity) || 1
      })),
      packagePrice: parseInt(packagePrice) || 0,
      validity,
      isPopular
    };

    console.log('Built package data:', data);
    return data;
  },

  /**
   * Formats metrics data for API consumption.
   * @param {Array} platforms - Platform metrics
   * @param {string} niche - Creator niche
   * @param {object} location - Location info
   * @param {Array} [languages] - Languages offered
   * @param {string} [experience] - Experience level
   * @returns {object} Formatted metrics data
   */
  buildMetricsData: (platforms, niche, location, languages = ['english'], experience = 'beginner') => {
    const data = {
      platforms: platforms.map(platform => ({
        name: platform.name,
        metrics: {
          followers: parseInt(platform.metrics.followers) || 0,
          engagementRate: parseFloat(platform.metrics.engagementRate) || 0,
          avgViews: parseInt(platform.metrics.avgViews) || null,
          avgLikes: parseInt(platform.metrics.avgLikes) || null
        }
      })),
      niche,
      location: {
        city: location.city,
        cityTier: location.cityTier || 'tier1',
        state: location.state || ''
      },
      languages,
      experience
    };

    console.log('Built metrics data:', data);
    return data;
  }
};

// ============================================
// CONSTANTS & ENUMS
// ============================================

export const RATE_CARD_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

export const PAYMENT_TERMS = {
  FULL_ADVANCE: '100_advance',
  HALF_HALF: '50_50',
  THIRTY_SEVENTY: '30_70',
  POST_DELIVERY: 'on_delivery',
  NET_15: 'net_15',
  NET_30: 'net_30',
  CUSTOM: 'custom'
};

export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  FACEBOOK: 'facebook'
};

export const NICHES = [
  'fashion', 'beauty', 'tech', 'finance', 'food', 'travel',
  'lifestyle', 'fitness', 'gaming', 'education', 'entertainment',
  'business', 'health', 'parenting', 'sports', 'music', 'art', 'other'
];

export const CITY_TIERS = {
  METRO: 'metro',
  TIER1: 'tier1',
  TIER2: 'tier2',
  TIER3: 'tier3'
};

export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  ONE_TWO_YEARS: '1-2_years',
  TWO_FIVE_YEARS: '2-5_years',
  FIVE_PLUS_YEARS: '5+_years'
};

// Default export for convenience
export default rateCardAPI;
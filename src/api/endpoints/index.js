// src/api/endpoints/index.js
// Central export for all API endpoints

export { authAPI } from './auth';
export { dealsAPI } from './deals';
export { invoicesAPI, invoiceHelpers } from './invoices'; 
export { briefsAPI, briefHelpers } from './briefs';
export { analyticsAPI } from './analytics';
export { performanceAPI } from './performance';
export { contractsAPI } from './contracts';
export { rateCardsAPI } from './ratecards';
export { subscriptionsAPI } from './subscriptions';
export { scriptsAPI } from './scripts';

// Re-export main API client utilities
export { api, tokenManager, createCancelToken, batchRequests, withRetry } from '../client';
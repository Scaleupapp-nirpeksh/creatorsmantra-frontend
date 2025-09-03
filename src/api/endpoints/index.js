/**
 * Central Export for All API Endpoints
 * Aggregates and exports all API modules for easy import throughout the application
 * * @filepath src/api/endpoints/index.js
 * @author CreatorsMantra Frontend Team
 * @version 1.0.0
 */

// Core APIs
export { authAPI } from './auth';
export { dealsAPI } from './deals';
export { invoicesAPI, invoiceHelpers } from './invoices';
export { briefsAPI, briefHelpers } from './briefs';
export { analyticsAPI } from './analytics';
export { performanceAPI } from './performance';
export { contractsAPI } from './contracts';
export { subscriptionsAPI } from './subscriptions';
export { scriptsAPI } from './scripts';
export { rateCardAPI } from './ratecards'; 


// Re-export main API client utilities
export { 
  api, 
  tokenManager, 
  createCancelToken, 
  batchRequests, 
  withRetry 
} from '../client';
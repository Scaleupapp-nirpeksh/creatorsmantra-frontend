/**
 * CreatorsMantra Frontend - Constants Index
 * Central export point for all application constants
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description Barrel export for all constants modules
 * @path src/constants/index.js
 */

// Import all constants
export * from './colors';
export * from './routes';
export * from './api';
export * from './messages';

// Import defaults for easier access
export { default as COLORS } from './colors';
export { default as ROUTES } from './routes';
export { default as API } from './api';
export { default as MESSAGES } from './messages';

// Re-export commonly used constants for convenience
export {
  BRAND_COLORS,
  NEUTRAL_COLORS,
  SEMANTIC_COLORS,
  MODULE_COLORS,
  PIPELINE_COLORS,
} from './colors';

export {
  BASE_ROUTES,
  AUTH_ROUTES,
  DEAL_ROUTES,
  INVOICE_ROUTES,
  ANALYTICS_ROUTES,
  NAVIGATION_STRUCTURE,
} from './routes';

export {
  API_URL,
  AUTH_ENDPOINTS,
  DEAL_ENDPOINTS,
  INVOICE_ENDPOINTS,
  HTTP_STATUS,
  ERROR_CODES,
} from './api';

export {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  WARNING_MESSAGES,
  PLACEHOLDER_TEXT,
  VALIDATION_MESSAGES,
} from './messages';

// Debug helper for development
if (process.env.NODE_ENV === 'development') {
  console.log('📦 CreatorsMantra Constants System Loaded', {
    modules: ['colors', 'routes', 'api', 'messages'],
    timestamp: new Date().toISOString(),
  });
}
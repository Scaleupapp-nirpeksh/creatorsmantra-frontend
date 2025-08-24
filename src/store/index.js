/**
 * Store Index - Central export for all Zustand stores
 * 
 * This file exports:
 * - All individual stores
 * - Store selectors for optimized re-renders
 * - Store utilities
 * 
 * File: src/store/index.js
 */

// Import all stores
import useAuthStore from './authStore';
import useUIStore from './uiStore';
import useDataStore from './dataStore';

// ============================================
// Store Selectors (for optimized re-renders)
// ============================================

/**
 * Auth Selectors
 * Use these to avoid unnecessary re-renders
 */
export const authSelectors = {
  user: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
  isLoading: (state) => state.isLoading,
  subscription: (state) => state.subscription,
  permissions: (state) => state.permissions,
  hasPermission: (state) => state.hasPermission,
  hasSubscription: (state) => state.hasSubscription,
  canAccessFeature: (state) => state.canAccessFeature
};

/**
 * UI Selectors
 */
export const uiSelectors = {
  sidebar: (state) => state.sidebar,
  isSidebarOpen: (state) => state.sidebar.isOpen,
  isMobileSidebarOpen: (state) => state.sidebar.isMobileOpen,
  activeMenuItem: (state) => state.sidebar.activeItem,
  modals: (state) => state.modals,
  isModalOpen: (modalName) => (state) => state.modals[modalName],
  theme: (state) => state.theme,
  viewport: (state) => state.viewport,
  isMobile: (state) => state.viewport.isMobile,
  isDesktop: (state) => state.viewport.isDesktop,
  loading: (state) => state.loading,
  isGlobalLoading: (state) => state.loading.global,
  breadcrumbs: (state) => state.breadcrumbs,
  pageTitle: (state) => state.pageTitle
};

/**
 * Data Selectors
 */
export const dataSelectors = {
  // Deals
  deals: (state) => state.deals.list,
  dealById: (dealId) => (state) => state.deals.byId[dealId],
  dealsLoading: (state) => state.deals.isLoading,
  dealFilters: (state) => state.deals.filters,
  dealsPagination: (state) => state.deals.pagination,
  
  // Invoices
  invoices: (state) => state.invoices.list,
  invoiceById: (invoiceId) => (state) => state.invoices.byId[invoiceId],
  invoicesLoading: (state) => state.invoices.isLoading,
  availableDeals: (state) => state.invoices.availableDeals,
  taxPreferences: (state) => state.invoices.taxPreferences,
  
  // Briefs
  briefs: (state) => state.briefs.list,
  briefById: (briefId) => (state) => state.briefs.byId[briefId],
  briefsLoading: (state) => state.briefs.isLoading,
  
  // Analytics
  analyticsDashboard: (state) => state.analytics.dashboard,
  analyticsRevenue: (state) => state.analytics.revenue,
  analyticsInsights: (state) => state.analytics.insights,
  analyticsLoading: (state) => state.analytics.isLoading,
  
  // Performance
  campaigns: (state) => state.performance.campaigns,
  campaignById: (campaignId) => (state) => state.performance.byId[campaignId],
  performanceLoading: (state) => state.performance.isLoading,
  
  // Contracts
  contracts: (state) => state.contracts.list,
  contractById: (contractId) => (state) => state.contracts.byId[contractId],
  contractsLoading: (state) => state.contracts.isLoading,
  
  // Rate Cards
  rateCards: (state) => state.rateCards.list,
  rateCardById: (rateCardId) => (state) => state.rateCards.byId[rateCardId],
  rateCardsLoading: (state) => state.rateCards.isLoading
};

// ============================================
// Store Hooks (for common combinations)
// ============================================

/**
 * Use current user data
 */
export const useCurrentUser = () => {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const subscription = useAuthStore(authSelectors.subscription);
  
  return { user, isAuthenticated, subscription };
};

/**
 * Use loading states across all stores
 */
export const useGlobalLoading = () => {
  const authLoading = useAuthStore(authSelectors.isLoading);
  const uiLoading = useUIStore(uiSelectors.isGlobalLoading);
  const dealsLoading = useDataStore(dataSelectors.dealsLoading);
  const invoicesLoading = useDataStore(dataSelectors.invoicesLoading);
  
  return authLoading || uiLoading || dealsLoading || invoicesLoading;
};

/**
 * Use mobile detection
 */
export const useIsMobile = () => {
  return useUIStore(uiSelectors.isMobile);
};

/**
 * Use theme
 */
export const useTheme = () => {
  const theme = useUIStore(uiSelectors.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  
  return { theme, setTheme, toggleTheme };
};

// ============================================
// Store Utilities
// ============================================

/**
 * Reset all stores to initial state
 */
export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useUIStore.getState().resetUI();
  useDataStore.getState().clearAllData();
};

/**
 * Initialize all stores
 */
export const initializeStores = async () => {
  // Initialize auth
  await useAuthStore.getState().initialize();
  
  // Initialize viewport listener
  useUIStore.getState().initializeViewport();
  
  // Set theme from storage
  const theme = useUIStore.getState().theme;
  useUIStore.getState().setTheme(theme);
};

/**
 * Debug function to log all store states
 */
export const debugStores = () => {
  if (import.meta.env.DEV) {
    console.group('🏪 Store States');
    console.log('Auth Store:', useAuthStore.getState());
    console.log('UI Store:', useUIStore.getState());
    console.log('Data Store:', useDataStore.getState());
    console.groupEnd();
  }
};

// ============================================
// Store Subscriptions
// ============================================

/**
 * Subscribe to auth changes
 */
export const subscribeToAuth = (callback) => {
  return useAuthStore.subscribe(
    (state) => state.isAuthenticated,
    callback
  );
};

/**
 * Subscribe to theme changes
 */
export const subscribeToTheme = (callback) => {
  return useUIStore.subscribe(
    (state) => state.theme,
    callback
  );
};

// ============================================
// Main Exports
// ============================================

// Export individual stores
export { useAuthStore, useUIStore, useDataStore };

// Export store provider for app initialization
export const StoreProvider = ({ children }) => {
  // This is a placeholder for future store provider logic
  // Currently, Zustand doesn't require a provider
  return children;
};

// Create a hook for store initialization
export const useStoreInitialization = () => {
  const initialized = useAuthStore((state) => state.isInitialized);
  const initialize = useAuthStore((state) => state.initialize);
  const initViewport = useUIStore((state) => state.initializeViewport);
  
  useEffect(() => {
    // Initialize stores on app mount
    if (!initialized) {
      initialize();
    }
    
    // Initialize viewport listener
    const cleanup = initViewport();
    
    // Debug stores in development
    if (import.meta.env.DEV) {
      window.debugStores = debugStores;
      console.log('💡 Tip: Use window.debugStores() to inspect store states');
    }
    
    return cleanup;
  }, [initialized, initialize, initViewport]);
  
  return initialized;
};

// ============================================
// Type Definitions (for better IDE support)
// ============================================

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} role
 * @property {Object} profile
 */

/**
 * @typedef {Object} Deal
 * @property {string} _id
 * @property {string} title
 * @property {string} brandId
 * @property {string} stage
 * @property {number} value
 * @property {Date} deadline
 */

/**
 * @typedef {Object} Invoice
 * @property {string} _id
 * @property {string} invoiceNumber
 * @property {string[]} dealIds
 * @property {number} amount
 * @property {string} status
 */

// Export type definitions for use in components
export const StoreTypes = {
  User: 'User',
  Deal: 'Deal',
  Invoice: 'Invoice'
};

// ============================================
// Performance Monitoring (Development Only)
// ============================================

if (import.meta.env.DEV) {
  // Monitor store updates
  let authUpdates = 0;
  let uiUpdates = 0;
  let dataUpdates = 0;
  
  useAuthStore.subscribe(() => {
    authUpdates++;
    console.log(`[Auth Store] Update #${authUpdates}`);
  });
  
  useUIStore.subscribe(() => {
    uiUpdates++;
    console.log(`[UI Store] Update #${uiUpdates}`);
  });
  
  useDataStore.subscribe(() => {
    dataUpdates++;
    console.log(`[Data Store] Update #${dataUpdates}`);
  });
  
  // Log performance stats every 30 seconds
  setInterval(() => {
    console.group('📊 Store Performance Stats');
    console.log(`Auth Updates: ${authUpdates}`);
    console.log(`UI Updates: ${uiUpdates}`);
    console.log(`Data Updates: ${dataUpdates}`);
    console.groupEnd();
    
    // Reset counters
    authUpdates = 0;
    uiUpdates = 0;
    dataUpdates = 0;
  }, 30000);
}

export default {
  useAuthStore,
  useUIStore,
  useDataStore,
  selectors: {
    auth: authSelectors,
    ui: uiSelectors,
    data: dataSelectors
  },
  hooks: {
    useCurrentUser,
    useGlobalLoading,
    useIsMobile,
    useTheme
  },
  utils: {
    resetAllStores,
    initializeStores,
    debugStores
  }
};
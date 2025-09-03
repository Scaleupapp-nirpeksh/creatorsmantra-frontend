/**
 * Store Index - Central export for all Zustand stores
 * * This file exports:
 * - All individual stores
 * - Store selectors for optimized re-renders
 * - Store utilities
 * * File: src/store/index.js
 */

import { useEffect } from 'react';

// Import all stores
import useAuthStore from './authStore';
import useUIStore from './uiStore';
import useDataStore from './dataStore';
import useBriefStore from './briefStore';
import useScriptsStore from './scriptsStore';
import useInvoiceStore from './invoiceStore';
import useRateCardStore from './ratecardStore';

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
 * Data Selectors (Legacy - prefer direct store usage)
 */
export const dataSelectors = {
  // Deals
  deals: (state) => state.deals.list,
  dealById: (dealId) => (state) => state.deals.byId[dealId],
  dealsLoading: (state) => state.deals.isLoading,
  dealFilters: (state) => state.deals.filters,
  dealsPagination: (state) => state.deals.pagination,

  // Invoices (legacy - prefer using useInvoiceStore directly)
  invoices: (state) => state.invoices.list,
  invoiceById: (invoiceId) => (state) => state.invoices.byId[invoiceId],
  invoicesLoading: (state) => state.invoices.isLoading,

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
};

/**
 * Brief Selectors
 */
export const briefSelectors = {
  // Core brief data
  briefs: (state) => state.briefs.list,
  briefById: (briefId) => (state) => state.briefs.byId[briefId],
  briefsLoading: (state) => state.briefs.isLoading,
  briefsError: (state) => state.briefs.error,

  // Current brief
  currentBrief: (state) => state.currentBrief.data,
  currentBriefLoading: (state) => state.currentBrief.isLoading,
  currentBriefError: (state) => state.currentBrief.error,
  isCurrentBriefDirty: (state) => state.currentBrief.isDirty,

  // Dashboard and metadata
  dashboardStats: (state) => state.dashboardStats.data,
  dashboardStatsLoading: (state) => state.dashboardStats.isLoading,
  briefMetadata: (state) => state.metadata.data,
  briefMetadataLoading: (state) => state.metadata.isLoading,

  // Filters and pagination
  briefFilters: (state) => state.filters,
  briefPagination: (state) => state.pagination,

  // AI extraction
  aiExtraction: (state) => state.aiExtraction,
  isAIProcessing: (state) => state.aiExtraction.isProcessing,
  aiProgress: (state) => state.aiExtraction.progress,
  aiStatus: (state) => state.aiExtraction.status,

  // File upload
  fileUpload: (state) => state.fileUpload,
  isFileUploading: (state) => state.fileUpload.isUploading,
  uploadProgress: (state) => state.fileUpload.progress,
  uploadError: (state) => state.fileUpload.error,

  // Clarifications
  clarifications: (state) => state.clarifications,
  clarificationEmail: (state) => state.clarifications.emailTemplate,
  isGeneratingEmail: (state) => state.clarifications.isGenerating,

  // Deal conversion
  dealConversion: (state) => state.dealConversion,
  dealPreview: (state) => state.dealConversion.preview,
  isGeneratingPreview: (state) => state.dealConversion.isGenerating,
  isConvertingToDeal: (state) => state.dealConversion.isConverting
};

/**
 * Scripts Selectors
 */
export const scriptsSelectors = {
  // Scripts list and data
  scripts: (state) => state.scripts,
  currentScript: (state) => state.currentScript,
  dashboardStats: (state) => state.dashboardStats,
  scriptMetadata: (state) => state.scriptMetadata,
  availableDeals: (state) => state.availableDeals,

  // Pagination and filters
  pagination: (state) => state.pagination,
  filters: (state) => state.filters,

  // Loading states
  isLoading: (state) => state.isLoading,
  isCreating: (state) => state.isCreating,
  isGenerating: (state) => state.isGenerating,
  isPolling: (state) => state.isPolling,

  // Upload states
  uploadProgress: (state) => state.uploadProgress,
  isUploading: (state) => state.isUploading,

  // Bulk operations
  selectedScripts: (state) => state.selectedScripts,
  bulkActionMode: (state) => state.bulkActionMode
};

/**
 * Invoice Selectors
 */
export const invoiceSelectors = {
  // Core invoice data
  invoices: (state) => state.invoices,
  currentInvoice: (state) => state.currentInvoice,
  availableDeals: (state) => state.availableDeals,
  taxPreferences: (state) => state.taxPreferences,

  // Analytics and dashboard
  analytics: (state) => state.analytics,
  dashboard: (state) => state.dashboard,

  // Filters and pagination
  filters: (state) => state.filters,
  pagination: (state) => state.pagination,

  // Loading states
  isLoading: (state) => state.isLoading,
  isGeneratingPDF: (state) => state.isGeneratingPDF,
  isInitialized: (state) => state.isInitialized,

  // Derived selectors
  totalInvoices: (state) => state.invoices.length,
  draftInvoices: (state) => state.invoices.filter(inv => inv.status === 'draft'),
  sentInvoices: (state) => state.invoices.filter(inv => inv.status === 'sent'),
  paidInvoices: (state) => state.invoices.filter(inv => inv.status === 'paid'),
  overdueInvoices: (state) => state.invoices.filter(inv => inv.status === 'overdue'),

  // Current invoice helpers
  hasCurrentInvoice: (state) => !!state.currentInvoice,
  currentInvoiceStatus: (state) => state.currentInvoice?.status,
  currentInvoiceAmount: (state) => state.currentInvoice?.totalAmount,
  currentInvoiceDueDate: (state) => state.currentInvoice?.invoiceSettings?.dueDate,

  // Tax preference helpers
  hasTaxPreferences: (state) => !!state.taxPreferences,
  gstEnabled: (state) => state.taxPreferences?.enableGST,
  tdsEnabled: (state) => state.taxPreferences?.enableTDS,
  defaultGstRate: (state) => state.taxPreferences?.defaultGstRate,
  defaultTdsRate: (state) => state.taxPreferences?.defaultTdsRate
};

/**
 * Rate Card Selectors
 */
export const rateCardSelectors = {
  // Core rate card data
  rateCards: (state) => state.rateCards,
  currentRateCard: (state) => state.currentRateCard,
  pagination: (state) => state.pagination,
  
  // Features
  aiSuggestions: (state) => state.aiSuggestions,
  analytics: (state) => state.analytics,
  history: (state) => state.history,
  
  // Loading states
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,

  // Helpers
  hasCurrentRateCard: (state) => !!state.currentRateCard
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
  const briefsLoading = useBriefStore(briefSelectors.briefsLoading);
  const scriptsLoading = useScriptsStore(scriptsSelectors.isLoading);
  const invoicesLoading = useInvoiceStore(invoiceSelectors.isLoading);
  const rateCardsLoading = useRateCardStore(rateCardSelectors.isLoading);
  
  return authLoading || uiLoading || dealsLoading || briefsLoading || scriptsLoading || invoicesLoading || rateCardsLoading;
};

/**
 * Use brief state with common data
 */
export const useBriefState = () => {
  const briefs = useBriefStore(briefSelectors.briefs);
  const isLoading = useBriefStore(briefSelectors.briefsLoading);
  const error = useBriefStore(briefSelectors.briefsError);
  const filters = useBriefStore(briefSelectors.briefFilters);
  const pagination = useBriefStore(briefSelectors.briefPagination);
  
  return { briefs, isLoading, error, filters, pagination };
};

/**
 * Use scripts state with common data
 */
export const useScriptsState = () => {
  const scripts = useScriptsStore(scriptsSelectors.scripts);
  const isLoading = useScriptsStore(scriptsSelectors.isLoading);
  const filters = useScriptsStore(scriptsSelectors.filters);
  const pagination = useScriptsStore(scriptsSelectors.pagination);
  const metadata = useScriptsStore(scriptsSelectors.scriptMetadata);
  
  return { scripts, isLoading, filters, pagination, metadata };
};

/**
 * Use invoice state with common data
 */
export const useInvoicesState = () => {
  const invoices = useInvoiceStore(invoiceSelectors.invoices);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  const filters = useInvoiceStore(invoiceSelectors.filters);
  const pagination = useInvoiceStore(invoiceSelectors.pagination);
  const dashboard = useInvoiceStore(invoiceSelectors.dashboard);
  
  return { invoices, isLoading, filters, pagination, dashboard };
};

/**
 * Use current invoice with all related state
 */
export const useCurrentInvoice = () => {
  const invoice = useInvoiceStore(invoiceSelectors.currentInvoice);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  const isGeneratingPDF = useInvoiceStore(invoiceSelectors.isGeneratingPDF);
  
  // Actions
  const fetchInvoice = useInvoiceStore(state => state.fetchInvoiceById);
  const updateInvoice = useInvoiceStore(state => state.updateInvoice);
  const deleteInvoice = useInvoiceStore(state => state.deleteInvoice);
  const generatePDF = useInvoiceStore(state => state.generateInvoicePDF);
  const clearInvoice = useInvoiceStore(state => state.clearCurrentInvoice);
  
  return {
    invoice,
    isLoading,
    isGeneratingPDF,
    fetchInvoice,
    updateInvoice,
    deleteInvoice,
    generatePDF,
    clearInvoice
  };
};

/**
 * Use invoice creation
 */
export const useInvoiceCreation = () => {
  const availableDeals = useInvoiceStore(invoiceSelectors.availableDeals);
  const taxPreferences = useInvoiceStore(invoiceSelectors.taxPreferences);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  
  // Actions
  const fetchAvailableDeals = useInvoiceStore(state => state.fetchAvailableDeals);
  const createIndividualInvoice = useInvoiceStore(state => state.createIndividualInvoice);
  const createConsolidatedInvoice = useInvoiceStore(state => state.createConsolidatedInvoice);
  const calculateTaxPreview = useInvoiceStore(state => state.calculateTaxPreview);
  
  return {
    availableDeals,
    taxPreferences,
    isLoading,
    fetchAvailableDeals,
    createIndividualInvoice,
    createConsolidatedInvoice,
    calculateTaxPreview
  };
};

/**
 * Use tax preferences
 */
export const useTaxPreferences = () => {
  const preferences = useInvoiceStore(invoiceSelectors.taxPreferences);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  
  // Actions
  const fetchPreferences = useInvoiceStore(state => state.fetchTaxPreferences);
  const updatePreferences = useInvoiceStore(state => state.updateTaxPreferences);
  
  // Computed values
  const gstEnabled = useInvoiceStore(invoiceSelectors.gstEnabled);
  const tdsEnabled = useInvoiceStore(invoiceSelectors.tdsEnabled);
  const defaultGstRate = useInvoiceStore(invoiceSelectors.defaultGstRate);
  const defaultTdsRate = useInvoiceStore(invoiceSelectors.defaultTdsRate);
  
  return {
    preferences,
    isLoading,
    fetchPreferences,
    updatePreferences,
    gstEnabled,
    tdsEnabled,
    defaultGstRate,
    defaultTdsRate
  };
};

/**
 * Use invoice analytics
 */
export const useInvoiceAnalytics = () => {
  const analytics = useInvoiceStore(invoiceSelectors.analytics);
  const dashboard = useInvoiceStore(invoiceSelectors.dashboard);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  
  // Actions
  const fetchAnalytics = useInvoiceStore(state => state.fetchAnalytics);
  const fetchDashboard = useInvoiceStore(state => state.fetchDashboard);
  
  return {
    analytics,
    dashboard,
    isLoading,
    fetchAnalytics,
    fetchDashboard
  };
};

/**
 * Use payment management
 */
export const usePaymentManagement = () => {
  const currentInvoice = useInvoiceStore(invoiceSelectors.currentInvoice);
  const isLoading = useInvoiceStore(invoiceSelectors.isLoading);
  
  // Actions
  const recordPayment = useInvoiceStore(state => state.recordPayment);
  const fetchPaymentHistory = useInvoiceStore(state => state.fetchPaymentHistory);
  const verifyPayment = useInvoiceStore(state => state.verifyPayment);
  const scheduleReminders = useInvoiceStore(state => state.scheduleReminders);
  
  return {
    currentInvoice,
    isLoading,
    recordPayment,
    fetchPaymentHistory,
    verifyPayment,
    scheduleReminders
  };
};

/**
 * Use invoice filters and pagination
 */
export const useInvoiceFiltering = () => {
  const filters = useInvoiceStore(invoiceSelectors.filters);
  const pagination = useInvoiceStore(invoiceSelectors.pagination);
  
  // Actions
  const setFilters = useInvoiceStore(state => state.setFilters);
  const setPage = useInvoiceStore(state => state.setPage);
  const clearFilters = useInvoiceStore(state => state.clearFilters);
  const fetchInvoices = useInvoiceStore(state => state.fetchInvoices);
  
  return {
    filters,
    pagination,
    setFilters,
    setPage,
    clearFilters,
    fetchInvoices
  };
};

/**
 * Use current script with all related state
 */
export const useCurrentScript = () => {
  const script = useScriptsStore(scriptsSelectors.currentScript);
  const isLoading = useScriptsStore(scriptsSelectors.isLoading);
  const isGenerating = useScriptsStore(scriptsSelectors.isGenerating);
  
  // Actions
  const fetchScript = useScriptsStore(state => state.fetchScriptById);
  const updateScript = useScriptsStore(state => state.updateScript);
  const regenerateScript = useScriptsStore(state => state.regenerateScript);
  const clearScript = useScriptsStore(state => state.clearCurrentScript);
  
  return {
    script,
    isLoading,
    isGenerating,
    fetchScript,
    updateScript,
    regenerateScript,
    clearScript
  };
};

/**
 * Use script generation state
 */
export const useScriptGeneration = () => {
  const isGenerating = useScriptsStore(scriptsSelectors.isGenerating);
  const isPolling = useScriptsStore(scriptsSelectors.isPolling);
  
  // Actions
  const createTextScript = useScriptsStore(state => state.createTextScript);
  const createFileScript = useScriptsStore(state => state.createFileScript);
  const createVideoScript = useScriptsStore(state => state.createVideoScript);
  const regenerateScript = useScriptsStore(state => state.regenerateScript);
  
  return {
    isGenerating,
    isPolling,
    createTextScript,
    createFileScript,
    createVideoScript,
    regenerateScript
  };
};

/**
 * Use script variations
 */
export const useScriptVariations = () => {
  const currentScript = useScriptsStore(scriptsSelectors.currentScript);
  
  // Actions
  const createVariation = useScriptsStore(state => state.createScriptVariation);
  
  return {
    variations: currentScript?.aiGeneration?.scriptVariations || [],
    createVariation
  };
};

/**
 * Use script deal connection
 */
export const useScriptDealConnection = () => {
  const availableDeals = useScriptsStore(scriptsSelectors.availableDeals);
  
  // Actions
  const fetchAvailableDeals = useScriptsStore(state => state.fetchAvailableDeals);
  const linkToDeal = useScriptsStore(state => state.linkScriptToDeal);
  const unlinkFromDeal = useScriptsStore(state => state.unlinkScriptFromDeal);
  
  return {
    availableDeals,
    fetchAvailableDeals,
    linkToDeal,
    unlinkFromDeal
  };
};

/**
 * Use rate card list state with pagination.
 */
export const useRateCardsState = () => {
  const rateCards = useRateCardStore(rateCardSelectors.rateCards);
  const isLoading = useRateCardStore(rateCardSelectors.isLoading);
  const pagination = useRateCardStore(rateCardSelectors.pagination);
  
  // Actions
  const fetchRateCards = useRateCardStore(state => state.fetchRateCards);

  return { rateCards, isLoading, pagination, fetchRateCards };
};

/**
 * Use the currently active rate card and its related actions.
 */
export const useCurrentRateCard = () => {
  const rateCard = useRateCardStore(rateCardSelectors.currentRateCard);
  const isLoading = useRateCardStore(rateCardSelectors.isLoading);
  
  // Actions
  const fetchRateCard = useRateCardStore(state => state.fetchRateCard);
  const deleteRateCard = useRateCardStore(state => state.deleteRateCard);
  const clearRateCard = useRateCardStore(state => state.clearCurrentRateCard);
  const updateMetrics = useRateCardStore(state => state.updateMetrics);
  const updatePricing = useRateCardStore(state => state.updatePricing);
  const createPackage = useRateCardStore(state => state.createPackage);
  const deletePackage = useRateCardStore(state => state.deletePackage);
  const publishRateCard = useRateCardStore(state => state.publishRateCard);

  return {
    rateCard,
    isLoading,
    fetchRateCard,
    deleteRateCard,
    clearRateCard,
    updateMetrics,
    updatePricing,
    createPackage,
    deletePackage,
    publishRateCard,
  };
};

/**
 * Use rate card creation workflow.
 */
export const useRateCardCreation = () => {
  const isLoading = useRateCardStore(rateCardSelectors.isLoading);
  const aiSuggestions = useRateCardStore(rateCardSelectors.aiSuggestions);

  // Actions
  const createRateCard = useRateCardStore(state => state.createRateCard);
  
  return { isLoading, aiSuggestions, createRateCard };
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
  useBriefStore.getState().reset();
  useScriptsStore.getState().reset();
  useInvoiceStore.getState().reset();
  useRateCardStore.getState().reset();
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
  
  // Initialize brief metadata (cached for long time)
  useBriefStore.getState().fetchBriefMetadata();
  
  // Initialize scripts metadata
  useScriptsStore.getState().initialize();
  
  // Initialize invoice store
  await useInvoiceStore.getState().init();

  // Rate card store does not have an explicit init function
};

/**
 * Debug function to log all store states
 */
export const debugStores = () => {
  if (import.meta.env.DEV) {
    console.group('Store States');
    console.log('Auth Store:', useAuthStore.getState());
    console.log('UI Store:', useUIStore.getState());
    console.log('Data Store:', useDataStore.getState());
    console.log('Brief Store:', useBriefStore.getState());
    console.log('Scripts Store:', useScriptsStore.getState());
    console.log('Invoice Store:', useInvoiceStore.getState());
    console.log('Rate Card Store:', useRateCardStore.getState());
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

/**
 * Subscribe to brief changes
 */
export const subscribeToBriefChanges = (callback) => {
  return useBriefStore.subscribe(
    (state) => state.briefs.list,
    callback
  );
};

/**
 * Subscribe to script changes
 */
export const subscribeToScriptChanges = (callback) => {
  return useScriptsStore.subscribe(
    (state) => state.scripts,
    callback
  );
};

/**
 * Subscribe to script generation progress
 */
export const subscribeToScriptGeneration = (callback) => {
  return useScriptsStore.subscribe(
    (state) => state.isGenerating,
    callback
  );
};

/**
 * Subscribe to invoice changes
 */
export const subscribeToInvoiceChanges = (callback) => {
  return useInvoiceStore.subscribe(
    (state) => state.invoices,
    callback
  );
};

/**
 * Subscribe to current invoice changes
 */
export const subscribeToCurrentInvoice = (callback) => {
  return useInvoiceStore.subscribe(
    (state) => state.currentInvoice,
    callback
  );
};

/**
 * Subscribe to PDF generation progress
 */
export const subscribeToPDFGeneration = (callback) => {
  return useInvoiceStore.subscribe(
    (state) => state.isGeneratingPDF,
    callback
  );
};

/**
 * Subscribe to rate card changes
 */
export const subscribeToRateCardChanges = (callback) => {
  return useRateCardStore.subscribe(
    (state) => state.rateCards,
    callback
  );
};

/**
 * Subscribe to current rate card changes
 */
export const subscribeToCurrentRateCard = (callback) => {
  return useRateCardStore.subscribe(
    (state) => state.currentRateCard,
    callback
  );
};

/**
 * Subscribe to AI extraction progress
 */
export const subscribeToAIProgress = (callback) => {
  return useBriefStore.subscribe(
    (state) => state.aiExtraction.progress,
    callback
  );
};

// ============================================
// Main Exports
// ============================================

// Export individual stores
export { 
  useAuthStore, 
  useUIStore, 
  useDataStore, 
  useBriefStore, 
  useScriptsStore, 
  useInvoiceStore,
  useRateCardStore
};

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
    
    // Initialize brief metadata
    useBriefStore.getState().fetchBriefMetadata();
    
    // Initialize scripts metadata
    useScriptsStore.getState().initialize();
    
    // Initialize invoice store
    useInvoiceStore.getState().init();
    
    // Debug stores in development
    if (import.meta.env.DEV) {
      window.debugStores = debugStores;
      console.log('Tip: Use window.debugStores() to inspect store states');
    }
    
    return cleanup;
  }, [initialized, initialize, initViewport]);
  
  return initialized;
};

// ============================================
// Workflow Initialization & Cleanup Utilities
// ============================================

/**
 * Initialize invoice workflow for a new user session
 */
export const initializeInvoiceWorkflow = async () => {
  const invoiceStore = useInvoiceStore.getState();
  const authStore = useAuthStore.getState();
  
  if (authStore.canAccessFeature('invoices')) {
    await invoiceStore.init();
    await invoiceStore.fetchInvoices();
  }
};

/**
 * Clean up invoice store on logout
 */
export const cleanupInvoiceStore = () => {
  useInvoiceStore.getState().reset();
};

/**
 * Initialize invoice creation workflow
 */
export const initializeInvoiceCreation = async () => {
  const invoiceStore = useInvoiceStore.getState();
  await Promise.allSettled([
    invoiceStore.fetchAvailableDeals(),
    invoiceStore.fetchTaxPreferences()
  ]);
};

/**
 * Initialize scripts workflow for a new user session
 */
export const initializeScriptsWorkflow = async () => {
  const scriptsStore = useScriptsStore.getState();
  const authStore = useAuthStore.getState();
  
  if (authStore.canAccessFeature('scripts')) {
    await scriptsStore.initialize();
    await scriptsStore.fetchScripts();
  }
};

/**
 * Clean up scripts store on logout
 */
export const cleanupScriptsStore = () => {
  useScriptsStore.getState().reset();
};

/**
 * Initialize brief workflow for a new user session
 */
export const initializeBriefWorkflow = async () => {
  const briefStore = useBriefStore.getState();
  const authStore = useAuthStore.getState();
  
  if (authStore.canAccessFeature('briefs')) {
    await briefStore.fetchDashboardStats();
    await briefStore.fetchBriefMetadata();
    await briefStore.fetchBriefs();
  }
};

/**
 * Clean up brief store on logout
 */
export const cleanupBriefStore = () => {
  useBriefStore.getState().reset();
};

/**
 * Initialize rate card workflow for a new user session
 */
export const initializeRateCardWorkflow = async () => {
  const rateCardStore = useRateCardStore.getState();
  const authStore = useAuthStore.getState();

  if (authStore.canAccessFeature('rateCards')) {
    await rateCardStore.fetchRateCards();
  }
};

/**
 * Clean up rate card store on logout
 */
export const cleanupRateCardStore = () => {
  useRateCardStore.getState().reset();
};

/**
 * Use rate card summary statistics
 */
export const useRateCardSummary = () => {
  const rateCards = useRateCardStore(state => state.rateCards);
  
  return {
    totalRateCards: rateCards.length,
    activeCount: rateCards.filter(rc => rc.status === 'active').length,
    draftCount: rateCards.filter(rc => rc.status === 'draft').length,
    archivedCount: rateCards.filter(rc => rc.status === 'archived').length
  };
};

// ============================================
// Permission & Accessor Utilities
// ============================================

/**
 * Helper to check if user can create invoices
 */
export const canCreateInvoices = () => {
  const authStore = useAuthStore.getState();
  return authStore.canAccessFeature('invoices') && 
         authStore.hasSubscription(['starter', 'pro', 'elite', 'agency_starter', 'agency_pro']);
};

/**
 * Helper to check if user can access analytics
 */
export const canAccessInvoiceAnalytics = () => {
  const authStore = useAuthStore.getState();
  return authStore.canAccessFeature('analytics') && 
         authStore.hasSubscription(['pro', 'elite', 'agency_starter', 'agency_pro']);
};

/**
 * Helper to get invoice summary statistics
 */
export const useInvoiceSummary = () => {
  const invoices = useInvoiceStore(invoiceSelectors.invoices);
  const dashboard = useInvoiceStore(invoiceSelectors.dashboard);
  
  return {
    totalInvoices: invoices.length,
    draftCount: invoices.filter(inv => inv.status === 'draft').length,
    sentCount: invoices.filter(inv => inv.status === 'sent').length,
    paidCount: invoices.filter(inv => inv.status === 'paid').length,
    overdueCount: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: dashboard?.totalRevenue || 0,
    outstandingAmount: dashboard?.outstandingAmount || 0,
    avgPaymentTime: dashboard?.avgPaymentTime || 0
  };
};

// ============================================
// Performance Monitoring (Development Only)
// ============================================

if (import.meta.env.DEV) {
  let authUpdates = 0;
  let uiUpdates = 0;
  let dataUpdates = 0;
  let briefUpdates = 0;
  let scriptsUpdates = 0;
  let invoiceUpdates = 0;
  let rateCardUpdates = 0;
  
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

  useBriefStore.subscribe(() => {
    briefUpdates++;
    console.log(`[Brief Store] Update #${briefUpdates}`);
  });
  
  useScriptsStore.subscribe(() => {
    scriptsUpdates++;
    console.log(`[Scripts Store] Update #${scriptsUpdates}`);
  });
  
  useInvoiceStore.subscribe(() => {
    invoiceUpdates++;
    console.log(`[Invoice Store] Update #${invoiceUpdates}`);
  });

  useRateCardStore.subscribe(() => {
    rateCardUpdates++;
    console.log(`[Rate Card Store] Update #${rateCardUpdates}`);
  });
  
  setInterval(() => {
    console.group('Store Performance Stats');
    console.log(`Auth Updates: ${authUpdates}`);
    console.log(`UI Updates: ${uiUpdates}`);
    console.log(`Data Updates: ${dataUpdates}`);
    console.log(`Brief Updates: ${briefUpdates}`);
    console.log(`Scripts Updates: ${scriptsUpdates}`);
    console.log(`Invoice Updates: ${invoiceUpdates}`);
    console.log(`Rate Card Updates: ${rateCardUpdates}`);
    console.groupEnd();
    
    authUpdates = 0;
    uiUpdates = 0;
    dataUpdates = 0;
    briefUpdates = 0;
    scriptsUpdates = 0;
    invoiceUpdates = 0;
    rateCardUpdates = 0;
  }, 30000);
}

export default {
  useAuthStore,
  useUIStore,
  useDataStore,
  useBriefStore,
  useScriptsStore,
  useInvoiceStore,
  useRateCardStore,
  selectors: {
    auth: authSelectors,
    ui: uiSelectors,
    data: dataSelectors,
    brief: briefSelectors,
    scripts: scriptsSelectors,
    invoice: invoiceSelectors,
    rateCard: rateCardSelectors
  },
  hooks: {
    useCurrentUser,
    useGlobalLoading,
    useIsMobile,
    useTheme,
    // Briefs
    useBriefState,
    // Scripts
    useScriptsState,
    useCurrentScript,
    useScriptGeneration,
    useScriptVariations,
    useScriptDealConnection,
    // Invoices
    useInvoicesState,
    useCurrentInvoice,
    useInvoiceCreation,
    useTaxPreferences,
    useInvoiceAnalytics,
    usePaymentManagement,
    useInvoiceFiltering,
    useInvoiceSummary,
    // Rate Cards
    useRateCardsState,
    useCurrentRateCard,
    useRateCardCreation,
    // REMOVED: useRateCardFiltering - this function was not defined
  },
  utils: {
    resetAllStores,
    initializeStores,
    debugStores,
    // Briefs
    initializeBriefWorkflow,
    cleanupBriefStore,
    // Scripts
    initializeScriptsWorkflow,
    cleanupScriptsStore,
    // Invoices
    initializeInvoiceWorkflow,
    cleanupInvoiceStore,
    initializeInvoiceCreation,
    canCreateInvoices,
    canAccessInvoiceAnalytics,
    // Rate Cards
    initializeRateCardWorkflow,
    cleanupRateCardStore
  }
};
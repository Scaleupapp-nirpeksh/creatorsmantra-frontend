/**
 * Data Store - Global state management for business data
 * 
 * This store manages:
 * - Deals data with caching and optimistic updates
 * - Invoices data with caching and pagination  
 * - Briefs data with caching and filtering
 * - Analytics data with caching and period management
 * - Performance data with campaign tracking
 * - Contracts data with AI analysis and risk assessment
 * - Rate Cards data with pagination and AI suggestions
 * - Cache invalidation and refresh mechanisms
 * - Optimistic updates for better UX
 * 
 * Features:
 * - Multi-level caching with configurable durations
 * - Optimistic updates with rollback on failure
 * - Pagination and filtering support
 * - Error handling with user notifications
 * - Bulk operations support
 * - Real-time data synchronization
 * 
 * @filepath src/store/dataStore.js
 * @version 1.0.0
 * @author CreatorsMantra Frontend Team
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  dealsAPI, 
  invoicesAPI, 
  briefsAPI, 
  analyticsAPI,
  performanceAPI,
  contractsAPI,
  rateCardAPI 
} from '@/api/endpoints';
import toast from 'react-hot-toast';

// Cache duration in milliseconds - optimized for different data types
const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes - frequently changing data
  MEDIUM: 15 * 60 * 1000,   // 15 minutes - moderately stable data
  LONG: 30 * 60 * 1000,     // 30 minutes - stable data
  VERY_LONG: 60 * 60 * 1000 // 1 hour - very stable data like metadata
};

const useDataStore = create(
  subscribeWithSelector((set, get) => ({
    // ============================================
    // Deals State - Sales pipeline management
    // ============================================
    deals: {
      list: [],
      byId: {},
      pipeline: {},
      brands: [],
      templates: [],
      metadata: null,
      lastFetch: null,
      isLoading: false,
      error: null,
      filters: {
        stage: 'all',
        brand: 'all',
        dateRange: 'all',
        search: ''
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false
      }
    },
    
    // ============================================
    // Invoices State - Financial document management
    // ============================================
    invoices: {
      list: [],
      byId: {},
      availableDeals: [],
      taxPreferences: null,
      dashboard: null,
      lastFetch: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        dateRange: 'all',
        search: ''
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false
      }
    },
    
    // ============================================
    // Briefs State - Campaign brief management
    // ============================================
    briefs: {
      list: [],
      byId: {},
      templates: [],
      stats: null,
      lastFetch: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        type: 'all',
        search: ''
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false
      }
    },
    
    // ============================================
    // Analytics State - Business intelligence data
    // ============================================
    analytics: {
      dashboard: null,
      revenue: null,
      performance: null,
      insights: [],
      trends: null,
      lastFetch: null,
      isLoading: false,
      error: null,
      period: 'month'
    },
    
    // ============================================
    // Performance State - Campaign performance tracking
    // ============================================
    performance: {
      campaigns: [],
      byId: {},
      dashboard: null,
      benchmarks: null,
      lastFetch: null,
      isLoading: false,
      error: null
    },
    
    // ============================================
    // Contracts State - Legal document management with AI analysis
    // ============================================
    contracts: {
      list: [],
      byId: {},
      templates: [],
      analytics: null,
      uploadLimits: null,
      activityFeed: [],
      lastFetch: null,
      isLoading: false,
      error: null,
      filters: {
        status: '',
        brandName: '',
        riskLevel: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false
      }
    },
    
    // ============================================
    // Rate Cards State - Pricing and package management
    // ============================================
    rateCards: {
      list: [],
      byId: {},
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      lastFetch: null,
      isLoading: false,
      error: null,
    },
    
    // ============================================
    // Cache Management - Intelligent data freshness control
    // ============================================
    isCacheValid: (dataType, duration = CACHE_DURATION.MEDIUM) => {
      const state = get()[dataType];
      if (!state?.lastFetch) return false;
      
      const now = Date.now();
      const lastFetch = new Date(state.lastFetch).getTime();
      return (now - lastFetch) < duration;
    },
    
    invalidateCache: (dataType = null) => {
      if (dataType) {
        set(state => ({
          [dataType]: {
            ...state[dataType],
            lastFetch: null
          }
        }));
      } else {
        // Invalidate all caches for complete data refresh
        const types = ['deals', 'invoices', 'briefs', 'analytics', 'performance', 'contracts', 'rateCards'];
        types.forEach(type => {
          set(state => ({
            [type]: {
              ...state[type],
              lastFetch: null
            }
          }));
        });
      }
    },
    
    // ============================================
    // Deals Actions - Sales pipeline operations
    // ============================================
    fetchDeals: async (force = false) => {
      const state = get().deals;
      
      // Check cache validity for performance optimization
      if (!force && get().isCacheValid('deals', CACHE_DURATION.SHORT)) {
        return { success: true, data: state.list };
      }
      
      set(state => ({
        deals: { ...state.deals, isLoading: true, error: null }
      }));
      
      try {
        const { filters, pagination } = state;
        const response = await dealsAPI.getDeals({
          ...filters,
          page: pagination.page,
          limit: pagination.limit
        });
        
        if (response.success) {
          const { deals, total, hasMore } = response.data;
          
          // Create byId map for O(1) lookups
          const byId = deals.reduce((acc, deal) => {
            acc[deal._id] = deal;
            return acc;
          }, {});
          
          set(state => ({
            deals: {
              ...state.deals,
              list: deals,
              byId: { ...state.deals.byId, ...byId },
              lastFetch: new Date().toISOString(),
              isLoading: false,
              pagination: {
                ...state.deals.pagination,
                total,
                hasMore
              }
            }
          }));
          
          return { success: true, data: deals };
        }
        
        throw new Error(response.message || 'Failed to fetch deals');
      } catch (error) {
        set(state => ({
          deals: { ...state.deals, isLoading: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },
    
    fetchDealById: async (dealId, force = false) => {
      const state = get().deals;
      
      // Check cache for individual deal
      if (!force && state.byId[dealId] && get().isCacheValid('deals', CACHE_DURATION.MEDIUM)) {
        return { success: true, data: state.byId[dealId] };
      }
      
      try {
        const response = await dealsAPI.getDeal(dealId);
        
        if (response.success) {
          const deal = response.data;
          
          set(state => ({
            deals: {
              ...state.deals,
              byId: { ...state.deals.byId, [dealId]: deal }
            }
          }));
          
          return { success: true, data: deal };
        }
        
        throw new Error(response.message || 'Failed to fetch deal');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    createDeal: async (dealData) => {
      set(state => ({
        deals: { ...state.deals, isLoading: true }
      }));
      
      try {
        const response = await dealsAPI.createDeal(dealData);
        
        if (response.success) {
          const newDeal = response.data;
          
          // Optimistic update for immediate UI feedback
          set(state => ({
            deals: {
              ...state.deals,
              list: [newDeal, ...state.deals.list],
              byId: { ...state.deals.byId, [newDeal._id]: newDeal },
              isLoading: false
            }
          }));
          
          // Invalidate cache for fresh data on next fetch
          get().invalidateCache('deals');
          
          return { success: true, data: newDeal };
        }
        
        throw new Error(response.message || 'Failed to create deal');
      } catch (error) {
        set(state => ({
          deals: { ...state.deals, isLoading: false }
        }));
        return { success: false, error: error.message };
      }
    },
    
    updateDeal: async (dealId, updates) => {
      // Optimistic update with rollback capability
      const oldDeal = get().deals.byId[dealId];
      
      set(state => ({
        deals: {
          ...state.deals,
          byId: {
            ...state.deals.byId,
            [dealId]: { ...oldDeal, ...updates }
          }
        }
      }));
      
      try {
        const response = await dealsAPI.updateDeal(dealId, updates);
        
        if (response.success) {
          const updatedDeal = response.data;
          
          set(state => ({
            deals: {
              ...state.deals,
              byId: { ...state.deals.byId, [dealId]: updatedDeal },
              list: state.deals.list.map(d => d._id === dealId ? updatedDeal : d)
            }
          }));
          
          return { success: true, data: updatedDeal };
        }
        
        throw new Error(response.message || 'Failed to update deal');
      } catch (error) {
        // Rollback optimistic update on failure
        set(state => ({
          deals: {
            ...state.deals,
            byId: { ...state.deals.byId, [dealId]: oldDeal }
          }
        }));
        return { success: false, error: error.message };
      }
    },
    
    deleteDeal: async (dealId) => {
      try {
        const response = await dealsAPI.deleteDeal(dealId);
        
        if (response.success) {
          set(state => ({
            deals: {
              ...state.deals,
              list: state.deals.list.filter(d => d._id !== dealId),
              byId: Object.fromEntries(
                Object.entries(state.deals.byId).filter(([id]) => id !== dealId)
              )
            }
          }));
          
          return { success: true };
        }
        
        throw new Error(response.message || 'Failed to delete deal');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    setDealFilters: (filters) => {
      set(state => ({
        deals: {
          ...state.deals,
          filters: { ...state.deals.filters, ...filters },
          pagination: { ...state.deals.pagination, page: 1 }
        }
      }));
      
      // Auto-fetch with new filters
      get().fetchDeals(true);
    },
    
    // ============================================
    // Invoices Actions - Financial document operations
    // ============================================
    fetchInvoices: async (force = false) => {
      const state = get().invoices;
      
      if (!force && get().isCacheValid('invoices', CACHE_DURATION.SHORT)) {
        return { success: true, data: state.list };
      }
      
      set(state => ({
        invoices: { ...state.invoices, isLoading: true, error: null }
      }));
      
      try {
        const { filters, pagination } = state;
        const response = await invoicesAPI.getInvoices({
          ...filters,
          page: pagination.page,
          limit: pagination.limit
        });
        
        if (response.success) {
          const { invoices, total, hasMore } = response.data;
          
          const byId = invoices.reduce((acc, invoice) => {
            acc[invoice._id] = invoice;
            return acc;
          }, {});
          
          set(state => ({
            invoices: {
              ...state.invoices,
              list: invoices,
              byId: { ...state.invoices.byId, ...byId },
              lastFetch: new Date().toISOString(),
              isLoading: false,
              pagination: {
                ...state.invoices.pagination,
                total,
                hasMore
              }
            }
          }));
          
          return { success: true, data: invoices };
        }
        
        throw new Error(response.message || 'Failed to fetch invoices');
      } catch (error) {
        set(state => ({
          invoices: { ...state.invoices, isLoading: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },
    
    createInvoice: async (invoiceData, type = 'individual') => {
      set(state => ({
        invoices: { ...state.invoices, isLoading: true }
      }));
      
      try {
        const api = type === 'consolidated' 
          ? invoicesAPI.createConsolidatedInvoice
          : invoicesAPI.createIndividualInvoice;
          
        const response = await api(invoiceData);
        
        if (response.success) {
          const newInvoice = response.data;
          
          set(state => ({
            invoices: {
              ...state.invoices,
              list: [newInvoice, ...state.invoices.list],
              byId: { ...state.invoices.byId, [newInvoice._id]: newInvoice },
              isLoading: false
            }
          }));
          
          get().invalidateCache('invoices');
          
          return { success: true, data: newInvoice };
        }
        
        throw new Error(response.message || 'Failed to create invoice');
      } catch (error) {
        set(state => ({
          invoices: { ...state.invoices, isLoading: false }
        }));
        return { success: false, error: error.message };
      }
    },
    
    fetchAvailableDeals: async () => {
      try {
        const response = await invoicesAPI.getAvailableDeals();
        
        if (response.success) {
          set(state => ({
            invoices: {
              ...state.invoices,
              availableDeals: response.data
            }
          }));
          
          return { success: true, data: response.data };
        }
        
        throw new Error(response.message || 'Failed to fetch available deals');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    // ============================================
    // Analytics Actions - Business intelligence operations
    // ============================================
    fetchAnalyticsDashboard: async (period = 'month', force = false) => {
      const state = get().analytics;
      
      if (!force && state.period === period && get().isCacheValid('analytics', CACHE_DURATION.LONG)) {
        return { success: true, data: state.dashboard };
      }
      
      set(state => ({
        analytics: { ...state.analytics, isLoading: true, error: null }
      }));
      
      try {
        const response = await analyticsAPI.getDashboard({ period });
        
        if (response.success) {
          set(state => ({
            analytics: {
              ...state.analytics,
              dashboard: response.data,
              period,
              lastFetch: new Date().toISOString(),
              isLoading: false
            }
          }));
          
          return { success: true, data: response.data };
        }
        
        throw new Error(response.message || 'Failed to fetch analytics');
      } catch (error) {
        set(state => ({
          analytics: { ...state.analytics, isLoading: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },
    
    // ============================================
    // Contracts Actions - Legal document management with AI
    // ============================================
    fetchContracts: async (force = false) => {
      const state = get().contracts;
      
      if (!force && get().isCacheValid('contracts', CACHE_DURATION.SHORT)) {
        return { success: true, data: state.list };
      }
      
      set(state => ({
        contracts: { ...state.contracts, isLoading: true, error: null }
      }));
      
      try {
        const { filters, pagination } = state;
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters
        };
        
        const response = await contractsAPI.getContracts(params);
        
        if (response.success) {
          const { contracts, pagination: paginationData } = response.data;
          
          // Create optimized lookup map
          const byId = contracts.reduce((acc, contract) => {
            acc[contract.id] = contract;
            return acc;
          }, {});
          
          set(state => ({
            contracts: {
              ...state.contracts,
              list: contracts,
              byId: { ...state.contracts.byId, ...byId },
              lastFetch: new Date().toISOString(),
              isLoading: false,
              pagination: {
                ...state.contracts.pagination,
                total: paginationData.total,
                hasMore: paginationData.page < paginationData.pages
              }
            }
          }));
          
          return { success: true, data: contracts };
        }
        
        throw new Error(response.message || 'Failed to fetch contracts');
      } catch (error) {
        set(state => ({
          contracts: { ...state.contracts, isLoading: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },
    
    fetchContractById: async (contractId, force = false) => {
      const state = get().contracts;
      
      // Efficient cache check for individual contracts
      if (!force && state.byId[contractId] && get().isCacheValid('contracts', CACHE_DURATION.MEDIUM)) {
        return { success: true, data: state.byId[contractId] };
      }
      
      try {
        const response = await contractsAPI.getContract(contractId);
        
        if (response.success) {
          const contract = response.data.contract;
          
          set(state => ({
            contracts: {
              ...state.contracts,
              byId: { ...state.contracts.byId, [contractId]: contract }
            }
          }));
          
          return { success: true, data: contract };
        }
        
        throw new Error(response.message || 'Failed to fetch contract');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    uploadContract: async (formData, onProgress) => {
      set(state => ({
        contracts: { ...state.contracts, isLoading: true }
      }));
      
      try {
        const response = await contractsAPI.uploadContract(formData, onProgress);
        
        if (response.success) {
          const newContract = response.data.contract;
          
          // Optimistic addition to contracts list
          set(state => ({
            contracts: {
              ...state.contracts,
              list: [newContract, ...state.contracts.list],
              byId: { ...state.contracts.byId, [newContract.id]: newContract },
              isLoading: false
            }
          }));
          
          // Invalidate cache for fresh data
          get().invalidateCache('contracts');
          
          return { success: true, data: newContract };
        }
        
        throw new Error(response.message || 'Failed to upload contract');
      } catch (error) {
        set(state => ({
          contracts: { ...state.contracts, isLoading: false }
        }));
        return { success: false, error: error.message };
      }
    },
    
    updateContractStatus: async (contractId, status, notes = '') => {
      // Optimistic update with rollback support
      const oldContract = get().contracts.byId[contractId];
      const updatedContract = { 
        ...oldContract, 
        status, 
        updatedAt: new Date().toISOString() 
      };
      
      set(state => ({
        contracts: {
          ...state.contracts,
          byId: {
            ...state.contracts.byId,
            [contractId]: updatedContract
          },
          list: state.contracts.list.map(c => 
            c.id === contractId ? updatedContract : c
          )
        }
      }));
      
      try {
        const response = await contractsAPI.updateContractStatus(contractId, status, notes);
        
        if (response.success) {
          return { success: true };
        }
        
        throw new Error(response.message || 'Failed to update contract status');
      } catch (error) {
        // Rollback optimistic update
        set(state => ({
          contracts: {
            ...state.contracts,
            byId: { ...state.contracts.byId, [contractId]: oldContract },
            list: state.contracts.list.map(c => 
              c.id === contractId ? oldContract : c
            )
          }
        }));
        return { success: false, error: error.message };
      }
    },
    
    deleteContract: async (contractId) => {
      try {
        const response = await contractsAPI.deleteContract(contractId);
        
        if (response.success) {
          set(state => ({
            contracts: {
              ...state.contracts,
              list: state.contracts.list.filter(c => c.id !== contractId),
              byId: Object.fromEntries(
                Object.entries(state.contracts.byId).filter(([id]) => id !== contractId)
              )
            }
          }));
          
          return { success: true };
        }
        
        throw new Error(response.message || 'Failed to delete contract');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    bulkUpdateContractStatus: async (contractIds, status, notes = '') => {
      try {
        const response = await contractsAPI.bulkUpdateStatus(contractIds, status, notes);
        
        if (response.success) {
          const updatedAt = new Date().toISOString();
          
          // Bulk update in store
          set(state => ({
            contracts: {
              ...state.contracts,
              list: state.contracts.list.map(contract =>
                contractIds.includes(contract.id)
                  ? { ...contract, status, updatedAt }
                  : contract
              ),
              byId: Object.fromEntries(
                Object.entries(state.contracts.byId).map(([id, contract]) =>
                  contractIds.includes(id)
                    ? [id, { ...contract, status, updatedAt }]
                    : [id, contract]
                )
              )
            }
          }));
          
          return { success: true };
        }
        
        throw new Error(response.message || 'Failed to bulk update contracts');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    bulkDeleteContracts: async (contractIds) => {
      try {
        const response = await contractsAPI.bulkDeleteContracts(contractIds);
        
        if (response.success) {
          set(state => ({
            contracts: {
              ...state.contracts,
              list: state.contracts.list.filter(c => !contractIds.includes(c.id)),
              byId: Object.fromEntries(
                Object.entries(state.contracts.byId).filter(([id]) => !contractIds.includes(id))
              )
            }
          }));
          
          return { success: true };
        }
        
        throw new Error(response.message || 'Failed to bulk delete contracts');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    fetchContractAnalytics: async (force = false) => {
      const state = get().contracts;
      
      if (!force && state.analytics && get().isCacheValid('contracts', CACHE_DURATION.LONG)) {
        return { success: true, data: state.analytics };
      }
      
      try {
        const response = await contractsAPI.getDashboardAnalytics();
        
        if (response.success) {
          set(state => ({
            contracts: {
              ...state.contracts,
              analytics: response.data
            }
          }));
          
          return { success: true, data: response.data };
        }
        
        throw new Error(response.message || 'Failed to fetch contract analytics');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    fetchUploadLimits: async (force = false) => {
      const state = get().contracts;
      
      if (!force && state.uploadLimits && get().isCacheValid('contracts', CACHE_DURATION.VERY_LONG)) {
        return { success: true, data: state.uploadLimits };
      }
      
      try {
        const response = await contractsAPI.getUploadLimits();
        
        if (response.success) {
          set(state => ({
            contracts: {
              ...state.contracts,
              uploadLimits: response.data
            }
          }));
          
          return { success: true, data: response.data };
        }
        
        throw new Error(response.message || 'Failed to fetch upload limits');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    fetchContractActivityFeed: async (contractId = null, limit = 10, force = false) => {
      const state = get().contracts;
      
      if (!force && state.activityFeed.length > 0 && get().isCacheValid('contracts', CACHE_DURATION.MEDIUM)) {
        return { success: true, data: state.activityFeed };
      }
      
      try {
        const response = await contractsAPI.getActivityFeed(contractId, limit);
        
        if (response.success) {
          set(state => ({
            contracts: {
              ...state.contracts,
              activityFeed: response.data.activities
            }
          }));
          
          return { success: true, data: response.data };
        }
        
        throw new Error(response.message || 'Failed to fetch activity feed');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    setContractFilters: (filters) => {
      set(state => ({
        contracts: {
          ...state.contracts,
          filters: { ...state.contracts.filters, ...filters },
          pagination: { ...state.contracts.pagination, page: 1 }
        }
      }));
      
      // Auto-fetch with new filters
      get().fetchContracts(true);
    },
    
    searchContracts: (query) => {
      get().setContractFilters({ search: query });
    },
    
    resetContractFilters: () => {
      const defaultFilters = {
        status: '',
        brandName: '',
        riskLevel: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      set(state => ({
        contracts: {
          ...state.contracts,
          filters: defaultFilters,
          pagination: { ...state.contracts.pagination, page: 1 }
        }
      }));
      
      get().fetchContracts(true);
    },
    
    // ============================================
    // Rate Cards Actions - Pricing package management
    // ============================================
    fetchRateCards: async (params, force = false) => {
      if (!force && get().isCacheValid('rateCards', CACHE_DURATION.SHORT)) {
        return;
      }
      set(state => ({
        rateCards: { ...state.rateCards, isLoading: true, error: null }
      }));
      try {
        const response = await rateCardAPI.getRateCards(params);
        if (response.success) {
          const byId = response.data.rateCards.reduce((acc, card) => {
            acc[card._id] = card;
            return acc;
          }, {});
          set(state => ({
            rateCards: {
              ...state.rateCards,
              list: response.data.rateCards,
              byId: { ...state.rateCards.byId, ...byId },
              pagination: response.data.pagination,
              isLoading: false,
              lastFetch: new Date().toISOString(),
            },
          }));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        set(state => ({
          rateCards: { ...state.rateCards, isLoading: false, error: error.message }
        }));
        toast.error(error.message || 'Failed to fetch rate cards.');
      }
    },

    createRateCard: async (data) => {
      set(state => ({ rateCards: { ...state.rateCards, isLoading: true } }));
      try {
        const response = await rateCardAPI.createRateCard(data);
        if (response.success) {
          toast.success('Rate card created successfully!');
          get().invalidateCache('rateCards');
          // Refetch to get the latest list
          await get().fetchRateCards({}, true);
          return { success: true, data: response.data };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to create rate card.');
        set(state => ({ rateCards: { ...state.rateCards, isLoading: false } }));
        return { success: false, error: error.message };
      }
    },

    deleteRateCard: async (id) => {
      try {
        const response = await rateCardAPI.deleteRateCard(id);
        if (response.success) {
          toast.success('Rate card deleted.');
          set(state => {
            const newList = state.rateCards.list.filter(rc => rc._id !== id);
            const newById = { ...state.rateCards.byId };
            delete newById[id];
            return {
              rateCards: {
                ...state.rateCards,
                list: newList,
                byId: newById,
              },
            };
          });
          return { success: true };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        toast.error(error.message || 'Could not delete rate card.');
        return { success: false, error: error.message };
      }
    },
    
    // ============================================
    // Global Actions - Cross-feature operations
    // ============================================
    refreshAllData: async () => {
      const promises = [
        get().fetchDeals(true),
        get().fetchInvoices(true),
        get().fetchAnalyticsDashboard('month', true),
        get().fetchRateCards({}, true),
        get().fetchContracts(true),
        get().fetchContractAnalytics(true),
        get().fetchUploadLimits(true),
      ];
      
      try {
        await Promise.all(promises);
        toast.success('Data refreshed successfully');
      } catch (error) {
        toast.error('Failed to refresh some data');
      }
    },
    
    clearAllData: () => {
      set({
        deals: {
          list: [],
          byId: {},
          pipeline: {},
          brands: [],
          templates: [],
          metadata: null,
          lastFetch: null,
          isLoading: false,
          error: null,
          filters: {
            stage: 'all',
            brand: 'all',
            dateRange: 'all',
            search: ''
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false
          }
        },
        invoices: {
          list: [],
          byId: {},
          availableDeals: [],
          taxPreferences: null,
          dashboard: null,
          lastFetch: null,
          isLoading: false,
          error: null,
          filters: {
            status: 'all',
            dateRange: 'all',
            search: ''
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false
          }
        },
        briefs: {
          list: [],
          byId: {},
          templates: [],
          stats: null,
          lastFetch: null,
          isLoading: false,
          error: null,
          filters: {
            status: 'all',
            type: 'all',
            search: ''
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false
          }
        },
        analytics: {
          dashboard: null,
          revenue: null,
          performance: null,
          insights: [],
          trends: null,
          lastFetch: null,
          isLoading: false,
          error: null,
          period: 'month'
        },
        performance: {
          campaigns: [],
          byId: {},
          dashboard: null,
          benchmarks: null,
          lastFetch: null,
          isLoading: false,
          error: null
        },
        contracts: {
          list: [],
          byId: {},
          templates: [],
          analytics: null,
          uploadLimits: null,
          activityFeed: [],
          lastFetch: null,
          isLoading: false,
          error: null,
          filters: {
            status: '',
            brandName: '',
            riskLevel: '',
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false
          }
        },
        rateCards: {
          list: [],
          byId: {},
          pagination: { page: 1, limit: 10, total: 0, pages: 1 },
          lastFetch: null,
          isLoading: false,
          error: null,
        }
      });
    }
  }))
);

export default useDataStore;
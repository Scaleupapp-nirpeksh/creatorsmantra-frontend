/**
 * Data Store - Global state management for business data
 * * This store manages:
 * - Deals data with caching
 * - Invoices data with caching
 * - Briefs data with caching
 * - Analytics data with caching
 * - Rate Cards data with caching // New addition
 * - Cache invalidation
 * - Optimistic updates
 * * File: src/store/dataStore.js
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

// Cache duration in milliseconds
const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 15 * 60 * 1000,   // 15 minutes
  LONG: 30 * 60 * 1000,     // 30 minutes
  VERY_LONG: 60 * 60 * 1000 // 1 hour
};

const useDataStore = create(
  subscribeWithSelector((set, get) => ({
    // ============================================
    // Deals State
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
    // Invoices State
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
    // Briefs State
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
    // Analytics State
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
    // Performance State
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
    // Contracts State
    // ============================================
    contracts: {
      list: [],
      byId: {},
      templates: [],
      lastFetch: null,
      isLoading: false,
      error: null
    },
    
    // ============================================
    // Rate Cards State (New Addition)
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
    // Cache Management
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
        // Invalidate all caches
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
    // Deals Actions
    // ============================================
    fetchDeals: async (force = false) => {
      const state = get().deals;
      
      // Check cache
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
          
          // Create byId map for quick access
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
      
      // Check if we have it in cache
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
          
          // Optimistically add to store
          set(state => ({
            deals: {
              ...state.deals,
              list: [newDeal, ...state.deals.list],
              byId: { ...state.deals.byId, [newDeal._id]: newDeal },
              isLoading: false
            }
          }));
          
          // Invalidate cache to fetch fresh data next time
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
      // Optimistic update
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
        // Revert optimistic update
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
      
      // Fetch with new filters
      get().fetchDeals(true);
    },
    
    // ============================================
    // Invoices Actions
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
    // Analytics Actions
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
    // Rate Cards Actions (New Addition)
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
    // Global Actions
    // ============================================
    refreshAllData: async () => {
      const promises = [
        get().fetchDeals(true),
        get().fetchInvoices(true),
        get().fetchAnalyticsDashboard('month', true),
        get().fetchRateCards({}, true), // New
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
        deals: get().deals,
        invoices: get().invoices,
        briefs: get().briefs,
        analytics: get().analytics,
        performance: get().performance,
        contracts: get().contracts,
        rateCards: get().rateCards // New
      });
    }
  }))
);

export default useDataStore;
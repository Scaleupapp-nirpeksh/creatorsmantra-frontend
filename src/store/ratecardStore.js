/**
 * Rate Card Store - Complete Global State Management
 * This store manages all rate card operations and state
 * 
 * @filepath src/store/ratecardStore.js
 * @author CreatorsMantra Frontend Team
 * @version 2.0.0
 */

import { create } from 'zustand';
import { rateCardAPI } from '@/api/endpoints';
import toast from 'react-hot-toast';

const useRateCardStore = create((set, get) => ({
  // ============================================
  // State
  // ============================================
  rateCards: [],
  currentRateCard: null,
  pagination: { total: 0, page: 1, pages: 1, limit: 10 },
  aiSuggestions: null,
  history: [],
  analytics: null,
  isLoading: false,
  error: null,

  // ============================================
  // Actions - CRUD & Fetching
  // ============================================

  /**
   * Fetches a paginated list of rate cards for the user.
   * @param {object} params - Query parameters for filtering and pagination.
   */
  fetchRateCards: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await rateCardAPI.getRateCards(params);
      if (response.success) {
        set({
          rateCards: response.data.rateCards,
          pagination: response.data.pagination,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch rate cards');
      }
    } catch (error) {
      const message = error.message || 'An error occurred while fetching rate cards.';
      toast.error(message);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches the details of a single rate card and sets it as the current one.
   * @param {string} id - The ID of the rate card to fetch.
   */
  fetchRateCard: async (id) => {
    try {
      set({ isLoading: true, currentRateCard: null, error: null });
      const response = await rateCardAPI.getRateCard(id);
      if (response.success) {
        set({ currentRateCard: response.data.rateCard });
        return response.data.rateCard;
      } else {
        throw new Error(response.message || 'Failed to fetch rate card');
      }
    } catch (error) {
      const message = error.message || 'An error occurred while fetching the rate card.';
      toast.error(message);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Creates a new rate card.
   * @param {object} data - The initial data for the rate card.
   */
  createRateCard: async (data) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.createRateCard(data);
      if (response.success) {
        toast.success('Rate card created successfully!');
        set({ 
          currentRateCard: response.data.rateCard,
          aiSuggestions: response.data.aiSuggestions 
        });
        get().fetchRateCards(); // Refresh the list
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create rate card');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during creation.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Deletes a rate card.
   * @param {string} id - The ID of the rate card to delete.
   */
  deleteRateCard: async (id) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.deleteRateCard(id);
      if (response.success) {
        toast.success('Rate card deleted.');
        set((state) => ({
          rateCards: state.rateCards.filter((rc) => rc._id !== id),
        }));
      } else {
        throw new Error(response.message || 'Failed to delete rate card');
      }
    } catch (error) {
      toast.error(error.message || 'Could not delete rate card.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // ============================================
  // Actions - Updates
  // ============================================
  
  /**
   * Updates the metrics of the current rate card.
   * @param {string} id - The rate card ID.
   * @param {object} data - The new metrics data.
   */
  updateMetrics: async (id, data) => {
    try {
        set({ isLoading: true });
        const response = await rateCardAPI.updateMetrics(id, data);
        if (response.success) {
            toast.success('Metrics updated and new prices suggested!');
            set({
                currentRateCard: response.data.rateCard,
                aiSuggestions: response.data.newSuggestions,
            });
        } else {
            throw new Error(response.message || 'Failed to update metrics');
        }
    } catch (error) {
        toast.error(error.message || 'Could not update metrics.');
    } finally {
        set({ isLoading: false });
    }
  },

  /**
   * Updates the pricing of the current rate card.
   * @param {string} id - The rate card ID.
   * @param {object} data - The new pricing data.
   */
  updatePricing: async (id, data) => {
     try {
        set({ isLoading: true });
        const response = await rateCardAPI.updatePricing(id, data);
        if (response.success) {
            toast.success('Pricing updated!');
            set({ currentRateCard: response.data.rateCard });
        } else {
            throw new Error(response.message || 'Failed to update pricing');
        }
    } catch (error) {
        toast.error(error.message || 'Could not update pricing.');
    } finally {
        set({ isLoading: false });
    }
  },

  /**
   * Updates the professional details of the current rate card.
   * @param {string} id - The rate card ID.
   * @param {object} data - The new professional details data.
   */
  updateProfessionalDetails: async (id, data) => {
    try {
      console.log('=== UPDATE PROFESSIONAL DETAILS DEBUG ===');
      console.log('Rate Card ID:', id);
      console.log('Data being sent:', JSON.stringify(data, null, 2));
      
      set({ isLoading: true });
      
      // Validate and structure the data
      const validatedData = {
        paymentTerms: {
          type: data.paymentTerms?.type || '50_50',
          customTerms: data.paymentTerms?.customTerms || ''
        },
        usageRights: {
          duration: data.usageRights?.duration || '3_months',
          platforms: data.usageRights?.platforms || [],
          geography: data.usageRights?.geography || 'india',
          exclusivity: {
            required: data.usageRights?.exclusivity?.required || false,
            duration: {
              value: data.usageRights?.exclusivity?.duration?.value || 30,
              unit: data.usageRights?.exclusivity?.duration?.unit || 'days'
            }
          }
        },
        revisionPolicy: data.revisionPolicy || '',
        cancellationTerms: data.cancellationTerms || '',
        additionalNotes: data.additionalNotes || ''
      };

      console.log('Validated data:', JSON.stringify(validatedData, null, 2));

      const response = await rateCardAPI.updateProfessionalDetails(id, validatedData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        toast.success('Professional details updated successfully!');
        set({ currentRateCard: response.data.rateCard });
      } else {
        throw new Error(response.message || 'Failed to update professional details');
      }
    } catch (error) {
      console.error('=== UPDATE PROFESSIONAL DETAILS ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Could not update professional details.';
      toast.error(`Update failed: ${errorMessage}`);
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // Actions - Packages
  // ============================================

  /**
   * Creates a package for the current rate card.
   * @param {string} id - The rate card ID.
   * @param {object} data - The new package data.
   */
  createPackage: async (id, data) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.createPackage(id, data);
      if (response.success) {
        toast.success('Package added successfully!');
        set({ currentRateCard: response.data.rateCard });
      } else {
        throw new Error(response.message || 'Failed to add package');
      }
    } catch (error) {
      toast.error(error.message || 'Could not add package.');
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates a package in the current rate card.
   * @param {string} id - The rate card ID.
   * @param {string} packageId - The package ID to update.
   * @param {object} data - The updated package data.
   */
  updatePackage: async (id, packageId, data) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.updatePackage(id, packageId, data);
      if (response.success) {
        toast.success('Package updated successfully!');
        set({ currentRateCard: response.data.rateCard });
      } else {
        throw new Error(response.message || 'Failed to update package');
      }
    } catch (error) {
      toast.error(error.message || 'Could not update package.');
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Deletes a package from the current rate card.
   * @param {string} id - The rate card ID.
   * @param {string} packageId - The package ID to delete.
   */
  deletePackage: async (id, packageId) => {
    try {
        set({ isLoading: true });
        const response = await rateCardAPI.deletePackage(id, packageId);
        if (response.success) {
            toast.success('Package deleted.');
            set(state => ({
                currentRateCard: {
                    ...state.currentRateCard,
                    packages: state.currentRateCard.packages.filter(p => p._id !== packageId)
                }
            }));
        } else {
            throw new Error(response.message || 'Failed to delete package');
        }
    } catch (error) {
        toast.error(error.message || 'Could not delete package.');
    } finally {
        set({ isLoading: false });
    }
  },

  // ============================================
  // Actions - Publishing & Sharing
  // ============================================

  /**
   * Publishes the current rate card.
   * @param {string} id - The rate card ID.
   */
  publishRateCard: async (id) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.publishRateCard(id);
      if (response.success) {
        toast.success('Rate card published!');
        set({ currentRateCard: response.data.rateCard });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to publish');
      }
    } catch (error) {
      toast.error(error.message || 'Could not publish rate card.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Updates the sharing settings for the current rate card.
   * @param {string} id - The rate card ID.
   * @param {object} data - The new sharing settings.
   */
  updateShareSettings: async (id, data) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.updateShareSettings(id, data);
      if (response.success) {
        toast.success('Sharing settings updated!');
        // Update just the sharing settings in current rate card
        set(state => ({
          currentRateCard: {
            ...state.currentRateCard,
            sharing: {
              ...state.currentRateCard.sharing,
              settings: response.data.shareSettings,
              expiresAt: response.data.expiresAt
            }
          }
        }));
      } else {
        throw new Error(response.message || 'Failed to update sharing settings');
      }
    } catch (error) {
      toast.error(error.message || 'Could not update sharing settings.');
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // Actions - History & Analytics
  // ============================================
  
  /**
   * Fetches the version history for a rate card.
   * @param {string} id - The rate card ID.
   */
  fetchHistory: async (id) => {
    try {
        set({ isLoading: true, history: [] });
        const response = await rateCardAPI.getRateCardHistory(id);
        if (response.success) {
            set({ history: response.data.history });
        } else {
            throw new Error(response.message || 'Failed to fetch history');
        }
    } catch (error) {
        toast.error(error.message || 'Could not get version history.');
    } finally {
        set({ isLoading: false });
    }
  },

  /**
   * Restores a rate card from a previous version.
   * @param {string} id - The rate card ID.
   * @param {string} historyId - The history record ID to restore from.
   */
  restoreFromHistory: async (id, historyId) => {
    try {
      set({ isLoading: true });
      const response = await rateCardAPI.restoreFromHistory(id, historyId);
      if (response.success) {
        toast.success('Successfully restored from history!');
        set({ currentRateCard: response.data.rateCard });
        // Also refresh history to show the new version
        get().fetchHistory(id);
      } else {
        throw new Error(response.message || 'Failed to restore from history');
      }
    } catch (error) {
      toast.error(error.message || 'Could not restore from history.');
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches analytics data for a rate card.
   * @param {string} id - The rate card ID.
   */
  fetchAnalytics: async (id) => {
    try {
      set({ isLoading: true, analytics: null });
      const response = await rateCardAPI.getAnalytics(id);
      if (response.success) {
        set({ analytics: response.data.analytics });
      } else {
        throw new Error(response.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      toast.error(error.message || 'Could not get analytics.');
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Clears the current rate card from the state.
   */
  clearCurrentRateCard: () => {
    set({
      currentRateCard: null,
      aiSuggestions: null,
      history: [],
      analytics: null,
      error: null,
    });
  },

  /**
   * Sets AI suggestions (useful for manual updates)
   */
  setAISuggestions: (suggestions) => {
    set({ aiSuggestions: suggestions });
  },

  /**
   * Clears AI suggestions
   */
  clearAISuggestions: () => {
    set({ aiSuggestions: null });
  },

  /**
   * Updates a specific field in the current rate card (for optimistic updates)
   */
  updateCurrentRateCardField: (field, value) => {
    set(state => ({
      currentRateCard: {
        ...state.currentRateCard,
        [field]: value
      }
    }));
  },

  /**
   * Sets loading state manually
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  /**
   * Sets error state manually
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * Clears error state
   */
  clearError: () => {
    set({ error: null });
  }
}));

export default useRateCardStore;
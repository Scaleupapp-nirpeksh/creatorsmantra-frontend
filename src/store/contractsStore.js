/**
 * Contracts Store - Global state management for contract operations
* 
* This store manages:
* - Contracts list with filtering and pagination
* - Current contract details and AI analysis
* - File upload with progress tracking
* - Dashboard analytics
* - Contract status management
* 
* File: src/store/contractsStore.js
*/

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { contractsAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

// Storage key prefix from environment
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_';

const useContractsStore = create(
 persist(
   (set, get) => ({
     // ============================================
     // State
     // ============================================
     
     // Contracts List
     contracts: [],
     totalContracts: 0,
     currentPage: 1,
     totalPages: 1,
     isLoading: false,
     
     // Current Contract Details
     currentContract: null,
     isLoadingContract: false,
     
     // Filters & Search
     filters: {
       status: '',
       brandName: '',
       riskLevel: '',
       search: '',
       sortBy: 'createdAt',
       sortOrder: 'desc'
     },
     
     // Upload State
     uploadProgress: 0,
     isUploading: false,
     
     // Analytics
     analytics: null,
     isLoadingAnalytics: false,
     
     // AI Analysis
     analysisStatus: null,
     isAnalyzing: false,
     
     // Upload Limits
     uploadLimits: null,
     
     // Activity Feed
     activityFeed: [],
     
     // ============================================
     // Contracts List Management
     // ============================================
     
     fetchContracts: async (page = 1, limit = 20, resetList = false) => {
       try {
         set({ isLoading: true });
         
         const { filters } = get();
         const params = {
           page,
           limit,
           ...filters
         };
         
         const response = await contractsAPI.getContracts(params);
         
         if (response.success) {
           const { contracts, pagination } = response.data;
           
           set({
             contracts: resetList ? contracts : [...get().contracts, ...contracts],
             totalContracts: pagination.total,
             currentPage: pagination.page,
             totalPages: pagination.pages,
             isLoading: false
           });
           
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to fetch contracts';
         toast.error(message);
         set({ isLoading: false });
         return { success: false, message };
       }
     },
     
     // Update filters and refetch
     updateFilters: async (newFilters) => {
       set({
         filters: { ...get().filters, ...newFilters },
         currentPage: 1
       });
       
       // Refetch with new filters
       await get().fetchContracts(1, 20, true);
     },
     
     // Search contracts
     searchContracts: async (query) => {
       await get().updateFilters({ search: query });
     },
     
     // ============================================
     // Contract Upload
     // ============================================
     
     uploadContract: async (formData) => {
       try {
         set({ 
           isUploading: true, 
           uploadProgress: 0 
         });
         
         const response = await contractsAPI.uploadContract(
           formData,
           (progress) => {
             set({ uploadProgress: progress });
           }
         );
         
         if (response.success) {
           const newContract = response.data.contract;
           
           // Add to contracts list
           set({
             contracts: [newContract, ...get().contracts],
             totalContracts: get().totalContracts + 1,
             isUploading: false,
             uploadProgress: 100
           });
           
           toast.success('Contract uploaded successfully!');
           
           // Reset progress after success
           setTimeout(() => {
             set({ uploadProgress: 0 });
           }, 1000);
           
           return { success: true, contract: newContract };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Upload failed';
         toast.error(message);
         set({ 
           isUploading: false, 
           uploadProgress: 0 
         });
         return { success: false, message };
       }
     },
     
     // Check upload limits
     fetchUploadLimits: async () => {
       try {
         const response = await contractsAPI.getUploadLimits();
         
         if (response.success) {
           set({ uploadLimits: response.data });
           return { success: true, data: response.data };
         }
         
         return { success: false };
       } catch (error) {
         console.error('Failed to fetch upload limits:', error);
         return { success: false };
       }
     },
     
     // ============================================
     // Contract Details Management
     // ============================================
     
     fetchContract: async (contractId) => {
       try {
         set({ isLoadingContract: true });
         
         const response = await contractsAPI.getContract(contractId);
         
         if (response.success) {
           set({
             currentContract: response.data.contract,
             isLoadingContract: false
           });
           
           return { success: true, contract: response.data.contract };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to fetch contract';
         toast.error(message);
         set({ isLoadingContract: false });
         return { success: false, message };
       }
     },
     
     // Update contract status
     updateContractStatus: async (contractId, status, notes = '') => {
       try {
         const response = await contractsAPI.updateContractStatus(contractId, status, notes);
         
         if (response.success) {
           // Update in contracts list
           const updatedContracts = get().contracts.map(contract =>
             contract.id === contractId
               ? { ...contract, status, updatedAt: new Date().toISOString() }
               : contract
           );
           
           // Update current contract if it's the same
           const currentContract = get().currentContract;
           const updatedCurrentContract = currentContract?.id === contractId
             ? { ...currentContract, status, updatedAt: new Date().toISOString() }
             : currentContract;
           
           set({
             contracts: updatedContracts,
             currentContract: updatedCurrentContract
           });
           
           toast.success('Status updated successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to update status';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // Delete contract
     deleteContract: async (contractId) => {
       try {
         const response = await contractsAPI.deleteContract(contractId);
         
         if (response.success) {
           // Remove from contracts list
           const updatedContracts = get().contracts.filter(
             contract => contract.id !== contractId
           );
           
           // Clear current contract if it's the deleted one
           const currentContract = get().currentContract?.id === contractId
             ? null
             : get().currentContract;
           
           set({
             contracts: updatedContracts,
             totalContracts: get().totalContracts - 1,
             currentContract
           });
           
           toast.success('Contract deleted successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to delete contract';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // Bulk operations
     bulkUpdateStatus: async (contractIds, status, notes = '') => {
       try {
         const response = await contractsAPI.bulkUpdateStatus(contractIds, status, notes);
         
         if (response.success) {
           // Update contracts in list
           const updatedContracts = get().contracts.map(contract =>
             contractIds.includes(contract.id)
               ? { ...contract, status, updatedAt: new Date().toISOString() }
               : contract
           );
           
           set({ contracts: updatedContracts });
           
           toast.success(`${contractIds.length} contracts updated successfully!`);
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Bulk update failed';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     bulkDeleteContracts: async (contractIds) => {
       try {
         const response = await contractsAPI.bulkDeleteContracts(contractIds);
         
         if (response.success) {
           // Remove contracts from list
           const updatedContracts = get().contracts.filter(
             contract => !contractIds.includes(contract.id)
           );
           
           set({
             contracts: updatedContracts,
             totalContracts: get().totalContracts - contractIds.length
           });
           
           toast.success(`${contractIds.length} contracts deleted successfully!`);
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Bulk delete failed';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // ============================================
     // AI Analysis
     // ============================================
     
     analyzeContract: async (contractId, forceReanalysis = false) => {
       try {
         set({ isAnalyzing: true });
         
         const response = await contractsAPI.analyzeContract(contractId, forceReanalysis);
         
         if (response.success) {
           // Update current contract with analysis
           const currentContract = get().currentContract;
           if (currentContract?.id === contractId) {
             set({
               currentContract: {
                 ...currentContract,
                 analysisStatus: 'completed',
                 aiAnalysis: response.data.analysis
               }
             });
           }
           
           toast.success('Analysis completed successfully!');
           return { success: true, analysis: response.data.analysis };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Analysis failed';
         toast.error(message);
         return { success: false, message };
       } finally {
         set({ isAnalyzing: false });
       }
     },
     
     // Get negotiation points
     fetchNegotiationPoints: async (contractId) => {
       try {
         const response = await contractsAPI.getNegotiationPoints(contractId);
         
         if (response.success) {
           return { success: true, data: response.data };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to fetch negotiation points';
         console.error('Negotiation points error:', error);
         return { success: false, message };
       }
     },
     
     // ============================================
     // Analytics
     // ============================================
     
     fetchDashboardAnalytics: async () => {
       try {
         set({ isLoadingAnalytics: true });
         
         const response = await contractsAPI.getDashboardAnalytics();
         
         if (response.success) {
           set({
             analytics: response.data,
             isLoadingAnalytics: false
           });
           
           return { success: true, data: response.data };
         }
         
         return { success: false };
       } catch (error) {
         console.error('Failed to fetch analytics:', error);
         set({ isLoadingAnalytics: false });
         return { success: false };
       }
     },
     
     // ============================================
     // Activity Feed
     // ============================================
     
     fetchActivityFeed: async (contractId = null, limit = 10) => {
       try {
         const response = await contractsAPI.getActivityFeed(contractId, limit);
         
         if (response.success) {
           set({ activityFeed: response.data.activities });
           return { success: true, data: response.data };
         }
         
         return { success: false };
       } catch (error) {
         console.error('Failed to fetch activity feed:', error);
         return { success: false };
       }
     },
     
     // ============================================
     // Utility Methods
     // ============================================
     
     // Clear current contract
     clearCurrentContract: () => {
       set({ currentContract: null });
     },
     
     // Reset filters
     resetFilters: async () => {
       const defaultFilters = {
         status: '',
         brandName: '',
         riskLevel: '',
         search: '',
         sortBy: 'createdAt',
         sortOrder: 'desc'
       };
       
       set({ filters: defaultFilters, currentPage: 1 });
       await get().fetchContracts(1, 20, true);
     },
     
     // Initialize store - called when user authenticates
     init: async () => {
       try {
         // Initialize upload limits and analytics in parallel
         await Promise.allSettled([
           get().fetchUploadLimits(),
           get().fetchDashboardAnalytics()
         ]);
         
         // Fetch initial contracts list
         await get().fetchContracts(1, 20, true);
         
         return { success: true };
       } catch (error) {
         console.error('Failed to initialize contracts store:', error);
         return { success: false, error };
       }
     },
     
     // Reset store
     reset: () => {
       set({
         contracts: [],
         totalContracts: 0,
         currentPage: 1,
         totalPages: 1,
         currentContract: null,
         analytics: null,
         activityFeed: [],
         uploadProgress: 0,
         isUploading: false,
         isLoading: false,
         isLoadingContract: false,
         isLoadingAnalytics: false,
         isAnalyzing: false
       });
     }
   }),
   {
     name: `${STORAGE_PREFIX}contracts-storage`,
     storage: createJSONStorage(() => localStorage),
     partialize: (state) => ({
       filters: state.filters,
       currentPage: state.currentPage
     })
   }
 )
);

export default useContractsStore;
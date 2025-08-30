//src/store/scriptsStore.js/**
// * Scripts Store - Global state management for script generation and management
//* 
// This store manages:
//- Scripts list and pagination
//- Current script details
// - AI generation status and polling
// - File uploads for script creation
// - Search and filtering
// - Script variations and A/B testing
// - Dashboard statistics
// 
// File: src/store/scriptsStore.js


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { scriptsAPI } from '@/api/endpoints';
import toast from 'react-hot-toast';

// Storage key prefix from environment
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_';

const useScriptsStore = create(
 persist(
   (set, get) => ({
     // ============================================
     // State
     // ============================================
     scripts: [],
     currentScript: null,
     dashboardStats: null,
     scriptMetadata: null,
     availableDeals: [],
     
     // Pagination
     pagination: {
       page: 1,
       limit: 20,
       total: 0,
       totalPages: 0,
       hasNext: false,
       hasPrev: false
     },
     
     // Filters
     filters: {
       status: 'all',
       platform: 'all',
       inputType: 'all',
       search: '',
       sortBy: 'createdAt',
       sortOrder: 'desc',
       dateFrom: null,
       dateTo: null
     },
     
     // Loading states
     isLoading: false,
     isCreating: false,
     isGenerating: false,
     isPolling: false,
     
     // Upload states
     uploadProgress: 0,
     isUploading: false,
     
     // UI state
     selectedScripts: [],
     bulkActionMode: false,
     
     // ============================================
     // Initialization
     // ============================================
     initialize: async () => {
       try {
         await Promise.all([
           get().fetchDashboardStats(),
           get().fetchScriptMetadata(),
           get().fetchAvailableDeals()
         ]);
       } catch (error) {
         console.error('Scripts store initialization failed:', error);
       }
     },
     
     // ============================================
     // Dashboard & Metadata
     // ============================================
     fetchDashboardStats: async () => {
       try {
         const response = await scriptsAPI.getDashboardStats();
         
         if (response.success) {
           set({ dashboardStats: response.data.stats });
         }
       } catch (error) {
         console.error('Failed to fetch dashboard stats:', error);
       }
     },
     
     fetchScriptMetadata: async () => {
       try {
         const response = await scriptsAPI.getScriptMetadata();
         
         if (response.success) {
           set({ scriptMetadata: response.data.metadata });
         }
       } catch (error) {
         console.error('Failed to fetch script metadata:', error);
       }
     },
     
     fetchAvailableDeals: async () => {
       try {
         const response = await scriptsAPI.getAvailableDeals();
         
         if (response.success) {
           set({ availableDeals: response.data.deals });
         }
       } catch (error) {
         console.error('Failed to fetch available deals:', error);
       }
     },
     
     // ============================================
     // Script Creation
     // ============================================
     createTextScript: async (scriptData) => {
       try {
         set({ isCreating: true });
         
         const response = await scriptsAPI.createTextScript(scriptData);
         
         if (response.success) {
           const newScript = response.data.script;
           
           // Add to scripts list
           set(state => ({
             scripts: [newScript, ...state.scripts]
           }));
           
           // Start polling for AI generation
           get().startGenerationPolling(newScript.id);
           
           toast.success('Script created successfully!');
           return { success: true, script: newScript };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to create script';
         toast.error(message);
         return { success: false, message };
       } finally {
         set({ isCreating: false });
       }
     },
     
     createFileScript: async (scriptData, file) => {
       try {
         set({ isCreating: true, isUploading: true, uploadProgress: 0 });
         
         const response = await scriptsAPI.createScriptWithFile(scriptData, file, 'file_upload');
         
         if (response.success) {
           const newScript = response.data.script;
           
           set(state => ({
             scripts: [newScript, ...state.scripts]
           }));
           
           get().startGenerationPolling(newScript.id);
           
           toast.success('Script created from file successfully!');
           return { success: true, script: newScript };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to create script from file';
         toast.error(message);
         return { success: false, message };
       } finally {
         set({ isCreating: false, isUploading: false, uploadProgress: 0 });
       }
     },
     
     createVideoScript: async (scriptData, videoFile) => {
       try {
         set({ isCreating: true, isUploading: true, uploadProgress: 0 });
         
         const response = await scriptsAPI.createScriptWithFile(scriptData, videoFile, 'video_transcription');
         
         if (response.success) {
           const newScript = response.data.script;
           
           set(state => ({
             scripts: [newScript, ...state.scripts]
           }));
           
           get().startGenerationPolling(newScript.id);
           
           toast.success('Video script created successfully! Transcription in progress...');
           return { success: true, script: newScript };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to create video script';
         toast.error(message);
         return { success: false, message };
       } finally {
         set({ isCreating: false, isUploading: false, uploadProgress: 0 });
       }
     },
     
     // ============================================
     // Script Retrieval
     // ============================================
     fetchScripts: async (newFilters = {}) => {
       try {
         set({ isLoading: true });
         
         const { filters, pagination } = get();
         const searchParams = {
           ...filters,
           ...newFilters,
           page: newFilters.page || pagination.page
         };
         
         const response = await scriptsAPI.getUserScripts(searchParams);
         
         if (response.success) {
           const { scripts, pagination: newPagination } = response.data;
           
           set({
             scripts,
             pagination: newPagination,
             filters: { ...filters, ...newFilters }
           });
         }
       } catch (error) {
         console.error('Failed to fetch scripts:', error);
         toast.error('Failed to load scripts');
       } finally {
         set({ isLoading: false });
       }
     },
     
     fetchScriptById: async (scriptId) => {
       try {
         const response = await scriptsAPI.getScriptById(scriptId);
         
         if (response.success) {
           set({ currentScript: response.data.script });
           return { success: true, script: response.data.script };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to fetch script';
         console.error('Failed to fetch script:', error);
         return { success: false, message };
       }
     },
     
     // ============================================
     // Script Updates
     // ============================================
     updateScript: async (scriptId, updateData) => {
       try {
         const response = await scriptsAPI.updateScript(scriptId, updateData);
         
         if (response.success) {
           // Update in scripts list
           set(state => ({
             scripts: state.scripts.map(script => 
               script.id === scriptId 
                 ? { ...script, ...updateData }
                 : script
             )
           }));
           
           // Update current script if it's the same
           const { currentScript } = get();
           if (currentScript?.id === scriptId) {
             set({ currentScript: { ...currentScript, ...updateData } });
           }
           
           toast.success('Script updated successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to update script';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     updateScriptStatus: async (scriptId, status, reason = null) => {
       try {
         const response = await scriptsAPI.updateScriptStatus(scriptId, status, reason);
         
         if (response.success) {
           set(state => ({
             scripts: state.scripts.map(script => 
               script.id === scriptId 
                 ? { ...script, status }
                 : script
             )
           }));
           
           toast.success('Script status updated successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to update status';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // ============================================
     // AI Processing
     // ============================================
     regenerateScript: async (scriptId) => {
       try {
         set({ isGenerating: true });
         
         const response = await scriptsAPI.regenerateScript(scriptId);
         
         if (response.success) {
           // Start polling for generation status
           get().startGenerationPolling(scriptId);
           
           toast.success('Script regeneration started!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to regenerate script';
         toast.error(message);
         return { success: false, message };
       } finally {
         set({ isGenerating: false });
       }
     },
     
     startGenerationPolling: async (scriptId) => {
       try {
         set({ isPolling: true });
         
         const response = await scriptsAPI.pollGenerationStatus(scriptId);
         
         if (response.success) {
           const { status } = response.data;
           
           if (status === 'completed') {
             toast.success('Script generation completed!');
             // Refresh the specific script
             get().fetchScriptById(scriptId);
           } else if (status === 'failed') {
             toast.error('Script generation failed');
           }
         }
       } catch (error) {
         console.error('Generation polling failed:', error);
       } finally {
         set({ isPolling: false });
       }
     },
     
     createScriptVariation: async (scriptId, variationType, title, description, changes) => {
       try {
         const variationData = {
           type: variationType,
           title,
           description,
           changes
         };
         
         const response = await scriptsAPI.createScriptVariation(scriptId, variationData);
         
         if (response.success) {
           toast.success('Script variation created successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to create variation';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // ============================================
     // Deal Connection
     // ============================================
     linkScriptToDeal: async (scriptId, dealId) => {
       try {
         const response = await scriptsAPI.linkScriptToDeal(scriptId, dealId);
         
         if (response.success) {
           // Update script in list
           set(state => ({
             scripts: state.scripts.map(script => 
               script.id === scriptId 
                 ? { 
                     ...script, 
                     dealConnection: {
                       isLinked: true,
                       dealId: response.data.dealId,
                       dealTitle: response.data.dealTitle,
                       brandName: response.data.brandName
                     }
                   }
                 : script
             )
           }));
           
           toast.success('Script linked to deal successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to link script to deal';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     unlinkScriptFromDeal: async (scriptId) => {
       try {
         const response = await scriptsAPI.unlinkScriptFromDeal(scriptId);
         
         if (response.success) {
           set(state => ({
             scripts: state.scripts.map(script => 
               script.id === scriptId 
                 ? { 
                     ...script, 
                     dealConnection: { isLinked: false }
                   }
                 : script
             )
           }));
           
           toast.success('Script unlinked from deal successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to unlink script';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // ============================================
     // Search & Filtering
     // ============================================
     updateFilters: (newFilters) => {
       set(state => ({
         filters: { ...state.filters, ...newFilters },
         pagination: { ...state.pagination, page: 1 } // Reset to first page
       }));
     },
     
     searchScripts: async (searchData) => {
       try {
         set({ isLoading: true });
         
         const response = await scriptsAPI.searchScripts(searchData);
         
         if (response.success) {
           const { scripts, pagination } = response.data;
           
           set({
             scripts,
             pagination
           });
         }
       } catch (error) {
         console.error('Search failed:', error);
         toast.error('Search failed');
       } finally {
         set({ isLoading: false });
       }
     },
     
     // ============================================
     // Bulk Operations
     // ============================================
     selectScript: (scriptId) => {
       set(state => ({
         selectedScripts: state.selectedScripts.includes(scriptId)
           ? state.selectedScripts.filter(id => id !== scriptId)
           : [...state.selectedScripts, scriptId]
       }));
     },
     
     selectAllScripts: () => {
       const { scripts } = get();
       set({ selectedScripts: scripts.map(script => script.id) });
     },
     
     clearSelection: () => {
       set({ selectedScripts: [] });
     },
     
     toggleBulkMode: () => {
       set(state => ({ 
         bulkActionMode: !state.bulkActionMode,
         selectedScripts: []
       }));
     },
     
     bulkUpdateStatus: async (status, reason = null) => {
       try {
         const { selectedScripts } = get();
         
         if (selectedScripts.length === 0) {
           toast.error('No scripts selected');
           return { success: false };
         }
         
         const response = await scriptsAPI.bulkUpdateScripts(selectedScripts, { status, reason });
         
         if (response.success) {
           // Update scripts in store
           set(state => ({
             scripts: state.scripts.map(script => 
               selectedScripts.includes(script.id)
                 ? { ...script, status }
                 : script
             ),
             selectedScripts: []
           }));
           
           toast.success(`Updated ${selectedScripts.length} scripts successfully!`);
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Bulk update failed';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     bulkDelete: async () => {
       try {
         const { selectedScripts } = get();
         
         if (selectedScripts.length === 0) {
           toast.error('No scripts selected');
           return { success: false };
         }
         
         const promises = selectedScripts.map(id => scriptsAPI.deleteScript(id));
         await Promise.all(promises);
         
         // Remove from store
         set(state => ({
           scripts: state.scripts.filter(script => !selectedScripts.includes(script.id)),
           selectedScripts: []
         }));
         
         toast.success(`Deleted ${selectedScripts.length} scripts successfully!`);
         return { success: true };
       } catch (error) {
         const message = error.response?.data?.message || 'Bulk delete failed';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     // ============================================
     // Utility Methods
     // ============================================
     deleteScript: async (scriptId) => {
       try {
         const response = await scriptsAPI.deleteScript(scriptId);
         
         if (response.success) {
           set(state => ({
             scripts: state.scripts.filter(script => script.id !== scriptId)
           }));
           
           toast.success('Script deleted successfully!');
           return { success: true };
         }
         
         return { success: false, message: response.message };
       } catch (error) {
         const message = error.response?.data?.message || 'Failed to delete script';
         toast.error(message);
         return { success: false, message };
       }
     },
     
     clearCurrentScript: () => {
       set({ currentScript: null });
     },
     
     resetFilters: () => {
       set({
         filters: {
           status: 'all',
           platform: 'all',
           inputType: 'all',
           search: '',
           sortBy: 'createdAt',
           sortOrder: 'desc',
           dateFrom: null,
           dateTo: null
         },
         pagination: {
           page: 1,
           limit: 20,
           total: 0,
           totalPages: 0,
           hasNext: false,
           hasPrev: false
         }
       });
     },
     
     // ============================================
     // Pagination
     // ============================================
     goToPage: (page) => {
       set(state => ({
         pagination: { ...state.pagination, page }
       }));
       get().fetchScripts({ page });
     },
     
     nextPage: () => {
       const { pagination } = get();
       if (pagination.hasNext) {
         get().goToPage(pagination.page + 1);
       }
     },
     
     prevPage: () => {
       const { pagination } = get();
       if (pagination.hasPrev) {
         get().goToPage(pagination.page - 1);
       }
     }
   }),
   {
     name: `${STORAGE_PREFIX}scripts-storage`,
     storage: createJSONStorage(() => localStorage),
     partialize: (state) => ({
       filters: state.filters,
       pagination: state.pagination,
       dashboardStats: state.dashboardStats,
       scriptMetadata: state.scriptMetadata
     })
   }
 )
);

export default useScriptsStore;
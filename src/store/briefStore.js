/**
 * Brief Store - Comprehensive state management for brand brief analyzer
 * 
 * This store manages:
 * - Brief creation and CRUD operations
 * - AI extraction processing
 * - File upload handling
 * - Clarification management
 * - Deal conversion workflow
 * - Status transitions
 * - Caching and optimization
 * 
 * File: src/store/briefStore.js
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { briefsAPI, briefHelpers } from '../api/endpoints'; // Fixed import path
import toast from 'react-hot-toast';

// Cache duration - FIXED: Added VERY_LONG
const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 15 * 60 * 1000,   // 15 minutes
  LONG: 30 * 60 * 1000,     // 30 minutes
  VERY_LONG: 60 * 60 * 1000 // 1 hour - ADDED THIS
};

const useBriefStore = create(
  subscribeWithSelector((set, get) => ({
    // ============================================
    // Core State
    // ============================================
    briefs: {
      list: [],
      byId: {},
      lastFetch: null,
      isLoading: false,
      error: null
    },

    // Dashboard stats
    dashboardStats: {
      data: null,
      lastFetch: null,
      isLoading: false
    },

    // Brief metadata (statuses, deliverable types, etc.)
    metadata: {
      data: null,
      lastFetch: null,
      isLoading: false
    },

    // Filtering and pagination
    filters: {
      status: 'all',
      inputType: 'all',
      search: '',
      dateFrom: null,
      dateTo: null,
      estimatedValueMin: null,
      estimatedValueMax: null
    },

    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: false
    },

    // Current brief being viewed/edited
    currentBrief: {
      data: null,
      isLoading: false,
      error: null,
      isDirty: false
    },

    // AI extraction state
    aiExtraction: {
      activeBriefId: null,
      isProcessing: false,
      progress: 0,
      status: null,
      error: null
    },

    // File upload state
    fileUpload: {
      isUploading: false,
      progress: 0,
      error: null,
      currentFile: null
    },

    // Clarification management
    clarifications: {
      emailTemplate: null,
      isGenerating: false,
      pendingAnswers: {},
      error: null
    },

    // Deal conversion
    dealConversion: {
      preview: null,
      isGenerating: false,
      isConverting: false,
      error: null
    },

    // ============================================
    // INITIALIZATION - ADDED THIS METHOD
    // ============================================
    
    /**
     * Initialize brief store
     * Called when user logs in or app starts
     */
    init: async () => {
      console.log('Initializing brief store...');
      
      try {
        // Clear any existing errors
        get().clearErrors();
        
        // Load essential data in parallel - only what backend supports
        const initPromises = [
          // Load metadata (cached for long time)
          get().fetchBriefMetadata(),
          
          // Load dashboard stats
          get().fetchDashboardStats()
        ];

        // Wait for critical data to load
        const results = await Promise.allSettled(initPromises);
        
        // Log any failures but don't throw
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const operationNames = ['metadata', 'dashboard stats'];
            console.warn(`Failed to load ${operationNames[index]}:`, result.reason);
          }
        });

        console.log('Brief store initialized successfully');
        
      } catch (error) {
        console.error('Error initializing brief store:', error);
        
        // Don't throw - let the app continue running
        set(state => ({
          briefs: { ...state.briefs, error: 'Failed to initialize brief data' }
        }));
      }
    },

    // ============================================
    // Cache Management
    // ============================================
    isCacheValid: (key, duration = CACHE_DURATION.MEDIUM) => {
      const cacheData = get()[key];
      if (!cacheData?.lastFetch) return false;
      
      const now = Date.now();
      const lastFetch = new Date(cacheData.lastFetch).getTime();
      return (now - lastFetch) < duration;
    },

    invalidateCache: (keys = null) => {
      if (Array.isArray(keys)) {
        keys.forEach(key => {
          set(state => ({
            [key]: { ...state[key], lastFetch: null }
          }));
        });
      } else if (keys) {
        set(state => ({
          [keys]: { ...state[keys], lastFetch: null }
        }));
      } else {
        // Invalidate all caches
        set(state => ({
          briefs: { ...state.briefs, lastFetch: null },
          dashboardStats: { ...state.dashboardStats, lastFetch: null },
          metadata: { ...state.metadata, lastFetch: null }
        }));
      }
    },

    // ============================================
    // Brief CRUD Operations
    // ============================================

    // Fetch briefs list
    fetchBriefs: async (force = false) => {
      const { filters, pagination } = get();
      
      if (!force && get().isCacheValid('briefs', CACHE_DURATION.SHORT)) {
        return { success: true, data: get().briefs.list };
      }

      set(state => ({
        briefs: { ...state.briefs, isLoading: true, error: null }
      }));

      try {
        const response = await briefsAPI.getCreatorBriefs({
          ...filters,
          page: pagination.page,
          limit: pagination.limit
        });

        if (response.success) {
          const { briefs, pagination: paginationData } = response.data;

          // Create byId map
          const byId = briefs.reduce((acc, brief) => {
            acc[brief._id] = brief;
            return acc;
          }, {});

          set(state => ({
            briefs: {
              ...state.briefs,
              list: briefs,
              byId: { ...state.briefs.byId, ...byId },
              lastFetch: new Date().toISOString(),
              isLoading: false
            },
            pagination: {
              ...state.pagination,
              total: paginationData.totalItems,
              hasMore: paginationData.hasNextPage
            }
          }));

          return { success: true, data: briefs };
        }

        throw new Error(response.message || 'Failed to fetch briefs');
      } catch (error) {
        set(state => ({
          briefs: { ...state.briefs, isLoading: false, error: error.message }
        }));
        toast.error('Failed to fetch briefs');
        return { success: false, error: error.message };
      }
    },

    // Fetch single brief
    fetchBriefById: async (briefId, force = false) => {
      const existing = get().briefs.byId[briefId];
      
      if (!force && existing && get().isCacheValid('briefs', CACHE_DURATION.MEDIUM)) {
        set({ currentBrief: { data: existing, isLoading: false, error: null, isDirty: false } });
        return { success: true, data: existing };
      }

      set({ currentBrief: { data: null, isLoading: true, error: null, isDirty: false } });

      try {
        const response = await briefsAPI.getBriefById(briefId);

        if (response.success) {
          const brief = response.data.brief;

          set(state => ({
            briefs: {
              ...state.briefs,
              byId: { ...state.briefs.byId, [briefId]: brief }
            },
            currentBrief: { data: brief, isLoading: false, error: null, isDirty: false }
          }));

          return { success: true, data: brief };
        }

        throw new Error(response.message || 'Failed to fetch brief');
      } catch (error) {
        set({ currentBrief: { data: null, isLoading: false, error: error.message, isDirty: false } });
        toast.error('Failed to fetch brief details');
        return { success: false, error: error.message };
      }
    },

    // Create text brief
    createTextBrief: async (briefData) => {
      set(state => ({
        briefs: { ...state.briefs, isLoading: true, error: null }
      }));

      try {
        const response = await briefsAPI.createTextBrief(briefData);

        if (response.success) {
          const newBrief = response.data.brief;

          // Optimistically add to list
          set(state => ({
            briefs: {
              ...state.briefs,
              list: [newBrief, ...state.briefs.list],
              byId: { ...state.briefs.byId, [newBrief.id]: newBrief },
              isLoading: false
            }
          }));

          // Invalidate cache to fetch fresh data
          get().invalidateCache(['briefs', 'dashboardStats']);
          
          toast.success('Brief created successfully');
          return { success: true, data: newBrief };
        }

        throw new Error(response.message || 'Failed to create brief');
      } catch (error) {
        set(state => ({
          briefs: { ...state.briefs, isLoading: false, error: error.message }
        }));
        toast.error('Failed to create brief');
        return { success: false, error: error.message };
      }
    },

    // Create file brief
    createFileBrief: async (file, progressCallback = null) => {
      // Validate file first
      const user = { subscriptionTier: 'pro' }; // Get from auth store
      const validation = briefHelpers.validateFileUpload(file, user.subscriptionTier);
      
      if (!validation.valid) {
        toast.error(validation.error);
        return { success: false, error: validation.error };
      }

      set({
        fileUpload: { isUploading: true, progress: 0, error: null, currentFile: file.name }
      });

      try {
        const response = await briefsAPI.createFileBrief(
          { file }, 
          (progress) => {
            set(state => ({
              fileUpload: { ...state.fileUpload, progress }
            }));
            if (progressCallback) progressCallback(progress);
          }
        );

        if (response.success) {
          const newBrief = response.data.brief;

          set(state => ({
            briefs: {
              ...state.briefs,
              list: [newBrief, ...state.briefs.list],
              byId: { ...state.briefs.byId, [newBrief.id]: newBrief }
            },
            fileUpload: { isUploading: false, progress: 100, error: null, currentFile: null }
          }));

          get().invalidateCache(['briefs', 'dashboardStats']);
          
          toast.success('Brief created from file successfully');
          return { success: true, data: newBrief };
        }

        throw new Error(response.message || 'Failed to create brief from file');
      } catch (error) {
        set({
          fileUpload: { isUploading: false, progress: 0, error: error.message, currentFile: null }
        });
        toast.error('Failed to upload file');
        return { success: false, error: error.message };
      }
    },

    // Update brief
    updateBrief: async (briefId, updates) => {
      // Optimistic update
      const oldBrief = get().briefs.byId[briefId];
      const updatedBrief = { ...oldBrief, ...updates };

      set(state => ({
        briefs: {
          ...state.briefs,
          byId: { ...state.briefs.byId, [briefId]: updatedBrief },
          list: state.briefs.list.map(b => b._id === briefId ? updatedBrief : b)
        },
        currentBrief: state.currentBrief.data?._id === briefId 
          ? { ...state.currentBrief, data: updatedBrief, isDirty: false }
          : state.currentBrief
      }));

      try {
        const response = await briefsAPI.updateBrief(briefId, updates);

        if (response.success) {
          const finalBrief = response.data.brief;

          set(state => ({
            briefs: {
              ...state.briefs,
              byId: { ...state.briefs.byId, [briefId]: finalBrief },
              list: state.briefs.list.map(b => b._id === briefId ? finalBrief : b)
            }
          }));

          return { success: true, data: finalBrief };
        }

        throw new Error(response.message || 'Failed to update brief');
      } catch (error) {
        // Revert optimistic update
        set(state => ({
          briefs: {
            ...state.briefs,
            byId: { ...state.briefs.byId, [briefId]: oldBrief },
            list: state.briefs.list.map(b => b._id === briefId ? oldBrief : b)
          }
        }));
        toast.error('Failed to update brief');
        return { success: false, error: error.message };
      }
    },

    // Delete brief
    deleteBrief: async (briefId) => {
      try {
        const response = await briefsAPI.deleteBrief(briefId);

        if (response.success) {
          set(state => ({
            briefs: {
              ...state.briefs,
              list: state.briefs.list.filter(b => b._id !== briefId),
              byId: Object.fromEntries(
                Object.entries(state.briefs.byId).filter(([id]) => id !== briefId)
              )
            },
            currentBrief: state.currentBrief.data?._id === briefId 
              ? { data: null, isLoading: false, error: null, isDirty: false }
              : state.currentBrief
          }));

          get().invalidateCache(['dashboardStats']);
          toast.success('Brief deleted successfully');
          return { success: true };
        }

        throw new Error(response.message || 'Failed to delete brief');
      } catch (error) {
        toast.error('Failed to delete brief');
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // AI Processing
    // ============================================
    triggerAIExtraction: async (briefId, options = {}) => {
      set({
        aiExtraction: {
          activeBriefId: briefId,
          isProcessing: true,
          progress: 0,
          status: 'starting',
          error: null
        }
      });

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          set(state => ({
            aiExtraction: {
              ...state.aiExtraction,
              progress: Math.min(state.aiExtraction.progress + 10, 90)
            }
          }));
        }, 500);

        const response = await briefsAPI.triggerAIExtraction(briefId, options);

        clearInterval(progressInterval);

        if (response.success) {
          const { extractionStatus, deliverables, missingInfo, confidenceScore } = response.data;

          // Update brief in store
          const updatedBrief = {
            ...get().briefs.byId[briefId],
            aiExtraction: {
              status: extractionStatus,
              deliverables,
              missingInfo,
              processingMetadata: { confidenceScore }
            }
          };

          set(state => ({
            briefs: {
              ...state.briefs,
              byId: { ...state.briefs.byId, [briefId]: updatedBrief }
            },
            aiExtraction: {
              activeBriefId: null,
              isProcessing: false,
              progress: 100,
              status: 'completed',
              error: null
            }
          }));

          toast.success('AI analysis completed successfully');
          return { success: true, data: response.data };
        }

        throw new Error(response.message || 'AI extraction failed');
      } catch (error) {
        set({
          aiExtraction: {
            activeBriefId: null,
            isProcessing: false,
            progress: 0,
            status: 'failed',
            error: error.message
          }
        });
        toast.error('AI analysis failed');
        return { success: false, error: error.message };
      }
    },

    // Get extraction status
    getExtractionStatus: async (briefId) => {
      try {
        const response = await briefsAPI.getExtractionStatus(briefId);
        
        if (response.success) {
          const { status, completionPercentage } = response.data;
          
          set(state => ({
            aiExtraction: {
              ...state.aiExtraction,
              activeBriefId: briefId,
              progress: completionPercentage,
              status
            }
          }));

          return { success: true, data: response.data };
        }

        throw new Error(response.message || 'Failed to get extraction status');
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // Clarification Management
    // ============================================
    generateClarificationEmail: async (briefId) => {
      set(state => ({
        clarifications: { ...state.clarifications, isGenerating: true, error: null }
      }));

      try {
        const response = await briefsAPI.generateClarificationEmail(briefId);

        if (response.success) {
          const emailTemplate = response.data.emailTemplate;

          set(state => ({
            clarifications: {
              ...state.clarifications,
              emailTemplate,
              isGenerating: false
            }
          }));

          toast.success('Clarification email generated');
          return { success: true, data: emailTemplate };
        }

        throw new Error(response.message || 'Failed to generate email');
      } catch (error) {
        set(state => ({
          clarifications: { ...state.clarifications, isGenerating: false, error: error.message }
        }));
        toast.error('Failed to generate clarification email');
        return { success: false, error: error.message };
      }
    },

    addClarificationQuestion: async (briefId, question, category = 'other', priority = 'medium') => {
      try {
        const response = await briefsAPI.addClarificationQuestion(briefId, question, category, priority);

        if (response.success) {
          // Update brief with new question
          const brief = get().briefs.byId[briefId];
          if (brief) {
            const updatedBrief = {
              ...brief,
              clarifications: {
                ...brief.clarifications,
                customQuestions: [
                  ...brief.clarifications.customQuestions,
                  { question, category, priority, isAnswered: false }
                ]
              }
            };

            set(state => ({
              briefs: {
                ...state.briefs,
                byId: { ...state.briefs.byId, [briefId]: updatedBrief }
              }
            }));
          }

          toast.success('Question added successfully');
          return { success: true };
        }

        throw new Error(response.message || 'Failed to add question');
      } catch (error) {
        toast.error('Failed to add clarification question');
        return { success: false, error: error.message };
      }
    },

    answerClarificationQuestion: async (briefId, questionId, answer) => {
      try {
        const response = await briefsAPI.answerClarificationQuestion(briefId, questionId, answer);

        if (response.success) {
          // Update brief with answered question
          const brief = get().briefs.byId[briefId];
          if (brief) {
            // Update in both suggested and custom questions
            const updateQuestions = (questions) => questions.map(q => 
              q._id === questionId ? { ...q, answer, isAnswered: true, answeredAt: new Date() } : q
            );

            const updatedBrief = {
              ...brief,
              clarifications: {
                ...brief.clarifications,
                suggestedQuestions: updateQuestions(brief.clarifications.suggestedQuestions || []),
                customQuestions: updateQuestions(brief.clarifications.customQuestions || [])
              }
            };

            set(state => ({
              briefs: {
                ...state.briefs,
                byId: { ...state.briefs.byId, [briefId]: updatedBrief }
              }
            }));
          }

          toast.success('Answer recorded successfully');
          return { success: true };
        }

        throw new Error(response.message || 'Failed to record answer');
      } catch (error) {
        toast.error('Failed to record answer');
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // Deal Conversion
    // ============================================
    generateDealPreview: async (briefId) => {
      set(state => ({
        dealConversion: { ...state.dealConversion, isGenerating: true, error: null }
      }));

      try {
        const response = await briefsAPI.getDealPreview(briefId);

        if (response.success) {
          const preview = response.data.dealPreview;

          set(state => ({
            dealConversion: {
              ...state.dealConversion,
              preview,
              isGenerating: false
            }
          }));

          return { success: true, data: preview };
        }

        throw new Error(response.message || 'Failed to generate deal preview');
      } catch (error) {
        set(state => ({
          dealConversion: { ...state.dealConversion, isGenerating: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },

    convertToDeal: async (briefId, dealOverrides = {}) => {
      set(state => ({
        dealConversion: { ...state.dealConversion, isConverting: true, error: null }
      }));

      try {
        const response = await briefsAPI.convertToDeal(briefId, dealOverrides);

        if (response.success) {
          const deal = response.data.deal;

          // Update brief status to converted
          const brief = get().briefs.byId[briefId];
          if (brief) {
            const updatedBrief = {
              ...brief,
              status: 'converted',
              dealConversion: {
                isConverted: true,
                dealId: deal.id,
                convertedAt: new Date().toISOString()
              }
            };

            set(state => ({
              briefs: {
                ...state.briefs,
                byId: { ...state.briefs.byId, [briefId]: updatedBrief }
              },
              dealConversion: {
                ...state.dealConversion,
                isConverting: false
              }
            }));
          }

          get().invalidateCache(['dashboardStats']);
          toast.success('Brief converted to deal successfully');
          return { success: true, data: deal };
        }

        throw new Error(response.message || 'Failed to convert to deal');
      } catch (error) {
        set(state => ({
          dealConversion: { ...state.dealConversion, isConverting: false, error: error.message }
        }));
        toast.error('Failed to convert to deal');
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // Dashboard and Metadata
    // ============================================
    fetchDashboardStats: async (force = false) => {
      if (!force && get().isCacheValid('dashboardStats', CACHE_DURATION.LONG)) {
        return { success: true, data: get().dashboardStats.data };
      }

      set(state => ({
        dashboardStats: { ...state.dashboardStats, isLoading: true }
      }));

      try {
        const response = await briefsAPI.getDashboardStats();

        if (response.success) {
          set(state => ({
            dashboardStats: {
              data: response.data.stats,
              lastFetch: new Date().toISOString(),
              isLoading: false
            }
          }));

          return { success: true, data: response.data.stats };
        }

        throw new Error(response.message || 'Failed to fetch dashboard stats');
      } catch (error) {
        set(state => ({
          dashboardStats: { ...state.dashboardStats, isLoading: false }
        }));
        return { success: false, error: error.message };
      }
    },

    fetchBriefMetadata: async (force = false) => {
      // FIXED: Now uses VERY_LONG which is defined
      if (!force && get().isCacheValid('metadata', CACHE_DURATION.VERY_LONG)) {
        return { success: true, data: get().metadata.data };
      }

      set(state => ({
        metadata: { ...state.metadata, isLoading: true }
      }));

      try {
        const response = await briefsAPI.getBriefMetadata();

        if (response.success) {
          set(state => ({
            metadata: {
              data: response.data.metadata,
              lastFetch: new Date().toISOString(),
              isLoading: false
            }
          }));

          return { success: true, data: response.data.metadata };
        }

        throw new Error(response.message || 'Failed to fetch metadata');
      } catch (error) {
        set(state => ({
          metadata: { ...state.metadata, isLoading: false }
        }));
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // Search and Filtering
    // ============================================
    setFilters: (newFilters) => {
      set(state => ({
        filters: { ...state.filters, ...newFilters },
        pagination: { ...state.pagination, page: 1 }
      }));

      // Fetch with new filters
      get().fetchBriefs(true);
    },

    clearFilters: () => {
      set({
        filters: {
          status: 'all',
          inputType: 'all',
          search: '',
          dateFrom: null,
          dateTo: null,
          estimatedValueMin: null,
          estimatedValueMax: null
        },
        pagination: { page: 1, limit: 20, total: 0, hasMore: false }
      });

      get().fetchBriefs(true);
    },

    searchBriefs: async (searchData) => {
      set(state => ({
        briefs: { ...state.briefs, isLoading: true, error: null }
      }));

      try {
        const response = await briefsAPI.searchBriefs(searchData);

        if (response.success) {
          const { briefs } = response.data;

          const byId = briefs.reduce((acc, brief) => {
            acc[brief._id] = brief;
            return acc;
          }, {});

          set(state => ({
            briefs: {
              ...state.briefs,
              list: briefs,
              byId: { ...state.briefs.byId, ...byId },
              isLoading: false
            }
          }));

          return { success: true, data: briefs };
        }

        throw new Error(response.message || 'Search failed');
      } catch (error) {
        set(state => ({
          briefs: { ...state.briefs, isLoading: false, error: error.message }
        }));
        return { success: false, error: error.message };
      }
    },

    // ============================================
    // Utility Methods
    // ============================================
    setBriefDirty: (isDirty = true) => {
      set(state => ({
        currentBrief: { ...state.currentBrief, isDirty }
      }));
    },

    clearCurrentBrief: () => {
      set({
        currentBrief: { data: null, isLoading: false, error: null, isDirty: false }
      });
    },

    clearErrors: () => {
      set(state => ({
        briefs: { ...state.briefs, error: null },
        aiExtraction: { ...state.aiExtraction, error: null },
        fileUpload: { ...state.fileUpload, error: null },
        clarifications: { ...state.clarifications, error: null },
        dealConversion: { ...state.dealConversion, error: null }
      }));
    },

    reset: () => {
      set({
        briefs: { list: [], byId: {}, lastFetch: null, isLoading: false, error: null },
        dashboardStats: { data: null, lastFetch: null, isLoading: false },
        metadata: { data: null, lastFetch: null, isLoading: false },
        filters: {
          status: 'all',
          inputType: 'all',
          search: '',
          dateFrom: null,
          dateTo: null,
          estimatedValueMin: null,
          estimatedValueMax: null
        },
        pagination: { page: 1, limit: 20, total: 0, hasMore: false },
        currentBrief: { data: null, isLoading: false, error: null, isDirty: false },
        aiExtraction: { activeBriefId: null, isProcessing: false, progress: 0, status: null, error: null },
        fileUpload: { isUploading: false, progress: 0, error: null, currentFile: null },
        clarifications: { emailTemplate: null, isGenerating: false, pendingAnswers: {}, error: null },
        dealConversion: { preview: null, isGenerating: false, isConverting: false, error: null }
      });
    }
  }))
);

export default useBriefStore;
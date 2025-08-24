/**
 * UI Store - Global state management for UI elements
 * 
 * This store manages:
 * - Sidebar state (open/closed/collapsed)
 * - Modal states (which modals are open)
 * - Global loading indicators
 * - Toast/notification preferences
 * - Theme settings
 * - Responsive breakpoints
 * 
 * File: src/store/uiStore.js
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Storage key prefix from environment
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_';

// Breakpoint definitions (matching CSS)
const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

const useUIStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // Sidebar State
      // ============================================
      sidebar: {
        isOpen: true,
        isCollapsed: false,
        isMobileOpen: false,
        activeItem: 'dashboard',
        expandedItems: [] // For nested menu items
      },
      
      // ============================================
      // Modal State
      // ============================================
      modals: {
        createDeal: false,
        createInvoice: false,
        createBrief: false,
        userProfile: false,
        notifications: false,
        search: false,
        settings: false,
        confirmDialog: false,
        imagePreview: false,
        pdfViewer: false
      },
      
      modalData: {}, // Store data for active modals
      
      // ============================================
      // Loading States
      // ============================================
      loading: {
        global: false,
        page: false,
        action: false,
        submit: false
      },
      
      loadingMessage: '',
      
      // ============================================
      // Theme & Preferences
      // ============================================
      theme: 'light', // 'light', 'dark', 'system'
      compactMode: false,
      animations: true,
      soundEffects: false,
      
      // ============================================
      // Responsive State
      // ============================================
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'lg'
      },
      
      // ============================================
      // Notification Preferences
      // ============================================
      notifications: {
        showToasts: true,
        position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        duration: 4000,
        sound: false
      },
      
      // ============================================
      // Page Meta
      // ============================================
      pageTitle: 'Dashboard',
      breadcrumbs: [],
      
      // ============================================
      // Search State
      // ============================================
      searchQuery: '',
      searchFilters: {},
      isSearching: false,
      
      // ============================================
      // Sidebar Actions
      // ============================================
      toggleSidebar: () => {
        const { sidebar, viewport } = get();
        
        if (viewport.isMobile) {
          set({
            sidebar: {
              ...sidebar,
              isMobileOpen: !sidebar.isMobileOpen
            }
          });
        } else {
          set({
            sidebar: {
              ...sidebar,
              isOpen: !sidebar.isOpen
            }
          });
        }
      },
      
      collapseSidebar: (collapsed) => {
        const { sidebar } = get();
        set({
          sidebar: {
            ...sidebar,
            isCollapsed: collapsed ?? !sidebar.isCollapsed
          }
        });
      },
      
      setActiveMenuItem: (itemId) => {
        const { sidebar } = get();
        set({
          sidebar: {
            ...sidebar,
            activeItem: itemId
          }
        });
      },
      
      toggleMenuExpansion: (itemId) => {
        const { sidebar } = get();
        const expandedItems = sidebar.expandedItems.includes(itemId)
          ? sidebar.expandedItems.filter(id => id !== itemId)
          : [...sidebar.expandedItems, itemId];
        
        set({
          sidebar: {
            ...sidebar,
            expandedItems
          }
        });
      },
      
      // ============================================
      // Modal Actions
      // ============================================
      openModal: (modalName, data = null) => {
        const { modals } = get();
        
        // Close other modals if needed (only one modal at a time)
        const updatedModals = Object.keys(modals).reduce((acc, key) => {
          acc[key] = key === modalName;
          return acc;
        }, {});
        
        set({
          modals: updatedModals,
          modalData: data ? { [modalName]: data } : {}
        });
      },
      
      closeModal: (modalName) => {
        const { modals, modalData } = get();
        
        set({
          modals: {
            ...modals,
            [modalName]: false
          },
          modalData: {
            ...modalData,
            [modalName]: null
          }
        });
      },
      
      closeAllModals: () => {
        const { modals } = get();
        const closedModals = Object.keys(modals).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        
        set({
          modals: closedModals,
          modalData: {}
        });
      },
      
      // ============================================
      // Loading Actions
      // ============================================
      setLoading: (type, isLoading, message = '') => {
        const { loading } = get();
        
        set({
          loading: {
            ...loading,
            [type]: isLoading
          },
          loadingMessage: isLoading ? message : ''
        });
      },
      
      setGlobalLoading: (isLoading, message = '') => {
        set({
          loading: {
            ...get().loading,
            global: isLoading
          },
          loadingMessage: isLoading ? message : ''
        });
      },
      
      // ============================================
      // Theme Actions
      // ============================================
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          
          // Handle system theme
          if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
          }
        }
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      // ============================================
      // Viewport Actions
      // ============================================
      updateViewport: () => {
        if (typeof window === 'undefined') return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        let breakpoint = 'xs';
        let isMobile = false;
        let isTablet = false;
        let isDesktop = false;
        
        if (width >= BREAKPOINTS['2xl']) {
          breakpoint = '2xl';
          isDesktop = true;
        } else if (width >= BREAKPOINTS.xl) {
          breakpoint = 'xl';
          isDesktop = true;
        } else if (width >= BREAKPOINTS.lg) {
          breakpoint = 'lg';
          isDesktop = true;
        } else if (width >= BREAKPOINTS.md) {
          breakpoint = 'md';
          isTablet = true;
        } else if (width >= BREAKPOINTS.sm) {
          breakpoint = 'sm';
          isMobile = true;
        } else {
          breakpoint = 'xs';
          isMobile = true;
        }
        
        set({
          viewport: {
            width,
            height,
            isMobile,
            isTablet,
            isDesktop,
            breakpoint
          }
        });
        
        // Auto-close mobile sidebar on desktop
        if (isDesktop) {
          const { sidebar } = get();
          if (sidebar.isMobileOpen) {
            set({
              sidebar: {
                ...sidebar,
                isMobileOpen: false
              }
            });
          }
        }
      },
      
      // ============================================
      // Page Meta Actions
      // ============================================
      setPageTitle: (title) => {
        set({ pageTitle: title });
        
        // Update document title
        if (typeof document !== 'undefined') {
          document.title = `${title} - CreatorsMantra`;
        }
      },
      
      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },
      
      // ============================================
      // Search Actions
      // ============================================
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      setSearchFilters: (filters) => {
        set({ searchFilters: filters });
      },
      
      clearSearch: () => {
        set({
          searchQuery: '',
          searchFilters: {},
          isSearching: false
        });
      },
      
      // ============================================
      // Preferences Actions
      // ============================================
      updatePreferences: (preferences) => {
        const currentPrefs = {
          compactMode: get().compactMode,
          animations: get().animations,
          soundEffects: get().soundEffects,
          notifications: get().notifications
        };
        
        set({
          ...currentPrefs,
          ...preferences
        });
      },
      
      // ============================================
      // Utility Actions
      // ============================================
      resetUI: () => {
        set({
          sidebar: {
            isOpen: true,
            isCollapsed: false,
            isMobileOpen: false,
            activeItem: 'dashboard',
            expandedItems: []
          },
          modals: Object.keys(get().modals).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {}),
          modalData: {},
          loading: {
            global: false,
            page: false,
            action: false,
            submit: false
          },
          loadingMessage: '',
          searchQuery: '',
          searchFilters: {},
          isSearching: false
        });
      },
      
      // Initialize viewport listener
      initializeViewport: () => {
        if (typeof window === 'undefined') return;
        
        // Set initial viewport
        get().updateViewport();
        
        // Add resize listener
        let resizeTimer;
        const handleResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            get().updateViewport();
          }, 100);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Return cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }),
    {
      name: `${STORAGE_PREFIX}ui-storage`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        compactMode: state.compactMode,
        animations: state.animations,
        soundEffects: state.soundEffects,
        notifications: state.notifications,
        sidebar: {
          isCollapsed: state.sidebar.isCollapsed
        }
      })
    }
  )
);

export default useUIStore;
/**
 * Authentication Store - Global state management for user authentication
 * 
 * This store manages:
 * - User authentication state (logged in/out)
 * - User profile data
 * - JWT tokens
 * - Login/logout operations
 * - Session persistence
 * 
 * File: src/store/authStore.js
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '@/api/endpoints';
import { tokenManager } from '@/api/client';
import toast from 'react-hot-toast';

// Storage key prefix from environment
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // State
      // ============================================
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      subscription: null,
      permissions: [],
      lastActivity: null,
      
      // ============================================
      // Initialization
      // ============================================
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Check if we have tokens
          const accessToken = tokenManager.getAccessToken();
          
          if (!accessToken) {
            set({ 
              isInitialized: true, 
              isLoading: false,
              isAuthenticated: false 
            });
            return;
          }
          
          // Validate token by fetching profile
          const response = await authAPI.getProfile();
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              subscription: response.data.subscription,
              permissions: response.data.permissions || [],
              isAuthenticated: true,
              isInitialized: true,
              lastActivity: new Date().toISOString()
            });
          } else {
            // Token invalid, clear everything
            get().logout();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Clear invalid session
          get().logout();
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },
      
      // ============================================
      // Login Methods
      // ============================================
      
      // Login with OTP
      loginWithOTP: async (phone, otp) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.loginWithOTP(phone, otp);
          
          if (response.success) {
            const { user, tokens, subscription, permissions } = response.data;
            
            // Store tokens
            tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            
            // Update store
            set({
              user,
              subscription,
              permissions: permissions || [],
              isAuthenticated: true,
              lastActivity: new Date().toISOString()
            });
            
            toast.success('Welcome back!');
            return { success: true };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Login with password
      loginWithPassword: async (email, password) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.login(email, password);
          
          if (response.success) {
            const { user, tokens, subscription, permissions } = response.data;
            
            // Store tokens
            tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            
            // Update store
            set({
              user,
              subscription,
              permissions: permissions || [],
              isAuthenticated: true,
              lastActivity: new Date().toISOString()
            });
            
            toast.success('Welcome back!');
            return { success: true };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // ============================================
      // Registration
      // ============================================
      register: async (userData) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.register(userData);
          
          if (response.success) {
            const { user, tokens, subscription } = response.data;
            
            // Store tokens
            tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            
            // Update store
            set({
              user,
              subscription,
              permissions: [],
              isAuthenticated: true,
              lastActivity: new Date().toISOString()
            });
            
            toast.success('Account created successfully!');
            return { success: true };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // ============================================
      // OTP Operations
      // ============================================
      sendOTP: async (phone) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.sendOTP(phone);
          
          if (response.success) {
            toast.success('OTP sent successfully!');
            return { success: true };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to send OTP';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      verifyOTP: async (phone, otp) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.verifyOTP(phone, otp);
          
          if (response.success) {
            return { success: true, data: response.data };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Invalid OTP';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // ============================================
      // Profile Management
      // ============================================
      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true });
          
          const response = await authAPI.updateProfile(profileData);
          
          if (response.success) {
            set({ 
              user: response.data.user,
              lastActivity: new Date().toISOString()
            });
            toast.success('Profile updated successfully!');
            return { success: true };
          }
          
          return { success: false, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to update profile';
          toast.error(message);
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      refreshProfile: async () => {
        try {
          const response = await authAPI.getProfile();
          
          if (response.success) {
            set({ 
              user: response.data.user,
              subscription: response.data.subscription,
              permissions: response.data.permissions || [],
              lastActivity: new Date().toISOString()
            });
            return { success: true };
          }
          
          return { success: false };
        } catch (error) {
          console.error('Failed to refresh profile:', error);
          return { success: false };
        }
      },
      
      // ============================================
      // Logout
      // ============================================
      logout: async () => {
        try {
          // Call logout API (optional - for server-side cleanup)
          await authAPI.logout().catch(() => {});
          
          // Clear tokens
          tokenManager.clearTokens();
          
          // Reset store
          set({
            user: null,
            subscription: null,
            permissions: [],
            isAuthenticated: false,
            lastActivity: null
          });
          
          toast.success('Logged out successfully');
          
          // Redirect to login (will be handled by router)
          window.location.href = '/login';
        } catch (error) {
          console.error('Logout error:', error);
          // Force logout even if API fails
          tokenManager.clearTokens();
          set({
            user: null,
            subscription: null,
            permissions: [],
            isAuthenticated: false,
            lastActivity: null
          });
          window.location.href = '/login';
        }
      },
      
      // ============================================
      // Permission Checks
      // ============================================
      hasPermission: (permission) => {
        const { permissions, user } = get();
        
        // Admin has all permissions
        if (user?.role === 'admin') return true;
        
        // Check specific permission
        return permissions.includes(permission);
      },
      
      hasSubscription: (requiredTiers = []) => {
        const { subscription } = get();
        
        if (!subscription || !subscription.isActive) return false;
        if (requiredTiers.length === 0) return true;
        
        return requiredTiers.includes(subscription.tier);
      },
      
      canAccessFeature: (feature) => {
        const { subscription } = get();
        
        if (!subscription || !subscription.isActive) return false;
        
        // Check feature access based on subscription tier
        const tierFeatures = {
          starter: ['deals', 'invoices', 'basic_analytics'],
          pro: ['deals', 'invoices', 'analytics', 'briefs', 'performance'],
          elite: ['all'],
          agency_starter: ['all', 'multi_user'],
          agency_pro: ['all', 'multi_user', 'white_label']
        };
        
        const userFeatures = tierFeatures[subscription.tier] || [];
        
        return userFeatures.includes('all') || userFeatures.includes(feature);
      },
      
      // ============================================
      // Session Management
      // ============================================
      updateActivity: () => {
        set({ lastActivity: new Date().toISOString() });
      },
      
      checkSession: () => {
        const { lastActivity } = get();
        
        if (!lastActivity) return true;
        
        // Check if session expired (24 hours)
        const lastActivityTime = new Date(lastActivity).getTime();
        const now = new Date().getTime();
        const hoursSinceActivity = (now - lastActivityTime) / (1000 * 60 * 60);
        
        if (hoursSinceActivity > 24) {
          get().logout();
          toast.error('Session expired. Please login again.');
          return false;
        }
        
        return true;
      },
      
      // ============================================
      // Utility Methods
      // ============================================
      clearError: () => {
        set({ error: null });
      },
      
      reset: () => {
        set({
          user: null,
          subscription: null,
          permissions: [],
          isAuthenticated: false,
          isLoading: false,
          lastActivity: null
        });
      }
    }),
    {
      name: `${STORAGE_PREFIX}auth-storage`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        subscription: state.subscription,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity
      })
    }
  )
);

export default useAuthStore;
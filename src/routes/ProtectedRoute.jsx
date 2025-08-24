/**
 * Protected Route Component
 * 
 * This component handles:
 * - Authentication checks
 * - Permission validation
 * - Subscription tier verification
 * - Redirect logic for unauthorized access
 * - Session validation
 * - Loading states during auth check
 * 
 * File: src/routes/ProtectedRoute.jsx
 */

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';
import { Shield, Lock, Loader2, AlertCircle } from 'lucide-react';

// ============================================
// Protected Route Component
// ============================================
const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredSubscription = [],
  requiredRole = null,
  feature = null,
  redirectTo = '/login',
  showLoader = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  
  // Auth store methods
  const { 
    isAuthenticated, 
    isInitialized,
    isLoading,
    user,
    subscription,
    hasPermission, 
    hasSubscription,
    canAccessFeature,
    checkSession,
    refreshProfile
  } = useAuthStore();
  
  // UI store methods
  const { setGlobalLoading } = useUIStore();

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      setError(null);
      
      try {
        // Wait for auth initialization
        if (!isInitialized) {
          return;
        }

        // Check if session is still valid
        const sessionValid = checkSession();
        if (!sessionValid) {
          setError('Session expired');
          navigate('/login', { 
            state: { 
              from: location.pathname + location.search,
              message: 'Your session has expired. Please login again.' 
            },
            replace: true 
          });
          return;
        }

        // Check authentication
        if (!isAuthenticated) {
          // Save the attempted location for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
          
          setError('Authentication required');
          navigate(redirectTo, { 
            state: { 
              from: location.pathname + location.search,
              message: 'Please login to access this page' 
            },
            replace: true 
          });
          return;
        }

        // Refresh profile to get latest permissions/subscription
        if (requiredPermissions.length > 0 || requiredSubscription.length > 0 || feature) {
          await refreshProfile();
        }

        // Check role-based access
        if (requiredRole && user?.role !== requiredRole) {
          setError('Insufficient role');
          toast.error(`This page requires ${requiredRole} role`);
          navigate('/unauthorized', { 
            state: { 
              reason: 'role',
              required: requiredRole,
              current: user?.role 
            },
            replace: true 
          });
          return;
        }

        // Check specific permissions
        if (requiredPermissions.length > 0) {
          const missingPermissions = requiredPermissions.filter(
            permission => !hasPermission(permission)
          );
          
          if (missingPermissions.length > 0) {
            setError('Insufficient permissions');
            toast.error('You do not have permission to access this page');
            navigate('/unauthorized', { 
              state: { 
                reason: 'permissions',
                missing: missingPermissions 
              },
              replace: true 
            });
            return;
          }
        }

        // Check subscription tier
        if (requiredSubscription.length > 0) {
          if (!hasSubscription(requiredSubscription)) {
            setError('Subscription upgrade required');
            
            // Show upgrade message with current and required tiers
            const currentTier = subscription?.tier || 'free';
            const requiredTiersList = requiredSubscription.join(', ');
            
            toast.error(
              `This feature requires ${requiredTiersList} subscription. You currently have ${currentTier}.`,
              { duration: 5000 }
            );
            
            // Redirect to subscription page with upgrade context
            navigate('/settings/subscription', { 
              state: { 
                from: location.pathname,
                requiredTiers: requiredSubscription,
                feature: feature || 'This feature'
              },
              replace: true 
            });
            return;
          }
        }

        // Check feature access (combines permissions and subscription)
        if (feature && !canAccessFeature(feature)) {
          setError('Feature not available');
          toast.error(`You don't have access to ${feature}`);
          navigate('/settings/subscription', { 
            state: { 
              from: location.pathname,
              feature: feature
            },
            replace: true 
          });
          return;
        }

        // All checks passed
        setIsChecking(false);
      } catch (error) {
        console.error('Protected route check failed:', error);
        setError('Access check failed');
        toast.error('Failed to verify access permissions');
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [
    isAuthenticated,
    isInitialized,
    location,
    navigate,
    redirectTo,
    requiredPermissions,
    requiredSubscription,
    requiredRole,
    feature,
    hasPermission,
    hasSubscription,
    canAccessFeature,
    checkSession,
    refreshProfile,
    user?.role,
    subscription?.tier
  ]);

  // Update global loading state
  useEffect(() => {
    if (showLoader) {
      setGlobalLoading(isChecking || isLoading, 'Checking access...');
    }
  }, [isChecking, isLoading, showLoader, setGlobalLoading]);

  // Show loading state
  if (!isInitialized || isChecking || isLoading) {
    if (!showLoader) return null;
    
    return (
      <div className="protected-route-loader">
        <div className="loader-content">
          <Loader2 size={32} className="loader-spinner" />
          <p className="loader-text">Verifying access...</p>
        </div>
        <style jsx>{`
          .protected-route-loader {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-mesh), var(--gradient-light);
          }
          
          .loader-content {
            text-align: center;
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
          }
          
          .loader-spinner {
            animation: spin 1s linear infinite;
            color: var(--color-primary-500);
            margin-bottom: var(--space-4);
          }
          
          .loader-text {
            color: var(--color-neutral-600);
            font-size: var(--text-sm);
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show error state if access denied
  if (error) {
    // Component will redirect, so we can return null or a brief error message
    return (
      <div className="protected-route-error">
        <div className="error-content">
          <AlertCircle size={48} className="error-icon" />
          <h2 className="error-title">Access Denied</h2>
          <p className="error-message">{error}</p>
          <p className="error-redirect">Redirecting...</p>
        </div>
        <style jsx>{`
          .protected-route-error {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-mesh), var(--gradient-light);
          }
          
          .error-content {
            text-align: center;
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            max-width: 400px;
          }
          
          .error-icon {
            color: var(--color-error);
            margin-bottom: var(--space-4);
          }
          
          .error-title {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--color-neutral-900);
            margin-bottom: var(--space-2);
          }
          
          .error-message {
            color: var(--color-neutral-600);
            margin-bottom: var(--space-4);
          }
          
          .error-redirect {
            font-size: var(--text-sm);
            color: var(--color-neutral-500);
          }
        `}</style>
      </div>
    );
  }

  // Check if we have authentication but are still here (all checks passed)
  if (!isAuthenticated) {
    return null;
  }

  // Render children or outlet
  return children || <Outlet />;
};

// ============================================
// HOC Version for Wrapping Components
// ============================================
export const withProtectedRoute = (
  Component,
  options = {}
) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// ============================================
// Subscription Tier Wrapper
// ============================================
export const RequireSubscription = ({ 
  tiers, 
  feature, 
  children,
  fallback = null 
}) => {
  const { hasSubscription, subscription } = useAuthStore();
  const navigate = useNavigate();
  
  const hasAccess = hasSubscription(tiers);
  
  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="subscription-required">
        <div className="upgrade-card">
          <Shield size={48} className="upgrade-icon" />
          <h3 className="upgrade-title">Upgrade Required</h3>
          <p className="upgrade-message">
            This feature requires a {tiers.join(' or ')} subscription.
          </p>
          <p className="current-tier">
            Your current plan: <strong>{subscription?.tier || 'Free'}</strong>
          </p>
          <button 
            className="upgrade-button"
            onClick={() => navigate('/settings/subscription')}
          >
            Upgrade Now
          </button>
        </div>
        <style jsx>{`
          .subscription-required {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            padding: var(--space-6);
          }
          
          .upgrade-card {
            text-align: center;
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-lg);
            max-width: 400px;
            border: 2px dashed var(--color-primary-300);
          }
          
          .upgrade-icon {
            color: var(--color-primary-500);
            margin-bottom: var(--space-4);
          }
          
          .upgrade-title {
            font-size: var(--text-xl);
            font-weight: var(--font-bold);
            color: var(--color-neutral-900);
            margin-bottom: var(--space-3);
          }
          
          .upgrade-message {
            color: var(--color-neutral-600);
            margin-bottom: var(--space-3);
          }
          
          .current-tier {
            font-size: var(--text-sm);
            color: var(--color-neutral-500);
            margin-bottom: var(--space-6);
          }
          
          .current-tier strong {
            color: var(--color-primary-600);
            text-transform: capitalize;
          }
          
          .upgrade-button {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: var(--space-3) var(--space-6);
            border-radius: var(--radius-lg);
            font-weight: var(--font-semibold);
            cursor: pointer;
            transition: transform var(--duration-150) var(--ease-out);
          }
          
          .upgrade-button:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }
  
  return children;
};

// ============================================
// Permission Check Wrapper
// ============================================
export const RequirePermission = ({ 
  permissions, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useAuthStore();
  
  const hasAccess = permissions.every(p => hasPermission(p));
  
  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="permission-denied">
        <Lock size={48} />
        <p>You don't have permission to view this content.</p>
        <style jsx>{`
          .permission-denied {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--space-4);
            min-height: 200px;
            color: var(--color-neutral-500);
          }
        `}</style>
      </div>
    );
  }
  
  return children;
};

export default ProtectedRoute;
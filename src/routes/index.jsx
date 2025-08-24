/**
 * Main Routing Configuration
 * 
 * This file defines all application routes and handles:
 * - Route definitions and nested routing
 * - Authentication guards
 * - Code splitting with lazy loading
 * - Route-based layouts
 * - Error boundaries
 * 
 * File: src/routes/index.jsx
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
  Outlet,
  useLocation,
  useNavigate 
} from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import toast from 'react-hot-toast';

// ============================================
// Lazy Load Pages (Code Splitting)
// ============================================

// Public Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const OTPVerificationPage = lazy(() => import('@/features/auth/pages/OTPVerificationPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));

// Protected Pages - Dashboard
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

// Protected Pages - Deals
const DealsListPage = lazy(() => import('@/features/deals/pages/DealsListPage'));
const DealDetailsPage = lazy(() => import('@/features/deals/pages/DealDetailsPage'));
const CreateDealPage = lazy(() => import('@/features/deals/pages/CreateDealPage'));
const DealsPipelinePage = lazy(() => import('@/features/deals/pages/DealsPipelinePage'));

// Protected Pages - Invoices
const InvoicesListPage = lazy(() => import('@/features/invoices/pages/InvoicesListPage'));
const CreateInvoicePage = lazy(() => import('@/features/invoices/pages/CreateInvoicePage'));
const InvoiceDetailsPage = lazy(() => import('@/features/invoices/pages/InvoiceDetailsPage'));

// Protected Pages - Briefs
const BriefsListPage = lazy(() => import('@/features/briefs/pages/BriefsListPage'));
const BriefDetailsPage = lazy(() => import('@/features/briefs/pages/BriefDetailsPage'));
const CreateBriefPage = lazy(() => import('@/features/briefs/pages/CreateBriefPage'));

// Protected Pages - Analytics
const AnalyticsDashboardPage = lazy(() => import('@/features/analytics/pages/AnalyticsDashboardPage'));
const RevenueAnalyticsPage = lazy(() => import('@/features/analytics/pages/RevenueAnalyticsPage'));
const PerformanceAnalyticsPage = lazy(() => import('@/features/analytics/pages/PerformanceAnalyticsPage'));

// Protected Pages - Performance
const CampaignsListPage = lazy(() => import('@/features/performance/pages/CampaignsListPage'));
const CampaignDetailsPage = lazy(() => import('@/features/performance/pages/CampaignDetailsPage'));

// Protected Pages - Contracts
const ContractsListPage = lazy(() => import('@/features/contracts/pages/ContractsListPage'));
const ContractDetailsPage = lazy(() => import('@/features/contracts/pages/ContractDetailsPage'));

// Protected Pages - Rate Cards
const RateCardsListPage = lazy(() => import('@/features/ratecards/pages/RateCardsListPage'));
const RateCardBuilderPage = lazy(() => import('@/features/ratecards/pages/RateCardBuilderPage'));

// Protected Pages - Settings
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const ProfilePage = lazy(() => import('@/features/settings/pages/ProfilePage'));
const SubscriptionPage = lazy(() => import('@/features/settings/pages/SubscriptionPage'));
const TeamPage = lazy(() => import('@/features/settings/pages/TeamPage'));

// Error Pages
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

// Layouts (to be created next)
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const MinimalLayout = lazy(() => import('@/layouts/MinimalLayout'));

// ============================================
// Loading Component
// ============================================
const PageLoader = () => {
  const isGlobalLoading = useUIStore((state) => state.loading.global);
  
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-spinner" />
        <p className="loader-text">Loading...</p>
      </div>
      <style jsx>{`
        .page-loader {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-mesh), var(--gradient-light);
        }
        .loader-content {
          text-align: center;
        }
        .loader-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--color-primary-200);
          border-top-color: var(--color-primary-600);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
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
};

// ============================================
// Protected Route Wrapper
// ============================================
const ProtectedRoute = ({ children, requiredPermissions = [], requiredSubscription = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated, 
    isInitialized, 
    hasPermission, 
    hasSubscription 
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      // Save the attempted location for redirect after login
      const from = location.pathname + location.search;
      sessionStorage.setItem('redirectAfterLogin', from);
      
      toast.error('Please login to continue');
      navigate('/login', { replace: true });
      return;
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      
      if (!hasAllPermissions) {
        toast.error('You do not have permission to access this page');
        navigate('/unauthorized', { replace: true });
        return;
      }
    }

    // Check subscription
    if (requiredSubscription.length > 0) {
      if (!hasSubscription(requiredSubscription)) {
        toast.error('Please upgrade your subscription to access this feature');
        navigate('/settings/subscription', { replace: true });
        return;
      }
    }
  }, [
    isAuthenticated, 
    isInitialized, 
    navigate, 
    location, 
    requiredPermissions, 
    requiredSubscription,
    hasPermission,
    hasSubscription
  ]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children || <Outlet />;
};

// ============================================
// Public Route Wrapper (Redirect if authenticated)
// ============================================
const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated) {
      // Get redirect URL from session storage
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return children || <Outlet />;
};

// ============================================
// Route Configuration
// ============================================
const router = createBrowserRouter([
  // Public Routes with Auth Layout
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        )
      },
      {
        path: 'verify-otp',
        element: (
          <PublicRoute>
            <OTPVerificationPage />
          </PublicRoute>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        )
      }
    ]
  },

  // Protected Routes with Main Layout
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      }
    ]
  },

  // Deals Routes
  {
    path: '/deals',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DealsListPage />
      },
      {
        path: 'pipeline',
        element: <DealsPipelinePage />
      },
      {
        path: 'create',
        element: <CreateDealPage />
      },
      {
        path: ':dealId',
        element: <DealDetailsPage />
      },
      {
        path: ':dealId/edit',
        element: <CreateDealPage />
      }
    ]
  },

  // Invoices Routes
  {
    path: '/invoices',
    element: (
      <ProtectedRoute requiredSubscription={['starter', 'pro', 'elite', 'agency_starter', 'agency_pro']}>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <InvoicesListPage />
      },
      {
        path: 'create',
        element: <CreateInvoicePage />
      },
      {
        path: ':invoiceId',
        element: <InvoiceDetailsPage />
      }
    ]
  },

  // Briefs Routes
  {
    path: '/briefs',
    element: (
      <ProtectedRoute requiredSubscription={['pro', 'elite', 'agency_starter', 'agency_pro']}>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BriefsListPage />
      },
      {
        path: 'create',
        element: <CreateBriefPage />
      },
      {
        path: ':briefId',
        element: <BriefDetailsPage />
      }
    ]
  },

  // Analytics Routes
  {
    path: '/analytics',
    element: (
      <ProtectedRoute requiredSubscription={['pro', 'elite', 'agency_starter', 'agency_pro']}>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AnalyticsDashboardPage />
      },
      {
        path: 'revenue',
        element: <RevenueAnalyticsPage />
      },
      {
        path: 'performance',
        element: <PerformanceAnalyticsPage />
      }
    ]
  },

  // Performance Routes
  {
    path: '/performance',
    element: (
      <ProtectedRoute requiredSubscription={['pro', 'elite', 'agency_starter', 'agency_pro']}>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CampaignsListPage />
      },
      {
        path: ':campaignId',
        element: <CampaignDetailsPage />
      }
    ]
  },

  // Contracts Routes
  {
    path: '/contracts',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ContractsListPage />
      },
      {
        path: ':contractId',
        element: <ContractDetailsPage />
      }
    ]
  },

  // Rate Cards Routes
  {
    path: '/ratecards',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RateCardsListPage />
      },
      {
        path: 'builder',
        element: <RateCardBuilderPage />
      },
      {
        path: ':rateCardId/edit',
        element: <RateCardBuilderPage />
      }
    ]
  },

  // Settings Routes
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SettingsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'subscription',
        element: <SubscriptionPage />
      },
      {
        path: 'team',
        element: <TeamPage />
      }
    ]
  },

  // Error Routes with Minimal Layout
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MinimalLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <UnauthorizedPage />
      }
    ]
  },
  {
    path: '/error',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MinimalLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <ServerErrorPage />
      }
    ]
  },

  // 404 - Not Found (Catch all)
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MinimalLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <NotFoundPage />
      }
    ]
  }
]);

// ============================================
// Router Provider Component
// ============================================
const AppRouter = () => {
  const setPageTitle = useUIStore((state) => state.setPageTitle);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeViewport = useUIStore((state) => state.initializeViewport);

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
    
    // Initialize viewport listener
    const cleanup = initializeViewport();
    
    return cleanup;
  }, [initializeAuth, initializeViewport]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
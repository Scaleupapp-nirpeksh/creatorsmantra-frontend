/**
 * Main App Component - Integrated with Deals and Scripts Modules
 * Path: src/App.jsx
 * * This preserves all your existing code and adds the scripts module integration,
 * while removing the briefs module.
 * All your themes, animations, and styles are maintained.
 */

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Store imports
import useAuthStore from './store/authStore';
import useUIStore from './store/uiStore';
import useDealsStore from './store/dealsStore'; 
import useInvoiceStore from './store/invoiceStore';
import useScriptsStore from './store/scriptsStore'; // ADD THIS
// import useBriefStore from './store/briefStore'; // REMOVE THIS

// Layout imports
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Page imports
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';
import DashboardPage from './pages/DashboardPage';
import DemoPage from './pages/DemoPage';

// Protected Route Component
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy load Module pages
const DealsListPage = lazy(() => import('./features/deals/pages/DealsListPage'));
const CreateDealPage = lazy(() => import('./features/deals/pages/CreateDealPage'));
const DealDetailsPage = lazy(() => import('./features/deals/pages/DealDetailsPage'));
const InvoiceDashboard = lazy(() => import('./features/invoices/pages/InvoiceDashboard'));
const CreateInvoice = lazy(() => import('./features/invoices/pages/CreateInvoice'));
const InvoiceDetails = lazy(() => import('./features/invoices/pages/InvoiceDetails'));
const EditInvoice = lazy(() => import('./features/invoices/pages/EditInvoice'));
const TaxSettings = lazy(() => import('./features/invoices/pages/TaxSettings'));
const InvoiceAnalytics = lazy(() => import('./features/invoices/pages/InvoiceAnalytics'));
const ConsolidatedInvoiceWizard = lazy(() => import('./features/invoices/pages/ConsolidatedInvoiceWizard'));

// const BriefsDashboardPage = lazy(() => import('./features/briefs/pages/BriefsDashboardPage')); // REMOVE THIS
// const CreateBriefPage = lazy(() => import('./features/briefs/pages/CreateBriefPage')); // REMOVE THIS
// const BriefDetailsPage = lazy(() => import('./features/briefs/pages/BriefDetailsPage')); // REMOVE THIS
// const BriefEditorPage = lazy(() => import('./features/briefs/pages/BriefEditorPage')); // REMOVE THIS

// ADD SCRIPT PAGES HERE
const ScriptsPriorityDashboard = lazy(() => import('./features/scripts/pages/ScriptsPriorityDashboard'));
const ScriptCreationWizard = lazy(() => import('./features/scripts/pages/ScriptCreationWizard'));
const ScriptDetailsEditor = lazy(() => import('./features/scripts/pages/ScriptDetailsEditor'));
const ScriptAnalyticsPerformance = lazy(() => import('./features/scripts/pages/ScriptAnalyticsPerformance'));


// Import styles
import './styles/index.css';

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div style={styles.pageLoadingContainer}>
    <div style={styles.pageSpinner}>
      <div style={styles.pageSpinnerGradient}></div>
    </div>
    <p style={styles.pageLoadingText}>Loading...</p>
  </div>
);

function App() {
  const [appReady, setAppReady] = useState(false);
  const { initialize, isAuthenticated, isInitialized } = useAuthStore();
  const { theme, setTheme, updateViewport, initializeViewport } = useUIStore();
  const { init: initDeals } = useDealsStore(); 
  const { init: initInvoices } = useInvoiceStore();
  const { initialize: initScripts } = useScriptsStore(); // ADD THIS
  // const { init: initBriefs } = useBriefStore(); // REMOVE THIS


  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize theme from stored preference
        const storedTheme = localStorage.getItem('cm_ui-storage');
        if (storedTheme) {
          try {
            const parsed = JSON.parse(storedTheme);
            if (parsed.state?.theme) {
              setTheme(parsed.state.theme);
            }
          } catch (e) {
            console.error('Error parsing stored theme:', e);
          }
        }
        
        // Initialize viewport
        const cleanupViewport = initializeViewport();
        
        // Initialize auth (check stored tokens)
        await initialize();
        
        // App is ready
        setAppReady(true);
        
        // Return cleanup function
        return cleanupViewport;
      } catch (error) {
        console.error('App initialization error:', error);
        setAppReady(true); // Still show app even if init fails
      }
    };

    const cleanup = initApp();

    // Cleanup on unmount
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initialize, setTheme, initializeViewport]);

  // Initialize stores when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      initDeals();
      initInvoices();
      initScripts(); // ADD THIS
      // initBriefs(); // REMOVE THIS
    }
  }, [isAuthenticated, initDeals, initInvoices, initScripts]); // UPDATE DEPENDENCIES

  // Show loading screen while initializing
  if (!appReady || !isInitialized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}>
            <div style={styles.spinnerGradient}></div>
          </div>
          <h2 style={styles.loadingTitle}>CreatorsMantra</h2>
          <p style={styles.loadingText}>Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
            } />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
              } />
              <Route path="/verify-otp" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <OTPVerificationPage />
              } />
            </Route>

            {/* Demo Route - No authentication required */}
            <Route path="/demo" element={<DemoPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Deals Routes */}
                <Route path="/deals">
                  <Route index element={
                    <Suspense fallback={<PageLoader />}>
                      <DealsListPage />
                    </Suspense>
                  } />
                  <Route path="create" element={
                    <Suspense fallback={<PageLoader />}>
                      <CreateDealPage />
                    </Suspense>
                  } />
                  <Route path="new" element={<Navigate to="/deals/create" replace />} />
                  <Route path=":dealId" element={
                    <Suspense fallback={<PageLoader />}>
                      <DealDetailsPage />
                    </Suspense>
                  } />
                  <Route path=":dealId/edit" element={
                    <Suspense fallback={<PageLoader />}>
                      <DealDetailsPage editMode={true} />
                    </Suspense>
                  } />
                </Route>

                {/* Invoices Routes */}
                <Route path="/invoices">
                  <Route index element={
                    <Suspense fallback={<PageLoader />}>
                      <InvoiceDashboard />
                    </Suspense>
                  } />
                  <Route path="create" element={
                    <Suspense fallback={<PageLoader />}>
                      <CreateInvoice />
                    </Suspense>
                  } />
                  <Route path="create-consolidated" element={
                    <Suspense fallback={<PageLoader />}>
                      <ConsolidatedInvoiceWizard />
                    </Suspense>
                  } />
                  <Route path="analytics" element={
                    <Suspense fallback={<PageLoader />}>
                      <InvoiceAnalytics />
                    </Suspense>
                  } />
                  <Route path=":invoiceId" element={
                    <Suspense fallback={<PageLoader />}>
                      <InvoiceDetails />
                    </Suspense>
                  } />
                  <Route path=":invoiceId/edit" element={
                    <Suspense fallback={<PageLoader />}>
                      <EditInvoice />
                    </Suspense>
                  } />
                </Route>

                {/* Scripts Routes - ADD THIS SECTION */}
                <Route path="/scripts">
                  <Route index element={
                    <Suspense fallback={<PageLoader />}>
                      <ScriptsPriorityDashboard />
                    </Suspense>
                  } />
                  <Route path="create" element={
                    <Suspense fallback={<PageLoader />}>
                      <ScriptCreationWizard />
                    </Suspense>
                  } />
                   <Route path="analytics" element={
                    <Suspense fallback={<PageLoader />}>
                      <ScriptAnalyticsPerformance />
                    </Suspense>
                  } />
                  <Route path=":scriptId" element={
                    <Suspense fallback={<PageLoader />}>
                      <ScriptDetailsEditor />
                    </Suspense>
                  } />
                  <Route path=":scriptId/edit" element={
                    <Suspense fallback={<PageLoader />}>
                      <ScriptDetailsEditor editMode={true} />
                    </Suspense>
                  } />
                </Route>

                {/* Briefs Routes - REMOVED */}
                {/* <Route path="/briefs">
                  <Route index element={
                    <Suspense fallback={<PageLoader />}>
                      <BriefsDashboardPage />
                    </Suspense>
                  } />
                  <Route path="create" element={
                    <Suspense fallback={<PageLoader />}>
                      <CreateBriefPage />
                    </Suspense>
                  } />
                  <Route path=":briefId" element={
                    <Suspense fallback={<PageLoader />}>
                      <BriefDetailsPage />
                    </Suspense>
                  } />
                  <Route path=":briefId/edit" element={
                    <Suspense fallback={<PageLoader />}>
                      <BriefEditorPage />
                    </Suspense>
                  } />
                  <Route path=":briefId/convert" element={
                    <Suspense fallback={<PageLoader />}>
                      <BriefDetailsPage convertMode={true} />
                    </Suspense>
                  } />
                </Route>
                */}

                {/* Performance Routes */}
                <Route path="/performance">
                  <Route index element={<div style={styles.comingSoon}>
                    <h2>Performance Dashboard</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="analytics" element={<div style={styles.comingSoon}>
                    <h2>Analytics</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="reports" element={<div style={styles.comingSoon}>
                    <h2>Reports</h2>
                    <p>Coming Soon</p>
                  </div>} />
                </Route>

                {/* Rate Cards Routes */}
                <Route path="/rate-cards">
                  <Route index element={<div style={styles.comingSoon}>
                    <h2>Rate Cards</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="builder" element={<div style={styles.comingSoon}>
                    <h2>Rate Card Builder</h2>
                    <p>Coming Soon</p>
                  </div>} />
                </Route>

                {/* Contracts Routes */}
                <Route path="/contracts">
                  <Route index element={<div style={styles.comingSoon}>
                    <h2>Contracts List</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="new" element={<div style={styles.comingSoon}>
                    <h2>New Contract</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path=":contractId" element={<div style={styles.comingSoon}>
                    <h2>Contract Details</h2>
                    <p>Coming Soon</p>
                  </div>} />
                </Route>

                {/* Profile Routes */}
                <Route path="/profile">
                  <Route index element={<div style={styles.comingSoon}>
                    <h2>Profile</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="settings" element={<div style={styles.comingSoon}>
                    <h2>Settings</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="subscription" element={<div style={styles.comingSoon}>
                    <h2>Subscription</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="team" element={<div style={styles.comingSoon}>
                    <h2>Team Management</h2>
                    <p>Coming Soon</p>
                  </div>} />
                </Route>

                {/* Settings Routes */}
                <Route path="/settings">
                  <Route index element={<div style={styles.comingSoon}>
                    <h2>Settings</h2>
                    <p>Coming Soon</p>
                  </div>} />
                  <Route path="tax-preferences" element={
                    <Suspense fallback={<PageLoader />}>
                      <TaxSettings />
                    </Suspense>
                  } />
                  <Route path="subscription" element={<div style={styles.comingSoon}>
                    <h2>Subscription</h2>
                    <p>Coming Soon</p>
                  </div>} />
                </Route>
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

// 404 Page Component
const NotFoundPage = () => {
  return (
    <div style={styles.notFoundContainer}>
      <div style={styles.notFoundContent}>
        <h1 style={styles.notFoundTitle}>404</h1>
        <h2 style={styles.notFoundSubtitle}>Page Not Found</h2>
        <p style={styles.notFoundText}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" style={styles.notFoundButton}>
          Go Back Home
        </a>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  // Loading Screen Styles
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  loadingContent: {
    textAlign: 'center',
    color: 'white',
  },
  
  spinner: {
    width: '60px',
    height: '60px',
    margin: '0 auto 2rem',
    position: 'relative',
  },
  
  spinnerGradient: {
    width: '100%',
    height: '100%',
    border: '4px solid rgba(255, 255, 255, 0.2)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  
  loadingText: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  
  // 404 Page Styles
  notFoundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
  },
  
  notFoundContent: {
    textAlign: 'center',
    padding: '2rem',
  },
  
  notFoundTitle: {
    fontSize: '8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    lineHeight: '1',
  },
  
  notFoundSubtitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1rem',
  },
  
  notFoundText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '2rem',
    maxWidth: '400px',
    margin: '0 auto 2rem',
  },
  
  notFoundButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },

  // Page loader styles for lazy loaded components
  pageLoadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
  },

  pageSpinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    position: 'relative',
  },

  pageSpinnerGradient: {
    width: '100%',
    height: '100%',
    border: '3px solid rgba(102, 126, 234, 0.2)',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  pageLoadingText: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },

  // Coming soon styles
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
  },
};

// Add global keyframes for spinner
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('app-keyframes');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'app-keyframes';
    styleSheet.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default App;

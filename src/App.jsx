// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Store imports
import  useAuthStore  from './store/authStore';
import  useUIStore  from './store/uiStore';

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

// Import styles
import './styles/index.css';

function App() {
  const [appReady, setAppReady] = useState(false);
  const { initialize, isAuthenticated, isLoading } = useAuthStore();
  const { theme, initializeTheme, checkViewport } = useUIStore();

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize theme
        initializeTheme();
        
        // Check viewport for responsive features
        checkViewport();
        
        // Initialize auth (check stored tokens)
        await initialize();
        
        // App is ready
        setAppReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppReady(true); // Still show app even if init fails
      }
    };

    initApp();

    // Setup viewport listener
    const handleResize = () => {
      checkViewport();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialize, initializeTheme, checkViewport]);

  // Show loading screen while initializing
  if (!appReady || isLoading) {
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
                  <Route index element={<div>Deals List - Coming Soon</div>} />
                  <Route path="new" element={<div>New Deal - Coming Soon</div>} />
                  <Route path=":dealId" element={<div>Deal Details - Coming Soon</div>} />
                </Route>

                {/* Invoices Routes */}
                <Route path="/invoices">
                  <Route index element={<div>Invoices List - Coming Soon</div>} />
                  <Route path="new" element={<div>New Invoice - Coming Soon</div>} />
                  <Route path=":invoiceId" element={<div>Invoice Details - Coming Soon</div>} />
                </Route>

                {/* Briefs Routes */}
                <Route path="/briefs">
                  <Route index element={<div>Briefs List - Coming Soon</div>} />
                  <Route path="analyze" element={<div>Analyze Brief - Coming Soon</div>} />
                  <Route path=":briefId" element={<div>Brief Details - Coming Soon</div>} />
                </Route>

                {/* Performance Routes */}
                <Route path="/performance">
                  <Route index element={<div>Performance Dashboard - Coming Soon</div>} />
                  <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
                  <Route path="reports" element={<div>Reports - Coming Soon</div>} />
                </Route>

                {/* Rate Cards Routes */}
                <Route path="/rate-cards">
                  <Route index element={<div>Rate Cards - Coming Soon</div>} />
                  <Route path="builder" element={<div>Rate Card Builder - Coming Soon</div>} />
                </Route>

                {/* Contracts Routes */}
                <Route path="/contracts">
                  <Route index element={<div>Contracts List - Coming Soon</div>} />
                  <Route path="new" element={<div>New Contract - Coming Soon</div>} />
                  <Route path=":contractId" element={<div>Contract Details - Coming Soon</div>} />
                </Route>

                {/* Profile Routes */}
                <Route path="/profile">
                  <Route index element={<div>Profile - Coming Soon</div>} />
                  <Route path="settings" element={<div>Settings - Coming Soon</div>} />
                  <Route path="subscription" element={<div>Subscription - Coming Soon</div>} />
                  <Route path="team" element={<div>Team Management - Coming Soon</div>} />
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
};

// Add global keyframes for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;
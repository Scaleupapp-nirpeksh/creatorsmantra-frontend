/**
 * Main App Component - Integrated with Deals, Scripts, and Rate Cards Modules
 * Path: src/App.jsx
 * This integrates all modules including the new Rate Card management system
 * with proper routing, and store initialization.
 */

// Dependencies
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Suspense } from 'react'

// Store Hooks
import { useAuthStore, useUIStore } from './store'

// Layouts
import { AuthLayout, MainLayout } from './layouts'

// Pages
import {
  LandingPage,
  LoginPage,
  NotFound,
  OTPVerificationPage,
  RegisterPage,
  DemoPage,
  DashboardPage,
} from './pages'

// Components
import { PageLoader, ProtectedRoutesWrapper, RenderProfileOverview } from './components'

// Features
import {
  PublicRateCard,
  RenderDealsListing,
  RenderCreateDeal,
  RenderDealDetails,
  RenderInvoiceDashboard,
  RenderCreateInvoice,
  ConsolidatedInvoiceWizard,
  RenderInvoiceDetails,
  RenderEditInvoice,
  ScriptsPriorityDashboard,
  ScriptCreationWizard,
  ScriptAnalyticsPerformance,
  ScriptDetailsEditor,
  RateCardDashboard,
  CreateRateCard,
  RateCardAnalytics,
  EditRateCard,
  RateCardHistory,
  ContractsDashboard,
  ContractDetails,
  RenderInvoiceAnalytics,
  TaxSettings,
} from './features'

// Styles
import './styles/index.css'
import './styles/layouts.css'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { theme } = useUIStore()

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* -------------- Landing Page -------------- */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
            />

            {/*  -------------- Demo Route -------------- */}
            <Route path="/demo" element={<DemoPage />} />

            {/* -------------- Rate Card Route -------------- */}
            <Route
              path="/card/:publicId"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PublicRateCard />
                </Suspense>
              }
            />

            {/* -------------- Auth Routes -------------- */}
            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
              />
              <Route
                path="/verify-otp"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <OTPVerificationPage />
                }
              />
            </Route>

            {/* -------------- Protected Routes -------------- */}
            <Route element={<ProtectedRoutesWrapper />}>
              <Route element={<MainLayout />}>
                {/* Dashboard Page */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Deals Route */}
                <Route path="/deals">
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderDealsListing />{' '}
                      </Suspense>
                    }
                  />
                  <Route
                    path="create"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderCreateDeal />{' '}
                      </Suspense>
                    }
                  />
                  <Route
                    path=":dealId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderDealDetails />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Invoices Route */}
                <Route path="/invoices">
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderInvoiceDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="create"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderCreateInvoice />
                      </Suspense>
                    }
                  />
                  <Route
                    path="create-consolidated"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ConsolidatedInvoiceWizard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderInvoiceAnalytics />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":invoiceId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderInvoiceDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":invoiceId/edit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RenderEditInvoice />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Scripts Routes */}
                <Route path="/scripts">
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScriptsPriorityDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="create"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScriptCreationWizard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScriptAnalyticsPerformance />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":scriptId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScriptDetailsEditor />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":scriptId/edit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScriptDetailsEditor editMode={true} />
                      </Suspense>
                    }
                  />
                </Route>

                {/* RateCard Routes*/}
                <Route path="/dashboard/rate-cards">
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RateCardDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="create"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <CreateRateCard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="new"
                    element={<Navigate to="/dashboard/rate-cards/create" replace />}
                  />
                  <Route
                    path="builder"
                    element={<Navigate to="/dashboard/rate-cards/create" replace />}
                  />
                  <Route
                    path="analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RateCardAnalytics />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":rateCardId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <EditRateCard />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":rateCardId/edit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <EditRateCard />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":rateCardId/history"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RateCardHistory />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":rateCardId/analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RateCardAnalytics />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Contract Routes */}
                <Route path="/contracts">
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ContractsDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":contractId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ContractDetails />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Profile Route */}
                <Route path="/profile">
                  <Route
                    index
                    element={
                      <div style={styles.comingSoon}>
                        <RenderProfileOverview />
                      </div>
                    }
                  />
                  {/* <Route
                    path="settings"
                    element={
                      <div style={styles.comingSoon}>
                        <h2>Settings</h2>
                        <p>Coming Soon</p>
                      </div>
                    }
                  />
                  <Route
                    path="subscription"
                    element={
                      <div style={styles.comingSoon}>
                        <h2>Subscription</h2>
                        <p>Coming Soon</p>
                      </div>
                    }
                  />
                  <Route
                    path="team"
                    element={
                      <div style={styles.comingSoon}>
                        <h2>Team Management</h2>
                        <p>Coming Soon</p>
                      </div>
                    }
                  /> */}
                </Route>

                {/* Settings Routes */}
                {/* <Route path="/settings">
                  <Route
                    index
                    element={
                      <div style={styles.comingSoon}>
                        <h2>Settings</h2>
                        <p>Coming Soon</p>
                      </div>
                    }
                  />
                  <Route
                    path="tax-preferences"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <TaxSettings />
                      </Suspense>
                    }
                  />
                  <Route
                    path="subscription"
                    element={
                      <div style={styles.comingSoon}>
                        <h2>Subscription</h2>
                        <p>Coming Soon</p>
                      </div>
                    }
                  />
                </Route> */}
              </Route>
            </Route>

            {/* -------------- Profile Routes -------------- */}
            <Route
              path="/profile/subscription"
              element={
                <div style={styles.comingSoon}>
                  <h2>Subscription</h2>
                  <p>Coming Soon</p>
                </div>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
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
  )
}

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
}

export default App

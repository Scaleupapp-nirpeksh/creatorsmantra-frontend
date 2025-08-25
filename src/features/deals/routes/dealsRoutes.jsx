    /**
     * Deals Routes Configuration
     * Path: src/features/deals/routes/dealsRoutes.jsx
     * 
     * Defines all routes for the deals module.
     * These routes will be imported into the main App.jsx router.
     * 
     * Routes:
     * - /deals - List all deals (pipeline/table view)
     * - /deals/create - Create new deal
     * - /deals/:dealId - View deal details
     * - /deals/:dealId/edit - Edit deal (redirects to details with edit mode)
     */

    import React, { lazy, Suspense } from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import ProtectedRoute from '../../../routes/ProtectedRoute';

    // Lazy load deal pages for code splitting
    const DealsListPage = lazy(() => import('../pages/DealsListPage'));
    const CreateDealPage = lazy(() => import('../pages/CreateDealPage'));
    const DealDetailsPage = lazy(() => import('../pages/DealDetailsPage'));

    // Loading component
    const DealsLoading = () => {
    const styles = {
        container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: '1rem',
        color: '#64748b'
        },
        spinner: {
        width: '24px',
        height: '24px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '0.75rem'
        }
    };

    return (
        <div style={styles.container}>
        <div style={styles.spinner}></div>
        Loading deals...
        <style>{`
            @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
            }
        `}</style>
        </div>
    );
    };

    // Deals routes component
    const DealsRoutes = () => {
    return (
        <Suspense fallback={<DealsLoading />}>
        <Routes>
            {/* Deals List - Pipeline/Table View */}
            <Route
            path="/"
            element={
                <ProtectedRoute>
                <DealsListPage />
                </ProtectedRoute>
            }
            />
            
            {/* Create New Deal */}
            <Route
            path="/create"
            element={
                <ProtectedRoute>
                <CreateDealPage />
                </ProtectedRoute>
            }
            />
            
            {/* Deal Details */}
            <Route
            path="/:dealId"
            element={
                <ProtectedRoute>
                <DealDetailsPage />
                </ProtectedRoute>
            }
            />
            
            {/* Edit Deal - Redirects to details with edit mode */}
            <Route
            path="/:dealId/edit"
            element={
                <ProtectedRoute>
                <DealDetailsPage editMode={true} />
                </ProtectedRoute>
            }
            />
            
            {/* Catch all - redirect to deals list */}
            <Route path="*" element={<Navigate to="/deals" replace />} />
        </Routes>
        </Suspense>
    );
    };

    export default DealsRoutes;

    /**
     * Usage in App.jsx:
     * 
     * import DealsRoutes from './features/deals/routes/dealsRoutes';
     * 
     * <Routes>
     *   <Route path="/deals/*" element={<DealsRoutes />} />
     *   ...other routes
     * </Routes>
     */
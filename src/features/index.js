import { lazy } from 'react'

// Deals
export const RenderDealsListing = lazy(() => import('./deals/pages/DealsListPage'))
export const RenderCreateDeal = lazy(() => import('./deals/pages/CreateDealPage'))
export const RenderDealDetails = lazy(() => import('./deals/pages/DealDetailsPage'))

// Invoices
export const RenderInvoiceDashboard = lazy(() => import('./invoices/pages/InvoiceDashboard'))
export const RenderCreateInvoice = lazy(() => import('./invoices/pages/CreateInvoice'))
export const ConsolidatedInvoiceWizard = lazy(
  () => import('./invoices/pages/ConsolidatedInvoiceWizard')
)
export const RenderInvoiceDetails = lazy(() => import('./invoices/pages/InvoiceDetails'))
export const RenderEditInvoice = lazy(() => import('./invoices/pages/EditInvoice'))
export const RenderInvoiceAnalytics = lazy(() => import('./invoices/pages/InvoiceAnalytics'))
export const TaxSettings = lazy(() => import('./invoices/pages/TaxSettings'))

// Scripts
export const ScriptsPriorityDashboard = lazy(
  () => import('./scripts/pages/ScriptsPriorityDashboard')
)
export const ScriptCreationWizard = lazy(() => import('./scripts/pages/ScriptCreationWizard'))
export const ScriptAnalyticsPerformance = lazy(
  () => import('./scripts/pages/ScriptAnalyticsPerformance')
)
export const ScriptDetailsEditor = lazy(() => import('./scripts/pages/ScriptsPriorityDashboard'))

// RateCards
export const RateCardDashboard = lazy(() => import('./rateCard/pages/RateCardDashboard'))
export const CreateRateCard = lazy(() => import('./rateCard/pages/CreateRateCard'))
export const RateCardAnalytics = lazy(() => import('./rateCard/pages/RateCardAnalytics'))
export const EditRateCard = lazy(() => import('./rateCard/pages/EditRateCard'))
export const RateCardHistory = lazy(() => import('./rateCard/pages/RateCardHistory'))
// Public Rate Card
export const PublicRateCard = lazy(() => import('./rateCard/pages/PublicRateCard'))

// Contract
export const ContractsDashboard = lazy(() => import('./contracts/pages/ContractsDashboard'))
export const ContractDetails = lazy(() => import('./contracts/pages/ContractDetails'))

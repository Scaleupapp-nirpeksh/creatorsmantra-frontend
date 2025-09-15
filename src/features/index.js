import { lazy } from 'react'

// Rate Cards
export const PublicRateCard = lazy(() => import('./rateCard/pages/PublicRateCard'))

// Deals
export const RenderDealsListing = lazy(() => import('./deals/pages/DealsListPage'))
export const RenderCreateDeal = lazy(() => import('./deals/pages/CreateDealPage'))
export const RenderDealDetails = lazy(() => import('./deals/pages/DealDetailsPage'))

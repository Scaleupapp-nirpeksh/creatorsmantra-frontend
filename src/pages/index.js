import { lazy } from 'react'

// Generic Pages
export { default as LandingPage } from './LandingPage'
export { default as NotFound } from './NotFound'
export { default as DemoPage } from './DemoPage'

// Auth Pages
export { default as LoginPage } from './auth/LoginPage'
export { default as OTPVerificationPage } from './auth/OTPVerificationPage'
export { default as RegisterPage } from './auth/RegisterPage'

// Protected Routes Pages
export { default as DashboardPage } from './DashboardPage'
// export const DashboardPage = lazy(() => import('./DashboardPage'))

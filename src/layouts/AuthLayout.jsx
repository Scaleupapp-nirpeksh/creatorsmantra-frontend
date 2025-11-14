/**
 * Auth Layout Component
 *
 * This layout wraps all authentication pages and provides:
 * - Centered form container
 * - Brand gradient background
 * - Feature highlights
 * - Responsive design
 * - Theme support
 *
 * File: src/layouts/AuthLayout.jsx
 */

// Dependencies
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import '../styles/authLayout.css'

const AuthLayout = () => {
  // Hooks
  const location = useLocation()

  // Check if we're on landing page
  const isLandingPage = location.pathname === '/'

  return (
    <div className="auth-layout">
      {/* Background Pattern */}
      <div className="bg-pattern">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`gradient-orb gradient-orb-${i}`} />
        ))}
      </div>

      {/* Header */}
      <header className="auth-header">
        <div className="header-container" style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Logo */}
          <Link to="/" className="logo-link">
            <div className="logo">
              <div className="logo-icon">
                <span className="logo-letter">C</span>
              </div>
              <span className="logo-text">CreatorsMantra</span>
            </div>
          </Link>

          {/* Navigation */}
          {!isLandingPage && (
            <nav className="auth-nav">
              <Link to="/" className="nav-link">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className={`auth-content animate-in`} style={{ maxWidth: '600px', width: '100%' }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-container" style={{ maxWidth: '1200px', width: '100%' }}>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-divider">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="footer-divider">•</span>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-copyright">© 2024 CreatorsMantra. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout

/**
 * Main Layout Component
 * 
 * This layout wraps all authenticated pages and provides:
 * - Sidebar navigation
 * - Top header with user menu
 * - Main content area
 * - Responsive mobile menu
 * - Global loading states
 * - Breadcrumbs
 * 
 * File: src/layouts/MainLayout.jsx
 */

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore, useDataStore } from '@/store';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Home,
  FileText,
  DollarSign,
  BarChart3,
  Briefcase,
  TrendingUp,
  FileSignature,
  CreditCard,
  Users,
  ChevronRight,
  Sun,
  Moon,
  Loader2,
  Package,
  Zap,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// Navigation Configuration
// ============================================
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    badge: null
  },
  {
    id: 'deals',
    label: 'Deals',
    icon: Briefcase,
    path: '/deals',
    badge: 'new',
    subItems: [
      { id: 'deals-list', label: 'All Deals', path: '/deals' },
      { id: 'deals-pipeline', label: 'Pipeline', path: '/deals/pipeline' },
      { id: 'deals-create', label: 'Create Deal', path: '/deals/create' }
    ]
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: FileText,
    path: '/invoices',
    requiredSubscription: ['starter', 'pro', 'elite', 'agency_starter', 'agency_pro']
  },
  {
    id: 'briefs',
    label: 'Briefs',
    icon: FileSignature,
    path: '/briefs',
    requiredSubscription: ['pro', 'elite', 'agency_starter', 'agency_pro'],
    badge: 'pro'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    requiredSubscription: ['pro', 'elite', 'agency_starter', 'agency_pro'],
    badge: 'pro',
    subItems: [
      { id: 'analytics-dashboard', label: 'Dashboard', path: '/analytics' },
      { id: 'analytics-revenue', label: 'Revenue', path: '/analytics/revenue' },
      { id: 'analytics-performance', label: 'Performance', path: '/analytics/performance' }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    path: '/performance',
    requiredSubscription: ['pro', 'elite', 'agency_starter', 'agency_pro']
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: Shield,
    path: '/contracts'
  },
  {
    id: 'ratecards',
    label: 'Rate Cards',
    icon: CreditCard,
    path: '/ratecards'
  }
];

const bottomNavigationItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    path: '/help'
  }
];

// ============================================
// Sidebar Component
// ============================================
const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, subscription, hasSubscription } = useAuthStore();
  const { sidebar, toggleMenuExpansion } = useUIStore();
  const [expandedItems, setExpandedItems] = useState([]);

  const isItemActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavClick = (item) => {
    if (item.subItems) {
      const isExpanded = expandedItems.includes(item.id);
      setExpandedItems(
        isExpanded 
          ? expandedItems.filter(id => id !== item.id)
          : [...expandedItems, item.id]
      );
    } else {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    }
  };

  const canAccessItem = (item) => {
    if (!item.requiredSubscription) return true;
    return hasSubscription(item.requiredSubscription);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${isMobile ? 'sidebar-mobile' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="logo-icon">
            <span className="logo-letter">C</span>
          </div>
          <span className="logo-text">CreatorsMantra</span>
        </Link>
        {isMobile && (
          <button onClick={onClose} className="sidebar-close">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);
            const isExpanded = expandedItems.includes(item.id);
            const canAccess = canAccessItem(item);

            return (
              <div key={item.id} className="nav-item-wrapper">
                <button
                  className={`nav-item ${isActive ? 'nav-item-active' : ''} ${!canAccess ? 'nav-item-locked' : ''}`}
                  onClick={() => canAccess && handleNavClick(item)}
                  disabled={!canAccess}
                >
                  <Icon size={20} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge nav-badge-${item.badge}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.subItems && (
                    <ChevronRight 
                      size={16} 
                      className={`nav-chevron ${isExpanded ? 'nav-chevron-expanded' : ''}`} 
                    />
                  )}
                  {!canAccess && <Shield size={14} className="nav-lock" />}
                </button>
                
                {item.subItems && isExpanded && canAccess && (
                  <div className="nav-subitems">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.path}
                        className={`nav-subitem ${location.pathname === subItem.path ? 'nav-subitem-active' : ''}`}
                        onClick={() => isMobile && onClose()}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="nav-section nav-section-bottom">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => isMobile && onClose()}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.profile?.avatar ? (
              <img src={user.profile.avatar} alt={user.name} />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-tier">
              {subscription?.tier ? (
                <span className={`tier-badge tier-${subscription.tier}`}>
                  {subscription.tier}
                </span>
              ) : (
                <span className="tier-badge tier-free">Free</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 280px;
          background: white;
          border-right: 1px solid var(--color-neutral-200);
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform var(--duration-200) var(--ease-out);
          z-index: var(--z-modal);
        }

        .sidebar-open {
          transform: translateX(0);
        }

        .sidebar-mobile {
          box-shadow: var(--shadow-xl);
        }

        .sidebar-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-neutral-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--color-neutral-900);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-letter {
          color: white;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }

        .logo-text {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }

        .sidebar-close {
          background: none;
          border: none;
          color: var(--color-neutral-600);
          cursor: pointer;
          padding: var(--space-2);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
        }

        .nav-section {
          margin-bottom: var(--space-6);
        }

        .nav-section-bottom {
          margin-top: auto;
          margin-bottom: 0;
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-neutral-200);
        }

        .nav-item-wrapper {
          margin-bottom: var(--space-1);
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: none;
          border: none;
          border-radius: var(--radius-lg);
          color: var(--color-neutral-700);
          text-decoration: none;
          cursor: pointer;
          transition: all var(--duration-150) var(--ease-out);
          position: relative;
        }

        .nav-item:hover {
          background: var(--color-neutral-100);
          color: var(--color-neutral-900);
        }

        .nav-item-active {
          background: var(--color-primary-100);
          color: var(--color-primary-700);
        }

        .nav-item-locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-icon {
          flex-shrink: 0;
        }

        .nav-label {
          flex: 1;
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .nav-badge {
          padding: var(--space-0-5) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          text-transform: uppercase;
        }

        .nav-badge-new {
          background: var(--color-success-light);
          color: var(--color-success-dark);
        }

        .nav-badge-pro {
          background: var(--gradient-primary);
          color: white;
        }

        .nav-chevron {
          transition: transform var(--duration-150) var(--ease-out);
        }

        .nav-chevron-expanded {
          transform: rotate(90deg);
        }

        .nav-lock {
          color: var(--color-warning);
        }

        .nav-subitems {
          margin-left: var(--space-8);
          margin-top: var(--space-1);
        }

        .nav-subitem {
          display: block;
          padding: var(--space-2) var(--space-4);
          color: var(--color-neutral-600);
          text-decoration: none;
          font-size: var(--text-sm);
          border-radius: var(--radius-md);
          transition: all var(--duration-150) var(--ease-out);
        }

        .nav-subitem:hover {
          background: var(--color-neutral-100);
          color: var(--color-neutral-900);
        }

        .nav-subitem-active {
          color: var(--color-primary-600);
          font-weight: var(--font-medium);
        }

        .sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid var(--color-neutral-200);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--color-neutral-50);
          border-radius: var(--radius-lg);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-neutral-900);
        }

        .tier-badge {
          display: inline-block;
          padding: var(--space-0-5) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          text-transform: uppercase;
          margin-top: var(--space-1);
        }

        .tier-free {
          background: var(--color-neutral-200);
          color: var(--color-neutral-700);
        }

        .tier-starter {
          background: var(--color-info-light);
          color: var(--color-info-dark);
        }

        .tier-pro {
          background: var(--gradient-purple);
          color: white;
        }

        .tier-elite {
          background: var(--gradient-primary);
          color: white;
        }

        @media (min-width: 1024px) {
          .sidebar {
            position: relative;
            transform: translateX(0);
          }

          .sidebar-close {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

// ============================================
// Header Component
// ============================================
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, openModal } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        
        <button className="search-button" onClick={() => openModal('search')}>
          <Search size={20} />
          <span>Search...</span>
        </button>
      </div>

      <div className="header-right">
        <button className="header-icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="header-icon notification-button" onClick={() => openModal('notifications')}>
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu-wrapper">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar-small">
              {user?.profile?.avatar ? (
                <img src={user.profile.avatar} alt={user.name} />
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="user-name-header">{user?.name || 'User'}</span>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <Link to="/settings/profile" className="dropdown-item">
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <Link to="/settings/subscription" className="dropdown-item">
                <Zap size={16} />
                <span>Subscription</span>
              </Link>
              <div className="dropdown-divider" />
              <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 64px;
          background: white;
          border-bottom: 1px solid var(--color-neutral-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          position: sticky;
          top: 0;
          z-index: var(--z-dropdown);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .menu-toggle {
          background: none;
          border: none;
          color: var(--color-neutral-700);
          cursor: pointer;
          padding: var(--space-2);
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--color-neutral-100);
          border: 1px solid var(--color-neutral-200);
          border-radius: var(--radius-lg);
          color: var(--color-neutral-500);
          cursor: pointer;
          min-width: 200px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .header-icon {
          background: none;
          border: none;
          color: var(--color-neutral-700);
          cursor: pointer;
          padding: var(--space-2);
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--color-error);
          color: white;
          font-size: var(--text-xs);
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2);
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-lg);
          transition: background var(--duration-150) var(--ease-out);
        }

        .user-menu-trigger:hover {
          background: var(--color-neutral-100);
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .user-avatar-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-name-header {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-neutral-900);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: var(--space-2);
          background: white;
          border: 1px solid var(--color-neutral-200);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          padding: var(--space-2);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--color-neutral-700);
          text-decoration: none;
          cursor: pointer;
          width: 100%;
          transition: background var(--duration-150) var(--ease-out);
        }

        .dropdown-item:hover {
          background: var(--color-neutral-100);
        }

        .dropdown-item-danger {
          color: var(--color-error);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--color-neutral-200);
          margin: var(--space-2) 0;
        }

        @media (min-width: 1024px) {
          .menu-toggle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

// ============================================
// Main Layout Component
// ============================================
const MainLayout = () => {
  const location = useLocation();
  const { viewport } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(!viewport.isMobile);
  const { loading } = useUIStore((state) => state.loading);

  useEffect(() => {
    // Close mobile sidebar on route change
    if (viewport.isMobile) {
      setSidebarOpen(false);
    }
  }, [location, viewport.isMobile]);

  useEffect(() => {
    // Update sidebar state based on viewport
    setSidebarOpen(!viewport.isMobile);
  }, [viewport.isMobile]);

  return (
    <div className="main-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        isMobile={viewport.isMobile}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`main-content ${sidebarOpen && !viewport.isMobile ? 'main-content-shifted' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="page-content">
          {loading.page && (
            <div className="page-loading">
              <Loader2 size={32} className="loading-spinner" />
            </div>
          )}
          <Outlet />
        </main>
      </div>

      {viewport.isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <style jsx>{`
        .main-layout {
          min-height: 100vh;
          background: var(--color-neutral-50);
        }

        .main-content {
          transition: margin-left var(--duration-200) var(--ease-out);
        }

        .main-content-shifted {
          margin-left: 280px;
        }

        .page-content {
          padding: var(--space-6);
          min-height: calc(100vh - 64px);
          position: relative;
        }

        .page-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--color-primary-500);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: calc(var(--z-modal) - 1);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1023px) {
          .main-content-shifted {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
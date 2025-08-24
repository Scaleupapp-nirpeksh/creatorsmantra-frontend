// src/layouts/MainLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Briefcase,
  FileText,
  BarChart3,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  HelpCircle,
  User,
  Package,
  TrendingUp,
  Star,
  Zap,
  Shield,
  Award,
  Target,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useAuthStore, useUIStore, useDataStore } from '../store';
import toast from 'react-hot-toast';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth Store
  const { user, subscription, logout } = useAuthStore();
  
  // UI Store - Fixed to handle loading state properly
  const { 
    sidebar,
    toggleSidebar,
    collapseSidebar,
    setActiveMenuItem,
    toggleMenuExpansion,
    viewport,
    theme,
    toggleTheme,
    openModal,
    setPageTitle,
    loading: loadingState = { global: false, page: false, action: false, submit: false }
  } = useUIStore();
  
  // Data Store
  const { refreshAllData } = useDataStore();
  
  // Local state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safely access loading states with fallback
  const isPageLoading = loadingState?.page || false;
  const isGlobalLoading = loadingState?.global || false;
  
  // Menu items configuration
  const menuItems = [
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
      badge: { count: 3, type: 'primary' },
      subItems: [
        { id: 'deals-list', label: 'All Deals', path: '/deals' },
        { id: 'deals-pipeline', label: 'Pipeline', path: '/deals/pipeline' },
        { id: 'deals-new', label: 'New Deal', path: '/deals/new' }
      ]
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
      path: '/invoices',
      badge: { count: 2, type: 'warning' },
      subItems: [
        { id: 'invoices-list', label: 'All Invoices', path: '/invoices' },
        { id: 'invoices-pending', label: 'Pending', path: '/invoices/pending' },
        { id: 'invoices-new', label: 'Create Invoice', path: '/invoices/new' }
      ]
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      path: '/performance',
      badge: null,
      subItems: [
        { id: 'performance-overview', label: 'Overview', path: '/performance' },
        { id: 'performance-analytics', label: 'Analytics', path: '/performance/analytics' },
        { id: 'performance-reports', label: 'Reports', path: '/performance/reports' }
      ]
    },
    {
      id: 'briefs',
      label: 'Briefs',
      icon: Sparkles,
      path: '/briefs',
      badge: { count: 1, type: 'success' },
      premium: true
    },
    {
      id: 'rate-cards',
      label: 'Rate Cards',
      icon: CreditCard,
      path: '/rate-cards',
      premium: true
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: Shield,
      path: '/contracts',
      premium: true
    }
  ];
  
  // Bottom menu items
  const bottomMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile'
    },
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
  
  // Update active menu item based on current path
  useEffect(() => {
    const path = location.pathname;
    const activeItem = menuItems.find(item => 
      path.startsWith(item.path)
    )?.id || 'dashboard';
    
    setActiveMenuItem(activeItem);
    
    // Update page title based on active item
    const item = menuItems.find(item => item.id === activeItem);
    if (item) {
      setPageTitle(item.label);
    }
  }, [location.pathname, setActiveMenuItem, setPageTitle]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Check if feature is premium and locked
  const isFeatureLocked = (item) => {
    return item.premium && (!subscription || subscription.tier === 'starter');
  };
  
  // Render menu item
  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = sidebar.activeItem === item.id;
    const isExpanded = sidebar.expandedItems?.includes(item.id);
    const isLocked = isFeatureLocked(item);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    return (
      <div key={item.id} style={styles.menuItemContainer}>
        <div
          onClick={() => {
            if (isLocked) {
              openModal('upgradePlan');
              return;
            }
            
            if (hasSubItems) {
              toggleMenuExpansion(item.id);
            } else {
              navigate(item.path);
            }
          }}
          style={{
            ...styles.menuItem,
            ...(isActive ? styles.menuItemActive : {}),
            ...(isLocked ? styles.menuItemLocked : {})
          }}
        >
          <div style={styles.menuItemContent}>
            <Icon size={20} />
            {!sidebar.isCollapsed && (
              <>
                <span style={styles.menuItemLabel}>{item.label}</span>
                {item.premium && (
                  <Zap size={14} color="var(--color-warning)" />
                )}
                {item.badge && !sidebar.isCollapsed && (
                  <span style={{
                    ...styles.badge,
                    ...(item.badge.type === 'primary' ? styles.badgePrimary :
                        item.badge.type === 'warning' ? styles.badgeWarning :
                        styles.badgeSuccess)
                  }}>
                    {item.badge.count}
                  </span>
                )}
                {hasSubItems && (
                  <ChevronRight 
                    size={16} 
                    style={{
                      ...styles.chevron,
                      transform: isExpanded ? 'rotate(90deg)' : 'none'
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Sub Items */}
        {hasSubItems && isExpanded && !sidebar.isCollapsed && (
          <div style={styles.subItemsContainer}>
            {item.subItems.map(subItem => (
              <Link
                key={subItem.id}
                to={subItem.path}
                style={{
                  ...styles.subItem,
                  ...(location.pathname === subItem.path ? styles.subItemActive : {})
                }}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-background)',
    },
    
    // Sidebar Styles
    sidebar: {
      width: sidebar.isCollapsed ? '80px' : '260px',
      background: 'white',
      borderRight: '1px solid var(--color-neutral-200)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: viewport.isMobile ? 'fixed' : 'relative',
      height: viewport.isMobile ? '100vh' : 'auto',
      zIndex: viewport.isMobile ? 100 : 1,
      transform: viewport.isMobile ? 
        (sidebar.isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 
        'none',
    },
    
    sidebarHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid var(--color-neutral-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebar.isCollapsed ? 'center' : 'space-between',
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      textDecoration: 'none',
    },
    
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    
    logoText: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
      display: sidebar.isCollapsed ? 'none' : 'block',
    },
    
    collapseButton: {
      padding: '0.5rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-neutral-600)',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      display: viewport.isMobile ? 'none' : 'flex',
    },
    
    sidebarContent: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto',
    },
    
    menuSection: {
      marginBottom: '2rem',
    },
    
    menuItemContainer: {
      marginBottom: '0.25rem',
    },
    
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: sidebar.isCollapsed ? '0.75rem' : '0.75rem 1rem',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: 'var(--color-neutral-700)',
      textDecoration: 'none',
      justifyContent: sidebar.isCollapsed ? 'center' : 'flex-start',
    },
    
    menuItemActive: {
      background: 'rgba(102, 126, 234, 0.1)',
      color: 'var(--color-primary-600)',
      fontWeight: '600',
    },
    
    menuItemLocked: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    
    menuItemContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
    },
    
    menuItemLabel: {
      flex: 1,
      fontSize: '0.875rem',
    },
    
    badge: {
      padding: '0.125rem 0.5rem',
      borderRadius: '10px',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    
    badgePrimary: {
      background: 'var(--color-primary-100)',
      color: 'var(--color-primary-700)',
    },
    
    badgeWarning: {
      background: 'var(--color-warning-100)',
      color: 'var(--color-warning-700)',
    },
    
    badgeSuccess: {
      background: 'var(--color-success-100)',
      color: 'var(--color-success-700)',
    },
    
    chevron: {
      transition: 'transform 0.2s ease',
    },
    
    subItemsContainer: {
      marginLeft: sidebar.isCollapsed ? '0' : '2.5rem',
      marginTop: '0.25rem',
    },
    
    subItem: {
      display: 'block',
      padding: '0.5rem 1rem',
      fontSize: '0.813rem',
      color: 'var(--color-neutral-600)',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      marginBottom: '0.125rem',
    },
    
    subItemActive: {
      background: 'rgba(102, 126, 234, 0.05)',
      color: 'var(--color-primary-600)',
      fontWeight: '500',
    },
    
    sidebarFooter: {
      padding: '1rem',
      borderTop: '1px solid var(--color-neutral-200)',
    },
    
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      justifyContent: sidebar.isCollapsed ? 'center' : 'flex-start',
    },
    
    userAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.875rem',
    },
    
    userInfo: {
      flex: 1,
      display: sidebar.isCollapsed ? 'none' : 'block',
    },
    
    userName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.125rem',
    },
    
    userRole: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-600)',
    },
    
    // Main Content Styles
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-background)',
      minHeight: '100vh',
    },
    
    // Header Styles
    header: {
      background: 'white',
      borderBottom: '1px solid var(--color-neutral-200)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    
    mobileMenuButton: {
      padding: '0.5rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-neutral-700)',
      display: viewport.isMobile ? 'flex' : 'none',
    },
    
    searchBar: {
      flex: 1,
      maxWidth: '500px',
      position: 'relative',
    },
    
    searchInput: {
      width: '100%',
      padding: '0.625rem 1rem',
      paddingLeft: '2.5rem',
      border: '1px solid var(--color-neutral-200)',
      borderRadius: '10px',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--color-neutral-400)',
    },
    
    headerActions: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    
    iconButton: {
      padding: '0.625rem',
      background: 'transparent',
      border: '1px solid var(--color-neutral-200)',
      borderRadius: '10px',
      cursor: 'pointer',
      color: 'var(--color-neutral-700)',
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    
    notificationBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '18px',
      height: '18px',
      background: 'var(--color-error)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.625rem',
      fontWeight: '600',
    },
    
    // Content Area
    content: {
      flex: 1,
      padding: '2rem',
      overflowY: 'auto',
      position: 'relative',
    },
    
    // Loading Overlay
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid var(--color-neutral-200)',
      borderTopColor: 'var(--color-primary-500)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    // Mobile overlay
    mobileOverlay: {
      display: viewport.isMobile && sidebar.isMobileOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99,
    },
  };
  
  return (
    <div style={styles.container}>
      {/* Mobile Overlay */}
      <div 
        style={styles.mobileOverlay}
        onClick={() => toggleSidebar()}
      />
      
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Link to="/dashboard" style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            <span style={styles.logoText}>CreatorsMantra</span>
          </Link>
          {!sidebar.isCollapsed && (
            <button
              onClick={() => collapseSidebar()}
              style={styles.collapseButton}
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        
        <div style={styles.sidebarContent}>
          <div style={styles.menuSection}>
            {menuItems.map(renderMenuItem)}
          </div>
          
          <div style={styles.menuSection}>
            {bottomMenuItems.map(renderMenuItem)}
          </div>
        </div>
        
        <div style={styles.sidebarFooter}>
          <div 
            style={styles.userProfile}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={styles.userAvatar}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>
                {user?.fullName || 'User'}
              </div>
              <div style={styles.userRole}>
                {subscription?.tier || 'Starter'} Plan
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          {!sidebar.isCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                ...styles.menuItem,
                marginTop: '0.5rem',
                color: 'var(--color-error)',
              }}
            >
              <LogOut size={20} />
              <span style={styles.menuItemLabel}>Logout</span>
            </button>
          )}
        </div>
      </aside>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          {viewport.isMobile && (
            <button
              onClick={() => toggleSidebar()}
              style={styles.mobileMenuButton}
            >
              <Menu size={24} />
            </button>
          )}
          
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search deals, invoices, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </form>
          
          <div style={styles.headerActions}>
            <button
              onClick={() => toggleTheme()}
              style={styles.iconButton}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={styles.iconButton}
            >
              <Bell size={20} />
              <span style={styles.notificationBadge}>3</span>
            </button>
            
            <button
              onClick={() => refreshAllData()}
              style={styles.iconButton}
            >
              <TrendingUp size={20} />
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <main style={styles.content}>
          {/* Loading Overlay */}
          {isPageLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loadingSpinner} />
            </div>
          )}
          
          {/* Page Content */}
          <Outlet />
        </main>
      </div>
      
      {/* Add keyframes for spinner */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
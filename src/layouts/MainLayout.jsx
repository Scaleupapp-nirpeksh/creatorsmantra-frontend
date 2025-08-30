/**
 * Main Layout Component - Complete with Deals, Invoice & Scripts Modules
 * Path: src/layouts/MainLayout.jsx
 */

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
  ChevronLeft,
  Plus,
  Kanban,
  List,
  Receipt,
  Calculator,
  IndianRupee,
  FileSpreadsheet,
  PieChart,
  Brain,
  MessageSquare
} from 'lucide-react';
import { useAuthStore, useUIStore, useDataStore } from '../store';
import useDealsStore from '../store/dealsStore';
import useInvoiceStore from '../store/invoiceStore';
import useScriptsStore from '../store/scriptsStore';
import toast from 'react-hot-toast';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, subscription, logout } = useAuthStore();
  
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
  
  const { refreshAllData } = useDataStore();
  const { deals } = useDealsStore();
  const { invoices, dashboard } = useInvoiceStore();
  const { scripts = [] } = useScriptsStore();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isPageLoading = loadingState?.page || false;
  const isGlobalLoading = loadingState?.global || false;
  
  const activeDealsCount = deals.filter(deal => 
    ['lead', 'negotiation', 'confirmed', 'content_creation'].includes(deal.stage)
  ).length;
  
  const pendingInvoicesCount = invoices.filter(invoice => 
    ['sent', 'viewed', 'partially_paid'].includes(invoice.status)
  ).length;
  
  const overdueInvoicesCount = dashboard?.overdueInvoices || 0;

  // Calculate scripts count needing attention
  const scriptsNeedingAttentionCount = scripts.filter(script => 
    script.aiGeneration?.status === 'failed' || script.status === 'draft'
  ).length;

  // Total notification count (removing briefs references)
  const totalNotificationCount = overdueInvoicesCount + scriptsNeedingAttentionCount;
  
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
      badge: activeDealsCount > 0 ? { count: activeDealsCount, type: 'primary' } : null,
      subItems: [
        { 
          id: 'deals-list', 
          label: 'Pipeline View',
          path: '/deals',
          icon: Kanban
        },
        { 
          id: 'deals-create',
          label: 'Create Deal',
          path: '/deals/create',
          icon: Plus
        }
      ]
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
      path: '/invoices',
      badge: overdueInvoicesCount > 0 ? 
        { count: overdueInvoicesCount, type: 'warning' } : 
        pendingInvoicesCount > 0 ? 
        { count: pendingInvoicesCount, type: 'primary' } : null,
      subItems: [
        { 
          id: 'invoices-list', 
          label: 'All Invoices', 
          path: '/invoices',
          icon: List
        },
        { 
          id: 'invoices-create', 
          label: 'Create Invoice', 
          path: '/invoices/create',
          icon: Plus
        },
        { 
          id: 'invoices-consolidated', 
          label: 'Consolidated Invoice', 
          path: '/invoices/create-consolidated',
          icon: FileSpreadsheet,
          premium: subscription?.tier === 'starter'
        },
        { 
          id: 'invoices-analytics', 
          label: 'Analytics', 
          path: '/invoices/analytics',
          icon: PieChart
        }
      ]
    },
    {
      id: 'scripts',
      label: 'Scripts',
      icon: MessageSquare,
      path: '/scripts',
      badge: scriptsNeedingAttentionCount > 0 ? { count: scriptsNeedingAttentionCount, type: 'primary' } : null,
      premium: true,
      subItems: [
        { 
          id: 'scripts-dashboard', 
          label: 'Dashboard', 
          path: '/scripts',
          icon: List
        },
        { 
          id: 'scripts-create', 
          label: 'Create Script', 
          path: '/scripts/create',
          icon: Plus
        },
        { 
          id: 'scripts-analytics', 
          label: 'Analytics', 
          path: '/scripts/analytics',
          icon: PieChart
        }
      ]
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      path: '/performance',
      badge: null,
      subItems: [
        { id: 'performance-overview', label: 'Overview', path: '/performance', icon: BarChart3 },
        { id: 'performance-analytics', label: 'Analytics', path: '/performance/analytics', icon: PieChart },
        { id: 'performance-reports', label: 'Reports', path: '/performance/reports', icon: FileText }
      ]
    },
    {
      id: 'rate-cards',
      label: 'Rate Cards',
      icon: CreditCard,
      path: '/rate-cards',
      premium: true,
      subItems: [
        { id: 'rate-cards-list', label: 'All Rate Cards', path: '/rate-cards', icon: List },
        { id: 'rate-cards-builder', label: 'Builder', path: '/rate-cards/builder', icon: Plus }
      ]
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: Shield,
      path: '/contracts',
      premium: true,
      subItems: [
        { id: 'contracts-list', label: 'All Contracts', path: '/contracts', icon: List },
        { id: 'contracts-new', label: 'New Contract', path: '/contracts/new', icon: Plus }
      ]
    }
  ];
  
  const bottomMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      subItems: [
        { id: 'profile-overview', label: 'Overview', path: '/profile', icon: User },
        { id: 'profile-settings', label: 'Settings', path: '/profile/settings', icon: Settings },
        { id: 'profile-subscription', label: 'Subscription', path: '/profile/subscription', icon: CreditCard },
        { id: 'profile-team', label: 'Team Management', path: '/profile/team', icon: Users }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      subItems: [
        { 
          id: 'settings-general', 
          label: 'General', 
          path: '/settings',
          icon: Settings
        },
        { 
          id: 'settings-tax', 
          label: 'Tax Preferences', 
          path: '/settings/tax-preferences',
          icon: Calculator
        },
        { 
          id: 'settings-subscription', 
          label: 'Subscription', 
          path: '/settings/subscription',
          icon: CreditCard
        }
      ]
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      path: '/help'
    }
  ];
  
  useEffect(() => {
    const path = location.pathname;
    let activeItem = 'dashboard';
    
    const allItems = [...menuItems, ...bottomMenuItems];
    // Find the active menu item based on current path
    const foundItem = allItems.find(item => {
      if (path === item.path) return true;
      if (item.path !== '/' && path.startsWith(item.path)) return true;
      return false;
    });
    
    if (foundItem) {
      activeItem = foundItem.id;
    }
    
    setActiveMenuItem(activeItem);
    
    // Set page title
    const item = allItems.find(i => i.id === activeItem);
    if (item) {
      setPageTitle(item.label);
    }
  }, [location.pathname, setActiveMenuItem, setPageTitle]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (location.pathname.startsWith('/deals')) {
        const dealsStore = useDealsStore.getState();
        dealsStore.searchDeals(searchQuery);
      } else if (location.pathname.startsWith('/invoices')) {
        const invoiceStore = useInvoiceStore.getState();
        invoiceStore.setFilters({ clientName: searchQuery });
      } else if (location.pathname.startsWith('/scripts')) {
        const scriptsStore = useScriptsStore.getState();
        scriptsStore.updateFilters({ search: searchQuery });
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
    }
  };
  
  const isFeatureLocked = (item) => {
    const userSubscription = subscription || {
      tier: user?.subscriptionTier,
      status: user?.subscriptionStatus,
      isActive: user?.subscriptionStatus === 'active'
    };
    
    return item.premium && (!userSubscription || userSubscription.tier === 'starter');
  };
  
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
            
            if (hasSubItems && !sidebar.isCollapsed) {
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
        
        {hasSubItems && isExpanded && !sidebar.isCollapsed && (
          <div style={styles.subItemsContainer}>
            {item.subItems.map(subItem => {
              const SubIcon = subItem.icon;
              const isSubItemLocked = isFeatureLocked(subItem);
              const isSubItemActive = location.pathname === subItem.path;
              
              return (
                <Link
                  key={subItem.id}
                  to={!isSubItemLocked ? subItem.path : '#'}
                  onClick={(e) => {
                    if (isSubItemLocked) {
                      e.preventDefault();
                      openModal('upgradePlan');
                    }
                  }}
                  style={{
                    ...styles.subItem,
                    ...(isSubItemActive ? styles.subItemActive : {}),
                    ...(isSubItemLocked ? styles.subItemLocked : {})
                  }}
                >
                  {SubIcon && <SubIcon size={14} style={{ marginRight: '0.5rem' }} />}
                  {subItem.label}
                  {subItem.premium && (
                    <Zap size={12} color="var(--color-warning)" style={{ marginLeft: 'auto' }} />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: 'var(--color-background)',
      overflow: 'hidden'
    },
    
    sidebar: {
      width: sidebar.isCollapsed ? '80px' : '260px',
      background: 'white',
      borderRight: '1px solid var(--color-neutral-200)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: viewport.isMobile ? 'fixed' : 'relative',
      height: '100vh',
      zIndex: viewport.isMobile ? 100 : 1,
      transform: viewport.isMobile ? 
        (sidebar.isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 
        'none',
      flexShrink: 0
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
      overflowX: 'hidden',
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
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    badge: {
      padding: '0.125rem 0.5rem',
      borderRadius: '10px',
      fontSize: '0.75rem',
      fontWeight: '600',
      minWidth: '20px',
      textAlign: 'center',
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
      marginLeft: 'auto',
    },
    
    subItemsContainer: {
      marginLeft: sidebar.isCollapsed ? '0' : '2.5rem',
      marginTop: '0.25rem',
      paddingLeft: '0.5rem',
      borderLeft: '2px solid var(--color-neutral-100)',
    },
    
    subItem: {
      display: 'flex',
      alignItems: 'center',
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
    
    subItemLocked: {
      opacity: 0.6,
      cursor: 'not-allowed',
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
      minWidth: 0,
    },
    
    userName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.125rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    userRole: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-600)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-background)',
      overflow: 'hidden',
      minWidth: 0,
    },
    
    header: {
      background: 'white',
      borderBottom: '1px solid var(--color-neutral-200)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      flexShrink: 0,
      minHeight: '70px',
    },
    
    mobileMenuButton: {
      padding: '0.5rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-neutral-700)',
      display: viewport.isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
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
      background: 'var(--color-neutral-50)',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    
    content: {
      flex: 1,
      overflow: 'auto',
      position: 'relative'
    },
    
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
    
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      marginTop: '0.5rem',
      background: 'transparent',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      color: 'var(--color-error)',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      justifyContent: sidebar.isCollapsed ? 'center' : 'flex-start',
    }
  };
  
  return (
    <div style={styles.container}>
      <div 
        style={styles.mobileOverlay}
        onClick={() => toggleSidebar()}
      />
      
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Link to="/dashboard" style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            {!sidebar.isCollapsed && (
              <span style={styles.logoText}>CreatorsMantra</span>
            )}
          </Link>
          
          <button
            onClick={() => collapseSidebar()}
            style={{
              ...styles.collapseButton,
              ...(sidebar.isCollapsed ? { margin: '0 auto' } : {})
            }}
          >
            {sidebar.isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
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
                {subscription?.tier ? 
                  `${subscription.tier.charAt(0).toUpperCase()}${subscription.tier.slice(1)} Plan` : 
                  'Starter Plan'}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            <LogOut size={20} />
            {!sidebar.isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      
      <div style={styles.mainContent}>
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
              placeholder="Search deals, invoices, scripts, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </form>
          
          <div style={styles.headerActions}>
            <button
              onClick={() => toggleTheme()}
              style={styles.iconButton}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={styles.iconButton}
              title="Notifications"
            >
              <Bell size={20} />
              {totalNotificationCount > 0 && (
                <span style={styles.notificationBadge}>
                  {totalNotificationCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => refreshAllData()}
              style={styles.iconButton}
              title="Refresh data"
            >
              <TrendingUp size={20} />
            </button>
          </div>
        </header>
        
        <main style={styles.content}>
          {isPageLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loadingSpinner} />
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .sidebar:hover .collapse-button {
          opacity: 1;
        }
        
        .menu-item:hover {
          background: rgba(102, 126, 234, 0.05);
        }
        
        .sub-item:hover:not(.sub-item-locked) {
          background: rgba(102, 126, 234, 0.05);
        }
        
        .icon-button:hover {
          background: var(--color-neutral-50);
          border-color: var(--color-neutral-300);
        }
        
        .search-input:focus {
          border-color: var(--color-primary-300);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .user-profile:hover {
          background: rgba(102, 126, 234, 0.05);
        }
        
        .logout-button:hover {
          background: rgba(239, 68, 68, 0.05);
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .search-bar {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
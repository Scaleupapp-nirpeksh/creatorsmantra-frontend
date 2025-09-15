/**
 * Main Layout Component - Complete with Deals, Invoice, Scripts, Rate Cards & Contracts Modules
 * Path: src/layouts/MainLayout.jsx
 */

// Dependencies
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
  Plus,
  Search,
  TrendingUp,
  Upload,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

// Store Hooks
import { useAuthStore, useContractsStore, useDataStore, useUIStore } from '../store'

// Cosntants
import { MainLayoutConstants } from '../utils/constants'

// Components
import { RenderMenuItems } from '../components'

// Styles
import '../styles/mainLayout.css'

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, subscription, logout } = useAuthStore()

  const {
    sidebar,
    toggleSidebar,
    collapseSidebar,
    setActiveMenuItem,
    viewport,
    setPageTitle,
    loading: loadingState = { global: false, page: false, action: false, submit: false },
  } = useUIStore()

  // Store Hooks
  const { refreshAllData } = useDataStore()
  const { analytics: contractsAnalytics, isUploading } = useContractsStore()

  // State Variables
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const path = location.pathname
    let activeItem = 'dashboard'

    const allItems = [...menuItems, ...bottomMenuItems]
    // Find the active menu item based on current path
    const foundItem = allItems.find((item) => {
      if (path === item.path || (item.path !== '/' && path.startsWith(item.path))) return true
      return false
    })

    if (foundItem) activeItem = foundItem.id
    setActiveMenuItem(activeItem)

    // Set page title
    const item = allItems.find((i) => i.id === activeItem)
    if (item) setPageTitle(item.label)
  }, [location.pathname, setActiveMenuItem, setPageTitle])

  // Handlers
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  // TODO: MOdify search handler
  const handleSearch = (e) => {
    e.preventDefault()
    toast.success('TODO: Search Functionality Coming Soon')
    // if (searchQuery.trim()) {
    //   if (location.pathname.startsWith('/deals')) {
    //     const dealsStore = useDealsStore.getState()
    //     dealsStore.searchDeals(searchQuery)
    //   } else if (location.pathname.startsWith('/invoices')) {
    //     const invoiceStore = useInvoiceStore.getState()
    //     invoiceStore.setFilters({ clientName: searchQuery })
    //   } else if (location.pathname.startsWith('/scripts')) {
    //     const scriptsStore = useScriptsStore.getState()
    //     scriptsStore.updateFilters({ search: searchQuery })
    //   } else if (location.pathname.includes('/rate-cards')) {
    //     const rateCardStore = useRateCardStore.getState()
    //     if (rateCardStore.setSearchQuery) {
    //       rateCardStore.setSearchQuery(searchQuery)
    //     }
    //   } else if (location.pathname.startsWith('/contracts')) {
    //     const contractsStore = useContractsStore.getState()
    //     contractsStore.searchContracts(searchQuery)
    //   } else {
    //     navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    //   }
    //   setSearchQuery('')
    // }
  }

  // Get quick actions based on current page
  const getQuickActions = () => {
    const path = location.pathname

    if (path.startsWith('/dashboard/rate-cards')) {
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate('/dashboard/rate-cards/create')}
            style={{
              ...styles.iconButton,
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
            }}
            title="Create Rate Card"
          >
            <Plus size={18} />
          </button>
        </div>
      )
    }

    if (path.startsWith('/contracts')) {
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              // Trigger upload modal or navigate to upload section
              const contractsStore = useContractsStore.getState()
              if (contractsStore.canUploadMore && contractsStore.canUploadMore()) {
                // You can trigger a modal here or navigate to upload
                // For now, we'll add a URL parameter to trigger upload UI
                navigate('/contracts?action=upload')
              } else {
                toast.error('Upload limit reached. Please upgrade your plan.')
              }
            }}
            style={{
              ...styles.iconButton,
              background: isUploading ? 'var(--color-neutral-300)' : 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              cursor: isUploading ? 'not-allowed' : 'pointer',
            }}
            title={isUploading ? 'Upload in progress...' : 'Upload Contract'}
            disabled={isUploading}
          >
            {isUploading ? <Clock size={18} /> : <Upload size={18} />}
          </button>

          {contractsAnalytics && (
            <button
              onClick={() => navigate('/contracts?tab=analytics')}
              style={{
                ...styles.iconButton,
                background: 'transparent',
                color: 'var(--color-neutral-700)',
              }}
              title="View Analytics"
            >
              <BarChart3 size={18} />
            </button>
          )}
        </div>
      )
    }

    return null
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: 'var(--color-background)',
      overflow: 'hidden',
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
      transform: viewport.isMobile
        ? sidebar.isMobileOpen
          ? 'translateX(0)'
          : 'translateX(-100%)'
        : 'none',
      flexShrink: 0,
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
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
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
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
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
      // maxWidth: '500px',
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
      position: 'relative',
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
    },
  }

  // Constants
  const { bottomMenuItems, menuItems } = MainLayoutConstants

  return (
    <div style={styles.container}>
      <div style={styles.mobileOverlay} onClick={() => toggleSidebar()} />

      <aside style={styles.sidebar}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <Link to="/dashboard" style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            {!sidebar.isCollapsed && <span style={styles.logoText}>CreatorsMantra</span>}
          </Link>

          <button
            onClick={() => collapseSidebar()}
            style={{
              ...styles.collapseButton,
              ...(sidebar.isCollapsed ? { margin: '0 auto' } : {}),
            }}
          >
            {sidebar.isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div style={styles.sidebarContent}>
          <div style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <RenderMenuItems item={item} key={index} />
            ))}
          </div>
          <div style={styles.menuSection}>
            {bottomMenuItems.map((item, index) => (
              <RenderMenuItems item={item} key={index} />
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userProfile} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div style={styles.userAvatar}>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.fullName || 'User'}</div>
              <div style={styles.userRole}>
                {subscription
                  ? `${subscription.charAt(0).toUpperCase()}${subscription.slice(1)} Plan`
                  : 'Starter Plan'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} />
            {!sidebar.isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search deals, invoices, rate cards, scripts, contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </form>

          <div style={styles.headerActions}>
            {getQuickActions()}

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={styles.iconButton}
              title="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

/**
 * Deals List Page - Complete Redesign Fixed
 * Path: src/features/deals/pages/DealsListPage.jsx
 */

// Dependencies
import {
  Activity,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Edit2,
  Filter,
  Grid3X3,
  IndianRupee,
  LayoutGrid,
  List,
  MoreVertical,
  Package,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// Store Hooks
import { dealsAPI } from '../../../api/endpoints/deals'
import useUIStore from '../../../store/uiStore'
import { DealsConstants } from '../../../utils/constants'
import { useDealsStore } from '../../../store'

// Component
import { Loading } from '../../../components'

// Helpers
import {
  calculateDaysInStage,
  checkOverdueStatus,
  formatCurrency,
  formatDate,
  formatDeliverable,
  getStageValue,
} from '../../../utils/helpers'

const DealsListPage = () => {
  /*
    TODO:
    1. Implement Deals CRUD Operations (three dots)
    2. Implement Deal Onclick Operation
    3. Implement Deal DragnDrop Operation
  */

  // Hooks
  const navigate = useNavigate()

  // Store Variables
  // Deals Store
  const {
    // Handlers
    fetchDeals: fetchAllDeals,
    updateStage,

    // Values
    deals,
    isLoading,
    analytics,
  } = useDealsStore((state) => ({
    fetchDeals: state.fetchDeals,
    updateStage: state.updateStage,
    deals: state.deals,
    isLoading: state.isLoading,
    analytics: state.analytics,
  }))

  // UI Store
  const { sidebar } = useUIStore()

  // State Variables
  const [viewType, setViewType] = useState('pipeline')
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [showActions, setShowActions] = useState(false)

  // Cosntants
  const { stages } = DealsConstants

  // Effects
  useEffect(() => {
    fetchAllDeals()
  }, [])

  const stats = useMemo(() => analytics, [analytics])

  // ------------------ Handlers ------------------
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, stageId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageId)
  }

  const handleDrop = async (e, stageId) => {
    e.preventDefault()
    setDragOverStage(null)

    if (draggedDeal && draggedDeal.stage !== stageId) {
      try {
        const updatedDeals = deals.map((deal) =>
          deal._id === draggedDeal._id ? { ...deal, stage: stageId } : deal
        )
        updateStage(draggedDeal._id, stageId)
      } catch (error) {
        toast.error('Failed to move deal')
      }
    }
    setDraggedDeal(null)
  }

  const handleDealClick = (dealId) => {
    navigate(`/deals/${dealId}`)
  }

  const handleEditDeal = (e, dealId) => {
    e.stopPropagation()
    navigate(`/deals/${dealId}/edit`)
  }

  const handleDeleteDeal = async (e, dealId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealsAPI.deleteDeal(dealId)
        toast.success('Deal deleted successfully')
        // TODO: Fetch new list of deals if one is deleted
        // fetchDeals()
      } catch (error) {
        toast.error('Failed to delete deal')
      }
    }
  }

  // ------------------ Helper ------------------
  const getDealsByStage = (stageId) => {
    return deals.filter((deal) => deal.stage === stageId)
  }

  const isSidebarOpen = !sidebar?.isCollapsed

  // ------------------ Styles ------------------
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.25rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flex: '1 1 auto',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.625rem',
      padding: '0.1875rem',
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.4375rem 0.875rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    viewButtonActive: {
      backgroundColor: '#ffffff',
      color: '#6366f1',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerActions: {
      display: 'flex',
      gap: '0.625rem',
      alignItems: 'center',
    },
    searchBar: {
      position: 'relative',
      width: '280px',
    },
    searchInput: {
      width: '100%',
      padding: '0.5rem 1rem 0.5rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    createButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '0.875rem',
    },
    statCard: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '0.75rem',
      padding: '1rem 1.25rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.625rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    statContent: {
      flex: 1,
      minWidth: 0,
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      marginBottom: '0.125rem',
    },
    statValue: {
      fontSize: 'clamp(1rem, 2.5vw, 1.375rem)',
      fontWeight: 800,
      color: '#0f172a',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis', // optional
    },
    statChange: {
      fontSize: '0.6875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.25rem',
      fontWeight: '600',
    },
    pipelineWrapper: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    pipelineContainer: {
      flex: 1,
      padding: '1.25rem',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
    pipeline: {
      display: 'flex',
      gap: '0.875rem',
      height: '100%',
      minWidth: 'max-content',
      paddingBottom: '0.5rem',
    },
    stageColumn: {
      width: '300px',
      minWidth: '300px',
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      maxHeight: '100%',
    },
    stageColumnDragOver: {
      // borderColor: '1px solid #6366f1',
      boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
      transform: 'translateY(-2px)',
    },
    stageHeader: {
      padding: '0.875rem 1rem',
      borderBottom: '1px solid #f1f5f9',
      position: 'relative',
      flexShrink: 0,
    },
    stageHeaderBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
    },
    stageInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0.25rem',
    },
    stageLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
    },
    stageIconBox: {
      width: '36px',
      height: '36px',
      borderRadius: '0.625rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stageDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    stageName: {
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#0f172a',
    },
    stageCount: {
      fontSize: '0.6875rem',
      color: '#94a3b8',
      fontWeight: '500',
    },
    stageValue: {
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#0f172a',
      textAlign: 'right',
    },
    dealsList: {
      flex: 1,
      padding: '0.625rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      minHeight: 0,
    },
    dealCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      padding: '0.875rem',
      cursor: 'grab',
      transition: 'all 0.2s',
      position: 'relative',
      flexShrink: 0,
    },
    dealCardOverdue: {
      borderColor: '1px solid #ef4444',
      backgroundColor: '#fef2f2',
    },
    dealCardWarning: {
      borderColor: '1px solid #f59e0b',
      backgroundColor: '#fffbeb',
    },
    dealCardDragging: {
      opacity: 0.5,
      transform: 'rotate(1deg)',
      cursor: 'grabbing',
    },
    dealHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.625rem',
    },
    dealTitle: {
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.1875rem',
    },
    dealBrand: {
      fontSize: '0.75rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontWeight: '500',
    },
    dealMoreButton: {
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    dealValue: {
      fontSize: '1.125rem',
      fontWeight: '800',
      color: '#059669',
      marginBottom: '0.5rem',
    },
    dealMeta: {
      display: 'flex',
      gap: '0.875rem',
      fontSize: '0.6875rem',
      color: '#94a3b8',
      marginBottom: '0.5rem',
      flexWrap: 'wrap',
    },
    dealMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    overdueIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.1875rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    overdueCritical: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
    },
    overdueWarning: {
      backgroundColor: '#f59e0b',
      color: '#ffffff',
    },
    dealTags: {
      display: 'flex',
      gap: '0.375rem',
      flexWrap: 'wrap',
    },
    dealTag: {
      padding: '0.1875rem 0.5rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.375rem',
      fontSize: '0.625rem',
      color: '#1e40af',
      fontWeight: '600',
    },
    cardsContainer: {
      padding: '1.25rem',
      overflow: 'auto',
      flex: 1,
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: isSidebarOpen
        ? 'repeat(auto-fill, minmax(320px, 1fr))'
        : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
      maxWidth: '100%',
    },
    cardItem: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      padding: '1.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    },
    cardItemOverdue: {
      borderColor: '1px solid #ef4444',
      backgroundColor: '#fef2f2',
    },
    cardItemWarning: {
      borderColor: '1px solid #f59e0b',
      backgroundColor: '#fffbeb',
    },
    cardStage: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '0.5rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
    },
    cardInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginTop: '1rem',
      paddingTop: '0.875rem',
      borderTop: '1px solid #f1f5f9',
    },
    cardInfoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    cardInfoLabel: {
      fontSize: '0.625rem',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    cardInfoValue: {
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#334155',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#94a3b8',
    },
    dealActions: {
      position: 'absolute',
      top: '2rem',
      right: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
      padding: '0.375rem',
      zIndex: 100,
      minWidth: '160px',
    },
    dealAction: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
  }

  // Deal Content Rendere
  const renderDealContent = (deal, isListView = false) => {
    const overdueStatus = checkOverdueStatus(deal)
    const stageInfo = stages.find((s) => s.id === deals.stage) || stages[0]

    return (
      <>
        {overdueStatus.isOverdue && (
          <div
            style={{
              ...styles.overdueIndicator,
              ...(overdueStatus.urgency === 'critical'
                ? styles.overdueCritical
                : styles.overdueWarning),
            }}
          >
            <AlertTriangle size={12} />
            {overdueStatus.overdueType === 'payment'
              ? `Payment overdue by ${overdueStatus.daysOverdue}d`
              : `Delivery overdue by ${overdueStatus.daysOverdue}d`}
          </div>
        )}

        {isListView && (
          <div
            style={{
              ...styles.cardStage,
              backgroundColor: stageInfo.lightBg,
              color: stageInfo.color,
            }}
          >
            <stageInfo.icon size={12} />
            {stageInfo.name}
          </div>
        )}

        <div style={styles.dealHeader}>
          <div style={{ flex: 1 }}>
            <div style={styles.dealTitle}>{deal.title}</div>
            <div style={styles.dealBrand}>
              <Building size={12} />
              {deal.brand?.name || 'No brand'}
            </div>
          </div>

          {/* TEMP */}
          {/* <button
            style={styles.dealMoreButton}
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(showActions === deal._id ? null : deal._id)
            }}
          >
            <MoreVertical size={14} />
          </button> */}

          {showActions === deal._id && (
            <div style={styles.dealActions}>
              <button style={styles.dealAction} onClick={(e) => handleEditDeal(e, deal._id)}>
                <Edit2 size={12} />
                Edit Deal
              </button>
              <button
                style={styles.dealAction}
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(deal._id)
                  toast.success('Deal ID copied')
                }}
              >
                <Copy size={12} />
                Copy ID
              </button>
              <button
                style={{
                  ...styles.dealAction,
                  color: '#ef4444',
                }}
                onClick={(e) => handleDeleteDeal(e, deal._id)}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={styles.dealValue}>{formatCurrency(deal.dealValue?.finalAmount || 0)}</div>

        <div style={styles.dealMeta}>
          <div style={styles.dealMetaItem}>
            <Calendar size={11} />
            {formatDate(deal.timeline?.contentDeadline)}
          </div>
          <div style={styles.dealMetaItem}>
            <Clock size={11} />
            {calculateDaysInStage(deal.createdAt)}d
          </div>
          {deal.priority && (
            <div style={styles.dealMetaItem}>
              <Zap size={11} />
              {deal.priority}
            </div>
          )}
        </div>

        {isListView && (
          <div style={styles.cardInfo}>
            <div style={styles.cardInfoItem}>
              <span style={styles.cardInfoLabel}>Contact</span>
              <span style={styles.cardInfoValue}>{deal.brand?.contactPerson?.name || 'N/A'}</span>
            </div>
            <div style={styles.cardInfoItem}>
              <span style={styles.cardInfoLabel}>Platform</span>
              <span style={styles.cardInfoValue}>{deal.platform || 'N/A'}</span>
            </div>
            <div style={styles.cardInfoItem}>
              <span style={styles.cardInfoLabel}>Payment</span>
              <span style={styles.cardInfoValue}>{formatDate(deal.timeline?.paymentDueDate)}</span>
            </div>
            <div style={styles.cardInfoItem}>
              <span style={styles.cardInfoLabel}>GST</span>
              <span style={styles.cardInfoValue}>
                {deal.dealValue?.gstApplicable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}

        {deal.deliverables && deal.deliverables.length > 0 && (
          <div style={styles.dealTags}>
            {deal.deliverables.slice(0, 3).map((deliverable, index) => (
              <span key={`${deal._id}-del-${index}`} style={styles.dealTag}>
                {formatDeliverable(deliverable)}
              </span>
            ))}
            {deal.deliverables.length > 3 && (
              <span style={styles.dealTag}>+{deal.deliverables.length - 3}</span>
            )}
          </div>
        )}
      </>
    )
  }

  if (isLoading) return <Loading page={'Deals'} />

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Deals Pipeline</h1>

            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'pipeline' ? styles.viewButtonActive : {}),
                }}
                onClick={() => setViewType('pipeline')}
              >
                <Grid3X3 size={14} />
                Pipeline
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'cards' ? styles.viewButtonActive : {}),
                }}
                onClick={() => setViewType('cards')}
              >
                <LayoutGrid size={14} />
                Cards
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'list' ? styles.viewButtonActive : {}),
                }}
                onClick={() => setViewType('list')}
              >
                <List size={14} />
                List
              </button>
            </div>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <Search style={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && fetchDeals()}
                style={styles.searchInput}
              />
            </div>

            <button style={styles.filterButton}>
              <Filter size={14} />
              Filters
            </button>

            <button style={styles.createButton} onClick={() => navigate('/deals/create')}>
              <Plus size={16} />
              New Deal
            </button>
          </div>
        </div>

        {/* Stats / Analytics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              }}
            >
              <Target size={20} color="#6366f1" />
            </div>

            {/* Total Deals */}
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Deals</div>
              <div style={styles.statValue}>{stats.totalDeals}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#10b981',
                }}
              >
                <TrendingUp size={12} />
                Active pipeline
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              }}
            >
              <IndianRupee size={20} color="#10b981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Value</div>
              <div style={styles.statValue}>{formatCurrency(stats.totalValue)}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#10b981',
                }}
              >
                Exc. GST and TDS
              </div>
            </div>
          </div>

          {/* Average Deals Value */}
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
              }}
            >
              <Activity size={20} color="#f59e0b" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Avg Deal</div>
              <div style={styles.statValue}>{formatCurrency(stats.avgDealValue)}</div>
            </div>
          </div>

          {/* Temp: Disabled Completed Deals */}
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
              }}
            >
              <CheckCircle size={20} color="#22c55e" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Completed</div>
              <div style={styles.statValue}>{stats.completedDeals}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#6366f1',
                }}
              >
                Win rate: {stats.conversionRate}%
              </div>
            </div>
          </div>

          {/* Temp: Disabled Overdue Deals */}
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor:
                  stats.overdueDeals > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(148, 163, 184, 0.1)',
              }}
            >
              <AlertTriangle size={20} color={stats.overdueDeals > 0 ? '#ef4444' : '#94a3b8'} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Overdue</div>
              <div style={styles.statValue}>{stats.overdueDeals}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: stats.overdueDeals > 0 ? '#ef4444' : '#94a3b8',
                }}
              >
                Completed/Paid Overdue
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewType === 'pipeline' && (
        <div style={styles.pipelineWrapper}>
          <div style={styles.pipelineContainer}>
            <div style={styles.pipeline}>
              {stages.map((stage) => {
                const StageIcon = stage.icon
                const stageDeals = getDealsByStage(stage.id)
                const stageValue = getStageValue(stage.id, deals)
                const isDragOver = dragOverStage === stage.id

                return (
                  <div
                    key={stage.id}
                    // TODO: Causing error due to
                    style={{
                      ...styles.stageColumn,
                      ...(isDragOver ? styles.stageColumnDragOver : {}),
                    }}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDragLeave={() => setDragOverStage(null)}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    <div style={styles.stageHeader}>
                      <div
                        style={{
                          ...styles.stageHeaderBar,
                          background: stage.bgGradient,
                        }}
                      />
                      <div style={styles.stageInfo}>
                        <div style={styles.stageLeft}>
                          <div
                            style={{
                              ...styles.stageIconBox,
                              backgroundColor: stage.lightBg,
                            }}
                          >
                            <StageIcon size={18} color={stage.color} />
                          </div>
                          <div style={styles.stageDetails}>
                            <div style={styles.stageName}>{stage.name}</div>
                            <div style={styles.stageCount}>
                              {stageDeals.length} {stageDeals.length === 1 ? 'deal' : 'deals'}
                            </div>
                          </div>
                        </div>
                        <div style={styles.stageValue}>{formatCurrency(stageValue)}</div>
                      </div>
                    </div>

                    <div style={styles.dealsList}>
                      {stageDeals.length === 0 ? (
                        <div style={styles.emptyState}>
                          <Package size={28} color="#cbd5e1" />
                          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>No deals</p>
                        </div>
                      ) : (
                        stageDeals.map((deal) => {
                          const overdueStatus = checkOverdueStatus(deal)

                          return (
                            <div
                              key={deal._id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, deal)}
                              onClick={() => handleDealClick(deal._id)}
                              style={{
                                ...styles.dealCard,
                                ...(overdueStatus.urgency === 'critical'
                                  ? styles.dealCardOverdue
                                  : {}),
                                ...(overdueStatus.urgency === 'warning'
                                  ? styles.dealCardWarning
                                  : {}),
                                ...(draggedDeal?._id === deal._id ? styles.dealCardDragging : {}),
                              }}
                            >
                              {renderDealContent(deal)}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {viewType === 'cards' && (
        <div style={styles.cardsContainer}>
          <div style={styles.cardsGrid}>
            {deals.map((deal) => {
              const overdueStatus = checkOverdueStatus(deal)

              return (
                <div
                  key={deal._id}
                  onClick={() => handleDealClick(deal._id)}
                  style={{
                    ...styles.cardItem,
                    ...(overdueStatus.urgency === 'critical' ? styles.cardItemOverdue : {}),
                    ...(overdueStatus.urgency === 'warning' ? styles.cardItemWarning : {}),
                  }}
                >
                  {renderDealContent(deal, true)}
                </div>
              )
            })}
          </div>

          {deals.length === 0 && (
            <div style={styles.emptyState}>
              <Package size={48} color="#cbd5e1" />
              <h3 style={{ marginTop: '1rem' }}>No deals found</h3>
              <p>Create your first deal to get started</p>
            </div>
          )}
        </div>
      )}

      {viewType === 'list' && (
        <div style={styles.cardsContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {deals.map((deal) => {
              const overdueStatus = checkOverdueStatus(deal)

              return (
                <div
                  key={deal._id}
                  onClick={() => handleDealClick(deal._id)}
                  style={{
                    ...styles.cardItem,
                    ...(overdueStatus.urgency === 'critical' ? styles.cardItemOverdue : {}),
                    ...(overdueStatus.urgency === 'warning' ? styles.cardItemWarning : {}),
                  }}
                >
                  {renderDealContent(deal, true)}
                </div>
              )
            })}
          </div>

          {deals.length === 0 && (
            <div style={styles.emptyState}>
              <List size={48} color="#cbd5e1" />
              <h3 style={{ marginTop: '1rem' }}>No deals found</h3>
              <p>Create your first deal to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DealsListPage

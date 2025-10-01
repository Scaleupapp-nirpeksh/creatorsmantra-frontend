/**
 * Invoice Dashboard Page
 * Main invoice management interface with list view, filters, and quick stats
 *
 * Features:
 * - Invoice list with status indicators
 * - Quick stats cards (total, paid, pending, overdue)
 * - Search, filter, and sort functionality
 * - Pagination
 * - Quick actions (view, download PDF, record payment)
 * - Create new invoice navigation
 *
 * Path: src/features/invoices/pages/InvoiceDashboard.jsx
 */

import { invoiceHelpers } from '@/api/endpoints/invoices'
import useAuthStore from '@/store/authStore'
import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  MoreVertical,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Timer,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '../../../store'

// Styles
import '../../../styles/animateSpin.css'

const InvoiceDashboard = () => {
  const navigate = useNavigate()
  const { user, subscription } = useAuthStore()

  // Invoice store state and actions
  const {
    invoices,
    pagination,
    filters,
    dashboard,
    isLoading,
    fetchInvoices,
    fetchDashboard,
    setFilters,
    setPage,
    clearFilters,
    downloadInvoicePDF,
  } = useInvoiceStore()

  // Local state
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showActions, setShowActions] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Initial data fetch
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Load dashboard and invoices data
  const loadDashboardData = async () => {
    try {
      await fetchInvoices()
      // await Promise.all([fetchDashboard(), fetchInvoices()])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  // Handle search
  const handleSearch = () => {
    setFilters({ clientName: searchTerm })
  }

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
    setFilters({
      status: status === 'all' ? null : status,
    })
  }

  // Handle type filter
  const handleTypeFilter = (type) => {
    setSelectedType(type)
    setFilters({
      invoiceType: type === 'all' ? null : type,
    })
  }

  // Handle date range filter
  const applyDateFilter = () => {
    if (dateRange.start && dateRange.end) {
      setFilters({
        dateRange: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
      })
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    // await loadDashboardData()
    setRefreshing(false)
    toast.success('Dashboard refreshed')
  }

  // Navigate to invoice detail
  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`)
  }

  // Handle PDF download
  const handleDownloadPDF = async (e, invoiceId) => {
    e.stopPropagation()
    try {
      await downloadInvoicePDF(invoiceId)
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  // Navigate to record payment
  const handleRecordPayment = (e, invoiceId) => {
    e.stopPropagation()
    navigate(`/invoices/${invoiceId}#payment`)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate days until due
  const calculateDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      draft: { bg: '#f1f5f9', color: '#64748b', icon: FileText },
      sent: { bg: '#dbeafe', color: '#2563eb', icon: Send },
      viewed: { bg: '#e0f2fe', color: '#0ea5e9', icon: Eye },
      partially_paid: { bg: '#fed7aa', color: '#ea580c', icon: CreditCard },
      paid: { bg: '#bbf7d0', color: '#16a34a', icon: CheckCircle },
      overdue: { bg: '#fecaca', color: '#dc2626', icon: AlertTriangle },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', icon: XCircle },
    }
    return statusColors[status] || statusColors.draft
  }

  // Get invoice type badge
  const getTypeBadge = (type) => {
    const typeConfig = {
      individual: { bg: '#f0f9ff', color: '#0284c7', label: 'Individual' },
      consolidated: { bg: '#faf5ff', color: '#9333ea', label: 'Consolidated' },
      agency_payout: { bg: '#fef3c7', color: '#d97706', label: 'Agency Payout' },
      monthly_summary: { bg: '#ecfccb', color: '#65a30d', label: 'Monthly Summary' },
    }
    return typeConfig[type] || typeConfig.individual
  }

  // Check if user can create consolidated invoices
  const canCreateConsolidated = invoiceHelpers.canCreateConsolidatedInvoice(subscription?.tier)

  // Styles
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
      justifyContent: 'space-between',
      marginBottom: '1.25rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    refreshButton: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    headerActions: {
      display: 'flex',
      gap: '0.625rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    searchBar: {
      position: 'relative',
      width: '320px',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
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
    },
    statIcon: {
      width: '44px',
      height: '44px',
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
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#0f172a',
      lineHeight: 1,
    },
    statChange: {
      fontSize: '0.6875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.25rem',
      fontWeight: '600',
    },
    filterSection: {
      display: 'flex',
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.625rem',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    filterTab: {
      padding: '0.375rem 0.875rem',
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    filterTabActive: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      color: '#6366f1',
    },
    content: {
      flex: 1,
      padding: '1.25rem',
      overflow: 'auto',
    },
    invoiceGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    invoiceCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: '1px solid #e2e8f0',
      padding: '1.25rem',
      transition: 'all 0.2s',
      cursor: 'pointer',
      position: 'relative',
    },
    invoiceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.875rem',
    },
    invoiceNumber: {
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.25rem',
    },
    clientName: {
      fontSize: '0.8125rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
    },
    invoiceActions: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
    },
    actionButton: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    invoiceBody: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    invoiceField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    fieldLabel: {
      fontSize: '0.6875rem',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
    fieldValue: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#334155',
    },
    invoiceFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1rem',
      borderTop: '1px solid #f1f5f9',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    typeBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.625rem',
      borderRadius: '0.375rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
    },
    dueBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '0.375rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '1.25rem',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
    },
    pageButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    pageButtonActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      color: '#ffffff',
    },
    pageButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      color: '#94a3b8',
    },
    emptyIcon: {
      marginBottom: '1rem',
    },
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem',
    },
    emptyText: {
      fontSize: '0.875rem',
      textAlign: 'center',
      maxWidth: '400px',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '3rem',
      right: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
      padding: '0.375rem',
      zIndex: 100,
      minWidth: '180px',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      gap: '1rem',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  }

  // Loading state
  if (isLoading && invoices.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <span style={{ color: '#64748b' }}>Loading invoices...</span>
        </div>
        <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          {/* <div style={styles.titleSection}>
            <h1 style={styles.title}>Invoices</h1>
            <button
              style={{
                ...styles.refreshButton,
                ...(refreshing ? { animation: 'spin 1s linear infinite' } : {}),
              }}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={18} />
            </button>
          </div> */}

          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <Search style={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                style={styles.searchInput}
              />
            </div>

            <button style={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={14} />
              Filters
            </button>

            <button style={styles.createButton} onClick={() => navigate('/invoices/create')}>
              <Plus size={16} />
              New Invoice
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              }}
            >
              <FileText size={22} color="#6366f1" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Invoices</div>
              <div style={styles.statValue}>{dashboard?.monthlyAnalytics?.totalInvoices || 0}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#10b981',
                }}
              >
                <TrendingUp size={12} />
                This month
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              }}
            >
              <IndianRupee size={22} color="#10b981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Revenue</div>
              <div style={styles.statValue}>
                {formatCurrency(dashboard?.monthlyAnalytics?.revenueThisMonth || 0)}
              </div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#6366f1',
                }}
              >
                {dashboard?.monthlyAnalytics?.collectionRate || 0}% collected
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
              }}
            >
              <Timer size={22} color="#f59e0b" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Pending</div>
              <div style={styles.statValue}>{dashboard?.pendingPayments?.length || 0}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: '#f59e0b',
                }}
              >
                Awaiting payment
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor:
                  dashboard?.overdueInvoices > 0
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(34, 197, 94, 0.1)',
              }}
            >
              <AlertTriangle
                size={22}
                color={dashboard?.overdueInvoices > 0 ? '#ef4444' : '#22c55e'}
              />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Overdue</div>
              <div style={styles.statValue}>{dashboard?.overdueInvoices || 0}</div>
              <div
                style={{
                  ...styles.statChange,
                  color: dashboard?.overdueInvoices > 0 ? '#ef4444' : '#22c55e',
                }}
              >
                {dashboard?.overdueInvoices > 0 ? 'Need attention' : 'All good'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div style={styles.filterSection}>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedStatus === 'all' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleStatusFilter('all')}
            >
              All Status
            </button>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedStatus === 'draft' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleStatusFilter('draft')}
            >
              Draft
            </button>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedStatus === 'sent' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleStatusFilter('sent')}
            >
              Sent
            </button>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedStatus === 'paid' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleStatusFilter('paid')}
            >
              Paid
            </button>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedStatus === 'overdue' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleStatusFilter('overdue')}
            >
              Overdue
            </button>

            <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

            <button
              style={{
                ...styles.filterTab,
                ...(selectedType === 'all' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleTypeFilter('all')}
            >
              All Types
            </button>
            <button
              style={{
                ...styles.filterTab,
                ...(selectedType === 'individual' ? styles.filterTabActive : {}),
              }}
              onClick={() => handleTypeFilter('individual')}
            >
              Individual
            </button>
            {canCreateConsolidated && (
              <button
                style={{
                  ...styles.filterTab,
                  ...(selectedType === 'consolidated' ? styles.filterTabActive : {}),
                }}
                onClick={() => handleTypeFilter('consolidated')}
              >
                Consolidated
              </button>
            )}

            <button
              style={{
                ...styles.filterTab,
                color: '#ef4444',
              }}
              onClick={() => {
                clearFilters()
                setSelectedStatus('all')
                setSelectedType('all')
                setSearchTerm('')
                setDateRange({ start: '', end: '' })
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {invoices.length === 0 ? (
          <div style={styles.emptyState}>
            <Receipt size={48} color="#cbd5e1" style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No invoices found</h3>
            <p style={styles.emptyText}>
              {filters.status || filters.clientName
                ? 'Try adjusting your filters or search term'
                : 'Create your first invoice to get started with billing'}
            </p>
            {!filters.status && !filters.clientName && (
              <button
                style={{ ...styles.createButton, marginTop: '1.5rem' }}
                onClick={() => navigate('/invoices/create')}
              >
                <Plus size={16} />
                Create First Invoice
              </button>
            )}
          </div>
        ) : (
          <div style={styles.invoiceGrid}>
            {invoices.map((invoice) => {
              const statusConfig = getStatusColor(invoice.status)
              const typeConfig = getTypeBadge(invoice.invoiceType)
              const StatusIcon = statusConfig.icon
              const daysUntilDue = calculateDaysUntilDue(invoice.invoiceSettings?.dueDate)
              const isOverdue = invoice.status === 'overdue' || (daysUntilDue && daysUntilDue < 0)

              return (
                <div
                  key={invoice.id || invoice._id}
                  style={{
                    ...styles.invoiceCard,
                    ...(isOverdue ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}),
                  }}
                  onClick={() => handleViewInvoice(invoice.id || invoice._id)}
                >
                  <div style={styles.invoiceHeader}>
                    <div>
                      <div style={styles.invoiceNumber}>{invoice.invoiceNumber}</div>
                      <div style={styles.clientName}>
                        <Building size={14} />
                        {invoice.clientName || invoice.clientDetails?.name || 'No client'}
                      </div>
                    </div>

                    <div style={styles.invoiceActions}>
                      {/* <button
                        style={styles.actionButton}
                        onClick={(e) => handleDownloadPDF(e, invoice.id || invoice._id)}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button> */}

                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <button
                          style={styles.actionButton}
                          onClick={(e) => handleRecordPayment(e, invoice.id || invoice._id)}
                          title="Record Payment"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}

                      <button
                        style={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowActions(showActions === invoice._id ? null : invoice._id)
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {showActions === invoice._id && (
                        <div style={styles.dropdownMenu}>
                          <button
                            style={styles.dropdownItem}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewInvoice(invoice.id || invoice._id)
                            }}
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          {invoice.status === 'draft' && (
                            <button
                              style={styles.dropdownItem}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/invoices/${invoice.id || invoice._id}/edit`)
                              }}
                            >
                              <Edit2 size={14} />
                              Edit Invoice
                            </button>
                          )}
                          <button
                            style={styles.dropdownItem}
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(invoice.invoiceNumber)
                              toast.success('Invoice number copied')
                              setShowActions(null)
                            }}
                          >
                            <Copy size={14} />
                            Copy Number
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.invoiceBody}>
                    <div style={styles.invoiceField}>
                      <span style={styles.fieldLabel}>Amount</span>
                      <span
                        style={{
                          ...styles.fieldValue,
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: '#059669',
                        }}
                      >
                        {formatCurrency(
                          invoice.amount || invoice.taxSettings?.taxCalculation?.finalAmount || 0
                        )}
                      </span>
                    </div>

                    <div style={styles.invoiceField}>
                      <span style={styles.fieldLabel}>Invoice Date</span>
                      <span style={styles.fieldValue}>
                        {formatDate(invoice.invoiceDate || invoice.invoiceSettings?.invoiceDate)}
                      </span>
                    </div>

                    <div style={styles.invoiceField}>
                      <span style={styles.fieldLabel}>Due Date</span>
                      <span style={styles.fieldValue}>
                        {formatDate(invoice.dueDate || invoice.invoiceSettings?.dueDate)}
                      </span>
                    </div>

                    <div style={styles.invoiceField}>
                      <span style={styles.fieldLabel}>Deals</span>
                      <span style={styles.fieldValue}>
                        {invoice.dealCount || invoice.dealReferences?.dealsSummary?.totalDeals || 1}
                      </span>
                    </div>
                  </div>

                  <div style={styles.invoiceFooter}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                        }}
                      >
                        <StatusIcon size={12} />
                        {invoiceHelpers.formatInvoiceStatus(invoice.status)}
                      </div>

                      <div
                        style={{
                          ...styles.typeBadge,
                          backgroundColor: typeConfig.bg,
                          color: typeConfig.color,
                        }}
                      >
                        {typeConfig.label}
                      </div>
                    </div>

                    {daysUntilDue !== null && invoice.status !== 'paid' && (
                      <div
                        style={{
                          ...styles.dueBadge,
                          backgroundColor: isOverdue ? '#fecaca' : '#f0fdf4',
                          color: isOverdue ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {isOverdue ? (
                          <>
                            <AlertCircle size={12} />
                            {Math.abs(daysUntilDue)}d overdue
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            {daysUntilDue}d remaining
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.pageButton,
              ...(pagination.hasPrevPage ? {} : styles.pageButtonDisabled),
            }}
            onClick={() => setPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} />
          </button>

          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
            const pageNum = i + 1
            const isActive = pageNum === pagination.currentPage

            return (
              <button
                key={pageNum}
                style={{
                  ...styles.pageButton,
                  ...(isActive ? styles.pageButtonActive : {}),
                }}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}

          {pagination.totalPages > 5 && (
            <span style={{ padding: '0 0.5rem', color: '#94a3b8' }}>...</span>
          )}

          {pagination.totalPages > 5 && (
            <button style={styles.pageButton} onClick={() => setPage(pagination.totalPages)}>
              {pagination.totalPages}
            </button>
          )}

          <button
            style={{
              ...styles.pageButton,
              ...(pagination.hasNextPage ? {} : styles.pageButtonDisabled),
            }}
            onClick={() => setPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
          </button>

          <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            {pagination.totalCount} total invoices
          </span>
        </div>
      )}
    </div>
  )
}

export default InvoiceDashboard

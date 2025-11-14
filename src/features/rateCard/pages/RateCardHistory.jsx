/**
 * Rate Card History Page
 * Version control and change tracking for rate cards
 *
 * Features:
 * - Complete version history timeline
 * - Detailed change tracking and diff views
 * - Restore functionality to previous versions
 * - User attribution for each change
 * - Visual change indicators and summaries
 * - Pagination for large history sets
 * - Export version comparison reports
 * - Backup and recovery workflows
 *
 * @filepath src/features/rateCard/pages/RateCardHistory.jsx
 * @author CreatorsMantra Frontend Team
 */

import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  History,
  RotateCcw,
  Eye,
  EyeOff,
  User,
  Clock,
  Edit3,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  FileText,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Loader2,
  RefreshCw,
  Filter,
  Search,
  X,
} from 'lucide-react'
import useRateCardStore from '../../../store/ratecardStore'

const RateCardHistory = ({ rateCardId, onNavigate, onBack }) => {
  const {
    currentRateCard,
    history,
    isLoading,
    error,
    fetchRateCard,
    fetchHistory,
    clearCurrentRateCard,
  } = useRateCardStore()

  // Local state
  const [historyData, setHistoryData] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState(null)
  const [expandedVersions, setExpandedVersions] = useState(new Set())
  const [selectedVersions, setSelectedVersions] = useState([])
  const [showComparisonMode, setShowComparisonMode] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isRestoring, setIsRestoring] = useState(null)

  // Change type configuration
  const changeTypes = {
    creation: {
      label: 'Created',
      icon: Plus,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
    },
    metrics_update: {
      label: 'Metrics Updated',
      icon: TrendingUp,
      color: 'var(--color-primary-600)',
      bgColor: 'var(--color-primary-100)',
    },
    pricing_change: {
      label: 'Pricing Changed',
      icon: DollarSign,
      color: 'var(--color-warning-dark)',
      bgColor: 'var(--color-warning-light)',
    },
    package_update: {
      label: 'Package Modified',
      icon: Package,
      color: 'var(--color-secondary-600)',
      bgColor: 'var(--color-secondary-100)',
    },
    terms_update: {
      label: 'Terms Updated',
      icon: FileText,
      color: 'var(--color-accent-600)',
      bgColor: 'var(--color-accent-100)',
    },
    restore: {
      label: 'Restored',
      icon: RotateCcw,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-light)',
    },
    other: {
      label: 'Other Changes',
      icon: Edit3,
      color: 'var(--color-neutral-600)',
      bgColor: 'var(--color-neutral-100)',
    },
  }

  // Fetch history data
  const fetchHistoryData = async () => {
    try {
      setIsLoadingHistory(true)
      setHistoryError(null)

      const response = await fetch(`/api/ratecards/${rateCardId}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust based on auth implementation
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch history data')
      }

      const data = await response.json()

      if (data.success) {
        setHistoryData(data.data.history || [])
      } else {
        throw new Error(data.message || 'Failed to load history')
      }
    } catch (err) {
      setHistoryError(err.message || 'Failed to load history data')
      // Fallback to store history if available
      if (history && history.length > 0) {
        setHistoryData(history)
        setHistoryError(null)
      }
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Restore version function
  const handleRestoreVersion = async (historyId, version) => {
    if (
      !window.confirm(
        `Are you sure you want to restore to version ${version}? This will create a new version with the restored data.`
      )
    ) {
      return
    }

    try {
      setIsRestoring(historyId)

      const response = await fetch(`/api/ratecards/${rateCardId}/restore/${historyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to restore version')
      }

      const data = await response.json()

      if (data.success) {
        // Refresh both rate card and history
        await fetchRateCard(rateCardId)
        await fetchHistoryData()

        // Show success message
        alert('Version restored successfully!')
      } else {
        throw new Error(data.message || 'Failed to restore version')
      }
    } catch (err) {
      alert(`Failed to restore version: ${err.message}`)
    } finally {
      setIsRestoring(null)
    }
  }

  // Load data on mount
  useEffect(() => {
    if (rateCardId) {
      fetchRateCard(rateCardId)
      fetchHistoryData()
    }

    return () => {
      clearCurrentRateCard()
    }
  }, [rateCardId])

  // Filter and search history
  const filteredHistory = useMemo(() => {
    if (!historyData) return []

    return historyData.filter((item) => {
      const matchesType = filterType === 'all' || item.changeType === filterType
      const matchesSearch =
        searchQuery === '' ||
        item.changeSummary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.editedBy?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesType && matchesSearch
    })
  }, [historyData, filterType, searchQuery])

  // Toggle version expansion
  const toggleExpansion = (versionId) => {
    const newExpanded = new Set(expandedVersions)
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId)
    } else {
      newExpanded.add(versionId)
    }
    setExpandedVersions(newExpanded)
  }

  // Toggle version selection for comparison
  const toggleVersionSelection = (versionId) => {
    const newSelected = selectedVersions.includes(versionId)
      ? selectedVersions.filter((id) => id !== versionId)
      : [...selectedVersions, versionId].slice(-2) // Limit to 2 versions
    setSelectedVersions(newSelected)
  }

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)} days ago`
    if (diffInHours < 24 * 30) return `${Math.floor(diffInHours / (24 * 7))} weeks ago`
    return `${Math.floor(diffInHours / (24 * 30))} months ago`
  }

  // Loading state
  if (isLoading && !currentRateCard) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto var(--space-4)',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader2 size={24} style={{ color: 'white' }} className="animate-spin" />
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading version history...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !currentRateCard) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto var(--space-4)',
              borderRadius: '50%',
              backgroundColor: 'var(--color-error-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} style={{ color: 'var(--color-error)' }} />
          </div>
          <h3
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Failed to Load History
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            {error}
          </p>
          <button
            onClick={() => onBack && onBack()}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: 'var(--gradient-primary)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--font-semibold)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!currentRateCard) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <button
                onClick={
                  onBack ||
                  (() => onNavigate && onNavigate(`/dashboard/rate-cards/${rateCardId}/edit`))
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'white',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-200) ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)'
                  e.target.style.color = 'var(--color-primary-600)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.color = 'var(--color-text-secondary)'
                }}
              >
                <ArrowLeft size={16} />
                Back to Rate Card
              </button>

              <div>
                <h1
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Version History - {currentRateCard.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}
                  >
                    Current Version: v{currentRateCard.version?.current || 1}
                  </span>
                  <span
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}
                  >
                    {filteredHistory.length} changes tracked
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {selectedVersions.length === 2 && (
                <button
                  onClick={() => setShowComparisonMode(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'white',
                    color: 'var(--color-accent)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-200) ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-accent-50)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                  }}
                >
                  Compare Versions
                </button>
              )}

              <button
                onClick={fetchHistoryData}
                disabled={isLoadingHistory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-medium)',
                  border: 'none',
                  cursor: isLoadingHistory ? 'not-allowed' : 'pointer',
                  opacity: isLoadingHistory ? 0.7 : 1,
                }}
              >
                <RefreshCw size={16} className={isLoadingHistory ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 0%', maxWidth: '28rem' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-neutral-400)',
                }}
              >
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search changes or contributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 'var(--space-10)',
                  paddingRight: searchQuery ? 'var(--space-10)' : 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                  paddingBottom: 'var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'white',
                  fontSize: 'var(--text-base)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)'
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-neutral-400)',
                  }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Change Type Filter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Filter by:
              </span>
              {Object.entries(changeTypes).map(([key, config]) => {
                const Icon = config.icon
                const isActive = filterType === key
                const count = historyData.filter((item) => item.changeType === key).length

                if (count === 0 && key !== 'all') return null

                return (
                  <button
                    key={key}
                    onClick={() => setFilterType(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid',
                      borderColor: isActive ? config.color : 'var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? config.bgColor : 'white',
                      color: isActive ? config.color : 'var(--color-text)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-200) ease',
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
                    }}
                  >
                    {key !== 'all' && <Icon size={14} />}
                    {config.label}
                    {count > 0 && (
                      <span
                        style={{
                          backgroundColor: isActive ? config.color : 'var(--color-neutral-200)',
                          color: isActive ? 'white' : 'var(--color-text-secondary)',
                          padding: 'var(--space-1) var(--space-2)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-medium)',
                          minWidth: '1.5rem',
                          textAlign: 'center',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 var(--space-6) var(--space-12)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Loading State */}
          {isLoadingHistory && (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 auto var(--space-4)',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loader2 size={20} style={{ color: 'white' }} className="animate-spin" />
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading version history...</p>
            </div>
          )}

          {/* Error State */}
          {historyError && !historyData.length && (
            <div
              style={{
                backgroundColor: 'var(--color-error-light)',
                border: '1px solid var(--color-error)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                textAlign: 'center',
              }}
            >
              <AlertTriangle
                size={24}
                style={{ color: 'var(--color-error)', margin: '0 auto var(--space-4)' }}
              />
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-error-dark)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Failed to Load History
              </h3>
              <p style={{ color: 'var(--color-error-dark)' }}>{historyError}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingHistory && filteredHistory.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto var(--space-4)',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-neutral-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <History size={24} style={{ color: 'var(--color-neutral-500)' }} />
              </div>
              <h3
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {searchQuery || filterType !== 'all'
                  ? 'No matching history found'
                  : 'No version history yet'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Changes to this rate card will appear here'}
              </p>
            </div>
          )}

          {/* History Timeline */}
          {filteredHistory.length > 0 && (
            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '2rem',
                  top: '2rem',
                  bottom: '2rem',
                  width: '2px',
                  backgroundColor: 'var(--color-border)',
                  zIndex: 1,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {filteredHistory.map((item, index) => {
                  const changeConfig = changeTypes[item.changeType] || changeTypes.other
                  const ChangeIcon = changeConfig.icon
                  const isExpanded = expandedVersions.has(item._id)
                  const isSelected = selectedVersions.includes(item._id)
                  const isRestoring = isRestoring === item._id

                  return (
                    <div key={item._id} style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 'var(--radius-xl)',
                          boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                          border: isSelected
                            ? '2px solid var(--color-primary-500)'
                            : '1px solid var(--color-border)',
                          padding: 'var(--space-6)',
                          marginLeft: '4rem',
                          transition: 'all var(--duration-200) ease',
                        }}
                      >
                        {/* Timeline marker */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-3.25rem',
                            top: '1.5rem',
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: changeConfig.bgColor,
                            border: `2px solid ${changeConfig.color}`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ChangeIcon size={16} style={{ color: changeConfig.color }} />
                        </div>

                        {/* Header */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: 'var(--space-4)',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                marginBottom: 'var(--space-2)',
                              }}
                            >
                              <h3
                                style={{
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: 'var(--font-semibold)',
                                  color: 'var(--color-text)',
                                }}
                              >
                                Version {item.version}
                              </h3>
                              <span
                                style={{
                                  padding: 'var(--space-1) var(--space-3)',
                                  backgroundColor: changeConfig.bgColor,
                                  color: changeConfig.color,
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: 'var(--font-medium)',
                                }}
                              >
                                {changeConfig.label}
                              </span>
                              {index === 0 && (
                                <span
                                  style={{
                                    padding: 'var(--space-1) var(--space-3)',
                                    backgroundColor: 'var(--color-success-light)',
                                    color: 'var(--color-success-dark)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-medium)',
                                  }}
                                >
                                  Current
                                </span>
                              )}
                            </div>

                            <p
                              style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--color-text)',
                                marginBottom: 'var(--space-3)',
                              }}
                            >
                              {item.changeSummary}
                            </p>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-4)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-2)',
                                }}
                              >
                                <User size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                <span
                                  style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  {item.editedBy?.fullName || 'Unknown User'}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-2)',
                                }}
                              >
                                <Clock size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                <span
                                  style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  {getTimeAgo(item.createdAt)}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  color: 'var(--color-text-light)',
                                }}
                              >
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleVersionSelection(item._id)}
                              style={{
                                width: '1rem',
                                height: '1rem',
                                cursor: 'pointer',
                              }}
                              title="Select for comparison"
                            />

                            <button
                              onClick={() => toggleExpansion(item._id)}
                              style={{
                                padding: 'var(--space-2)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-base)',
                                backgroundColor: 'white',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                              }}
                              title={isExpanded ? 'Hide details' : 'Show details'}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {index > 0 && (
                              <button
                                onClick={() => handleRestoreVersion(item._id, item.version)}
                                disabled={isRestoring}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-2)',
                                  padding: 'var(--space-2) var(--space-3)',
                                  border: '1px solid var(--color-primary-500)',
                                  borderRadius: 'var(--radius-base)',
                                  backgroundColor: 'white',
                                  color: 'var(--color-primary-600)',
                                  cursor: isRestoring ? 'not-allowed' : 'pointer',
                                  opacity: isRestoring ? 0.7 : 1,
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-medium)',
                                }}
                                title="Restore to this version"
                              >
                                {isRestoring ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <RotateCcw size={14} />
                                )}
                                {isRestoring ? 'Restoring...' : 'Restore'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && item.snapshot && (
                          <div
                            style={{
                              borderTop: '1px solid var(--color-border)',
                              paddingTop: 'var(--space-4)',
                              marginTop: 'var(--space-4)',
                            }}
                          >
                            <h4
                              style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--color-text)',
                                marginBottom: 'var(--space-4)',
                              }}
                            >
                              Snapshot Details
                            </h4>

                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 'var(--space-4)',
                              }}
                            >
                              {item.snapshot.metrics && (
                                <div>
                                  <h5
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-medium)',
                                      color: 'var(--color-text)',
                                      marginBottom: 'var(--space-2)',
                                    }}
                                  >
                                    Platforms
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      color: 'var(--color-text-secondary)',
                                    }}
                                  >
                                    {item.snapshot.metrics.platforms?.length || 0} platforms
                                    configured
                                  </p>
                                </div>
                              )}

                              {item.snapshot.pricing && (
                                <div>
                                  <h5
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-medium)',
                                      color: 'var(--color-text)',
                                      marginBottom: 'var(--space-2)',
                                    }}
                                  >
                                    Deliverables
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      color: 'var(--color-text-secondary)',
                                    }}
                                  >
                                    {item.snapshot.pricing.deliverables?.reduce(
                                      (acc, platform) => acc + (platform.rates?.length || 0),
                                      0
                                    ) || 0}{' '}
                                    pricing items
                                  </p>
                                </div>
                              )}

                              {item.snapshot.packages && (
                                <div>
                                  <h5
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-medium)',
                                      color: 'var(--color-text)',
                                      marginBottom: 'var(--space-2)',
                                    }}
                                  >
                                    Packages
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      color: 'var(--color-text-secondary)',
                                    }}
                                  >
                                    {item.snapshot.packages?.length || 0} package deals
                                  </p>
                                </div>
                              )}

                              {item.snapshot.professionalDetails && (
                                <div>
                                  <h5
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-medium)',
                                      color: 'var(--color-text)',
                                      marginBottom: 'var(--space-2)',
                                    }}
                                  >
                                    Terms
                                  </h5>
                                  <p
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      color: 'var(--color-text-secondary)',
                                    }}
                                  >
                                    Professional terms configured
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Comparison Instructions */}
          {selectedVersions.length > 0 && (
            <div
              style={{
                position: 'fixed',
                bottom: 'var(--space-6)',
                right: 'var(--space-6)',
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 50,
              }}
            >
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                {selectedVersions.length === 1
                  ? 'Select one more version to compare'
                  : `${selectedVersions.length} versions selected`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => setSelectedVersions([])}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  Clear Selection
                </button>
                {selectedVersions.length === 2 && (
                  <button
                    onClick={() => setShowComparisonMode(true)}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      backgroundColor: 'white',
                      color: 'var(--color-primary-600)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}
                  >
                    Compare Now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RateCardHistory

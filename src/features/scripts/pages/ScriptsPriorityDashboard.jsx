import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Edit3,
  Eye,
  FileText,
  Flame,
  HardDrive,
  Hash,
  Layers,
  Link2,
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Video,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { scriptsAPI } from '../../../api/endpoints/scripts'
import useScriptsStore from '../../../store/scriptsStore'

const ScriptsPriorityDashboard = () => {
  const navigate = useNavigate()

  // Store state
  const { dashboardStats, fetchScripts, fetchDashboardStats, deleteScript, regenerateScript } =
    useScriptsStore()

  // Local state
  const [attentionScripts, setAttentionScripts] = useState([])
  const [scriptsByStatus, setScriptsByStatus] = useState({})
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoadingAttention, setIsLoadingAttention] = useState(false)
  const [isLoadingByStatus, setIsLoadingByStatus] = useState(false)
  const [uploadLimits, setUploadLimits] = useState(null)
  const [scriptsHealth, setScriptsHealth] = useState(null)
  const [selectedScriptAnalysis, setSelectedScriptAnalysis] = useState(null)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    urgent: true,
    pending: true,
    review: true,
    optimization: true,
  })

  // Advanced search state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState({
    query: '',
    platform: '',
    status: '',
    inputType: '',
    dateFrom: '',
    dateTo: '',
    tags: [],
    hasDeals: null,
    minComplexity: 0,
    maxComplexity: 100,
    minViews: 0,
    generationStatus: '',
  })

  // Priority categories
  const priorityCategories = {
    urgent: {
      label: 'Urgent Attention',
      icon: Flame,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      borderColor: '#FECACA',
      description: 'Scripts requiring immediate action',
    },
    pending: {
      label: 'Pending Generation',
      icon: Clock,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      description: 'Waiting for AI processing',
    },
    review: {
      label: 'Needs Review',
      icon: Eye,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      borderColor: '#BFDBFE',
      description: 'Ready for review and approval',
    },
    optimization: {
      label: 'Optimization Suggested',
      icon: TrendingUp,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      borderColor: '#DDD6FE',
      description: 'Performance can be improved',
    },
  }

  // Fetch initial data
  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchAttentionScripts(),
        fetchUploadLimits(),
        //  TEMP
        // No need to call health route, also validation is failing
        // fetchScriptsHealth(),
      ])
    }

    initializeDashboard()

    // Set up auto-refresh for attention scripts
    const refreshInterval = setInterval(() => {
      fetchAttentionScripts()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [])

  // Fetch scripts needing attention
  const fetchAttentionScripts = async () => {
    setIsLoadingAttention(true)
    try {
      const response = await scriptsAPI.getScriptsNeedingAttention()
      if (response.success) {
        setAttentionScripts(response.data.scripts || [])
      }
    } catch (error) {
      console.error('Failed to fetch attention scripts:', error)
      toast.error('Failed to load priority scripts')
    } finally {
      setIsLoadingAttention(false)
    }
  }

  // Fetch scripts by status
  const fetchScriptsByStatus = async (status) => {
    if (status === 'all') {
      await fetchScripts()
      return
    }

    setIsLoadingByStatus(true)
    try {
      const response = await scriptsAPI.getScriptsByStatus(status)
      if (response.success) {
        setScriptsByStatus((prev) => ({
          ...prev,
          [status]: response.data.scripts || [],
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch scripts with status ${status}:`, error)
      toast.error('Failed to load scripts by status')
    } finally {
      setIsLoadingByStatus(false)
    }
  }

  // Fetch upload limits
  const fetchUploadLimits = async () => {
    try {
      const response = await scriptsAPI.getUploadLimits()
      if (response.success) {
        setUploadLimits(response.data?.limits)
      }
    } catch (error) {
      console.error('Failed to fetch upload limits:', error)
    }
  }

  // Fetch scripts health
  const fetchScriptsHealth = async () => {
    try {
      const response = await scriptsAPI.getScriptsHealth()
      if (response.success) {
        setScriptsHealth(response.data.health)
      }
    } catch (error) {
      console.error('Failed to fetch scripts health:', error)
    }
  }

  // Fetch individual script analysis
  const fetchScriptAnalysis = async (scriptId) => {
    try {
      const response = await scriptsAPI.getScriptAnalysis(scriptId)
      if (response.success) {
        setSelectedScriptAnalysis(response.data.analysis)
        setShowAnalysisModal(true)
      }
    } catch (error) {
      console.error('Failed to fetch script analysis:', error)
      toast.error('Failed to load script analysis')
    }
  }

  // Advanced search
  const performAdvancedSearch = async () => {
    try {
      // Clean up search criteria
      const cleanedCriteria = Object.entries(searchCriteria).reduce((acc, [key, value]) => {
        if (
          value !== '' &&
          value !== null &&
          value !== 0 &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          acc[key] = value
        }
        return acc
      }, {})

      const response = await scriptsAPI.searchScripts(cleanedCriteria)
      if (response.success) {
        // Update store with search results
        toast.success(`Found ${response.data.scripts.length} scripts`)
        setShowAdvancedSearch(false)
      }
    } catch (error) {
      console.error('Advanced search failed:', error)
      toast.error('Search failed')
    }
  }

  // Handle status filter change
  const handleStatusFilter = useCallback((status) => {
    setSelectedStatus(status)
    fetchScriptsByStatus(status)
  }, [])

  // Handle script actions
  const handleRegenerateScript = async (scriptId) => {
    try {
      await regenerateScript(scriptId)
      toast.success('Script regeneration started')
      // Refresh attention scripts after regeneration
      setTimeout(fetchAttentionScripts, 2000)
    } catch (error) {
      toast.error('Failed to regenerate script')
    }
  }

  const handleDeleteScript = async (scriptId) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        await deleteScript(scriptId)
        toast.success('Script deleted successfully')
        fetchAttentionScripts()
      } catch (error) {
        toast.error('Failed to delete script')
      }
    }
  }

  // Categorize attention scripts
  const categorizedScripts = useMemo(() => {
    const categories = {
      urgent: [],
      pending: [],
      review: [],
      optimization: [],
    }

    attentionScripts.forEach((script) => {
      // Urgent: Failed generation or critical issues
      if (
        script.aiGeneration?.status === 'failed' ||
        script.attentionReason?.includes('critical')
      ) {
        categories.urgent.push(script)
      }
      // Pending: Processing or waiting
      else if (script.aiGeneration?.status === 'processing' || script.status === 'draft') {
        categories.pending.push(script)
      }
      // Review: Ready for review or approval
      else if (script.status === 'generated' || script.status === 'reviewed') {
        categories.review.push(script)
      }
      // Optimization: Low performance or missing elements
      else if (
        script.viewCount < 10 ||
        script.complexityScore < 60 ||
        !script.dealConnection?.isLinked
      ) {
        categories.optimization.push(script)
      }
    })

    return categories
  }, [attentionScripts])

  // Format functions
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: '#64748b',
      generated: '#3b82f6',
      reviewed: '#f59e0b',
      approved: '#10b981',
      in_production: '#8b5cf6',
      completed: '#059669',
      failed: '#ef4444',
    }
    return colors[status] || '#64748b'
  }

  const getInputTypeIcon = (inputType) => {
    const icons = {
      text_brief: FileText,
      file_upload: Upload,
      video_transcription: Video,
    }
    return icons[inputType] || FileText
  }

  const getPriorityLevel = (script) => {
    if (script.aiGeneration?.status === 'failed') return 'critical'
    if (script.attentionReason?.includes('urgent')) return 'high'
    if (script.status === 'draft' && script.daysOld > 7) return 'medium'
    return 'low'
  }

  const getPriorityColor = (level) => {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981',
    }
    return colors[level] || '#64748b'
  }

  // Render script card
  const renderScriptCard = (script, category) => {
    const InputIcon = getInputTypeIcon(script.inputType)
    const priorityLevel = getPriorityLevel(script)
    const priorityColor = getPriorityColor(priorityLevel)

    return (
      <div
        key={script._id || script.id}
        className="script-card"
        onClick={() => navigate(`/scripts/${script._id || script.id}`)}
      >
        <div className="script-header">
          <div className="script-priority">
            <div className="priority-indicator" style={{ backgroundColor: priorityColor }} />
            <span className="priority-text" style={{ color: priorityColor }}>
              {priorityLevel.toUpperCase()}
            </span>
          </div>

          <div className="script-actions">
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation()
                fetchScriptAnalysis(script._id || script.id)
              }}
              title="View Analysis"
            >
              <BarChart3 size={14} />
            </button>

            {script.aiGeneration?.status === 'failed' && (
              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRegenerateScript(script._id || script.id)
                }}
                title="Regenerate"
              >
                <RefreshCw size={14} />
              </button>
            )}

            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/scripts/${script._id || script.id}/edit`)
              }}
              title="Edit"
            >
              <Edit3 size={14} />
            </button>

            <button
              className="action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteScript(script._id || script.id)
              }}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="script-title">{script.title || 'Untitled Script'}</h3>

        <div className="script-meta">
          <span className="meta-item">
            <InputIcon size={12} />
            {script.inputType?.replace(/_/g, ' ')}
          </span>

          <span className="meta-item">
            <Hash size={12} />
            {script.platform?.replace(/_/g, ' ')}
          </span>

          <span
            className="status-badge"
            style={{
              backgroundColor: `${getStatusColor(script.status)}20`,
              color: getStatusColor(script.status),
            }}
          >
            {script.status}
          </span>
        </div>

        {script.attentionReason && (
          <div className="attention-reason">
            <AlertCircle size={12} />
            {script.attentionReason}
          </div>
        )}

        <div className="script-stats">
          <div className="stat-item">
            <Eye size={12} />
            <span>{script.viewCount || 0} views</span>
          </div>

          <div className="stat-item">
            <Target size={12} />
            <span>{script.complexityScore || 0}/100</span>
          </div>

          {script.dealConnection?.isLinked && (
            <div className="stat-item">
              <Link2 size={12} />
              <span>Linked</span>
            </div>
          )}
        </div>

        <div className="script-footer">
          <span className="footer-text">Created {formatDate(script.createdAt)}</span>

          {script.aiGeneration?.status === 'processing' && (
            <div className="processing-indicator">
              <Loader2 size={12} className="spin" />
              Processing...
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render analysis modal
  const renderAnalysisModal = () => {
    if (!showAnalysisModal || !selectedScriptAnalysis) return null

    const analysis = selectedScriptAnalysis

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">Script Analysis</h2>
            <button className="modal-close" onClick={() => setShowAnalysisModal(false)}>
              <XCircle size={20} />
            </button>
          </div>

          <div className="modal-content">
            {/* Performance Metrics */}
            <div className="analysis-section">
              <h3 className="analysis-title">
                <Activity size={16} />
                Performance Metrics
              </h3>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Engagement Rate</div>
                  <div className="metric-value">{analysis.engagementRate || 0}%</div>
                  <div className="metric-trend">
                    {analysis.engagementTrend === 'up' ? (
                      <ArrowUpRight size={14} style={{ color: '#10B981' }} />
                    ) : (
                      <ArrowDownRight size={14} style={{ color: '#EF4444' }} />
                    )}
                    <span>{analysis.engagementChange || 0}%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Completion Rate</div>
                  <div className="metric-value">{analysis.completionRate || 0}%</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Share Count</div>
                  <div className="metric-value">{analysis.shareCount || 0}</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Conversion Rate</div>
                  <div className="metric-value">{analysis.conversionRate || 0}%</div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {analysis.aiInsights && (
              <div className="analysis-section">
                <h3 className="analysis-title">
                  <Brain size={16} />
                  AI Insights
                </h3>

                <div className="insights-list">
                  {analysis.aiInsights.map((insight, index) => (
                    <div key={index} className="insight-item">
                      <Sparkles size={14} style={{ color: '#8B5CF6' }} />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && (
              <div className="analysis-section">
                <h3 className="analysis-title">
                  <Target size={16} />
                  Recommendations
                </h3>

                <div className="recommendations-list">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <div className="recommendation-icon">
                        <CheckCircle size={14} style={{ color: '#10B981' }} />
                      </div>
                      <div>
                        <div className="recommendation-title">{rec.title}</div>
                        <div className="recommendation-text">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowAnalysisModal(false)}>
              Close
            </button>

            <button
              className="btn-primary"
              onClick={() => {
                navigate(`/scripts/${selectedScriptAnalysis.scriptId}/edit`)
              }}
            >
              Edit Script
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render advanced search panel
  const renderAdvancedSearch = () => {
    if (!showAdvancedSearch) return null

    return (
      <div className="search-panel">
        <div className="search-header">
          <h3 className="search-title">Advanced Search</h3>
          <button className="close-btn" onClick={() => setShowAdvancedSearch(false)}>
            <XCircle size={18} />
          </button>
        </div>

        <div className="search-grid">
          <div className="search-field">
            <label className="field-label">Search Query</label>
            <input
              type="text"
              value={searchCriteria.query}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  query: e.target.value,
                }))
              }
              placeholder="Enter keywords..."
              className="form-input"
            />
          </div>

          <div className="search-field">
            <label className="field-label">Platform</label>
            <select
              value={searchCriteria.platform}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  platform: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="">All Platforms</option>
              <option value="instagram_reel">Instagram Reel</option>
              <option value="youtube_shorts">YouTube Shorts</option>
              <option value="linkedin_video">LinkedIn Video</option>
              <option value="tiktok_video">TikTok Video</option>
            </select>
          </div>

          <div className="search-field">
            <label className="field-label">Status</label>
            <select
              value={searchCriteria.status}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="generated">Generated</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="in_production">In Production</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="search-field">
            <label className="field-label">Input Type</label>
            <select
              value={searchCriteria.inputType}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  inputType: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="text_brief">Text Brief</option>
              <option value="file_upload">File Upload</option>
              <option value="video_transcription">Video Transcription</option>
            </select>
          </div>

          <div className="search-field">
            <label className="field-label">Date From</label>
            <input
              type="date"
              value={searchCriteria.dateFrom}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  dateFrom: e.target.value,
                }))
              }
              className="form-input"
            />
          </div>

          <div className="search-field">
            <label className="field-label">Date To</label>
            <input
              type="date"
              value={searchCriteria.dateTo}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  dateTo: e.target.value,
                }))
              }
              className="form-input"
            />
          </div>

          <div className="search-field">
            <label className="field-label">Has Deal Connection</label>
            <select
              value={searchCriteria.hasDeals ?? ''}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  hasDeals: e.target.value === '' ? null : e.target.value === 'true',
                }))
              }
              className="form-select"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="search-field">
            <label className="field-label">AI Generation Status</label>
            <select
              value={searchCriteria.generationStatus}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  generationStatus: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="">Any</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="search-field">
            <label className="field-label">Min Complexity: {searchCriteria.minComplexity}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={searchCriteria.minComplexity}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  minComplexity: parseInt(e.target.value),
                }))
              }
              className="form-slider"
            />
          </div>

          <div className="search-field">
            <label className="field-label">Max Complexity: {searchCriteria.maxComplexity}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={searchCriteria.maxComplexity}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  maxComplexity: parseInt(e.target.value),
                }))
              }
              className="form-slider"
            />
          </div>
        </div>

        <div className="search-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchCriteria({
                query: '',
                platform: '',
                status: '',
                inputType: '',
                dateFrom: '',
                dateTo: '',
                tags: [],
                hasDeals: null,
                minComplexity: 0,
                maxComplexity: 100,
                minViews: 0,
                generationStatus: '',
              })
            }}
          >
            Reset
          </button>

          <button className="btn-primary" onClick={performAdvancedSearch}>
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">
          <h1 className="dashboard-title">
            <Shield size={28} />
            Scripts Priority Dashboard
          </h1>

          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              <Search size={16} />
              Advanced Search
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                fetchAttentionScripts()
                fetchDashboardStats()
                toast.success('Dashboard refreshed')
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button className="btn-primary" onClick={() => navigate('/scripts/create')}>
              <PlusCircle size={16} />
              Create Script
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card urgent">
            <div className="stat-icon">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Needs Attention</div>
              <div className="stat-value">{attentionScripts.length}</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Processing</div>
              <div className="stat-value">
                {attentionScripts.filter((s) => s.aiGeneration?.status === 'processing').length}
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Success Rate</div>
              <div className="stat-value">{dashboardStats?.generationRate || 0}%</div>
            </div>
          </div>

          <div className="stat-card primary">
            <div className="stat-icon">
              <Layers size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Scripts</div>
              <div className="stat-value">{dashboardStats?.totalScripts || 0}</div>
            </div>
          </div>
        </div>

        {/* System Info */}
        {(uploadLimits || scriptsHealth) && (
          <div className="system-info">
            {scriptsHealth && (
              <div className="system-item">
                <div
                  className={`system-status ${scriptsHealth.status === 'healthy' ? 'healthy' : 'unhealthy'}`}
                />
                <span>System {scriptsHealth.status || 'Unknown'}</span>
              </div>
            )}

            {uploadLimits && (
              <>
                <div className="system-item">
                  <HardDrive size={14} />
                  <span>Max file: {formatFileSize(uploadLimits.maxFileSize)}</span>
                </div>

                <div className="system-item">
                  <Video size={14} />
                  <span>Max video: {formatFileSize(uploadLimits.maxVideoSize)}</span>
                </div>

                <div className="system-item">
                  <Database size={14} />
                  <span>Storage: {uploadLimits.storageUsed}% used</span>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Advanced Search Panel */}
      {renderAdvancedSearch()}

      {/* Enhanced Status Filters */}
      <div className="status-filters">
        <div className="filter-tabs">
          {['all', 'draft', 'generated', 'reviewed', 'approved', 'in_production', 'completed'].map(
            (status) => (
              <button
                key={status}
                className={`filter-tab ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => handleStatusFilter(status)}
              >
                <span className="tab-label">
                  {status === 'all'
                    ? 'All Scripts'
                    : status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                {status !== 'all' && scriptsByStatus[status] && (
                  <span className="tab-count">{scriptsByStatus[status].length}</span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-content">
        {isLoadingAttention || isLoadingByStatus ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <h3 className="loading-title">Loading scripts...</h3>
          </div>
        ) : selectedStatus === 'all' ? (
          <div className="priority-sections">
            {Object.entries(priorityCategories).map(([key, category]) => {
              const scripts = categorizedScripts[key] || []
              const Icon = category.icon
              const isExpanded = expandedSections[key]

              return (
                <div key={key} className="priority-section">
                  <div
                    className="section-header"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    style={{ borderLeft: `4px solid ${category.color}` }}
                  >
                    <div className="section-title">
                      <div
                        className="section-icon"
                        style={{
                          backgroundColor: category.bgColor,
                          color: category.color,
                          border: `1px solid ${category.borderColor}`,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="section-text">
                        <div className="section-name">{category.label}</div>
                        <div className="section-description">{category.description}</div>
                      </div>
                    </div>

                    <div className="section-meta">
                      <div className="section-count">
                        {scripts.length} script{scripts.length !== 1 ? 's' : ''}
                      </div>

                      <button className="expand-btn">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="section-content">
                      {scripts.length > 0 ? (
                        <div className="scripts-grid">
                          {scripts.map((script) => renderScriptCard(script, key))}
                        </div>
                      ) : (
                        <div className="empty-section">
                          <div className="empty-icon">📋</div>
                          <div className="empty-text">No scripts in this category</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="scripts-grid">
            {(scriptsByStatus[selectedStatus] || []).map((script) =>
              renderScriptCard(script, 'filtered')
            )}
          </div>
        )}
      </main>

      {/* Analysis Modal */}
      {renderAnalysisModal()}

      <style>{`
        /* Design System Variables */
        .dashboard-container {
          --primary-50: #f5f3ff;
          --primary-100: #ede9fe;
          --primary-500: #8b5cf6;
          --primary-600: #7c3aed;
          --primary-700: #6d28d9;

          --secondary-500: #ec4899;
          --accent-500: #3b82f6;

          --neutral-0: #ffffff;
          --neutral-50: #fafafa;
          --neutral-100: #f4f4f5;
          --neutral-200: #e4e4e7;
          --neutral-300: #d4d4d8;
          --neutral-400: #a1a1aa;
          --neutral-500: #71717a;
          --neutral-600: #52525b;
          --neutral-700: #3f3f46;
          --neutral-800: #27272a;
          --neutral-900: #18181b;

          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --info: #3b82f6;

          --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%);
          --gradient-light: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          --gradient-mesh:
            radial-gradient(at 40% 20%, hsla(280, 100%, 74%, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(330, 100%, 71%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(217, 100%, 62%, 0.1) 0px, transparent 50%);

          --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          --shadow-purple: 0 10px 40px -10px rgba(139, 92, 246, 0.25);

          --radius-sm: 0.375rem;
          --radius-md: 0.5rem;
          --radius-lg: 0.75rem;
          --radius-xl: 1rem;

          --ease-out: cubic-bezier(0, 0, 0.2, 1);
          --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

          min-height: 100vh;
          background:
            var(--gradient-mesh),
            linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-100) 100%);
          font-family:
            'Plus Jakarta Sans',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
          color: var(--neutral-900);
        }

        /* Header Styles */
        .dashboard-header {
          background: var(--neutral-0);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--neutral-200);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* Button Styles */
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--gradient-primary);
          color: var(--neutral-0);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          box-shadow: var(--shadow-purple);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(139, 92, 246, 0.4);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          background: var(--neutral-0);
          color: var(--primary-600);
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          backdrop-filter: blur(8px);
        }

        .btn-secondary:hover {
          border-color: var(--primary-500);
          background: var(--primary-50);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--neutral-0);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s var(--ease-out);
          border: 1px solid var(--neutral-200);
          box-shadow: var(--shadow-xs);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s var(--ease-out);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card.urgent .stat-icon {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: var(--error);
        }

        .stat-card.warning .stat-icon {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: var(--warning);
        }

        .stat-card.success .stat-icon {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: var(--success);
        }

        .stat-card.primary .stat-icon {
          background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%);
          color: var(--primary-600);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: var(--neutral-500);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.375rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--neutral-900);
          line-height: 1;
          letter-spacing: -0.025em;
        }

        /* System Info */
        .system-info {
          display: flex;
          gap: 2rem;
          align-items: center;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-50) 100%);
          border-radius: var(--radius-lg);
          border: 1px solid var(--neutral-200);
          backdrop-filter: blur(8px);
        }

        .system-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--neutral-600);
          font-weight: 500;
        }

        .system-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
        }

        .system-status.healthy {
          background: var(--success);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .system-status.unhealthy {
          background: var(--error);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        .system-status.healthy::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }

        /* Search Panel */
        .search-panel {
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          margin: 0 2rem 1.5rem 2rem;
          box-shadow: var(--shadow-glass);
          backdrop-filter: blur(20px);
        }

        .search-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin: 0;
        }

        .close-btn {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: var(--neutral-500);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s var(--ease-out);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .search-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-700);
        }

        .form-input,
        .form-select {
          padding: 0.875rem 1rem;
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--neutral-700);
          background: var(--neutral-0);
          transition: all 0.2s var(--ease-out);
          outline: none;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-select {
          cursor: pointer;
        }

        .form-slider {
          width: 100%;
          cursor: pointer;
        }

        .search-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        /* Status Filters */
        .status-filters {
          background: var(--neutral-0);
          border-bottom: 1px solid var(--neutral-200);
          position: sticky;
          top: 140px;
          z-index: 90;
          backdrop-filter: blur(20px);
        }

        .filter-tabs {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .filter-tabs::-webkit-scrollbar {
          display: none;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-500);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .filter-tab:hover {
          color: var(--primary-600);
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.05) 100%);
        }

        .filter-tab.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-500);
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.1) 100%);
        }

        .tab-label {
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .tab-count {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-600);
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .filter-tab.active .tab-count {
          background: var(--primary-500);
          color: var(--neutral-0);
        }

        /* Main Content */
        .dashboard-content {
          padding: 2rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          text-align: center;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-500);
          margin-bottom: 1rem;
        }

        .loading-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--neutral-600);
          margin: 0;
        }

        .priority-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .priority-section {
          background: var(--neutral-0);
          border-radius: var(--radius-xl);
          border: 1px solid var(--neutral-200);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s var(--ease-out);
        }

        .priority-section:hover {
          box-shadow: var(--shadow-lg);
        }

        .section-header {
          padding: 1.75rem;
          border-bottom: 1px solid var(--neutral-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          background: linear-gradient(135deg, var(--neutral-50) 0%, rgba(255, 255, 255, 0.8) 100%);
          backdrop-filter: blur(8px);
        }

        .section-header:hover {
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.05) 100%);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .section-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .section-text {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .section-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--neutral-900);
          letter-spacing: -0.025em;
        }

        .section-description {
          font-size: 0.875rem;
          color: var(--neutral-500);
          font-weight: 500;
        }

        .section-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-count {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--neutral-600);
          border: 1px solid var(--neutral-300);
        }

        .expand-btn {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: var(--neutral-500);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s var(--ease-out);
        }

        .expand-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-600);
        }

        .section-content {
          padding: 1.75rem;
        }

        .scripts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }

        .empty-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          color: var(--neutral-500);
          font-weight: 500;
          font-style: italic;
        }

        /* Script Card */
        .script-card {
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s var(--ease-out);
          box-shadow: var(--shadow-xs);
          position: relative;
          overflow: hidden;
        }

        .script-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s var(--ease-out);
        }

        .script-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-300);
        }

        .script-card:hover::before {
          transform: scaleX(1);
        }

        .script-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .script-priority {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .priority-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .priority-text {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .script-actions {
          display: flex;
          gap: 0.375rem;
        }

        .action-btn {
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          color: var(--neutral-400);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-600);
          transform: scale(1.1);
        }

        .action-btn.delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .script-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin: 0 0 1rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .script-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--neutral-500);
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-lg);
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .attention-reason {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: #92400e;
          margin-bottom: 1rem;
          font-weight: 500;
          border: 1px solid #fcd34d;
        }

        .script-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--neutral-600);
          font-weight: 600;
        }

        .script-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--neutral-200);
        }

        .footer-text {
          font-size: 0.6875rem;
          color: var(--neutral-400);
          font-weight: 500;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.6875rem;
          color: var(--warning);
          font-weight: 600;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }

        .modal {
          background: var(--neutral-0);
          border-radius: var(--radius-xl);
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--neutral-200);
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid var(--neutral-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-0) 100%);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--neutral-900);
          margin: 0;
          letter-spacing: -0.025em;
        }

        .modal-close {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: var(--neutral-500);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s var(--ease-out);
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .modal-content {
          flex: 1;
          padding: 2rem;
          overflow: auto;
        }

        .modal-footer {
          padding: 2rem;
          border-top: 1px solid var(--neutral-200);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          background: var(--neutral-50);
        }

        .analysis-section {
          margin-bottom: 2.5rem;
        }

        .analysis-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.025em;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .metric-card {
          background: linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-0) 100%);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          text-align: center;
          border: 1px solid var(--neutral-200);
          transition: all 0.2s var(--ease-out);
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--neutral-500);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--neutral-900);
          line-height: 1;
          letter-spacing: -0.025em;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          color: var(--neutral-700);
          font-weight: 500;
          border: 1px solid var(--primary-200);
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .recommendation-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-lg);
        }

        .recommendation-icon {
          flex-shrink: 0;
        }

        .recommendation-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 0.5rem;
        }

        .recommendation-text {
          font-size: 0.875rem;
          color: var(--neutral-600);
          line-height: 1.5;
        }

        /* Animations */
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .dashboard-header {
            padding: 1.5rem;
          }

          .dashboard-content {
            padding: 1.5rem;
          }

          .scripts-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1rem;
          }

          .header-top {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .header-actions {
            justify-content: center;
          }

          .dashboard-content {
            padding: 1rem;
          }

          .scripts-grid {
            grid-template-columns: 1fr;
          }

          .stats-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .system-info {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .filter-tabs {
            padding: 0 1rem;
          }

          .search-grid {
            grid-template-columns: 1fr;
          }

          .modal {
            width: 95%;
            max-height: 95vh;
          }

          .modal-header,
          .modal-content,
          .modal-footer {
            padding: 1.5rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .dashboard-title {
            font-size: 1.5rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .section-header {
            padding: 1.25rem;
          }

          .section-content {
            padding: 1.25rem;
          }

          .script-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ScriptsPriorityDashboard

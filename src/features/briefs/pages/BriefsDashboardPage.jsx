/**
 * Briefs Dashboard Page - Main briefs management interface
 * Path: src/features/briefs/pages/BriefsDashboardPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  FileText,
  User,
  Clock,
  LayoutGrid,
  List,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Building,
  Target,
  Zap,
  Package,
  Activity,
  CreditCard,
  Info,
  ExternalLink,
  IndianRupee,
  Upload,
  Bot,
  MessageSquare,
  ArrowRight,
  Star,
  Layers,
  PieChart,
  BarChart3,
  Sparkles,
  Brain,
  Send,
  Timer,
  Percent
} from 'lucide-react';
import { useBriefStore, useAuthStore, useUIStore } from '../../../store';
import { briefHelpers } from '../../../api/endpoints';
import { toast } from 'react-hot-toast';

const BriefsDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sidebar } = useUIStore();
  const {
    // State
    briefs,
    dashboardStats,
    filters,
    pagination,
    currentBrief,
    
    // Loading states  
    briefsLoading,
    dashboardStatsLoading,
    
    // Actions
    fetchBriefs,
    fetchDashboardStats,
    setFilters,
    deleteBrief
  } = useBriefStore();
  
  // Local state
  const [viewType, setViewType] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActions, setShowActions] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Initialize data
    fetchDashboardStats();
    fetchBriefs();
  }, []);

  useEffect(() => {
    // Update filters when local state changes
    if (searchTerm !== filters.search) {
      const timeoutId = setTimeout(() => {
        setFilters({ search: searchTerm });
      }, 500); // Debounce search
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setFilters({ status });
  };

  const handleBriefClick = (briefId) => {
    navigate(`/briefs/${briefId}`);
  };

  const handleEditBrief = (e, briefId) => {
    e.stopPropagation();
    navigate(`/briefs/${briefId}/edit`);
  };

  const handleDeleteBrief = async (e, briefId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this brief? This action cannot be undone.')) {
      try {
        await deleteBrief(briefId);
        toast.success('Brief deleted successfully');
      } catch (error) {
        toast.error('Failed to delete brief');
      }
    }
  };

  const handleViewBrief = (e, briefId) => {
    e.stopPropagation();
    navigate(`/briefs/${briefId}`);
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Not specified';
    return briefHelpers.formatCurrency(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBriefStatusInfo = (status) => {
    const statusMap = {
      draft: { 
        color: '#94a3b8', 
        bg: 'rgba(148, 163, 184, 0.1)', 
        icon: FileText,
        label: 'Draft'
      },
      analyzed: { 
        color: '#3b82f6', 
        bg: 'rgba(59, 130, 246, 0.1)', 
        icon: Brain,
        label: 'Analyzed'
      },
      needs_clarification: { 
        color: '#f59e0b', 
        bg: 'rgba(245, 158, 11, 0.1)', 
        icon: MessageSquare,
        label: 'Needs Clarification'
      },
      ready_for_deal: { 
        color: '#10b981', 
        bg: 'rgba(16, 185, 129, 0.1)', 
        icon: CheckCircle,
        label: 'Ready for Deal'
      },
      converted: { 
        color: '#8b5cf6', 
        bg: 'rgba(139, 92, 246, 0.1)', 
        icon: ArrowRight,
        label: 'Converted'
      },
      archived: { 
        color: '#6b7280', 
        bg: 'rgba(107, 114, 128, 0.1)', 
        icon: Package,
        label: 'Archived'
      }
    };
    
    return statusMap[status] || statusMap.draft;
  };

  const getAIStatusInfo = (aiStatus) => {
    const statusMap = {
      pending: { color: '#94a3b8', label: 'Pending', icon: Clock },
      processing: { color: '#f59e0b', label: 'Processing...', icon: Bot },
      completed: { color: '#10b981', label: 'Completed', icon: CheckCircle },
      failed: { color: '#ef4444', label: 'Failed', icon: XCircle }
    };
    
    return statusMap[aiStatus] || statusMap.pending;
  };

  const isSidebarOpen = !sidebar?.isCollapsed;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.25rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flex: '1 1 auto'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0
    },
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.625rem',
      padding: '0.1875rem'
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
      transition: 'all 0.2s'
    },
    viewButtonActive: {
      backgroundColor: '#ffffff',
      color: '#6366f1',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerActions: {
      display: 'flex',
      gap: '0.625rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchBar: {
      position: 'relative',
      width: '280px'
    },
    searchInput: {
      width: '100%',
      padding: '0.5rem 1rem 0.5rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8'
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
      transition: 'all 0.2s'
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
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)'
    },
    uploadButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: '#ffffff',
      color: '#6366f1',
      border: '2px solid #6366f1',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.875rem'
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
      cursor: 'pointer'
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.625rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    statContent: {
      flex: 1,
      minWidth: 0
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      marginBottom: '0.125rem'
    },
    statValue: {
      fontSize: '1.375rem',
      fontWeight: '800',
      color: '#0f172a',
      lineHeight: 1
    },
    statChange: {
      fontSize: '0.6875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.25rem',
      fontWeight: '600'
    },
    content: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    statusFilters: {
      padding: '1rem 1.5rem 0',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9'
    },
    statusButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    statusButton: {
      padding: '0.375rem 0.75rem',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    statusButtonActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      color: '#ffffff'
    },
    briefsContainer: {
      flex: 1,
      padding: '1.25rem',
      overflow: 'auto'
    },
    briefsGrid: {
      display: 'grid',
      gridTemplateColumns: isSidebarOpen 
        ? 'repeat(auto-fill, minmax(340px, 1fr))'
        : 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      maxWidth: '100%'
    },
    briefsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    briefCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      padding: '1.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden'
    },
    briefCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    },
    briefHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem'
    },
    briefStatus: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '0.5rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    briefTitle: {
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.25rem',
      lineHeight: 1.3
    },
    briefType: {
      fontSize: '0.75rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontWeight: '500'
    },
    briefMoreButton: {
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
      transition: 'all 0.2s'
    },
    briefMeta: {
      display: 'flex',
      gap: '0.875rem',
      fontSize: '0.6875rem',
      color: '#94a3b8',
      marginBottom: '0.75rem',
      flexWrap: 'wrap'
    },
    briefMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    aiSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem'
    },
    aiStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    aiStatusIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    aiProgress: {
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    progressBar: {
      width: '60px',
      height: '4px',
      backgroundColor: '#e2e8f0',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.3s'
    },
    briefValue: {
      fontSize: '1.125rem',
      fontWeight: '800',
      color: '#059669',
      marginBottom: '0.5rem'
    },
    briefInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid #f1f5f9'
    },
    briefInfoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    briefInfoLabel: {
      fontSize: '0.625rem',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    briefInfoValue: {
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#334155'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      color: '#94a3b8',
      textAlign: 'center'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#475569',
      marginTop: '1rem',
      marginBottom: '0.5rem'
    },
    emptyDescription: {
      fontSize: '0.875rem',
      marginBottom: '1.5rem'
    },
    emptyActions: {
      display: 'flex',
      gap: '0.75rem'
    },
    briefActions: {
      position: 'absolute',
      top: '2rem',
      right: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
      padding: '0.375rem',
      zIndex: 100,
      minWidth: '160px'
    },
    briefAction: {
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
      transition: 'all 0.2s'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '1rem',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const renderBriefCard = (brief) => {
    const statusInfo = getBriefStatusInfo(brief.status);
    const StatusIcon = statusInfo.icon;
    const completionPercentage = brief.completionPercentage || 0;
    const estimatedValue = brief.estimatedValue || 0;
    const aiStatus = brief.aiExtraction?.status || 'pending';
    const aiStatusInfo = getAIStatusInfo(aiStatus);
    const AiIcon = aiStatusInfo.icon;

    return (
      <div
        key={brief._id}
        style={styles.briefCard}
        onClick={() => handleBriefClick(brief._id)}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, styles.briefCardHover);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        }}
      >
        <div style={styles.briefHeader}>
          <div style={{ flex: 1 }}>
            <div style={{
              ...styles.briefStatus,
              backgroundColor: statusInfo.bg,
              color: statusInfo.color
            }}>
              <StatusIcon size={12} />
              {statusInfo.label}
            </div>
            
            <div style={styles.briefTitle}>
              {brief.aiExtraction?.campaignInfo?.name || 
               brief.aiExtraction?.brandInfo?.name || 
               `Brief ${brief.briefId || brief._id.slice(-6)}`}
            </div>
            
            <div style={styles.briefType}>
              {brief.inputType === 'file_upload' ? <Upload size={12} /> : <FileText size={12} />}
              {briefHelpers.formatInputType(brief.inputType)}
            </div>
          </div>
          
          <button
            style={styles.briefMoreButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(showActions === brief._id ? null : brief._id);
            }}
          >
            <MoreVertical size={14} />
          </button>
          
          {showActions === brief._id && (
            <div style={styles.briefActions}>
              <button
                style={styles.briefAction}
                onClick={(e) => handleViewBrief(e, brief._id)}
              >
                <Eye size={12} />
                View Details
              </button>
              <button
                style={styles.briefAction}
                onClick={(e) => handleEditBrief(e, brief._id)}
              >
                <Edit2 size={12} />
                Edit Brief
              </button>
              <button
                style={styles.briefAction}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(brief._id);
                  toast.success('Brief ID copied');
                  setShowActions(null);
                }}
              >
                <Copy size={12} />
                Copy ID
              </button>
              {brief.status === 'ready_for_deal' && (
                <button
                  style={styles.briefAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/briefs/${brief._id}/convert`);
                  }}
                >
                  <ArrowRight size={12} />
                  Convert to Deal
                </button>
              )}
              <button
                style={{
                  ...styles.briefAction,
                  color: '#ef4444'
                }}
                onClick={(e) => handleDeleteBrief(e, brief._id)}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={styles.briefMeta}>
          <div style={styles.briefMetaItem}>
            <Calendar size={11} />
            {briefHelpers.formatBriefAge(brief.createdAt)}
          </div>
          <div style={styles.briefMetaItem}>
            <Clock size={11} />
            {briefHelpers.getDaysOld(brief.createdAt)}d old
          </div>
          {brief.aiExtraction?.deliverables?.length > 0 && (
            <div style={styles.briefMetaItem}>
              <Package size={11} />
              {brief.aiExtraction.deliverables.length} deliverables
            </div>
          )}
        </div>

        {/* AI Processing Section */}
        <div style={styles.aiSection}>
          <div style={styles.aiStatus}>
            <div style={{
              ...styles.aiStatusIcon,
              backgroundColor: `${aiStatusInfo.color}20`
            }}>
              <AiIcon size={12} color={aiStatusInfo.color} />
            </div>
            <div>
              <div style={styles.aiProgress}>
                {aiStatusInfo.label}
              </div>
              <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>
                AI Analysis
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${completionPercentage}%`
                }}
              />
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#334155' }}>
              {completionPercentage}%
            </span>
          </div>
        </div>

        {estimatedValue > 0 && (
          <div style={styles.briefValue}>
            {formatCurrency(estimatedValue)}
          </div>
        )}

        <div style={styles.briefInfo}>
          <div style={styles.briefInfoItem}>
            <span style={styles.briefInfoLabel}>Brand</span>
            <span style={styles.briefInfoValue}>
              {brief.aiExtraction?.brandInfo?.name || 'Not detected'}
            </span>
          </div>
          <div style={styles.briefInfoItem}>
            <span style={styles.briefInfoLabel}>Type</span>
            <span style={styles.briefInfoValue}>
              {brief.aiExtraction?.campaignInfo?.type || 'Unknown'}
            </span>
          </div>
          <div style={styles.briefInfoItem}>
            <span style={styles.briefInfoLabel}>Missing Info</span>
            <span style={styles.briefInfoValue}>
              {brief.aiExtraction?.missingInfo?.filter(info => info.importance === 'critical').length || 0} critical
            </span>
          </div>
          <div style={styles.briefInfoItem}>
            <span style={styles.briefInfoLabel}>Risk Level</span>
            <span style={{
              ...styles.briefInfoValue,
              color: brief.aiExtraction?.riskAssessment?.overallRisk === 'high' ? '#ef4444' :
                     brief.aiExtraction?.riskAssessment?.overallRisk === 'medium' ? '#f59e0b' : '#10b981'
            }}>
              {brief.aiExtraction?.riskAssessment?.overallRisk || 'Low'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const stats = dashboardStats || {
    totalBriefs: 0,
    analyzedBriefs: 0,
    readyForDeal: 0,
    convertedBriefs: 0,
    totalEstimatedValue: 0,
    analysisRate: 0
  };

  if (briefsLoading && (!briefs || briefs.length === 0)) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <span>Loading briefs...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Brand Brief Analyzer</h1>
            
            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'cards' ? styles.viewButtonActive : {})
                }}
                onClick={() => setViewType('cards')}
              >
                <LayoutGrid size={14} />
                Cards
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'list' ? styles.viewButtonActive : {})
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
                placeholder="Search briefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <button style={styles.filterButton}>
              <Filter size={14} />
              Filters
            </button>
            
            <button
              style={styles.uploadButton}
              onClick={() => navigate('/briefs/create?type=file')}
            >
              <Upload size={16} />
              Upload File
            </button>
            
            <button
              style={styles.createButton}
              onClick={() => navigate('/briefs/create')}
            >
              <Plus size={16} />
              New Brief
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} onClick={() => handleStatusFilter('all')}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }}>
              <FileText size={20} color="#6366f1" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Briefs</div>
              <div style={styles.statValue}>{stats.totalBriefs}</div>
              <div style={{
                ...styles.statChange,
                color: '#10b981'
              }}>
                <TrendingUp size={12} />
                Active pipeline
              </div>
            </div>
          </div>
          
          <div style={styles.statCard} onClick={() => handleStatusFilter('analyzed')}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }}>
              <Brain size={20} color="#3b82f6" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>AI Analyzed</div>
              <div style={styles.statValue}>{stats.analyzedBriefs}</div>
              <div style={{
                ...styles.statChange,
                color: '#3b82f6'
              }}>
                <Percent size={12} />
                {stats.analysisRate}% rate
              </div>
            </div>
          </div>
          
          <div style={styles.statCard} onClick={() => handleStatusFilter('ready_for_deal')}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Ready for Deal</div>
              <div style={styles.statValue}>{stats.readyForDeal}</div>
              <div style={{
                ...styles.statChange,
                color: '#10b981'
              }}>
                <Target size={12} />
                Conversion ready
              </div>
            </div>
          </div>
          
          <div style={styles.statCard} onClick={() => handleStatusFilter('converted')}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: 'rgba(139, 92, 246, 0.1)'
            }}>
              <ArrowRight size={20} color="#8b5cf6" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Converted</div>
              <div style={styles.statValue}>{stats.convertedBriefs}</div>
              <div style={{
                ...styles.statChange,
                color: '#8b5cf6'
              }}>
                <Sparkles size={12} />
                To deals
              </div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{
              ...styles.statIcon,
              backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }}>
              <IndianRupee size={20} color="#10b981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Est. Value</div>
              <div style={styles.statValue}>{formatCurrency(stats.totalEstimatedValue)}</div>
              <div style={{
                ...styles.statChange,
                color: '#64748b'
              }}>
                Total pipeline value
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div style={styles.statusFilters}>
        <div style={styles.statusButtons}>
          {[
            { value: 'all', label: 'All Briefs' },
            { value: 'draft', label: 'Draft' },
            { value: 'analyzed', label: 'Analyzed' },
            { value: 'needs_clarification', label: 'Needs Clarification' },
            { value: 'ready_for_deal', label: 'Ready for Deal' },
            { value: 'converted', label: 'Converted' }
          ].map(status => (
            <button
              key={status.value}
              style={{
                ...styles.statusButton,
                ...(selectedStatus === status.value ? styles.statusButtonActive : {})
              }}
              onClick={() => handleStatusFilter(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.briefsContainer}>
          {briefs && briefs.length > 0 ? (
            <div style={viewType === 'cards' ? styles.briefsGrid : styles.briefsList}>
              {briefs.map(renderBriefCard)}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FileText size={48} color="#cbd5e1" />
              <h3 style={styles.emptyTitle}>No briefs found</h3>
              <p style={styles.emptyDescription}>
                {selectedStatus === 'all' 
                  ? "Get started by creating your first brand brief. Upload a file or paste text to analyze collaboration opportunities."
                  : `No briefs found with status "${briefHelpers.formatBriefStatus(selectedStatus)}". Try adjusting your filters.`
                }
              </p>
              {selectedStatus === 'all' && (
                <div style={styles.emptyActions}>
                  <button
                    style={styles.createButton}
                    onClick={() => navigate('/briefs/create')}
                  >
                    <Plus size={16} />
                    Create Brief
                  </button>
                  <button
                    style={styles.uploadButton}
                    onClick={() => navigate('/briefs/create?type=file')}
                  >
                    <Upload size={16} />
                    Upload File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .brief-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .brief-action:hover {
          background-color: #f1f5f9;
        }
        
        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .filter-button:hover, .create-button:hover, .upload-button:hover {
          transform: translateY(-1px);
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default BriefsDashboardPage;
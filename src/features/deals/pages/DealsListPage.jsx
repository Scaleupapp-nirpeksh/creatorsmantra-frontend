/**
 * Deals List Page - Main Pipeline View
 * Path: src/features/deals/pages/DealsListPage.jsx
 * 
 * The core deals management interface with Kanban pipeline.
 * This is the main page users will interact with for deal management.
 * 
 * Features:
 * - Kanban board with 6 stages
 * - Drag & drop between stages
 * - Deal stats overview
 * - Search and filters
 * - Quick actions on cards
 * - Create new deal
 * - View toggle (Pipeline/Table)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  User,
  Clock,
  ChevronRight,
  Grid3X3,
  List,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { dealsAPI } from '../../../api/endpoints/deals';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-hot-toast';

const DealsListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // State
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('pipeline'); // pipeline or table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [stats, setStats] = useState({
    totalDeals: 0,
    totalValue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    dealsWon: 0,
    dealsLost: 0
  });
  
  // Drag state
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  
  // Pipeline stages configuration
  const stages = [
    { id: 'lead', name: 'Lead', color: '#8B5CF6', icon: AlertCircle },
    { id: 'negotiation', name: 'Negotiation', color: '#3B82F6', icon: Mail },
    { id: 'confirmed', name: 'Confirmed', color: '#10B981', icon: CheckCircle },
    { id: 'content_creation', name: 'Content Creation', color: '#F59E0B', icon: Edit2 },
    { id: 'delivered', name: 'Delivered', color: '#6366F1', icon: CheckCircle },
    { id: 'paid', name: 'Paid', color: '#22C55E', icon: DollarSign }
  ];

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
    fetchStats();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealsAPI.getDeals({
        search: searchTerm,
        stage: selectedStage === 'all' ? undefined : selectedStage
      });
      setDeals(response.data.deals || []);
    } catch (error) {
      toast.error('Failed to fetch deals');
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await dealsAPI.getDealSummary();
      
      // Map the response to match your stats state structure
      if (response.data && response.data.summary) {
        const summary = response.data.summary;
        setStats({
          totalDeals: summary.totalDeals || 0,
          totalValue: summary.totalValue || 0,
          avgDealSize: summary.avgDealValue || 0,
          conversionRate: summary.conversionRate || 0,
          dealsWon: summary.paidDeals || 0,
          dealsLost: 0 // This isn't provided by the API, you might need to calculate it
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        totalDeals: 0,
        totalValue: 0,
        avgDealSize: 0,
        conversionRate: 0,
        dealsWon: 0,
        dealsLost: 0
      });
    }
  };

  // Handle drag start
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  // Handle drop
  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedDeal && draggedDeal.stage !== stageId) {
      try {
        // Optimistic update
        const updatedDeals = deals.map(deal => 
          deal.id === draggedDeal.id 
            ? { ...deal, stage: stageId }
            : deal
        );
        setDeals(updatedDeals);
        
        // API call
        await dealsAPI.updateDealStage(draggedDeal.id, stageId);
        toast.success('Deal moved successfully');
        
        // Refresh stats
        fetchStats();
      } catch (error) {
        toast.error('Failed to move deal');
        fetchDeals(); // Revert on error
      }
    }
    
    setDraggedDeal(null);
  };

  // Handle deal click
  const handleDealClick = (dealId) => {
    navigate(`/deals/${dealId}`);
  };

  // Handle quick actions
  const handleEditDeal = (e, dealId) => {
    e.stopPropagation();
    navigate(`/deals/${dealId}/edit`);
  };

  const handleDeleteDeal = async (e, dealId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealsAPI.deleteDeal(dealId);
        toast.success('Deal deleted successfully');
        fetchDeals();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleDuplicateDeal = async (e, deal) => {
    e.stopPropagation();
    try {
      const newDeal = {
        ...deal,
        title: `${deal.title} (Copy)`,
        stage: 'lead'
      };
      delete newDeal.id;
      
      await dealsAPI.createDeal(newDeal);
      toast.success('Deal duplicated successfully');
      fetchDeals();
      fetchStats();
    } catch (error) {
      toast.error('Failed to duplicate deal');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Get deals by stage
  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  // Calculate stage value
  const getStageValue = (stageId) => {
    const stageDeals = getDealsByStage(stageId);
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f8fafc',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.5rem 2rem',
      flexShrink: 0
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    headerActions: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    searchBar: {
      position: 'relative',
      width: '320px'
    },
    searchInput: {
      width: '100%',
      padding: '0.625rem 0.875rem 0.625rem 2.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.125rem',
      height: '1.125rem',
      color: '#64748b'
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.5rem',
      padding: '0.25rem'
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 0.875rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    viewButtonActive: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    createButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '1.5rem'
    },
    statCard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    statChange: {
      fontSize: '0.75rem',
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    pipelineContainer: {
      flex: 1,
      padding: '1.5rem',
      overflowX: 'auto',
      overflowY: 'hidden'
    },
    pipeline: {
      display: 'flex',
      gap: '1rem',
      height: '100%',
      minWidth: 'fit-content'
    },
    stageColumn: {
      width: '320px',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s'
    },
    stageColumnDragOver: {
      backgroundColor: '#f0f9ff',
      borderColor: '#6366f1'
    },
    stageHeader: {
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    stageInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    stageIcon: {
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    stageName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a'
    },
    stageCount: {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    stageValue: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a'
    },
    dealsList: {
      flex: 1,
      padding: '0.75rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    dealCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1rem',
      cursor: 'move',
      transition: 'all 0.2s',
      position: 'relative'
    },
    dealCardDragging: {
      opacity: 0.5,
      transform: 'rotate(2deg)'
    },
    dealCardHover: {
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    },
    dealHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem'
    },
    dealTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    dealBrand: {
      fontSize: '0.75rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    dealMoreButton: {
      width: '1.75rem',
      height: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dealValue: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.75rem'
    },
    dealMeta: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.75rem',
      color: '#64748b'
    },
    dealMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    dealTags: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.75rem',
      flexWrap: 'wrap'
    },
    dealTag: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.25rem',
      fontSize: '0.6875rem',
      color: '#475569',
      fontWeight: '500'
    },
    dealActions: {
      position: 'absolute',
      top: '2.5rem',
      right: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      padding: '0.5rem',
      zIndex: 10,
      minWidth: '160px'
    },
    dealAction: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.8125rem',
      color: '#475569',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.2s'
    },
    dealActionHover: {
      backgroundColor: '#f8fafc'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      color: '#64748b'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontSize: '1rem',
      color: '#64748b'
    }
  };

  // Component state for showing actions menu
  const [showActions, setShowActions] = useState(null);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading deals...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.title}>Deals Pipeline</h1>
          
          <div style={styles.headerActions}>
            {/* Search */}
            <div style={styles.searchBar}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && fetchDeals()}
                style={styles.searchInput}
              />
            </div>
            
            {/* Filter */}
            <button style={styles.filterButton}>
              <Filter size={16} />
              Filters
            </button>
            
            {/* View Toggle */}
            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'pipeline' ? styles.viewButtonActive : {})
                }}
                onClick={() => setViewType('pipeline')}
              >
                <Grid3X3 size={16} />
                Pipeline
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewType === 'table' ? styles.viewButtonActive : {})
                }}
                onClick={() => setViewType('table')}
              >
                <List size={16} />
                Table
              </button>
            </div>
            
            {/* Create Deal */}
            <button
              style={styles.createButton}
              onClick={() => navigate('/deals/create')}
            >
              <Plus size={18} />
              New Deal
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Deals</span>
            <span style={styles.statValue}>{stats.totalDeals}</span>
            <span style={styles.statChange}>
              <TrendingUp size={12} />
              +12% this month
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Pipeline Value</span>
            <span style={styles.statValue}>{formatCurrency(stats.totalValue)}</span>
            <span style={styles.statChange}>
              <TrendingUp size={12} />
              +8% this month
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Avg Deal Size</span>
            <span style={styles.statValue}>{formatCurrency(stats.avgDealSize)}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Win Rate</span>
            <span style={styles.statValue}>{stats.conversionRate}%</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Deals Won</span>
            <span style={styles.statValue}>{stats.dealsWon}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Deals Lost</span>
            <span style={styles.statValue}>{stats.dealsLost}</span>
          </div>
        </div>
      </div>
      
      {/* Pipeline View */}
      {viewType === 'pipeline' && (
        <div style={styles.pipelineContainer}>
          <div style={styles.pipeline}>
            {stages.map(stage => {
              const StageIcon = stage.icon;
              const stageDeals = getDealsByStage(stage.id);
              const stageValue = getStageValue(stage.id);
              const isDragOver = dragOverStage === stage.id;
              
              return (
                <div
                  key={stage.id}
                  style={{
                    ...styles.stageColumn,
                    ...(isDragOver ? styles.stageColumnDragOver : {})
                  }}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={() => setDragOverStage(null)}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Stage Header */}
                  <div style={styles.stageHeader}>
                    <div style={styles.stageInfo}>
                      <div style={{
                        ...styles.stageIcon,
                        backgroundColor: `${stage.color}20`
                      }}>
                        <StageIcon size={16} color={stage.color} />
                      </div>
                      <div>
                        <div style={styles.stageName}>{stage.name}</div>
                        <div style={styles.stageCount}>{stageDeals.length} deals</div>
                      </div>
                    </div>
                    <div style={styles.stageValue}>
                      {formatCurrency(stageValue)}
                    </div>
                  </div>
                  
                  {/* Deals List */}
                  <div style={styles.dealsList}>
                    {stageDeals.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p>No deals in this stage</p>
                      </div>
                    ) : (
                      stageDeals.map(deal => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          onClick={() => handleDealClick(deal.id)}
                          style={{
                            ...styles.dealCard,
                            ...(draggedDeal?.id === deal.id ? styles.dealCardDragging : {})
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          {/* Deal Header */}
                          <div style={styles.dealHeader}>
                            <div>
                              <div style={styles.dealTitle}>{deal.title}</div>
                              <div style={styles.dealBrand}>
                                <User size={12} />
                                {deal.brandName || 'No brand'}
                              </div>
                            </div>
                            <button
                              style={styles.dealMoreButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(showActions === deal.id ? null : deal.id);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {/* Actions Menu */}
                            {showActions === deal.id && (
                              <div style={styles.dealActions}>
                                <button
                                  style={styles.dealAction}
                                  onClick={(e) => handleEditDeal(e, deal.id)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Edit2 size={14} />
                                  Edit Deal
                                </button>
                                <button
                                  style={styles.dealAction}
                                  onClick={(e) => handleDuplicateDeal(e, deal)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Copy size={14} />
                                  Duplicate
                                </button>
                                <button
                                  style={{
                                    ...styles.dealAction,
                                    color: '#ef4444'
                                  }}
                                  onClick={(e) => handleDeleteDeal(e, deal.id)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fef2f2';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Deal Value */}
                          <div style={styles.dealValue}>
                            {formatCurrency(deal.value || 0)}
                          </div>
                          
                          {/* Deal Meta */}
                          <div style={styles.dealMeta}>
                            <div style={styles.dealMetaItem}>
                              <Calendar size={12} />
                              {formatDate(deal.deadline)}
                            </div>
                            <div style={styles.dealMetaItem}>
                              <Clock size={12} />
                              {deal.daysInStage || 0} days
                            </div>
                          </div>
                          
                          {/* Deal Tags */}
                          {deal.deliverables && deal.deliverables.length > 0 && (
                            <div style={styles.dealTags}>
                              {deal.deliverables.slice(0, 2).map((deliverable, index) => (
                                <span key={index} style={styles.dealTag}>
                                  {deliverable}
                                </span>
                              ))}
                              {deal.deliverables.length > 2 && (
                                <span style={styles.dealTag}>
                                  +{deal.deliverables.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Table View - Placeholder for now */}
      {viewType === 'table' && (
        <div style={styles.pipelineContainer}>
          <div style={styles.emptyState}>
            <h3>Table view coming soon</h3>
            <p>Switch back to pipeline view to see your deals</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsListPage;
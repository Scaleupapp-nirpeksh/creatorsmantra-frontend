/**
 * Deal Details Page - Complete Redesign
 * Path: src/features/deals/pages/DealDetailsPage.jsx
 * 
 * Full-featured deal management with all backend endpoints integrated
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit2,
  Save,
  X,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Activity,
  Copy,
  ChevronRight,
  Send,
  Package,
  CreditCard,
  Shield,
  Star,
  Zap,
  RefreshCw,
  AlertTriangle,
  IndianRupee,
  Link2,
  Hash,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  ChevronDown,
  Upload,
  ExternalLink,
  Info
} from 'lucide-react';
import { dealsAPI } from '../../../api/endpoints/deals';
import useAuthStore from '../../../store/authStore';
import useUIStore from '../../../store/uiStore';
import { toast } from 'react-hot-toast';

const DealDetailsPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setPageLoading } = useUIStore();
  
  // Main state
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDeal, setEditedDeal] = useState({});
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Communications state
  const [communications, setCommunications] = useState([]);
  const [showAddComm, setShowAddComm] = useState(false);
  const [newComm, setNewComm] = useState({
    type: 'email',
    direction: 'outbound',
    subject: '',
    summary: '',
    outcome: 'neutral',
    nextAction: '',
    followUpDate: ''
  });
  
  // Deliverables state
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    type: 'instagram_post',
    quantity: 1,
    description: '',
    deadline: ''
  });
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  
  // Quick actions dropdown
  const [showActions, setShowActions] = useState(false);
  
  // Stage progression modal
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageNotes, setStageNotes] = useState('');

  // Stages configuration
  const stages = [
    { id: 'pitched', name: 'Pitched', color: '#8B5CF6', icon: Target },
    { id: 'in_talks', name: 'In Talks', color: '#3B82F6', icon: MessageSquare },
    { id: 'negotiating', name: 'Negotiating', color: '#06B6D4', icon: Users },
    { id: 'live', name: 'Live', color: '#F59E0B', icon: Activity },
    { id: 'completed', name: 'Completed', color: '#10B981', icon: CheckCircle },
    { id: 'paid', name: 'Paid', color: '#22C55E', icon: DollarSign },
    { id: 'cancelled', name: 'Cancelled', color: '#EF4444', icon: X },
    { id: 'rejected', name: 'Rejected', color: '#94A3B8', icon: X }
  ];

  // Format helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStageInfo = (stageId) => {
    return stages.find(s => s.id === stageId) || stages[0];
  };

  const calculateDealHealth = () => {
    if (!deal) return 0;
    let score = 100;
    
    // Check overdue timelines
    const now = new Date();
    if (deal.timeline?.contentDeadline && new Date(deal.timeline.contentDeadline) < now) {
      score -= 30;
    }
    if (deal.timeline?.paymentDueDate && new Date(deal.timeline.paymentDueDate) < now && deal.stage !== 'paid') {
      score -= 20;
    }
    
    // Check deliverables completion
    const pendingDeliverables = deal.deliverables?.filter(d => d.status !== 'completed').length || 0;
    score -= (pendingDeliverables * 5);
    
    return Math.max(0, Math.min(100, score));
  };

  const currentStage = deal ? getStageInfo(deal.stage) : null;
  const dealHealth = calculateDealHealth();

  // STYLES OBJECT - MOVED BEFORE ANY USAGE
  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.5rem 2rem'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#475569',
      fontSize: '0.875rem',
      cursor: 'pointer'
    },
    titleSection: {
      flex: 1,
      margin: '0 2rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      position: 'relative'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      color: '#475569',
      border: '1px solid #e2e8f0'
    },
    dangerButton: {
      backgroundColor: '#ef4444',
      color: '#ffffff'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 50,
      minWidth: '200px'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 1rem',
      fontSize: '0.875rem',
      color: '#475569',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    stageProgress: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 0',
      overflowX: 'auto'
    },
    stageItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s'
    },
    stageActive: {
      backgroundColor: currentStage?.color || '#8B5CF6',
      color: '#ffffff'
    },
    stageInactive: {
      backgroundColor: '#f1f5f9',
      color: '#64748b'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    statCard: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    content: {
      display: 'flex',
      gap: '1.5rem',
      padding: '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    mainColumn: {
      flex: '1 1 65%'
    },
    sideColumn: {
      flex: '1 1 35%'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1.25rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardContent: {
      padding: '1.25rem'
    },
    tabs: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0 1.25rem',
      borderBottom: '1px solid #e2e8f0'
    },
    tab: {
      padding: '0.875rem 0',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#6366f1',
      borderBottomColor: '#6366f1'
    },
    field: {
      marginBottom: '1rem'
    },
    fieldLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: '500',
      textTransform: 'uppercase',
      marginBottom: '0.25rem'
    },
    fieldValue: {
      fontSize: '0.9375rem',
      color: '#0f172a'
    },
    input: {
      width: '100%',
      padding: '0.625rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '0.9375rem'
    },
    textarea: {
      width: '100%',
      padding: '0.625rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '0.9375rem',
      minHeight: '100px',
      resize: 'vertical'
    },
    deliverableItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem'
    },
    communicationItem: {
      padding: '1rem',
      borderLeft: '3px solid #e2e8f0',
      marginBottom: '1rem'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '1rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    healthBar: {
      height: '6px',
      backgroundColor: '#e2e8f0',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '0.5rem'
    },
    healthFill: {
      height: '100%',
      backgroundColor: dealHealth > 70 ? '#10b981' : dealHealth > 40 ? '#f59e0b' : '#ef4444',
      transition: 'width 0.3s ease'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '1rem'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '1rem'
    }
  };

  // Fetch deal data
  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const response = await dealsAPI.getDeal(dealId);
      
      if (response.data) {
        const dealData = response.data.data || response.data;
        setDeal(dealData);
        setEditedDeal(dealData);
        
        // Fetch communications if deal loaded successfully
        fetchCommunications();
      }
    } catch (error) {
      toast.error('Failed to load deal details');
      navigate('/deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunications = async () => {
    try {
      const response = await dealsAPI.getCommunications(dealId);
      if (response.data) {
        setCommunications(response.data.communications || []);
      }
    } catch (error) {
      // Silent fail for communications
    }
  };

  // Update deal
  const handleSave = async () => {
    try {
      setUpdating(true);
      
      const updateData = {
        title: editedDeal.title,
        brand: editedDeal.brand,
        platform: editedDeal.platform,
        dealValue: editedDeal.dealValue,
        timeline: editedDeal.timeline,
        campaignRequirements: editedDeal.campaignRequirements,
        internalNotes: editedDeal.internalNotes,
        tags: editedDeal.tags
      };
      
      await dealsAPI.updateDeal(dealId, updateData);
      setDeal(editedDeal);
      setEditMode(false);
      toast.success('Deal updated successfully');
    } catch (error) {
      toast.error('Failed to update deal');
    } finally {
      setUpdating(false);
    }
  };

  // Stage management
  const handleStageChange = async () => {
    if (!selectedStage) return;
    
    try {
      setUpdating(true);
      
      const stageData = {
        stage: selectedStage
      };
      
      // Add stage-specific data
      if (selectedStage === 'live' && stageNotes) {
        stageData.goLiveDate = new Date().toISOString();
      } else if (selectedStage === 'cancelled' && stageNotes) {
        stageData.cancellationReason = stageNotes;
      } else if (selectedStage === 'rejected' && stageNotes) {
        stageData.rejectionReason = stageNotes;
      } else if (selectedStage === 'negotiating' && stageNotes) {
        stageData.negotiationNotes = stageNotes;
      }
      
      await dealsAPI.updateDealStage(dealId, selectedStage, stageNotes);
      
      // Update local state
      setDeal({ ...deal, stage: selectedStage });
      setShowStageModal(false);
      setSelectedStage(null);
      setStageNotes('');
      
      toast.success('Deal stage updated');
      fetchDeal(); // Refresh to get updated timeline
    } catch (error) {
      toast.error('Failed to update stage');
    } finally {
      setUpdating(false);
    }
  };

  // Add communication
  const handleAddCommunication = async () => {
    if (!newComm.summary.trim()) {
      toast.error('Please add a summary');
      return;
    }
    
    try {
      setUpdating(true);
      await dealsAPI.addCommunication(dealId, newComm);
      
      // Reset form and refresh
      setNewComm({
        type: 'email',
        direction: 'outbound',
        subject: '',
        summary: '',
        outcome: 'neutral',
        nextAction: '',
        followUpDate: ''
      });
      setShowAddComm(false);
      
      toast.success('Communication added');
      fetchCommunications();
    } catch (error) {
      toast.error('Failed to add communication');
    } finally {
      setUpdating(false);
    }
  };

  // Add deliverable
  const handleAddDeliverable = async () => {
    try {
      setUpdating(true);
      await dealsAPI.addDeliverable(dealId, newDeliverable);
      
      setNewDeliverable({
        type: 'instagram_post',
        quantity: 1,
        description: '',
        deadline: ''
      });
      setShowAddDeliverable(false);
      
      toast.success('Deliverable added');
      fetchDeal();
    } catch (error) {
      toast.error('Failed to add deliverable');
    } finally {
      setUpdating(false);
    }
  };

  // Update deliverable status
  const handleUpdateDeliverable = async (deliverableId, status, additionalData = {}) => {
    try {
      setUpdating(true);
      
      const updateData = {
        status,
        ...additionalData
      };
      
      await dealsAPI.updateDeliverable(dealId, deliverableId, updateData);
      toast.success('Deliverable updated');
      fetchDeal();
    } catch (error) {
      toast.error('Failed to update deliverable');
    } finally {
      setUpdating(false);
    }
  };

  // Quick actions
  const handleQuickAction = async (action) => {
    try {
      setUpdating(true);
      
      switch (action) {
        case 'duplicate':
          await dealsAPI.performQuickAction(dealId, 'duplicate');
          toast.success('Deal duplicated successfully');
          navigate('/deals');
          break;
          
        case 'convert_to_template':
          await dealsAPI.performQuickAction(dealId, 'convert_to_template');
          toast.success('Template created from deal');
          break;
          
        case 'send_reminder':
          const reminderData = {
            subject: `Follow-up: ${deal.title}`,
            message: 'Following up on our discussion',
            followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          };
          await dealsAPI.performQuickAction(dealId, 'send_reminder', reminderData);
          toast.success('Reminder sent');
          fetchCommunications();
          break;
          
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action.replace('_', ' ')}`);
    } finally {
      setUpdating(false);
      setShowActions(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <span>Loading deal details...</span>
      </div>
    );
  }

  if (!deal) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <h2>Deal not found</h2>
        <button onClick={() => navigate('/deals')} style={styles.button}>
          Back to Deals
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button style={styles.backButton} onClick={() => navigate('/deals')}>
            <ArrowLeft size={18} />
            Back
          </button>
          
          <div style={styles.titleSection}>
            {editMode ? (
              <input
                type="text"
                value={editedDeal.title}
                onChange={(e) => setEditedDeal({ ...editedDeal, title: e.target.value })}
                style={{ ...styles.input, fontSize: '1.75rem', fontWeight: '700' }}
              />
            ) : (
              <h1 style={styles.title}>{deal.title}</h1>
            )}
            <div style={styles.subtitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building size={14} />
                {deal.brand?.name || 'No brand'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Hash size={14} />
                {deal.dealId || deal._id}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} />
                Created {formatDate(deal.createdAt)}
              </span>
            </div>
          </div>
          
          <div style={styles.actions}>
            {editMode ? (
              <>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => {
                    setEditedDeal(deal);
                    setEditMode(false);
                  }}
                  disabled={updating}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={handleSave}
                  disabled={updating}
                >
                  <Save size={16} />
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreVertical size={16} />
                  Actions
                </button>
                
                {showActions && (
                  <div style={styles.dropdown}>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('duplicate')}
                    >
                      <Copy size={16} />
                      Duplicate Deal
                    </div>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('convert_to_template')}
                    >
                      <FileText size={16} />
                      Convert to Template
                    </div>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('send_reminder')}
                    >
                      <Send size={16} />
                      Send Reminder
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Stage Progress */}
        <div style={styles.stageProgress}>
          {stages.filter(s => !['cancelled', 'rejected'].includes(s.id)).map(stage => {
            const StageIcon = stage.icon;
            const isActive = deal.stage === stage.id;
            
            return (
              <div
                key={stage.id}
                style={{
                  ...styles.stageItem,
                  ...(isActive ? styles.stageActive : styles.stageInactive)
                }}
                onClick={() => {
                  if (!editMode) {
                    setSelectedStage(stage.id);
                    setShowStageModal(true);
                  }
                }}
              >
                <StageIcon size={14} />
                {stage.name}
              </div>
            );
          })}
        </div>
        
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Deal Value</div>
            <div style={styles.statValue}>
              <IndianRupee size={18} />
              {formatCurrency(deal.dealValue?.amount || 0)}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Platform</div>
            <div style={styles.statValue}>
              <Globe size={18} />
              {deal.platform || 'Not set'}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Priority</div>
            <div style={styles.statValue}>
              <Zap size={18} />
              {deal.priority || 'Medium'}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Health Score</div>
            <div style={styles.statValue}>
              {dealHealth}%
            </div>
            <div style={styles.healthBar}>
              <div style={{ ...styles.healthFill, width: `${dealHealth}%` }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content continues with the same structure... */}
      {/* I'll include the rest of the JSX without changes since the structure remains the same */}
      
      <div style={styles.content}>
        <div style={styles.mainColumn}>
          {/* Tabs */}
          <div style={styles.card}>
            <div style={styles.tabs}>
              {['overview', 'deliverables', 'communications', 'timeline'].map(tab => (
                <div
                  key={tab}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.tabActive : {})
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))}
            </div>
            
            <div style={styles.cardContent}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Campaign Requirements</div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.campaignRequirements?.brief || ''}
                        onChange={(e) => setEditedDeal({
                          ...editedDeal,
                          campaignRequirements: { ...editedDeal.campaignRequirements, brief: e.target.value }
                        })}
                        style={styles.textarea}
                        placeholder="Enter campaign brief..."
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {deal.campaignRequirements?.brief || 'No requirements specified'}
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Internal Notes</div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.internalNotes || ''}
                        onChange={(e) => setEditedDeal({ ...editedDeal, internalNotes: e.target.value })}
                        style={styles.textarea}
                        placeholder="Add internal notes..."
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {deal.internalNotes || 'No notes added'}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>Payment Terms</div>
                      <div style={styles.fieldValue}>
                        {deal.dealValue?.paymentTerms || '50_50'}
                      </div>
                    </div>
                    
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>Source</div>
                      <div style={styles.fieldValue}>
                        {deal.source || 'direct_outreach'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Deliverables Tab */}
              {activeTab === 'deliverables' && (
                <div>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton, marginBottom: '1rem' }}
                    onClick={() => setShowAddDeliverable(true)}
                  >
                    <Plus size={16} />
                    Add Deliverable
                  </button>
                  
                  {deal.deliverables?.map((deliverable, index) => (
                    <div key={index} style={styles.deliverableItem}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{deliverable.type}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          Qty: {deliverable.quantity} | {deliverable.description}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={deliverable.status}
                          onChange={(e) => {
                            const status = e.target.value;
                            if (status === 'submitted') {
                              const url = prompt('Enter submission URL:');
                              if (url) {
                                handleUpdateDeliverable(deliverable._id, status, { submissionUrl: url });
                              }
                            } else if (status === 'revision_required') {
                              const notes = prompt('Enter revision notes:');
                              if (notes) {
                                handleUpdateDeliverable(deliverable._id, status, { revisionNotes: notes });
                              }
                            } else {
                              handleUpdateDeliverable(deliverable._id, status);
                            }
                          }}
                          style={{ ...styles.input, width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="revision_required">Revision Required</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  {(!deal.deliverables || deal.deliverables.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No deliverables added
                    </div>
                  )}
                </div>
              )}
              
              {/* Communications Tab */}
              {activeTab === 'communications' && (
                <div>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton, marginBottom: '1rem' }}
                    onClick={() => setShowAddComm(true)}
                  >
                    <Plus size={16} />
                    Add Communication
                  </button>
                  
                  {communications.map((comm, index) => (
                    <div key={index} style={styles.communicationItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{comm.subject || comm.type}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatDate(comm.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {comm.summary}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>{comm.type}</span>
                        <span>{comm.direction}</span>
                        <span>{comm.outcome}</span>
                      </div>
                    </div>
                  ))}
                  
                  {communications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No communications recorded
                    </div>
                  )}
                </div>
              )}
              
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div>
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Response Deadline</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.responseDeadline?.split('T')[0] || ''}
                        onChange={(e) => setEditedDeal({
                          ...editedDeal,
                          timeline: { ...editedDeal.timeline, responseDeadline: e.target.value }
                        })}
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.responseDeadline)}
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Content Deadline</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.contentDeadline?.split('T')[0] || ''}
                        onChange={(e) => setEditedDeal({
                          ...editedDeal,
                          timeline: { ...editedDeal.timeline, contentDeadline: e.target.value }
                        })}
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.contentDeadline)}
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Go Live Date</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.goLiveDate?.split('T')[0] || ''}
                        onChange={(e) => setEditedDeal({
                          ...editedDeal,
                          timeline: { ...editedDeal.timeline, goLiveDate: e.target.value }
                        })}
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.goLiveDate)}
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Payment Due Date</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.paymentDueDate?.split('T')[0] || ''}
                        onChange={(e) => setEditedDeal({
                          ...editedDeal,
                          timeline: { ...editedDeal.timeline, paymentDueDate: e.target.value }
                        })}
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.paymentDueDate)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Side Column */}
        <div style={styles.sideColumn}>
          {/* Brand Details */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Building size={18} />
                Brand Details
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Brand Name</div>
                {editMode ? (
                  <input
                    value={editedDeal.brand?.name || ''}
                    onChange={(e) => setEditedDeal({
                      ...editedDeal,
                      brand: { ...editedDeal.brand, name: e.target.value }
                    })}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>{deal.brand?.name || 'Not specified'}</div>
                )}
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Contact Person</div>
                {editMode ? (
                  <input
                    value={editedDeal.brand?.contactPerson?.name || ''}
                    onChange={(e) => setEditedDeal({
                      ...editedDeal,
                      brand: {
                        ...editedDeal.brand,
                        contactPerson: { ...editedDeal.brand?.contactPerson, name: e.target.value }
                      }
                    })}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>
                    {deal.brand?.contactPerson?.name || 'Not specified'}
                  </div>
                )}
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Email</div>
                <div style={styles.fieldValue}>
                  {deal.brand?.contactPerson?.email || 'Not specified'}
                </div>
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Phone</div>
                <div style={styles.fieldValue}>
                  {deal.brand?.contactPerson?.phone || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <CreditCard size={18} />
                Payment Details
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Deal Value</div>
                {editMode ? (
                  <input
                    type="number"
                    value={editedDeal.dealValue?.amount || 0}
                    onChange={(e) => setEditedDeal({
                      ...editedDeal,
                      dealValue: { ...editedDeal.dealValue, amount: parseFloat(e.target.value) }
                    })}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>
                    {formatCurrency(deal.dealValue?.amount || 0)}
                  </div>
                )}
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>GST Applicable</div>
                <div style={styles.fieldValue}>
                  {deal.dealValue?.gstApplicable ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>TDS Applicable</div>
                <div style={styles.fieldValue}>
                  {deal.dealValue?.tdsApplicable ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Final Amount</div>
                <div style={styles.fieldValue}>
                  {formatCurrency(deal.dealValue?.finalAmount || deal.dealValue?.amount || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stage Change Modal */}
      {showStageModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Update Deal Stage</h3>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>New Stage</div>
              <div style={{ ...styles.badge, backgroundColor: getStageInfo(selectedStage).color, color: '#ffffff' }}>
                {getStageInfo(selectedStage).name}
              </div>
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Notes (Optional)</div>
              <textarea
                value={stageNotes}
                onChange={(e) => setStageNotes(e.target.value)}
                style={styles.textarea}
                placeholder="Add notes about this stage change..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => {
                  setShowStageModal(false);
                  setSelectedStage(null);
                  setStageNotes('');
                }}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleStageChange}
                disabled={updating}
              >
                Update Stage
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Communication Modal */}
      {showAddComm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Add Communication</h3>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Type</div>
              <select
                value={newComm.type}
                onChange={(e) => setNewComm({ ...newComm, type: e.target.value })}
                style={styles.input}
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram_dm">Instagram DM</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Direction</div>
              <select
                value={newComm.direction}
                onChange={(e) => setNewComm({ ...newComm, direction: e.target.value })}
                style={styles.input}
              >
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Subject</div>
              <input
                value={newComm.subject}
                onChange={(e) => setNewComm({ ...newComm, subject: e.target.value })}
                style={styles.input}
                placeholder="Communication subject..."
              />
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Summary</div>
              <textarea
                value={newComm.summary}
                onChange={(e) => setNewComm({ ...newComm, summary: e.target.value })}
                style={styles.textarea}
                placeholder="Communication summary..."
                required
              />
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Outcome</div>
              <select
                value={newComm.outcome}
                onChange={(e) => setNewComm({ ...newComm, outcome: e.target.value })}
                style={styles.input}
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
                <option value="follow_up_required">Follow-up Required</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setShowAddComm(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleAddCommunication}
                disabled={updating}
              >
                Add Communication
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Deliverable Modal */}
      {showAddDeliverable && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Add Deliverable</h3>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Type</div>
              <select
                value={newDeliverable.type}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, type: e.target.value })}
                style={styles.input}
              >
                <option value="instagram_post">Instagram Post</option>
                <option value="instagram_reel">Instagram Reel</option>
                <option value="instagram_story">Instagram Story</option>
                <option value="youtube_video">YouTube Video</option>
                <option value="youtube_short">YouTube Short</option>
                <option value="blog_post">Blog Post</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Quantity</div>
              <input
                type="number"
                min="1"
                value={newDeliverable.quantity}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, quantity: parseInt(e.target.value) })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Description</div>
              <textarea
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
                style={styles.textarea}
                placeholder="Deliverable description..."
              />
            </div>
            
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Deadline</div>
              <input
                type="date"
                value={newDeliverable.deadline}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, deadline: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setShowAddDeliverable(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleAddDeliverable}
                disabled={updating}
              >
                Add Deliverable
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DealDetailsPage;
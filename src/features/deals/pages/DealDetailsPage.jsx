/**
 * Deal Details Page - View & Edit Individual Deal
 * Path: src/features/deals/pages/DealDetailsPage.jsx
 * 
 * Comprehensive deal management interface with activity tracking,
 * document management, and inline editing capabilities.
 * 
 * Features:
 * - Deal overview with key metrics
 * - Stage progression
 * - Activity timeline
 * - Document management
 * - Notes and comments
 * - Deliverables tracking
 * - Payment status
 * - Inline editing
 * - Email integration
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
  Instagram,
  FileText,
  Download,
  Upload,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Activity,
  Link,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Send,
  Paperclip,
  Image,
  File,
  Video,
  Hash,
  TrendingUp,
  Package,
  CreditCard,
  Shield,
  Star,
  Zap
} from 'lucide-react';
import useDealsStore from '../../../store/dealsStore';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-hot-toast';
import { dealsAPI } from '../../../api/endpoints/deals';

const DealDetailsPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentDeal, 
    fetchDeal, 
    updateDeal, 
    moveDealToStage,
    addNote,
    addActivity,
    loading,
    updating,
    stages 
  } = useDealsStore();
  
  // State
  const [editMode, setEditMode] = useState(false);
  const [editedDeal, setEditedDeal] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    deliverables: true,
    payment: true,
    documents: true
  });
  
  // Fetch deal on mount
  useEffect(() => {
    if (dealId) {
      fetchDeal(dealId);
    }
  }, [dealId]);
  
  // Update edited deal when current deal changes
  useEffect(() => {
    if (currentDeal) {
      setEditedDeal(currentDeal);
    }
  }, [currentDeal]);
  
  // Handle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Save changes
      handleSave();
    } else {
      setEditMode(true);
    }
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      await updateDeal(dealId, editedDeal);
      setEditMode(false);
      toast.success('Deal updated successfully');
    } catch (error) {
      toast.error('Failed to update deal');
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditedDeal(currentDeal);
    setEditMode(false);
  };
  
  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditedDeal(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle stage change
  const handleStageChange = async (newStage) => {
    try {
      await moveDealToStage(dealId, newStage);
      toast.success('Deal stage updated');
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };
  
  // Handle add note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await addNote(dealId, {
        content: newNote,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      });
      setNewNote('');
      setShowAddNote(false);
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (files) => {
    setUploadingFile(true);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      await dealsAPI.uploadDocuments(dealId, formData);
      toast.success('Files uploaded successfully');
      fetchDeal(dealId); // Refresh to get updated documents
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setUploadingFile(false);
    }
  };
  
  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  };
  
  // Get stage color
  const getStageColor = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    return stage?.color || '#6366f1';
  };
  
  // Calculate deal health score
  const calculateDealHealth = () => {
    if (!currentDeal) return 0;
    
    let score = 100;
    const deadline = new Date(currentDeal.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) score -= 30;
    else if (daysLeft < 7) score -= 15;
    
    if (!currentDeal.contractSigned) score -= 20;
    if (!currentDeal.briefReceived) score -= 10;
    
    return Math.max(0, score);
  };
  
  // Get health color
  const getHealthColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.5rem 2rem'
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#475569',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dealTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0f172a',
      flex: 1,
      margin: '0 2rem'
    },
    headerActions: {
      display: 'flex',
      gap: '1rem'
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: editMode ? '#10b981' : '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    cancelButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: '#ffffff',
      color: '#475569',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    moreButton: {
      padding: '0.625rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    stageSelector: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.5rem'
    },
    stageOption: {
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    },
    stageOptionActive: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '2rem',
      padding: '1rem 0'
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
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    statIcon: {
      width: '1.25rem',
      height: '1.25rem'
    },
    content: {
      display: 'flex',
      gap: '2rem',
      padding: '2rem',
      maxWidth: '1600px',
      margin: '0 auto'
    },
    mainColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    sideColumn: {
      width: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer'
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    cardContent: {
      padding: '1.5rem'
    },
    tabs: {
      display: 'flex',
      gap: '2rem',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 1.5rem'
    },
    tab: {
      padding: '1rem 0',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#6366f1',
      borderBottomColor: '#6366f1'
    },
    field: {
      marginBottom: '1.25rem'
    },
    fieldLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    fieldValue: {
      fontSize: '0.9375rem',
      color: '#0f172a',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      minHeight: '100px',
      resize: 'vertical'
    },
    timeline: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    timelineItem: {
      display: 'flex',
      gap: '1rem',
      position: 'relative'
    },
    timelineLine: {
      position: 'absolute',
      left: '16px',
      top: '32px',
      bottom: '-16px',
      width: '2px',
      backgroundColor: '#e2e8f0'
    },
    timelineIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      flexShrink: 0,
      zIndex: 1
    },
    timelineContent: {
      flex: 1,
      paddingBottom: '1rem'
    },
    timelineTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    timelineDescription: {
      fontSize: '0.8125rem',
      color: '#64748b',
      lineHeight: '1.5'
    },
    timelineTime: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginTop: '0.25rem'
    },
    noteCard: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem'
    },
    noteHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.5rem'
    },
    noteAuthor: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569'
    },
    noteTime: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    },
    noteContent: {
      fontSize: '0.875rem',
      color: '#0f172a',
      lineHeight: '1.5'
    },
    addNoteForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem'
    },
    documentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem'
    },
    documentCard: {
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    documentIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9'
    },
    documentInfo: {
      flex: 1
    },
    documentName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    documentSize: {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    uploadArea: {
      padding: '2rem',
      border: '2px dashed #e2e8f0',
      borderRadius: '0.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    uploadAreaHover: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff'
    },
    deliverablesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    deliverableItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem'
    },
    deliverableInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    deliverableIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff'
    },
    deliverableName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#0f172a'
    },
    deliverableQuantity: {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    deliverableStatus: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    healthScore: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    },
    healthBar: {
      flex: 1,
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    healthFill: {
      height: '100%',
      transition: 'width 0.5s ease'
    },
    emptyState: {
      padding: '2rem',
      textAlign: 'center',
      color: '#64748b'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      fontSize: '1rem',
      color: '#64748b'
    }
  };
  
  if (loading && !currentDeal) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading deal details...</div>
      </div>
    );
  }
  
  if (!currentDeal) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Deal not found</div>
      </div>
    );
  }
  
  const dealHealth = calculateDealHealth();
  const healthColor = getHealthColor(dealHealth);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button
            style={styles.backButton}
            onClick={() => navigate('/deals')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={18} />
            Back to Deals
          </button>
          
          {editMode ? (
            <input
              type="text"
              value={editedDeal.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              style={{ ...styles.dealTitle, ...styles.input }}
            />
          ) : (
            <h1 style={styles.dealTitle}>{currentDeal.title}</h1>
          )}
          
          <div style={styles.headerActions}>
            {editMode && (
              <button
                style={styles.cancelButton}
                onClick={handleCancelEdit}
              >
                <X size={18} />
                Cancel
              </button>
            )}
            <button
              style={styles.editButton}
              onClick={toggleEditMode}
            >
              {editMode ? (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  Edit Deal
                </>
              )}
            </button>
            <button style={styles.moreButton}>
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        
        {/* Stage Selector */}
        <div style={styles.stageSelector}>
          {stages.map(stage => (
            <button
              key={stage.id}
              style={{
                ...styles.stageOption,
                ...(currentDeal.stage === stage.id ? styles.stageOptionActive : {}),
                borderLeft: currentDeal.stage === stage.id ? `3px solid ${stage.color}` : 'none'
              }}
              onClick={() => handleStageChange(stage.id)}
              disabled={!editMode}
            >
              {stage.name}
            </button>
          ))}
        </div>
        
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Deal Value</span>
            <span style={styles.statValue}>
              <DollarSign style={styles.statIcon} color="#10b981" />
              {formatCurrency(currentDeal.value)}
            </span>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Deadline</span>
            <span style={styles.statValue}>
              <Calendar style={styles.statIcon} color="#f59e0b" />
              {formatDate(currentDeal.deadline)}
            </span>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Days in Stage</span>
            <span style={styles.statValue}>
              <Clock style={styles.statIcon} color="#6366f1" />
              {currentDeal.daysInStage || 0}
            </span>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Deliverables</span>
            <span style={styles.statValue}>
              <Package style={styles.statIcon} color="#8b5cf6" />
              {currentDeal.deliverables?.length || 0}
            </span>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Documents</span>
            <span style={styles.statValue}>
              <FileText style={styles.statIcon} color="#3b82f6" />
              {currentDeal.documents?.length || 0}
            </span>
          </div>
          
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Health Score</span>
            <span style={styles.statValue}>
              <Shield style={styles.statIcon} color={healthColor} />
              {dealHealth}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div style={styles.content}>
        {/* Main Column */}
        <div style={styles.mainColumn}>
          {/* Tabs Card */}
          <div style={styles.card}>
            <div style={styles.tabs}>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'overview' ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'activity' ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'notes' ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'documents' ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </div>
            
            <div style={styles.cardContent}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  {/* Health Score */}
                  <div style={styles.healthScore}>
                    <Zap color={healthColor} size={20} />
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>
                      Deal Health: {dealHealth}%
                    </span>
                    <div style={styles.healthBar}>
                      <div
                        style={{
                          ...styles.healthFill,
                          width: `${dealHealth}%`,
                          backgroundColor: healthColor
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Brief */}
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>
                      <FileText size={14} />
                      Campaign Brief
                    </div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.brief || ''}
                        onChange={(e) => handleFieldChange('brief', e.target.value)}
                        placeholder="Enter campaign brief..."
                        style={styles.textarea}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {currentDeal.brief || 'No brief provided'}
                      </div>
                    )}
                  </div>
                  
                  {/* Campaign Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>
                        <Calendar size={14} />
                        Campaign Start
                      </div>
                      {editMode ? (
                        <input
                          type="date"
                          value={editedDeal.campaignStartDate || ''}
                          onChange={(e) => handleFieldChange('campaignStartDate', e.target.value)}
                          style={styles.input}
                        />
                      ) : (
                        <div style={styles.fieldValue}>
                          {formatDate(currentDeal.campaignStartDate)}
                        </div>
                      )}
                    </div>
                    
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>
                        <Calendar size={14} />
                        Campaign End
                      </div>
                      {editMode ? (
                        <input
                          type="date"
                          value={editedDeal.campaignEndDate || ''}
                          onChange={(e) => handleFieldChange('campaignEndDate', e.target.value)}
                          style={styles.input}
                        />
                      ) : (
                        <div style={styles.fieldValue}>
                          {formatDate(currentDeal.campaignEndDate)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Internal Notes */}
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>
                      <MessageSquare size={14} />
                      Internal Notes
                    </div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.notes || ''}
                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                        placeholder="Add internal notes..."
                        style={styles.textarea}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {currentDeal.notes || 'No notes added'}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div style={styles.timeline}>
                  {currentDeal.activity && currentDeal.activity.length > 0 ? (
                    currentDeal.activity.map((activity, index) => (
                      <div key={index} style={styles.timelineItem}>
                        {index < currentDeal.activity.length - 1 && (
                          <div style={styles.timelineLine} />
                        )}
                        <div style={{
                          ...styles.timelineIcon,
                          backgroundColor: activity.type === 'stage_change' ? '#e0e7ff' : '#f1f5f9'
                        }}>
                          <Activity size={14} color={activity.type === 'stage_change' ? '#6366f1' : '#64748b'} />
                        </div>
                        <div style={styles.timelineContent}>
                          <div style={styles.timelineTitle}>{activity.title}</div>
                          <div style={styles.timelineDescription}>{activity.description}</div>
                          <div style={styles.timelineTime}>{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyState}>
                      <Activity size={32} color="#cbd5e1" />
                      <p>No activity yet</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  {showAddNote ? (
                    <div style={styles.addNoteForm}>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add your note..."
                        style={styles.textarea}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                          style={styles.cancelButton}
                          onClick={() => {
                            setShowAddNote(false);
                            setNewNote('');
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          style={styles.editButton}
                          onClick={handleAddNote}
                        >
                          <Plus size={16} />
                          Add Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      style={{
                        ...styles.editButton,
                        marginBottom: '1rem',
                        backgroundColor: '#f0f9ff',
                        color: '#3b82f6'
                      }}
                      onClick={() => setShowAddNote(true)}
                    >
                      <Plus size={16} />
                      Add Note
                    </button>
                  )}
                  
                  {currentDeal.notes && currentDeal.notes.length > 0 ? (
                    currentDeal.notes.map((note, index) => (
                      <div key={index} style={styles.noteCard}>
                        <div style={styles.noteHeader}>
                          <div style={styles.noteAuthor}>{note.author || 'You'}</div>
                          <div style={styles.noteTime}>{formatTimeAgo(note.createdAt)}</div>
                        </div>
                        <div style={styles.noteContent}>{note.content}</div>
                      </div>
                    ))
                  ) : (
                    !showAddNote && (
                      <div style={styles.emptyState}>
                        <MessageSquare size={32} color="#cbd5e1" />
                        <p>No notes yet</p>
                      </div>
                    )
                  )}
                </div>
              )}
              
              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div
                    style={{
                      ...styles.uploadArea,
                      ...(uploadingFile ? styles.uploadAreaHover : {})
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      handleFileUpload(e.dataTransfer.files);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <Upload size={32} color="#94a3b8" />
                    <p style={{ margin: '0.5rem 0', color: '#475569' }}>
                      {uploadingFile ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      PDF, DOC, XLS, Images up to 10MB
                    </p>
                  </div>
                  
                  {currentDeal.documents && currentDeal.documents.length > 0 ? (
                    <div style={{ ...styles.documentGrid, marginTop: '1.5rem' }}>
                      {currentDeal.documents.map((doc, index) => (
                        <div
                          key={index}
                          style={styles.documentCard}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={styles.documentIcon}>
                            <FileText size={20} color="#6366f1" />
                          </div>
                          <div style={styles.documentInfo}>
                            <div style={styles.documentName}>{doc.name}</div>
                            <div style={styles.documentSize}>{doc.size}</div>
                          </div>
                          <Download size={16} color="#64748b" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ ...styles.emptyState, marginTop: '1.5rem' }}>
                      <FileText size={32} color="#cbd5e1" />
                      <p>No documents uploaded</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Side Column */}
        <div style={styles.sideColumn}>
          {/* Contact Details */}
          <div style={styles.card}>
            <div
              style={styles.cardHeader}
              onClick={() => toggleSection('contact')}
            >
              <div style={styles.cardTitle}>
                <User size={18} />
                Contact Details
              </div>
              {expandedSections.contact ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            
            {expandedSections.contact && (
              <div style={styles.cardContent}>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>
                    <Building size={14} />
                    Brand
                  </div>
                  <div style={styles.fieldValue}>
                    {currentDeal.brandName || 'Not specified'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>
                    <User size={14} />
                    Contact Name
                  </div>
                  <div style={styles.fieldValue}>
                    {currentDeal.contactName || 'Not specified'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>
                    <Mail size={14} />
                    Email
                  </div>
                  <div style={styles.fieldValue}>
                    {currentDeal.contactEmail ? (
                      <a href={`mailto:${currentDeal.contactEmail}`} style={{ color: '#6366f1' }}>
                        {currentDeal.contactEmail}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>
                    <Phone size={14} />
                    Phone
                  </div>
                  <div style={styles.fieldValue}>
                    {currentDeal.contactPhone || 'Not specified'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>
                    <Instagram size={14} />
                    Instagram
                  </div>
                  <div style={styles.fieldValue}>
                    {currentDeal.brandInstagram || 'Not specified'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Deliverables */}
          <div style={styles.card}>
            <div
              style={styles.cardHeader}
              onClick={() => toggleSection('deliverables')}
            >
              <div style={styles.cardTitle}>
                <Package size={18} />
                Deliverables
              </div>
              {expandedSections.deliverables ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            
            {expandedSections.deliverables && (
              <div style={styles.cardContent}>
                {currentDeal.deliverables && currentDeal.deliverables.length > 0 ? (
                  <div style={styles.deliverablesList}>
                    {currentDeal.deliverables.map((deliverable, index) => (
                      <div key={index} style={styles.deliverableItem}>
                        <div style={styles.deliverableInfo}>
                          <div style={{
                            ...styles.deliverableIcon,
                            backgroundColor: deliverable.completed ? '#dcfce7' : '#fef3c7'
                          }}>
                            {deliverable.completed ? (
                              <CheckCircle size={16} color="#22c55e" />
                            ) : (
                              <Clock size={16} color="#f59e0b" />
                            )}
                          </div>
                          <div>
                            <div style={styles.deliverableName}>
                              {deliverable.type || deliverable}
                            </div>
                            <div style={styles.deliverableQuantity}>
                              Qty: {deliverable.quantity || 1}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          ...styles.deliverableStatus,
                          backgroundColor: deliverable.completed ? '#dcfce7' : '#fef3c7',
                          color: deliverable.completed ? '#15803d' : '#a16207'
                        }}>
                          {deliverable.completed ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <Package size={32} color="#cbd5e1" />
                    <p>No deliverables added</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Payment Details */}
          <div style={styles.card}>
            <div
              style={styles.cardHeader}
              onClick={() => toggleSection('payment')}
            >
              <div style={styles.cardTitle}>
                <CreditCard size={18} />
                Payment Details
              </div>
              {expandedSections.payment ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            
            {expandedSections.payment && (
              <div style={styles.cardContent}>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Payment Terms</div>
                  <div style={styles.fieldValue}>
                    {currentDeal.paymentTerms || 'Net 30 Days'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Payment Method</div>
                  <div style={styles.fieldValue}>
                    {currentDeal.paymentMethod || 'Bank Transfer'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>GST Applicable</div>
                  <div style={styles.fieldValue}>
                    {currentDeal.gstApplicable ? 'Yes' : 'No'}
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Advance Payment</div>
                  <div style={styles.fieldValue}>
                    {currentDeal.advancePercentage || 0}%
                  </div>
                </div>
                
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Payment Status</div>
                  <div style={{
                    ...styles.fieldValue,
                    padding: '0.25rem 0.75rem',
                    backgroundColor: currentDeal.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: currentDeal.paymentStatus === 'paid' ? '#15803d' : '#a16207',
                    borderRadius: '9999px',
                    display: 'inline-block',
                    fontSize: '0.8125rem',
                    fontWeight: '600'
                  }}>
                    {currentDeal.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsPage;
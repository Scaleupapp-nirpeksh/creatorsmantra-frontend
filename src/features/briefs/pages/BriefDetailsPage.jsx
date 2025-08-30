/**
 * Brief Details Page - Comprehensive view of AI analysis results
 * Path: src/features/briefs/pages/BriefDetailsPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Share2,
  MoreVertical,
  FileText,
  Upload,
  Bot,
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Building,
  Package,
  Target,
  Zap,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Tag,
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Eye,
  Sparkles,
  IndianRupee,
  Timer,
  Star,
  Flag,
  Users,
  Palette,
  Hash,
  AtSign,
  PlayCircle,
  FileImage,
  Link,
  CreditCard,
  Briefcase,
  MapPin,
  Send
} from 'lucide-react';
import { useBriefStore, useAuthStore, useAIExtraction, useClarifications, useDealConversion } from '../../../store';
import { briefHelpers } from '../../../api/endpoints';
import { toast } from 'react-hot-toast';

const BriefDetailsPage = () => {
  const navigate = useNavigate();
  const { briefId } = useParams();
  const { user, subscription } = useAuthStore();
  const {
    currentBrief,
    currentBriefLoading,
    currentBriefError,
    fetchBriefById,
    deleteBrief,
    updateBrief
  } = useBriefStore();
  
  const {
    isProcessing: aiProcessing,
    progress: aiProgress,
    triggerExtraction
  } = useAIExtraction();
  
  const {
    generateEmail,
    isGenerating: emailGenerating
  } = useClarifications();
  
  const {
    generatePreview,
    isGenerating: previewGenerating
  } = useDealConversion();
  
  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [showActions, setShowActions] = useState(false);
  const [retriggeringAI, setRetriggeringAI] = useState(false);

  useEffect(() => {
    if (briefId) {
      fetchBriefById(briefId);
    }
  }, [briefId, fetchBriefById]);

  const brief = currentBrief;
  const loading = currentBriefLoading;
  const error = currentBriefError;

  const handleEditBrief = () => {
    navigate(`/briefs/${briefId}/edit`);
  };

  const handleDeleteBrief = async () => {
    if (window.confirm('Are you sure you want to delete this brief? This action cannot be undone.')) {
      try {
        await deleteBrief(briefId);
        toast.success('Brief deleted successfully');
        navigate('/briefs');
      } catch (error) {
        toast.error('Failed to delete brief');
      }
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(briefId);
    toast.success('Brief ID copied to clipboard');
  };

  const handleRetriggerAI = async () => {
    if (!briefHelpers.hasAIAccess(subscription?.tier)) {
      toast.error('AI features not available in your subscription');
      return;
    }

    setRetriggeringAI(true);
    try {
      await triggerExtraction(briefId, { forceReprocess: true });
      toast.success('AI analysis restarted');
    } catch (error) {
      toast.error('Failed to restart AI analysis');
    } finally {
      setRetriggeringAI(false);
    }
  };

  const handleGenerateClarificationEmail = async () => {
    try {
      const result = await generateEmail(briefId);
      if (result.success) {
        setActiveTab('clarifications');
        toast.success('Clarification email generated');
      }
    } catch (error) {
      toast.error('Failed to generate clarification email');
    }
  };

  const handleConvertToDeal = () => {
    if (!brief.isReadyForDeal) {
      toast.error('Brief has critical missing information. Complete clarifications first.');
      return;
    }
    navigate(`/briefs/${briefId}/convert`);
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Not specified';
    return briefHelpers.formatCurrency(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
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

  const getRiskColor = (riskLevel) => {
    const colorMap = {
      low: '#10b981',
      medium: '#f59e0b', 
      high: '#ef4444'
    };
    return colorMap[riskLevel] || '#94a3b8';
  };

  const getRiskIcon = (riskLevel) => {
    const iconMap = {
      low: ShieldCheck,
      medium: Shield,
      high: ShieldAlert
    };
    return iconMap[riskLevel] || Shield;
  };

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
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    titleContent: {
      display: 'flex',
      flexDirection: 'column'
    },
    briefTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
      lineHeight: 1.2
    },
    briefSubtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    headerActions: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      position: 'relative'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderColor: 'transparent',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)'
    },
    moreButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      cursor: 'pointer'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      padding: '0.5rem',
      zIndex: 100,
      minWidth: '180px'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 0.875rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.2s'
    },
    statusBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap'
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    progressItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    progressBar: {
      width: '80px',
      height: '6px',
      backgroundColor: '#e2e8f0',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.3s'
    },
    content: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    },
    sidebar: {
      width: '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      flexShrink: 0
    },
    nav: {
      padding: '1rem'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.2s',
      marginBottom: '0.25rem'
    },
    navItemActive: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
    },
    mainContent: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto'
    },
    section: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.25rem'
    },
    sectionIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    },
    infoCard: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem'
    },
    infoLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      marginBottom: '0.5rem'
    },
    infoValue: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a',
      lineHeight: 1.4
    },
    deliverablesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    deliverableItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem'
    },
    deliverableIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(99, 102, 241, 0.1)'
    },
    deliverableInfo: {
      flex: 1
    },
    deliverableType: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    deliverableDetails: {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    deliverableValue: {
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#059669'
    },
    missingInfoList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    missingInfoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.875rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '0.5rem'
    },
    missingInfoCritical: {
      backgroundColor: '#fef2f2',
      borderColor: '#f87171'
    },
    missingInfoIcon: {
      width: '16px',
      height: '16px',
      flexShrink: 0,
      marginTop: '0.125rem'
    },
    missingInfoContent: {
      flex: 1
    },
    missingInfoCategory: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#92400e',
      textTransform: 'uppercase',
      marginBottom: '0.25rem'
    },
    missingInfoCriticalCategory: {
      color: '#dc2626'
    },
    missingInfoDescription: {
      fontSize: '0.875rem',
      color: '#78716c'
    },
    missingInfoCriticalDescription: {
      color: '#7f1d1d'
    },
    riskCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '0.5rem'
    },
    riskIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    riskContent: {
      flex: 1
    },
    riskLevel: {
      fontSize: '1rem',
      fontWeight: '700',
      marginBottom: '0.25rem'
    },
    riskDescription: {
      fontSize: '0.875rem',
      opacity: 0.8
    },
    riskFactorsList: {
      marginTop: '1rem'
    },
    riskFactor: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      padding: '0.5rem 0',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    aiProcessingCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem'
    },
    aiIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#dbeafe'
    },
    aiContent: {
      flex: 1
    },
    aiTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1e40af',
      marginBottom: '0.25rem'
    },
    aiDescription: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    aiActions: {
      display: 'flex',
      gap: '0.75rem'
    },
    aiButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#94a3b8',
      textAlign: 'center'
    },
    emptyTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#475569',
      marginTop: '0.75rem',
      marginBottom: '0.5rem'
    },
    emptyDescription: {
      fontSize: '0.875rem'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '1rem',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    originalContent: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#374151',
      whiteSpace: 'pre-wrap',
      maxHeight: '300px',
      overflow: 'auto'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <span>Loading brief details...</span>
        </div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <XCircle size={48} color="#ef4444" />
          <h3 style={styles.emptyTitle}>Brief Not Found</h3>
          <p style={styles.emptyDescription}>
            The brief you're looking for doesn't exist or has been deleted.
          </p>
          <button
            style={styles.actionButton}
            onClick={() => navigate('/briefs')}
          >
            <ArrowLeft size={16} />
            Back to Briefs
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getBriefStatusInfo(brief.status);
  const StatusIcon = statusInfo.icon;
  const completionPercentage = brief.completionPercentage || 0;
  const estimatedValue = brief.estimatedValue || 0;
  const aiStatus = brief.aiExtraction?.status || 'pending';
  const criticalMissing = brief.aiExtraction?.missingInfo?.filter(info => info.importance === 'critical') || [];
  const importantMissing = brief.aiExtraction?.missingInfo?.filter(info => info.importance === 'important') || [];
  const overallRisk = brief.aiExtraction?.riskAssessment?.overallRisk || 'low';
  const riskFactors = brief.aiExtraction?.riskAssessment?.riskFactors || [];
  const RiskIcon = getRiskIcon(overallRisk);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* AI Processing Status */}
            {(aiStatus === 'processing' || aiProcessing) && (
              <div style={styles.aiProcessingCard}>
                <div style={styles.aiIcon}>
                  <Bot size={24} color="#2563eb" />
                </div>
                <div style={styles.aiContent}>
                  <div style={styles.aiTitle}>AI Analysis in Progress</div>
                  <div style={styles.aiDescription}>
                    Extracting brand information, deliverables, and analyzing requirements...
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${aiProgress || 20}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Brand Information */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={{
                  ...styles.sectionIcon,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)'
                }}>
                  <Building size={16} color="#10b981" />
                </div>
                <h2 style={styles.sectionTitle}>Brand Information</h2>
              </div>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Brand Name</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.brandInfo?.name || 'Not detected'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Contact Person</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.brandInfo?.contactPerson || 'Not specified'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Email</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.brandInfo?.email || 'Not specified'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Company</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.brandInfo?.company || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Information */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={{
                  ...styles.sectionIcon,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)'
                }}>
                  <Target size={16} color="#8b5cf6" />
                </div>
                <h2 style={styles.sectionTitle}>Campaign Details</h2>
              </div>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Campaign Name</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.campaignInfo?.name || 'Not specified'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Campaign Type</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.campaignInfo?.type || 'Not specified'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Description</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.campaignInfo?.description || 'Not specified'}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Estimated Value</div>
                  <div style={styles.infoValue}>
                    {formatCurrency(estimatedValue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={{
                  ...styles.sectionIcon,
                  backgroundColor: 'rgba(245, 158, 11, 0.1)'
                }}>
                  <Calendar size={16} color="#f59e0b" />
                </div>
                <h2 style={styles.sectionTitle}>Timeline</h2>
              </div>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Content Deadline</div>
                  <div style={styles.infoValue}>
                    {formatDate(brief.aiExtraction?.timeline?.contentDeadline)}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Posting Start Date</div>
                  <div style={styles.infoValue}>
                    {formatDate(brief.aiExtraction?.timeline?.postingStartDate)}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Posting End Date</div>
                  <div style={styles.infoValue}>
                    {formatDate(brief.aiExtraction?.timeline?.postingEndDate)}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Is Urgent</div>
                  <div style={styles.infoValue}>
                    {brief.aiExtraction?.timeline?.isUrgent ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'deliverables':
        return (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{
                ...styles.sectionIcon,
                backgroundColor: 'rgba(99, 102, 241, 0.1)'
              }}>
                <Package size={16} color="#6366f1" />
              </div>
              <h2 style={styles.sectionTitle}>Deliverables</h2>
            </div>
            {brief.aiExtraction?.deliverables?.length > 0 ? (
              <div style={styles.deliverablesList}>
                {brief.aiExtraction.deliverables.map((deliverable, index) => (
                  <div key={index} style={styles.deliverableItem}>
                    <div style={styles.deliverableIcon}>
                      <Package size={20} color="#6366f1" />
                    </div>
                    <div style={styles.deliverableInfo}>
                      <div style={styles.deliverableType}>
                        {briefHelpers.formatDeliverableType(deliverable.type)}
                        {deliverable.quantity > 1 && ` (${deliverable.quantity}x)`}
                      </div>
                      <div style={styles.deliverableDetails}>
                        {deliverable.description && `${deliverable.description} • `}
                        Platform: {deliverable.platform || 'Not specified'}
                        {deliverable.duration && ` • Duration: ${deliverable.duration}`}
                      </div>
                    </div>
                    <div style={styles.deliverableValue}>
                      {formatCurrency(deliverable.estimatedValue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Package size={32} color="#cbd5e1" />
                <div style={styles.emptyTitle}>No Deliverables Detected</div>
                <div style={styles.emptyDescription}>
                  AI analysis didn't find specific deliverables. Check the original content or add clarifications.
                </div>
              </div>
            )}
          </div>
        );

      case 'missing-info':
        return (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{
                ...styles.sectionIcon,
                backgroundColor: 'rgba(245, 158, 11, 0.1)'
              }}>
                <AlertTriangle size={16} color="#f59e0b" />
              </div>
              <h2 style={styles.sectionTitle}>Missing Information</h2>
            </div>
            
            {criticalMissing.length > 0 && (
              <>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.75rem' }}>
                  Critical Missing Info ({criticalMissing.length})
                </h3>
                <div style={styles.missingInfoList}>
                  {criticalMissing.map((info, index) => (
                    <div key={index} style={{...styles.missingInfoItem, ...styles.missingInfoCritical}}>
                      <AlertTriangle size={16} color="#dc2626" style={styles.missingInfoIcon} />
                      <div style={styles.missingInfoContent}>
                        <div style={{...styles.missingInfoCategory, ...styles.missingInfoCriticalCategory}}>
                          {info.category.replace('_', ' ')}
                        </div>
                        <div style={{...styles.missingInfoDescription, ...styles.missingInfoCriticalDescription}}>
                          {info.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {importantMissing.length > 0 && (
              <>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#d97706', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
                  Important Missing Info ({importantMissing.length})
                </h3>
                <div style={styles.missingInfoList}>
                  {importantMissing.map((info, index) => (
                    <div key={index} style={styles.missingInfoItem}>
                      <Info size={16} color="#d97706" style={styles.missingInfoIcon} />
                      <div style={styles.missingInfoContent}>
                        <div style={styles.missingInfoCategory}>
                          {info.category.replace('_', ' ')}
                        </div>
                        <div style={styles.missingInfoDescription}>
                          {info.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {criticalMissing.length === 0 && importantMissing.length === 0 && (
              <div style={styles.emptyState}>
                <CheckCircle size={32} color="#10b981" />
                <div style={styles.emptyTitle}>All Information Complete</div>
                <div style={styles.emptyDescription}>
                  Great! All critical information has been identified or provided.
                </div>
              </div>
            )}
          </div>
        );

      case 'risk-assessment':
        const riskColor = getRiskColor(overallRisk);
        return (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{
                ...styles.sectionIcon,
                backgroundColor: `${riskColor}20`
              }}>
                <RiskIcon size={16} color={riskColor} />
              </div>
              <h2 style={styles.sectionTitle}>Risk Assessment</h2>
            </div>
            
            <div style={{
              ...styles.riskCard,
              backgroundColor: `${riskColor}15`,
              border: `1px solid ${riskColor}40`
            }}>
              <div style={{
                ...styles.riskIcon,
                backgroundColor: `${riskColor}20`
              }}>
                <RiskIcon size={24} color={riskColor} />
              </div>
              <div style={styles.riskContent}>
                <div style={{
                  ...styles.riskLevel,
                  color: riskColor
                }}>
                  {overallRisk.toUpperCase()} RISK
                </div>
                <div style={{
                  ...styles.riskDescription,
                  color: riskColor
                }}>
                  {overallRisk === 'low' && 'This collaboration appears to have standard terms and low risk factors.'}
                  {overallRisk === 'medium' && 'Some risk factors identified. Review terms carefully before proceeding.'}
                  {overallRisk === 'high' && 'Multiple risk factors detected. Proceed with caution and consider additional protections.'}
                </div>
              </div>
            </div>

            {riskFactors.length > 0 && (
              <div style={styles.riskFactorsList}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Risk Factors ({riskFactors.length})
                </h3>
                {riskFactors.map((factor, index) => (
                  <div key={index} style={styles.riskFactor}>
                    <AlertTriangle size={16} color={getRiskColor(factor.severity)} />
                    <div>
                      <strong>{factor.type}:</strong> {factor.description}
                      <span style={{ color: getRiskColor(factor.severity), fontWeight: '600', marginLeft: '0.5rem' }}>
                        ({factor.severity})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'original-content':
        return (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{
                ...styles.sectionIcon,
                backgroundColor: 'rgba(107, 114, 128, 0.1)'
              }}>
                <FileText size={16} color="#6b7280" />
              </div>
              <h2 style={styles.sectionTitle}>Original Content</h2>
            </div>
            
            {brief.originalContent?.rawText ? (
              <div style={styles.originalContent}>
                {brief.originalContent.rawText}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <FileText size={32} color="#cbd5e1" />
                <div style={styles.emptyTitle}>No Content Available</div>
                <div style={styles.emptyDescription}>
                  Original brief content could not be loaded.
                </div>
              </div>
            )}

            {brief.originalContent?.uploadedFile && (
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Original File</div>
                  <div style={styles.infoValue}>
                    {brief.originalContent.uploadedFile.originalName}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>File Size</div>
                  <div style={styles.infoValue}>
                    {Math.round(brief.originalContent.uploadedFile.fileSize / 1024)} KB
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Uploaded</div>
                  <div style={styles.infoValue}>
                    {formatDate(brief.originalContent.uploadedFile.uploadedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleSection}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/briefs')}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={styles.titleContent}>
              <h1 style={styles.briefTitle}>
                {brief.aiExtraction?.campaignInfo?.name || 
                 brief.aiExtraction?.brandInfo?.name || 
                 `Brief ${brief.briefId || briefId.slice(-6)}`}
              </h1>
              <p style={styles.briefSubtitle}>
                {brief.aiExtraction?.brandInfo?.name && brief.aiExtraction?.campaignInfo?.name 
                  ? `${brief.aiExtraction.brandInfo.name} • Created ${briefHelpers.formatBriefAge(brief.createdAt)}`
                  : `Created ${briefHelpers.formatBriefAge(brief.createdAt)}`
                }
              </p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            {brief.status === 'ready_for_deal' && (
              <button
                style={{...styles.actionButton, ...styles.primaryButton}}
                onClick={handleConvertToDeal}
              >
                <ArrowRight size={16} />
                Convert to Deal
              </button>
            )}
            
            <button
              style={styles.actionButton}
              onClick={handleEditBrief}
            >
              <Edit2 size={16} />
              Edit
            </button>
            
            <div style={{ position: 'relative' }}>
              <button
                style={styles.moreButton}
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical size={16} />
              </button>
              
              {showActions && (
                <div style={styles.dropdown}>
                  <button style={styles.dropdownItem} onClick={handleCopyId}>
                    <Copy size={16} />
                    Copy Brief ID
                  </button>
                  <button style={styles.dropdownItem} onClick={handleRetriggerAI} disabled={retriggeringAI}>
                    <RefreshCw size={16} />
                    {retriggeringAI ? 'Restarting...' : 'Restart AI Analysis'}
                  </button>
                  <button style={styles.dropdownItem} onClick={handleGenerateClarificationEmail} disabled={emailGenerating}>
                    <Mail size={16} />
                    {emailGenerating ? 'Generating...' : 'Generate Email'}
                  </button>
                  <button style={{...styles.dropdownItem, color: '#ef4444'}} onClick={handleDeleteBrief}>
                    <Trash2 size={16} />
                    Delete Brief
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status Bar */}
        <div style={styles.statusBar}>
          <div style={styles.statusItem}>
            <div style={{
              ...styles.statusBadge,
              backgroundColor: statusInfo.bg,
              color: statusInfo.color
            }}>
              <StatusIcon size={14} />
              {statusInfo.label}
            </div>
          </div>
          
          <div style={styles.progressItem}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
              Progress
            </span>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${completionPercentage}%`
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: '600' }}>
              {completionPercentage}%
            </span>
          </div>
          
          <div style={styles.statusItem}>
            <Timer size={16} color="#64748b" />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {briefHelpers.getDaysOld(brief.createdAt)} days old
            </span>
          </div>
          
          {estimatedValue > 0 && (
            <div style={styles.statusItem}>
              <IndianRupee size={16} color="#10b981" />
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>
                {formatCurrency(estimatedValue)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.sidebar}>
          <div style={styles.nav}>
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'deliverables', label: 'Deliverables', icon: Package },
              { id: 'missing-info', label: 'Missing Info', icon: AlertTriangle, badge: criticalMissing.length + importantMissing.length },
              { id: 'risk-assessment', label: 'Risk Assessment', icon: Shield },
              { id: 'original-content', label: 'Original Content', icon: FileText }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  style={{
                    ...styles.navItem,
                    ...(activeTab === tab.id ? styles.navItemActive : {})
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon size={16} />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span style={{
                      backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#ef4444',
                      color: activeTab === tab.id ? '#ffffff' : '#ffffff',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '10px',
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      marginLeft: 'auto'
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.mainContent}>
          {renderTabContent()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .back-button:hover {
          background-color: #f1f5f9;
          color: #475569;
        }
        
        .action-button:hover {
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        
        .dropdown-item:hover {
          background-color: #f1f5f9;
        }
        
        .ai-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default BriefDetailsPage;
/**
 * Script Details & Editor - Comprehensive script management interface
 * 
 * This component provides full script management capabilities including:
 * - Complete script viewing and editing with scene-by-scene breakdown
 * - A/B variation creation and management with fetching existing variations
 * - Deal linking/unlinking functionality
 * - Script regeneration with real-time status monitoring
 * - Export functionality for multiple formats (JSON, Text)
 * - Real-time AI generation status updates
 * 
 * Integrates with backend endpoints:
 * - GET /api/scripts/:scriptId - Fetch script details
 * - PATCH /api/scripts/:scriptId - Update script
 * - POST /api/scripts/:scriptId/variations - Create A/B variations
 * - GET /api/scripts/:scriptId/variations - Fetch existing variations
 * - POST /api/scripts/:scriptId/link-deal/:dealId - Link to deal
 * - DELETE /api/scripts/:scriptId/unlink-deal - Unlink from deal
 * - POST /api/scripts/:scriptId/regenerate - Regenerate script
 * - GET /api/scripts/:scriptId/export - Export script content
 * - GET /api/scripts/:scriptId/generation-status - Monitor generation status
 * 
 * File Path: src/features/scripts/pages/ScriptDetailsEditor.jsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit3,
  Save,
  Download,
  Share2,
  Link2,
  Unlink,
  RefreshCw,
  Copy,
  Eye,
  Play,
  Pause,
  Clock,
  Target,
  Hash,
  Camera,
  Mic,
  Palette,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Info,
  ExternalLink,
  FileText,
  Video,
  Upload,
  Shield,
  Sparkles,
  Timer,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Activity,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Award,
  ThumbsUp,
  Share,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Layers,
  Sliders,
  Film
} from 'lucide-react';
import useScriptsStore from '../../../store/scriptsStore';
import { scriptsAPI } from '../../../api/endpoints/scripts';
import { toast } from 'react-hot-toast';

const ScriptDetailsEditor = () => {
  const { scriptId } = useParams();
  const navigate = useNavigate();
  
  const {
    currentScript,
    availableDeals,
    isGenerating,
    isPolling,
    fetchScriptById,
    updateScript,
    updateScriptStatus,
    regenerateScript,
    createScriptVariation,
    linkScriptToDeal,
    unlinkScriptFromDeal
  } = useScriptsStore();

  // UI state
  const [activeTab, setActiveTab] = useState('script');
  const [isEditing, setIsEditing] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Data state
  const [scriptVariations, setScriptVariations] = useState([]);
  const [generationStatus, setGenerationStatus] = useState(null);
  const pollingIntervalRef = useRef(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({});
  const [editingScene, setEditingScene] = useState(null);
  
  // Variation form state
  const [variationForm, setVariationForm] = useState({
    type: 'hook_variation',
    title: '',
    description: '',
    changes: {}
  });

  // Load script data
  useEffect(() => {
    if (scriptId) {
      fetchScriptById(scriptId);
    }
  }, [scriptId, fetchScriptById]);

  // Initialize edit form when script loads
  useEffect(() => {
    if (currentScript && !isEditing) {
      setEditForm({
        title: currentScript.title || '',
        creatorStyleNotes: currentScript.creatorStyleNotes || '',
        tags: currentScript.tags || [],
        status: currentScript.status || 'draft'
      });
    }
  }, [currentScript, isEditing]);

  // Fetch variations when variations tab is active
  useEffect(() => {
    if (activeTab === 'variations' && scriptId && scriptVariations.length === 0) {
      fetchScriptVariations();
    }
  }, [activeTab, scriptId]);

  // Poll for generation status if script is generating
  useEffect(() => {
    if (currentScript?.aiGeneration?.status === 'processing' && scriptId) {
      startGenerationStatusPolling();
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentScript?.aiGeneration?.status, scriptId]);

  // Fetch script variations
  const fetchScriptVariations = async () => {
    setIsLoadingVariations(true);
    try {
      const response = await scriptsAPI.getScriptVariations(scriptId);
      if (response.success) {
        setScriptVariations(response.data.variations || []);
      }
    } catch (error) {
      console.error('Failed to fetch variations:', error);
      toast.error('Failed to load variations');
    } finally {
      setIsLoadingVariations(false);
    }
  };

  // Start polling for generation status
  const startGenerationStatusPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await scriptsAPI.getGenerationStatus(scriptId);
        if (response.success) {
          setGenerationStatus(response.data);
          
          if (response.data.isGenerationComplete || response.data.status === 'failed') {
            clearInterval(pollingIntervalRef.current);
            fetchScriptById(scriptId);
            
            if (response.data.status === 'completed') {
              toast.success('Script generation completed!');
            } else if (response.data.status === 'failed') {
              toast.error('Script generation failed');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch generation status:', error);
      }
    }, 2000);
  };

  const handleSave = async () => {
    try {
      await updateScript(scriptId, editForm);
      setIsEditing(false);
      toast.success('Script updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update script');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateScriptStatus(scriptId, newStatus);
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateScript(scriptId);
      toast.success('Script regeneration started!');
      startGenerationStatusPolling();
    } catch (error) {
      console.error('Regeneration failed:', error);
      toast.error('Failed to regenerate script');
    }
  };

  const handleLinkDeal = async (dealId) => {
    try {
      await linkScriptToDeal(scriptId, dealId);
      setShowDealModal(false);
      toast.success('Script linked to deal successfully!');
    } catch (error) {
      console.error('Deal linking failed:', error);
      toast.error('Failed to link deal');
    }
  };

  const handleUnlinkDeal = async () => {
    try {
      await unlinkScriptFromDeal(scriptId);
      toast.success('Script unlinked from deal!');
    } catch (error) {
      console.error('Deal unlinking failed:', error);
      toast.error('Failed to unlink deal');
    }
  };

  const handleCreateVariation = async () => {
    try {
      await createScriptVariation(scriptId, variationForm.type, variationForm.title, variationForm.description, variationForm.changes);
      setShowVariationModal(false);
      setVariationForm({ type: 'hook_variation', title: '', description: '', changes: {} });
      toast.success('Variation created successfully!');
      fetchScriptVariations();
    } catch (error) {
      console.error('Variation creation failed:', error);
      toast.error('Failed to create variation');
    }
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const response = await scriptsAPI.exportScriptContent(scriptId, format);
      
      if (response.data) {
        const blob = new Blob(
          [format === 'json' ? JSON.stringify(response.data, null, 2) : response.data],
          { type: format === 'json' ? 'application/json' : 'text/plain' }
        );
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `script-${scriptId}.${format === 'json' ? 'json' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Script exported successfully!');
        setShowExportModal(false);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export script');
    } finally {
      setIsExporting(false);
    }
  };

  const navigateBack = () => {
    navigate('/scripts');
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: '#71717A',
      generated: '#3B82F6',
      reviewed: '#F59E0B',
      approved: '#10B981',
      in_production: '#8B5CF6',
      completed: '#059669'
    };
    return colors[status] || '#71717A';
  };

  const getInputTypeIcon = (inputType) => {
    const icons = {
      text_brief: FileText,
      file_upload: Upload,
      video_transcription: Video
    };
    return icons[inputType] || FileText;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const addTag = (tag) => {
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagIndex) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex)
    }));
  };

  const tabs = [
    { id: 'script', label: 'Generated Script', icon: Film },
    { id: 'variations', label: 'A/B Variations', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFAFA 0%, #F4F4F5 100%)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    
    header: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      borderBottom: '1px solid rgba(228, 228, 231, 0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.02)'
    },
    
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.75rem 2rem'
    },
    
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '2rem',
      marginBottom: '1.5rem'
    },
    
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '0.625rem 1.125rem',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      color: '#52525B',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    },
    
    headerMain: {
      flex: 1
    },
    
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#18181B',
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 0.875rem',
      borderRadius: '100px',
      fontSize: '0.6875rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.75px',
      color: '#FFFFFF',
      position: 'relative'
    },
    
    statusDot: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.9)',
      animation: 'pulse 2s infinite'
    },
    
    metadata: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      fontSize: '0.875rem',
      color: '#71717A'
    },
    
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem'
    },
    
    dealBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '0.625rem 1rem',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '10px',
      fontSize: '0.8125rem',
      color: '#059669',
      marginTop: '0.75rem',
      transition: 'all 0.2s'
    },
    
    headerActions: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.125rem',
      background: '#FFFFFF',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#52525B',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      whiteSpace: 'nowrap'
    },
    
    primaryButton: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      borderColor: 'transparent',
      color: '#FFFFFF',
      boxShadow: '0 1px 2px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(139, 92, 246, 0.15)'
    },
    
    dangerButton: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      borderColor: 'transparent',
      color: '#FFFFFF'
    },
    
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      padding: '1.5rem 2rem',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
      borderTop: '1px solid rgba(228, 228, 231, 0.3)',
      borderBottom: '1px solid rgba(228, 228, 231, 0.3)'
    },
    
    statCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem'
    },
    
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    
    statContent: {
      flex: 1
    },
    
    statLabel: {
      fontSize: '0.75rem',
      color: '#71717A',
      fontWeight: '500',
      marginBottom: '0.125rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    statValue: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B'
    },
    
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem'
    },
    
    tabNavigation: {
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '0.375rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)',
      marginBottom: '2rem',
      display: 'flex',
      gap: '0.25rem',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    tabButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.625rem',
      padding: '0.875rem 1.5rem',
      borderRadius: '12px',
      background: 'transparent',
      border: 'none',
      color: '#71717A',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    },
    
    tabButtonActive: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      color: '#FFFFFF',
      boxShadow: '0 1px 2px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(139, 92, 246, 0.15)'
    },
    
    tabPanel: {
      background: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.03)',
      border: '1px solid rgba(228, 228, 231, 0.3)',
      overflow: 'hidden',
      minHeight: '500px'
    },
    
    tabContent: {
      padding: '2.5rem'
    },
    
    generationBanner: {
      padding: '1.25rem 1.5rem',
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      borderRadius: '12px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    
    hookCard: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0.01) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden'
    },
    
    hookHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.75rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
    },
    
    hookIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF'
    },
    
    hookTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1E40AF',
      flex: 1
    },
    
    hookDuration: {
      padding: '0.25rem 0.75rem',
      background: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '20px',
      fontSize: '0.75rem',
      color: '#1E40AF',
      fontWeight: '500'
    },
    
    fieldGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem'
    },
    
    fieldLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#71717A',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    
    fieldValue: {
      fontSize: '0.9375rem',
      color: '#18181B',
      lineHeight: 1.6,
      padding: '1rem',
      background: '#FAFBFC',
      borderRadius: '10px',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    sceneCard: {
      background: '#FAFBFC',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '1.5rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    },
    
    sceneHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(228, 228, 231, 0.3)'
    },
    
    sceneNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      color: '#FFFFFF',
      fontSize: '0.75rem',
      fontWeight: '600',
      marginRight: '0.75rem'
    },
    
    sceneTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#18181B',
      display: 'flex',
      alignItems: 'center'
    },
    
    sceneDuration: {
      padding: '0.25rem 0.75rem',
      background: 'rgba(139, 92, 246, 0.1)',
      borderRadius: '20px',
      fontSize: '0.6875rem',
      color: '#7C3AED',
      fontWeight: '500'
    },
    
    notesCard: {
      marginTop: '1.5rem',
      padding: '1rem',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.03) 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(245, 158, 11, 0.15)'
    },
    
    ctaCard: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.15)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem'
    },
    
    ctaHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.75rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(16, 185, 129, 0.1)'
    },
    
    ctaIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF'
    },
    
    hashtagsCard: {
      background: '#FAFBFC',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    tagGroup: {
      marginBottom: '1.5rem'
    },
    
    tagGroupLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#71717A',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.875rem'
    },
    
    tagList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.625rem'
    },
    
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.875rem',
      borderRadius: '100px',
      fontSize: '0.8125rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    
    primaryTag: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#1E40AF',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    
    trendingTag: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#D97706',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    
    variationCard: {
      background: '#FAFBFC',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    },
    
    formGroup: {
      marginBottom: '1.5rem'
    },
    
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#52525B',
      marginBottom: '0.5rem'
    },
    
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      background: '#FFFFFF'
    },
    
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      minHeight: '120px',
      resize: 'vertical',
      background: '#FFFFFF',
      fontFamily: 'inherit'
    },
    
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      background: '#FFFFFF',
      cursor: 'pointer'
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
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    },
    
    modalContent: {
      background: '#FFFFFF',
      borderRadius: '20px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    },
    
    modalHeader: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '1.5rem'
    },
    
    modalActions: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-end',
      marginTop: '2rem'
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem'
    },
    
    emptyIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 1.5rem',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#8B5CF6'
    },
    
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '0.5rem'
    },
    
    emptyDescription: {
      fontSize: '0.875rem',
      color: '#71717A',
      maxWidth: '400px',
      margin: '0 auto'
    },
    
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem',
      gap: '1rem'
    }
  };

  if (!currentScript) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8B5CF6' }} />
          <p style={{ color: '#71717A' }}>Loading script details...</p>
        </div>
      </div>
    );
  }

  const InputIcon = getInputTypeIcon(currentScript.inputType);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <button 
              style={styles.backButton} 
              onClick={navigateBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }}
            >
              <ArrowLeft size={16} />
              Back to Scripts
            </button>

            <div style={styles.headerMain}>
              <div style={styles.titleSection}>
                <h1 style={styles.title}>
                  {isEditing ? (
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      style={{ ...styles.input, fontSize: '2rem', fontWeight: '700', border: 'none', background: 'transparent', padding: 0 }}
                    />
                  ) : (
                    currentScript.title
                  )}
                </h1>
                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(currentScript.status) }}>
                  <div style={styles.statusDot} />
                  {currentScript.status.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div style={styles.metadata}>
                <div style={styles.metaItem}>
                  <InputIcon size={14} />
                  <span>{currentScript.platform?.replace(/_/g, ' ')}</span>
                </div>
                <div style={styles.metaItem}>
                  <Clock size={14} />
                  <span>{formatDate(currentScript.createdAt)}</span>
                </div>
                <div style={styles.metaItem}>
                  <Hash size={14} />
                  <span>{currentScript.scriptId}</span>
                </div>
              </div>

              {currentScript.dealConnection?.isLinked && (
                <div style={styles.dealBadge}>
                  <Link2 size={14} />
                  <span>
                    <strong>{currentScript.dealConnection.brandName}</strong> - {currentScript.dealConnection.dealTitle}
                  </span>
                  <button
                    style={{ 
                      background: 'transparent',
                      border: 'none',
                      color: '#059669',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={handleUnlinkDeal}
                  >
                    <Unlink size={12} />
                  </button>
                </div>
              )}
            </div>

            <div style={styles.headerActions}>
              {isEditing ? (
                <>
                  <button style={styles.actionButton} onClick={() => setIsEditing(false)}>
                    <X size={16} />
                    Cancel
                  </button>
                  <button style={{ ...styles.actionButton, ...styles.primaryButton }} onClick={handleSave}>
                    <Save size={16} />
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button style={styles.actionButton} onClick={() => setIsEditing(true)}>
                    <Edit3 size={16} />
                    Edit
                  </button>
                  
                  <button style={styles.actionButton} onClick={() => setShowExportModal(true)}>
                    <Download size={16} />
                    Export
                  </button>
                  
                  <button style={styles.actionButton} onClick={() => setShowDealModal(true)}>
                    <Link2 size={16} />
                    Link Deal
                  </button>
                  
                  {currentScript.aiGeneration?.status === 'completed' && (
                    <button 
                      style={{ ...styles.actionButton, ...styles.primaryButton }} 
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                    >
                      <RefreshCw size={16} style={{ 
                        animation: isGenerating ? 'spin 1s linear infinite' : 'none' 
                      }} />
                      Regenerate
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.1)' }}>
              <Timer size={18} color="#3B82F6" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Duration</div>
              <div style={styles.statValue}>
                {currentScript.estimatedDuration || currentScript.getEstimatedDuration?.() || 'TBD'}
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.1)' }}>
              <TrendingUp size={18} color="#10B981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Complexity</div>
              <div style={styles.statValue}>
                {currentScript.complexityScore || currentScript.getComplexityScore?.() || 0}/100
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.1)' }}>
              <Eye size={18} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Views</div>
              <div style={styles.statValue}>{formatNumber(currentScript.viewCount || 0)}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(139, 92, 246, 0.1)' }}>
              <Sparkles size={18} color="#8B5CF6" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>AI Status</div>
              <div style={styles.statValue}>
                {currentScript.aiGeneration?.status === 'completed' ? 'Ready' :
                 currentScript.aiGeneration?.status === 'processing' ? 'Processing' :
                 currentScript.aiGeneration?.status === 'failed' ? 'Failed' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Tab Navigation */}
        <div style={styles.tabNavigation}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                style={{
                  ...styles.tabButton,
                  ...(isActive ? styles.tabButtonActive : {})
                }}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                    e.currentTarget.style.color = '#7C3AED';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#71717A';
                  }
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div style={styles.tabPanel}>
          <div style={styles.tabContent}>
            {/* Script Tab */}
            {activeTab === 'script' && (
              <div>
                {/* Generation Status */}
                {generationStatus && currentScript.aiGeneration?.status === 'processing' && (
                  <div style={styles.generationBanner}>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#F59E0B' }} />
                    <div style={{ flex: 1, fontSize: '0.875rem', color: '#92400E', fontWeight: '500' }}>
                      {generationStatus.message || 'AI is generating your script...'}
                      {generationStatus.progress && ` (${generationStatus.progress}%)`}
                    </div>
                  </div>
                )}

                {currentScript.aiGeneration?.status !== 'completed' ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                      {currentScript.aiGeneration?.status === 'processing' ? (
                        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : currentScript.aiGeneration?.status === 'failed' ? (
                        <AlertCircle size={32} />
                      ) : (
                        <Clock size={32} />
                      )}
                    </div>
                    <h3 style={styles.emptyTitle}>
                      {currentScript.aiGeneration?.status === 'processing' ? 'AI Generation in Progress' :
                       currentScript.aiGeneration?.status === 'failed' ? 'Generation Failed' :
                       'Script Generation Pending'}
                    </h3>
                    <p style={styles.emptyDescription}>
                      {currentScript.aiGeneration?.status === 'processing' ? 'Please wait while we generate your script...' :
                       currentScript.aiGeneration?.status === 'failed' ? 'Something went wrong. Try regenerating the script.' :
                       'AI generation has not started yet.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Hook Section */}
                    {currentScript.aiGeneration.generatedScript?.hook && (
                      <div style={styles.hookCard}>
                        <div style={styles.hookHeader}>
                          <div style={styles.hookIcon}>
                            <Zap size={18} />
                          </div>
                          <h3 style={styles.hookTitle}>Opening Hook</h3>
                          <span style={styles.hookDuration}>
                            {currentScript.aiGeneration.generatedScript.hook.duration}
                          </span>
                        </div>
                        
                        <div style={styles.fieldGrid}>
                          <div style={styles.field}>
                            <div style={styles.fieldLabel}>
                              <Mic size={12} />
                              Script
                            </div>
                            <div style={styles.fieldValue}>
                              {currentScript.aiGeneration.generatedScript.hook.text}
                            </div>
                          </div>
                          <div style={styles.field}>
                            <div style={styles.fieldLabel}>
                              <Camera size={12} />
                              Visual Cue
                            </div>
                            <div style={styles.fieldValue}>
                              {currentScript.aiGeneration.generatedScript.hook.visualCue}
                            </div>
                          </div>
                        </div>
                        
                        {currentScript.aiGeneration.generatedScript.hook.notes && (
                          <div style={styles.notesCard}>
                            <div style={styles.fieldLabel}>
                              <Info size={12} />
                              Notes
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#52525B', marginTop: '0.5rem' }}>
                              {currentScript.aiGeneration.generatedScript.hook.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Scenes */}
                    {currentScript.aiGeneration.generatedScript?.scenes?.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={styles.sectionTitle}>
                          <Play size={18} />
                          Content Scenes ({currentScript.aiGeneration.generatedScript.scenes.length})
                        </h3>
                        
                        {currentScript.aiGeneration.generatedScript.scenes.map((scene, index) => (
                          <div 
                            key={index} 
                            style={styles.sceneCard}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={styles.sceneHeader}>
                              <div style={styles.sceneTitle}>
                                <span style={styles.sceneNumber}>{scene.sceneNumber}</span>
                                {scene.title}
                              </div>
                              <span style={styles.sceneDuration}>
                                {scene.timeframe}
                              </span>
                            </div>
                            
                            <div style={styles.fieldGrid}>
                              <div style={styles.field}>
                                <div style={styles.fieldLabel}>
                                  <Mic size={12} />
                                  Dialogue
                                </div>
                                <div style={styles.fieldValue}>{scene.dialogue}</div>
                              </div>
                              
                              <div style={styles.field}>
                                <div style={styles.fieldLabel}>
                                  <Camera size={12} />
                                  Visual
                                </div>
                                <div style={styles.fieldValue}>{scene.visualDescription}</div>
                              </div>
                              
                              <div style={styles.field}>
                                <div style={styles.fieldLabel}>Camera Angle</div>
                                <div style={styles.fieldValue}>{scene.cameraAngle}</div>
                              </div>
                              
                              <div style={styles.field}>
                                <div style={styles.fieldLabel}>Lighting</div>
                                <div style={styles.fieldValue}>{scene.lighting || 'Natural'}</div>
                              </div>
                            </div>

                            {scene.props?.length > 0 && (
                              <div style={{ marginTop: '1.5rem' }}>
                                <div style={styles.fieldLabel}>Props Needed</div>
                                <div style={styles.tagList}>
                                  {scene.props.map((prop, propIndex) => (
                                    <span key={propIndex} style={{
                                      ...styles.tag,
                                      background: 'rgba(139, 92, 246, 0.05)',
                                      color: '#7C3AED',
                                      border: '1px solid rgba(139, 92, 246, 0.15)'
                                    }}>
                                      {prop}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {scene.notes && (
                              <div style={styles.notesCard}>
                                <div style={styles.fieldLabel}>
                                  <Lightbulb size={12} />
                                  Director Notes
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#52525B', marginTop: '0.5rem' }}>
                                  {scene.notes}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Call to Action */}
                    {currentScript.aiGeneration.generatedScript?.callToAction && (
                      <div style={styles.ctaCard}>
                        <div style={styles.ctaHeader}>
                          <div style={styles.ctaIcon}>
                            <Target size={18} />
                          </div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#059669' }}>
                            Call to Action
                          </h3>
                        </div>
                        
                        <div style={styles.fieldGrid}>
                          <div style={styles.field}>
                            <div style={styles.fieldLabel}>Primary CTA</div>
                            <div style={styles.fieldValue}>
                              {currentScript.aiGeneration.generatedScript.callToAction.primary}
                            </div>
                          </div>
                          {currentScript.aiGeneration.generatedScript.callToAction.secondary && (
                            <div style={styles.field}>
                              <div style={styles.fieldLabel}>Secondary CTA</div>
                              <div style={styles.fieldValue}>
                                {currentScript.aiGeneration.generatedScript.callToAction.secondary}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {currentScript.aiGeneration.generatedScript?.hashtags && (
                      <div style={styles.hashtagsCard}>
                        <h3 style={styles.sectionTitle}>
                          <Hash size={18} />
                          Social Media Elements
                        </h3>
                        
                        {currentScript.aiGeneration.generatedScript.hashtags.primary?.length > 0 && (
                          <div style={styles.tagGroup}>
                            <div style={styles.tagGroupLabel}>Primary Hashtags</div>
                            <div style={styles.tagList}>
                              {currentScript.aiGeneration.generatedScript.hashtags.primary.map((hashtag, index) => (
                                <span key={index} style={{ ...styles.tag, ...styles.primaryTag }}>
                                  {hashtag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentScript.aiGeneration.generatedScript.hashtags.trending?.length > 0 && (
                          <div style={styles.tagGroup}>
                            <div style={styles.tagGroupLabel}>Trending Hashtags</div>
                            <div style={styles.tagList}>
                              {currentScript.aiGeneration.generatedScript.hashtags.trending.map((hashtag, index) => (
                                <span key={index} style={{ ...styles.tag, ...styles.trendingTag }}>
                                  {hashtag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Variations Tab */}
            {activeTab === 'variations' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={styles.sectionTitle}>
                    <Layers size={18} />
                    Script Variations
                  </h3>
                  <button
                    style={{ ...styles.actionButton, ...styles.primaryButton }}
                    onClick={() => setShowVariationModal(true)}
                  >
                    <Plus size={16} />
                    Create Variation
                  </button>
                </div>

                {isLoadingVariations ? (
                  <div style={styles.loadingState}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8B5CF6' }} />
                    <p style={{ color: '#71717A' }}>Loading variations...</p>
                  </div>
                ) : scriptVariations.length > 0 ? (
                  scriptVariations.map((variation, index) => (
                    <div 
                      key={variation._id || index} 
                      style={styles.variationCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#18181B' }}>
                          {variation.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#71717A' }}>
                          {formatDate(variation.createdAt)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '0.75rem' }}>
                        {variation.description}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{
                          ...styles.tag,
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          {variation.variationType?.replace(/_/g, ' ')}
                        </span>
                        {variation.performanceScore && (
                          <span style={{ fontSize: '0.75rem', color: '#71717A' }}>
                            Performance: {variation.performanceScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                      <Layers size={32} />
                    </div>
                    <h3 style={styles.emptyTitle}>No Variations Created</h3>
                    <p style={styles.emptyDescription}>
                      Create A/B test variations to optimize your script performance and discover what works best.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 style={styles.sectionTitle}>
                  <Sliders size={18} />
                  Script Settings
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Script Status</label>
                    <select
                      value={currentScript.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={styles.select}
                    >
                      <option value="draft">Draft</option>
                      <option value="generated">Generated</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="in_production">In Production</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Platform</label>
                    <div style={{ ...styles.input, backgroundColor: '#FAFBFC', color: '#71717A' }}>
                      {currentScript.platform?.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Creator Style Notes</label>
                  <textarea
                    value={isEditing ? editForm.creatorStyleNotes : currentScript.creatorStyleNotes || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, creatorStyleNotes: e.target.value }))}
                    readOnly={!isEditing}
                    style={{
                      ...styles.textarea,
                      backgroundColor: isEditing ? '#FFFFFF' : '#FAFBFC',
                      color: isEditing ? '#18181B' : '#71717A'
                    }}
                    placeholder="Add your style preferences and notes..."
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tags</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        placeholder="Press Enter to add tags"
                        style={styles.input}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value) {
                              addTag(value);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <div style={{ ...styles.tagList, marginTop: '0.75rem' }}>
                        {editForm.tags.map((tag, index) => (
                          <span key={index} style={{
                            ...styles.tag,
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#7C3AED',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}>
                            {tag}
                            <X
                              size={12}
                              style={{ marginLeft: '0.25rem', cursor: 'pointer' }}
                              onClick={() => removeTag(index)}
                            />
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={styles.tagList}>
                      {currentScript.tags?.map((tag, index) => (
                        <span key={index} style={{
                          ...styles.tag,
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#7C3AED',
                          border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                          {tag}
                        </span>
                      )) || <span style={{ color: '#A1A1AA' }}>No tags added</span>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDealModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Link to Deal</h3>
            
            {availableDeals?.length > 0 ? (
              <div>
                <p style={{ marginBottom: '1rem', color: '#71717A', fontSize: '0.875rem' }}>
                  Select a deal to link this script to:
                </p>
                {availableDeals.map(deal => (
                  <div
                    key={deal._id}
                    style={{
                      padding: '1rem',
                      border: '1px solid rgba(228, 228, 231, 0.8)',
                      borderRadius: '10px',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: '#FAFBFC'
                    }}
                    onClick={() => handleLinkDeal(deal._id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FAFBFC';
                      e.currentTarget.style.borderColor = 'rgba(228, 228, 231, 0.8)';
                    }}
                  >
                    <div style={{ fontWeight: '500' }}>{deal.title}</div>
                    <div style={{ fontSize: '0.875rem', color: '#71717A' }}>
                      {deal.brandName} • {deal.stage}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#71717A' }}>No available deals to link.</p>
            )}
            
            <div style={styles.modalActions}>
              <button style={styles.actionButton} onClick={() => setShowDealModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showVariationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Create Script Variation</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Variation Type</label>
              <select
                value={variationForm.type}
                onChange={(e) => setVariationForm(prev => ({ ...prev, type: e.target.value }))}
                style={styles.select}
              >
                <option value="hook_variation">Hook Variations</option>
                <option value="cta_variation">CTA Variations</option>
                <option value="scene_order">Scene Order</option>
                <option value="brand_integration">Brand Integration</option>
                <option value="ending_variation">Ending Variations</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                value={variationForm.title}
                onChange={(e) => setVariationForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Question-based Hook"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={variationForm.description}
                onChange={(e) => setVariationForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this variation..."
                style={styles.textarea}
              />
            </div>
            
            <div style={styles.modalActions}>
              <button style={styles.actionButton} onClick={() => setShowVariationModal(false)}>
                Cancel
              </button>
              <button 
                style={{ ...styles.actionButton, ...styles.primaryButton }}
                onClick={handleCreateVariation}
              >
                Create Variation
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Export Script</h3>
            
            <p style={{ marginBottom: '1.5rem', color: '#71717A', fontSize: '0.875rem' }}>
              Choose export format:
            </p>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <button
                style={{
                  padding: '1.25rem',
                  border: '1px solid rgba(228, 228, 231, 0.8)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#FAFBFC'
                }}
                onClick={() => handleExport('json')}
                disabled={isExporting}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAFBFC';
                  e.currentTarget.style.borderColor = 'rgba(228, 228, 231, 0.8)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.375rem' }}>JSON Format</div>
                <div style={{ fontSize: '0.8125rem', color: '#71717A' }}>
                  Structured data with all script elements
                </div>
              </button>
              
              <button
                style={{
                  padding: '1.25rem',
                  border: '1px solid rgba(228, 228, 231, 0.8)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#FAFBFC'
                }}
                onClick={() => handleExport('text')}
                disabled={isExporting}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAFBFC';
                  e.currentTarget.style.borderColor = 'rgba(228, 228, 231, 0.8)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.375rem' }}>Text Format</div>
                <div style={{ fontSize: '0.8125rem', color: '#71717A' }}>
                  Plain text script for easy reading
                </div>
              </button>
            </div>
            
            <div style={styles.modalActions}>
              <button style={styles.actionButton} onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isExporting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8B5CF6' }} />
            <p style={{ color: '#71717A' }}>Exporting script...</p>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ScriptDetailsEditor;
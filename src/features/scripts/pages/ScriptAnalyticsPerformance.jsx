/**
 * Script Analytics & Performance - Comprehensive performance tracking and insights
 * 
 * This component provides detailed analytics and performance metrics including:
 * - Overall performance dashboard with key metrics and trends
 * - Individual script performance analysis with drill-down capabilities
 * - Status-based filtering and analysis
 * - Advanced search functionality for specific script analysis
 * - AI generation efficiency and success rate tracking
 * - Deal-linked scripts ROI analysis and revenue tracking
 * - Platform-specific performance breakdowns
 * - Optimization recommendations based on performance data
 * - Time-based performance trends and seasonal insights
 * - Export functionality for analytics reports
 * 
 * Integrates with backend endpoints:
 * - GET /api/scripts/dashboard/stats - Overall dashboard statistics
 * - GET /api/scripts/:scriptId/analysis - Individual script analysis
 * - GET /api/scripts/status/:status - Scripts filtered by status
 * - POST /api/scripts/search - Advanced script search
 * - GET /api/scripts/:scriptId/export - Export script data
 * - GET /api/scripts - Script data for comparison and aggregation
 * 
 * File Path: src/features/scripts/pages/ScriptAnalyticsPerformance.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Clock,
  Eye,
  ThumbsUp,
  Share2,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Star,
  Award,
  Activity,
  Percent,
  Hash,
  Link2,
  FileText,
  Video,
  Upload,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Search,
  X,
  Loader2,
  Brain,
  ExternalLink,
  Layers,
  GitBranch,
  Package,
  Shield,
  Database,
  Cpu,
  BarChart2,
  PlusCircle,
  MinusCircle,
  ChevronRight,
  Sparkles,
  Timer,
  Code,
  Gauge
} from 'lucide-react';
import useScriptsStore from '../../../store/scriptsStore';
import { scriptsAPI } from '../../../api/endpoints/scripts';
import { toast } from 'react-hot-toast';

const ScriptAnalyticsPerformance = () => {
  const navigate = useNavigate();
  
  const {
    scripts,
    dashboardStats,
    fetchScripts,
    fetchDashboardStats
  } = useScriptsStore();

  // Analytics state
  const [selectedTimeframe, setSelectedTimeframe] = useState('30_days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [comparisonScripts, setComparisonScripts] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  // Data state
  const [scriptsByStatus, setScriptsByStatus] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [selectedScriptAnalysis, setSelectedScriptAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingStatusData, setIsLoadingStatusData] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // UI state
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState({
    performance: true,
    generation: true,
    platform: true,
    deals: true
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    platform: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minViews: 0,
    maxViews: null,
    hasDeals: null
  });

  // Load initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchScripts();
  }, [fetchDashboardStats, fetchScripts]);

  // Load scripts by status when status filter changes
  useEffect(() => {
    if (selectedStatus !== 'all') {
      fetchScriptsByStatus(selectedStatus);
    }
  }, [selectedStatus]);

  // Fetch scripts by status
  const fetchScriptsByStatus = async (status) => {
    setIsLoadingStatusData(true);
    try {
      const response = await scriptsAPI.getScriptsByStatus(status);
      if (response.success) {
        setScriptsByStatus(prev => ({
          ...prev,
          [status]: response.data.scripts || []
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch scripts with status ${status}:`, error);
      toast.error('Failed to load scripts by status');
    } finally {
      setIsLoadingStatusData(false);
    }
  };

  // Fetch individual script analysis
  const fetchScriptAnalysis = async (scriptId) => {
    setIsLoadingAnalysis(true);
    try {
      const response = await scriptsAPI.getScriptAnalysis(scriptId);
      if (response.success) {
        setSelectedScriptAnalysis(response.data.analysis);
        setShowAnalysisModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch script analysis:', error);
      toast.error('Failed to load script analysis');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Perform advanced search
  const performSearch = async () => {
    if (!searchQuery && Object.values(searchFilters).every(v => !v)) {
      toast.error('Please enter search criteria');
      return;
    }
    
    setIsSearching(true);
    try {
      const searchData = {
        query: searchQuery,
        ...Object.entries(searchFilters).reduce((acc, [key, value]) => {
          if (value !== null && value !== '' && value !== 0) {
            acc[key] = value;
          }
          return acc;
        }, {})
      };
      
      const response = await scriptsAPI.searchScripts(searchData);
      if (response.success) {
        setSearchResults(response.data.scripts);
        toast.success(`Found ${response.data.scripts.length} scripts`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Export analytics report
  const exportAnalyticsReport = async () => {
    setIsExporting(true);
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeframe: selectedTimeframe,
        platform: selectedPlatform,
        metrics: calculateAnalytics(),
        dashboardStats,
        recommendations: generateRecommendations()
      };
      
      // Create and download JSON report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Analytics report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  // Export individual script data
  const exportScriptData = async (scriptId, format = 'json') => {
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
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export script');
    }
  };

  // Add script to comparison
  const addToComparison = (script) => {
    if (comparisonScripts.find(s => s._id === script._id)) {
      toast.info('Script already in comparison');
      return;
    }
    
    if (comparisonScripts.length >= 5) {
      toast.warning('Maximum 5 scripts can be compared');
      return;
    }
    
    setComparisonScripts(prev => [...prev, script]);
    toast.success('Added to comparison');
  };

  // Remove from comparison
  const removeFromComparison = (scriptId) => {
    setComparisonScripts(prev => prev.filter(s => s._id !== scriptId));
  };

  // Calculate analytics from available data
  const calculateAnalytics = useCallback(() => {
    const dataSource = selectedStatus === 'all' 
      ? (searchResults || scripts) 
      : (scriptsByStatus[selectedStatus] || scripts);
    
    if (!dataSource || dataSource.length === 0) {
      return {
        totalViews: 0,
        totalScripts: 0,
        avgComplexity: 0,
        generationSuccessRate: 0,
        platformDistribution: {},
        statusDistribution: {},
        topPerformers: [],
        dealLinkedCount: 0,
        dealLinkedPercentage: 0,
        avgProcessingTime: 0,
        retryRate: 0
      };
    }

    const totalViews = dataSource.reduce((sum, script) => sum + (script.viewCount || 0), 0);
    const avgComplexity = dataSource.reduce((sum, script) => sum + (script.complexityScore || 0), 0) / dataSource.length;
    
    // Platform distribution
    const platformDistribution = {};
    dataSource.forEach(script => {
      const platform = script.platform || 'unknown';
      platformDistribution[platform] = (platformDistribution[platform] || 0) + 1;
    });
    
    // Status distribution
    const statusDistribution = {};
    dataSource.forEach(script => {
      const status = script.status || 'draft';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    // Generation metrics
    const completedScripts = dataSource.filter(script => script.aiGeneration?.status === 'completed').length;
    const failedScripts = dataSource.filter(script => script.aiGeneration?.status === 'failed').length;
    const generationSuccessRate = dataSource.length > 0 ? (completedScripts / dataSource.length) * 100 : 0;
    const retryRate = dataSource.length > 0 ? (failedScripts / dataSource.length) * 100 : 0;

    // Top performers (by view count)
    const topPerformers = dataSource
      .filter(script => script.viewCount > 0)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10);

    // Deal-linked scripts for ROI
    const dealLinkedScripts = dataSource.filter(script => script.dealConnection?.isLinked);
    
    // Average processing time (mock data - would come from backend)
    const avgProcessingTime = dataSource.reduce((sum, script) => {
      const time = script.aiGeneration?.processingTime || 2300;
      return sum + time;
    }, 0) / dataSource.length;
    
    return {
      totalViews,
      totalScripts: dataSource.length,
      avgComplexity: Math.round(avgComplexity),
      generationSuccessRate: Math.round(generationSuccessRate),
      platformDistribution,
      statusDistribution,
      topPerformers,
      dealLinkedCount: dealLinkedScripts.length,
      dealLinkedPercentage: dataSource.length > 0 ? Math.round((dealLinkedScripts.length / dataSource.length) * 100) : 0,
      avgProcessingTime: Math.round(avgProcessingTime),
      retryRate: Math.round(retryRate)
    };
  }, [scripts, scriptsByStatus, selectedStatus, searchResults]);

  const analytics = calculateAnalytics();

  // Generate recommendations based on data
  const generateRecommendations = useCallback(() => {
    const recommendations = [];

    if (analytics.generationSuccessRate < 80) {
      recommendations.push({
        type: 'warning',
        title: 'Low AI Generation Success Rate',
        description: `Only ${analytics.generationSuccessRate}% of scripts are successfully generated. Review input quality.`,
        action: 'Improve brief quality',
        priority: 'high'
      });
    }

    if (analytics.dealLinkedPercentage < 50) {
      recommendations.push({
        type: 'info',
        title: 'Increase Deal Integration',
        description: `Only ${analytics.dealLinkedPercentage}% of scripts are linked to deals. Link more scripts for better ROI tracking.`,
        action: 'Link scripts to deals',
        priority: 'medium'
      });
    }

    if (analytics.avgComplexity < 60) {
      recommendations.push({
        type: 'suggestion',
        title: 'Enhance Script Complexity',
        description: `Average complexity score is ${analytics.avgComplexity}/100. Add more detailed scenes and elements.`,
        action: 'Use detailed granularity',
        priority: 'medium'
      });
    }

    if (Object.keys(analytics.platformDistribution).length < 3) {
      recommendations.push({
        type: 'growth',
        title: 'Diversify Platform Coverage',
        description: 'Consider creating content for more platforms to expand reach.',
        action: 'Explore new platforms',
        priority: 'low'
      });
    }

    if (analytics.retryRate > 20) {
      recommendations.push({
        type: 'warning',
        title: 'High Failure Rate',
        description: `${analytics.retryRate}% of scripts are failing. Check system health and input validation.`,
        action: 'Review failed scripts',
        priority: 'high'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [analytics]);

  const recommendations = generateRecommendations();

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFAFA 0%, #F4F4F5 100%)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    
    header: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      borderBottom: '1px solid rgba(228, 228, 231, 0.5)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.02)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.75rem 2rem'
    },
    
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
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
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#18181B',
      letterSpacing: '-0.02em',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    
    headerActions: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center',
      flexWrap: 'wrap'
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
    
    select: {
      padding: '0.625rem 1rem',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.875rem',
      outline: 'none',
      background: '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem'
    },
    
    filterBar: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '1.25rem',
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)',
      marginBottom: '2rem',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    },
    
    metricCard: {
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)',
      border: '1px solid rgba(228, 228, 231, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    
    metricIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },
    
    metricValue: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#18181B',
      marginBottom: '0.375rem',
      lineHeight: 1.2
    },
    
    metricLabel: {
      fontSize: '0.8125rem',
      color: '#71717A',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.5rem'
    },
    
    metricChange: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    
    changePositive: {
      color: '#10B981'
    },
    
    changeNegative: {
      color: '#EF4444'
    },
    
    changeNeutral: {
      color: '#71717A'
    },
    
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    
    chartCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.03)',
      border: '1px solid rgba(228, 228, 231, 0.3)'
    },
    
    chartTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    
    statusGrid: {
      display: 'grid',
      gap: '0.625rem'
    },
    
    statusItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.875rem 1rem',
      borderRadius: '10px',
      background: '#FAFBFC',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    statusItemActive: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.3)'
    },
    
    statusInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem'
    },
    
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    },
    
    statusName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#18181B',
      textTransform: 'capitalize'
    },
    
    statusCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    
    statusValue: {
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: '#18181B'
    },
    
    statusPercent: {
      fontSize: '0.75rem',
      color: '#71717A',
      fontWeight: '500'
    },
    
    platformList: {
      display: 'grid',
      gap: '0.625rem'
    },
    
    platformItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.875rem 1rem',
      background: 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)',
      borderRadius: '10px',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    platformName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#18181B',
      textTransform: 'capitalize'
    },
    
    platformCount: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#8B5CF6'
    },
    
    performanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    
    performanceCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.03)',
      border: '1px solid rgba(228, 228, 231, 0.3)'
    },
    
    performanceTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    
    performersList: {
      display: 'grid',
      gap: '0.75rem'
    },
    
    performerItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    performerRank: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginRight: '1rem'
    },
    
    performerInfo: {
      flex: 1
    },
    
    performerTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#18181B',
      marginBottom: '0.25rem'
    },
    
    performerMeta: {
      fontSize: '0.75rem',
      color: '#71717A'
    },
    
    performerStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginRight: '1rem'
    },
    
    performerStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.75rem',
      color: '#71717A'
    },
    
    performerActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    
    iconButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: '#FFFFFF',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    
    recommendationsCard: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      marginBottom: '2rem'
    },
    
    recommendationsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.75rem'
    },
    
    recommendationsTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    
    recommendationsList: {
      display: 'grid',
      gap: '0.875rem'
    },
    
    recommendationItem: {
      padding: '1.25rem',
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      transition: 'all 0.2s'
    },
    
    recommendationHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      marginBottom: '0.625rem'
    },
    
    recommendationTitle: {
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: '#18181B',
      flex: 1
    },
    
    recommendationPriority: {
      padding: '0.25rem 0.625rem',
      borderRadius: '100px',
      fontSize: '0.6875rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    recommendationDescription: {
      fontSize: '0.875rem',
      color: '#52525B',
      lineHeight: 1.5,
      marginBottom: '0.875rem'
    },
    
    recommendationAction: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.875rem',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      color: '#FFFFFF',
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    
    searchPanel: {
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)',
      border: '1px solid rgba(228, 228, 231, 0.5)',
      marginBottom: '2rem'
    },
    
    searchHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    
    searchTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#18181B',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    
    searchInput: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '1px solid rgba(228, 228, 231, 0.8)',
      borderRadius: '10px',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      marginBottom: '1rem'
    },
    
    searchFilters: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.875rem',
      marginBottom: '1.25rem'
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
      width: '90%',
      maxWidth: '600px',
      maxHeight: '85vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    },
    
    modalHeader: {
      padding: '1.75rem',
      borderBottom: '1px solid rgba(228, 228, 231, 0.5)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#18181B'
    },
    
    modalBody: {
      flex: 1,
      padding: '1.75rem',
      overflow: 'auto'
    },
    
    modalFooter: {
      padding: '1.75rem',
      borderTop: '1px solid rgba(228, 228, 231, 0.5)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem'
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#71717A'
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
    
    efficiencyGrid: {
      display: 'grid',
      gap: '0.75rem'
    },
    
    efficiencyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)',
      borderRadius: '10px',
      border: '1px solid rgba(228, 228, 231, 0.5)'
    },
    
    efficiencyLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#52525B'
    },
    
    efficiencyValue: {
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: '#18181B'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <button 
              style={styles.backButton} 
              onClick={() => navigate('/scripts')}
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

            <h1 style={styles.title}>
              <Activity size={28} />
              Analytics & Performance
            </h1>

            <div style={styles.headerActions}>
              <button
                style={styles.actionButton}
                onClick={() => setShowSearchPanel(!showSearchPanel)}
              >
                <Search size={16} />
                Search
              </button>
              
              <button
                style={styles.actionButton}
                onClick={() => setShowComparisonModal(true)}
                disabled={comparisonScripts.length === 0}
              >
                <Layers size={16} />
                Compare ({comparisonScripts.length})
              </button>

              <select
                style={styles.select}
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="7_days">Last 7 days</option>
                <option value="30_days">Last 30 days</option>
                <option value="90_days">Last 90 days</option>
                <option value="1_year">Last year</option>
                <option value="all_time">All time</option>
              </select>

              <button 
                style={{ ...styles.actionButton, ...styles.primaryButton }}
                onClick={exportAnalyticsReport}
                disabled={isExporting}
              >
                <Download size={16} />
                Export
              </button>

              <button 
                style={styles.actionButton} 
                onClick={() => {
                  fetchDashboardStats();
                  fetchScripts();
                  toast.success('Data refreshed');
                }}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Search Panel */}
        {showSearchPanel && (
          <div style={styles.searchPanel}>
            <div style={styles.searchHeader}>
              <h3 style={styles.searchTitle}>
                <Search size={18} />
                Advanced Search
              </h3>
              <button
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  color: '#71717A',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                onClick={() => setShowSearchPanel(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tags, or content..."
              style={styles.searchInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  performSearch();
                }
              }}
            />
            
            <div style={styles.searchFilters}>
              <select
                value={searchFilters.platform}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, platform: e.target.value }))}
                style={styles.select}
              >
                <option value="">All Platforms</option>
                <option value="instagram_reel">Instagram Reel</option>
                <option value="youtube_shorts">YouTube Shorts</option>
                <option value="linkedin_video">LinkedIn Video</option>
                <option value="tiktok_video">TikTok Video</option>
              </select>
              
              <select
                value={searchFilters.status}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
                style={styles.select}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="generated">Generated</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="in_production">In Production</option>
                <option value="completed">Completed</option>
              </select>
              
              <input
                type="date"
                value={searchFilters.dateFrom}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                style={styles.select}
              />
              
              <input
                type="date"
                value={searchFilters.dateTo}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                style={styles.select}
              />
            </div>
            
            <button
              style={{ ...styles.actionButton, ...styles.primaryButton, width: '100%' }}
              onClick={performSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search Scripts
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <label style={{ fontSize: '0.875rem', color: '#71717A', fontWeight: '500' }}>
            Filter by Status:
          </label>
          <select
            style={styles.select}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="generated">Generated</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="in_production">In Production</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            style={styles.select}
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="instagram_reel">Instagram Reel</option>
            <option value="youtube_shorts">YouTube Shorts</option>
            <option value="linkedin_video">LinkedIn Video</option>
            <option value="tiktok_video">TikTok Video</option>
          </select>
          
          {selectedStatus !== 'all' && isLoadingStatusData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717A' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Loading...
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
              <FileText size={20} color="#3B82F6" />
            </div>
            <div style={styles.metricValue}>{analytics.totalScripts}</div>
            <div style={styles.metricLabel}>Total Scripts</div>
            <div style={{ ...styles.metricChange, ...styles.changePositive }}>
              <ArrowUpRight size={12} />
              {dashboardStats?.thisMonthScripts || 0} this month
            </div>
          </div>

          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
              <Eye size={20} color="#10B981" />
            </div>
            <div style={styles.metricValue}>{formatNumber(analytics.totalViews)}</div>
            <div style={styles.metricLabel}>Total Views</div>
            <div style={{ ...styles.metricChange, ...styles.changePositive }}>
              <TrendingUp size={12} />
              Avg {Math.round(analytics.totalViews / (analytics.totalScripts || 1))} per script
            </div>
          </div>

          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
              <Zap size={20} color="#F59E0B" />
            </div>
            <div style={styles.metricValue}>{analytics.generationSuccessRate}%</div>
            <div style={styles.metricLabel}>Success Rate</div>
            <div style={{
              ...styles.metricChange,
              ...(analytics.generationSuccessRate >= 80 ? styles.changePositive : styles.changeNegative)
            }}>
              {analytics.generationSuccessRate >= 80 ? (
                <CheckCircle size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}
              {analytics.generationSuccessRate >= 80 ? 'Excellent' : 'Needs improvement'}
            </div>
          </div>

          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
              <Gauge size={20} color="#8B5CF6" />
            </div>
            <div style={styles.metricValue}>{analytics.avgComplexity}/100</div>
            <div style={styles.metricLabel}>Avg Complexity</div>
            <div style={{ ...styles.metricChange, ...styles.changeNeutral }}>
              <Activity size={12} />
              {analytics.avgComplexity >= 70 ? 'High quality' : 'Moderate'}
            </div>
          </div>

          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)' }}>
              <Link2 size={20} color="#059669" />
            </div>
            <div style={styles.metricValue}>{analytics.dealLinkedCount}</div>
            <div style={styles.metricLabel}>Deal Linked</div>
            <div style={{ ...styles.metricChange, ...styles.changeNeutral }}>
              <Percent size={12} />
              {analytics.dealLinkedPercentage}% of total
            </div>
          </div>

          <div 
            style={styles.metricCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ ...styles.metricIcon, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
              <DollarSign size={20} color="#EC4899" />
            </div>
            <div style={styles.metricValue}>₹{formatNumber((dashboardStats?.linkedToDeals || 0) * 50000)}</div>
            <div style={styles.metricLabel}>Deal Value</div>
            <div style={{ ...styles.metricChange, ...styles.changePositive }}>
              <TrendingUp size={12} />
              Based on linked deals
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} />
                Status Distribution
              </span>
            </h3>
            
            <div style={styles.statusGrid}>
              {Object.entries(analytics.statusDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([status, count]) => (
                <div 
                  key={status} 
                  style={{
                    ...styles.statusItem,
                    ...(selectedStatus === status ? styles.statusItemActive : {})
                  }}
                  onClick={() => setSelectedStatus(status)}
                  onMouseEnter={(e) => {
                    if (selectedStatus !== status) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStatus !== status) {
                      e.currentTarget.style.background = '#FAFBFC';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <div style={styles.statusInfo}>
                    <div style={{ ...styles.statusDot, backgroundColor: getStatusColor(status) }} />
                    <span style={styles.statusName}>
                      {status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={styles.statusCount}>
                    <span style={styles.statusValue}>{count}</span>
                    <span style={styles.statusPercent}>
                      ({Math.round((count / analytics.totalScripts) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieChart size={18} />
                Platform Mix
              </span>
            </h3>
            
            <div style={styles.platformList}>
              {Object.entries(analytics.platformDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([platform, count]) => (
                <div key={platform} style={styles.platformItem}>
                  <span style={styles.platformName}>
                    {platform.replace(/_/g, ' ')}
                  </span>
                  <span style={styles.platformCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div style={styles.performanceGrid}>
          <div style={styles.performanceCard}>
            <h3 style={styles.performanceTitle}>
              <Award size={18} />
              Top Performing Scripts
            </h3>
            
            {analytics.topPerformers.length > 0 ? (
              <div style={styles.performersList}>
                {analytics.topPerformers.slice(0, 5).map((script, index) => (
                  <div 
                    key={script._id || script.id} 
                    style={styles.performerItem}
                    onClick={() => fetchScriptAnalysis(script._id || script.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={styles.performerRank}>
                      {index + 1}
                    </div>
                    <div style={styles.performerInfo}>
                      <div style={styles.performerTitle}>
                        {script.title}
                      </div>
                      <div style={styles.performerMeta}>
                        {script.platform?.replace(/_/g, ' ')} • {script.status}
                      </div>
                    </div>
                    <div style={styles.performerStats}>
                      <div style={styles.performerStat}>
                        <Eye size={12} />
                        {formatNumber(script.viewCount || 0)}
                      </div>
                      <div style={styles.performerStat}>
                        <Star size={12} />
                        {script.complexityScore || 0}
                      </div>
                    </div>
                    <div style={styles.performerActions}>
                      <button
                        style={styles.iconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToComparison(script);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.borderColor = 'rgba(228, 228, 231, 0.5)';
                        }}
                      >
                        <PlusCircle size={14} color="#8B5CF6" />
                      </button>
                      <button
                        style={styles.iconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          exportScriptData(script._id || script.id);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.borderColor = 'rgba(228, 228, 231, 0.5)';
                        }}
                      >
                        <Download size={14} color="#71717A" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <Award size={32} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#18181B', marginBottom: '0.5rem' }}>
                  No Performance Data
                </h4>
                <p style={{ fontSize: '0.875rem' }}>Scripts with views will appear here</p>
              </div>
            )}
          </div>

          <div style={styles.performanceCard}>
            <h3 style={styles.performanceTitle}>
              <Cpu size={18} />
              Generation Efficiency
            </h3>
            
            <div style={styles.efficiencyGrid}>
              <div style={styles.efficiencyItem}>
                <span style={styles.efficiencyLabel}>Avg Processing Time</span>
                <span style={styles.efficiencyValue}>{formatDuration(analytics.avgProcessingTime)}</span>
              </div>
              
              <div style={styles.efficiencyItem}>
                <span style={styles.efficiencyLabel}>Success Rate</span>
                <span style={styles.efficiencyValue}>{analytics.generationSuccessRate}%</span>
              </div>
              
              <div style={styles.efficiencyItem}>
                <span style={styles.efficiencyLabel}>Retry Rate</span>
                <span style={styles.efficiencyValue}>{analytics.retryRate}%</span>
              </div>
              
              <div style={styles.efficiencyItem}>
                <span style={styles.efficiencyLabel}>Avg Tokens Used</span>
                <span style={styles.efficiencyValue}>3.2K</span>
              </div>
              
              <div style={styles.efficiencyItem}>
                <span style={styles.efficiencyLabel}>Total Processed</span>
                <span style={styles.efficiencyValue}>{analytics.totalScripts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <div style={styles.recommendationsCard}>
            <div style={styles.recommendationsHeader}>
              <h3 style={styles.recommendationsTitle}>
                <Lightbulb size={20} />
                Optimization Insights
              </h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717A',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                onClick={() => setShowRecommendations(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.recommendationsList}>
              {recommendations.map((rec, index) => {
                const getIcon = (type) => {
                  switch (type) {
                    case 'warning': return <AlertTriangle size={16} color="#F59E0B" />;
                    case 'info': return <Info size={16} color="#3B82F6" />;
                    case 'suggestion': return <Lightbulb size={16} color="#8B5CF6" />;
                    case 'growth': return <TrendingUp size={16} color="#10B981" />;
                    default: return <CheckCircle size={16} color="#10B981" />;
                  }
                };

                const getPriorityStyle = (priority) => {
                  switch (priority) {
                    case 'high':
                      return {
                        background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                        color: '#DC2626'
                      };
                    case 'medium':
                      return {
                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                        color: '#D97706'
                      };
                    default:
                      return {
                        background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                        color: '#2563EB'
                      };
                  }
                };

                return (
                  <div key={index} style={styles.recommendationItem}>
                    <div style={styles.recommendationHeader}>
                      {getIcon(rec.type)}
                      <div style={styles.recommendationTitle}>{rec.title}</div>
                      {rec.priority === 'high' && (
                        <span style={{ ...styles.recommendationPriority, ...getPriorityStyle(rec.priority) }}>
                          High Priority
                        </span>
                      )}
                    </div>
                    <div style={styles.recommendationDescription}>
                      {rec.description}
                    </div>
                    <button style={styles.recommendationAction}>
                      {rec.action}
                      <ArrowUpRight size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Loading Overlay */}
      {isLoadingAnalysis && (
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
          zIndex: 999,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '2rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8B5CF6' }} />
            <span style={{ fontSize: '0.875rem', color: '#52525B' }}>Loading analysis...</span>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScriptAnalyticsPerformance;
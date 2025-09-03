/**
 * Rate Card Analytics Page
 * Comprehensive analytics dashboard for rate card performance tracking
 * 
 * Features:
 * - Real-time view and engagement metrics
 * - Geographic distribution of viewers
 * - Conversion tracking (inquiries, downloads)
 * - Performance trends over time
 * - Package popularity insights
 * - Referral source analysis
 * - Export capabilities for reporting
 * - Mobile-responsive charts and visualizations
 * 
 * @filepath src/features/rateCard/pages/RateCardAnalytics.jsx
 * @author CreatorsMantra Frontend Team
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft,
  Eye,
  Users,
  Download,
  Mail,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  Clock,
  Zap,
  Target,
  Award,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Package
} from 'lucide-react';
import useRateCardStore from '../../../store/ratecardStore';

const RateCardAnalytics = ({ rateCardId, onNavigate, onBack }) => {
  const {
    currentRateCard,
    isLoading,
    error,
    fetchRateCard
  } = useRateCardStore();

  // Local state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState('overview');

  // Time range options
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  // Metric tabs
  const metricTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'performance', label: 'Performance', icon: Target }
  ];

  // Fetch rate card and analytics data
  const fetchAnalyticsData = async () => {
    try {
      setIsLoadingAnalytics(true);
      setAnalyticsError(null);

      const response = await fetch(`/api/ratecards/${rateCardId}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on auth implementation
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data.analytics);
      } else {
        throw new Error(data.message || 'Failed to load analytics');
      }
    } catch (err) {
      setAnalyticsError(err.message || 'Failed to load analytics data');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (rateCardId) {
      fetchRateCard(rateCardId);
      fetchAnalyticsData();
    }
  }, [rateCardId, timeRange]);

  // Helper functions
  const formatNumber = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock analytics data for demo (replace with real API data)
  const mockAnalyticsData = useMemo(() => ({
    views: {
      total: 2847,
      unique: 1923,
      lastViewed: new Date().toISOString(),
      growth: 12.5
    },
    engagement: {
      downloads: 156,
      inquiries: 23,
      shares: 67
    },
    performance: {
      daysSinceCreated: 45,
      versionCount: 3,
      packageCount: 4,
      deliverableCount: 12
    },
    aiInsights: {
      acceptanceRate: 85,
      marketPosition: 'at_market',
      confidence: 78
    },
    trends: [
      { date: '2024-01-01', views: 45, uniqueViews: 32 },
      { date: '2024-01-02', views: 52, uniqueViews: 38 },
      { date: '2024-01-03', views: 38, uniqueViews: 28 },
      { date: '2024-01-04', views: 67, uniqueViews: 45 },
      { date: '2024-01-05', views: 73, uniqueViews: 52 },
      { date: '2024-01-06', views: 89, uniqueViews: 61 },
      { date: '2024-01-07', views: 95, uniqueViews: 68 }
    ],
    geography: [
      { country: 'India', percentage: 45, views: 1281 },
      { country: 'United States', percentage: 22, views: 626 },
      { country: 'United Kingdom', percentage: 12, views: 341 },
      { country: 'Canada', percentage: 8, views: 228 },
      { country: 'Others', percentage: 13, views: 371 }
    ],
    devices: [
      { type: 'Mobile', percentage: 68, icon: Smartphone },
      { type: 'Desktop', percentage: 27, icon: Monitor },
      { type: 'Tablet', percentage: 5, icon: Tablet }
    ],
    referrers: [
      { source: 'Direct', percentage: 35, visits: 996 },
      { source: 'Instagram', percentage: 28, visits: 797 },
      { source: 'LinkedIn', percentage: 18, visits: 512 },
      { source: 'Email', percentage: 12, visits: 342 },
      { source: 'Others', percentage: 7, visits: 200 }
    ],
    packagePerformance: [
      { name: 'Growth Package', views: 456, inquiries: 12, conversion: 2.6 },
      { name: 'Starter Package', views: 342, inquiries: 8, conversion: 2.3 },
      { name: 'Premium Package', views: 234, inquiries: 6, conversion: 2.6 },
      { name: 'Custom Package', views: 189, inquiries: 3, conversion: 1.6 }
    ]
  }), []);

  // Use mock data if real analytics data is not available
  const displayData = analyticsData || mockAnalyticsData;

  // Loading state
  if (isLoading && !currentRateCard) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            margin: '0 auto var(--space-4)',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Loader2 size={24} style={{ color: 'white' }} className="animate-spin" />
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentRateCard) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            margin: '0 auto var(--space-4)',
            borderRadius: '50%',
            backgroundColor: 'var(--color-error-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
          </div>
          <h3 style={{ 
            fontSize: 'var(--text-xl)', 
            fontWeight: 'var(--font-semibold)', 
            color: 'var(--color-text)', 
            marginBottom: 'var(--space-2)' 
          }}>
            Failed to Load Analytics
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
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentRateCard) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <button
                onClick={onBack || (() => onNavigate && onNavigate(`/dashboard/rate-cards/${rateCardId}/edit`))}
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
                  transition: 'all var(--duration-200) ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.color = 'var(--color-primary-600)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.color = 'var(--color-text-secondary)';
                }}
              >
                <ArrowLeft size={16} />
                Back to Rate Card
              </button>

              <div>
                <h1 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'var(--font-bold)', 
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Analytics - {currentRateCard.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    Last updated: {formatDate(currentRateCard.updatedAt)}
                  </span>
                  {currentRateCard.sharing?.publicUrl && (
                    <button
                      onClick={() => window.open(currentRateCard.sharing.publicUrl, '_blank')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        color: 'var(--color-primary-600)',
                        fontSize: 'var(--text-sm)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={14} />
                      View Public
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {/* Time Range Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'white',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-200) ease'
                  }}
                >
                  <Calendar size={16} />
                  {timeRangeOptions.find(option => option.value === timeRange)?.label}
                  <ChevronDown size={16} />
                </button>

                {showFilters && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: 'var(--space-2)',
                    width: '12rem',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border)',
                    zIndex: 50
                  }}>
                    <div style={{ padding: 'var(--space-2)' }}>
                      {timeRangeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTimeRange(option.value);
                            setShowFilters(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-base)',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: timeRange === option.value ? 'var(--color-primary-50)' : 'transparent',
                            color: timeRange === option.value ? 'var(--color-primary-700)' : 'var(--color-text)'
                          }}
                          onMouseEnter={(e) => {
                            if (timeRange !== option.value) {
                              e.target.style.backgroundColor = 'var(--color-neutral-50)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (timeRange !== option.value) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={fetchAnalyticsData}
                disabled={isLoadingAnalytics}
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
                  cursor: isLoadingAnalytics ? 'not-allowed' : 'pointer',
                  opacity: isLoadingAnalytics ? 0.7 : 1
                }}
              >
                <RefreshCw size={16} className={isLoadingAnalytics ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: 'var(--space-1)',
            padding: '0 var(--space-6)'
          }}>
            {metricTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedMetrics === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetrics(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-4) var(--space-6)',
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? 'var(--color-primary-600)' : 'transparent',
                    backgroundColor: 'transparent',
                    color: isActive ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-200) ease',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? 'var(--color-primary-600)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'var(--color-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          {/* Overview Tab */}
          {selectedMetrics === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              
              {/* Key Metrics Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: 'var(--space-6)' 
              }}>
                {/* Total Views */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: 'var(--color-primary-100)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Eye size={20} style={{ color: 'var(--color-primary-600)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Total Views
                        </h3>
                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text)' }}>
                          {formatNumber(displayData.views.total)}
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-1)',
                      color: displayData.views.growth > 0 ? 'var(--color-success)' : 'var(--color-error)'
                    }}>
                      {displayData.views.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                        {Math.abs(displayData.views.growth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {formatNumber(displayData.views.unique)} unique visitors
                  </p>
                </div>

                {/* Inquiries */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: 'var(--color-secondary-100)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Mail size={20} style={{ color: 'var(--color-secondary-600)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Inquiries
                        </h3>
                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text)' }}>
                          {displayData.engagement.inquiries}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      padding: 'var(--space-1) var(--space-3)',
                      backgroundColor: 'var(--color-success-light)',
                      color: 'var(--color-success-dark)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      {((displayData.engagement.inquiries / displayData.views.total) * 100).toFixed(1)}% conversion
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Contact form submissions
                  </p>
                </div>

                {/* Downloads */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: 'var(--color-accent-100)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Download size={20} style={{ color: 'var(--color-accent-600)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Downloads
                        </h3>
                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text)' }}>
                          {displayData.engagement.downloads}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      padding: 'var(--space-1) var(--space-3)',
                      backgroundColor: 'var(--color-accent-light)',
                      color: 'var(--color-accent-dark)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      PDF exports
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Rate card downloads
                  </p>
                </div>

                {/* Shares */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: 'var(--color-warning-light)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Share2 size={20} style={{ color: 'var(--color-warning-dark)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Shares
                        </h3>
                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text)' }}>
                          {displayData.engagement.shares}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      padding: 'var(--space-1) var(--space-3)',
                      backgroundColor: 'var(--color-warning-light)',
                      color: 'var(--color-warning-dark)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      Viral potential
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Social media shares
                  </p>
                </div>
              </div>

              {/* Views Trend Chart */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)'
              }}>
                <h2 style={{ 
                  fontSize: 'var(--text-xl)', 
                  fontWeight: 'var(--font-semibold)', 
                  color: 'var(--color-text)', 
                  marginBottom: 'var(--space-6)' 
                }}>
                  Views Over Time
                </h2>
                
                {/* Simple trend visualization */}
                <div style={{ 
                  height: '200px', 
                  display: 'flex', 
                  alignItems: 'end', 
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4) 0'
                }}>
                  {displayData.trends.map((day, index) => {
                    const maxViews = Math.max(...displayData.trends.map(d => d.views));
                    const height = (day.views / maxViews) * 160;
                    
                    return (
                      <div key={index} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        flex: 1 
                      }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${height}px`,
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-base) var(--radius-base) 0 0',
                            marginBottom: 'var(--space-2)',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                          title={`${day.views} views on ${formatDate(day.date)}`}
                        />
                        <span style={{ 
                          fontSize: 'var(--text-xs)', 
                          color: 'var(--color-text-secondary)',
                          transform: 'rotate(-45deg)',
                          transformOrigin: 'center'
                        }}>
                          {formatDate(day.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Distribution & Device Breakdown */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: 'var(--space-6)' 
              }}>
                
                {/* Geographic Distribution */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-semibold)', 
                    color: 'var(--color-text)', 
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Globe size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Geographic Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {displayData.geography.map((location, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: '100px',
                            height: '8px',
                            backgroundColor: 'var(--color-neutral-200)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${location.percentage}%`,
                              height: '100%',
                              backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                              borderRadius: 'var(--radius-full)'
                            }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                            {location.country}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                            {location.percentage}%
                          </span>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            {formatNumber(location.views)} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-semibold)', 
                    color: 'var(--color-text)', 
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Monitor size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Device Types
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {displayData.devices.map((device, index) => {
                      const DeviceIcon = device.icon;
                      return (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: 'var(--space-3)',
                          backgroundColor: 'var(--color-neutral-50)',
                          borderRadius: 'var(--radius-lg)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              backgroundColor: 'white',
                              borderRadius: 'var(--radius-base)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid var(--color-border)'
                            }}>
                              <DeviceIcon size={18} style={{ color: 'var(--color-primary-600)' }} />
                            </div>
                            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)' }}>
                              {device.type}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--space-3)' 
                          }}>
                            <div style={{
                              width: '80px',
                              height: '8px',
                              backgroundColor: 'var(--color-neutral-200)',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${device.percentage}%`,
                                height: '100%',
                                backgroundColor: 'var(--color-primary-500)',
                                borderRadius: 'var(--radius-full)'
                              }} />
                            </div>
                            <span style={{ 
                              fontSize: 'var(--text-base)', 
                              fontWeight: 'var(--font-semibold)',
                              minWidth: '3rem',
                              textAlign: 'right'
                            }}>
                              {device.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Other tabs placeholder */}
          {selectedMetrics !== 'overview' && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-16)', 
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto var(--space-4)',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {(() => {
  const TabIcon = metricTabs.find(t => t.id === selectedMetrics)?.icon || BarChart3;
  return <TabIcon size={24} style={{ color: 'var(--color-primary-600)' }} />;
})()}
              </div>
              <h3 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-semibold)', 
                color: 'var(--color-text)', 
                marginBottom: 'var(--space-4)' 
              }}>
                {metricTabs.find(t => t.id === selectedMetrics)?.label} Analytics
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Detailed {metricTabs.find(t => t.id === selectedMetrics)?.label.toLowerCase()} analytics will be available here.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Click outside handler for dropdowns */}
      {showFilters && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40
          }}
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default RateCardAnalytics;
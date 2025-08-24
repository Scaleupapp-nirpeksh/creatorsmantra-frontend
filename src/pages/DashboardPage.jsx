// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  FileText,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Bell,
  CheckCircle,
  AlertCircle,
  Star,
  Package,
  Target,
  Zap,
  Shield,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  Award,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  PieChart as RePieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuthStore, useDataStore, useUIStore } from '../store';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuthStore();
  const { 
    fetchDashboardData, 
    dashboardData, 
    isLoading,
    refreshData 
  } = useDataStore();
  const { viewport } = useUIStore();
  
  // State
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);
  
  const loadDashboardData = async () => {
    try {
      await fetchDashboardData(timeRange);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };
  
  // Mock data for charts (replace with real API data)
  const revenueData = [
    { month: 'Jan', revenue: 45000, deals: 3 },
    { month: 'Feb', revenue: 52000, deals: 4 },
    { month: 'Mar', revenue: 48000, deals: 3 },
    { month: 'Apr', revenue: 61000, deals: 5 },
    { month: 'May', revenue: 55000, deals: 4 },
    { month: 'Jun', revenue: 67000, deals: 6 },
  ];
  
  const dealStageData = [
    { name: 'Leads', value: 12, color: '#667eea' },
    { name: 'Negotiation', value: 8, color: '#764ba2' },
    { name: 'Contract', value: 5, color: '#f59e0b' },
    { name: 'Ongoing', value: 3, color: '#10b981' },
  ];
  
  const platformData = [
    { platform: 'Instagram', value: 60, color: '#E4405F' },
    { platform: 'YouTube', value: 30, color: '#FF0000' },
    { platform: 'Twitter', value: 10, color: '#1DA1F2' },
  ];
  
  // Calculate stats
  const stats = {
    totalRevenue: dashboardData?.totalRevenue || 325000,
    revenueGrowth: dashboardData?.revenueGrowth || 12.5,
    activeDeals: dashboardData?.activeDeals || 8,
    dealsGrowth: dashboardData?.dealsGrowth || 25,
    pendingInvoices: dashboardData?.pendingInvoices || 3,
    invoiceAmount: dashboardData?.pendingAmount || 85000,
    completionRate: dashboardData?.completionRate || 92,
    avgDealValue: dashboardData?.avgDealValue || 40625
  };
  
  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'deal',
      title: 'New deal with Nike India',
      description: 'Instagram Reel + Story package',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'var(--color-primary-500)'
    },
    {
      id: 2,
      type: 'invoice',
      title: 'Invoice paid by Myntra',
      description: '₹45,000 received',
      time: '5 hours ago',
      icon: DollarSign,
      color: 'var(--color-success)'
    },
    {
      id: 3,
      type: 'brief',
      title: 'Brief received from Amazon',
      description: 'Review required',
      time: '1 day ago',
      icon: FileText,
      color: 'var(--color-warning)'
    },
  ];
  
  // Upcoming tasks
  const upcomingTasks = [
    {
      id: 1,
      title: 'Submit content to Flipkart',
      dueDate: 'Today, 6:00 PM',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Review Zomato contract',
      dueDate: 'Tomorrow',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Send invoice to Swiggy',
      dueDate: 'Dec 28',
      priority: 'low',
      status: 'pending'
    },
  ];
  
  // Quick actions
  const quickActions = [
    {
      id: 'new-deal',
      label: 'New Deal',
      icon: Briefcase,
      color: 'var(--color-primary-500)',
      path: '/deals/new'
    },
    {
      id: 'create-invoice',
      label: 'Create Invoice',
      icon: FileText,
      color: 'var(--color-success)',
      path: '/invoices/new'
    },
    {
      id: 'analyze-brief',
      label: 'Analyze Brief',
      icon: Sparkles,
      color: 'var(--color-warning)',
      path: '/briefs/analyze'
    },
    {
      id: 'view-analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'var(--color-info)',
      path: '/performance'
    },
  ];
  
  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    
    header: {
      marginBottom: '2rem',
    },
    
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    
    greeting: {
      flex: 1,
    },
    
    greetingTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.5rem',
    },
    
    greetingSubtitle: {
      fontSize: '1rem',
      color: 'var(--color-neutral-600)',
    },
    
    headerActions: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    
    timeRangeSelector: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.25rem',
      background: 'var(--color-neutral-100)',
      borderRadius: '10px',
    },
    
    timeRangeOption: {
      padding: '0.5rem 1rem',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--color-neutral-600)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    timeRangeActive: {
      background: 'white',
      color: 'var(--color-primary-600)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    
    refreshButton: {
      padding: '0.625rem',
      background: 'white',
      border: '1px solid var(--color-neutral-200)',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    downloadButton: {
      padding: '0.625rem 1.25rem',
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    
    statCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid var(--color-neutral-200)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    
    statInfo: {
      flex: 1,
    },
    
    statLabel: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
      marginBottom: '0.5rem',
    },
    
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
      lineHeight: '1',
    },
    
    statChange: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    
    statChangePositive: {
      color: 'var(--color-success)',
    },
    
    statChangeNegative: {
      color: 'var(--color-error)',
    },
    
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: viewport.isMobile ? '1fr' : '2fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    
    chartCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid var(--color-neutral-200)',
    },
    
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    
    chartTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
    },
    
    chartLegend: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.75rem',
    },
    
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    legendDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    
    quickActionCard: {
      padding: '1rem',
      background: 'white',
      border: '1px solid var(--color-neutral-200)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
    },
    
    quickActionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    quickActionLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--color-neutral-700)',
    },
    
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    
    activityItem: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: 'var(--color-neutral-50)',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    },
    
    activityIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    
    activityContent: {
      flex: 1,
    },
    
    activityTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.25rem',
    },
    
    activityDescription: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-600)',
    },
    
    activityTime: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-500)',
    },
    
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.875rem',
      background: 'var(--color-neutral-50)',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
    },
    
    taskCheckbox: {
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: '2px solid var(--color-neutral-300)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    taskContent: {
      flex: 1,
    },
    
    taskTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.25rem',
    },
    
    taskDue: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-600)',
    },
    
    taskPriority: {
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
    },
    
    priorityHigh: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--color-error)',
    },
    
    priorityMedium: {
      background: 'rgba(251, 191, 36, 0.1)',
      color: 'var(--color-warning)',
    },
    
    priorityLow: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: 'var(--color-success)',
    },
    
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
    },
    
    viewAllLink: {
      fontSize: '0.875rem',
      color: 'var(--color-primary-600)',
      textDecoration: 'none',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'color 0.2s ease',
    },
    
    subscriptionBanner: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    
    subscriptionContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    
    subscriptionInfo: {
      flex: 1,
    },
    
    subscriptionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.5rem',
    },
    
    subscriptionDescription: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },
    
    upgradeButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.greeting}>
            <h1 style={styles.greetingTitle}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'Creator'}! 👋
            </h1>
            <p style={styles.greetingSubtitle}>
              Here's how your creator business is performing
            </p>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.timeRangeSelector}>
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    ...styles.timeRangeOption,
                    ...(timeRange === range ? styles.timeRangeActive : {})
                  }}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleRefresh}
              style={styles.refreshButton}
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
            
            <button style={styles.downloadButton}>
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Subscription Banner (for free/trial users) */}
      {subscription?.tier === 'starter' && (
        <div style={styles.subscriptionBanner}>
          <div style={styles.subscriptionContent}>
            <div style={styles.subscriptionInfo}>
              <div style={styles.subscriptionTitle}>
                🚀 Unlock Advanced Features
              </div>
              <div style={styles.subscriptionDescription}>
                Upgrade to Pro for AI-powered insights, unlimited invoices, and priority support
              </div>
            </div>
            <button 
              onClick={() => navigate('/settings/subscription')}
              style={styles.upgradeButton}
            >
              <Zap size={18} />
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <motion.div
          style={styles.statCard}
          whileHover={styles.statCardHover}
          onClick={() => navigate('/analytics/revenue')}
        >
          <div style={styles.statHeader}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Total Revenue</div>
              <div style={styles.statValue}>
                ₹{(stats.totalRevenue / 100000).toFixed(1)}L
              </div>
              <div style={{
                ...styles.statChange,
                ...styles.statChangePositive
              }}>
                <ArrowUpRight size={16} />
                +{stats.revenueGrowth}% from last month
              </div>
            </div>
            <div style={{
              ...styles.statIcon,
              background: 'rgba(16, 185, 129, 0.1)',
            }}>
              <DollarSign size={24} color="var(--color-success)" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          style={styles.statCard}
          whileHover={styles.statCardHover}
          onClick={() => navigate('/deals')}
        >
          <div style={styles.statHeader}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Active Deals</div>
              <div style={styles.statValue}>{stats.activeDeals}</div>
              <div style={{
                ...styles.statChange,
                ...styles.statChangePositive
              }}>
                <ArrowUpRight size={16} />
                +{stats.dealsGrowth}% from last month
              </div>
            </div>
            <div style={{
              ...styles.statIcon,
              background: 'rgba(102, 126, 234, 0.1)',
            }}>
              <Briefcase size={24} color="var(--color-primary-500)" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          style={styles.statCard}
          whileHover={styles.statCardHover}
          onClick={() => navigate('/invoices')}
        >
          <div style={styles.statHeader}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Pending Invoices</div>
              <div style={styles.statValue}>{stats.pendingInvoices}</div>
              <div style={{
                ...styles.statChange,
                color: 'var(--color-warning)'
              }}>
                ₹{(stats.invoiceAmount / 1000).toFixed(0)}K pending
              </div>
            </div>
            <div style={{
              ...styles.statIcon,
              background: 'rgba(251, 191, 36, 0.1)',
            }}>
              <FileText size={24} color="var(--color-warning)" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          style={styles.statCard}
          whileHover={styles.statCardHover}
          onClick={() => navigate('/performance')}
        >
          <div style={styles.statHeader}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Completion Rate</div>
              <div style={styles.statValue}>{stats.completionRate}%</div>
              <div style={{
                ...styles.statChange,
                ...styles.statChangePositive
              }}>
                <Award size={16} />
                Excellent performance
              </div>
            </div>
            <div style={{
              ...styles.statIcon,
              background: 'rgba(118, 75, 162, 0.1)',
            }}>
              <Target size={24} color="var(--color-secondary-500)" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Left Column */}
        <div>
          {/* Revenue Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Revenue Overview</h3>
              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <span style={{
                    ...styles.legendDot,
                    background: 'var(--color-primary-500)'
                  }} />
                  <span>Revenue</span>
                </div>
                <div style={styles.legendItem}>
                  <span style={{
                    ...styles.legendDot,
                    background: 'var(--color-secondary-500)'
                  }} />
                  <span>Deals</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="deals"
                  stroke="#764ba2"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Deal Pipeline */}
          <div style={{ ...styles.chartCard, marginTop: '1.5rem' }}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Deal Pipeline</h3>
              <Link to="/deals" style={styles.viewAllLink}>
                View all
                <ChevronRight size={16} />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dealStageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {dealStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Recent Activities */}
          <div style={{ ...styles.chartCard, marginTop: '1.5rem' }}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Activities</h3>
              <Link to="/activities" style={styles.viewAllLink}>
                View all
                <ChevronRight size={16} />
              </Link>
            </div>
            <div style={styles.activityList}>
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} style={styles.activityItem}>
                    <div style={{
                      ...styles.activityIcon,
                      background: `${activity.color}15`,
                    }}>
                      <Icon size={20} color={activity.color} />
                    </div>
                    <div style={styles.activityContent}>
                      <div style={styles.activityTitle}>{activity.title}</div>
                      <div style={styles.activityDescription}>{activity.description}</div>
                    </div>
                    <div style={styles.activityTime}>{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div>
          {/* Quick Actions */}
          <div style={styles.chartCard}>
            <h3 style={styles.sectionTitle}>Quick Actions</h3>
            <div style={styles.quickActionsGrid}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.id}
                    to={action.path}
                    style={styles.quickActionCard}
                  >
                    <div style={{
                      ...styles.quickActionIcon,
                      background: `${action.color}15`,
                    }}>
                      <Icon size={20} color={action.color} />
                    </div>
                    <span style={styles.quickActionLabel}>{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Platform Distribution */}
          <div style={{ ...styles.chartCard, marginTop: '1.5rem' }}>
            <h3 style={styles.sectionTitle}>Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '1rem' }}>
              {platformData.map((platform) => (
                <div key={platform.platform} style={{
                  ...styles.legendItem,
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    ...styles.legendDot,
                    background: platform.color
                  }} />
                  <span style={{ flex: 1 }}>{platform.platform}</span>
                  <span style={{ fontWeight: '600' }}>{platform.value}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Tasks */}
          <div style={{ ...styles.chartCard, marginTop: '1.5rem' }}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Upcoming Tasks</h3>
              <Link to="/tasks" style={styles.viewAllLink}>
                View all
                <ChevronRight size={16} />
              </Link>
            </div>
            <div style={styles.tasksList}>
              {upcomingTasks.map((task) => (
                <div key={task.id} style={styles.taskItem}>
                  <div style={styles.taskCheckbox} />
                  <div style={styles.taskContent}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskDue}>{task.dueDate}</div>
                  </div>
                  <div style={{
                    ...styles.taskPriority,
                    ...(task.priority === 'high' ? styles.priorityHigh :
                       task.priority === 'medium' ? styles.priorityMedium :
                       styles.priorityLow)
                  }}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
// Dependenincies
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileSignature,
  FileText,
  Filter,
  Package,
  Play,
  Plus,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { DemoData } from '../../test-data'

const DemoPage = () => {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [tourActive, setTourActive] = useState(true)
  const [tourStep, setTourStep] = useState(0)
  const [demoUser] = useState({
    name: 'Priya Sharma',
    handle: '@priyastyles',
    avatar: '👩',
    followers: 245000,
    engagement: 3.8,
    tier: 'pro',
  })

  // Constants
  const {
    demoStats,
    demoBriefs,
    demoDeals,
    demoInvoices,
    engagementData,
    platformData,
    revenueData,
    tourSteps,
  } = DemoData

  // Handle tour navigation
  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1)
      // Navigate to relevant view
      if (tourSteps[tourStep + 1].target === 'deals') setCurrentView('deals')
      if (tourSteps[tourStep + 1].target === 'invoices') setCurrentView('invoices')
      if (tourSteps[tourStep + 1].target === 'briefs') setCurrentView('briefs')
      if (tourSteps[tourStep + 1].target === 'analytics') setCurrentView('analytics')
    } else {
      setTourActive(false)
      toast.success('Tour completed! Feel free to explore on your own.')
    }
  }

  const skipTour = () => {
    setTourActive(false)
    toast('You can restart the tour anytime from the help menu', { icon: '💡' })
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate notification
      if (Math.random() > 0.9) {
        toast.success('New deal inquiry from Adidas!', { icon: '🎉' })
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--color-neutral-50)',
      position: 'relative',
    },

    demoHeader: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },

    demoBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600',
    },

    demoActions: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },

    demoInfo: {
      fontSize: '0.875rem',
      opacity: 0.9,
    },

    startTrialBtn: {
      padding: '0.625rem 1.5rem',
      background: 'white',
      color: 'var(--color-primary-600)',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    },

    exitDemoBtn: {
      padding: '0.625rem',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },

    mainWrapper: {
      display: 'flex',
      paddingTop: '60px',
      minHeight: '100vh',
    },

    sidebar: {
      width: '260px',
      background: 'white',
      borderRight: '1px solid var(--color-neutral-200)',
      transition: 'transform 0.3s ease',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      position: 'fixed',
      left: 0,
      top: '60px',
      bottom: 0,
      overflowY: 'auto',
      zIndex: 100,
    },

    sidebarHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid var(--color-neutral-200)',
    },

    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },

    userAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    },

    userDetails: {
      flex: 1,
    },

    userName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
    },

    userHandle: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },

    userStats: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-500)',
      marginTop: '0.25rem',
    },

    navigation: {
      padding: '1rem',
    },

    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      background: 'transparent',
      border: 'none',
      width: '100%',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--color-neutral-700)',
      marginBottom: '0.25rem',
    },

    navItemActive: {
      background: 'var(--color-primary-100)',
      color: 'var(--color-primary-700)',
    },

    navIcon: {
      width: '20px',
      height: '20px',
    },

    content: {
      flex: 1,
      padding: '2rem',
      marginLeft: sidebarOpen ? '260px' : '0',
      transition: 'margin-left 0.3s ease',
    },

    viewHeader: {
      marginBottom: '2rem',
    },

    viewTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.5rem',
    },

    viewDescription: {
      fontSize: '1rem',
      color: 'var(--color-neutral-600)',
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

    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
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
      color: 'var(--color-success)',
    },

    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    chartCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid var(--color-neutral-200)',
      marginBottom: '1.5rem',
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

    dealCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid var(--color-neutral-200)',
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },

    dealHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },

    dealBrand: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--color-neutral-900)',
    },

    dealTitle: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
      marginTop: '0.25rem',
    },

    dealValue: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: 'var(--color-primary-600)',
    },

    dealMeta: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },

    stageBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
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

    invoiceTable: {
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--color-neutral-200)',
    },

    tableHeader: {
      background: 'var(--color-neutral-50)',
      padding: '1rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-700)',
    },

    tableRow: {
      padding: '1rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      borderTop: '1px solid var(--color-neutral-200)',
      fontSize: '0.875rem',
      transition: 'background 0.2s ease',
    },

    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      width: 'fit-content',
    },

    briefCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid var(--color-neutral-200)',
      marginBottom: '1.5rem',
    },

    briefHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },

    briefScore: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--color-primary-600)',
    },

    aiInsights: {
      background: 'var(--color-primary-50)',
      borderRadius: '10px',
      padding: '1rem',
      marginTop: '1rem',
    },

    insightItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-700)',
    },

    tourOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: tourActive ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
    },

    tourCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    },

    tourHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },

    tourIcon: {
      width: '48px',
      height: '48px',
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },

    tourTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
    },

    tourDescription: {
      fontSize: '1rem',
      color: 'var(--color-neutral-600)',
      lineHeight: '1.6',
      marginBottom: '2rem',
    },

    tourActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'space-between',
    },

    tourProgress: {
      display: 'flex',
      gap: '0.5rem',
    },

    tourDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'var(--color-neutral-300)',
      transition: 'all 0.3s ease',
    },

    tourDotActive: {
      background: 'var(--color-primary-500)',
      width: '24px',
      borderRadius: '4px',
    },

    tourButtons: {
      display: 'flex',
      gap: '1rem',
    },

    skipButton: {
      padding: '0.625rem 1.25rem',
      background: 'transparent',
      color: 'var(--color-neutral-600)',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
    },

    nextButton: {
      padding: '0.625rem 1.5rem',
      background:
        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  }

  // Render different views
  const renderDashboard = () => (
    <>
      <div style={styles.statsGrid} className="tour-stats">
        <motion.div
          style={styles.statCard}
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <div style={styles.statHeader}>
            <div>
              <div style={styles.statLabel}>Total Revenue</div>
              <div style={styles.statValue}>₹{(demoStats.totalRevenue / 100000).toFixed(1)}L</div>
              <div style={styles.statChange}>
                <TrendingUp size={16} />+{demoStats.revenueGrowth}% from last month
              </div>
            </div>
            <div
              style={{
                ...styles.statIcon,
                background: 'rgba(16, 185, 129, 0.1)',
              }}
            >
              <DollarSign size={24} color="var(--color-success)" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={styles.statCard}
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <div style={styles.statHeader}>
            <div>
              <div style={styles.statLabel}>Active Deals</div>
              <div style={styles.statValue}>{demoStats.activeDeals}</div>
              <div style={styles.statChange}>
                <TrendingUp size={16} />+{demoStats.dealsGrowth}% growth
              </div>
            </div>
            <div
              style={{
                ...styles.statIcon,
                background: 'rgba(102, 126, 234, 0.1)',
              }}
            >
              <Briefcase size={24} color="var(--color-primary-500)" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={styles.statCard}
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <div style={styles.statHeader}>
            <div>
              <div style={styles.statLabel}>Pending Invoices</div>
              <div style={styles.statValue}>{demoStats.pendingInvoices}</div>
              <div style={{ ...styles.statChange, color: 'var(--color-warning)' }}>
                ₹{(demoStats.invoiceAmount / 1000).toFixed(0)}K pending
              </div>
            </div>
            <div
              style={{
                ...styles.statIcon,
                background: 'rgba(251, 191, 36, 0.1)',
              }}
            >
              <FileText size={24} color="var(--color-warning)" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={styles.statCard}
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <div style={styles.statHeader}>
            <div>
              <div style={styles.statLabel}>Completion Rate</div>
              <div style={styles.statValue}>{demoStats.completionRate}%</div>
              <div style={styles.statChange}>
                <Award size={16} />
                Excellent performance
              </div>
            </div>
            <div
              style={{
                ...styles.statIcon,
                background: 'rgba(118, 75, 162, 0.1)',
              }}
            >
              <Target size={24} color="var(--color-secondary-500)" />
            </div>
          </div>
        </motion.div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Revenue Overview</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#667eea"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Platform Distribution</h3>
          </div>
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
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Weekly Engagement</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="likes" stroke="#667eea" strokeWidth={2} />
              <Line type="monotone" dataKey="comments" stroke="#764ba2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )

  const renderDeals = () => (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            background:
              'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={18} />
          New Deal
        </button>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            background: 'white',
            color: 'var(--color-neutral-700)',
            border: '1px solid var(--color-neutral-300)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      {demoDeals.map((deal) => (
        <motion.div
          key={deal.id}
          style={styles.dealCard}
          whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          onClick={() => setSelectedDeal(deal)}
        >
          <div style={styles.dealHeader}>
            <div>
              <div style={styles.dealBrand}>{deal.brand}</div>
              <div style={styles.dealTitle}>{deal.title}</div>
            </div>
            <div>
              <div style={styles.dealValue}>₹{(deal.value / 1000).toFixed(0)}K</div>
              <div
                style={{
                  ...styles.stageBadge,
                  ...(deal.priority === 'high'
                    ? styles.priorityHigh
                    : deal.priority === 'medium'
                      ? styles.priorityMedium
                      : styles.priorityLow),
                }}
              >
                {deal.priority} priority
              </div>
            </div>
          </div>
          <div style={styles.dealMeta}>
            <span>
              <Calendar size={14} /> {deal.deadline}
            </span>
            <span>
              <User size={14} /> {deal.contact}
            </span>
            <span>
              <Package size={14} /> {deal.deliverables.length} deliverables
            </span>
          </div>
        </motion.div>
      ))}
    </>
  )

  const renderInvoices = () => (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            background:
              'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={18} />
          Create Invoice
        </button>
        <button
          style={{
            padding: '0.625rem 1.25rem',
            background: 'white',
            color: 'var(--color-neutral-700)',
            border: '1px solid var(--color-neutral-300)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Download size={18} />
          Export
        </button>
      </div>

      <div style={styles.invoiceTable}>
        <div style={styles.tableHeader}>
          <span>Invoice ID</span>
          <span>Client</span>
          <span>Amount</span>
          <span>GST (18%)</span>
          <span>Status</span>
        </div>
        {demoInvoices.map((invoice) => (
          <div key={invoice.id} style={styles.tableRow}>
            <span style={{ fontWeight: '600' }}>{invoice.id}</span>
            <span>{invoice.client}</span>
            <span>₹{(invoice.amount / 1000).toFixed(0)}K</span>
            <span>₹{(invoice.gst / 1000).toFixed(0)}K</span>
            <span>
              <div
                style={{
                  ...styles.statusBadge,
                  background:
                    invoice.status === 'paid'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : invoice.status === 'pending'
                        ? 'rgba(251, 191, 36, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                  color:
                    invoice.status === 'paid'
                      ? 'var(--color-success)'
                      : invoice.status === 'pending'
                        ? 'var(--color-warning)'
                        : 'var(--color-error)',
                }}
              >
                {invoice.status}
              </div>
            </span>
          </div>
        ))}
      </div>
    </>
  )

  const renderBriefs = () => (
    <>
      {demoBriefs.map((brief) => (
        <div key={brief.id} style={styles.briefCard}>
          <div style={styles.briefHeader}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {brief.brand} - {brief.title}
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-600)',
                }}
              >
                <span>
                  <DollarSign size={14} /> Budget: ₹{(brief.budget / 1000).toFixed(0)}K
                </span>
                <span>
                  <Clock size={14} /> Timeline: {brief.timeline}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={styles.briefScore}>{brief.score}</div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color:
                    brief.risk === 'low'
                      ? 'var(--color-success)'
                      : brief.risk === 'medium'
                        ? 'var(--color-warning)'
                        : 'var(--color-error)',
                  fontWeight: '600',
                }}
              >
                {brief.risk.toUpperCase()} RISK
              </div>
            </div>
          </div>

          <div style={styles.aiInsights}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={18} color="var(--color-primary-600)" />
              <span style={{ fontWeight: '600', color: 'var(--color-primary-700)' }}>
                AI Insights
              </span>
            </div>
            {brief.aiInsights.map((insight, index) => (
              <div key={index} style={styles.insightItem}>
                <CheckCircle size={14} color="var(--color-success)" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )

  const renderAnalytics = () => (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={styles.statCard}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>Total Reach</div>
          <div
            style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-neutral-900)' }}
          >
            2.4M
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            +18% from last month
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
            Engagement Rate
          </div>
          <div
            style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-neutral-900)' }}
          >
            3.8%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            Above industry average
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>Avg. ROI</div>
          <div
            style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-neutral-900)' }}
          >
            4.2x
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            Excellent returns
          </div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Engagement Trends</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likes" fill="#667eea" radius={[8, 8, 0, 0]} />
            <Bar dataKey="comments" fill="#764ba2" radius={[8, 8, 0, 0]} />
            <Bar dataKey="shares" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )

  return (
    <div style={styles.container}>
      {/* Demo Header */}
      <div style={styles.demoHeader}>
        <div style={styles.demoBadge}>
          <Sparkles size={24} />
          <span>DEMO MODE</span>
          <span style={styles.demoInfo}>• Exploring with sample data</span>
        </div>

        <div style={styles.demoActions}>
          <button
            onClick={() => setTourActive(true)}
            style={{ ...styles.startTrialBtn, background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <Play size={18} />
            Restart Tour
          </button>
          <button onClick={() => navigate('/register')} style={styles.startTrialBtn}>
            <Zap size={18} />
            Start Free Trial
          </button>
          <button onClick={() => navigate('/')} style={styles.exitDemoBtn}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainWrapper}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>{demoUser.avatar}</div>
              <div style={styles.userDetails}>
                <div style={styles.userName}>{demoUser.name}</div>
                <div style={styles.userHandle}>{demoUser.handle}</div>
                <div style={styles.userStats}>
                  {(demoUser.followers / 1000).toFixed(0)}K followers • {demoUser.engagement}%
                  engagement
                </div>
              </div>
            </div>
          </div>

          <nav style={styles.navigation}>
            <button
              style={{
                ...styles.navItem,
                ...(currentView === 'dashboard' ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(currentView === 'deals' ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentView('deals')}
            >
              <Briefcase size={20} />
              Deals
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(currentView === 'invoices' ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentView('invoices')}
            >
              <FileText size={20} />
              Invoices
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(currentView === 'briefs' ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentView('briefs')}
            >
              <FileSignature size={20} />
              Briefs
              <span
                style={{
                  marginLeft: 'auto',
                  padding: '0.125rem 0.5rem',
                  background: 'var(--color-primary-500)',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                }}
              >
                AI
              </span>
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(currentView === 'analytics' ? styles.navItemActive : {}),
              }}
              onClick={() => setCurrentView('analytics')}
            >
              <TrendingUp size={20} />
              Analytics
            </button>
            <button style={styles.navItem}>
              <CreditCard size={20} />
              Rate Cards
            </button>
            <button style={styles.navItem}>
              <Shield size={20} />
              Contracts
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          <div style={styles.viewHeader}>
            <h1 style={styles.viewTitle}>
              {currentView === 'dashboard' && 'Dashboard Overview'}
              {currentView === 'deals' && 'Deal Pipeline'}
              {currentView === 'invoices' && 'Invoice Management'}
              {currentView === 'briefs' && 'AI Brief Analyzer'}
              {currentView === 'analytics' && 'Performance Analytics'}
            </h1>
            <p style={styles.viewDescription}>
              {currentView === 'dashboard' &&
                'Your business at a glance - track revenue, deals, and performance metrics'}
              {currentView === 'deals' &&
                'Manage all your brand collaborations through different stages'}
              {currentView === 'invoices' && 'Create GST-compliant invoices and track payments'}
              {currentView === 'briefs' &&
                'Let AI analyze brand briefs to identify opportunities and risks'}
              {currentView === 'analytics' &&
                'Track your content performance and ROI across platforms'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'dashboard' && renderDashboard()}
              {currentView === 'deals' && renderDeals()}
              {currentView === 'invoices' && renderInvoices()}
              {currentView === 'briefs' && renderBriefs()}
              {currentView === 'analytics' && renderAnalytics()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tour Overlay */}
      {tourActive && (
        <div style={styles.tourOverlay}>
          <motion.div
            style={styles.tourCard}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div style={styles.tourHeader}>
              <div style={styles.tourIcon}>
                <Sparkles size={24} />
              </div>
              <h2 style={styles.tourTitle}>{tourSteps[tourStep].title}</h2>
            </div>

            <p style={styles.tourDescription}>{tourSteps[tourStep].description}</p>

            <div style={styles.tourActions}>
              <div style={styles.tourProgress}>
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.tourDot,
                      ...(index === tourStep ? styles.tourDotActive : {}),
                    }}
                  />
                ))}
              </div>

              <div style={styles.tourButtons}>
                <button onClick={skipTour} style={styles.skipButton}>
                  Skip Tour
                </button>
                <button onClick={nextTourStep} style={styles.nextButton}>
                  {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DemoPage

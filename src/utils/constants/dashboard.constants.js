import { Briefcase, DollarSign, FileText, MessageSquare } from 'lucide-react'

export const DashboardConstants = {
  // Sample data structure for charts (to be replaced with real API data)
  revenueData: [
    { month: 'Jan', revenue: 45000, deals: 3 },
    { month: 'Feb', revenue: 52000, deals: 4 },
    { month: 'Mar', revenue: 48000, deals: 3 },
    { month: 'Apr', revenue: 61000, deals: 5 },
    { month: 'May', revenue: 55000, deals: 4 },
    { month: 'Jun', revenue: 67000, deals: 6 },
  ],

  dealStageData: [
    { name: 'Leads', value: 12, color: '#667eea' },
    { name: 'Negotiation', value: 8, color: '#764ba2' },
    { name: 'Contract', value: 5, color: '#f59e0b' },
    { name: 'Ongoing', value: 3, color: '#10b981' },
  ],

  platformData: [
    { platform: 'Instagram', value: 60, color: '#E4405F' },
    { platform: 'YouTube', value: 30, color: '#FF0000' },
    { platform: 'Twitter', value: 10, color: '#1DA1F2' },
  ],

  // Calculate stats
  stats: {
    totalRevenue: 325000,
    revenueGrowth: 12.5,
    activeDeals: 8,
    dealsGrowth: 25,
    pendingInvoices: 3,
    invoiceAmount: 85000,
    completionRate: 92,
    avgDealValue: 40625,
    totalScripts: 0,
    scriptsGenerated: 0,
    // Add new rate card stats
    activeRateCards: 0,
    totalRateCards: 0,
  },

  // Recent activities
  recentActivities: [
    {
      id: 1,
      type: 'deal',
      title: 'New deal with Nike India',
      description: 'Instagram Reel + Story package',
      time: '2 hours ago',
      icon: Briefcase,
      color: '#667eea',
    },
    {
      id: 2,
      type: 'invoice',
      title: 'Invoice paid by Myntra',
      description: '₹45,000 received',
      time: '5 hours ago',
      icon: DollarSign,
      color: '#10b981',
    },
    {
      id: 3,
      type: 'script',
      title: 'Script generated for Amazon',
      description: 'AI generation completed',
      time: '1 day ago',
      icon: MessageSquare,
      color: '#f59e0b',
    },
  ],

  // Upcoming tasks
  upcomingTasks: [
    {
      id: 1,
      title: 'Submit content to Flipkart',
      dueDate: 'Today, 6:00 PM',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Review Zomato contract',
      dueDate: 'Tomorrow',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Send invoice to Swiggy',
      dueDate: 'Dec 28',
      priority: 'low',
      status: 'pending',
    },
  ],

  // Quick actions
  quickActions: [
    {
      id: 'new-deal',
      label: 'New Deal',
      icon: Briefcase,
      color: '#667eea',
      path: '/deals/create',
    },
    {
      id: 'create-invoice',
      label: 'Create Invoice',
      icon: FileText,
      color: '#10b981',
      path: '/invoices/create',
    },
    {
      id: 'create-script',
      label: 'Create Script',
      icon: MessageSquare,
      color: '#f59e0b',
      path: '/scripts/create',
    },
    // {
    //   id: 'view-analytics',
    //   label: 'Analytics',
    //   icon: BarChart3,
    //   color: '#06b6d4',
    //   path: '/performance',
    // },
  ],
}

import { create } from 'zustand'
import toast from 'react-hot-toast'
import { api } from '../api/endpoints'
import { formatDistanceToNow } from 'date-fns'
import { Briefcase, DollarSign, MessageSquare } from 'lucide-react'

const ORDER = ['pitched', 'in_talks', 'negotiating', 'live', 'completed', 'paid']

const TYPE_META = {
  deal: { icon: Briefcase, color: '#667eea' },
  invoices: { icon: DollarSign, color: '#10b981' },
  contracts: { icon: MessageSquare, color: '#f59e0b' },
}

function transformRecentActivitiesData(recentActivities) {
  const transformedData = recentActivities.map((activity) => {
    return {
      ...activity,
      time: formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true }),
      ...(TYPE_META[activity.type] ?? { icon: Briefcase, color: '#667eea' }),
    }
  })

  return transformedData
}

const useDashboardStore = create((set, get) => ({
  success: false,
  isLoading: false,
  stats: {},
  pipelineStats: [],
  revenueData: [],
  recentActivities: [],

  fetchDashboardAnalytics: async () => {
    try {
      set({ isLoading: true })
      const response = await api.get('/dashboard/reports')

      const { stats, dealPipelineStats, revenueOverviewStats, recentActivities, upcomingTasks } =
        response.data

      set({
        stats: stats ?? {},
        dealPipelineStats:
          dealPipelineStats?.sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name)) ?? [],
        revenueData: revenueOverviewStats || [],
        recentActivities: transformRecentActivitiesData(recentActivities) || [],
        upcomingTasks:
          upcomingTasks.map((task) => ({
            ...task,
            dueDate: formatDistanceToNow(new Date(task.dueDate)),
          })) || [],
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to fetch Data')
    }
  },
}))

export default useDashboardStore

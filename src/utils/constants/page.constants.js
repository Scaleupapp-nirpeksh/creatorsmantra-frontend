import {
  Award,
  BarChart3,
  Brain,
  DollarSign,
  FileText,
  Shield,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

export const PageConstants = {}

// Page Constants
PageConstants.CmMeta = {
  // ---- Pricing Plans ----
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹299',
      period: '/month',
      description: 'Perfect for creators just starting out',
      features: [
        '10 Active Deals',
        '20 Invoices/month',
        'Basic CRM Pipeline',
        'Invoice Management',
        'Basic Performance Tracking',
        'Email Support',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹1,499',
      period: '/month',
      description: 'For established creators ready to scale',
      features: [
        '25 Active Deals',
        'Unlimited Invoices',
        'AI Brief Analyzer',
        'AI-Powered Pricing',
        'Advanced Analytics',
        'Priority Support',
        'Custom Rate Cards',
        'Deal Templates',
      ],
      popular: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '₹2,999',
      period: '/month',
      description: 'Complete toolkit for power creators',
      features: [
        '50 Active Deals',
        'Everything in Pro',
        'AI Contract Review',
        'Advanced Workflows',
        'Team Collaboration',
        'White-label Reports',
        'API Access',
        'Dedicated Account Manager',
      ],
      popular: false,
    },
  ],

  // ---- Testmonials ----
  testimonials: [
    {
      name: 'Priya Sharma',
      handle: '@priyastyles',
      followers: '250K followers',
      content:
        'CreatorsMantra transformed how I manage collaborations. The AI brief analyzer alone saves me hours every week!',
      avatar: '👩‍💼',
    },
    {
      name: 'Arjun Patel',
      handle: '@techwitharjun',
      followers: '180K followers',
      content:
        'Finally, a platform that understands creator needs. Invoice generation with GST is now a 2-minute job.',
      avatar: '👨‍💻',
    },
    {
      name: 'Sneha Reddy',
      handle: '@foodwithsneha',
      followers: '320K followers',
      content:
        'The deal pipeline is a game-changer. I never miss a follow-up and my revenue has grown 40% in 3 months!',
      avatar: '👩‍🍳',
    },
  ],

  // ---- Features ----
  features: [
    {
      Icon: TrendingUp,
      title: 'Deal Pipeline Management',
      description: 'Track brand collaborations from pitch to payment with our visual pipeline',
      color: 'var(--color-primary)',
    },
    {
      Icon: FileText,
      title: 'Smart Invoicing',
      description: 'Create GST-compliant invoices in seconds with automatic tax calculations',
      color: 'var(--color-secondary)',
    },
    {
      Icon: Brain,
      title: 'AI Brief Analyzer',
      description: 'Let AI extract key requirements and spot red flags in brand briefs instantly',
      color: 'var(--color-accent)',
    },
    {
      Icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track ROI, engagement rates, and campaign performance in real-time',
      color: 'var(--color-success)',
    },
    {
      Icon: DollarSign,
      title: 'Dynamic Rate Cards',
      description: 'AI-powered pricing suggestions based on your metrics and market rates',
      color: 'var(--color-warning)',
    },
    {
      Icon: Shield,
      title: 'Contract Management',
      description: 'Store, track, and manage all your brand agreements in one secure place',
      color: 'var(--color-info)',
    },
  ],

  // ---- Stats ----
  stats: [
    { value: '10K+', label: 'Active Creators', Icon: Users },
    { value: '₹50Cr+', label: 'Invoices Processed', Icon: DollarSign },
    { value: '25K+', label: 'Deals Managed', Icon: Target },
    { value: '98%', label: 'Creator Satisfaction', Icon: Award },
  ],
}

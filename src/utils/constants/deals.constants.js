import {
  Activity,
  CheckCircle,
  DollarSign,
  Hash,
  Instagram,
  Link,
  Mail,
  Package,
  Share2,
  Target,
  Youtube,
  Zap,
} from 'lucide-react'

const StepsMap = {
  BASIC_INFO: 'Basic Info',
  CONTACT: 'Contact',
  DELIVERABLES: 'Deliverables',
  PAYMENT: 'Payment',
  ADDITIONAL: 'Additional',
}

export const DealsConstants = {
  stages: [
    {
      id: 'pitched',
      name: 'Pitched',
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      lightBg: 'rgba(139, 92, 246, 0.1)',
      icon: Target,
    },
    {
      id: 'in_talks',
      name: 'In Talks',
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      lightBg: 'rgba(59, 130, 246, 0.1)',
      icon: Mail,
    },
    {
      id: 'negotiating',
      name: 'Negotiating',
      color: '#06B6D4',
      bgGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      lightBg: 'rgba(6, 182, 212, 0.1)',
      icon: Activity,
    },
    {
      id: 'live',
      name: 'Live',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      lightBg: 'rgba(245, 158, 11, 0.1)',
      icon: Zap,
    },
    {
      id: 'completed',
      name: 'Completed',
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      lightBg: 'rgba(16, 185, 129, 0.1)',
      icon: CheckCircle,
    },
    {
      id: 'paid',
      name: 'Paid',
      color: '#22C55E',
      bgGradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      lightBg: 'rgba(34, 197, 94, 0.1)',
      icon: DollarSign,
    },
  ],
  brandCategories: [
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'tech', label: 'Technology' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'fitness', label: 'Fitness & Wellness' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'other', label: 'Other' },
  ],
  // Platform options
  platformOptions: [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'twitter', label: 'Twitter/X', icon: Hash },
    { value: 'linkedin', label: 'LinkedIn', icon: Link },
    { value: 'facebook', label: 'Facebook', icon: Share2 },
    { value: 'snapchat', label: 'Snapchat', icon: Package },
    { value: 'multiple', label: 'Multiple Platforms', icon: Share2 },
  ],

  // Deliverable types from backend
  deliverableTypes: [
    { value: 'instagram_post', label: 'Instagram Post' },
    { value: 'instagram_reel', label: 'Instagram Reel' },
    { value: 'instagram_story', label: 'Instagram Story' },
    { value: 'instagram_igtv', label: 'Instagram IGTV' },
    { value: 'youtube_video', label: 'YouTube Video' },
    { value: 'youtube_short', label: 'YouTube Short' },
    { value: 'linkedin_post', label: 'LinkedIn Post' },
    { value: 'linkedin_article', label: 'LinkedIn Article' },
    { value: 'twitter_post', label: 'Tweet/X Post' },
    { value: 'twitter_thread', label: 'Thread' },
    { value: 'facebook_post', label: 'Facebook Post' },
    { value: 'facebook_reel', label: 'Facebook Reel' },
    { value: 'blog_post', label: 'Blog Post' },
    { value: 'product_unboxing', label: 'Product Unboxing' },
    { value: 'brand_collaboration', label: 'Brand Collaboration' },
    { value: 'event_coverage', label: 'Event Coverage' },
    { value: 'other', label: 'Custom' },
  ],

  // Payment terms options
  paymentTermsOptions: [
    { value: 'full_advance', label: '100% Advance' },
    { value: '50_50', label: '50% Advance, 50% on Completion' },
    { value: '30_70', label: '30% Advance, 70% on Completion' },
    { value: 'on_delivery', label: '100% on Delivery' },
    { value: 'net_30', label: 'Net 30 Days' },
    { value: 'net_15', label: 'Net 15 Days' },
    { value: 'custom', label: 'Custom Terms' },
  ],

  // Deal source options
  sourceOptions: [
    { value: 'direct_outreach', label: 'Direct Outreach' },
    { value: 'brand_inquiry', label: 'Brand Inquiry' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'email_campaign', label: 'Email Campaign' },
    { value: 'networking', label: 'Networking' },
    { value: 'repeat_client', label: 'Repeat Client' },
    { value: 'other', label: 'Other' },
  ],

  // Industry options
  industryOptions: [
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tech', label: 'Technology' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'home_decor', label: 'Home & Decor' },
    { value: 'other', label: 'Other' },
  ],

  // Company size options
  companySizeOptions: [
    { value: 'startup', label: 'Startup (1-10)' },
    { value: 'small', label: 'Small (11-50)' },
    { value: 'medium', label: 'Medium (51-200)' },
    { value: 'large', label: 'Large (201-1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' },
  ],
  // Content tone options
  toneOptions: [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' },
  ],

  // Currency
  currencyOptions: [
    {
      value: 'INR',
      label: 'INR (₹)',
    },
    {
      value: 'USD',
      label: 'USD ($)',
    },
    {
      value: 'EUR',
      label: 'EUR (€)',
    },
  ],

  // Steps
  Steps: StepsMap,

  SectionsSequence: {
    [StepsMap.BASIC_INFO]: {
      next: StepsMap.CONTACT,
      prev: null,
    },
    [StepsMap.CONTACT]: {
      next: StepsMap.DELIVERABLES,
      prev: StepsMap.BASIC_INFO,
    },
    [StepsMap.DELIVERABLES]: {
      next: StepsMap.PAYMENT,
      prev: StepsMap.CONTACT,
    },
    [StepsMap.PAYMENT]: {
      next: StepsMap.ADDITIONAL,
      prev: StepsMap.DELIVERABLES,
    },
    [StepsMap.ADDITIONAL]: {
      next: null,
      prev: StepsMap.PAYMENT,
    },
  },

  TotalSteps: 5,
}

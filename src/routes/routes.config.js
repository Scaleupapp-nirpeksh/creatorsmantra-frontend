/**
 * Routes Configuration
 * 
 * Centralized route definitions including:
 * - Path patterns
 * - Component mappings
 * - Permission requirements
 * - Subscription tiers
 * - Metadata for breadcrumbs and navigation
 * 
 * File: src/routes/routes.config.js
 */

// ============================================
// Route Names (for type safety and consistency)
// ============================================
export const ROUTE_NAMES = {
  // Public routes
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  OTP_VERIFY: 'otp-verify',
  FORGOT_PASSWORD: 'forgot-password',
  
  // Dashboard
  DASHBOARD: 'dashboard',
  
  // Deals
  DEALS_LIST: 'deals-list',
  DEALS_PIPELINE: 'deals-pipeline',
  DEAL_CREATE: 'deal-create',
  DEAL_DETAILS: 'deal-details',
  DEAL_EDIT: 'deal-edit',
  
  // Invoices
  INVOICES_LIST: 'invoices-list',
  INVOICE_CREATE: 'invoice-create',
  INVOICE_DETAILS: 'invoice-details',
  INVOICE_EDIT: 'invoice-edit',
  
  // Briefs
  BRIEFS_LIST: 'briefs-list',
  BRIEF_CREATE: 'brief-create',
  BRIEF_DETAILS: 'brief-details',
  BRIEF_EDIT: 'brief-edit',
  
  // Analytics
  ANALYTICS_DASHBOARD: 'analytics-dashboard',
  ANALYTICS_REVENUE: 'analytics-revenue',
  ANALYTICS_PERFORMANCE: 'analytics-performance',
  ANALYTICS_INSIGHTS: 'analytics-insights',
  
  // Performance
  CAMPAIGNS_LIST: 'campaigns-list',
  CAMPAIGN_DETAILS: 'campaign-details',
  CAMPAIGN_CREATE: 'campaign-create',
  CAMPAIGN_EDIT: 'campaign-edit',
  
  // Contracts
  CONTRACTS_LIST: 'contracts-list',
  CONTRACT_DETAILS: 'contract-details',
  CONTRACT_CREATE: 'contract-create',
  CONTRACT_EDIT: 'contract-edit',
  
  // Rate Cards - Updated Section
  RATECARDS_DASHBOARD: 'ratecards-dashboard',
  RATECARDS_CREATE: 'ratecards-create',
  RATECARDS_LIST: 'ratecards-list', // Legacy
  RATECARD_BUILDER: 'ratecard-builder', // Legacy
  RATECARD_EDIT: 'ratecard-edit',
  RATECARD_HISTORY: 'ratecard-history',
  RATECARD_ANALYTICS: 'ratecard-analytics',
  RATECARD_PUBLIC: 'ratecard-public',
  
  // Settings
  SETTINGS: 'settings',
  SETTINGS_PROFILE: 'settings-profile',
  SETTINGS_SUBSCRIPTION: 'settings-subscription',
  SETTINGS_TEAM: 'settings-team',
  SETTINGS_BILLING: 'settings-billing',
  SETTINGS_NOTIFICATIONS: 'settings-notifications',
  SETTINGS_SECURITY: 'settings-security',
  SETTINGS_API: 'settings-api',
  
  // Help
  HELP: 'help',
  HELP_DOCS: 'help-docs',
  HELP_SUPPORT: 'help-support',
  HELP_CONTACT: 'help-contact',
  
  // Legal
  PRIVACY: 'privacy',
  TERMS: 'terms',
  REFUND: 'refund',
  
  // Error pages
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: 'not-found',
  SERVER_ERROR: 'server-error',
  MAINTENANCE: 'maintenance'
};

// ============================================
// Subscription Tiers
// ============================================
export const SUBSCRIPTION_TIERS = {
FREE: 'free',
STARTER: 'starter',
PRO: 'pro',
ELITE: 'elite',
AGENCY_STARTER: 'agency_starter',
AGENCY_PRO: 'agency_pro'
};

export const ALL_PAID_TIERS = [
SUBSCRIPTION_TIERS.STARTER,
SUBSCRIPTION_TIERS.PRO,
SUBSCRIPTION_TIERS.ELITE,
SUBSCRIPTION_TIERS.AGENCY_STARTER,
SUBSCRIPTION_TIERS.AGENCY_PRO
];

export const PRO_AND_ABOVE = [
SUBSCRIPTION_TIERS.PRO,
SUBSCRIPTION_TIERS.ELITE,
SUBSCRIPTION_TIERS.AGENCY_STARTER,
SUBSCRIPTION_TIERS.AGENCY_PRO
];

export const ELITE_AND_ABOVE = [
SUBSCRIPTION_TIERS.ELITE,
SUBSCRIPTION_TIERS.AGENCY_STARTER,
SUBSCRIPTION_TIERS.AGENCY_PRO
];

export const AGENCY_ONLY = [
SUBSCRIPTION_TIERS.AGENCY_STARTER,
SUBSCRIPTION_TIERS.AGENCY_PRO
];

// ============================================
// User Roles
// ============================================
export const USER_ROLES = {
ADMIN: 'admin',
CREATOR: 'creator',
MANAGER: 'manager',
VIEWER: 'viewer'
};

// ============================================
// Permissions - Updated with Rate Cards
// ============================================
export const PERMISSIONS = {
// Deals
DEALS_VIEW: 'deals.view',
DEALS_CREATE: 'deals.create',
DEALS_EDIT: 'deals.edit',
DEALS_DELETE: 'deals.delete',

// Invoices
INVOICES_VIEW: 'invoices.view',
INVOICES_CREATE: 'invoices.create',
INVOICES_EDIT: 'invoices.edit',
INVOICES_DELETE: 'invoices.delete',

// Briefs
BRIEFS_VIEW: 'briefs.view',
BRIEFS_CREATE: 'briefs.create',
BRIEFS_EDIT: 'briefs.edit',
BRIEFS_DELETE: 'briefs.delete',

// Rate Cards - New Permissions
RATECARDS_VIEW: 'ratecards.view',
RATECARDS_CREATE: 'ratecards.create',
RATECARDS_EDIT: 'ratecards.edit',
RATECARDS_DELETE: 'ratecards.delete',
RATECARDS_PUBLISH: 'ratecards.publish',
RATECARDS_ANALYTICS: 'ratecards.analytics',

// Analytics
ANALYTICS_VIEW: 'analytics.view',
ANALYTICS_EXPORT: 'analytics.export',

// Team
TEAM_VIEW: 'team.view',
TEAM_MANAGE: 'team.manage',

// Settings
SETTINGS_VIEW: 'settings.view',
SETTINGS_EDIT: 'settings.edit',

// Billing
BILLING_VIEW: 'billing.view',
BILLING_MANAGE: 'billing.manage'
};

// ============================================
// Features - Updated with Rate Cards
// ============================================
export const FEATURES = {
DEALS_PIPELINE: 'deals_pipeline',
INVOICE_GENERATION: 'invoice_generation',
CONSOLIDATED_BILLING: 'consolidated_billing',
BRIEF_ANALYSIS: 'brief_analysis',
AI_INSIGHTS: 'ai_insights',
ADVANCED_ANALYTICS: 'advanced_analytics',
PERFORMANCE_TRACKING: 'performance_tracking',
CONTRACT_MANAGEMENT: 'contract_management',
RATE_CARD_BUILDER: 'rate_card_builder',
AI_PRICING: 'ai_pricing',
RATE_CARD_ANALYTICS: 'rate_card_analytics',
RATE_CARD_VERSIONING: 'rate_card_versioning',
TEAM_COLLABORATION: 'team_collaboration',
API_ACCESS: 'api_access',
WHITE_LABEL: 'white_label'
};

// ============================================
// Route Configurations
// ============================================
export const ROUTE_CONFIG = {
// ========== Public Routes ==========
[ROUTE_NAMES.HOME]: {
  path: '/',
  title: 'Home',
  description: 'Welcome to CreatorsMantra',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.LOGIN]: {
  path: '/login',
  title: 'Login',
  description: 'Sign in to your account',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.REGISTER]: {
  path: '/register',
  title: 'Register',
  description: 'Create your account',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.OTP_VERIFY]: {
  path: '/verify-otp',
  title: 'Verify OTP',
  description: 'Enter the OTP sent to your phone',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.FORGOT_PASSWORD]: {
  path: '/forgot-password',
  title: 'Forgot Password',
  description: 'Reset your password',
  isPublic: true,
  showInNav: false
},

// ========== Dashboard ==========
[ROUTE_NAMES.DASHBOARD]: {
  path: '/dashboard',
  title: 'Dashboard',
  description: 'Your business overview',
  icon: 'Home',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true
},

// ========== Deals Module ==========
[ROUTE_NAMES.DEALS_LIST]: {
  path: '/deals',
  title: 'Deals',
  description: 'Manage your brand deals',
  icon: 'Briefcase',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  feature: FEATURES.DEALS_PIPELINE,
  badge: 'new'
},

[ROUTE_NAMES.DEALS_PIPELINE]: {
  path: '/deals/pipeline',
  title: 'Pipeline View',
  description: 'Visualize your deals pipeline',
  parent: ROUTE_NAMES.DEALS_LIST,
  requiredAuth: true,
  feature: FEATURES.DEALS_PIPELINE
},

[ROUTE_NAMES.DEAL_CREATE]: {
  path: '/deals/create',
  title: 'Create Deal',
  description: 'Add a new brand deal',
  parent: ROUTE_NAMES.DEALS_LIST,
  requiredAuth: true,
  permissions: [PERMISSIONS.DEALS_CREATE]
},

[ROUTE_NAMES.DEAL_DETAILS]: {
  path: '/deals/:dealId',
  title: 'Deal Details',
  description: 'View deal information',
  parent: ROUTE_NAMES.DEALS_LIST,
  requiredAuth: true,
  permissions: [PERMISSIONS.DEALS_VIEW]
},

[ROUTE_NAMES.DEAL_EDIT]: {
  path: '/deals/:dealId/edit',
  title: 'Edit Deal',
  description: 'Modify deal information',
  parent: ROUTE_NAMES.DEALS_LIST,
  requiredAuth: true,
  permissions: [PERMISSIONS.DEALS_EDIT]
},

// ========== Invoices Module ==========
[ROUTE_NAMES.INVOICES_LIST]: {
  path: '/invoices',
  title: 'Invoices',
  description: 'Manage invoices and payments',
  icon: 'FileText',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  requiredSubscription: ALL_PAID_TIERS,
  feature: FEATURES.INVOICE_GENERATION
},

[ROUTE_NAMES.INVOICE_CREATE]: {
  path: '/invoices/create',
  title: 'Create Invoice',
  description: 'Generate a new invoice',
  parent: ROUTE_NAMES.INVOICES_LIST,
  requiredAuth: true,
  requiredSubscription: ALL_PAID_TIERS,
  permissions: [PERMISSIONS.INVOICES_CREATE]
},

[ROUTE_NAMES.INVOICE_DETAILS]: {
  path: '/invoices/:invoiceId',
  title: 'Invoice Details',
  description: 'View invoice details',
  parent: ROUTE_NAMES.INVOICES_LIST,
  requiredAuth: true,
  requiredSubscription: ALL_PAID_TIERS,
  permissions: [PERMISSIONS.INVOICES_VIEW]
},

// ========== Briefs Module ==========
[ROUTE_NAMES.BRIEFS_LIST]: {
  path: '/briefs',
  title: 'Briefs',
  description: 'AI-powered brief analysis',
  icon: 'FileSignature',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  feature: FEATURES.BRIEF_ANALYSIS,
  badge: 'pro'
},

[ROUTE_NAMES.BRIEF_CREATE]: {
  path: '/briefs/create',
  title: 'Create Brief',
  description: 'Add a new brief',
  parent: ROUTE_NAMES.BRIEFS_LIST,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  permissions: [PERMISSIONS.BRIEFS_CREATE]
},

[ROUTE_NAMES.BRIEF_DETAILS]: {
  path: '/briefs/:briefId',
  title: 'Brief Details',
  description: 'View brief analysis',
  parent: ROUTE_NAMES.BRIEFS_LIST,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  permissions: [PERMISSIONS.BRIEFS_VIEW]
},

// ========== Analytics Module ==========
[ROUTE_NAMES.ANALYTICS_DASHBOARD]: {
  path: '/analytics',
  title: 'Analytics',
  description: 'Business intelligence & insights',
  icon: 'BarChart3',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  feature: FEATURES.ADVANCED_ANALYTICS,
  badge: 'pro',
  subNav: [
    ROUTE_NAMES.ANALYTICS_REVENUE,
    ROUTE_NAMES.ANALYTICS_PERFORMANCE,
    ROUTE_NAMES.ANALYTICS_INSIGHTS
  ]
},

[ROUTE_NAMES.ANALYTICS_REVENUE]: {
  path: '/analytics/revenue',
  title: 'Revenue Analytics',
  description: 'Track revenue metrics',
  parent: ROUTE_NAMES.ANALYTICS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE
},

[ROUTE_NAMES.ANALYTICS_PERFORMANCE]: {
  path: '/analytics/performance',
  title: 'Performance',
  description: 'Campaign performance metrics',
  parent: ROUTE_NAMES.ANALYTICS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE
},

[ROUTE_NAMES.ANALYTICS_INSIGHTS]: {
  path: '/analytics/insights',
  title: 'AI Insights',
  description: 'AI-generated business insights',
  parent: ROUTE_NAMES.ANALYTICS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: ELITE_AND_ABOVE,
  feature: FEATURES.AI_INSIGHTS
},

// ========== Performance Module ==========
[ROUTE_NAMES.CAMPAIGNS_LIST]: {
  path: '/performance',
  title: 'Performance',
  description: 'Track campaign performance',
  icon: 'TrendingUp',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  feature: FEATURES.PERFORMANCE_TRACKING
},

[ROUTE_NAMES.CAMPAIGN_DETAILS]: {
  path: '/performance/:campaignId',
  title: 'Campaign Details',
  description: 'View campaign metrics',
  parent: ROUTE_NAMES.CAMPAIGNS_LIST,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE
},

// ========== Contracts Module ==========
[ROUTE_NAMES.CONTRACTS_LIST]: {
  path: '/contracts',
  title: 'Contracts',
  description: 'Manage contracts',
  icon: 'Shield',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  feature: FEATURES.CONTRACT_MANAGEMENT
},

[ROUTE_NAMES.CONTRACT_DETAILS]: {
  path: '/contracts/:contractId',
  title: 'Contract Details',
  description: 'View contract details',
  parent: ROUTE_NAMES.CONTRACTS_LIST,
  requiredAuth: true
},

// ========== Rate Cards Module - UPDATED SECTION ==========
[ROUTE_NAMES.RATECARDS_DASHBOARD]: {
  path: '/dashboard/rate-cards',
  title: 'Rate Cards',
  description: 'Manage your pricing and rate cards',
  icon: 'CreditCard',
  showInNav: true,
  navSection: 'main',
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  feature: FEATURES.RATE_CARD_BUILDER,
  badge: 'pro',
  subNav: [
    ROUTE_NAMES.RATECARDS_CREATE
  ]
},

[ROUTE_NAMES.RATECARDS_CREATE]: {
  path: '/dashboard/rate-cards/create',
  title: 'Create Rate Card',
  description: 'Build a new professional rate card with AI pricing',
  parent: ROUTE_NAMES.RATECARDS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  permissions: [PERMISSIONS.RATECARDS_CREATE],
  feature: FEATURES.AI_PRICING
},

[ROUTE_NAMES.RATECARD_EDIT]: {
  path: '/dashboard/rate-cards/:rateCardId/edit',
  title: 'Edit Rate Card',
  description: 'Modify rate card details and pricing',
  parent: ROUTE_NAMES.RATECARDS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  permissions: [PERMISSIONS.RATECARDS_EDIT],
  feature: FEATURES.RATE_CARD_BUILDER
},

[ROUTE_NAMES.RATECARD_HISTORY]: {
  path: '/dashboard/rate-cards/:rateCardId/history',
  title: 'Rate Card History',
  description: 'View version history and restore previous versions',
  parent: ROUTE_NAMES.RATECARDS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: PRO_AND_ABOVE,
  permissions: [PERMISSIONS.RATECARDS_VIEW],
  feature: FEATURES.RATE_CARD_VERSIONING
},

[ROUTE_NAMES.RATECARD_ANALYTICS]: {
  path: '/dashboard/rate-cards/:rateCardId/analytics',
  title: 'Rate Card Analytics',
  description: 'View rate card performance and analytics',
  parent: ROUTE_NAMES.RATECARDS_DASHBOARD,
  requiredAuth: true,
  requiredSubscription: ELITE_AND_ABOVE,
  permissions: [PERMISSIONS.RATECARDS_ANALYTICS],
  feature: FEATURES.RATE_CARD_ANALYTICS,
  badge: 'elite'
},

[ROUTE_NAMES.RATECARD_PUBLIC]: {
  path: '/card/:publicId',
  title: 'Public Rate Card',
  description: 'View public rate card',
  isPublic: true,
  showInNav: false
},

// Legacy Rate Card Routes (for backward compatibility)
[ROUTE_NAMES.RATECARD_BUILDER]: {
  path: '/ratecards/builder',
  title: 'Rate Card Builder (Legacy)',
  description: 'Legacy route - redirects to new create page',
  redirect: '/dashboard/rate-cards/create',
  requiredAuth: true,
  showInNav: false
},

[ROUTE_NAMES.RATECARDS_LIST]: {
  path: '/ratecards',
  title: 'Rate Cards (Legacy)',
  description: 'Legacy route - redirects to dashboard',
  redirect: '/dashboard/rate-cards',
  requiredAuth: true,
  showInNav: false
},

// ========== Settings Module ==========
[ROUTE_NAMES.SETTINGS]: {
  path: '/settings',
  title: 'Settings',
  description: 'Manage your account',
  icon: 'Settings',
  showInNav: true,
  navSection: 'bottom',
  requiredAuth: true,
  subNav: [
    ROUTE_NAMES.SETTINGS_PROFILE,
    ROUTE_NAMES.SETTINGS_SUBSCRIPTION,
    ROUTE_NAMES.SETTINGS_TEAM,
    ROUTE_NAMES.SETTINGS_BILLING,
    ROUTE_NAMES.SETTINGS_NOTIFICATIONS,
    ROUTE_NAMES.SETTINGS_SECURITY
  ]
},

[ROUTE_NAMES.SETTINGS_PROFILE]: {
  path: '/settings/profile',
  title: 'Profile',
  description: 'Your profile information',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true
},

[ROUTE_NAMES.SETTINGS_SUBSCRIPTION]: {
  path: '/settings/subscription',
  title: 'Subscription',
  description: 'Manage your plan',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true
},

[ROUTE_NAMES.SETTINGS_TEAM]: {
  path: '/settings/team',
  title: 'Team',
  description: 'Manage team members',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true,
  requiredSubscription: AGENCY_ONLY,
  feature: FEATURES.TEAM_COLLABORATION
},

[ROUTE_NAMES.SETTINGS_BILLING]: {
  path: '/settings/billing',
  title: 'Billing',
  description: 'Billing & payments',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true,
  permissions: [PERMISSIONS.BILLING_VIEW]
},

[ROUTE_NAMES.SETTINGS_NOTIFICATIONS]: {
  path: '/settings/notifications',
  title: 'Notifications',
  description: 'Notification preferences',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true
},

[ROUTE_NAMES.SETTINGS_SECURITY]: {
  path: '/settings/security',
  title: 'Security',
  description: 'Security settings',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true
},

[ROUTE_NAMES.SETTINGS_API]: {
  path: '/settings/api',
  title: 'API',
  description: 'API keys & webhooks',
  parent: ROUTE_NAMES.SETTINGS,
  requiredAuth: true,
  requiredSubscription: ELITE_AND_ABOVE,
  feature: FEATURES.API_ACCESS
},

// ========== Help Module ==========
[ROUTE_NAMES.HELP]: {
  path: '/help',
  title: 'Help & Support',
  description: 'Get help',
  icon: 'HelpCircle',
  showInNav: true,
  navSection: 'bottom',
  requiredAuth: true
},

[ROUTE_NAMES.HELP_DOCS]: {
  path: '/help/docs',
  title: 'Documentation',
  description: 'User guides',
  parent: ROUTE_NAMES.HELP,
  requiredAuth: true
},

[ROUTE_NAMES.HELP_SUPPORT]: {
  path: '/help/support',
  title: 'Support',
  description: 'Contact support',
  parent: ROUTE_NAMES.HELP,
  requiredAuth: true
},

// ========== Legal Pages ==========
[ROUTE_NAMES.PRIVACY]: {
  path: '/privacy',
  title: 'Privacy Policy',
  description: 'Our privacy policy',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.TERMS]: {
  path: '/terms',
  title: 'Terms of Service',
  description: 'Terms and conditions',
  isPublic: true,
  showInNav: false
},

// ========== Error Pages ==========
[ROUTE_NAMES.UNAUTHORIZED]: {
  path: '/unauthorized',
  title: 'Unauthorized',
  description: 'Access denied',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.NOT_FOUND]: {
  path: '/404',
  title: 'Not Found',
  description: 'Page not found',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.SERVER_ERROR]: {
  path: '/error',
  title: 'Server Error',
  description: 'Something went wrong',
  isPublic: true,
  showInNav: false
},

[ROUTE_NAMES.MAINTENANCE]: {
  path: '/maintenance',
  title: 'Maintenance',
  description: 'Under maintenance',
  isPublic: true,
  showInNav: false
}
};

// ============================================
// Helper Functions
// ============================================

/**
* Get route configuration by name
*/
export const getRouteConfig = (routeName) => {
return ROUTE_CONFIG[routeName] || null;
};

/**
* Get route path by name
*/
export const getRoutePath = (routeName, params = {}) => {
const config = getRouteConfig(routeName);
if (!config) return '/';

let path = config.path;

// Replace params in path
Object.keys(params).forEach(key => {
  path = path.replace(`:${key}`, params[key]);
});

return path;
};

/**
* Get navigation items for a section
*/
export const getNavigationItems = (section = 'main') => {
return Object.entries(ROUTE_CONFIG)
  .filter(([_, config]) => config.showInNav && config.navSection === section)
  .map(([name, config]) => ({
    name,
    ...config
  }));
};

/**
* Get breadcrumb trail for a route
*/
export const getBreadcrumbs = (routeName) => {
const breadcrumbs = [];
let currentRoute = getRouteConfig(routeName);

while (currentRoute) {
  breadcrumbs.unshift({
    name: routeName,
    title: currentRoute.title,
    path: currentRoute.path
  });
  
  if (currentRoute.parent) {
    currentRoute = getRouteConfig(currentRoute.parent);
    routeName = currentRoute.parent;
  } else {
    break;
  }
}

return breadcrumbs;
};

/**
* Check if user has access to route
*/
export const canAccessRoute = (routeName, user, subscription) => {
const config = getRouteConfig(routeName);
if (!config) return false;

// Public routes
if (config.isPublic) return true;

// Check authentication
if (config.requiredAuth && !user) return false;

// Check subscription
if (config.requiredSubscription && config.requiredSubscription.length > 0) {
  if (!subscription || !config.requiredSubscription.includes(subscription.tier)) {
    return false;
  }
}

// Check permissions (would need to implement permission checking)
if (config.permissions && config.permissions.length > 0) {
  // Check if user has required permissions
  // This would need to be implemented based on your permission system
}

return true;
};

/**
* Get Rate Card specific routes for quick access
*/
export const getRateCardRoutes = () => {
return {
  dashboard: getRoutePath(ROUTE_NAMES.RATECARDS_DASHBOARD),
  create: getRoutePath(ROUTE_NAMES.RATECARDS_CREATE),
  edit: (rateCardId) => getRoutePath(ROUTE_NAMES.RATECARD_EDIT, { rateCardId }),
  history: (rateCardId) => getRoutePath(ROUTE_NAMES.RATECARD_HISTORY, { rateCardId }),
  analytics: (rateCardId) => getRoutePath(ROUTE_NAMES.RATECARD_ANALYTICS, { rateCardId }),
  public: (publicId) => getRoutePath(ROUTE_NAMES.RATECARD_PUBLIC, { publicId })
};
};

/**
* Check if route requires specific subscription tier
*/
export const getRequiredSubscription = (routeName) => {
const config = getRouteConfig(routeName);
return config?.requiredSubscription || null;
};

/**
* Check if route has specific features
*/
export const getRouteFeatures = (routeName) => {
const config = getRouteConfig(routeName);
return config?.feature ? [config.feature] : [];
};

export default ROUTE_CONFIG;
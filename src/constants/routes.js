/**
 * CreatorsMantra Frontend - Route Constants
 * Centralized routing configuration for the application
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description Route paths, navigation structure, and breadcrumb definitions
 * @path src/constants/routes.js
 */

// ============================================
// BASE ROUTE PATHS
// ============================================

export const BASE_ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    HELP: '/help',
    PRICING: '/pricing',
  };
  
  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    VERIFY_EMAIL: '/auth/verify-email',
    LOGOUT: '/auth/logout',
  };
  
  // ============================================
  // DASHBOARD ROUTES
  // ============================================
  
  export const DASHBOARD_ROUTES = {
    OVERVIEW: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
    QUICK_ACTIONS: '/dashboard/quick-actions',
  };
  
  // ============================================
  // DEAL CRM ROUTES
  // ============================================
  
  export const DEAL_ROUTES = {
    LIST: '/deals',
    PIPELINE: '/deals/pipeline',
    CREATE: '/deals/create',
    DETAILS: '/deals/:dealId',
    EDIT: '/deals/:dealId/edit',
    
    // Pipeline stages
    PITCHED: '/deals/pipeline/pitched',
    IN_TALKS: '/deals/pipeline/in-talks',
    LIVE: '/deals/pipeline/live',
    PAID: '/deals/pipeline/paid',
    
    // Sub-routes
    COMMUNICATIONS: '/deals/:dealId/communications',
    DELIVERABLES: '/deals/:dealId/deliverables',
    DOCUMENTS: '/deals/:dealId/documents',
    
    // Brand management
    BRANDS: '/deals/brands',
    BRAND_DETAILS: '/deals/brands/:brandId',
    CREATE_BRAND: '/deals/brands/create',
    
    // Templates
    TEMPLATES: '/deals/templates',
    CREATE_TEMPLATE: '/deals/templates/create',
    
    // Analytics
    ANALYTICS: '/deals/analytics',
    REPORTS: '/deals/reports',
  };
  
  // ============================================
  // INVOICE ROUTES
  // ============================================
  
  export const INVOICE_ROUTES = {
    LIST: '/invoices',
    CREATE: '/invoices/create',
    DETAILS: '/invoices/:invoiceId',
    EDIT: '/invoices/:invoiceId/edit',
    PREVIEW: '/invoices/:invoiceId/preview',
    
    // Creation types
    CREATE_INDIVIDUAL: '/invoices/create/individual',
    CREATE_CONSOLIDATED: '/invoices/create/consolidated',
    
    // Management
    PAYMENT_TRACKING: '/invoices/payments',
    PAYMENT_DETAILS: '/invoices/payments/:paymentId',
    REMINDERS: '/invoices/reminders',
    
    // Settings
    TEMPLATES: '/invoices/templates',
    TAX_SETTINGS: '/invoices/tax-settings',
    BANK_DETAILS: '/invoices/bank-details',
    
    // Analytics
    ANALYTICS: '/invoices/analytics',
    REPORTS: '/invoices/reports',
    DASHBOARD: '/invoices/dashboard',
  };
  
  // ============================================
  // RATE CARD ROUTES
  // ============================================
  
  export const RATE_CARD_ROUTES = {
    LIST: '/rate-cards',
    CREATE: '/rate-cards/create',
    DETAILS: '/rate-cards/:cardId',
    EDIT: '/rate-cards/:cardId/edit',
    PREVIEW: '/rate-cards/:cardId/preview',
    
    // Templates and sharing
    TEMPLATES: '/rate-cards/templates',
    SHARED: '/rate-cards/shared/:shortCode',
    
    // Analytics
    ANALYTICS: '/rate-cards/:cardId/analytics',
    INSIGHTS: '/rate-cards/insights',
  };
  
  // ============================================
  // BRIEF ANALYZER ROUTES
  // ============================================
  
  export const BRIEF_ROUTES = {
    LIST: '/briefs',
    CREATE: '/briefs/create',
    CREATE_TEXT: '/briefs/create/text',
    CREATE_FILE: '/briefs/create/file',
    DETAILS: '/briefs/:briefId',
    EDIT: '/briefs/:briefId/edit',
    
    // Analysis
    ANALYSIS: '/briefs/:briefId/analysis',
    CLARIFICATIONS: '/briefs/:briefId/clarifications',
    CONVERSION: '/briefs/:briefId/convert',
    
    // Management
    DASHBOARD: '/briefs/dashboard',
    TEMPLATES: '/briefs/templates',
    ANALYTICS: '/briefs/analytics',
  };
  
  // ============================================
  // PERFORMANCE VAULT ROUTES
  // ============================================
  
  export const PERFORMANCE_ROUTES = {
    LIST: '/performance',
    CAMPAIGNS: '/performance/campaigns',
    CREATE_CAMPAIGN: '/performance/campaigns/create',
    CAMPAIGN_DETAILS: '/performance/campaigns/:campaignId',
    EDIT_CAMPAIGN: '/performance/campaigns/:campaignId/edit',
    
    // Reports
    REPORTS: '/performance/reports',
    REPORT_DETAILS: '/performance/reports/:reportId',
    CREATE_REPORT: '/performance/reports/create',
    
    // Analytics
    OVERVIEW: '/performance/overview',
    ANALYTICS: '/performance/analytics',
    INSIGHTS: '/performance/insights',
    
    // Settings
    SETTINGS: '/performance/settings',
    BRANDING: '/performance/settings/branding',
  };
  
  // ============================================
  // CONTRACT ROUTES
  // ============================================
  
  export const CONTRACT_ROUTES = {
    LIST: '/contracts',
    UPLOAD: '/contracts/upload',
    DETAILS: '/contracts/:contractId',
    ANALYSIS: '/contracts/:contractId/analysis',
    
    // Negotiation
    NEGOTIATION: '/contracts/:contractId/negotiation',
    NEGOTIATION_HISTORY: '/contracts/:contractId/negotiations',
    
    // Resources
    TEMPLATES: '/contracts/templates',
    CLAUSE_LIBRARY: '/contracts/clauses',
    
    // Analytics
    ANALYTICS: '/contracts/analytics',
    INSIGHTS: '/contracts/insights',
  };
  
  // ============================================
  // ANALYTICS ROUTES
  // ============================================
  
  export const ANALYTICS_ROUTES = {
    DASHBOARD: '/analytics',
    REVENUE: '/analytics/revenue',
    DEALS: '/analytics/deals',
    PERFORMANCE: '/analytics/performance',
    
    // Advanced analytics
    INSIGHTS: '/analytics/insights',
    TRENDS: '/analytics/trends',
    FORECASTING: '/analytics/forecasting',
    RISK: '/analytics/risk',
    
    // Reports
    REPORTS: '/analytics/reports',
    CUSTOM_REPORTS: '/analytics/reports/custom',
    SCHEDULED_REPORTS: '/analytics/reports/scheduled',
  };
  
  // ============================================
  // AGENCY ROUTES (For Agency Subscriptions)
  // ============================================
  
  export const AGENCY_ROUTES = {
    DASHBOARD: '/agency',
    CREATORS: '/agency/creators',
    CREATOR_DETAILS: '/agency/creators/:creatorId',
    INVITE_CREATOR: '/agency/creators/invite',
    
    // Multi-creator features
    PORTFOLIO: '/agency/portfolio',
    COMPARISON: '/agency/comparison',
    APPROVALS: '/agency/approvals',
    
    // Billing
    BILLING: '/agency/billing',
    CONSOLIDATED_BILLING: '/agency/billing/consolidated',
    
    // Analytics
    ANALYTICS: '/agency/analytics',
    REPORTS: '/agency/reports',
  };
  
  // ============================================
  // PROFILE & SETTINGS ROUTES
  // ============================================
  
  export const PROFILE_ROUTES = {
    OVERVIEW: '/profile',
    EDIT: '/profile/edit',
    SOCIAL_PROFILES: '/profile/social',
    BANK_DETAILS: '/profile/bank',
    TAX_DETAILS: '/profile/tax',
    PREFERENCES: '/profile/preferences',
  };
  
  export const SETTINGS_ROUTES = {
    GENERAL: '/settings',
    ACCOUNT: '/settings/account',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy',
    BILLING: '/settings/billing',
    SUBSCRIPTION: '/settings/subscription',
    INTEGRATIONS: '/settings/integrations',
    TEAM: '/settings/team',
    DANGER_ZONE: '/settings/danger-zone',
  };
  
  // ============================================
  // HELP & SUPPORT ROUTES
  // ============================================
  
  export const HELP_ROUTES = {
    OVERVIEW: '/help',
    GETTING_STARTED: '/help/getting-started',
    TUTORIALS: '/help/tutorials',
    FAQ: '/help/faq',
    CONTACT: '/help/contact',
    FEATURE_REQUESTS: '/help/feature-requests',
    BUG_REPORTS: '/help/bug-reports',
    
    // Module-specific help
    DEALS_HELP: '/help/deals',
    INVOICES_HELP: '/help/invoices',
    BRIEFS_HELP: '/help/briefs',
    ANALYTICS_HELP: '/help/analytics',
  };
  
  // ============================================
  // PUBLIC ROUTES
  // ============================================
  
  export const PUBLIC_ROUTES = {
    LANDING: '/',
    FEATURES: '/features',
    PRICING: '/pricing',
    ABOUT: '/about',
    CONTACT: '/contact',
    BLOG: '/blog',
    BLOG_POST: '/blog/:slug',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    SECURITY: '/security',
    
    // Public rate cards
    PUBLIC_RATE_CARD: '/r/:shortCode',
    PUBLIC_REPORT: '/report/:shareId',
  };
  
  // ============================================
  // ERROR ROUTES
  // ============================================
  
  export const ERROR_ROUTES = {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    FORBIDDEN: '/403',
    SERVER_ERROR: '/500',
    MAINTENANCE: '/maintenance',
  };
  
  // ============================================
  // NAVIGATION STRUCTURE
  // ============================================
  
  export const NAVIGATION_STRUCTURE = {
    SIDEBAR: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: DASHBOARD_ROUTES.OVERVIEW,
        icon: 'LayoutDashboard',
        module: 'dashboard',
      },
      {
        id: 'deals',
        label: 'Deal CRM',
        path: DEAL_ROUTES.LIST,
        icon: 'Briefcase',
        module: 'deals',
        children: [
          { id: 'deals-pipeline', label: 'Pipeline', path: DEAL_ROUTES.PIPELINE },
          { id: 'deals-brands', label: 'Brands', path: DEAL_ROUTES.BRANDS },
          { id: 'deals-analytics', label: 'Analytics', path: DEAL_ROUTES.ANALYTICS },
        ],
      },
      {
        id: 'invoices',
        label: 'Invoices',
        path: INVOICE_ROUTES.LIST,
        icon: 'Receipt',
        module: 'invoices',
        children: [
          { id: 'invoices-create', label: 'Create Invoice', path: INVOICE_ROUTES.CREATE },
          { id: 'invoices-payments', label: 'Payments', path: INVOICE_ROUTES.PAYMENT_TRACKING },
          { id: 'invoices-analytics', label: 'Analytics', path: INVOICE_ROUTES.ANALYTICS },
        ],
      },
      {
        id: 'rate-cards',
        label: 'Rate Cards',
        path: RATE_CARD_ROUTES.LIST,
        icon: 'CreditCard',
        module: 'ratecards',
      },
      {
        id: 'briefs',
        label: 'Brief Analyzer',
        path: BRIEF_ROUTES.LIST,
        icon: 'FileText',
        module: 'briefs',
      },
      {
        id: 'performance',
        label: 'Performance',
        path: PERFORMANCE_ROUTES.LIST,
        icon: 'TrendingUp',
        module: 'performance',
      },
      {
        id: 'contracts',
        label: 'Contracts',
        path: CONTRACT_ROUTES.LIST,
        icon: 'FileCheck',
        module: 'contracts',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: ANALYTICS_ROUTES.DASHBOARD,
        icon: 'BarChart3',
        module: 'analytics',
        subscriptionRequired: ['pro', 'elite', 'agency_starter', 'agency_pro'],
      },
    ],
    
    HEADER: [
      { id: 'dashboard', label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
      { id: 'deals', label: 'Deals', path: DEAL_ROUTES.LIST },
      { id: 'invoices', label: 'Invoices', path: INVOICE_ROUTES.LIST },
      { id: 'analytics', label: 'Analytics', path: ANALYTICS_ROUTES.DASHBOARD },
    ],
  };
  
  // ============================================
  // BREADCRUMB DEFINITIONS
  // ============================================
  
  export const BREADCRUMB_DEFINITIONS = {
    [DASHBOARD_ROUTES.OVERVIEW]: [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
    ],
    
    [DEAL_ROUTES.LIST]: [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
      { label: 'Deals', path: DEAL_ROUTES.LIST },
    ],
    
    [DEAL_ROUTES.CREATE]: [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
      { label: 'Deals', path: DEAL_ROUTES.LIST },
      { label: 'Create Deal', path: DEAL_ROUTES.CREATE },
    ],
    
    [INVOICE_ROUTES.LIST]: [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
      { label: 'Invoices', path: INVOICE_ROUTES.LIST },
    ],
    
    [ANALYTICS_ROUTES.DASHBOARD]: [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
      { label: 'Analytics', path: ANALYTICS_ROUTES.DASHBOARD },
    ],
  };
  
  // ============================================
  // ROUTE UTILITIES
  // ============================================
  
  /**
   * Generate dynamic route with parameters
   * @param {string} route - Route pattern with parameters
   * @param {object} params - Parameters to replace
   * @returns {string} - Generated route
   */
  export const generateRoute = (route, params = {}) => {
    let generatedRoute = route;
    
    Object.keys(params).forEach(key => {
      generatedRoute = generatedRoute.replace(`:${key}`, params[key]);
    });
    
    return generatedRoute;
  };
  
  /**
   * Check if route requires authentication
   * @param {string} path - Route path
   * @returns {boolean} - Whether authentication is required
   */
  export const requiresAuth = (path) => {
    const publicPaths = [
      ...Object.values(PUBLIC_ROUTES),
      ...Object.values(AUTH_ROUTES),
      ...Object.values(ERROR_ROUTES),
    ];
    
    return !publicPaths.some(publicPath => {
      // Handle dynamic routes
      const pattern = publicPath.replace(/:[\w]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    });
  };
  
  /**
   * Get module name from route
   * @param {string} path - Route path
   * @returns {string|null} - Module name or null
   */
  export const getModuleFromRoute = (path) => {
    if (path.startsWith('/deals')) return 'deals';
    if (path.startsWith('/invoices')) return 'invoices';
    if (path.startsWith('/rate-cards')) return 'ratecards';
    if (path.startsWith('/briefs')) return 'briefs';
    if (path.startsWith('/performance')) return 'performance';
    if (path.startsWith('/contracts')) return 'contracts';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/agency')) return 'agency';
    if (path.startsWith('/dashboard')) return 'dashboard';
    
    return null;
  };
  
  /**
   * Get breadcrumbs for route
   * @param {string} path - Current route path
   * @param {object} params - Route parameters
   * @returns {array} - Breadcrumb items
   */
  export const getBreadcrumbs = (path, params = {}) => {
    // Generate dynamic path if needed
    const dynamicPath = generateRoute(path, params);
    
    return BREADCRUMB_DEFINITIONS[path] || BREADCRUMB_DEFINITIONS[dynamicPath] || [
      { label: 'Dashboard', path: DASHBOARD_ROUTES.OVERVIEW },
    ];
  };
  
  // ============================================
  // EXPORTS
  // ============================================
  
  export default {
    BASE_ROUTES,
    AUTH_ROUTES,
    DASHBOARD_ROUTES,
    DEAL_ROUTES,
    INVOICE_ROUTES,
    RATE_CARD_ROUTES,
    BRIEF_ROUTES,
    PERFORMANCE_ROUTES,
    CONTRACT_ROUTES,
    ANALYTICS_ROUTES,
    AGENCY_ROUTES,
    PROFILE_ROUTES,
    SETTINGS_ROUTES,
    HELP_ROUTES,
    PUBLIC_ROUTES,
    ERROR_ROUTES,
    NAVIGATION_STRUCTURE,
    BREADCRUMB_DEFINITIONS,
    generateRoute,
    requiresAuth,
    getModuleFromRoute,
    getBreadcrumbs,
  };
  
  // Debug helper for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🗺️ CreatorsMantra Route System Loaded', {
      totalRoutes: Object.values({
        ...BASE_ROUTES,
        ...AUTH_ROUTES,
        ...DEAL_ROUTES,
        ...INVOICE_ROUTES,
        ...ANALYTICS_ROUTES,
      }).length,
      modules: ['deals', 'invoices', 'ratecards', 'briefs', 'performance', 'contracts', 'analytics'],
      navigationItems: NAVIGATION_STRUCTURE.SIDEBAR.length,
    });
  }
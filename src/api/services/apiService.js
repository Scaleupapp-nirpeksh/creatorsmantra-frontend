import { 
    authAPI, 
    dealsAPI, 
    invoicesAPI, 
    briefsAPI,
    analyticsAPI,
    performanceAPI,
    contractsAPI,
    rateCardsAPI,
    subscriptionsAPI
  } from '../endpoints';
  
  /**
   * High-level API service for complex operations
   */
  class ApiService {
    constructor() {
      this.auth = authAPI;
      this.deals = dealsAPI;
      this.invoices = invoicesAPI;
      this.briefs = briefsAPI;
      this.analytics = analyticsAPI;
      this.performance = performanceAPI;
      this.contracts = contractsAPI;
      this.rateCards = rateCardsAPI;
      this.subscriptions = subscriptionsAPI;
    }
  
    /**
     * Complete login flow with OTP
     */
    async loginWithOTPFlow(phone) {
      try {
        // Check if phone exists
        const checkResponse = await this.auth.checkPhone(phone);
        
        // Send OTP
        const otpResponse = await this.auth.sendOTP(phone);
        
        return {
          exists: checkResponse.data.exists,
          otpSent: otpResponse.success,
          message: otpResponse.message
        };
      } catch (error) {
        throw error;
      }
    }
  
    /**
     * Complete registration flow
     */
    async registerFlow(userData) {
      try {
        // Register user
        const registerResponse = await this.auth.register(userData);
        
        // Get subscription tiers for selection
        const tiersResponse = await this.auth.getSubscriptionTiers();
        
        return {
          user: registerResponse.data.user,
          tokens: registerResponse.data.tokens,
          tiers: tiersResponse.data
        };
      } catch (error) {
        throw error;
      }
    }
  
    /**
     * Get complete dashboard data
     */
    async getDashboardData() {
      try {
        const [
          profile,
          dealsSummary,
          invoicesDashboard,
          analyticsOverview,
          notifications
        ] = await Promise.all([
          this.auth.getProfile(),
          this.deals.getDealSummary(),
          this.invoices.getInvoiceDashboard(),
          this.analytics.getDashboard(),
          this.getNotifications()
        ]);
  
        return {
          profile: profile.data,
          deals: dealsSummary.data,
          invoices: invoicesDashboard.data,
          analytics: analyticsOverview.data,
          notifications: notifications.data
        };
      } catch (error) {
        console.error('Dashboard data fetch failed:', error);
        throw error;
      }
    }
  
    /**
     * Get notifications (placeholder - implement based on backend)
     */
    async getNotifications() {
      // Implement when notifications endpoint is available
      return {
        data: {
          unread: 0,
          notifications: []
        }
      };
    }
  
    /**
     * Create deal from brief
     */
    async createDealFromBrief(briefId) {
      try {
        const brief = await this.briefs.getBrief(briefId);
        const dealData = await this.briefs.convertToDeal(briefId);
        const deal = await this.deals.createDeal(dealData.data);
        
        return {
          brief: brief.data,
          deal: deal.data
        };
      } catch (error) {
        throw error;
      }
    }
  
    /**
     * Get creator's complete analytics
     */
    async getCompleteAnalytics(period = 'month') {
      try {
        const [
          dashboard,
          revenue,
          dealPerformance,
          insights
        ] = await Promise.all([
          this.analytics.getDashboard({ period }),
          this.analytics.getRevenue({ period }),
          this.analytics.getDealPerformance({ period }),
          this.analytics.getInsights()
        ]);
  
        return {
          dashboard: dashboard.data,
          revenue: revenue.data,
          performance: dealPerformance.data,
          insights: insights.data
        };
      } catch (error) {
        throw error;
      }
    }
  
    /**
     * Upload file with progress tracking
     */
    async uploadFile(endpoint, file, onProgress) {
      const formData = new FormData();
      formData.append('file', file);
      
      return api.upload(endpoint, formData, onProgress);
    }
  }
  
  // Create singleton instance
  const apiService = new ApiService();
  
  export default apiService;
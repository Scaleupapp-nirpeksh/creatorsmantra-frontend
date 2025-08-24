import { api } from '../client';

export const subscriptionsAPI = {
  // Public endpoints
  health: () => 
    api.get('/subscriptions/health'),
  
  getTiers: () => 
    api.get('/subscriptions/tiers'),
  
  getTierFeatures: (tier) => 
    api.get(`/subscriptions/features/${tier}`),
  
  // Payment operations
  initiatePayment: (data) => 
    api.post('/subscriptions/payments/verify', data),
  
  getPendingPayments: () => 
    api.get('/subscriptions/payments/pending'),
  
  getPaymentDetails: (paymentId) => 
    api.get(`/subscriptions/payments/${paymentId}`),
  
  uploadPaymentScreenshot: (paymentId, formData) => 
    api.upload(`/subscriptions/payments/${paymentId}/screenshot`, formData),
  
  verifyPayment: (paymentId, data) => 
    api.put(`/subscriptions/payments/${paymentId}/verify`, data),
  
  // Billing
  getCurrentBilling: () => 
    api.get('/subscriptions/billing/current'),
  
  getBillingHistory: (params = {}) => 
    api.get('/subscriptions/billing/history', { params }),
  
  // Subscription management
  getSubscriptionOverview: () => 
    api.get('/subscriptions/overview'),
  
  requestUpgrade: (data) => 
    api.post('/subscriptions/upgrade', data),
  
  getUpgradeRequests: () => 
    api.get('/subscriptions/upgrades'),
  
  processUpgrade: (upgradeId, action) => 
    api.put(`/subscriptions/upgrades/${upgradeId}/process`, { action }),
  
  cancelSubscription: (reason) => 
    api.post('/subscriptions/cancel', { reason }),
  
  // Statistics
  getSubscriptionStats: () => 
    api.get('/subscriptions/stats'),
  
  // Reminders
  sendRenewalReminders: () => 
    api.post('/subscriptions/reminders/send'),
  
  getRenewalReminders: () => 
    api.get('/subscriptions/reminders'),
  
  // Auto-renewal
  updateAutoRenewal: (enabled) => 
    api.put('/subscriptions/auto-renewal', { enabled }),
  
  // Invoices
  getSubscriptionInvoices: () => 
    api.get('/subscriptions/invoices'),
  
  downloadInvoice: (invoiceId) => 
    api.download(`/subscriptions/invoices/${invoiceId}/download`, `subscription-invoice-${invoiceId}.pdf`),
  
  // Coupons & discounts
  applyCoupon: (couponCode) => 
    api.post('/subscriptions/coupons/apply', { couponCode }),
  
  validateCoupon: (couponCode) => 
    api.post('/subscriptions/coupons/validate', { couponCode }),
  
  // Usage
  getUsageStats: () => 
    api.get('/subscriptions/usage'),
  
  getFeatureUsage: () => 
    api.get('/subscriptions/usage/features'),
};
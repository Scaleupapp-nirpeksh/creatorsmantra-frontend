// src/api/endpoints/invoices.js
import { api } from '../client';

export const invoicesAPI = {
  // ============================================
  // INVOICE CREATION
  // ============================================
  
  createIndividualInvoice: (data) =>
    api.post('/invoices/create-individual', {
      dealId: data.dealId,
      clientDetails: data.clientDetails,
      taxSettings: data.taxSettings,
      invoiceSettings: data.invoiceSettings,
      bankDetails: data.bankDetails,
      notes: data.notes
    }),

  createConsolidatedInvoice: (data) =>
    api.post('/invoices/create-consolidated', {
      criteria: data.criteria,
      dealIds: data.dealIds,
      month: data.month,
      year: data.year,
      brandId: data.brandId,
      agencyId: data.agencyId,
      agencyDetails: data.agencyDetails,
      startDate: data.startDate,
      endDate: data.endDate,
      clientDetails: data.clientDetails,
      taxSettings: data.taxSettings,
      invoiceSettings: data.invoiceSettings,
      bankDetails: data.bankDetails
    }),

  // ============================================
  // DEAL MANAGEMENT
  // ============================================

  getAvailableDeals: (params = {}) =>
    api.get('/invoices/available-deals', { params: {
      criteria: params.criteria,
      month: params.month,
      year: params.year,
      brandId: params.brandId,
      agencyId: params.agencyId,
      startDate: params.startDate,
      endDate: params.endDate
    }}),

  // ============================================
  // INVOICE MANAGEMENT
  // ============================================

  getInvoicesList: (filters = {}) =>
    api.get('/invoices', { params: {
      page: filters.page || 1,
      limit: filters.limit || 20,
      status: filters.status,
      invoiceType: filters.invoiceType,
      dateRange: filters.dateRange,
      clientName: filters.clientName,
      sortBy: filters.sortBy || 'invoiceDate',
      sortOrder: filters.sortOrder || 'desc'
    }}),

  getInvoiceById: (invoiceId) =>
    api.get(`/invoices/${invoiceId}`),

  updateInvoice: (invoiceId, data) =>
    api.put(`/invoices/${invoiceId}`, {
      clientDetails: data.clientDetails,
      lineItems: data.lineItems,
      taxSettings: data.taxSettings,
      invoiceSettings: data.invoiceSettings,
      notes: data.notes,
      revisionNotes: data.revisionNotes
    }),

  deleteInvoice: (invoiceId) =>
    api.delete(`/invoices/${invoiceId}`),

  // ============================================
  // TAX MANAGEMENT
  // ============================================

  getTaxPreferences: () =>
    api.get('/invoices/tax-preferences'),

  updateTaxPreferences: (data) =>
    api.put('/invoices/tax-preferences', {
      applyGST: data.applyGST,
      gstRate: data.gstRate,
      gstType: data.gstType,
      gstExemptionReason: data.gstExemptionReason,
      applyTDS: data.applyTDS,
      tdsRate: data.tdsRate,
      entityType: data.entityType,
      hasGSTExemption: data.hasGSTExemption,
      exemptionCertificate: data.exemptionCertificate,
      exemptionValidUpto: data.exemptionValidUpto
    }),

  calculateTaxPreview: (data) =>
    api.post('/invoices/calculate-tax-preview', {
      lineItems: data.lineItems,
      taxSettings: data.taxSettings,
      discountSettings: data.discountSettings
    }),

  // ============================================
  // PAYMENT TRACKING
  // ============================================

  recordPayment: (invoiceId, paymentData) =>
    api.post(`/invoices/${invoiceId}/payments`, {
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      referenceNumber: paymentData.referenceNumber,
      payerName: paymentData.payerName,
      payerAccount: paymentData.payerAccount,
      bankReference: paymentData.bankReference,
      isVerified: paymentData.isVerified,
      verificationNotes: paymentData.verificationNotes,
      notes: paymentData.notes,
      milestoneInfo: paymentData.milestoneInfo
    }),

  getPaymentHistory: (invoiceId) =>
    api.get(`/invoices/${invoiceId}/payments`),

  verifyPayment: (paymentId, verificationNotes = '') =>
    api.put(`/invoices/payments/${paymentId}/verify`, {
      verificationNotes
    }),

  // ============================================
  // PDF GENERATION
  // ============================================

  generateInvoicePDF: (invoiceId, templateId = null) =>
    api.post(`/invoices/${invoiceId}/generate-pdf`, {
      templateId
    }),

  downloadInvoicePDF: (invoiceId) =>
    api.get(`/invoices/${invoiceId}/download-pdf`),

  // ============================================
  // ANALYTICS & DASHBOARD
  // ============================================

  getInvoiceAnalytics: (dateRange = {}) =>
    api.get('/invoices/analytics', { params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }}),

  getInvoiceDashboard: () =>
    api.get('/invoices/dashboard'),

  // ============================================
  // PAYMENT REMINDERS
  // ============================================

  schedulePaymentReminders: (invoiceId) =>
    api.post(`/invoices/${invoiceId}/schedule-reminders`),

  processDueReminders: () =>
    api.post('/invoices/process-reminders'),
};

// Export helper functions for common operations
export const invoiceHelpers = {
  // Check if user can create consolidated invoices
  canCreateConsolidatedInvoice: (subscription) => {
    return ['pro', 'elite'].includes(subscription);
  },

  // Check if user can use payment reminders
  canUsePaymentReminders: (subscription) => {
    return ['pro', 'elite'].includes(subscription);
  },

  // Format invoice status for display
  formatInvoiceStatus: (status) => {
    const statusMap = {
      'draft': 'Draft',
      'sent': 'Sent',
      'viewed': 'Viewed',
      'partially_paid': 'Partially Paid',
      'paid': 'Paid',
      'overdue': 'Overdue',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  },

  // Format payment method for display
  formatPaymentMethod: (method) => {
    const methodMap = {
      'bank_transfer': 'Bank Transfer',
      'upi': 'UPI',
      'cheque': 'Cheque',
      'cash': 'Cash',
      'online': 'Online Payment',
      'wallet': 'Wallet',
      'other': 'Other'
    };
    return methodMap[method] || method;
  },

  // Calculate payment percentage
  calculatePaymentProgress: (paidAmount, totalAmount) => {
    if (totalAmount === 0) return 0;
    return Math.round((paidAmount / totalAmount) * 100);
  }
};
import { api } from '../client';

export const invoicesAPI = {
  // Invoice creation
  createIndividualInvoice: (data) => 
    api.post('/invoices/create-individual', data),
  
  createConsolidatedInvoice: (data) => 
    api.post('/invoices/create-consolidated', data),
  
  // Available deals
  getAvailableDeals: (params) => 
    api.get('/invoices/available-deals', { params }),
  
  // Invoice CRUD
  getInvoices: (params = {}) => 
    api.get('/invoices', { params }),
  
  getInvoice: (invoiceId) => 
    api.get(`/invoices/${invoiceId}`),
  
  updateInvoice: (invoiceId, data) => 
    api.put(`/invoices/${invoiceId}`, data),
  
  deleteInvoice: (invoiceId) => 
    api.delete(`/invoices/${invoiceId}`),
  
  // Tax preferences
  getTaxPreferences: () => 
    api.get('/invoices/tax-preferences'),
  
  updateTaxPreferences: (data) => 
    api.put('/invoices/tax-preferences', data),
  
  calculateTaxPreview: (data) => 
    api.post('/invoices/calculate-tax-preview', data),
  
  // Payments
  recordPayment: (invoiceId, data) => 
    api.post(`/invoices/${invoiceId}/payments`, data),
  
  getPaymentHistory: (invoiceId) => 
    api.get(`/invoices/${invoiceId}/payments`),
  
  verifyPayment: (paymentId, data) => 
    api.put(`/invoices/payments/${paymentId}/verify`, data),
  
  // PDF operations
  generatePDF: (invoiceId) => 
    api.post(`/invoices/${invoiceId}/generate-pdf`),
  
  downloadPDF: (invoiceId) => 
    api.download(`/invoices/${invoiceId}/download-pdf`, `invoice-${invoiceId}.pdf`),
  
  // Reminders
  scheduleReminders: (invoiceId, data) => 
    api.post(`/invoices/${invoiceId}/schedule-reminders`, data),
  
  processReminders: () => 
    api.post('/invoices/process-reminders'),
  
  // Analytics
  getInvoiceAnalytics: (params) => 
    api.get('/invoices/analytics', { params }),
  
  getInvoiceDashboard: () => 
    api.get('/invoices/dashboard'),
};
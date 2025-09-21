/**
 * Invoice Store - Global state management for invoice operations
 *
 * This store manages:
 * - Invoice creation (individual/consolidated)
 * - Invoice list and filtering
 * - Tax preferences
 * - Payment tracking
 * - Analytics and dashboard data
 * - PDF generation
 *
 * File: src/store/invoiceStore.js
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { invoicesAPI, invoiceHelpers } from '../api/endpoints'
import toast from 'react-hot-toast'

const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_'

function transformPayload(input) {
  const {
    clientDetails: { taxInfo, ...clientRest },
    lineItems,
    taxSettings,
    invoiceSettings: { overallDiscount, ...invoiceRest },
    revisionNotes,
  } = input

  return {
    dealId: lineItems?.[0]?.dealId,
    clientDetails: { ...clientRest, ...taxInfo },
    taxSettings,
    invoiceSettings: {
      ...invoiceRest,
      discountType: overallDiscount?.type ?? 'percentage',
      discountValue: overallDiscount?.value ?? 0,
    },
    bankDetails: {}, // optional
    notes: revisionNotes,
  }
}

const useInvoiceStore = create(
  // persist(
  (set, get) => ({
    // ============================================
    // State
    // ============================================
    invoices: [],
    currentInvoice: null,
    availableDeals: [],
    taxPreferences: null,
    analytics: null,
    dashboard: null,
    filters: {
      page: 1,
      limit: 20,
      status: null,
      invoiceType: null,
      dateRange: null,
      clientName: null,
      sortBy: 'invoiceDate',
      sortOrder: 'desc',
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: false,
    isGeneratingPDF: false,
    isInitialized: false,

    // ============================================
    // Initialization
    // ============================================

    init: async () => {
      const state = get()

      // Prevent multiple initializations
      if (state.isInitialized) {
        return { success: true }
      }

      try {
        set({ isLoading: true })

        // Initialize tax preferences and dashboard data
        const results = await Promise.allSettled([
          get().fetchTaxPreferences(),
          get().fetchDashboard(),
        ])

        // Log any failures but don't fail the init
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const operation = index === 0 ? 'tax preferences' : 'dashboard'
            console.warn(`Failed to initialize ${operation}:`, result.reason)
          }
        })

        set({ isInitialized: true })
        return { success: true }
      } catch (error) {
        console.error('Invoice store initialization failed:', error)
        // Still mark as initialized to prevent retry loops
        set({ isInitialized: true })
        return { success: false, error }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Tax Preferences
    // ============================================

    fetchTaxPreferences: async () => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.getTaxPreferences()

        if (response.success) {
          set({ taxPreferences: response.data.taxPreferences })
          return { success: true }
        }

        return { success: false, message: response.message }
      } catch (error) {
        console.error('Failed to fetch tax preferences:', error)
        return { success: false }
      } finally {
        set({ isLoading: false })
      }
    },

    updateTaxPreferences: async (preferences) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.updateTaxPreferences(preferences)

        if (response.success) {
          set({ taxPreferences: preferences })
          toast.success('Tax preferences updated successfully')
          return { success: true }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update tax preferences'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Invoice Creation
    // ============================================

    createIndividualInvoice: async (invoiceData) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.createIndividualInvoice(invoiceData)

        if (response.success) {
          const invoice = response.data.invoice

          // Add to invoices list
          set((state) => ({
            invoices: [invoice, ...state.invoices],
          }))

          toast.success(`Invoice ${invoice.invoiceNumber} created successfully`)
          return { success: true, invoice }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create invoice'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    createConsolidatedInvoice: async (consolidationData) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.createConsolidatedInvoice(consolidationData)

        if (response.success) {
          const invoice = response.data.invoice

          // Add to invoices list
          set((state) => ({
            invoices: [invoice, ...state.invoices],
          }))

          toast.success(`Consolidated invoice ${invoice.invoiceNumber} created successfully`)
          return { success: true, invoice }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create consolidated invoice'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Deal Management
    // ============================================

    fetchAvailableDeals: async (params = {}) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.getAvailableDeals(params)

        if (response.success) {
          set({ availableDeals: response.data.deals })
          return {
            success: true,
            deals: response.data.deals,
            summary: response.data.summary,
          }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch available deals'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Invoice Management
    // ============================================

    fetchInvoices: async (customFilters = null) => {
      try {
        set({ isLoading: true })

        const filters = customFilters || get().filters
        const response = await invoicesAPI.getInvoicesList(filters)

        if (response.success) {
          const invoicesList = response.data.invoices

          const invoicesSummary = {
            monthlyAnalytics: {
              totalInvoices: invoicesList.length,

              revenueThisMonth: invoicesList
                .filter((item) => item.status === 'paid')
                .reduce(
                  (acc, item) => acc + (item?.taxSettings.taxCalculation.finalAmount || 0),
                  0
                ),

              collectionRate: (
                (invoicesList.filter((item) => item.status === 'paid').length /
                  invoicesList.length) *
                100
              ).toFixed(2),
            },
            pendingPayments: invoicesList.filter((item) => item.status !== 'paid'),
            overdueInvoices:
              invoicesList.filter((invoice) => invoice.status === 'overdue').length || 0,
          }

          set({
            invoices: invoicesList,
            pagination: response.data.pagination,
            dashboard: invoicesSummary,
          })
          return { success: true }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch invoices'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    fetchInvoiceById: async (invoiceId) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.getInvoiceById(invoiceId)

        if (response.success) {
          set({ currentInvoice: response.data.invoice })
          return {
            success: true,
            invoice: response.data.invoice,
            payments: response.data.payments,
          }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch invoice'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    updateInvoice: async (invoiceId, updateData) => {
      try {
        set({ isLoading: true })

        const response = await invoicesAPI.updateInvoice(invoiceId, updateData)

        if (response.success) {
          const updatedInvoice = response.data.invoice

          // Update in list
          set((state) => ({
            invoices: state.invoices.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv)),
            currentInvoice:
              state.currentInvoice?.id === invoiceId ? updatedInvoice : state.currentInvoice,
          }))

          toast.success('Invoice updated successfully')
          return { success: true, invoice: updatedInvoice }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update invoice'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    deleteInvoice: async (invoiceId) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.deleteInvoice(invoiceId)

        if (response.success) {
          // Remove from list
          set((state) => ({
            invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
            currentInvoice: state.currentInvoice?.id === invoiceId ? null : state.currentInvoice,
          }))

          toast.success('Invoice cancelled successfully')
          return { success: true }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete invoice'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Tax Calculations
    // ============================================

    calculateTaxPreview: async (calculationData) => {
      try {
        const response = await invoicesAPI.calculateTaxPreview(calculationData)

        if (response.success) {
          return { success: true, breakdown: response.data.breakdown }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to calculate tax'
        toast.error(message)
        return { success: false, message }
      }
    },

    // ============================================
    // Payment Management
    // ============================================

    recordPayment: async (invoiceId, paymentData) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.recordPayment(invoiceId, paymentData)

        if (response.success) {
          // Update current invoice if it matches
          if (get().currentInvoice?.id === invoiceId) {
            await get().fetchInvoiceById(invoiceId)
          }

          toast.success('Payment recorded successfully')
          return { success: true, payment: response.data.payment }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to record payment'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    fetchPaymentHistory: async (invoiceId) => {
      try {
        const response = await invoicesAPI.getPaymentHistory(invoiceId)

        if (response.success) {
          return { success: true, payments: response.data.payments }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch payment history'
        toast.error(message)
        return { success: false, message }
      }
    },

    verifyPayment: async (paymentId, notes) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.verifyPayment(paymentId, notes)

        if (response.success) {
          toast.success('Payment verified successfully')
          return { success: true, payment: response.data.payment }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to verify payment'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // PDF Generation
    // ============================================

    generateInvoicePDF: async (invoiceId, templateId = null) => {
      try {
        set({ isGeneratingPDF: true })
        const response = await invoicesAPI.generateInvoicePDF(invoiceId, templateId)

        if (response.success) {
          toast.success('Invoice PDF generated successfully')
          return {
            success: true,
            pdfUrl: response.data.pdfUrl,
            fileName: response.data.fileName,
          }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to generate PDF'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isGeneratingPDF: false })
      }
    },

    downloadInvoicePDF: async (invoiceId) => {
      try {
        const response = await invoicesAPI.downloadInvoicePDF(invoiceId)

        if (response.success) {
          // Open PDF in new tab
          window.open(response.data.downloadUrl, '_blank')
          return { success: true }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to download PDF'
        toast.error(message)
        return { success: false, message }
      }
    },

    // ============================================
    // Analytics & Dashboard
    // ============================================

    fetchAnalytics: async (dateRange = {}) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.getInvoiceAnalytics(dateRange)

        if (response.success) {
          set({ analytics: response.data.analytics })
          return { success: true, analytics: response.data.analytics }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch analytics'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    fetchDashboard: async () => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.getInvoiceDashboard()

        if (response.success) {
          set({ dashboard: response.data })
          return { success: true, dashboard: response.data }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch dashboard'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Payment Reminders
    // ============================================

    scheduleReminders: async (invoiceId) => {
      try {
        set({ isLoading: true })
        const response = await invoicesAPI.schedulePaymentReminders(invoiceId)

        if (response.success) {
          toast.success('Payment reminders scheduled successfully')
          return { success: true, reminders: response.data.reminders }
        }

        return { success: false, message: response.message }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to schedule reminders'
        toast.error(message)
        return { success: false, message }
      } finally {
        set({ isLoading: false })
      }
    },

    // ============================================
    // Filter & Pagination Management
    // ============================================

    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters, page: 1 },
      }))

      // Automatically fetch with new filters
      get().fetchInvoices()
    },

    setPage: (page) => {
      set((state) => ({
        filters: { ...state.filters, page },
      }))

      // Fetch new page
      get().fetchInvoices()
    },

    clearFilters: () => {
      set({
        filters: {
          page: 1,
          limit: 20,
          status: null,
          invoiceType: null,
          dateRange: null,
          clientName: null,
          sortBy: 'invoiceDate',
          sortOrder: 'desc',
        },
      })

      // Fetch with cleared filters
      get().fetchInvoices()
    },

    // ============================================
    // Utility Methods
    // ============================================

    clearCurrentInvoice: () => {
      set({ currentInvoice: null })
    },

    clearAvailableDeals: () => {
      set({ availableDeals: [] })
    },

    reset: () => {
      set({
        invoices: [],
        currentInvoice: null,
        availableDeals: [],
        analytics: null,
        dashboard: null,
        filters: {
          page: 1,
          limit: 20,
          status: null,
          invoiceType: null,
          dateRange: null,
          clientName: null,
          sortBy: 'invoiceDate',
          sortOrder: 'desc',
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        isLoading: false,
        isGeneratingPDF: false,
        isInitialized: false,
      })
    },
  })
  // {
  //   name: `${STORAGE_PREFIX}invoice-storage`,
  //   storage: createJSONStorage(() => localStorage),
  //   partialize: (state) => ({
  //     taxPreferences: state.taxPreferences,
  //     filters: state.filters,
  //   }),
  // }
  // )
)

export default useInvoiceStore

/**
 * Invoice Details Page
 * Complete invoice view with payment tracking and actions
 *
 * Features:
 * - Full invoice information display
 * - Payment status and history
 * - Quick actions (Download PDF, Edit, Send, Record Payment)
 * - Activity timeline
 * - Payment recording modal
 * - Tax breakdown visualization
 * - Deal references display
 *
 * Path: src/features/invoices/pages/InvoiceDetails.jsx
 */

import { invoiceHelpers } from '@/api/endpoints/invoices'
import useAuthStore from '@/store/authStore'
import useInvoiceStore from '@/store/invoiceStore'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building,
  Calculator,
  Check,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit2,
  FileText,
  Mail,
  Package,
  Printer,
  Receipt,
  Send,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDealsStore } from '../../../store'

const InvoiceDetails = () => {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  const { fetchInvoiceById, recordPayment, downloadInvoicePDF, scheduleReminders } =
    useInvoiceStore()
  const { updateStage } = useDealsStore()

  // State
  const [invoice, setInvoice] = useState(null)
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    transactionId: '',
    referenceNumber: '',
    payerName: '',
    notes: '',
  })

  // Load invoice data
  useEffect(() => {
    loadInvoiceData()

    // Check if we need to open payment modal from navigation
    if (location.hash === '#payment') {
      setShowPaymentModal(true)
    }
  }, [invoiceId])

  const loadInvoiceData = async () => {
    setIsLoading(true)
    try {
      const result = await fetchInvoiceById(invoiceId)
      if (result.success) {
        setInvoice(result.invoice)
        setPayments(result.payments || [])

        // Set initial payment amount
        const remainingAmount = calculateRemainingAmount(result.invoice, result.payments)
        setPaymentForm((prev) => ({ ...prev, amount: remainingAmount }))
      } else {
        toast.error('Invoice not found')
        navigate('/invoices')
      }
    } catch (error) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate remaining amount
  const calculateRemainingAmount = (inv, pmts) => {
    const totalAmount = inv?.taxSettings?.taxCalculation?.finalAmount || inv?.amount || 0
    const paidAmount = pmts.reduce((sum, p) => sum + (p.amount || 0), 0)
    return Math.max(0, totalAmount - paidAmount)
  }

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await downloadInvoicePDF(invoiceId)
    } catch (error) {
      toast.error('Failed to download PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Handle payment recording
  const handleRecordPayment = async () => {
    if (!paymentForm.amount || paymentForm.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      const result = await recordPayment(invoiceId, paymentForm)
      if (result.success) {
        toast.success('Payment recorded successfully')

        // Update Deals Status
        const results = await Promise.all(
          invoice?.dealReferences?.dealIds?.map((item) => updateStage(item._id, 'paid'))
        )

        console.log(results)

        setShowPaymentModal(false)
        loadInvoiceData()
      }
    } catch (error) {
      toast.error('Failed to record payment')
    }
  }

  // Handle send invoice
  const handleSendInvoice = async () => {
    // This would integrate with email service
    toast.success('Invoice sent successfully')
  }

  // Handle schedule reminders
  const handleScheduleReminders = async () => {
    try {
      const result = await scheduleReminders(invoiceId)
      if (result.success) {
        toast.success('Payment reminders scheduled')
      }
    } catch (error) {
      toast.error('Failed to schedule reminders')
    }
  }

  // Copy invoice number
  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoice?.invoiceNumber || '')
    toast.success('Invoice number copied')
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Get status config
  const getStatusConfig = (status) => {
    const configs = {
      draft: { bg: '#f1f5f9', color: '#64748b', icon: FileText, label: 'Draft' },
      sent: { bg: '#dbeafe', color: '#2563eb', icon: Send, label: 'Sent' },
      viewed: { bg: '#e0f2fe', color: '#0ea5e9', icon: Mail, label: 'Viewed' },
      partially_paid: {
        bg: '#fed7aa',
        color: '#ea580c',
        icon: CreditCard,
        label: 'Partially Paid',
      },
      paid: { bg: '#bbf7d0', color: '#16a34a', icon: CheckCircle, label: 'Paid' },
      overdue: { bg: '#fecaca', color: '#dc2626', icon: AlertTriangle, label: 'Overdue' },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', icon: X, label: 'Cancelled' },
    }
    return configs[status] || configs.draft
  }

  // Calculate payment progress
  const calculatePaymentProgress = () => {
    if (!invoice) return 0
    const total = invoice.taxSettings?.taxCalculation?.finalAmount || invoice.amount || 0
    const paid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    return total > 0 ? Math.min(100, (paid / total) * 100) : 0
  }

  // Styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      flexShrink: 0,
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.25rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    backButton: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    invoiceNumber: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 1rem',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    headerActions: {
      display: 'flex',
      gap: '0.625rem',
      alignItems: 'center',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)',
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      color: '#475569',
      border: '2px solid #e2e8f0',
    },
    successButton: {
      backgroundColor: '#10b981',
      color: '#ffffff',
    },
    tabs: {
      display: 'flex',
      gap: '0.25rem',
      padding: '0 1.5rem',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
    },
    tab: {
      padding: '1rem 1.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    activeTab: {
      color: '#6366f1',
      borderBottomColor: '#6366f1',
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '1rem 1.25rem',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cardContent: {
      padding: '1.25rem',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f8fafc',
    },
    detailLabel: {
      fontSize: '0.8125rem',
      color: '#64748b',
      fontWeight: '500',
    },
    detailValue: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#334155',
      textAlign: 'right',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: '1px solid #e2e8f0',
    },
    tableCell: {
      padding: '0.875rem',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem',
    },
    paymentProgress: {
      marginTop: '1rem',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '0.5rem',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      borderRadius: '4px',
      transition: 'width 0.3s',
    },
    progressText: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '0.5rem',
      fontSize: '0.8125rem',
      color: '#64748b',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    modalHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#0f172a',
    },
    modalBody: {
      padding: '1.5rem',
    },
    modalFooter: {
      padding: '1.5rem',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.625rem',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.375rem',
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s',
    },
    select: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
    },
    timeline: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    timelineItem: {
      display: 'flex',
      gap: '1rem',
      position: 'relative',
    },
    timelineIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    timelineContent: {
      flex: 1,
      paddingBottom: '1rem',
    },
    timelineTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.25rem',
    },
    timelineDate: {
      fontSize: '0.75rem',
      color: '#94a3b8',
    },
    emptyState: {
      padding: '2rem',
      textAlign: 'center',
      color: '#94a3b8',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      gap: '1rem',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <span style={{ color: '#64748b' }}>Loading invoice...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <AlertCircle size={48} color="#cbd5e1" />
          <h3 style={{ marginTop: '1rem' }}>Invoice not found</h3>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(invoice.status)
  const StatusIcon = statusConfig.icon
  const paymentProgress = calculatePaymentProgress()
  const remainingAmount = calculateRemainingAmount(invoice, payments)
  const taxCalc = invoice.taxSettings?.taxCalculation || {}

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={() => navigate('/invoices')}>
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 style={styles.invoiceNumber}>{invoice.invoiceNumber}</h1>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Created on {formatDate(invoice.createdAt)}
              </div>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
              }}
            >
              <StatusIcon size={16} />
              {statusConfig.label}
            </div>
          </div>

          <div style={styles.headerActions}>
            {invoice.status === 'draft' && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => navigate(`/invoices/${invoiceId}/edit`)}
              >
                <Edit2 size={16} />
                Edit
              </button>
            )}

            {/* <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              <Download size={16} />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button> */}

            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <>
                {/* <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleSendInvoice}
                >
                  <Send size={16} />
                  Send Invoice
                </button> */}

                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard size={16} />
                  Record Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'payments' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('payments')}
        >
          Payments ({payments.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'activity' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && (
          <div style={styles.grid}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Client Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Building size={18} />
                    Client Information
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Name</span>
                    <span style={styles.detailValue}>
                      {invoice.clientDetails?.name || invoice.clientName || 'N/A'}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Email</span>
                    <span style={styles.detailValue}>{invoice.clientDetails?.email || 'N/A'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Phone</span>
                    <span style={styles.detailValue}>{invoice.clientDetails?.phone || 'N/A'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>GST Number</span>
                    <span style={styles.detailValue}>
                      {invoice.clientDetails?.gstNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Package size={18} />
                    Line Items
                  </div>
                </div>
                <div style={{ ...styles.cardContent, padding: 0 }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Description</th>
                        <th style={styles.tableHeader}>Qty</th>
                        <th style={styles.tableHeader}>Rate</th>
                        <th style={styles.tableHeader}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems?.map((item, index) => (
                        <tr key={index}>
                          <td style={styles.tableCell}>{item.description}</td>
                          <td style={styles.tableCell}>{item.quantity}</td>
                          <td style={styles.tableCell}>{formatCurrency(item.rate)}</td>
                          <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Calculator size={18} />
                    Tax Breakdown
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Subtotal</span>
                    <span style={styles.detailValue}>{formatCurrency(taxCalc.subtotal)}</span>
                  </div>

                  {taxCalc.totalDiscount > 0 && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Discount</span>
                      <span style={{ ...styles.detailValue, color: '#ef4444' }}>
                        -{formatCurrency(taxCalc.totalDiscount)}
                      </span>
                    </div>
                  )}

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Taxable Amount</span>
                    <span style={styles.detailValue}>{formatCurrency(taxCalc.taxableAmount)}</span>
                  </div>

                  {invoice.taxSettings?.gstSettings?.applyGST && (
                    <>
                      {taxCalc.cgstAmount > 0 && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>CGST (9%)</span>
                          <span style={styles.detailValue}>
                            {formatCurrency(taxCalc.cgstAmount)}
                          </span>
                        </div>
                      )}
                      {taxCalc.sgstAmount > 0 && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>SGST (9%)</span>
                          <span style={styles.detailValue}>
                            {formatCurrency(taxCalc.sgstAmount)}
                          </span>
                        </div>
                      )}
                      {taxCalc.igstAmount > 0 && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>IGST (18%)</span>
                          <span style={styles.detailValue}>
                            {formatCurrency(taxCalc.igstAmount)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {invoice.taxSettings?.tdsSettings?.applyTDS && taxCalc.tdsAmount > 0 && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>
                        TDS ({invoice.taxSettings.tdsSettings.tdsRate}%)
                      </span>
                      <span style={{ ...styles.detailValue, color: '#ef4444' }}>
                        -{formatCurrency(taxCalc.tdsAmount)}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      ...styles.detailRow,
                      borderBottom: 'none',
                      paddingTop: '1rem',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                    }}
                  >
                    <span>Total Amount</span>
                    <span style={{ color: '#059669' }}>{formatCurrency(taxCalc.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Payment Status */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <DollarSign size={18} />
                    Payment Status
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Total Amount</span>
                    <span style={styles.detailValue}>{formatCurrency(taxCalc.finalAmount)}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Paid Amount</span>
                    <span style={{ ...styles.detailValue, color: '#10b981' }}>
                      {formatCurrency(taxCalc.finalAmount - remainingAmount)}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Remaining</span>
                    <span
                      style={{
                        ...styles.detailValue,
                        color: remainingAmount > 0 ? '#ef4444' : '#10b981',
                      }}
                    >
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>

                  <div style={styles.paymentProgress}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${paymentProgress}%` }} />
                    </div>
                    <div style={styles.progressText}>
                      <span>{Math.round(paymentProgress)}% Paid</span>
                      <span>{payments.length} Payments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <FileText size={18} />
                    Invoice Details
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Invoice Date</span>
                    <span style={styles.detailValue}>
                      {formatDate(invoice.invoiceSettings?.invoiceDate)}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Due Date</span>
                    <span style={styles.detailValue}>
                      {formatDate(invoice.invoiceSettings?.dueDate)}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Payment Terms</span>
                    <span style={styles.detailValue}>
                      {invoice.invoiceSettings?.paymentTerms || 30} days
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Type</span>
                    <span style={styles.detailValue}>
                      {invoice.invoiceType === 'consolidated' ? 'Consolidated' : 'Individual'}
                    </span>
                  </div>
                  {invoice.dealReferences?.dealsSummary && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Deals</span>
                      <span style={styles.detailValue}>
                        {invoice.dealReferences.dealsSummary.totalDeals}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Activity size={18} />
                    Quick Actions
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton,
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '0.625rem',
                    }}
                    onClick={copyInvoiceNumber}
                  >
                    <Copy size={16} />
                    Copy Invoice Number
                  </button>

                  <button
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton,
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '0.625rem',
                    }}
                    onClick={handleScheduleReminders}
                    disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
                  >
                    <Clock size={16} />
                    Schedule Reminders
                  </button>

                  <button
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton,
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    onClick={() => window.print()}
                  >
                    <Printer size={16} />
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <CreditCard size={18} />
                  Payment History
                </div>
              </div>
              <div style={{ ...styles.cardContent, padding: 0 }}>
                {payments.length === 0 ? (
                  <div style={styles.emptyState}>
                    <Receipt size={32} color="#cbd5e1" />
                    <p>No payments recorded yet</p>
                  </div>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Payment ID</th>
                        <th style={styles.tableHeader}>Date</th>
                        <th style={styles.tableHeader}>Amount</th>
                        <th style={styles.tableHeader}>Method</th>
                        <th style={styles.tableHeader}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td style={styles.tableCell}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                              {payment.paymentId}
                            </span>
                          </td>
                          <td style={styles.tableCell}>{formatDate(payment.paymentDate)}</td>
                          <td style={{ ...styles.tableCell, fontWeight: '600', color: '#059669' }}>
                            {formatCurrency(payment.amount)}
                          </td>
                          <td style={styles.tableCell}>
                            {invoiceHelpers.formatPaymentMethod(payment.paymentMethod)}
                          </td>
                          <td style={styles.tableCell}>
                            {payment.isVerified ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#10b981',
                                  fontSize: '0.8125rem',
                                  fontWeight: '600',
                                }}
                              >
                                <CheckCircle size={14} />
                                Verified
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#f59e0b',
                                  fontSize: '0.8125rem',
                                  fontWeight: '600',
                                }}
                              >
                                <Clock size={14} />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Activity size={18} />
                  Activity Timeline
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.timeline}>
                  <div style={styles.timelineItem}>
                    <div
                      style={{
                        ...styles.timelineIcon,
                        backgroundColor: '#f0f9ff',
                        color: '#0284c7',
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineTitle}>Invoice Created</div>
                      <div style={styles.timelineDate}>{formatDate(invoice.createdAt)}</div>
                    </div>
                  </div>

                  {invoice.status !== 'draft' && (
                    <div style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineIcon,
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                        }}
                      >
                        <Send size={16} />
                      </div>
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineTitle}>Invoice Sent</div>
                        <div style={styles.timelineDate}>
                          {formatDate(invoice.metadata?.emailSent?.sentAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {payments.map((payment, index) => (
                    <div key={payment.id} style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineIcon,
                          backgroundColor: '#dcfce7',
                          color: '#22c55e',
                        }}
                      >
                        <CreditCard size={16} />
                      </div>
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineTitle}>
                          Payment Received - {formatCurrency(payment.amount)}
                        </div>
                        <div style={styles.timelineDate}>{formatDate(payment.paymentDate)}</div>
                      </div>
                    </div>
                  ))}

                  {invoice.status === 'paid' && (
                    <div style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineIcon,
                          backgroundColor: '#bbf7d0',
                          color: '#16a34a',
                        }}
                      >
                        <CheckCircle size={16} />
                      </div>
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineTitle}>Invoice Paid in Full</div>
                        <div style={styles.timelineDate}>{formatDate(invoice.updatedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Record Payment</h2>
              <X
                size={24}
                style={{ cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowPaymentModal(false)}
              />
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Amount *</label>
                <input
                  type="number"
                  style={styles.input}
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter amount"
                  max={remainingAmount}
                />
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Remaining: {formatCurrency(remainingAmount)}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Date *</label>
                <input
                  type="date"
                  style={styles.input}
                  value={paymentForm.paymentDate}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paymentDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Method *</label>
                <select
                  style={styles.select}
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online Payment</option>
                  <option value="wallet">Wallet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transaction ID</label>
                <input
                  type="text"
                  style={styles.input}
                  value={paymentForm.transactionId}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      transactionId: e.target.value,
                    }))
                  }
                  placeholder="Enter transaction ID"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  style={styles.textarea}
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Add any notes..."
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.successButton }}
                onClick={handleRecordPayment}
              >
                <Check size={16} />
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input:focus, select:focus, textarea:focus {
          border-color: #6366f1;
          outline: none;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default InvoiceDetails

/**
 * Create Invoice Page
 * Interface for creating individual or consolidated invoices
 *
 * Features:
 * - Toggle between Individual/Consolidated invoice types
 * - Deal selection (single or multiple based on type)
 * - Client details form with auto-fill from deals
 * - Line items management with auto-calculation
 * - Tax settings with GST/TDS configuration
 * - Real-time tax calculation preview
 * - Bank details management
 * - Save as draft or send immediately
 *
 * Path: src/features/invoices/pages/CreateInvoice.jsx
 */

import { dealsAPI } from '@/api/endpoints/deals' // Import dealsAPI
import { invoiceHelpers } from '@/api/endpoints/invoices'
import useAuthStore from '@/store/authStore'
import useDataStore from '@/store/dataStore' // Import dataStore
import useInvoiceStore from '@/store/invoiceStore'
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calculator,
  CreditCard,
  FileText,
  IndianRupee,
  Info,
  List,
  Package,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DealSelectorModal from '../components/DealSelectorModal'
import { useDealsStore } from '../../../store'

const CreateInvoice = () => {
  const navigate = useNavigate()
  const { user, subscription } = useAuthStore()

  const {
    taxPreferences,
    fetchTaxPreferences,
    createIndividualInvoice,
    createConsolidatedInvoice,
    calculateTaxPreview,
  } = useInvoiceStore()

  // Use dataStore for deals
  const { deals: dealsState, fetchDeals } = useDealsStore()

  // State Management
  const [invoiceType, setInvoiceType] = useState('individual')
  const [consolidationCriteria, setConsolidationCriteria] = useState('custom_selection')
  const [selectedDeals, setSelectedDeals] = useState([])
  const [showDealSelector, setShowDealSelector] = useState(false)
  const [dealSearchTerm, setDealSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [allDeals, setAllDeals] = useState([]) // Local state for deals
  const [validationErrors, setValidationErrors] = useState({})

  // Form State - Updated with all required fields
  const [formData, setFormData] = useState({
    // Client Details
    clientDetails: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: 'Not provided', // Default value to avoid validation error
        city: 'Not provided',
        state: 'Not provided',
        pincode: '000000',
        country: 'India',
      },
      gstNumber: 'N/A', // Default value
      panNumber: 'N/A', // Default value
      isInterstate: false,
      clientType: 'brand',
    },

    // Line Items
    lineItems: [],

    // Tax Settings
    taxSettings: {
      applyGST: true,
      gstRate: 18,
      gstType: 'cgst_sgst',
      gstExemptionReason: '',
      applyTDS: false,
      tdsRate: 10,
      entityType: 'individual',
    },

    // Invoice Settings
    invoiceSettings: {
      currency: 'INR',
      paymentTerms: 30,
      discountType: 'percentage',
      discountValue: 0,
      notes: 'Thank you for your business!', // Default value
      termsAndConditions:
        'Payment due within specified payment terms. Late payments may incur additional charges.', // Default value
    },

    // Bank Details
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branchName: '',
      upiId: 'N/A', // Default value
    },
  })

  // Date range for consolidated invoices
  const [dateRange, setDateRange] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
  })

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Auto-populate client details from selected deals
  useEffect(() => {
    if (selectedDeals.length > 0) {
      populateClientDetails()
      generateLineItems()
    }
  }, [selectedDeals, allDeals])

  // Load initial preferences and data
  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // Load tax preferences
      const prefs = await fetchTaxPreferences()
      if (prefs.success && taxPreferences) {
        console.log('Loaded tax preferences:', taxPreferences)
        setFormData((prev) => ({
          ...prev,
          taxSettings: {
            ...prev.taxSettings,
            ...taxPreferences,
          },
        }))
      }

      // Load user's bank details if available
      if (user?.creatorProfile?.bankDetails) {
        const bankDetails = user.creatorProfile.bankDetails
        setFormData((prev) => ({
          ...prev,
          bankDetails: {
            accountName: bankDetails.accountName || '',
            accountNumber: bankDetails.accountNumber || '',
            bankName: bankDetails.bankName || '',
            ifscCode: bankDetails.ifscCode || '',
            branchName: bankDetails.branchName || '',
            upiId: bankDetails.upiId || '',
          },
        }))
      } else {
        // Set default bank details if none available
        setFormData((prev) => ({
          ...prev,
          bankDetails: {
            accountName: user?.name || 'Account Holder',
            accountNumber: 'Please update bank details',
            bankName: 'Please update bank details',
            ifscCode: 'Please update',
            branchName: 'Please update',
            upiId: 'N/A',
          },
        }))
      }

      // Load initial deals
      await loadAvailableDeals()
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('Failed to load initial data')
    } finally {
      setIsLoading(false)
    }
  }

  // Load available deals - FIXED to use proper API
  const loadAvailableDeals = async () => {
    try {
      console.log('Loading deals using dataStore...')

      // ToAsk Why? What is DataStore
      // Try to use the dataStore first
      // const result = await fetchDeals()

      if (dealsState.list) {
        console.log('Deals from dataStore:', dealsState.list)

        // Map the deals data to match component expectations
        const mappedDeals = dealsState.list.map((deal) => ({
          // Original fields for the modal
          _id: deal._id,
          title: deal.title,
          dealId: deal.dealId,
          brand: deal.brand,
          platform: deal.platform,
          dealValue: deal.dealValue,
          timeline: deal.timeline,
          status: deal.status,
          stage: deal.stage,
          deliverables: deal.deliverables,

          // Mapped fields for backward compatibility
          id: deal._id,
          brandName: deal.brand?.name || 'Unknown Brand',
          value: deal.dealValue?.amount || 0,
          deliverablesLength: deal?.deliverables?.length || 1,
        }))

        console.log('Mapped deals:', mappedDeals)
        setAllDeals(mappedDeals)
        return
      }

      // Fallback to direct API call if dataStore fails
      console.log('Fallback: Using direct API call...')
      const response = await dealsAPI.getDeals()

      if (response.success && response.data?.deals) {
        const mappedDeals = response.data.deals.map((deal) => ({
          // Original fields for the modal
          _id: deal._id,
          title: deal.title,
          dealId: deal.dealId,
          brand: deal.brand,
          platform: deal.platform,
          dealValue: deal.dealValue,
          timeline: deal.timeline,
          status: deal.status,
          stage: deal.stage,
          deliverables: deal.deliverables,

          // Mapped fields for backward compatibility
          id: deal._id,
          brandName: deal.brand?.name || 'Unknown Brand',
          value: deal.dealValue?.amount || 0,
          deliverablesLength: deal.deliverables?.length || 1,
        }))

        console.log('Mapped deals from API:', mappedDeals)
        setAllDeals(mappedDeals)
      } else {
        console.error('Invalid response format:', response)
        toast.error('No deals found')
      }
    } catch (error) {
      console.error('Failed to load deals:', error)
      toast.error('Failed to load available deals')
    }
  }

  // Updated populate client details function
  const populateClientDetails = () => {
    if (selectedDeals.length === 0) return

    console.log('Populating client details for deals:', selectedDeals)
    console.log('Available deals:', allDeals)

    // Find the first deal using both possible ID formats
    const firstDeal = allDeals.find(
      (d) => selectedDeals.includes(d._id) || selectedDeals.includes(d.id)
    )

    if (!firstDeal) {
      console.error('Deal not found in availableDeals:', selectedDeals[0])
      return
    }

    console.log('Found first deal:', firstDeal)

    // Check if all deals are from same brand
    const sameBrand = selectedDeals.every((dealId) => {
      const deal = allDeals.find((d) => d._id === dealId || d.id === dealId)
      return deal?.brandName === firstDeal.brandName
    })

    if (sameBrand || selectedDeals.length === 1) {
      setFormData((prev) => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          name: firstDeal.brandName || '',
          clientType: 'brand',
        },
      }))
    } else {
      // Multiple brands - use consolidated name
      const uniqueBrands = [
        ...new Set(
          selectedDeals
            .map((id) => {
              const deal = allDeals.find((d) => d._id === id || d.id === id)
              return deal?.brandName
            })
            .filter(Boolean)
        ),
      ]

      setFormData((prev) => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          name: `Multiple Brands (${uniqueBrands.length})`,
          clientType: 'multiple_brands',
        },
      }))
    }
  }

  // Updated generate line items function
  const generateLineItems = () => {
    const items = []

    selectedDeals.forEach((dealId) => {
      const deal = allDeals.find((d) => d._id === dealId || d.id === dealId)
      if (!deal) {
        console.error('Deal not found for line item generation:', dealId)
        return
      }

      items.push({
        id: `item-${Date.now()}-${Math.random()}`,
        dealId: deal._id || deal.id,
        description: `${deal.platform || 'Content'} - ${deal.brandName}`,
        itemType: 'content_creation',
        platform: deal.platform,
        quantity: deal.deliverables || 1,
        rate: deal.value || 0,
        amount: deal.value || 0,
        hsnCode: '998314',
      })
    })

    console.log('Generated line items:', items)
    setFormData((prev) => ({
      ...prev,
      lineItems: items,
    }))
  }

  // Add manual line item
  const addLineItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      itemType: 'content_creation',
      quantity: 1,
      rate: 0,
      amount: 0,
      hsnCode: '998314',
    }

    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  // Update line item
  const updateLineItem = (itemId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }

          // Recalculate amount
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }

          return updated
        }
        return item
      }),
    }))
  }

  // Remove line item
  const removeLineItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== itemId),
    }))
  }

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0)

    let discountAmount = 0
    if (formData.invoiceSettings.discountValue > 0) {
      if (formData.invoiceSettings.discountType === 'percentage') {
        discountAmount = subtotal * (formData.invoiceSettings.discountValue / 100)
      } else {
        discountAmount = formData.invoiceSettings.discountValue
      }
    }

    const taxableAmount = subtotal - discountAmount
    let finalAmount = taxableAmount

    // Add GST
    if (formData.taxSettings.applyGST) {
      const gstAmount = taxableAmount * (formData.taxSettings.gstRate / 100)
      finalAmount += gstAmount
    }

    // Deduct TDS
    if (formData.taxSettings.applyTDS) {
      const tdsAmount = finalAmount * (formData.taxSettings.tdsRate / 100)
      finalAmount -= tdsAmount
    }

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      finalAmount,
    }
  }

  // Handle tax toggle with debugging
  const handleGSTToggle = (checked) => {
    console.log('GST Toggle clicked:', checked)
    setFormData((prev) => {
      const updated = { ...prev, taxSettings: { ...prev.taxSettings, applyGST: checked } }
      console.log('Updated formData after GST toggle:', updated)
      return updated
    })
  }

  const handleTDSToggle = (checked) => {
    console.log('TDS Toggle clicked:', checked)
    setFormData((prev) => {
      const updated = { ...prev, taxSettings: { ...prev.taxSettings, applyTDS: checked } }
      console.log('Updated formData after TDS toggle:', updated)
      return updated
    })
  }

  // Handle tax preview
  const handleTaxPreview = async () => {
    try {
      const result = await calculateTaxPreview({
        lineItems: formData.lineItems,
        taxSettings: {
          gstSettings: {
            applyGST: formData.taxSettings.applyGST,
            gstRate: formData.taxSettings.gstRate,
            gstType: formData.taxSettings.gstType,
          },
          tdsSettings: {
            applyTDS: formData.taxSettings.applyTDS,
            tdsRate: formData.taxSettings.tdsRate,
          },
        },
        discountSettings: {
          type: formData.invoiceSettings.discountType,
          value: formData.invoiceSettings.discountValue,
        },
      })
    } catch (error) {
      console.error('Tax preview error:', error)
      toast.error('Failed to calculate tax preview')
    }
  }

  // Handle deal selection from modal
  const handleDealSelection = (dealIds) => {
    console.log('Selected deals from modal:', dealIds)
    setSelectedDeals(dealIds)
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {}

    // Basic validations
    if (formData.lineItems.length === 0) {
      errors.lineItems = 'Please add at least one line item'
    }

    if (!formData.clientDetails.name) {
      errors.clientName = 'Please enter client name'
    }

    // Bank details validation
    if (
      !formData.bankDetails.accountName ||
      formData.bankDetails.accountName === 'Account Holder'
    ) {
      errors.bankDetails = 'Please update your bank details in profile settings'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (sendNow = false) => {
    // Validate form
    if (!validateForm()) {
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError)
      return
    }

    setIsSaving(true)
    try {
      // Prepare the payload with proper structure
      const payload = {
        dealId: selectedDeals[0],
        clientDetails: formData.clientDetails,
        taxSettings: formData.taxSettings,
        invoiceSettings: formData.invoiceSettings,
        bankDetails: formData.bankDetails,
        notes: formData.invoiceSettings.notes, // Add notes field at root level
      }

      console.log('Submitting payload:', payload)

      let result

      if (invoiceType === 'individual') {
        result = await createIndividualInvoice(payload)
      } else {
        result = await createConsolidatedInvoice({
          criteria: consolidationCriteria,
          dealIds: selectedDeals,
          month: dateRange.month,
          year: dateRange.year,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          ...payload,
        })
      }

      if (result.success) {
        toast.success('Invoice created successfully')
        navigate(`/invoices/${result.invoice.id}`)
      } else {
        console.error('Invoice creation failed:', result.error)
        if (result.error && result.error.errors) {
          // Handle validation errors
          const errorMessage = result.error.errors.map((err) => err.message).join(', ')
          toast.error(`Validation failed: ${errorMessage}`)
        } else {
          toast.error(result.error || 'Failed to create invoice')
        }
      }
    } catch (error) {
      console.error('Invoice creation error:', error)
      toast.error('Failed to create invoice')
    } finally {
      setIsSaving(false)
    }
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

  // Check if can create consolidated
  const canCreateConsolidated =
    invoiceHelpers?.canCreateConsolidatedInvoice?.(subscription?.tier) ?? false

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
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
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
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      position: 'sticky',
      top: 0,
      alignSelf: 'flex-start',
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
    typeToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.625rem',
      padding: '0.25rem',
    },
    typeButton: {
      flex: 1,
      padding: '0.625rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    typeButtonActive: {
      backgroundColor: '#ffffff',
      color: '#6366f1',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1rem',
    },
    label: {
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#475569',
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
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    dealSelector: {
      border: '2px dashed #e2e8f0',
      borderRadius: '0.625rem',
      padding: '1.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    dealSelectorActive: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff',
    },
    selectedDeals: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    dealChip: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 0.75rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
    },
    lineItemTable: {
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
      padding: '0.75rem',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem',
    },
    addItemButton: {
      width: '100%',
      padding: '0.75rem',
      border: '2px dashed #e2e8f0',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#6366f1',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '0.75rem',
      transition: 'all 0.2s',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.625rem 0',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem',
    },
    summaryLabel: {
      color: '#64748b',
    },
    summaryValue: {
      fontWeight: '600',
      color: '#334155',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.875rem 0',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0f172a',
    },
    taxToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
      cursor: 'pointer',
    },
    switchContainer: {
      position: 'relative',
      width: '44px',
      height: '24px',
    },
    switch: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    switchSlider: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#cbd5e1',
      borderRadius: '12px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
    },
    switchSliderActive: {
      backgroundColor: '#6366f1',
    },
    switchThumb: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    switchThumbActive: {
      transform: 'translateX(20px)',
    },
    infoBox: {
      padding: '0.875rem',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      color: '#1e40af',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.625rem',
    },
    warningBox: {
      padding: '0.875rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      color: '#92400e',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.625rem',
      marginBottom: '1rem',
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#64748b',
    },
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
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

  const totals = calculateTotals()

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={() => navigate('/invoices')}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={styles.title}>Create Invoice</h1>
          </div>

          <div style={styles.headerActions}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
            >
              <Send size={16} />
              Create & Send
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.mainGrid}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Invoice Type Selection */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <FileText size={18} />
                  Invoice Type
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.typeToggle}>
                  <button
                    style={{
                      ...styles.typeButton,
                      ...(invoiceType === 'individual' ? styles.typeButtonActive : {}),
                    }}
                    onClick={() => setInvoiceType('individual')}
                  >
                    Individual
                  </button>
                  {canCreateConsolidated && (
                    <button
                      style={{
                        ...styles.typeButton,
                        ...(invoiceType === 'consolidated' ? styles.typeButtonActive : {}),
                      }}
                      onClick={() => setInvoiceType('consolidated')}
                    >
                      Consolidated
                    </button>
                  )}
                </div>

                {invoiceType === 'consolidated' && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={styles.label}>Consolidation Criteria</label>
                    <select
                      style={styles.select}
                      value={consolidationCriteria}
                      onChange={(e) => setConsolidationCriteria(e.target.value)}
                    >
                      <option value="custom_selection">Custom Selection</option>
                      <option value="monthly">Monthly</option>
                      <option value="brand_wise">Brand Wise</option>
                      <option value="date_range">Date Range</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Selection */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Package size={18} />
                  Select Deals
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {selectedDeals.length} selected
                </span>
              </div>
              <div style={styles.cardContent}>
                <div
                  style={{
                    ...styles.dealSelector,
                    ...(selectedDeals.length > 0 ? styles.dealSelectorActive : {}),
                  }}
                  onClick={() => setShowDealSelector(true)}
                >
                  <Package size={24} color={selectedDeals.length > 0 ? '#6366f1' : '#94a3b8'} />
                  <p
                    style={{
                      margin: '0.5rem 0 0',
                      color: selectedDeals.length > 0 ? '#6366f1' : '#64748b',
                      fontWeight: selectedDeals.length > 0 ? '600' : '400',
                    }}
                  >
                    {selectedDeals.length > 0
                      ? `${selectedDeals.length} deal${selectedDeals.length > 1 ? 's' : ''} selected`
                      : `Click to select ${invoiceType === 'individual' ? 'a deal' : 'deals'}`}
                  </p>
                </div>

                {selectedDeals.length > 0 && (
                  <div style={styles.selectedDeals}>
                    {selectedDeals.map((dealId) => {
                      const deal = allDeals.find((d) => d._id === dealId || d.id === dealId)
                      if (!deal) return null

                      return (
                        <div key={dealId} style={styles.dealChip}>
                          <span>
                            {deal.brandName} - {formatCurrency(deal.value)}
                          </span>
                          <X
                            size={16}
                            style={{ cursor: 'pointer', color: '#94a3b8' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedDeals((prev) => prev.filter((id) => id !== dealId))
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Client Details */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Building size={18} />
                  Client Details
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Client Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.clientDetails.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientDetails: { ...prev.clientDetails, name: e.target.value },
                      }))
                    }
                    placeholder="Enter client name"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={formData.clientDetails.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: { ...prev.clientDetails, email: e.target.value },
                        }))
                      }
                      placeholder="client@example.com"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.clientDetails.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: { ...prev.clientDetails, phone: e.target.value },
                        }))
                      }
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>GST Number (Optional)</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.clientDetails.gstNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: {
                            ...prev.clientDetails,
                            gstNumber: e.target.value || 'N/A',
                          },
                        }))
                      }
                      placeholder="29ABCDE1234F1Z5"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>PAN Number (Optional)</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.clientDetails.panNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: {
                            ...prev.clientDetails,
                            panNumber: e.target.value || 'N/A',
                          },
                        }))
                      }
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Address (Optional)</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.clientDetails.address.street}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientDetails: {
                          ...prev.clientDetails,
                          address: {
                            ...prev.clientDetails.address,
                            street: e.target.value || 'Not provided',
                          },
                        },
                      }))
                    }
                    placeholder="Street address"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>City</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.clientDetails.address.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: {
                            ...prev.clientDetails,
                            address: {
                              ...prev.clientDetails.address,
                              city: e.target.value || 'Not provided',
                            },
                          },
                        }))
                      }
                      placeholder="City"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>State</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.clientDetails.address.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientDetails: {
                            ...prev.clientDetails,
                            address: {
                              ...prev.clientDetails.address,
                              state: e.target.value || 'Not provided',
                            },
                          },
                        }))
                      }
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <List size={18} />
                  Line Items
                </div>
              </div>
              <div style={styles.cardContent}>
                <table style={styles.lineItemTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Description</th>
                      <th style={styles.tableHeader}>Qty</th>
                      <th style={styles.tableHeader}>Rate</th>
                      <th style={styles.tableHeader}>Amount</th>
                      <th style={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '80px' }}>
                          <input
                            type="number"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                            }
                            min="1"
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '120px' }}>
                          <input
                            type="number"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.rate}
                            onChange={(e) =>
                              updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)
                            }
                            min="0"
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '120px', fontWeight: '600' }}>
                          {formatCurrency(item.amount)}
                        </td>
                        <td style={{ ...styles.tableCell, width: '40px' }}>
                          <Trash2
                            size={16}
                            style={{ cursor: 'pointer', color: '#ef4444' }}
                            onClick={() => removeLineItem(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button style={styles.addItemButton} onClick={addLineItem}>
                  <Plus size={16} />
                  Add Line Item
                </button>
              </div>
            </div>

            {/* Bank Details */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <CreditCard size={18} />
                  Bank Details
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Account Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.bankDetails.accountName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, accountName: e.target.value },
                      }))
                    }
                    placeholder="Account holder name"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Account Number *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, accountNumber: e.target.value },
                        }))
                      }
                      placeholder="Account number"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>IFSC Code *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.bankDetails.ifscCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, ifscCode: e.target.value },
                        }))
                      }
                      placeholder="IFSC code"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bank Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, bankName: e.target.value },
                        }))
                      }
                      placeholder="Bank name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Branch Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.bankDetails.branchName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, branchName: e.target.value },
                        }))
                      }
                      placeholder="Branch name"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>UPI ID (Optional)</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.bankDetails.upiId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, upiId: e.target.value || 'N/A' },
                      }))
                    }
                    placeholder="your-upi@bank"
                  />
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <FileText size={18} />
                  Notes & Terms
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Invoice Notes</label>
                  <textarea
                    style={styles.textarea}
                    value={formData.invoiceSettings.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoiceSettings: { ...prev.invoiceSettings, notes: e.target.value },
                      }))
                    }
                    placeholder="Additional notes for this invoice"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Terms & Conditions</label>
                  <textarea
                    style={styles.textarea}
                    value={formData.invoiceSettings.termsAndConditions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoiceSettings: {
                          ...prev.invoiceSettings,
                          termsAndConditions: e.target.value,
                        },
                      }))
                    }
                    placeholder="Payment terms and conditions"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* Validation Warning */}
            {validationErrors.bankDetails && (
              <div style={styles.warningBox}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Bank Details Required:</strong>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    Please update your bank details in your profile settings before creating an
                    invoice.
                  </p>
                </div>
              </div>
            )}

            {/* Tax Settings */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Settings size={18} />
                  Tax Settings
                </div>
              </div>
              <div style={styles.cardContent}>
                {/* GST Toggle */}
                <div
                  style={styles.taxToggle}
                  onClick={() => handleGSTToggle(!formData.taxSettings.applyGST)}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Apply GST</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {formData.taxSettings.gstRate}% GST
                    </div>
                  </div>
                  <div style={styles.switchContainer}>
                    <input
                      type="checkbox"
                      style={styles.switch}
                      checked={formData.taxSettings.applyGST}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleGSTToggle(e.target.checked)
                      }}
                    />
                    <div
                      style={{
                        ...styles.switchSlider,
                        backgroundColor: formData.taxSettings.applyGST ? '#6366f1' : '#cbd5e1',
                      }}
                    >
                      <div
                        style={{
                          ...styles.switchThumb,
                          transform: formData.taxSettings.applyGST
                            ? 'translateX(20px)'
                            : 'translateX(0px)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* TDS Toggle */}
                <div
                  style={styles.taxToggle}
                  onClick={() => handleTDSToggle(!formData.taxSettings.applyTDS)}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Apply TDS</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {formData.taxSettings.tdsRate}% TDS
                    </div>
                  </div>
                  <div style={styles.switchContainer}>
                    <input
                      type="checkbox"
                      style={styles.switch}
                      checked={formData.taxSettings.applyTDS}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleTDSToggle(e.target.checked)
                      }}
                    />
                    <div
                      style={{
                        ...styles.switchSlider,
                        backgroundColor: formData.taxSettings.applyTDS ? '#6366f1' : '#cbd5e1',
                      }}
                    >
                      <div
                        style={{
                          ...styles.switchThumb,
                          transform: formData.taxSettings.applyTDS
                            ? 'translateX(20px)'
                            : 'translateX(0px)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={handleTaxPreview}
                >
                  <Calculator size={16} />
                  Calculate Tax Preview
                </button>
              </div>
            </div>

            {/* Summary */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <IndianRupee size={18} />
                  Invoice Summary
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal</span>
                  <span style={styles.summaryValue}>{formatCurrency(totals.subtotal)}</span>
                </div>

                {totals.discountAmount > 0 && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Discount</span>
                    <span style={{ ...styles.summaryValue, color: '#ef4444' }}>
                      -{formatCurrency(totals.discountAmount)}
                    </span>
                  </div>
                )}

                {formData.taxSettings.applyGST && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>GST ({formData.taxSettings.gstRate}%)</span>
                    <span style={styles.summaryValue}>
                      +{formatCurrency((totals.taxableAmount * formData.taxSettings.gstRate) / 100)}
                    </span>
                  </div>
                )}

                {formData.taxSettings.applyTDS && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>TDS ({formData.taxSettings.tdsRate}%)</span>
                    <span style={{ ...styles.summaryValue, color: '#ef4444' }}>
                      -{formatCurrency((totals.finalAmount * formData.taxSettings.tdsRate) / 100)}
                    </span>
                  </div>
                )}

                <div style={styles.totalRow}>
                  <span>Total Amount</span>
                  <span style={{ color: '#059669' }}>{formatCurrency(totals.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div style={styles.infoBox}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Quick Tips:</strong>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                  <li>GST is applied on the taxable amount after discount</li>
                  <li>TDS is deducted from the final amount after GST</li>
                  <li>All amounts are in INR</li>
                  <li>Update bank details in profile for proper invoices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Selector Modal */}
      {showDealSelector && (
        <DealSelectorModal
          isOpen={showDealSelector}
          onClose={() => setShowDealSelector(false)}
          deals={allDeals}
          selectedDeals={selectedDeals}
          onSelectDeals={handleDealSelection}
          invoiceType={invoiceType}
          searchTerm={dealSearchTerm}
          onSearchChange={setDealSearchTerm}
        />
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

export default CreateInvoice

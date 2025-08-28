/**
 * Consolidated Invoice Wizard Page
 * Multi-step wizard for creating consolidated invoices
 * 
 * Features:
 * - Step 1: Select consolidation criteria (monthly/brand-wise/custom)
 * - Step 2: Choose deals to consolidate
 * - Step 3: Review and edit grouped items
 * - Step 4: Finalize tax and payment settings
 * - Real API integration only - NO MOCK DATA
 * 
 * Path: src/features/invoices/pages/ConsolidatedInvoiceWizard.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Building,
  Package,
  Settings,
  FileText,
  IndianRupee,
  AlertCircle,
  Info,
  ChevronRight,
  Filter,
  Search,
  X,
  Plus,
  Edit2,
  Save,
  Send,
  Loader,
  CheckCircle,
  Clock,
  Users,
  Grid3X3
} from 'lucide-react';
import { invoicesAPI, invoiceHelpers } from '@/api/endpoints/invoices';
import useInvoiceStore from '@/store/invoiceStore';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

const ConsolidatedInvoiceWizard = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuthStore();
  
  const {
    availableDeals,
    taxPreferences,
    fetchAvailableDeals,
    fetchTaxPreferences,
    createConsolidatedInvoice,
    calculateTaxPreview
  } = useInvoiceStore();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Consolidation Criteria
  const [consolidationCriteria, setConsolidationCriteria] = useState({
    type: 'monthly', // monthly, brand_wise, custom_selection, date_range
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    brandFilter: ''
  });

  // Step 2: Deal Selection
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [dealSearchTerm, setDealSearchTerm] = useState('');
  const [dealFilter, setDealFilter] = useState({
    platform: '',
    status: '',
    minAmount: '',
    maxAmount: ''
  });

  // Step 3: Review & Group
  const [groupedItems, setGroupedItems] = useState([]);
  const [consolidatedDetails, setConsolidatedDetails] = useState({
    clientDetails: {
      name: '',
      email: '',
      phone: '',
      address: {},
      gstNumber: '',
      panNumber: ''
    },
    invoiceTitle: '',
    description: ''
  });

  // Step 4: Tax & Payment
  const [taxSettings, setTaxSettings] = useState({
    applyGST: true,
    gstRate: 18,
    gstType: 'cgst_sgst',
    applyTDS: false,
    tdsRate: 10,
    entityType: 'individual'
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    paymentTerms: 30,
    notes: '',
    termsAndConditions: '',
    bankDetails: {}
  });

  const [taxPreview, setTaxPreview] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load deals when criteria changes
  useEffect(() => {
    if (currentStep === 2) {
      loadAvailableDeals();
    }
  }, [currentStep, consolidationCriteria]);

  // Group deals when selection changes
  useEffect(() => {
    if (selectedDeals.length > 0) {
      groupDeals();
    }
  }, [selectedDeals]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Load tax preferences
      const taxResult = await fetchTaxPreferences();
      if (taxResult.success && taxPreferences) {
        setTaxSettings(prev => ({
          ...prev,
          ...taxPreferences
        }));
      }

      // Load user's bank details
      if (user?.creatorProfile?.bankDetails) {
        setInvoiceSettings(prev => ({
          ...prev,
          bankDetails: user.creatorProfile.bankDetails
        }));
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableDeals = async () => {
    setIsLoading(true);
    try {
      const params = {
        criteria: consolidationCriteria.type
      };

      if (consolidationCriteria.type === 'monthly') {
        params.month = consolidationCriteria.month;
        params.year = consolidationCriteria.year;
      } else if (consolidationCriteria.type === 'date_range') {
        params.startDate = consolidationCriteria.startDate;
        params.endDate = consolidationCriteria.endDate;
      } else if (consolidationCriteria.type === 'brand_wise' && consolidationCriteria.brandFilter) {
        params.brandId = consolidationCriteria.brandFilter;
      }

      // Apply additional filters if set
      if (dealFilter.platform) params.platform = dealFilter.platform;
      if (dealFilter.status) params.status = dealFilter.status;
      if (dealFilter.minAmount) params.minAmount = dealFilter.minAmount;
      if (dealFilter.maxAmount) params.maxAmount = dealFilter.maxAmount;

      await fetchAvailableDeals(params);
    } catch (error) {
      toast.error('Failed to load available deals');
    } finally {
      setIsLoading(false);
    }
  };

  const groupDeals = () => {
    if (!availableDeals || availableDeals.length === 0) return;

    // Group selected deals by brand or platform
    const groups = {};
    selectedDeals.forEach(dealId => {
      const deal = availableDeals.find(d => d.id === dealId || d._id === dealId);
      if (!deal) return;

      const groupKey = consolidationCriteria.type === 'brand_wise' 
        ? deal.brandName || deal.brand?.name || 'Unknown'
        : deal.platform || 'General';

      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: groupKey,
          deals: [],
          totalAmount: 0,
          description: ''
        };
      }

      groups[groupKey].deals.push(deal);
      groups[groupKey].totalAmount += deal.dealValue?.finalAmount || deal.value || 0;
    });

    setGroupedItems(Object.values(groups));

    // Auto-populate client details if same brand
    const uniqueBrands = [...new Set(selectedDeals.map(id => {
      const deal = availableDeals.find(d => d.id === id || d._id === id);
      return deal?.brandName || deal?.brand?.name;
    }).filter(Boolean))];

    if (uniqueBrands.length === 1) {
      const firstDeal = availableDeals.find(d => selectedDeals.includes(d.id || d._id));
      setConsolidatedDetails(prev => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          name: firstDeal?.brandName || firstDeal?.brand?.name || '',
          email: firstDeal?.brand?.email || '',
          phone: firstDeal?.brand?.phone || ''
        },
        invoiceTitle: `Consolidated Invoice - ${uniqueBrands[0]}`
      }));
    } else {
      setConsolidatedDetails(prev => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          name: `Multiple Brands (${uniqueBrands.length})`
        },
        invoiceTitle: 'Consolidated Invoice - Multiple Brands'
      }));
    }
  };

  const calculateTotalAmount = () => {
    if (!availableDeals || selectedDeals.length === 0) return 0;
    
    return selectedDeals.reduce((total, dealId) => {
      const deal = availableDeals.find(d => d.id === dealId || d._id === dealId);
      return total + (deal?.dealValue?.finalAmount || deal?.value || 0);
    }, 0);
  };

  const handleTaxPreview = async () => {
    if (selectedDeals.length === 0) return;

    try {
      const lineItems = groupedItems.flatMap(group => 
        group.deals.map(deal => ({
          description: `${deal.platform || 'Content'} - ${deal.brandName || deal.brand?.name}`,
          quantity: deal.deliverables?.length || 1,
          rate: deal.dealValue?.amount || deal.value || 0,
          amount: deal.dealValue?.finalAmount || deal.value || 0
        }))
      );

      const result = await calculateTaxPreview({
        lineItems,
        taxSettings: {
          gstSettings: {
            applyGST: taxSettings.applyGST,
            gstRate: taxSettings.gstRate,
            gstType: taxSettings.gstType
          },
          tdsSettings: {
            applyTDS: taxSettings.applyTDS,
            tdsRate: taxSettings.tdsRate
          }
        }
      });

      if (result.success) {
        setTaxPreview(result.breakdown);
      }
    } catch (error) {
      toast.error('Failed to calculate tax preview');
    }
  };

  const handleSubmit = async (sendNow = false) => {
    if (selectedDeals.length === 0) {
      toast.error('Please select at least one deal');
      return;
    }

    if (!consolidatedDetails.clientDetails.name) {
      toast.error('Please enter client details');
      return;
    }

    setIsSaving(true);
    try {
      const result = await createConsolidatedInvoice({
        criteria: consolidationCriteria.type,
        dealIds: selectedDeals,
        month: consolidationCriteria.month,
        year: consolidationCriteria.year,
        startDate: consolidationCriteria.startDate,
        endDate: consolidationCriteria.endDate,
        clientDetails: consolidatedDetails.clientDetails,
        taxSettings,
        invoiceSettings,
        metadata: {
          invoiceTitle: consolidatedDetails.invoiceTitle,
          description: consolidatedDetails.description,
          groupedItems
        }
      });

      if (result.success) {
        toast.success('Consolidated invoice created successfully');
        navigate(`/invoices/${result.invoice.id}`);
      }
    } catch (error) {
      toast.error('Failed to create consolidated invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        if (consolidationCriteria.type === 'date_range') {
          return consolidationCriteria.startDate && consolidationCriteria.endDate;
        }
        return true;
      case 2:
        return selectedDeals.length > 0;
      case 3:
        return consolidatedDetails.clientDetails.name && groupedItems.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Criteria', icon: Filter },
    { number: 2, title: 'Select Deals', icon: Package },
    { number: 3, title: 'Review & Group', icon: Grid3X3 },
    { number: 4, title: 'Finalize', icon: Settings }
  ];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      flexShrink: 0
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
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
      cursor: 'pointer'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    steps: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    stepNumber: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    stepNumberActive: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
    },
    stepNumberComplete: {
      backgroundColor: '#10b981',
      color: '#ffffff'
    },
    stepNumberInactive: {
      backgroundColor: '#e2e8f0',
      color: '#94a3b8'
    },
    stepTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#64748b',
      transition: 'all 0.2s'
    },
    stepTitleActive: {
      color: '#0f172a'
    },
    stepConnector: {
      width: '40px',
      height: '2px',
      backgroundColor: '#e2e8f0',
      transition: 'all 0.2s'
    },
    stepConnectorComplete: {
      backgroundColor: '#10b981'
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto'
    },
    wizardContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginBottom: '1.25rem'
    },
    cardHeader: {
      padding: '1.125rem 1.25rem',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardContent: {
      padding: '1.25rem'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    radioGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    radioCard: {
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.625rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    radioCardActive: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff'
    },
    dealGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem'
    },
    dealCard: {
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dealCardSelected: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff'
    },
    footer: {
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
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
      border: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff'
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      color: '#475569',
      border: '2px solid #e2e8f0'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={() => navigate('/invoices')}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={styles.title}>Create Consolidated Invoice</h1>
          </div>
        </div>

        <div style={styles.steps}>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div style={styles.step}>
                <div style={{
                  ...styles.stepNumber,
                  ...(currentStep === step.number ? styles.stepNumberActive :
                     currentStep > step.number ? styles.stepNumberComplete :
                     styles.stepNumberInactive)
                }}>
                  {currentStep > step.number ? <Check size={16} /> : step.number}
                </div>
                <span style={{
                  ...styles.stepTitle,
                  ...(currentStep === step.number ? styles.stepTitleActive : {})
                }}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  ...styles.stepConnector,
                  ...(currentStep > step.number ? styles.stepConnectorComplete : {})
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.wizardContent}>
          {/* Step 1: Consolidation Criteria */}
          {currentStep === 1 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Filter size={18} />
                  Select Consolidation Criteria
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.radioGroup}>
                  <div
                    style={{
                      ...styles.radioCard,
                      ...(consolidationCriteria.type === 'monthly' ? styles.radioCardActive : {})
                    }}
                    onClick={() => setConsolidationCriteria(prev => ({ ...prev, type: 'monthly' }))}
                  >
                    <Calendar size={20} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: '600' }}>Monthly</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Consolidate all deals from a specific month
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.radioCard,
                      ...(consolidationCriteria.type === 'brand_wise' ? styles.radioCardActive : {})
                    }}
                    onClick={() => setConsolidationCriteria(prev => ({ ...prev, type: 'brand_wise' }))}
                  >
                    <Building size={20} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: '600' }}>Brand Wise</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Group deals by brand
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.radioCard,
                      ...(consolidationCriteria.type === 'custom_selection' ? styles.radioCardActive : {})
                    }}
                    onClick={() => setConsolidationCriteria(prev => ({ ...prev, type: 'custom_selection' }))}
                  >
                    <Package size={20} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: '600' }}>Custom Selection</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Manually select specific deals
                    </div>
                  </div>
                </div>

                {consolidationCriteria.type === 'monthly' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Month</label>
                      <select
                        style={styles.select}
                        value={consolidationCriteria.month}
                        onChange={(e) => setConsolidationCriteria(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Year</label>
                      <select
                        style={styles.select}
                        value={consolidationCriteria.year}
                        onChange={(e) => setConsolidationCriteria(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      >
                        {[2023, 2024, 2025].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Deals */}
          {currentStep === 2 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Package size={18} />
                  Select Deals ({selectedDeals.length} selected)
                </div>
              </div>
              <div style={styles.cardContent}>
                {isLoading ? (
                  <div style={styles.loading}>
                    <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : availableDeals && availableDeals.length > 0 ? (
                  <div style={styles.dealGrid}>
                    {availableDeals.map(deal => {
                      const isSelected = selectedDeals.includes(deal.id || deal._id);
                      return (
                        <div
                          key={deal.id || deal._id}
                          style={{
                            ...styles.dealCard,
                            ...(isSelected ? styles.dealCardSelected : {})
                          }}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDeals(prev => prev.filter(id => id !== (deal.id || deal._id)));
                            } else {
                              setSelectedDeals(prev => [...prev, deal.id || deal._id]);
                            }
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>{deal.brandName || deal.brand?.name}</span>
                            {isSelected && <CheckCircle size={16} color="#6366f1" />}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            {deal.platform} • {formatDate(deal.createdAt)}
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#059669' }}>
                            {formatCurrency(deal.dealValue?.finalAmount || deal.value || 0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    <Package size={48} style={{ marginBottom: '1rem' }} />
                    <p>No deals available for the selected criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review & Group */}
          {currentStep === 3 && (
            <>
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
                      value={consolidatedDetails.clientDetails.name}
                      onChange={(e) => setConsolidatedDetails(prev => ({
                        ...prev,
                        clientDetails: { ...prev.clientDetails, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email</label>
                      <input
                        type="email"
                        style={styles.input}
                        value={consolidatedDetails.clientDetails.email}
                        onChange={(e) => setConsolidatedDetails(prev => ({
                          ...prev,
                          clientDetails: { ...prev.clientDetails, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Phone</label>
                      <input
                        type="tel"
                        style={styles.input}
                        value={consolidatedDetails.clientDetails.phone}
                        onChange={(e) => setConsolidatedDetails(prev => ({
                          ...prev,
                          clientDetails: { ...prev.clientDetails, phone: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Grid3X3 size={18} />
                    Grouped Items
                  </div>
                </div>
                <div style={styles.cardContent}>
                  {groupedItems.map((group, index) => (
                    <div key={index} style={{
                      padding: '0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{group.name}</span>
                        <span style={{ fontWeight: '700', color: '#059669' }}>
                          {formatCurrency(group.totalAmount)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        {group.deals.length} deals
                      </div>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '1.125rem',
                    fontWeight: '700'
                  }}>
                    <span>Total Amount</span>
                    <span style={{ color: '#059669' }}>{formatCurrency(calculateTotalAmount())}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Tax & Payment Settings */}
          {currentStep === 4 && (
            <>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Settings size={18} />
                    Tax Settings
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Apply GST</label>
                      <select
                        style={styles.select}
                        value={taxSettings.applyGST ? 'yes' : 'no'}
                        onChange={(e) => setTaxSettings(prev => ({ ...prev, applyGST: e.target.value === 'yes' }))}
                      >
                        <option value="yes">Yes - {taxSettings.gstRate}%</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Apply TDS</label>
                      <select
                        style={styles.select}
                        value={taxSettings.applyTDS ? 'yes' : 'no'}
                        onChange={(e) => setTaxSettings(prev => ({ ...prev, applyTDS: e.target.value === 'yes' }))}
                      >
                        <option value="yes">Yes - {taxSettings.tdsRate}%</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  {taxPreview && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Tax Preview</div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                          <span>Subtotal:</span>
                          <span>{formatCurrency(taxPreview.subtotal)}</span>
                        </div>
                        {taxPreview.gstAmount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                            <span>GST:</span>
                            <span>{formatCurrency(taxPreview.gstAmount)}</span>
                          </div>
                        )}
                        {taxPreview.tdsAmount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                            <span>TDS:</span>
                            <span>-{formatCurrency(taxPreview.tdsAmount)}</span>
                          </div>
                        )}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          padding: '0.5rem 0 0',
                          borderTop: '1px solid #e2e8f0',
                          fontWeight: '700'
                        }}>
                          <span>Final Amount:</span>
                          <span style={{ color: '#059669' }}>{formatCurrency(taxPreview.finalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton,
                      marginTop: '1rem',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    onClick={handleTaxPreview}
                  >
                    Calculate Tax Preview
                  </button>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>
                    <Info size={18} />
                    Summary
                  </div>
                </div>
                <div style={styles.cardContent}>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>Client:</span>
                      <span style={{ float: 'right', fontWeight: '600' }}>
                        {consolidatedDetails.clientDetails.name}
                      </span>
                    </div>
                    <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>Total Deals:</span>
                      <span style={{ float: 'right', fontWeight: '600' }}>{selectedDeals.length}</span>
                    </div>
                    <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>Groups:</span>
                      <span style={{ float: 'right', fontWeight: '600' }}>{groupedItems.length}</span>
                    </div>
                    <div style={{ padding: '0.75rem 0', fontSize: '1rem', fontWeight: '700' }}>
                      <span>Total Amount:</span>
                      <span style={{ float: 'right', color: '#059669' }}>
                        {formatCurrency(calculateTotalAmount())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : navigate('/invoices')}
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          {currentStep < 4 ? (
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
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
                Create Invoice
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConsolidatedInvoiceWizard;
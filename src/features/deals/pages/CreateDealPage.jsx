/**
 * Create Deal Page - New Deal Form
 * Path: src/features/deals/pages/CreateDealPage.jsx
 * 
 * FIXED VERSION with proper data structure and pricing preview
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Instagram,
  Youtube,
  FileText,
  Hash,
  Package,
  CreditCard,
  AlertCircle,
  Check,
  Upload,
  Link,
  Clock,
  ChevronDown,
  Share2,
  Calculator,
  Info
} from 'lucide-react';
import useDealsStore from '../../../store/dealsStore';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-hot-toast';

const CreateDealPage = () => {
  const navigate = useNavigate();
  const { createDeal, creating, stages } = useDealsStore();
  const { user } = useAuthStore();
  
  // Form steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form data - UPDATED with platform field
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    title: '',
    brandName: '',
    brandWebsite: '',
    platform: 'instagram',
    stage: 'pitched', // Changed from 'lead' to match backend
    value: '',
    currency: 'INR',
    
    // Step 2 - Contact Details
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactDesignation: '',
    brandInstagram: '',
    brandCategory: '',
    
    // Step 3 - Deliverables & Timeline
    deliverables: [
      { type: 'instagram_post', quantity: 1, description: 'Content creation', deadline: '' }
    ],
    campaignStartDate: '',
    campaignEndDate: '',
    deadline: '',
    brief: '',
    notes: '',
    
    // Step 4 - Payment & Terms
    paymentTerms: '50_50', // Changed to valid option
    paymentMethod: 'bank_transfer',
    gstApplicable: true,
    gstNumber: '',
    tdsApplicable: false, // Added TDS field
    advancePercentage: 0,
    milestones: [],
    contractRequired: true,
    exclusivityRequired: false,
    usageRights: 'limited',
    
    // Additional
    tags: [],
    priority: 'medium',
    attachments: []
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Auto-save draft
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Platform options
  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'twitter', label: 'Twitter/X', icon: Hash },
    { value: 'linkedin', label: 'LinkedIn', icon: Link },
    { value: 'multiple', label: 'Multiple Platforms', icon: Share2 }
  ];
  
  // Deliverable types
  const deliverableTypes = [
    { value: 'instagram_post', label: 'Instagram Post', icon: Instagram },
    { value: 'instagram_reel', label: 'Instagram Reel', icon: Instagram },
    { value: 'instagram_story', label: 'Instagram Story', icon: Instagram },
    { value: 'youtube_video', label: 'YouTube Video', icon: Youtube },
    { value: 'youtube_short', label: 'YouTube Short', icon: Youtube },
    { value: 'blog_post', label: 'Blog Post', icon: FileText },
    { value: 'twitter_post', label: 'Tweet/X Post', icon: Hash },
    { value: 'linkedin_post', label: 'LinkedIn Post', icon: Link },
    { value: 'other', label: 'Custom', icon: Package }
  ];
  
  // Payment terms options - FIXED to match backend validation
  const paymentTermsOptions = [
    { value: 'full_advance', label: '100% Advance' },
    { value: '50_50', label: '50% Advance, 50% on Completion' },
    { value: '30_70', label: '30% Advance, 70% on Completion' },
    { value: 'on_delivery', label: '100% on Delivery' },
    { value: 'net_30', label: 'Net 30 Days' },
    { value: 'net_15', label: 'Net 15 Days' },
    { value: 'custom', label: 'Custom Terms' }
  ];
  
  // Calculate pricing with GST and TDS
  const calculatePricing = () => {
    const baseAmount = parseFloat(formData.value) || 0;
    
    // GST calculation (18%)
    const gstAmount = formData.gstApplicable ? baseAmount * 0.18 : 0;
    const amountWithGST = baseAmount + gstAmount;
    
    // TDS calculation (10% on base amount for individuals, 2% for companies)
    // Using 10% for individual creators
    const tdsAmount = formData.tdsApplicable ? baseAmount * 0.10 : 0;
    
    // Final amount creator receives
    const finalAmount = amountWithGST - tdsAmount;
    
    return {
      baseAmount,
      gstAmount,
      amountWithGST,
      tdsAmount,
      finalAmount
    };
  };
  
  // Fix website URL by adding https:// if missing
  const fixWebsiteUrl = (url) => {
    if (!url) return '';
    if (url.match(/^https?:\/\//)) return url;
    return `https://${url}`;
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle deliverable change
  const handleDeliverableChange = (index, field, value) => {
    const updatedDeliverables = [...formData.deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      deliverables: updatedDeliverables
    }));
  };
  
  // Add deliverable
  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { type: 'instagram_post', quantity: 1, description: 'Content creation', deadline: '' }
      ]
    }));
  };
  
  // Remove deliverable
  const removeDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title?.trim()) {
          newErrors.title = 'Deal title is required';
        }
        if (!formData.brandName?.trim()) {
          newErrors.brandName = 'Brand name is required';
        }
        if (!formData.value || formData.value <= 0) {
          newErrors.value = 'Valid deal value is required';
        }
        if (!formData.platform) {
          newErrors.platform = 'Platform is required';
        }
        break;
        
      case 2:
        if (!formData.contactName?.trim()) {
          newErrors.contactName = 'Contact name is required';
        }
        if (!formData.contactEmail?.trim()) {
          newErrors.contactEmail = 'Contact email is required';
        }
        if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
          newErrors.contactEmail = 'Invalid email format';
        }
        break;
        
      case 3:
        if (!formData.deliverables || formData.deliverables.length === 0) {
          newErrors.deliverables = 'At least one deliverable is required';
        } else {
          formData.deliverables.forEach((d, index) => {
            if (!d.type || !d.quantity || d.quantity < 1) {
              newErrors[`deliverable_${index}`] = 'Type and quantity are required';
            }
          });
        }
        if (!formData.deadline) {
          newErrors.deadline = 'Deadline is required';
        }
        break;
        
      case 4:
        // Payment validation - removed GST number requirement
        break;
    }
    
    // Show errors as toasts
    Object.entries(newErrors).forEach(([field, message]) => {
      if (!field.startsWith('deliverable_')) {
        toast.error(message);
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      // Format deliverables properly for backend
      const formattedDeliverables = formData.deliverables.map(d => ({
        type: d.type,
        quantity: parseInt(d.quantity) || 1,
        description: d.description || 'Content creation',
        // Fix: Only set deadline if it exists, otherwise use formData.deadline or omit
        ...(d.deadline || formData.deadline ? {
          deadline: new Date(d.deadline || formData.deadline).toISOString()
        } : {}),
        status: 'pending'
      }));
      
      // Calculate payment due date (30 days from deadline if not set)
      const paymentDueDate = formData.deadline 
        ? new Date(new Date(formData.deadline).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
      
      // Prepare data for API with CORRECT STRUCTURE
      const dealData = {
        // Basic Info
        title: formData.title.trim(),
        
        // Brand as object structure
        brand: {
          name: formData.brandName.trim(),
          contactPerson: {
            name: formData.contactName || '',
            email: formData.contactEmail || '',
            phone: formData.contactPhone || '',
            designation: formData.contactDesignation || ''
          },
          website: fixWebsiteUrl(formData.brandWebsite),
          industry: formData.brandCategory || 'other',
          companySize: 'startup'
        },
        
        // DealValue as object structure
        dealValue: {
          amount: parseFloat(formData.value) || 0,
          currency: formData.currency || 'INR',
          paymentTerms: formData.paymentTerms || '50_50',
          customPaymentTerms: formData.paymentTerms === 'custom' ? formData.customPaymentTerms : '',
          gstApplicable: Boolean(formData.gstApplicable),
          tdsApplicable: Boolean(formData.tdsApplicable)
        },
        
        platform: formData.platform,
        stage: 'pitched',
        
        // Timeline as object with proper dates - handle nulls properly
        timeline: {
          responseDeadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          contentDeadline: formData.campaignEndDate ? new Date(formData.campaignEndDate).toISOString() : null,
          goLiveDate: formData.campaignStartDate ? new Date(formData.campaignStartDate).toISOString() : null,
          paymentDueDate: paymentDueDate
        },
        
        // Deliverables
        deliverables: formattedDeliverables,
        
        // Campaign requirements
        campaignRequirements: {
          brief: formData.brief || ''
        },
        
        // Other fields
        source: 'direct_outreach',
        priority: formData.priority || 'medium',
        tags: formData.tags || [],
        internalNotes: formData.notes || ''
      };
      
      console.log('Submitting deal data:', dealData);
      
      // Create deal through store
      const newDeal = await createDeal(dealData);
      
      // Clear draft from localStorage on success
      localStorage.removeItem('deal_draft');
      
      toast.success('Deal created successfully!');
      navigate(`/deals/${newDeal.id || newDeal._id}`);
      
    } catch (error) {
      console.error('Error creating deal:', error);
      // Error handling is done in the store
    }
  };
  
  // Auto-save draft
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.brandName) {
        setSaving(true);
        localStorage.setItem('deal_draft', JSON.stringify(formData));
        setLastSaved(new Date());
        setSaving(false);
      }
    }, 2000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [formData]);
  
  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('deal_draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      // Ensure platform field exists in loaded draft
      if (!parsed.platform) {
        parsed.platform = 'instagram';
      }
      // Ensure deliverables have descriptions
      if (parsed.deliverables) {
        parsed.deliverables = parsed.deliverables.map(d => ({
          ...d,
          description: d.description || 'Content creation'
        }));
      }
      setFormData(parsed);
      toast.success('Draft loaded from previous session');
    }
  }, []);
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#475569',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    saveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    progressBar: {
      maxWidth: '1200px',
      margin: '0 auto 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    },
    progressLine: {
      position: 'absolute',
      top: '20px',
      left: '10%',
      right: '10%',
      height: '2px',
      backgroundColor: '#e2e8f0',
      zIndex: 0
    },
    progressLineFilled: {
      position: 'absolute',
      top: '20px',
      left: '10%',
      height: '2px',
      backgroundColor: '#6366f1',
      transition: 'width 0.3s ease',
      zIndex: 1
    },
    progressStep: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',
      zIndex: 2
    },
    progressCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#94a3b8',
      transition: 'all 0.3s ease'
    },
    progressCircleActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      color: '#ffffff'
    },
    progressCircleCompleted: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: '#ffffff'
    },
    progressLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: '500'
    },
    formContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    stepTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #e2e8f0'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    formGroupFull: {
      gridColumn: '1 / -1'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    required: {
      color: '#ef4444'
    },
    input: {
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      width: '100%'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    textarea: {
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      width: '100%',
      minHeight: '100px',
      resize: 'vertical'
    },
    select: {
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all 0.2s',
      width: '100%',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    errorMessage: {
      fontSize: '0.75rem',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    deliverableCard: {
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      backgroundColor: '#f8fafc'
    },
    deliverableHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    deliverableGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 2fr',
      gap: '1rem'
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #3b82f6',
      borderRadius: '0.5rem',
      color: '#3b82f6',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    removeButton: {
      padding: '0.5rem',
      backgroundColor: '#fee2e2',
      border: 'none',
      borderRadius: '0.375rem',
      color: '#dc2626',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    footerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: '1px solid #e2e8f0'
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#6366f1',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    primaryButtonDisabled: {
      backgroundColor: '#94a3b8',
      cursor: 'not-allowed'
    },
    // New styles for pricing preview
    pricingPreview: {
      backgroundColor: '#f0f9ff',
      border: '1px solid #3b82f6',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginTop: '2rem'
    },
    pricingTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    pricingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      fontSize: '0.9375rem'
    },
    pricingLabel: {
      color: '#475569'
    },
    pricingValue: {
      fontWeight: '500',
      color: '#0f172a'
    },
    pricingDivider: {
      borderTop: '1px solid #cbd5e1',
      margin: '0.75rem 0'
    },
    pricingTotal: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#059669'
    },
    infoTooltip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: '#64748b'
    }
  };
  
  // Get pricing calculations
  const pricing = calculatePricing();
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/deals')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={18} />
          Back to Deals
        </button>
        
        <h1 style={styles.title}>Create New Deal</h1>
        
        <div style={styles.saveIndicator}>
          {saving ? (
            <>
              <Clock size={16} />
              Saving...
            </>
          ) : lastSaved ? (
            <>
              <Check size={16} />
              Saved {lastSaved.toLocaleTimeString()}
            </>
          ) : null}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={styles.progressLine}></div>
        <div style={{
          ...styles.progressLineFilled,
          width: `${((currentStep - 1) / (totalSteps - 1)) * 80}%`
        }}></div>
        
        <div style={styles.progressStep}>
          <div style={{
            ...styles.progressCircle,
            ...(currentStep >= 1 ? styles.progressCircleActive : {}),
            ...(currentStep > 1 ? styles.progressCircleCompleted : {})
          }}>
            {currentStep > 1 ? <Check size={18} /> : '1'}
          </div>
          <span style={styles.progressLabel}>Basic Info</span>
        </div>
        
        <div style={styles.progressStep}>
          <div style={{
            ...styles.progressCircle,
            ...(currentStep >= 2 ? styles.progressCircleActive : {}),
            ...(currentStep > 2 ? styles.progressCircleCompleted : {})
          }}>
            {currentStep > 2 ? <Check size={18} /> : '2'}
          </div>
          <span style={styles.progressLabel}>Contact</span>
        </div>
        
        <div style={styles.progressStep}>
          <div style={{
            ...styles.progressCircle,
            ...(currentStep >= 3 ? styles.progressCircleActive : {}),
            ...(currentStep > 3 ? styles.progressCircleCompleted : {})
          }}>
            {currentStep > 3 ? <Check size={18} /> : '3'}
          </div>
          <span style={styles.progressLabel}>Deliverables</span>
        </div>
        
        <div style={styles.progressStep}>
          <div style={{
            ...styles.progressCircle,
            ...(currentStep >= 4 ? styles.progressCircleActive : {})
          }}>
            4
          </div>
          <span style={styles.progressLabel}>Payment</span>
        </div>
      </div>
      
      {/* Form */}
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <h2 style={styles.stepTitle}>Basic Information</h2>
              
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>
                    Deal Title <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Q4 Instagram Campaign - Nike"
                    style={{
                      ...styles.input,
                      ...(errors.title ? styles.inputError : {})
                    }}
                  />
                  {errors.title && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.title}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Building size={16} />
                    Brand Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g., Nike India"
                    style={{
                      ...styles.input,
                      ...(errors.brandName ? styles.inputError : {})
                    }}
                  />
                  {errors.brandName && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.brandName}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Globe size={16} />
                    Brand Website
                  </label>
                  <input
                    type="text"
                    name="brandWebsite"
                    value={formData.brandWebsite}
                    onChange={handleChange}
                    placeholder="www.brand.com"
                    style={styles.input}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Enter with or without https://
                  </span>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Share2 size={16} />
                    Primary Platform <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    style={{
                      ...styles.select,
                      ...(errors.platform ? styles.inputError : {})
                    }}
                  >
                    {platformOptions.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                  {errors.platform && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.platform}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Pipeline Stage
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="pitched">Pitched</option>
                    <option value="in_talks">In Talks</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <DollarSign size={16} />
                    Deal Value <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="50000"
                    style={{
                      ...styles.input,
                      ...(errors.value ? styles.inputError : {})
                    }}
                  />
                  {errors.value && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.value}
                    </span>
                  )}
                  {formData.value && (
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {formatCurrency(formData.value)}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <>
              <h2 style={styles.stepTitle}>Contact Details</h2>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <User size={16} />
                    Contact Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{
                      ...styles.input,
                      ...(errors.contactName ? styles.inputError : {})
                    }}
                  />
                  {errors.contactName && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.contactName}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Mail size={16} />
                    Contact Email <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="john@brand.com"
                    style={{
                      ...styles.input,
                      ...(errors.contactEmail ? styles.inputError : {})
                    }}
                  />
                  {errors.contactEmail && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.contactEmail}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Phone size={16} />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Designation
                  </label>
                  <input
                    type="text"
                    name="contactDesignation"
                    value={formData.contactDesignation}
                    onChange={handleChange}
                    placeholder="Marketing Manager"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Instagram size={16} />
                    Brand Instagram
                  </label>
                  <input
                    type="text"
                    name="brandInstagram"
                    value={formData.brandInstagram}
                    onChange={handleChange}
                    placeholder="@brandhandle"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Brand Category
                  </label>
                  <select
                    name="brandCategory"
                    value={formData.brandCategory}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Select Category</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="beauty">Beauty & Cosmetics</option>
                    <option value="tech">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="travel">Travel & Hospitality</option>
                    <option value="fitness">Fitness & Wellness</option>
                    <option value="education">Education</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          {/* Step 3: Deliverables & Timeline */}
          {currentStep === 3 && (
            <>
              <h2 style={styles.stepTitle}>Deliverables & Timeline</h2>
              
              {/* Deliverables */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ ...styles.label, marginBottom: '1rem', display: 'block' }}>
                  Deliverables <span style={styles.required}>*</span>
                </label>
                
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} style={styles.deliverableCard}>
                    <div style={styles.deliverableHeader}>
                      <span style={{ fontWeight: '500', color: '#475569' }}>
                        Deliverable #{index + 1}
                      </span>
                      {formData.deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          style={styles.removeButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div style={styles.deliverableGrid}>
                      <select
                        value={deliverable.type}
                        onChange={(e) => handleDeliverableChange(index, 'type', e.target.value)}
                        style={styles.select}
                      >
                        {deliverableTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={deliverable.quantity}
                        onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        style={styles.input}
                      />
                      
                      <input
                        type="text"
                        value={deliverable.description}
                        onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                        placeholder="Description (e.g., Product showcase)"
                        style={styles.input}
                      />
                    </div>
                  </div>
                ))}
                
                {errors.deliverables && (
                  <span style={styles.errorMessage}>
                    <AlertCircle size={12} />
                    {errors.deliverables}
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={addDeliverable}
                  style={styles.addButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                >
                  <Plus size={16} />
                  Add Deliverable
                </button>
              </div>
              
              {/* Timeline */}
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Campaign Start Date
                  </label>
                  <input
                    type="date"
                    name="campaignStartDate"
                    value={formData.campaignStartDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Campaign End Date
                  </label>
                  <input
                    type="date"
                    name="campaignEndDate"
                    value={formData.campaignEndDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Clock size={16} />
                    Final Deadline <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.deadline ? styles.inputError : {})
                    }}
                  />
                  {errors.deadline && (
                    <span style={styles.errorMessage}>
                      <AlertCircle size={12} />
                      {errors.deadline}
                    </span>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>
                    <FileText size={16} />
                    Campaign Brief
                  </label>
                  <textarea
                    name="brief"
                    value={formData.brief}
                    onChange={handleChange}
                    placeholder="Describe the campaign requirements, goals, and guidelines..."
                    style={styles.textarea}
                  />
                </div>
                
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>
                    Internal Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any internal notes or reminders..."
                    style={styles.textarea}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Step 4: Payment & Terms */}
          {currentStep === 4 && (
            <>
              <h2 style={styles.stepTitle}>Payment & Terms</h2>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <CreditCard size={16} />
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {paymentTermsOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Advance Payment (%)
                  </label>
                  <input
                    type="number"
                    name="advancePercentage"
                    value={formData.advancePercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="0"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Usage Rights
                  </label>
                  <select
                    name="usageRights"
                    value={formData.usageRights}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="limited">Limited (Campaign Only)</option>
                    <option value="extended">Extended (6 months)</option>
                    <option value="perpetual">Perpetual</option>
                    <option value="custom">Custom Terms</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="gstApplicable"
                      checked={formData.gstApplicable}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    GST Applicable (18%)
                  </label>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="tdsApplicable"
                      checked={formData.tdsApplicable}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    TDS Applicable (10%)
                    <span style={styles.infoTooltip}>
                      <Info size={12} />
                      For individuals/HUF
                    </span>
                  </label>
                </div>
                
                {formData.gstApplicable && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      style={styles.input}
                    />
                  </div>
                )}
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="contractRequired"
                      checked={formData.contractRequired}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Contract Required
                  </label>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="exclusivityRequired"
                      checked={formData.exclusivityRequired}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Exclusivity Required
                  </label>
                </div>
              </div>
              
              {/* Pricing Preview */}
              {formData.value > 0 && (
                <div style={styles.pricingPreview}>
                  <h3 style={styles.pricingTitle}>
                    <Calculator size={18} />
                    Final Pricing Breakdown
                  </h3>
                  
                  <div style={styles.pricingRow}>
                    <span style={styles.pricingLabel}>Base Amount:</span>
                    <span style={styles.pricingValue}>{formatCurrency(pricing.baseAmount)}</span>
                  </div>
                  
                  {formData.gstApplicable && (
                    <div style={styles.pricingRow}>
                      <span style={styles.pricingLabel}>
                        + GST (18%):
                      </span>
                      <span style={styles.pricingValue}>{formatCurrency(pricing.gstAmount)}</span>
                    </div>
                  )}
                  
                  {formData.gstApplicable && (
                    <div style={styles.pricingRow}>
                      <span style={styles.pricingLabel}>Total with GST:</span>
                      <span style={styles.pricingValue}>{formatCurrency(pricing.amountWithGST)}</span>
                    </div>
                  )}
                  
                  {formData.tdsApplicable && (
                    <>
                      <div style={styles.pricingDivider}></div>
                      <div style={styles.pricingRow}>
                        <span style={styles.pricingLabel}>
                          - TDS (10% on base):
                        </span>
                        <span style={{ ...styles.pricingValue, color: '#dc2626' }}>
                          {formatCurrency(pricing.tdsAmount)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div style={styles.pricingDivider}></div>
                  
                  <div style={styles.pricingRow}>
                    <span style={{ ...styles.pricingLabel, fontSize: '1rem', fontWeight: '600' }}>
                      Amount You'll Receive:
                    </span>
                    <span style={styles.pricingTotal}>
                      {formatCurrency(pricing.finalAmount)}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <Info size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    This is an estimate. Actual amount may vary based on payment terms and processing fees.
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Footer Actions */}
          <div style={styles.footerActions}>
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <ArrowLeft size={18} />
                  Previous
                </button>
              )}
            </div>
            
            <div>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6366f1';
                  }}
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    ...styles.primaryButton,
                    ...(creating ? styles.primaryButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) {
                      e.currentTarget.style.backgroundColor = '#4f46e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!creating) {
                      e.currentTarget.style.backgroundColor = '#6366f1';
                    }
                  }}
                >
                  <Save size={18} />
                  {creating ? 'Creating...' : 'Create Deal'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealPage;
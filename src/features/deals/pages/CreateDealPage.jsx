/**
 * Create Deal Page - Enhanced Deal Creation Form
 * Path: src/features/deals/pages/CreateDealPage.jsx
 * 
 * Complete implementation with GST/TDS integration and additional optional fields
 * All features use existing backend endpoints only
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
  Info,
  Shield,
  Target,
  Tag,
  Briefcase,
  AlertTriangle,
  ChevronUp
} from 'lucide-react';
import useDealsStore from '../../../store/dealsStore';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-hot-toast';

const CreateDealPage = () => {
  const navigate = useNavigate();
  const { createDeal, creating, stages } = useDealsStore();
  const { user } = useAuthStore();
  
  // Form steps - increased to 5
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Expanded sections visibility
  const [expandedSections, setExpandedSections] = useState({
    contract: false,
    performance: false,
    usageRights: false,
    exclusivity: false
  });
  
  // Form data with all optional fields from backend model
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    title: '',
    brandName: '',
    brandWebsite: '',
    brandIndustry: 'other',
    brandCompanySize: 'startup',
    platform: 'instagram',
    stage: 'pitched',
    value: '',
    currency: 'INR',
    source: 'direct_outreach',
    referralSource: '',
    
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
    paymentTerms: '50_50',
    customPaymentTerms: '',
    paymentMethod: 'bank_transfer',
    gstApplicable: true,
    gstNumber: '',
    tdsApplicable: false,
    advancePercentage: 50,
    milestones: [],
    
    // Contract Details (Optional)
    contractRequired: false,
    contractKeyTerms: {
      exclusivity: '',
      deliverables: '',
      timeline: '',
      payment: '',
      usageRights: '',
      cancellation: ''
    },
    
    // Usage Rights (Optional)
    exclusivityRequired: false,
    exclusivityDuration: 30,
    exclusivityCategories: [],
    usageRights: 'limited',
    usageRightsDuration: '3_months',
    usageRightsPlatforms: [],
    usageRightsGeography: 'india',
    whiteLabel: false,
    
    // Performance Targets (Optional)
    performanceTracked: false,
    performanceTargets: {
      minViews: '',
      minLikes: '',
      minComments: '',
      minShares: '',
      minSaves: '',
      ctr: '',
      engagementRate: ''
    },
    
    // Content Guidelines (Optional)
    contentGuidelines: {
      mustInclude: [],
      mustAvoid: [],
      tone: '',
      style: ''
    },
    
    // Step 5 - Additional Details
    priority: 'medium',
    tags: [],
    internalNotes: '',
    attachments: []
  });
  
  // Templates state
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Auto-save draft
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Deal health score
  const [dealHealth, setDealHealth] = useState({ score: 100, issues: [] });
  
  // Platform options
  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'twitter', label: 'Twitter/X', icon: Hash },
    { value: 'linkedin', label: 'LinkedIn', icon: Link },
    { value: 'facebook', label: 'Facebook', icon: Share2 },
    { value: 'snapchat', label: 'Snapchat', icon: Package },
    { value: 'multiple', label: 'Multiple Platforms', icon: Share2 }
  ];
  
  // Deliverable types from backend
  const deliverableTypes = [
    { value: 'instagram_post', label: 'Instagram Post' },
    { value: 'instagram_reel', label: 'Instagram Reel' },
    { value: 'instagram_story', label: 'Instagram Story' },
    { value: 'instagram_igtv', label: 'Instagram IGTV' },
    { value: 'youtube_video', label: 'YouTube Video' },
    { value: 'youtube_short', label: 'YouTube Short' },
    { value: 'linkedin_post', label: 'LinkedIn Post' },
    { value: 'linkedin_article', label: 'LinkedIn Article' },
    { value: 'twitter_post', label: 'Tweet/X Post' },
    { value: 'twitter_thread', label: 'Thread' },
    { value: 'facebook_post', label: 'Facebook Post' },
    { value: 'facebook_reel', label: 'Facebook Reel' },
    { value: 'blog_post', label: 'Blog Post' },
    { value: 'product_unboxing', label: 'Product Unboxing' },
    { value: 'brand_collaboration', label: 'Brand Collaboration' },
    { value: 'event_coverage', label: 'Event Coverage' },
    { value: 'other', label: 'Custom' }
  ];
  
  // Payment terms options
  const paymentTermsOptions = [
    { value: 'full_advance', label: '100% Advance' },
    { value: '50_50', label: '50% Advance, 50% on Completion' },
    { value: '30_70', label: '30% Advance, 70% on Completion' },
    { value: 'on_delivery', label: '100% on Delivery' },
    { value: 'net_30', label: 'Net 30 Days' },
    { value: 'net_15', label: 'Net 15 Days' },
    { value: 'custom', label: 'Custom Terms' }
  ];
  
  // Deal source options
  const sourceOptions = [
    { value: 'direct_outreach', label: 'Direct Outreach' },
    { value: 'brand_inquiry', label: 'Brand Inquiry' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'email_campaign', label: 'Email Campaign' },
    { value: 'networking', label: 'Networking' },
    { value: 'repeat_client', label: 'Repeat Client' },
    { value: 'other', label: 'Other' }
  ];
  
  // Industry options
  const industryOptions = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tech', label: 'Technology' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'home_decor', label: 'Home & Decor' },
    { value: 'other', label: 'Other' }
  ];
  
  // Company size options
  const companySizeOptions = [
    { value: 'startup', label: 'Startup (1-10)' },
    { value: 'small', label: 'Small (11-50)' },
    { value: 'medium', label: 'Medium (51-200)' },
    { value: 'large', label: 'Large (201-1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' }
  ];
  
  // Content tone options
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' }
  ];
  
  // Calculate pricing with GST and TDS
  const calculatePricing = () => {
    const baseAmount = parseFloat(formData.value) || 0;
    
    // GST calculation (18%)
    const gstAmount = formData.gstApplicable ? baseAmount * 0.18 : 0;
    const amountWithGST = baseAmount + gstAmount;
    
    // TDS calculation (10% on base amount for individuals, 2% for companies)
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
  
  // Calculate deal health score
  const calculateDealHealth = () => {
    let score = 100;
    const issues = [];
    
    // Basic requirements
    if (!formData.brandWebsite) {
      score -= 5;
      issues.push('Add brand website for better credibility');
    }
    
    if (!formData.brief) {
      score -= 10;
      issues.push('Add campaign brief for clarity');
    }
    
    // Timeline checks
    if (formData.deadline) {
      const daysToDeadline = Math.ceil(
        (new Date(formData.deadline) - new Date()) / (1000 * 60 * 60 * 24)
      );
      if (daysToDeadline < 7) {
        score -= 15;
        issues.push('Very tight deadline - consider negotiating');
      }
    }
    
    // Financial checks
    if (!formData.contractRequired) {
      score -= 10;
      issues.push('Consider requiring a contract for protection');
    }
    
    if (formData.paymentTerms === 'on_delivery' || formData.paymentTerms === 'net_30') {
      score -= 10;
      issues.push('No advance payment - higher risk');
    }
    
    // Add points for good practices
    if (formData.paymentTerms.includes('advance')) score += 5;
    if (formData.performanceTracked) score += 5;
    if (formData.exclusivityRequired) score += 10;
    if (formData.tags.length > 0) score += 5;
    
    return {
      score: Math.max(0, Math.min(100, score)),
      issues
    };
  };
  
  // Update deal health when form changes
  useEffect(() => {
    const health = calculateDealHealth();
    setDealHealth(health);
  }, [formData]);
  
  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const response = await dealsAPI.getTemplates();
        if (response.data && response.data.templates) {
          setTemplates(response.data.templates);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  // Apply template
  const applyTemplate = async (templateId) => {
    if (!templateId) return;
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Merge template data with current form
    setFormData(prev => ({
      ...prev,
      platform: template.template.platform || prev.platform,
      deliverables: template.template.deliverables || prev.deliverables,
      value: template.template.defaultValue || prev.value,
      paymentTerms: template.template.paymentTerms || prev.paymentTerms,
      ...template.template.campaignRequirements && {
        exclusivityRequired: template.template.campaignRequirements.exclusivity?.required || false,
        exclusivityDuration: template.template.campaignRequirements.exclusivity?.duration || 30,
        contentGuidelines: template.template.campaignRequirements.contentGuidelines || prev.contentGuidelines
      }
    }));
    
    toast.success('Template applied successfully');
  };
  
  // Fix website URL
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
  
  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
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
  
  // Handle array field changes (tags, must include, etc.)
  const handleArrayFieldChange = (field, value, action = 'add') => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (action === 'add' && value && !current.includes(value)) {
        return { ...prev, [field]: [...current, value] };
      } else if (action === 'remove') {
        return { ...prev, [field]: current.filter(item => item !== value) };
      }
      return prev;
    });
  };
  
  // Validate step
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
        if (formData.paymentTerms === 'custom' && !formData.customPaymentTerms) {
          newErrors.customPaymentTerms = 'Please specify custom payment terms';
        }
        break;
        
      case 5:
        // No required fields in step 5
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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
     // Only submit if we're on the last step
  if (currentStep !== totalSteps) {
    handleNextStep();
    return;
  }

    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      const pricing = calculatePricing();
      
      // Format deliverables
      const formattedDeliverables = formData.deliverables.map(d => ({
        type: d.type,
        quantity: parseInt(d.quantity) || 1,
        description: d.description || 'Content creation',
        ...(d.deadline || formData.deadline ? {
          deadline: new Date(d.deadline || formData.deadline).toISOString()
        } : {}),
        status: 'pending'
      }));
      
      // Calculate payment due date
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
          industry: formData.brandIndustry || 'other',
          companySize: formData.brandCompanySize || 'startup'
        },
        
        // DealValue as object with calculated amounts
        dealValue: {
          amount: parseFloat(formData.value) || 0,
          currency: formData.currency || 'INR',
          paymentTerms: formData.paymentTerms || '50_50',
          customPaymentTerms: formData.paymentTerms === 'custom' ? formData.customPaymentTerms : '',
          gstApplicable: Boolean(formData.gstApplicable),
          tdsApplicable: Boolean(formData.tdsApplicable),
          gstAmount: pricing.gstAmount,
          tdsAmount: pricing.tdsAmount,
          finalAmount: pricing.finalAmount
        },
        
        platform: formData.platform,
        stage: 'pitched',
        
        // Timeline
        timeline: {
          responseDeadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          contentDeadline: formData.campaignEndDate ? new Date(formData.campaignEndDate).toISOString() : null,
          goLiveDate: formData.campaignStartDate ? new Date(formData.campaignStartDate).toISOString() : null,
          paymentDueDate: paymentDueDate
        },
        
        // Deliverables
        deliverables: formattedDeliverables,
        
        // Campaign requirements (combining all optional fields)
        campaignRequirements: {
          exclusivity: formData.exclusivityRequired ? {
            required: true,
            duration: formData.exclusivityDuration || 30,
            categories: formData.exclusivityCategories || []
          } : undefined,
          
          contentGuidelines: (formData.contentGuidelines.mustInclude?.length > 0 || 
                              formData.contentGuidelines.mustAvoid?.length > 0) ? {
            mustInclude: formData.contentGuidelines.mustInclude || [],
            mustAvoid: formData.contentGuidelines.mustAvoid || [],
            tone: formData.contentGuidelines.tone || undefined,
            style: formData.contentGuidelines.style || undefined
          } : undefined,
          
          usageRights: {
            duration: formData.usageRightsDuration || '3_months',
            platforms: formData.usageRightsPlatforms || [],
            geography: formData.usageRightsGeography || 'india',
            whiteLabel: Boolean(formData.whiteLabel)
          },
          
          performanceTargets: formData.performanceTracked ? {
            minViews: formData.performanceTargets.minViews ? parseInt(formData.performanceTargets.minViews) : undefined,
            minLikes: formData.performanceTargets.minLikes ? parseInt(formData.performanceTargets.minLikes) : undefined,
            minComments: formData.performanceTargets.minComments ? parseInt(formData.performanceTargets.minComments) : undefined,
            minShares: formData.performanceTargets.minShares ? parseInt(formData.performanceTargets.minShares) : undefined,
            minSaves: formData.performanceTargets.minSaves ? parseInt(formData.performanceTargets.minSaves) : undefined,
            ctr: formData.performanceTargets.ctr ? parseFloat(formData.performanceTargets.ctr) : undefined,
            engagementRate: formData.performanceTargets.engagementRate ? parseFloat(formData.performanceTargets.engagementRate) : undefined
          } : undefined,
          
          brief: formData.brief || ''
        },
        
        // Contract
        contract: formData.contractRequired ? {
          isRequired: true,
          status: 'pending',
          keyTerms: formData.contractKeyTerms
        } : {
          isRequired: false,
          status: 'not_required'
        },
        
        // Other fields
        source: formData.source || 'direct_outreach',
        referralSource: formData.source === 'referral' ? formData.referralSource : undefined,
        priority: formData.priority || 'medium',
        tags: formData.tags || [],
        internalNotes: formData.internalNotes || ''
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
      setFormData(parsed);
    }
  }, []);
  
  // Toggle expanded section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Get health score color
  const getHealthColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
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
    templateSelector: {
      maxWidth: '800px',
      margin: '0 auto 2rem',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
    optionalSection: {
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0'
    },
    sectionToggle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.5rem',
      marginBottom: '1rem'
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
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
    healthScore: {
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #10b981',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem'
    },
    healthScoreHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    healthScoreValue: {
      fontSize: '1.5rem',
      fontWeight: '700'
    },
    healthScoreIssues: {
      fontSize: '0.875rem',
      color: '#475569',
      marginTop: '0.5rem'
    },
    tagInput: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      backgroundColor: '#e0e7ff',
      color: '#4f46e5',
      borderRadius: '9999px',
      fontSize: '0.875rem'
    },
    tagRemove: {
      cursor: 'pointer',
      padding: '0.125rem'
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
      
      {/* Template Selector */}
      {currentStep === 1 && templates.length > 0 && (
        <div style={styles.templateSelector}>
          <label style={{ ...styles.label, marginBottom: '0.5rem' }}>
            <FileText size={16} />
            Start from a template (Optional)
          </label>
          <select
            onChange={(e) => applyTemplate(e.target.value)}
            style={styles.select}
            disabled={loadingTemplates}
          >
            <option value="">-- Select a template --</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.category}
              </option>
            ))}
          </select>
        </div>
      )}
      
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
            ...(currentStep >= 4 ? styles.progressCircleActive : {}),
            ...(currentStep > 4 ? styles.progressCircleCompleted : {})
          }}>
            {currentStep > 4 ? <Check size={18} /> : '4'}
          </div>
          <span style={styles.progressLabel}>Payment</span>
        </div>
        
        <div style={styles.progressStep}>
          <div style={{
            ...styles.progressCircle,
            ...(currentStep >= 5 ? styles.progressCircleActive : {})
          }}>
            5
          </div>
          <span style={styles.progressLabel}>Additional</span>
        </div>
      </div>
      
      {/* Deal Health Score */}
      {dealHealth.score < 100 && (
        <div style={{
          ...styles.healthScore,
          backgroundColor: dealHealth.score >= 80 ? '#f0fdf4' : dealHealth.score >= 60 ? '#fef3c7' : '#fee2e2',
          borderColor: getHealthColor(dealHealth.score),
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          <div style={styles.healthScoreHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} style={{ color: getHealthColor(dealHealth.score) }} />
              <span style={{ fontWeight: '600' }}>Deal Health Score</span>
            </div>
            <span style={{
              ...styles.healthScoreValue,
              color: getHealthColor(dealHealth.score)
            }}>
              {dealHealth.score}%
            </span>
          </div>
          {dealHealth.issues.length > 0 && (
            <div style={styles.healthScoreIssues}>
              <strong>Suggestions:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                {dealHealth.issues.slice(0, 3).map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
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
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Industry
                  </label>
                  <select
                    name="brandIndustry"
                    value={formData.brandIndustry}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {industryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Company Size
                  </label>
                  <select
                    name="brandCompanySize"
                    value={formData.brandCompanySize}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {companySizeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                    <Briefcase size={16} />
                    Deal Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {sourceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {formData.source === 'referral' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Referral Source
                    </label>
                    <input
                      type="text"
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleChange}
                      placeholder="Who referred this deal?"
                      style={styles.input}
                    />
                  </div>
                )}
                
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
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
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
              </div>
              
              {/* Optional: Performance Targets */}
              <div style={styles.optionalSection}>
                <div 
                  style={styles.sectionToggle}
                  onClick={() => toggleSection('performance')}
                >
                  <div style={styles.sectionTitle}>
                    <Target size={18} />
                    Performance Targets (Optional)
                  </div>
                  {expandedSections.performance ? 
                    <ChevronUp size={18} /> : 
                    <ChevronDown size={18} />
                  }
                </div>
                
                {expandedSections.performance && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          name="performanceTracked"
                          checked={formData.performanceTracked}
                          onChange={handleChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        Track Performance Metrics
                      </label>
                    </div>
                    
                    {formData.performanceTracked && (
                      <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Min Views</label>
                          <input
                            type="number"
                            value={formData.performanceTargets.minViews}
                            onChange={(e) => handleNestedChange('performanceTargets', 'minViews', e.target.value)}
                            placeholder="10000"
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Min Likes</label>
                          <input
                            type="number"
                            value={formData.performanceTargets.minLikes}
                            onChange={(e) => handleNestedChange('performanceTargets', 'minLikes', e.target.value)}
                            placeholder="500"
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Min Comments</label>
                          <input
                            type="number"
                            value={formData.performanceTargets.minComments}
                            onChange={(e) => handleNestedChange('performanceTargets', 'minComments', e.target.value)}
                            placeholder="50"
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Engagement Rate (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.performanceTargets.engagementRate}
                            onChange={(e) => handleNestedChange('performanceTargets', 'engagementRate', e.target.value)}
                            placeholder="3.5"
                            style={styles.input}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
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
                
                {formData.paymentTerms === 'custom' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Custom Payment Terms <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="customPaymentTerms"
                      value={formData.customPaymentTerms}
                      onChange={handleChange}
                      placeholder="Describe custom payment terms"
                      style={{
                        ...styles.input,
                        ...(errors.customPaymentTerms ? styles.inputError : {})
                      }}
                    />
                  </div>
                )}
                
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
                
                {(formData.paymentTerms === '50_50' || formData.paymentTerms === '30_70') && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Advance Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="advancePercentage"
                      value={formData.paymentTerms === '50_50' ? 50 : 30}
                      disabled
                      style={styles.input}
                    />
                  </div>
                )}
                
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
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {' '}(For individuals/HUF)
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
              
              {/* Optional: Contract Details */}
              <div style={styles.optionalSection}>
                <div 
                  style={styles.sectionToggle}
                  onClick={() => toggleSection('contract')}
                >
                  <div style={styles.sectionTitle}>
                    <Shield size={18} />
                    Contract Details (Optional)
                  </div>
                  {expandedSections.contract ? 
                    <ChevronUp size={18} /> : 
                    <ChevronDown size={18} />
                  }
                </div>
                
                {expandedSections.contract && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
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
                    
                    {formData.contractRequired && (
                      <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Exclusivity Terms</label>
                          <input
                            type="text"
                            value={formData.contractKeyTerms.exclusivity}
                            onChange={(e) => handleNestedChange('contractKeyTerms', 'exclusivity', e.target.value)}
                            placeholder="e.g., No competitor brands for 30 days"
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Cancellation Policy</label>
                          <input
                            type="text"
                            value={formData.contractKeyTerms.cancellation}
                            onChange={(e) => handleNestedChange('contractKeyTerms', 'cancellation', e.target.value)}
                            placeholder="e.g., 7 days notice required"
                            style={styles.input}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Optional: Usage Rights */}
              <div style={styles.optionalSection}>
                <div 
                  style={styles.sectionToggle}
                  onClick={() => toggleSection('usageRights')}
                >
                  <div style={styles.sectionTitle}>
                    <Link size={18} />
                    Usage Rights (Optional)
                  </div>
                  {expandedSections.usageRights ? 
                    <ChevronUp size={18} /> : 
                    <ChevronDown size={18} />
                  }
                </div>
                
                {expandedSections.usageRights && (
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Usage Duration</label>
                      <select
                        name="usageRightsDuration"
                        value={formData.usageRightsDuration}
                        onChange={handleChange}
                        style={styles.select}
                      >
                        <option value="1_month">1 Month</option>
                        <option value="3_months">3 Months</option>
                        <option value="6_months">6 Months</option>
                        <option value="1_year">1 Year</option>
                        <option value="lifetime">Lifetime</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Geographic Scope</label>
                      <select
                        name="usageRightsGeography"
                        value={formData.usageRightsGeography}
                        onChange={handleChange}
                        style={styles.select}
                      >
                        <option value="india">India Only</option>
                        <option value="global">Global</option>
                        <option value="specific_regions">Specific Regions</option>
                      </select>
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          name="whiteLabel"
                          checked={formData.whiteLabel}
                          onChange={handleChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        White Label Content
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
                    
                    {formData.exclusivityRequired && (
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Exclusivity Duration (days)</label>
                        <input
                          type="number"
                          name="exclusivityDuration"
                          value={formData.exclusivityDuration}
                          onChange={handleChange}
                          placeholder="30"
                          style={styles.input}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Step 5: Additional Details */}
          {currentStep === 5 && (
            <>
              <h2 style={styles.stepTitle}>Additional Details</h2>
              
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>
                    <Tag size={16} />
                    Tags (Press Enter to add)
                  </label>
                  <div style={{ marginBottom: '0.5rem' }}>
                    {formData.tags.map((tag, index) => (
                      <span key={index} style={styles.tag}>
                        {tag}
                        <X
                          size={14}
                          style={styles.tagRemove}
                          onClick={() => handleArrayFieldChange('tags', tag, 'remove')}
                        />
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tags..."
                    style={styles.input}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value) {
                          handleArrayFieldChange('tags', value, 'add');
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </div>
                
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>
                    Internal Notes
                  </label>
                  <textarea
                    name="internalNotes"
                    value={formData.internalNotes}
                    onChange={handleChange}
                    placeholder="Any internal notes or reminders..."
                    style={styles.textarea}
                  />
                </div>
              </div>
              
              {/* Optional: Content Guidelines */}
              <div style={styles.optionalSection}>
                <div 
                  style={styles.sectionToggle}
                  onClick={() => toggleSection('guidelines')}
                >
                  <div style={styles.sectionTitle}>
                    <FileText size={18} />
                    Content Guidelines (Optional)
                  </div>
                  {expandedSections.guidelines ? 
                    <ChevronUp size={18} /> : 
                    <ChevronDown size={18} />
                  }
                </div>
                
                {expandedSections.guidelines && (
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Content Tone</label>
                      <select
                        value={formData.contentGuidelines.tone}
                        onChange={(e) => handleNestedChange('contentGuidelines', 'tone', e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Select Tone</option>
                        {toneOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Content Style</label>
                      <input
                        type="text"
                        value={formData.contentGuidelines.style}
                        onChange={(e) => handleNestedChange('contentGuidelines', 'style', e.target.value)}
                        placeholder="e.g., Minimalist, Vibrant"
                        style={styles.input}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Footer Actions */}
         

{/* Footer Actions */}
<div style={styles.footerActions}>
  <div>
    {currentStep > 1 && (
      <button
        type="button"  // Explicitly set type="button"
        onClick={handlePreviousStep}
        style={styles.secondaryButton}
      >
        <ArrowLeft size={18} />
        Previous
      </button>
    )}
  </div>
  
  <div>
    {currentStep < totalSteps ? (
      <button
        type="button"  // Explicitly set type="button" to prevent form submission
        onClick={handleNextStep}
        style={styles.primaryButton}
      >
        Next
        <ArrowRight size={18} />
      </button>
    ) : (
      <button
        type="submit"  // Only this should be type="submit"
        disabled={creating}
        style={{
          ...styles.primaryButton,
          ...(creating ? styles.primaryButtonDisabled : {})
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
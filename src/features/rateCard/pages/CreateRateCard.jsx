/**
 * Create Rate Card Page
 * Multi-step form for creating new rate cards with AI-powered pricing suggestions
 * 
 * Features:
 * - Step-by-step wizard interface
 * - Platform metrics input with validation
 * - Creator profile information (niche, location, experience)
 * - Real-time form validation
 * - AI pricing generation preview
 * - Professional form design with progress indicators
 * 
 * @filepath src/features/rateCard/pages/CreateRateCard.jsx
 * @author CreatorsMantra Frontend Team
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Users,
  TrendingUp,
  MapPin,
  Globe,
  Briefcase,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  Info,
  Loader2
} from 'lucide-react';
import useRateCardStore from '../../../store/ratecardStore';

const CreateRateCard = ({ onNavigate, onBack }) => {
  const { createRateCard, isLoading, error } = useRateCardStore();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    metrics: {
      platforms: [
        {
          name: 'instagram',
          metrics: {
            followers: '',
            engagementRate: '',
            avgViews: '',
            avgLikes: ''
          }
        }
      ],
      niche: '',
      location: {
        city: '',
        cityTier: 'tier1',
        state: ''
      },
      languages: ['english'],
      experience: 'beginner'
    }
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Platform configuration
  const platformConfig = {
    instagram: { 
      name: 'Instagram', 
      icon: Instagram, 
      color: '#E4405F',
      metrics: ['followers', 'engagementRate', 'avgViews', 'avgLikes']
    },
    youtube: { 
      name: 'YouTube', 
      icon: Youtube, 
      color: '#FF0000',
      metrics: ['followers', 'engagementRate', 'avgViews']
    },
    linkedin: { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: '#0077B5',
      metrics: ['followers', 'engagementRate']
    },
    twitter: { 
      name: 'Twitter', 
      icon: Twitter, 
      color: '#1DA1F2',
      metrics: ['followers', 'engagementRate']
    },
    facebook: { 
      name: 'Facebook', 
      icon: Facebook, 
      color: '#1877F2',
      metrics: ['followers', 'engagementRate', 'avgViews']
    }
  };

  const niches = [
    'fashion', 'beauty', 'tech', 'finance', 'food', 'travel',
    'lifestyle', 'fitness', 'gaming', 'education', 'entertainment',
    'business', 'health', 'parenting', 'sports', 'music', 'art', 'other'
  ];

  const languages = [
    'english', 'hindi', 'tamil', 'telugu', 'bengali', 'marathi',
    'gujarati', 'kannada', 'malayalam', 'punjabi', 'other'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Just Starting (0-1 years)' },
    { value: '1-2_years', label: 'Getting Established (1-2 years)' },
    { value: '2-5_years', label: 'Experienced (2-5 years)' },
    { value: '5+_years', label: 'Expert (5+ years)' }
  ];

  const cityTiers = [
    { value: 'metro', label: 'Metro (Mumbai, Delhi, Bangalore, etc.)' },
    { value: 'tier1', label: 'Tier 1 (Pune, Hyderabad, Chennai, etc.)' },
    { value: 'tier2', label: 'Tier 2 (Indore, Bhopal, Lucknow, etc.)' },
    { value: 'tier3', label: 'Tier 3 (Smaller cities and towns)' }
  ];

  // Steps configuration
  const steps = [
    { id: 1, title: 'Basic Info', description: 'Rate card details' },
    { id: 2, title: 'Platforms', description: 'Social media metrics' },
    { id: 3, title: 'Profile', description: 'Your creator profile' },
    { id: 4, title: 'Review', description: 'Confirm and create' }
  ];

  // Validation functions
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          errors.title = 'Rate card title is required';
        } else if (formData.title.length > 100) {
          errors.title = 'Title cannot exceed 100 characters';
        }
        
        if (formData.description && formData.description.length > 500) {
          errors.description = 'Description cannot exceed 500 characters';
        }
        break;

      case 2:
        if (formData.metrics.platforms.length === 0) {
          errors.platforms = 'At least one platform is required';
        }

        formData.metrics.platforms.forEach((platform, index) => {
          const platformErrors = {};
          
          if (!platform.metrics.followers || platform.metrics.followers <= 0) {
            platformErrors.followers = 'Followers count is required';
          } else if (platform.metrics.followers > 1000000000) {
            platformErrors.followers = 'Followers count seems unrealistic';
          }
          
          if (!platform.metrics.engagementRate || platform.metrics.engagementRate <= 0) {
            platformErrors.engagementRate = 'Engagement rate is required';
          } else if (platform.metrics.engagementRate > 100) {
            platformErrors.engagementRate = 'Engagement rate cannot exceed 100%';
          }

          if (Object.keys(platformErrors).length > 0) {
            errors[`platform_${index}`] = platformErrors;
          }
        });
        break;

      case 3:
        if (!formData.metrics.niche) {
          errors.niche = 'Please select your content niche';
        }
        
        if (!formData.metrics.location.city.trim()) {
          errors.city = 'City is required';
        }
        
        if (!formData.metrics.location.cityTier) {
          errors.cityTier = 'Please select your city tier';
        }

        if (!formData.metrics.languages.length) {
          errors.languages = 'At least one language is required';
        }
        break;
    }

    return errors;
  };

  const isStepValid = (step) => {
    const errors = validateStep(step);
    return Object.keys(errors).length === 0;
  };

  // Handle form updates
  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Clear validation errors for this field
    setValidationErrors(prev => ({
      ...prev,
      [path]: undefined
    }));
  };

  const markFieldTouched = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Platform management
  const addPlatform = (platformName) => {
    const newPlatform = {
      name: platformName,
      metrics: {
        followers: '',
        engagementRate: '',
        avgViews: '',
        avgLikes: ''
      }
    };

    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        platforms: [...prev.metrics.platforms, newPlatform]
      }
    }));
  };

  const removePlatform = (index) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        platforms: prev.metrics.platforms.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePlatformMetric = (platformIndex, metric, value) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        platforms: prev.metrics.platforms.map((platform, index) => 
          index === platformIndex 
            ? {
                ...platform,
                metrics: {
                  ...platform.metrics,
                  [metric]: value
                }
              }
            : platform
        )
      }
    }));
  };

  // Language management
  const toggleLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        languages: prev.metrics.languages.includes(language)
          ? prev.metrics.languages.filter(l => l !== language)
          : [...prev.metrics.languages, language]
      }
    }));
  };

  // Navigation
  const nextStep = () => {
    const errors = validateStep(currentStep);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Form submission
  const handleSubmit = async () => {
    const errors = validateStep(currentStep);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const result = await createRateCard(formData);
      if (result && onNavigate) {
        onNavigate(`/dashboard/rate-cards/${result.rateCard._id}/edit`);
      }
    } catch (error) {
      console.error('Failed to create rate card:', error);
    }
  };

  const formatNumber = (value) => {
    const num = parseInt(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const parseNumber = (value) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  useEffect(() => {
    // Validate current step when data changes
    const errors = validateStep(currentStep);
    setValidationErrors(errors);
  }, [formData, currentStep]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50), var(--color-accent-50))'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid var(--color-border)', 
        padding: 'var(--space-6)' 
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <button
                onClick={onBack || (() => onNavigate && onNavigate('/dashboard/rate-cards'))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'white',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-200) ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.color = 'var(--color-primary-600)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.color = 'var(--color-text-secondary)';
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div>
                <h1 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'var(--font-bold)', 
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Create Rate Card
                </h1>
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  fontSize: 'var(--text-sm)' 
                }}>
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
                </p>
              </div>
            </div>

            {/* AI Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-secondary-100))',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-primary-700)'
            }}>
              <Sparkles size={16} />
              AI-Powered Pricing
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: 'var(--space-6) var(--space-6) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flex: index < steps.length - 1 ? 1 : 'none' 
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    backgroundColor: currentStep > step.id 
                      ? 'var(--color-success)' 
                      : currentStep === step.id 
                        ? 'var(--color-primary-600)' 
                        : 'var(--color-neutral-200)',
                    color: currentStep >= step.id ? 'white' : 'var(--color-neutral-500)'
                  }}>
                    {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '6rem' }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: currentStep >= step.id ? 'var(--color-text)' : 'var(--color-text-secondary)'
                    }}>
                      {step.title}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    margin: '0 var(--space-4)',
                    backgroundColor: currentStep > step.id ? 'var(--color-success)' : 'var(--color-neutral-200)',
                    marginTop: '-1.5rem'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          {/* Error Display */}
          {error && (
            <div style={{
              backgroundColor: 'var(--color-error-light)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-error)' }} />
              <p style={{ color: 'var(--color-error-dark)' }}>{error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Rate Card Information
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Give your rate card a professional title and description that brands will see.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Title */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Rate Card Title *
                  </label>
                  <input
  type="text"
  value={formData.title}
  onChange={(e) => updateFormData('title', e.target.value)}
  placeholder="e.g., Fashion & Lifestyle Rate Card 2024"
  maxLength={100}
  style={{
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    border: `1px solid ${validationErrors.title ? 'var(--color-error)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: 'border-color var(--duration-200) ease'
  }}
  onFocus={(e) => {
    if (!validationErrors.title) {
      e.target.style.borderColor = 'var(--color-primary-500)';
      e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
    }
  }}
  onBlur={(e) => {
    e.target.style.borderColor = validationErrors.title ? 'var(--color-error)' : 'var(--color-border)';
    e.target.style.boxShadow = 'none';
    markFieldTouched('title'); // <- keep this here
  }}
/>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
                    {validationErrors.title && (
                      <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
                        {validationErrors.title}
                      </span>
                    )}
                    <span style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: 'var(--text-sm)',
                      marginLeft: 'auto'
                    }}>
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Brief description of your content style and what makes you unique..."
                    maxLength={500}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      border: `1px solid ${validationErrors.description ? 'var(--color-error)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'border-color var(--duration-200) ease'
                    }}
                    onFocus={(e) => {
                      if (!validationErrors.description) {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = validationErrors.description ? 'var(--color-error)' : 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
                    {validationErrors.description && (
                      <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
                        {validationErrors.description}
                      </span>
                    )}
                    <span style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: 'var(--text-sm)',
                      marginLeft: 'auto'
                    }}>
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platform Metrics */}
          {currentStep === 2 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Platform Metrics
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Add your social media platforms and current metrics to generate accurate pricing suggestions.
                </p>
              </div>

              {/* Current Platforms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {formData.metrics.platforms.map((platform, index) => {
                  const config = platformConfig[platform.name];
                  const PlatformIcon = config.icon;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6)',
                        backgroundColor: 'var(--color-neutral-50)'
                      }}
                    >
                      {/* Platform Header */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginBottom: 'var(--space-4)' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: config.color,
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PlatformIcon size={20} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-text)'
                          }}>
                            {config.name}
                          </h3>
                        </div>

                        {formData.metrics.platforms.length > 1 && (
                          <button
                            onClick={() => removePlatform(index)}
                            style={{
                              padding: 'var(--space-2)',
                              border: 'none',
                              backgroundColor: 'var(--color-error-light)',
                              color: 'var(--color-error)',
                              borderRadius: 'var(--radius-base)',
                              cursor: 'pointer',
                              transition: 'all var(--duration-200) ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--color-error)';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'var(--color-error-light)';
                              e.target.style.color = 'var(--color-error)';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Metrics Grid */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: 'var(--space-4)' 
                      }}>
                        {/* Followers */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--color-text)',
                            marginBottom: 'var(--space-2)'
                          }}>
                            Followers/Subscribers *
                          </label>
                          <input
                            type="text"
                            value={formatNumber(platform.metrics.followers.toString())}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (/^\d*$/.test(value)) {
                                updatePlatformMetric(index, 'followers', value);
                              }
                            }}
                            placeholder="10,000"
                            style={{
                              width: '100%',
                              padding: 'var(--space-3) var(--space-4)',
                              border: `1px solid ${validationErrors[`platform_${index}`]?.followers ? 'var(--color-error)' : 'var(--color-border)'}`,
                              borderRadius: 'var(--radius-base)',
                              fontSize: 'var(--text-sm)',
                              outline: 'none',
                              backgroundColor: 'white'
                            }}
                          />
                          {validationErrors[`platform_${index}`]?.followers && (
                            <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                              {validationErrors[`platform_${index}`].followers}
                            </span>
                          )}
                        </div>

                        {/* Engagement Rate */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--color-text)',
                            marginBottom: 'var(--space-2)'
                          }}>
                            Engagement Rate (%) *
                          </label>
                          <input
                            type="number"
                            value={platform.metrics.engagementRate}
                            onChange={(e) => updatePlatformMetric(index, 'engagementRate', e.target.value)}
                            placeholder="3.5"
                            min="0"
                            max="100"
                            step="0.1"
                            style={{
                              width: '100%',
                              padding: 'var(--space-3) var(--space-4)',
                              border: `1px solid ${validationErrors[`platform_${index}`]?.engagementRate ? 'var(--color-error)' : 'var(--color-border)'}`,
                              borderRadius: 'var(--radius-base)',
                              fontSize: 'var(--text-sm)',
                              outline: 'none',
                              backgroundColor: 'white'
                            }}
                          />
                          {validationErrors[`platform_${index}`]?.engagementRate && (
                            <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                              {validationErrors[`platform_${index}`].engagementRate}
                            </span>
                          )}
                        </div>

                        {/* Average Views (if applicable) */}
                        {config.metrics.includes('avgViews') && (
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-medium)',
                              color: 'var(--color-text)',
                              marginBottom: 'var(--space-2)'
                            }}>
                              Average Views (Optional)
                            </label>
                            <input
                              type="text"
                              value={formatNumber(platform.metrics.avgViews.toString())}
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (/^\d*$/.test(value)) {
                                  updatePlatformMetric(index, 'avgViews', value);
                                }
                              }}
                              placeholder="5,000"
                              style={{
                                width: '100%',
                                padding: 'var(--space-3) var(--space-4)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-base)',
                                fontSize: 'var(--text-sm)',
                                outline: 'none',
                                backgroundColor: 'white'
                              }}
                            />
                          </div>
                        )}

                        {/* Average Likes (if applicable) */}
                        {config.metrics.includes('avgLikes') && (
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-medium)',
                              color: 'var(--color-text)',
                              marginBottom: 'var(--space-2)'
                            }}>
                              Average Likes (Optional)
                            </label>
                            <input
                              type="text"
                              value={formatNumber(platform.metrics.avgLikes.toString())}
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (/^\d*$/.test(value)) {
                                  updatePlatformMetric(index, 'avgLikes', value);
                                }
                              }}
                              placeholder="500"
                              style={{
                                width: '100%',
                                padding: 'var(--space-3) var(--space-4)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-base)',
                                fontSize: 'var(--text-sm)',
                                outline: 'none',
                                backgroundColor: 'white'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add Platform */}
                <div>
                  <h4 style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Add Another Platform
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: 'var(--space-3)' 
                  }}>
                    {Object.entries(platformConfig)
                      .filter(([key]) => !formData.metrics.platforms.some(p => p.name === key))
                      .map(([key, config]) => {
                        const PlatformIcon = config.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => addPlatform(key)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-3)',
                              padding: 'var(--space-4)',
                              border: '2px dashed var(--color-border)',
                              borderRadius: 'var(--radius-lg)',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              transition: 'all var(--duration-200) ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = config.color;
                              e.target.style.backgroundColor = 'var(--color-neutral-50)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = 'var(--color-border)';
                              e.target.style.backgroundColor = 'white';
                            }}
                          >
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: config.color,
                              borderRadius: 'var(--radius-base)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <PlatformIcon size={16} style={{ color: 'white' }} />
                            </div>
                            <span style={{ 
                              fontSize: 'var(--text-sm)', 
                              fontWeight: 'var(--font-medium)', 
                              color: 'var(--color-text)' 
                            }}>
                              {config.name}
                            </span>
                            <Plus size={16} style={{ color: 'var(--color-text-secondary)' }} />
                          </button>
                        );
                      })}
                  </div>
                  {validationErrors.platforms && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
                        {validationErrors.platforms}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Creator Profile */}
          {currentStep === 3 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Creator Profile
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Tell us about your content niche and background to get more accurate pricing.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                {/* Content Niche */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <TrendingUp size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Content Niche *
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                    gap: 'var(--space-3)' 
                  }}>
                    {niches.map((niche) => (
                      <button
                        key={niche}
                        onClick={() => updateFormData('metrics.niche', niche)}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          border: `2px solid ${formData.metrics.niche === niche ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: formData.metrics.niche === niche ? 'var(--color-primary-50)' : 'white',
                          color: formData.metrics.niche === niche ? 'var(--color-primary-700)' : 'var(--color-text)',
                          fontWeight: formData.metrics.niche === niche ? 'var(--font-semibold)' : 'var(--font-normal)',
                          cursor: 'pointer',
                          transition: 'all var(--duration-200) ease',
                          textTransform: 'capitalize'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.metrics.niche !== niche) {
                            e.target.style.borderColor = 'var(--color-primary-300)';
                            e.target.style.backgroundColor = 'var(--color-primary-25)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.metrics.niche !== niche) {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        {niche.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  {validationErrors.niche && (
                    <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                      {validationErrors.niche}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <MapPin size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Location *
                  </label>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: 'var(--space-4)' 
                  }}>
                    {/* City */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.metrics.location.city}
                        onChange={(e) => updateFormData('metrics.location.city', e.target.value)}
                        placeholder="Mumbai, Delhi, Bangalore..."
                        style={{
                          width: '100%',
                          padding: 'var(--space-3) var(--space-4)',
                          border: `1px solid ${validationErrors.city ? 'var(--color-error)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)',
                          fontSize: 'var(--text-base)',
                          outline: 'none'
                        }}
                      />
                      {validationErrors.city && (
                        <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                          {validationErrors.city}
                        </span>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        State (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.metrics.location.state}
                        onChange={(e) => updateFormData('metrics.location.state', e.target.value)}
                        placeholder="Maharashtra, Karnataka..."
                        style={{
                          width: '100%',
                          padding: 'var(--space-3) var(--space-4)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)',
                          fontSize: 'var(--text-base)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* City Tier */}
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      City Tier *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {cityTiers.map((tier) => (
                        <button
                          key={tier.value}
                          onClick={() => updateFormData('metrics.location.cityTier', tier.value)}
                          style={{
                            padding: 'var(--space-4)',
                            border: `2px solid ${formData.metrics.location.cityTier === tier.value ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: formData.metrics.location.cityTier === tier.value ? 'var(--color-primary-50)' : 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all var(--duration-200) ease'
                          }}
                        >
                          <div style={{ 
                            fontWeight: 'var(--font-semibold)', 
                            color: formData.metrics.location.cityTier === tier.value ? 'var(--color-primary-700)' : 'var(--color-text)',
                            marginBottom: 'var(--space-1)'
                          }}>
                            {tier.label.split('(')[0].trim()}
                          </div>
                          <div style={{ 
                            fontSize: 'var(--text-sm)', 
                            color: 'var(--color-text-secondary)' 
                          }}>
                            {tier.label.split('(')[1]?.replace(')', '') || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Globe size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Content Languages *
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                    gap: 'var(--space-3)' 
                  }}>
                    {languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          border: `2px solid ${formData.metrics.languages.includes(language) ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: formData.metrics.languages.includes(language) ? 'var(--color-primary-50)' : 'white',
                          color: formData.metrics.languages.includes(language) ? 'var(--color-primary-700)' : 'var(--color-text)',
                          fontWeight: formData.metrics.languages.includes(language) ? 'var(--font-semibold)' : 'var(--font-normal)',
                          cursor: 'pointer',
                          transition: 'all var(--duration-200) ease',
                          textTransform: 'capitalize'
                        }}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                  {validationErrors.languages && (
                    <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                      {validationErrors.languages}
                    </span>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Experience Level
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => updateFormData('metrics.experience', level.value)}
                        style={{
                          padding: 'var(--space-4)',
                          border: `2px solid ${formData.metrics.experience === level.value ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: formData.metrics.experience === level.value ? 'var(--color-primary-50)' : 'white',
                          color: formData.metrics.experience === level.value ? 'var(--color-primary-700)' : 'var(--color-text)',
                          fontWeight: formData.metrics.experience === level.value ? 'var(--font-semibold)' : 'var(--font-normal)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all var(--duration-200) ease'
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Review & Create
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Review your information before creating your rate card. AI pricing suggestions will be generated automatically.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                {/* Basic Info Summary */}
                <div style={{
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-neutral-50)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Rate Card Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Title:</span>
                      <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text)' }}>
                        {formData.title}
                      </div>
                    </div>
                    {formData.description && (
                      <div>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Description:</span>
                        <div style={{ color: 'var(--color-text)' }}>
                          {formData.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Platforms Summary */}
                <div style={{
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-neutral-50)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Platform Metrics
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {formData.metrics.platforms.map((platform, index) => {
                      const config = platformConfig[platform.name];
                      const PlatformIcon = config.icon;
                      
                      return (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-4)',
                          padding: 'var(--space-4)',
                          backgroundColor: 'white',
                          borderRadius: 'var(--radius-base)',
                          border: '1px solid var(--color-border)'
                        }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            backgroundColor: config.color,
                            borderRadius: 'var(--radius-base)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PlatformIcon size={16} style={{ color: 'white' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: 'var(--font-medium)', 
                              color: 'var(--color-text)',
                              marginBottom: 'var(--space-1)' 
                            }}>
                              {config.name}
                            </div>
                            <div style={{ 
                              fontSize: 'var(--text-sm)', 
                              color: 'var(--color-text-secondary)' 
                            }}>
                              {formatNumber(platform.metrics.followers)} followers • {platform.metrics.engagementRate}% engagement
                              {platform.metrics.avgViews && ` • ${formatNumber(platform.metrics.avgViews)} avg views`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Profile Summary */}
                <div style={{
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-neutral-50)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Creator Profile
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: 'var(--space-4)' 
                  }}>
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Niche:</span>
                      <div style={{ 
                        fontWeight: 'var(--font-medium)', 
                        color: 'var(--color-text)', 
                        textTransform: 'capitalize' 
                      }}>
                        {formData.metrics.niche}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Location:</span>
                      <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text)' }}>
                        {formData.metrics.location.city}
                        {formData.metrics.location.state && `, ${formData.metrics.location.state}`}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Languages:</span>
                      <div style={{ 
                        fontWeight: 'var(--font-medium)', 
                        color: 'var(--color-text)', 
                        textTransform: 'capitalize' 
                      }}>
                        {formData.metrics.languages.join(', ')}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Experience:</span>
                      <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text)' }}>
                        {experienceLevels.find(l => l.value === formData.metrics.experience)?.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Info Box */}
                <div style={{
                  padding: 'var(--space-6)',
                  background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-secondary-50))',
                  border: '1px solid var(--color-primary-200)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Sparkles size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      AI-Powered Pricing Ready
                    </h4>
                    <p style={{ 
                      color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--leading-relaxed)'
                    }}>
                      Based on your metrics and profile, our AI will generate personalized pricing suggestions 
                      for each platform, considering current market rates, your niche, and location. You'll be 
                      able to review and adjust all suggestions before finalizing your rate card.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: 'var(--space-8)'
          }}>
            {/* Previous Button */}
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-6)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'white',
                color: 'var(--color-text)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.5 : 1,
                transition: 'all var(--duration-200) ease'
              }}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {/* Step Indicator */}
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-medium)'
            }}>
              Step {currentStep} of {steps.length}
            </div>

            {/* Next/Submit Button */}
            <button
              onClick={currentStep === 4 ? handleSubmit : nextStep}
              disabled={isLoading || !isStepValid(currentStep)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-6)',
                background: isLoading || !isStepValid(currentStep) 
                  ? 'var(--color-neutral-300)' 
                  : 'var(--gradient-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 'var(--font-semibold)',
                cursor: isLoading || !isStepValid(currentStep) ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration-200) ease'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : currentStep === 4 ? (
                <>
                  <Sparkles size={16} />
                  Create Rate Card
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRateCard;
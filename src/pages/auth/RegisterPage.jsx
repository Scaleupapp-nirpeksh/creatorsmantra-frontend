// src/pages/auth/RegisterPage.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { 
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Instagram,
  Youtube,
  Briefcase
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, sendOTP, checkPhone, isLoading } = useAuthStore();
  
  // Check if coming from OTP verification
  const { phone: verifiedPhone, otpVerified } = location.state || {};
  
  // Debug logging
  console.log('RegisterPage - Location State:', location.state);
  
  // State management - Initialize based on verification status
  const [currentStep, setCurrentStep] = useState(() => {
    const initialStep = verifiedPhone && otpVerified ? 2 : 1;
    console.log('Initial step:', initialStep);
    return initialStep;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(() => {
    return !!(verifiedPhone && otpVerified);
  });
  const [formData, setFormData] = useState(() => ({
    phone: verifiedPhone || ''
  }));
  
  // Debug: Log step changes
  useEffect(() => {
    console.log('Current step changed to:', currentStep);
    console.log('Phone checked status:', phoneChecked);
    console.log('Form data:', formData);
  }, [currentStep, phoneChecked, formData]);
  
  // React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      phone: verifiedPhone || '',
      creatorType: 'lifestyle',
      fullName: '',
      email: '',
      password: '',
      instagram_username: '',
      instagram_followers: '',
      youtube_channel: '',
      youtube_subscribers: ''
    }
  });
  
  // Creator type options
  const creatorTypes = [
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { value: 'fashion', label: 'Fashion', icon: '👗' },
    { value: 'beauty', label: 'Beauty', icon: '💄' },
    { value: 'tech', label: 'Technology', icon: '💻' },
    { value: 'food', label: 'Food', icon: '🍕' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'comedy', label: 'Comedy', icon: '😄' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'other', label: 'Other', icon: '🎨' }
  ];
  
  // Handle verified phone on component mount
  useEffect(() => {
    if (location.state?.phone && location.state?.otpVerified === true) {
      console.log('Phone verified, moving to step 2');
      
      // Update form value
      setValue('phone', location.state.phone);
      
      // Update states
      setPhoneChecked(true);
      setCurrentStep(2);
      
      // Save to formData
      setFormData(prev => ({
        ...prev,
        phone: location.state.phone
      }));
      
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, []); // Run only once on mount
  
  // Step 1: Phone Verification
  const handlePhoneVerification = async (data) => {
    console.log('Starting phone verification for:', data.phone);
    try {
      // Check if phone exists
      const result = await checkPhone(data.phone);
      
      if (result.exists) {
        toast.error('An account already exists with this phone number');
        return false;
      }
      
      // Send OTP
      const otpResult = await sendOTP(data.phone);
      
      if (otpResult.success) {
        // Navigate to OTP verification
        navigate('/verify-otp', {
          state: {
            phone: data.phone,
            purpose: 'registration',
            from: '/register'
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Phone verification error:', error);
      toast.error(error.message || 'Failed to send OTP');
      return false;
    }
  };
  
  // Step Navigation
  const handleNextStep = async () => {
    console.log('=== Handle Next Step Called ===');
    console.log('Current Step:', currentStep);
    console.log('Phone Checked:', phoneChecked);
    
    // Validate current step fields
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['phone'];
      const isValid = await trigger(fieldsToValidate);
      console.log('Step 1 validation result:', isValid);
      
      if (isValid && !phoneChecked) {
        await handlePhoneVerification(getValues());
        // Don't proceed further - navigation will happen
        return;
      }
      
      // Only continue to next step if phone is already verified
      if (!phoneChecked) {
        toast.error('Please verify your phone number first');
        return;
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['fullName', 'email', 'password'];
      const isValid = await trigger(fieldsToValidate);
      console.log('Step 2 validation result:', isValid);
      console.log('Step 2 field values:', {
        fullName: getValues('fullName'),
        email: getValues('email'),
        password: getValues('password')
      });
      console.log('Step 2 validation errors:', errors);
      
      if (!isValid) {
        console.log('Step 2 validation failed, not proceeding');
        return;
      }
    }
    
    // Save current step data
    const currentData = getValues();
    console.log('Saving current data:', currentData);
    setFormData(prev => {
      const newData = { ...prev, ...currentData };
      console.log('Updated form data:', newData);
      return newData;
    });
    
    // Move to next step
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      console.log('Moving from step', currentStep, 'to step', nextStep);
      setCurrentStep(nextStep);
    } else {
      console.log('Already at final step');
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      console.log('Going back from step', currentStep, 'to step', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Final Registration
  const onSubmit = async (data) => {
    console.log('Final submission started');
    console.log('Submit data:', data);
    
    try {
      // Ensure we have the phone number
      const finalData = {
        ...formData,
        ...data
      };
      
      console.log('Final merged data:', finalData);
      
      // Prepare registration data
      const registrationData = {
        phone: finalData.phone,
        fullName: finalData.fullName,
        email: finalData.email,
        password: finalData.password,
        userType: 'creator',
        creatorType: finalData.creatorType,
        socialProfiles: {
          instagram: {
            username: finalData.instagram_username || '',
            followersCount: parseInt(finalData.instagram_followers) || 0,
            avgLikes: Math.floor((parseInt(finalData.instagram_followers) || 0) * 0.03),
            avgComments: Math.floor((parseInt(finalData.instagram_followers) || 0) * 0.005)
          },
          youtube: {
            channelName: finalData.youtube_channel || '',
            subscribersCount: parseInt(finalData.youtube_subscribers) || 0,
            avgViews: Math.floor((parseInt(finalData.youtube_subscribers) || 0) * 0.1)
          }
        }
      };
      
      console.log('Submitting registration data:', registrationData);
      
      const result = await registerUser(registrationData);
      
      if (result.success) {
        console.log('Registration successful!');
        toast.success('Registration successful! Welcome to CreatorsMantra!');
        navigate('/dashboard');
      } else {
        console.log('Registration failed:', result);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    }
  };
  
  // Progress indicator
  const renderProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${(currentStep / 3) * 100}%`
          }}
        />
      </div>
      <div style={styles.progressSteps}>
        {[1, 2, 3].map((step) => (
          <div 
            key={step}
            style={{
              ...styles.progressStep,
              ...(step <= currentStep ? styles.progressStepActive : {})
            }}
          >
            {step < currentStep ? (
              <CheckCircle size={20} />
            ) : (
              <span>{step}</span>
            )}
          </div>
        ))}
      </div>
      <div style={styles.progressLabels}>
        <span style={currentStep >= 1 ? styles.progressLabelActive : {}}>Verify Phone</span>
        <span style={currentStep >= 2 ? styles.progressLabelActive : {}}>Basic Info</span>
        <span style={currentStep >= 3 ? styles.progressLabelActive : {}}>Creator Profile</span>
      </div>
    </div>
  );
  
  // Inline styles (keeping same as original)
  const styles = {
    container: {
      maxWidth: '520px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem',
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '0.5rem',
    },
    
    subtitle: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    
    progressContainer: {
      marginBottom: '2rem',
    },
    
    progressBar: {
      height: '4px',
      background: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '1rem',
    },
    
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      transition: 'width 0.3s ease',
    },
    
    progressSteps: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    
    progressStep: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#9ca3af',
      transition: 'all 0.3s ease',
    },
    
    progressStepActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    
    progressLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    
    progressLabelActive: {
      color: '#667eea',
      fontWeight: '600',
    },
    
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    
    stepContent: {
      minHeight: '400px',
    },
    
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    required: {
      color: '#ef4444',
    },
    
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingLeft: '2.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      background: 'white',
      outline: 'none',
    },
    
    inputError: {
      borderColor: '#ef4444',
    },
    
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      color: '#9ca3af',
      pointerEvents: 'none',
    },
    
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '0.25rem',
    },
    
    error: {
      fontSize: '0.75rem',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    
    creatorTypeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.75rem',
      marginTop: '0.5rem',
    },
    
    creatorTypeOption: {
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
    },
    
    creatorTypeOptionSelected: {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.05)',
    },
    
    creatorTypeIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem',
    },
    
    creatorTypeLabel: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#374151',
    },
    
    socialSection: {
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '12px',
      marginBottom: '1rem',
    },
    
    socialHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
    },
    
    socialInputGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    
    backButton: {
      padding: '0.875rem 1.5rem',
      background: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    nextButton: {
      flex: 1,
      padding: '0.875rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    
    helpText: {
      fontSize: '0.75rem',
      color: '#6b7280',
      fontStyle: 'italic',
    },
    
    loginLink: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '2rem',
    },
    
    loginLinkAnchor: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
    },
    
    benefitsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      background: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '12px',
      marginTop: '1rem',
    },
    
    benefit: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: '#374151',
    },
    
    benefitIcon: {
      color: '#10b981',
    },
  };
  
  // Add debug display
  return (
    <div style={styles.container}>
      {/* Debug Info Box */}
      <div style={{
        background: '#f3f4f6',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        fontFamily: 'monospace'
      }}>
        <strong>DEBUG INFO:</strong><br />
        Current Step: {currentStep}<br />
        Phone Checked: {phoneChecked ? 'Yes' : 'No'}<br />
        Phone: {formData.phone || 'Not set'}<br />
        Is Loading: {isLoading ? 'Yes' : 'No'}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {currentStep === 1 ? 'Get Started' : 
             currentStep === 2 ? 'Create Your Account' : 
             'Setup Your Profile'}
          </h1>
          <p style={styles.subtitle}>
            {currentStep === 1 ? 'First, let\'s verify your phone number' :
             currentStep === 2 ? 'Tell us about yourself' :
             'Help brands discover you better'}
          </p>
        </div>
        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <AnimatePresence mode="wait">
            {/* Step 1: Phone Verification */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={styles.stepContent}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Phone size={16} />
                    Phone Number
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Phone size={20} style={styles.inputIcon} />
                    <input
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      style={{
                        ...styles.input,
                        ...(errors.phone ? styles.inputError : {})
                      }}
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Please enter a valid Indian phone number'
                        }
                      })}
                      maxLength={10}
                      disabled={phoneChecked}
                    />
                  </div>
                  {errors.phone && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.phone.message}
                    </span>
                  )}
                  <p style={styles.helpText}>
                    {phoneChecked 
                      ? '✓ Phone number verified' 
                      : 'We\'ll send you an OTP to verify your number'}
                  </p>
                </div>
                
                {/* Benefits */}
                <div style={styles.benefitsList}>
                  <div style={styles.benefit}>
                    <CheckCircle size={16} style={styles.benefitIcon} />
                    <span>14-day free trial, no credit card required</span>
                  </div>
                  <div style={styles.benefit}>
                    <CheckCircle size={16} style={styles.benefitIcon} />
                    <span>Cancel anytime, no questions asked</span>
                  </div>
                  <div style={styles.benefit}>
                    <CheckCircle size={16} style={styles.benefitIcon} />
                    <span>Join 10,000+ creators already using CreatorsMantra</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={styles.stepContent}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <User size={16} />
                    Full Name
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <User size={20} style={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      style={{
                        ...styles.input,
                        ...(errors.fullName ? styles.inputError : {})
                      }}
                      {...register('fullName', {
                        required: 'Full name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                  </div>
                  {errors.fullName && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.fullName.message}
                    </span>
                  )}
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Mail size={16} />
                    Email Address
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Mail size={20} style={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      style={{
                        ...styles.input,
                        ...(errors.email ? styles.inputError : {})
                      }}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.email.message}
                    </span>
                  )}
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Lock size={16} />
                    Password
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={20} style={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      style={{
                        ...styles.input,
                        paddingRight: '3rem',
                        ...(errors.password ? styles.inputError : {})
                      }}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: 'Password must contain uppercase, lowercase, number and special character'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.passwordToggle}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.password.message}
                    </span>
                  )}
                  <p style={styles.helpText}>
                    Must contain uppercase, lowercase, number and special character
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Creator Profile */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={styles.stepContent}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Briefcase size={16} />
                    Creator Type
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.creatorTypeGrid}>
                    {creatorTypes.map((type) => (
                      <label
                        key={type.value}
                        style={{
                          ...styles.creatorTypeOption,
                          ...(watch('creatorType') === type.value 
                            ? styles.creatorTypeOptionSelected 
                            : {})
                        }}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          {...register('creatorType', {
                            required: 'Please select your creator type'
                          })}
                          style={{ display: 'none' }}
                        />
                        <div style={styles.creatorTypeIcon}>{type.icon}</div>
                        <div style={styles.creatorTypeLabel}>{type.label}</div>
                      </label>
                    ))}
                  </div>
                  {errors.creatorType && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.creatorType.message}
                    </span>
                  )}
                </div>
                
                {/* Instagram Section */}
                <div style={styles.socialSection}>
                  <div style={styles.socialHeader}>
                    <Instagram size={20} color="#E4405F" />
                    Instagram (Optional)
                  </div>
                  <div style={styles.socialInputGroup}>
                    <div style={styles.inputGroup}>
                      <input
                        type="text"
                        placeholder="Username (without @)"
                        style={{ ...styles.input, paddingLeft: '1rem' }}
                        {...register('instagram_username', {
                          pattern: {
                            value: /^[a-zA-Z0-9._]{0,30}$/,
                            message: 'Invalid Instagram username'
                          }
                        })}
                      />
                      {errors.instagram_username && (
                        <span style={styles.error}>
                          {errors.instagram_username.message}
                        </span>
                      )}
                    </div>
                    <div style={styles.inputGroup}>
                      <input
                        type="number"
                        placeholder="Followers count"
                        style={{ ...styles.input, paddingLeft: '1rem' }}
                        {...register('instagram_followers', {
                          min: {
                            value: 0,
                            message: 'Invalid follower count'
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* YouTube Section */}
                <div style={styles.socialSection}>
                  <div style={styles.socialHeader}>
                    <Youtube size={20} color="#FF0000" />
                    YouTube (Optional)
                  </div>
                  <div style={styles.socialInputGroup}>
                    <div style={styles.inputGroup}>
                      <input
                        type="text"
                        placeholder="Channel name"
                        style={{ ...styles.input, paddingLeft: '1rem' }}
                        {...register('youtube_channel')}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <input
                        type="number"
                        placeholder="Subscribers count"
                        style={{ ...styles.input, paddingLeft: '1rem' }}
                        {...register('youtube_subscribers', {
                          min: {
                            value: 0,
                            message: 'Invalid subscriber count'
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <p style={styles.helpText}>
                  Don't worry, you can update these details anytime from your profile settings
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div style={styles.buttonGroup}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                style={styles.backButton}
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                style={{
                  ...styles.nextButton,
                  ...(isLoading ? styles.buttonDisabled : {})
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === 1 && !phoneChecked ? 'Verify Phone' : 'Next'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                style={{
                  ...styles.nextButton,
                  ...(isSubmitting || isLoading ? styles.buttonDisabled : {})
                }}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
        
        {/* Login Link */}
        <div style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLinkAnchor}>
            Login here
          </Link>
        </div>
      </motion.div>
      
      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
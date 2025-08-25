// src/pages/auth/RegisterPage.jsx - Complete Fixed Version
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
  Briefcase,
  Shield
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, sendOTP, checkPhone, isLoading } = useAuthStore();
  
  // Check if coming from OTP verification
  const { phone: verifiedPhone, otpVerified } = location.state || {};
  
  // State management - Initialize based on verification status
  const [currentStep, setCurrentStep] = useState(() => {
    const initialStep = verifiedPhone && otpVerified ? 2 : 1;
    return initialStep;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(() => {
    return !!(verifiedPhone && otpVerified);
  });
  const [formData, setFormData] = useState(() => ({
    phone: verifiedPhone || ''
  }));
  
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
      confirmPassword: '',
      instagram_username: '',
      instagram_followers: '',
      youtube_channel: '',
      youtube_subscribers: ''
    }
  });
  
  // Extended Creator type options
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
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'home_decor', label: 'Home Decor', icon: '🏠' },
    { value: 'art', label: 'Art & DIY', icon: '🎨' },
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'dance', label: 'Dance', icon: '💃' },
    { value: 'parenting', label: 'Parenting', icon: '👶' },
    { value: 'pets', label: 'Pets', icon: '🐾' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'automobile', label: 'Automobile', icon: '🚗' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];
  
  // Handle verified phone on component mount
  useEffect(() => {
    if (location.state?.phone && location.state?.otpVerified === true) {
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
    try {
      // Check if phone exists
      const result = await checkPhone(data.phone);
      
      if (result.exists) {
        toast.error('An account already exists with this phone number');
        return false;
      }
      
      // Send OTP with 'registration' purpose
      const otpResult = await sendOTP(data.phone, 'registration');
      
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
    // Validate current step fields
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['phone'];
      const isValid = await trigger(fieldsToValidate);
      
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
      fieldsToValidate = ['fullName', 'email', 'password', 'confirmPassword'];
      const isValid = await trigger(fieldsToValidate);
      
      if (!isValid) {
        toast.error('Please fill all required fields correctly');
        return;
      }
    }
    
    // Save current step data
    const currentData = getValues();
    setFormData(prev => {
      const newData = { ...prev, ...currentData };
      return newData;
    });
    
    // Move to next step
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Final Registration - Only called when explicitly clicking Complete Registration
  const handleFinalSubmit = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Get all form values
    const data = getValues();
    
    try {
      // Ensure we have the phone number
      const finalData = {
        ...formData,
        ...data
      };
      
      // Validate required fields
      if (!finalData.creatorType) {
        toast.error('Please select a creator type');
        return;
      }
      
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
        toast.success('Registration successful! Welcome to CreatorsMantra!');
        navigate('/dashboard');
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
  
  // Inline styles
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
      maxHeight: '300px',
      overflowY: 'auto',
      padding: '0.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
    },
    
    creatorTypeOption: {
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
      userSelect: 'none',
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
      fontSize: '0.7rem',
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
    
    passwordStrength: {
      marginTop: '0.5rem',
      padding: '0.75rem',
      background: '#f3f4f6',
      borderRadius: '8px',
    },
    
    passwordStrengthBar: {
      height: '4px',
      background: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    },
    
    passwordStrengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
    },
    
    passwordRequirements: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    
    requirement: {
      fontSize: '0.7rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
  };
  
  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return (strength / 5) * 100;
  };
  
  const passwordValue = watch('password');
  const passwordStrength = calculatePasswordStrength(passwordValue);
  
  return (
    <div style={styles.container}>
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
        
        {/* Form - REMOVED onSubmit to prevent auto-submission */}
        <div style={styles.form}>
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
                  
                  {/* Password Strength Indicator */}
                  {passwordValue && (
                    <div style={styles.passwordStrength}>
                      <div style={styles.passwordStrengthBar}>
                        <div 
                          style={{
                            ...styles.passwordStrengthFill,
                            width: `${passwordStrength}%`,
                            background: passwordStrength < 40 ? '#ef4444' : 
                                      passwordStrength < 70 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                      <div style={styles.passwordRequirements}>
                        <span style={{
                          ...styles.requirement,
                          color: passwordValue.length >= 8 ? '#10b981' : '#9ca3af'
                        }}>
                          <CheckCircle size={12} /> 8+ characters
                        </span>
                        <span style={{
                          ...styles.requirement,
                          color: /[A-Z]/.test(passwordValue) ? '#10b981' : '#9ca3af'
                        }}>
                          <CheckCircle size={12} /> Uppercase
                        </span>
                        <span style={{
                          ...styles.requirement,
                          color: /[a-z]/.test(passwordValue) ? '#10b981' : '#9ca3af'
                        }}>
                          <CheckCircle size={12} /> Lowercase
                        </span>
                        <span style={{
                          ...styles.requirement,
                          color: /[0-9]/.test(passwordValue) ? '#10b981' : '#9ca3af'
                        }}>
                          <CheckCircle size={12} /> Number
                        </span>
                        <span style={{
                          ...styles.requirement,
                          color: /[@$!%*?&]/.test(passwordValue) ? '#10b981' : '#9ca3af'
                        }}>
                          <CheckCircle size={12} /> Special char
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Shield size={16} />
                    Confirm Password
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Shield size={20} style={styles.inputIcon} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      style={{
                        ...styles.input,
                        paddingRight: '3rem',
                        ...(errors.confirmPassword ? styles.inputError : {})
                      }}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => 
                          value === watch('password') || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.passwordToggle}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.confirmPassword.message}
                    </span>
                  )}
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
                    Select Your Content Category
                    <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.creatorTypeGrid}>
                    {creatorTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setValue('creatorType', type.value);
                        }}
                        style={{
                          ...styles.creatorTypeOption,
                          ...(watch('creatorType') === type.value 
                            ? styles.creatorTypeOptionSelected 
                            : {})
                        }}
                      >
                        <div style={styles.creatorTypeIcon}>{type.icon}</div>
                        <div style={styles.creatorTypeLabel}>{type.label}</div>
                      </div>
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
                type="button"
                onClick={handleFinalSubmit}
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
        </div>
        
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
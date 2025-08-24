// src/pages/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import  useAuthStore  from '../../store/authStore';
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
  Users,
  TrendingUp,
  Sparkles,
  Shield,
  ChevronDown
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, sendOTP, checkPhoneExists, isLoading } = useAuthStore();
  
  // Check if coming from OTP verification
  const { phone: verifiedPhone, otpVerified } = location.state || {};
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [formData, setFormData] = useState({});
  
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
      socialProfiles: {
        instagram: { username: '', followersCount: 0 },
        youtube: { channelName: '', subscribersCount: 0 }
      }
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
  
  // Set verified phone if available
  useEffect(() => {
    if (verifiedPhone && otpVerified) {
      setValue('phone', verifiedPhone);
      setPhoneChecked(true);
      setCurrentStep(2); // Skip phone verification step
    }
  }, [verifiedPhone, otpVerified, setValue]);
  
  // Step 1: Phone Verification
  const handlePhoneVerification = async (data) => {
    try {
      // Check if phone exists
      const result = await checkPhoneExists(data.phone);
      
      if (result.exists) {
        toast.error('An account already exists with this phone number');
        return false;
      }
      
      // Send OTP
      const otpResult = await sendOTP(data.phone, 'registration');
      
      if (otpResult.success) {
        toast.success('OTP sent successfully!');
        
        // Navigate to OTP verification
        navigate('/verify-otp', {
          state: {
            phone: data.phone,
            purpose: 'registration',
            from: '/register'
          }
        });
      }
      
      return true;
    } catch (error) {
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
        const success = await handlePhoneVerification(getValues());
        if (!success) return;
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['fullName', 'email', 'password'];
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    
    // Save current step data
    const currentData = getValues();
    setFormData({ ...formData, ...currentData });
    
    // Move to next step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Final Registration
  const onSubmit = async (data) => {
    try {
      // Prepare registration data
      const registrationData = {
        ...data,
        userType: 'creator',
        socialProfiles: {
          instagram: {
            username: data.instagram_username || '',
            followersCount: parseInt(data.instagram_followers) || 0,
            avgLikes: Math.floor((parseInt(data.instagram_followers) || 0) * 0.03), // 3% engagement estimate
            avgComments: Math.floor((parseInt(data.instagram_followers) || 0) * 0.005) // 0.5% comment rate
          },
          youtube: {
            channelName: data.youtube_channel || '',
            subscribersCount: parseInt(data.youtube_subscribers) || 0,
            avgViews: Math.floor((parseInt(data.youtube_subscribers) || 0) * 0.1) // 10% view rate estimate
          }
        }
      };
      
      const result = await registerUser(registrationData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to CreatorsMantra!');
        navigate('/dashboard');
      }
    } catch (error) {
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
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--color-neutral-900)',
      marginBottom: '0.5rem',
    },
    
    subtitle: {
      fontSize: '1rem',
      color: 'var(--color-neutral-600)',
    },
    
    progressContainer: {
      marginBottom: '2rem',
    },
    
    progressBar: {
      height: '4px',
      background: 'var(--color-neutral-200)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '1rem',
    },
    
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
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
      background: 'var(--color-neutral-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-500)',
      transition: 'all 0.3s ease',
    },
    
    progressStepActive: {
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
      color: 'white',
    },
    
    progressLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
    },
    
    progressLabelActive: {
      color: 'var(--color-primary-600)',
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
      color: 'var(--color-neutral-700)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    required: {
      color: 'var(--color-error)',
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
      border: '1px solid var(--color-neutral-300)',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      background: 'white',
    },
    
    inputError: {
      borderColor: 'var(--color-error)',
    },
    
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      color: 'var(--color-neutral-400)',
      pointerEvents: 'none',
    },
    
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      background: 'none',
      border: 'none',
      color: 'var(--color-neutral-400)',
      cursor: 'pointer',
      padding: '0.25rem',
    },
    
    error: {
      fontSize: '0.75rem',
      color: 'var(--color-error)',
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
      border: '2px solid var(--color-neutral-200)',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
    },
    
    creatorTypeOptionSelected: {
      borderColor: 'var(--color-primary-500)',
      background: 'rgba(102, 126, 234, 0.05)',
    },
    
    creatorTypeIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem',
    },
    
    creatorTypeLabel: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--color-neutral-700)',
    },
    
    socialSection: {
      padding: '1rem',
      background: 'var(--color-neutral-50)',
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
      color: 'var(--color-neutral-700)',
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
      color: 'var(--color-neutral-700)',
      border: '1px solid var(--color-neutral-300)',
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
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
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
      color: 'var(--color-neutral-500)',
      fontStyle: 'italic',
    },
    
    loginLink: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
      marginTop: '2rem',
    },
    
    loginLinkAnchor: {
      color: 'var(--color-primary-600)',
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
      color: 'var(--color-neutral-700)',
    },
    
    benefitIcon: {
      color: 'var(--color-success)',
    },
  };
  
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
                    We'll send you an OTP to verify your number
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
                        style={styles.input}
                        {...register('instagram_username', {
                          pattern: {
                            value: /^[a-zA-Z0-9._]{1,30}$/,
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
                        style={styles.input}
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
                        style={styles.input}
                        {...register('youtube_channel')}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <input
                        type="number"
                        placeholder="Subscribers count"
                        style={styles.input}
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
                    {currentStep === 1 ? 'Verify Phone' : 'Next'}
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
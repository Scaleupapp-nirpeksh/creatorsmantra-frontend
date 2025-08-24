// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import  useAuthStore  from '../../store/authStore';
import { 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Key,
  ChevronLeft
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, loginWithPassword, isLoading } = useAuthStore();
  
  // State management
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Get redirect URL from location state
  const from = location.state?.from || '/dashboard';
  const message = location.state?.message;

  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch,
    setValue,
    clearErrors
  } = useForm({
    mode: 'onBlur'
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Show message from redirect
  useEffect(() => {
    if (message) {
      toast.error(message);
    }
  }, [message]);

  // Handle OTP Send
  const handleSendOTP = async (data) => {
    try {
      const phone = data.phone.replace(/\D/g, ''); // Remove non-digits
      
      if (phone.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      const result = await sendOTP(phone, 'login');
      
      if (result.success) {
        setOtpSent(true);
        setPhoneNumber(phone);
        setCountdown(120); // 2 minutes countdown
        toast.success('OTP sent successfully! Check your SMS.');
        
        // Navigate to OTP verification page
        navigate('/verify-otp', { 
          state: { 
            phone, 
            purpose: 'login',
            from 
          } 
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  // Handle Password Login
  const handlePasswordLogin = async (data) => {
    try {
      const result = await loginWithPassword(data.identifier, data.password);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Check if redirect after login exists
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate(from);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    }
  };

  // Form submit handler
  const onSubmit = (data) => {
    if (loginMethod === 'otp') {
      return handleSendOTP(data);
    } else {
      return handlePasswordLogin(data);
    }
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '440px',
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
    
    methodToggle: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.25rem',
      background: 'var(--color-neutral-100)',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    
    methodButton: {
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      background: 'transparent',
      color: 'var(--color-neutral-600)',
    },
    
    methodButtonActive: {
      background: 'white',
      color: 'var(--color-primary-600)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
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
    
    forgotPassword: {
      alignSelf: 'flex-end',
      fontSize: '0.875rem',
      color: 'var(--color-primary-600)',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    submitButton: {
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
    
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '1.5rem 0',
    },
    
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'var(--color-neutral-200)',
    },
    
    dividerText: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-500)',
      fontWeight: '500',
    },
    
    signupLink: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },
    
    signupLinkAnchor: {
      color: 'var(--color-primary-600)',
      textDecoration: 'none',
      fontWeight: '600',
    },
    
    features: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1.5rem',
      background: 'var(--color-neutral-50)',
      borderRadius: '12px',
      marginTop: '2rem',
    },
    
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-700)',
    },
    
    featureIcon: {
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
          <h1 style={styles.title}>Welcome Back!</h1>
          <p style={styles.subtitle}>
            Login to manage your creator business
          </p>
        </div>

        {/* Login Method Toggle */}
        <div style={styles.methodToggle}>
          <button
            type="button"
            style={{
              ...styles.methodButton,
              ...(loginMethod === 'otp' ? styles.methodButtonActive : {})
            }}
            onClick={() => {
              setLoginMethod('otp');
              clearErrors();
            }}
          >
            <Smartphone size={18} />
            OTP Login
          </button>
          <button
            type="button"
            style={{
              ...styles.methodButton,
              ...(loginMethod === 'password' ? styles.methodButtonActive : {})
            }}
            onClick={() => {
              setLoginMethod('password');
              clearErrors();
            }}
          >
            <Key size={18} />
            Password
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <AnimatePresence mode="wait">
            {loginMethod === 'otp' ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Phone size={16} />
                    Phone Number
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
                    />
                  </div>
                  {errors.phone && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Mail size={16} />
                    Email or Phone
                  </label>
                  <div style={styles.inputWrapper}>
                    <Mail size={20} style={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Enter email or phone number"
                      style={{
                        ...styles.input,
                        ...(errors.identifier ? styles.inputError : {})
                      }}
                      {...register('identifier', {
                        required: 'Email or phone is required'
                      })}
                    />
                  </div>
                  {errors.identifier && (
                    <span style={styles.error}>
                      <AlertCircle size={14} />
                      {errors.identifier.message}
                    </span>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Lock size={16} />
                    Password
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={20} style={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                </div>

                <Link to="/forgot-password" style={styles.forgotPassword}>
                  Forgot Password?
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            style={{
              ...styles.submitButton,
              ...(isSubmitting || isLoading ? styles.submitButtonDisabled : {})
            }}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {loginMethod === 'otp' ? 'Sending OTP...' : 'Logging in...'}
              </>
            ) : (
              <>
                {loginMethod === 'otp' ? 'Send OTP' : 'Login'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>New to CreatorsMantra?</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Sign Up Link */}
        <div style={styles.signupLink}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.signupLinkAnchor}>
            Sign up for free
          </Link>
        </div>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <CheckCircle size={16} style={styles.featureIcon} />
            <span>14-day free trial, no credit card required</span>
          </div>
          <div style={styles.feature}>
            <CheckCircle size={16} style={styles.featureIcon} />
            <span>Trusted by 10,000+ Indian creators</span>
          </div>
          <div style={styles.feature}>
            <CheckCircle size={16} style={styles.featureIcon} />
            <span>Bank-grade security for your data</span>
          </div>
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

export default LoginPage;
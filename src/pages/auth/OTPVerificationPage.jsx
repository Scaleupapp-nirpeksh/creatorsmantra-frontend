// src/pages/auth/OTPVerificationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import  useAuthStore  from '../../store/authStore';
import { 
  Shield, 
  ArrowRight, 
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Clock,
  Edit2,
  ChevronLeft
} from 'lucide-react';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP, loginWithOTP, isLoading } = useAuthStore();
  
  // Get phone and purpose from navigation state
  const { phone, purpose = 'login', from = '/dashboard' } = location.state || {};
  
  // State management
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  // Refs for OTP inputs
  const inputRefs = useRef([]);
  
  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      toast.error('Phone number is required');
      navigate('/login');
    }
  }, [phone, navigate]);
  
  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);
  
  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits entered
    if (index === 5 && value) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 6) {
        handleVerifyOTP(completeOtp);
      }
    }
  };
  
  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste(e);
    }
  };
  
  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits) {
      const newOtp = digits.split('').concat(Array(6 - digits.length).fill(''));
      setOtp(newOtp);
      
      // Focus appropriate input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-submit if complete
      if (digits.length === 6) {
        handleVerifyOTP(digits);
      }
    }
  };
  
  // Verify OTP
  const handleVerifyOTP = async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    
    if (attempts >= maxAttempts) {
      toast.error('Too many failed attempts. Please request a new OTP.');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      let result;
      
      if (purpose === 'login') {
        // Direct login with OTP
        result = await loginWithOTP(phone, code);
      } else {
        // Just verify OTP for registration/reset
        result = await verifyOTP(phone, code, purpose);
      }
      
      if (result.success) {
        toast.success('OTP verified successfully!');
        
        if (purpose === 'login') {
          // Check for redirect path
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
          } else {
            navigate(from);
          }
        } else if (purpose === 'registration') {
          // Go to registration form with verified phone
          navigate('/register', { 
            state: { 
              phone, 
              otpVerified: true 
            } 
          });
        } else if (purpose === 'password_reset') {
          // Go to password reset form
          navigate('/reset-password', { 
            state: { 
              phone, 
              otpVerified: true 
            } 
          });
        }
      }
    } catch (error) {
      setAttempts(attempts + 1);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      if (attempts + 1 >= maxAttempts) {
        toast.error('Too many failed attempts. Please request a new OTP.');
      } else {
        toast.error(error.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      const result = await sendOTP(phone, purpose);
      
      if (result.success) {
        toast.success('New OTP sent successfully!');
        setCountdown(120);
        setCanResend(false);
        setAttempts(0);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };
  
  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format phone number for display
  const formatPhone = (phoneNumber) => {
    if (!phoneNumber) return '';
    return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
  };
  
  // Inline styles
  const styles = {
    container: {
      maxWidth: '440px',
      width: '100%',
      margin: '0 auto',
    },
    
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--color-neutral-600)',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '2rem',
      transition: 'color 0.2s ease',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    
    iconWrapper: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    icon: {
      color: 'var(--color-primary-600)',
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
      lineHeight: '1.5',
    },
    
    phoneDisplay: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'var(--color-neutral-100)',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--color-neutral-800)',
      marginTop: '0.5rem',
    },
    
    editButton: {
      background: 'none',
      border: 'none',
      color: 'var(--color-primary-600)',
      cursor: 'pointer',
      padding: '0.25rem',
    },
    
    otpContainer: {
      marginTop: '2rem',
      marginBottom: '2rem',
    },
    
    otpInputs: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      marginBottom: '1rem',
    },
    
    otpInput: {
      width: '50px',
      height: '56px',
      border: '2px solid var(--color-neutral-300)',
      borderRadius: '12px',
      fontSize: '1.5rem',
      fontWeight: '600',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      background: 'white',
      color: 'var(--color-neutral-900)',
    },
    
    otpInputFocus: {
      borderColor: 'var(--color-primary-500)',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    
    otpInputFilled: {
      borderColor: 'var(--color-primary-500)',
      background: 'rgba(102, 126, 234, 0.05)',
    },
    
    otpInputError: {
      borderColor: 'var(--color-error)',
      background: 'rgba(239, 68, 68, 0.05)',
    },
    
    attemptsWarning: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem',
      background: 'rgba(251, 191, 36, 0.1)',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      color: 'var(--color-warning-dark)',
    },
    
    resendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '2rem',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },
    
    countdown: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      color: 'var(--color-primary-600)',
    },
    
    resendButton: {
      background: 'none',
      border: 'none',
      color: 'var(--color-primary-600)',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'color 0.2s ease',
    },
    
    resendButtonDisabled: {
      color: 'var(--color-neutral-400)',
      cursor: 'not-allowed',
    },
    
    submitButton: {
      width: '100%',
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
    
    securityNote: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      background: 'var(--color-neutral-50)',
      borderRadius: '8px',
      marginTop: '2rem',
    },
    
    securityIcon: {
      color: 'var(--color-success)',
      flexShrink: 0,
      marginTop: '2px',
    },
    
    securityText: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-600)',
      lineHeight: '1.5',
    },
  };
  
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          style={styles.backButton}
        >
          <ChevronLeft size={16} />
          Back to login
        </button>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <Shield size={40} style={styles.icon} />
          </div>
          
          <h1 style={styles.title}>Verify Your Phone</h1>
          <p style={styles.subtitle}>
            We've sent a 6-digit code to your phone number
          </p>
          
          <div style={styles.phoneDisplay}>
            <Phone size={16} />
            <span>{formatPhone(phone)}</span>
            <button
              onClick={() => navigate('/login')}
              style={styles.editButton}
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        
        {/* OTP Input */}
        <div style={styles.otpContainer}>
          <div style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{
                  ...styles.otpInput,
                  ...(digit ? styles.otpInputFilled : {}),
                  ...(attempts >= maxAttempts ? styles.otpInputError : {}),
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.style.borderColor = 'var(--color-neutral-300)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                disabled={isVerifying || isLoading}
              />
            ))}
          </div>
          
          {/* Attempts Warning */}
          {attempts > 0 && attempts < maxAttempts && (
            <div style={styles.attemptsWarning}>
              <AlertCircle size={16} />
              <span>
                {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? 's' : ''} remaining
              </span>
            </div>
          )}
        </div>
        
        {/* Resend OTP */}
        <div style={styles.resendContainer}>
          {!canResend ? (
            <div style={styles.countdown}>
              <Clock size={16} />
              <span>Resend OTP in {formatTime(countdown)}</span>
            </div>
          ) : (
            <button
              onClick={handleResendOTP}
              style={{
                ...styles.resendButton,
                ...(isLoading ? styles.resendButtonDisabled : {})
              }}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              Resend OTP
            </button>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          onClick={() => handleVerifyOTP()}
          disabled={isVerifying || isLoading || otp.join('').length !== 6}
          style={{
            ...styles.submitButton,
            ...(isVerifying || isLoading || otp.join('').length !== 6 
              ? styles.submitButtonDisabled 
              : {})
          }}
        >
          {isVerifying || isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify OTP
              <ArrowRight size={20} />
            </>
          )}
        </button>
        
        {/* Security Note */}
        <div style={styles.securityNote}>
          <CheckCircle size={16} style={styles.securityIcon} />
          <div style={styles.securityText}>
            <strong>Your security is our priority</strong>
            <br />
            We use OTP verification to ensure only you can access your account. 
            Never share your OTP with anyone, including CreatorsMantra staff.
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

export default OTPVerificationPage;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { 
  Phone,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, loginWithOTP, sendOTP, isLoading } = useAuthStore();
  
  // Get phone and purpose from navigation state
  const { phone, purpose, from } = location.state || {};
  
  // State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for input fields
  const inputRefs = useRef([]);
  
  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      toast.error('Phone number not found. Please start again.');
      navigate(from || '/register');
    }
  }, [phone, navigate, from]);
  
  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);
  
  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(newOtp);
      
      // Focus last filled input or last input
      const lastFilledIndex = newOtp.findLastIndex(digit => digit !== '');
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };
  
// Handle OTP verification
const handleVerify = async () => {
  const otpString = otp.join('');
  
  if (otpString.length !== 6) {
    toast.error('Please enter complete OTP');
    return;
  }
  
  try {
    if (purpose === 'login') {
      // For login: Use loginWithOTP which verifies OTP and returns auth tokens
      const result = await loginWithOTP(phone, otpString);
      
      if (result.success) {
        toast.success('Login successful!');
        // loginWithOTP sets isAuthenticated, so navigation will work
        navigate(from || '/dashboard');
      }
    } else if (purpose === 'registration') {
      // For registration: Just verify the OTP
      const result = await verifyOTP(phone, otpString);
      
      if (result.success) {
        toast.success('Phone number verified successfully!');
        navigate('/register', {
          state: {
            phone: phone,
            otpVerified: true
          }
        });
      }
    }
  } catch (error) {
    toast.error(error.message || 'Invalid OTP');
  }
};
  
  // Handle resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      const result = await sendOTP(phone);
      
      if (result.success) {
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };
  
  // Styles
  const styles = {
    container: {
      maxWidth: '420px',
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
      color: 'var(--color-neutral-900)',
      marginBottom: '0.5rem',
    },
    
    subtitle: {
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
      marginBottom: '0.5rem',
    },
    
    phoneNumber: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--color-primary-600)',
    },
    
    otpContainer: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      marginBottom: '2rem',
    },
    
    otpInput: {
      width: '50px',
      height: '50px',
      border: '2px solid var(--color-neutral-300)',
      borderRadius: '12px',
      fontSize: '1.5rem',
      fontWeight: '600',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      background: 'white',
    },
    
    otpInputFilled: {
      borderColor: 'var(--color-primary-500)',
      background: 'rgba(102, 126, 234, 0.05)',
    },
    
    verifyButton: {
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
      marginBottom: '1rem',
    },
    
    resendContainer: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--color-neutral-600)',
    },
    
    resendButton: {
      background: 'none',
      border: 'none',
      color: 'var(--color-primary-600)',
      fontWeight: '600',
      cursor: 'pointer',
      padding: '0.25rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    
    resendDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--color-neutral-600)',
      fontSize: '0.875rem',
      marginBottom: '2rem',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '0.5rem',
    },
    
    helpText: {
      fontSize: '0.75rem',
      color: 'var(--color-neutral-500)',
      textAlign: 'center',
      marginTop: '1rem',
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
          onClick={() => navigate(from || '/register')}
          style={styles.backButton}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Verify Your Phone</h1>
          <p style={styles.subtitle}>
            We've sent a 6-digit code to
          </p>
          <p style={styles.phoneNumber}>
            <Phone size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
            +91 {phone}
          </p>
        </div>
        
        {/* OTP Input */}
        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              style={{
                ...styles.otpInput,
                ...(digit ? styles.otpInputFilled : {})
              }}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.join('').length !== 6}
          style={{
            ...styles.verifyButton,
            ...(isLoading || otp.join('').length !== 6 
              ? { opacity: 0.6, cursor: 'not-allowed' } 
              : {})
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify OTP
              <CheckCircle size={20} />
            </>
          )}
        </button>
        
        {/* Resend OTP */}
        <div style={styles.resendContainer}>
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            style={{
              ...styles.resendButton,
              ...(!canResend || isLoading ? styles.resendDisabled : {})
            }}
          >
            {canResend ? (
              <>
                <RefreshCw size={14} />
                Resend OTP
              </>
            ) : (
              `Resend in ${resendTimer}s`
            )}
          </button>
        </div>
        
        {/* Help Text */}
        <p style={styles.helpText}>
          <AlertCircle size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
          OTP is valid for 5 minutes
        </p>
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
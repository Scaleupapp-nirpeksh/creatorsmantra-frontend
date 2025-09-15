// Dependencies
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
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
} from 'lucide-react'

// Store Hooks
import { useAuthStore } from '../../store'

// Styles
import '../../styles/animateSpin.css'
import { loginPageStyles as styles } from '../../utils/stylesInline'

const LoginPage = () => {
  // State Variables
  const [loginMethod, setLoginMethod] = useState('otp') // 'otp' or 'password'
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Hooks
  const navigate = useNavigate()
  const location = useLocation()
  const { sendOTP, loginWithPassword, isLoading } = useAuthStore()

  // Get redirect URL from location state
  const from = location.state?.from || '/dashboard'
  const message = location.state?.message

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  })

  // Effects
  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Show message from redirect
  useEffect(() => {
    if (message) toast.error(message)
  }, [message])

  // Handlers
  // Handle OTP Send
  const handleSendOTP = async (data) => {
    try {
      const phone = data.phone.replace(/\D/g, '') // Remove non-digits

      if (phone.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number')
        return
      }

      const result = await sendOTP(phone, 'login')

      if (result.success) {
        setCountdown(120) // 2 minutes countdown
        toast.success('OTP sent successfully! Check your SMS.')

        // Navigate to OTP verification page
        navigate('/verify-otp', {
          state: {
            phone,
            purpose: 'login',
            from,
          },
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP')
    }
  }

  // Handle Password Login
  const handlePasswordLogin = async (data) => {
    try {
      const result = await loginWithPassword(data.identifier, data.password)

      if (result.success) {
        toast.success('Login successful!')

        // Check if redirect after login exists
        // Persist the previosu logout state
        const redirectPath = sessionStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin')
          navigate(redirectPath)
        } else {
          navigate(from)
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials')
    }
  }

  // Form submit handler
  const onSubmit = (data) => {
    if (loginMethod === 'otp') return handleSendOTP(data)
    else return handlePasswordLogin(data)
  }

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
          <p style={styles.subtitle}>Login to manage your creator business</p>
        </div>

        {/* Login Method Toggle */}
        <div style={styles.methodToggle}>
          <button
            type="button"
            style={{
              ...styles.methodButton,
              ...(loginMethod === 'otp' ? styles.methodButtonActive : {}),
            }}
            onClick={() => {
              setLoginMethod('otp')
              clearErrors()
            }}
          >
            <Smartphone size={18} />
            OTP Login
          </button>
          <button
            type="button"
            style={{
              ...styles.methodButton,
              ...(loginMethod === 'password' ? styles.methodButtonActive : {}),
            }}
            onClick={() => {
              setLoginMethod('password')
              clearErrors()
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
                        ...(errors.phone ? styles.inputError : {}),
                      }}
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Please enter a valid Indian phone number',
                        },
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
                        ...(errors.identifier ? styles.inputError : {}),
                      }}
                      {...register('identifier', {
                        required: 'Email or phone is required',
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
                        ...(errors.password ? styles.inputError : {}),
                      }}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
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
              ...(isSubmitting || isLoading ? styles.submitButtonDisabled : {}),
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
    </div>
  )
}

export default LoginPage

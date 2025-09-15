/**
 * Public Rate Card View Page
 * Public-facing page for brands and clients to view creator rate cards
 *
 * Features:
 * - Public access without authentication
 * - Password protection support when required
 * - Professional presentation optimized for clients/brands
 * - Responsive design with print-friendly layout
 * - Contact form integration for inquiries
 * - Download/PDF export functionality
 * - View tracking and analytics
 * - Expired rate card handling
 * - Mobile-optimized experience
 *
 * @filepath src/features/rateCard/pages/PublicRateCard.jsx
 * @author CreatorsMantra Frontend Team
 */

// Dependencies
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Facebook,
  FileText,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Send,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Youtube,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PublicRateCard = ({ publicId, onNavigate }) => {
  // State management
  const [rateCardData, setRateCardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: '',
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const pageRef = useRef()

  // Platform configuration
  const platformConfig = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      handle: '@',
    },
    youtube: {
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      handle: '@',
    },
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      handle: 'in/',
    },
    twitter: {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      handle: '@',
    },
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      handle: '@',
    },
  }

  // Fetch public rate card data
  const fetchPublicRateCard = async (password = null) => {
    try {
      setIsLoading(true)
      setError(null)
      setPasswordError('')

      const headers = password ? { 'x-rate-card-password': password } : {}

      const response = await fetch(`/api/ratecards/public/${publicId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      if (response.status === 401) {
        setPasswordRequired(true)
        setPasswordError('Password required to access this rate card')
        return
      }

      if (response.status === 403) {
        setPasswordError('Incorrect password. Please try again.')
        return
      }

      if (response.status === 410) {
        setError('This rate card has expired and is no longer available.')
        return
      }

      if (!response.ok) {
        throw new Error('Rate card not found or no longer available')
      }

      const data = await response.json()

      if (data.success) {
        setRateCardData(data.data)
        setPasswordRequired(false)
        setPassword('')
      } else {
        throw new Error(data.message || 'Failed to load rate card')
      }
    } catch (err) {
      setError(err.message || 'Failed to load rate card')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password.trim()) {
      fetchPublicRateCard(password)
    }
  }

  // Handle contact form
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      // Simulate contact form submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setContactSuccess(true)
      setContactForm({
        name: '',
        email: '',
        company: '',
        message: '',
        budget: '',
      })
      setTimeout(() => {
        setShowContactForm(false)
        setContactSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to send inquiry:', error)
    } finally {
      setIsSubmittingContact(false)
    }
  }

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (value) => {
    if (!value) return '0'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${rateCardData.creator.name} - Rate Card`,
          text: `Check out ${rateCardData.creator.name}'s professional rate card`,
          url: window.location.href,
        })
      } catch (error) {
        copyToClipboard(window.location.href)
      }
    } else {
      copyToClipboard(window.location.href)
    }
  }

  // Load data on mount
  useEffect(() => {
    if (publicId) {
      fetchPublicRateCard()
    }
  }, [publicId])

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto var(--space-4)',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader2 size={24} style={{ color: 'white' }} className="animate-spin" />
          </div>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-lg)',
            }}
          >
            Loading rate card...
          </p>
        </div>
      </div>
    )
  }

  // Password protection screen
  if (passwordRequired && !rateCardData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto var(--space-4)',
              borderRadius: '50%',
              backgroundColor: 'var(--color-warning-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock size={24} style={{ color: 'var(--color-warning-dark)' }} />
          </div>

          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Password Protected
          </h2>

          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            This rate card is password protected. Please enter the password to view.
          </p>

          <form
            onSubmit={handlePasswordSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: `1px solid ${passwordError ? 'var(--color-error)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-base)',
                outline: 'none',
                textAlign: 'center',
              }}
              onFocus={(e) => {
                if (!passwordError) {
                  e.target.style.borderColor = 'var(--color-primary-500)'
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)'
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = passwordError
                  ? 'var(--color-error)'
                  : 'var(--color-border)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {passwordError && (
              <p
                style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                }}
              >
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={!password.trim() || isLoading}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: password.trim()
                  ? 'var(--gradient-primary)'
                  : 'var(--color-neutral-300)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 'var(--font-semibold)',
                cursor: password.trim() ? 'pointer' : 'not-allowed',
                transition: 'all var(--duration-200) ease',
              }}
            >
              {isLoading ? 'Verifying...' : 'Access Rate Card'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto var(--space-4)',
              borderRadius: '50%',
              backgroundColor: 'var(--color-error-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} style={{ color: 'var(--color-error)' }} />
          </div>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Rate Card Not Available
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: 'var(--gradient-primary)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--font-semibold)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!rateCardData) return null

  return (
    <div
      ref={pageRef}
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left side - Creator info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'white',
                }}
              >
                {rateCardData.creator.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  {rateCardData.creator.name}
                </h1>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-base)',
                    textTransform: 'capitalize',
                  }}
                >
                  {rateCardData.metrics.niche} Content Creator
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'white',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-200) ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)'
                  e.target.style.color = 'var(--color-primary-600)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.color = 'var(--color-text)'
                }}
              >
                <Share2 size={16} />
                Share
              </button>

              {rateCardData.sharing.allowDownload && (
                <button
                  onClick={handlePrint}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'white',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-200) ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--color-secondary-500)'
                    e.target.style.color = 'var(--color-secondary-600)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.color = 'var(--color-text)'
                  }}
                >
                  <Download size={16} />
                  Download
                </button>
              )}

              {rateCardData.sharing.showContactForm && (
                <button
                  onClick={() => setShowContactForm(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 'var(--font-semibold)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform var(--duration-200) ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  <Mail size={16} />
                  Get in Touch
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          {/* Hero Section */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              marginBottom: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)',
              background: 'linear-gradient(135deg, white 0%, var(--color-primary-25) 100%)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-8)',
                alignItems: 'center',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {rateCardData.title}
                </h2>
                {rateCardData.description && (
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--text-lg)',
                      lineHeight: 'var(--leading-relaxed)',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    {rateCardData.description}
                  </p>
                )}

                {/* Creator Profile Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-700)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}
                  >
                    <TrendingUp size={14} />
                    {rateCardData.metrics.niche}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      backgroundColor: 'var(--color-secondary-100)',
                      color: 'var(--color-secondary-700)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}
                  >
                    <MapPin size={14} />
                    {rateCardData.metrics.location.city}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      backgroundColor: 'var(--color-accent-100)',
                      color: 'var(--color-accent-700)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}
                  >
                    <Globe size={14} />
                    {rateCardData.metrics.languages?.join(', ') || 'English'}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {formatNumber(rateCardData.totalReach)}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-1)',
                    }}
                  >
                    <Users size={14} />
                    Total Reach
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {rateCardData.avgEngagementRate?.toFixed(1) || '0.0'}%
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-1)',
                    }}
                  >
                    <TrendingUp size={14} />
                    Engagement
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {rateCardData.metrics.platforms?.length || 0}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-1)',
                    }}
                  >
                    <Star size={14} />
                    Platforms
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {rateCardData.packages?.length || 0}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-1)',
                    }}
                  >
                    <Package size={14} />
                    Packages
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Metrics */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-6)',
              }}
            >
              Platform Presence
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {rateCardData.metrics.platforms?.map((platform, index) => {
                const config = platformConfig[platform.name]
                if (!config) return null
                const PlatformIcon = config.icon

                return (
                  <div
                    key={index}
                    style={{
                      padding: 'var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--color-neutral-50)',
                      transition: 'transform var(--duration-200) ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          backgroundColor: config.color,
                          borderRadius: 'var(--radius-base)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PlatformIcon size={18} style={{ color: 'white' }} />
                      </div>
                      <h3
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {config.name}
                      </h3>
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                          }}
                        >
                          <Users size={14} />
                          Followers
                        </span>
                        <span
                          style={{
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-text)',
                            fontSize: 'var(--text-base)',
                          }}
                        >
                          {formatNumber(platform.metrics.followers)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                          }}
                        >
                          <Heart size={14} />
                          Engagement
                        </span>
                        <span
                          style={{
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-text)',
                            fontSize: 'var(--text-base)',
                          }}
                        >
                          {platform.metrics.engagementRate}%
                        </span>
                      </div>
                      {platform.metrics.avgViews && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--text-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-2)',
                            }}
                          >
                            <Eye size={14} />
                            Avg Views
                          </span>
                          <span
                            style={{
                              fontWeight: 'var(--font-semibold)',
                              color: 'var(--color-text)',
                              fontSize: 'var(--text-base)',
                            }}
                          >
                            {formatNumber(platform.metrics.avgViews)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pricing Section */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-6)',
              }}
            >
              Pricing & Deliverables
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {rateCardData.pricing?.deliverables?.map((platform, index) => {
                const config = platformConfig[platform.platform]
                if (!config) return null
                const PlatformIcon = config.icon

                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Platform Header */}
                    <div
                      style={{
                        padding: 'var(--space-4)',
                        backgroundColor: 'var(--color-neutral-50)',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                      }}
                    >
                      <div
                        style={{
                          width: '2rem',
                          height: '2rem',
                          backgroundColor: config.color,
                          borderRadius: 'var(--radius-base)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PlatformIcon size={16} style={{ color: 'white' }} />
                      </div>
                      <h3
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {config.name} Deliverables
                      </h3>
                    </div>

                    {/* Rates Table */}
                    <div style={{ padding: 'var(--space-4)' }}>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                      >
                        {platform.rates?.map((rate, rateIndex) => (
                          <div
                            key={rateIndex}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 'var(--space-3)',
                              backgroundColor: 'var(--color-neutral-25)',
                              borderRadius: 'var(--radius-base)',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-medium)',
                                  color: 'var(--color-text)',
                                  marginBottom: 'var(--space-1)',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {rate.type.replace('_', ' ')}
                              </h4>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-4)',
                                  fontSize: 'var(--text-sm)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {rate.turnaroundTime && (
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-1)',
                                    }}
                                  >
                                    <Clock size={12} />
                                    {rate.turnaroundTime.value} {rate.turnaroundTime.unit}
                                  </span>
                                )}
                                {rate.revisionsIncluded > 0 && (
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-1)',
                                    }}
                                  >
                                    <RefreshCw size={12} />
                                    {rate.revisionsIncluded} revisions
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p
                                style={{
                                  fontSize: 'var(--text-xl)',
                                  fontWeight: 'var(--font-bold)',
                                  color: 'var(--color-text)',
                                }}
                              >
                                {formatCurrency(rate.pricing.userRate)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Packages Section */}
          {rateCardData.packages && rateCardData.packages.length > 0 && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Package size={20} style={{ color: 'white' }} />
                </div>
                <h2
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                  }}
                >
                  Package Deals
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                {rateCardData.packages.map((pkg, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      border: '2px solid',
                      borderColor: pkg.isPopular
                        ? 'var(--color-primary-500)'
                        : 'var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-6)',
                      backgroundColor: pkg.isPopular ? 'var(--color-primary-25)' : 'white',
                    }}
                  >
                    {pkg.isPopular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          padding: 'var(--space-1) var(--space-4)',
                          backgroundColor: 'var(--color-primary-500)',
                          color: 'white',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-bold)',
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                      <h3
                        style={{
                          fontSize: 'var(--text-xl)',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--color-text)',
                          marginBottom: 'var(--space-2)',
                        }}
                      >
                        {pkg.name}
                      </h3>
                      {pkg.description && (
                        <p
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                            marginBottom: 'var(--space-4)',
                          }}
                        >
                          {pkg.description}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'center',
                          gap: 'var(--space-2)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {formatCurrency(pkg.pricing.packagePrice)}
                        </span>
                        {pkg.pricing.savings.percentage > 0 && (
                          <div
                            style={{
                              padding: 'var(--space-1) var(--space-3)',
                              backgroundColor: 'var(--color-success-light)',
                              color: 'var(--color-success-dark)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-bold)',
                            }}
                          >
                            Save {pkg.pricing.savings.percentage}%
                          </div>
                        )}
                      </div>
                      {pkg.pricing.savings.amount > 0 && (
                        <p
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                            marginTop: 'var(--space-1)',
                            textDecoration: 'line-through',
                          }}
                        >
                          Individual: {formatCurrency(pkg.pricing.individualTotal)}
                        </p>
                      )}
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <h4
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--color-text)',
                          marginBottom: 'var(--space-3)',
                        }}
                      >
                        Package Includes:
                      </h4>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                      >
                        {pkg.items.map((item, itemIndex) => {
                          const config = platformConfig[item.platform]
                          const PlatformIcon = config?.icon

                          return (
                            <div
                              key={itemIndex}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                              }}
                            >
                              <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                              <span
                                style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}
                              >
                                {item.quantity}x {config?.name}{' '}
                                {item.deliverableType.replace('_', ' ')}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {pkg.validity && (
                      <div
                        style={{
                          padding: 'var(--space-3)',
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: 'var(--radius-base)',
                          textAlign: 'center',
                        }}
                      >
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                          }}
                        >
                          <Calendar size={14} />
                          Valid for {pkg.validity.value} {pkg.validity.unit}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Terms */}
          {rateCardData.professionalDetails && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'var(--color-secondary-100)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={20} style={{ color: 'var(--color-secondary-600)' }} />
                </div>
                <h2
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                  }}
                >
                  Terms & Conditions
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                {rateCardData.professionalDetails.paymentTerms && (
                  <div>
                    <h4
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      Payment Terms
                    </h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                      {rateCardData.professionalDetails.paymentTerms.type === '50_50'
                        ? '50% Advance, 50% Post-delivery'
                        : rateCardData.professionalDetails.paymentTerms.type === '100_advance'
                          ? '100% Advance'
                          : rateCardData.professionalDetails.paymentTerms.type === 'on_delivery'
                            ? '100% Post-delivery'
                            : rateCardData.professionalDetails.paymentTerms.customTerms ||
                              'Standard Terms'}
                    </p>
                  </div>
                )}

                {rateCardData.professionalDetails.usageRights && (
                  <div>
                    <h4
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      Usage Rights
                    </h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                      {rateCardData.professionalDetails.usageRights.duration === '3_months'
                        ? '3 months'
                        : rateCardData.professionalDetails.usageRights.duration === '6_months'
                          ? '6 months'
                          : rateCardData.professionalDetails.usageRights.duration === '1_year'
                            ? '1 year'
                            : rateCardData.professionalDetails.usageRights.duration ||
                              'As per agreement'}
                      {rateCardData.professionalDetails.usageRights.geography &&
                        ` • ${rateCardData.professionalDetails.usageRights.geography}`}
                    </p>
                  </div>
                )}

                <div>
                  <h4
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Revisions
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    As specified per deliverable
                  </p>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Turnaround
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    3-7 days (varies by deliverable)
                  </p>
                </div>
              </div>

              {rateCardData.professionalDetails.additionalNotes && (
                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Additional Notes
                  </h4>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {rateCardData.professionalDetails.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer with powered by */}
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} style={{ color: 'white' }} />
              </div>
              <span
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Powered by CreatorsMantra
              </span>
            </div>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)',
                maxWidth: '32rem',
                margin: '0 auto',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              Professional rate cards for content creators. Create your own at creatorsmantra.com
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'var(--space-4)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              maxWidth: '32rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {contactSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    margin: '0 auto var(--space-4)',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle size={24} style={{ color: 'var(--color-success-dark)' }} />
                </div>
                <h3
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Your inquiry has been sent to {rateCardData.creator.name}. They'll get back to you
                  soon!
                </p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  Get in Touch with {rateCardData.creator.name}
                </h3>

                <form
                  onSubmit={handleContactSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--space-4)',
                    }}
                  >
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your Name *"
                      required
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--text-base)',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="Email Address *"
                      required
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--text-base)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    placeholder="Company/Brand Name"
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                    }}
                  />

                  <input
                    type="text"
                    value={contactForm.budget}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, budget: e.target.value }))
                    }
                    placeholder="Budget Range (Optional)"
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                    }}
                  />

                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Tell us about your project and requirements... *"
                    required
                    rows={4}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />

                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      style={{
                        flex: 1,
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'white',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      style={{
                        flex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: 'var(--font-semibold)',
                        border: 'none',
                        cursor: isSubmittingContact ? 'not-allowed' : 'pointer',
                        opacity: isSubmittingContact ? 0.7 : 1,
                      }}
                    >
                      {isSubmittingContact ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicRateCard

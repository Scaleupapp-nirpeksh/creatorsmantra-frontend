// Dependencies
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles,
  Play,
  Star,
  Zap,
  ChevronRight,
  Menu,
  X,
  Clock,
  Globe,
} from 'lucide-react'

// Store Hooks
import { useAuthStore } from '../store'

// Constants
import { PageConstants } from '../utils/constants/page.constants'

// Styles
import styles from '../styles/LandingPage.module.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // TODO: Consume this value on Register Page
  const [selectedPlan, setSelectedPlan] = useState('pro')

  // Animation refs
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const pricingRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })
  const pricingInView = useInView(pricingRef, { once: true })

  // Redirect if already authenticated
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  // Constants
  const { pricingPlans, testimonials, features, stats } = PageConstants.CmMeta

  // Handlers
  const handleStartFreeTrial = () => navigate('/register')
  const handleExploreDemo = () => navigate('/demo')
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <div className={styles.landingPage}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            <Sparkles className={styles.logo} />
            <span className={styles.brandName}>CreatorsMantra</span>
          </div>

          <div className={styles.navLinks}>
            <button onClick={() => scrollToSection('features')} className={styles.navLink}>
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className={styles.navLink}>
              Pricing
            </button>
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>
            <button onClick={handleStartFreeTrial} className={styles.ctaButton}>
              Start Free Trial
            </button>
          </div>

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button onClick={() => scrollToSection('features')} className={styles.mobileNavLink}>
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className={styles.mobileNavLink}>
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={styles.mobileNavLink}
            >
              Testimonials
            </button>
            <Link to="/login" className={styles.mobileNavLink}>
              Login
            </Link>
            <button onClick={handleStartFreeTrial} className={styles.mobileCta}>
              Start Free Trial
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1} />
          <div className={styles.gradientOrb2} />
          <div className={styles.gradientOrb3} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroTag}>
            <Zap /> Built for Indian Creators
          </div>

          <h1 className={styles.heroTitle}>
            Your Complete
            <span className={styles.heroGradient}> Creator Business OS</span>
          </h1>

          <p className={styles.heroDescription}>
            Manage deals, create invoices, analyze briefs with AI, and grow your creator business —
            all from one powerful platform trusted by 10,000+ Indian creators.
          </p>

          <div className={styles.heroActions}>
            <button onClick={handleStartFreeTrial} className={styles.primaryCta}>
              <span>Start 14-Day Free Trial</span>
              <ArrowRight />
            </button>
            <button onClick={handleExploreDemo} className={styles.secondaryCta}>
              <Play />
              <span>Explore Demo</span>
            </button>
          </div>

          <div className={styles.heroTrust}>
            <div className={styles.trustItem}>
              <CheckCircle2 />
              <span>No credit card required</span>
            </div>
            <div className={styles.trustItem}>
              <Clock />
              <span>Setup in 2 minutes</span>
            </div>
            <div className={styles.trustItem}>
              <Shield />
              <span>Bank-grade security</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={heroInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.dashboardPreview}>
            <div className={styles.browserBar}>
              <div className={styles.browserDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className={styles.browserUrl}>creatorsmantra.com/dashboard</div>
            </div>
            <div className={styles.dashboardContent}>
              <div className={styles.mockDashboard}>
                <div className={styles.mockSidebar} />
                <div className={styles.mockMain}>
                  <div className={styles.mockCards}>
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                  </div>
                  <div className={styles.mockChart} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features" ref={featuresRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Everything You Need to
            <span className={styles.titleGradient}> Grow Your Creator Business</span>
          </h2>
          <p className={styles.sectionDescription}>
            Stop juggling spreadsheets and WhatsApp chats. Manage everything in one place.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map(({ title, description, Icon, style, color }, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={styles.featureIconWrapper} style={{ background: color }}>
                <Icon className={styles.featureIcon} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDescription}>{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing} id="pricing" ref={pricingRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Simple Pricing,
            <span className={styles.titleGradient}> Powerful Features</span>
          </h2>
          <p className={styles.sectionDescription}>
            Choose the plan that fits your creator journey. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`${styles.pricingCard} ${plan.popular ? styles.popularPlan : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Star /> Most Popular
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  <span className={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>

              <ul className={styles.planFeatures}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.planFeature}>
                    <CheckCircle2 className={styles.featureCheck} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.planCta} ${plan.popular ? styles.planCtaPrimary : ''}`}
                onClick={() => {
                  setSelectedPlan(plan.id)
                  handleStartFreeTrial()
                }}
              >
                Start Free Trial
                <ChevronRight />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>Ready to 10x Your Creator Business?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of creators who've already transformed their business with
            CreatorsMantra. Start your 14-day free trial today — no credit card required.
          </p>

          <div className={styles.ctaActions}>
            <button onClick={handleStartFreeTrial} className={styles.ctaPrimary}>
              Start Your Free Trial
              <ArrowRight />
            </button>
            <button onClick={handleExploreDemo} className={styles.ctaSecondary}>
              <Play />
              Watch 2-min Demo
            </button>
          </div>

          <div className={styles.ctaTrust}>
            <Globe className={styles.trustIcon} />
            <span>Trusted by creators with 10K to 5M+ followers</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Sparkles className={styles.footerLogo} />
            <span className={styles.footerBrandName}>CreatorsMantra</span>
            <p className={styles.footerTagline}>Your Creator Business OS</p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/demo">Demo</Link>
              <Link to="/api">API</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/tutorials">Tutorials</Link>
              <Link to="/api-docs">API Docs</Link>
              <Link to="/status">Status</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/security">Security</Link>
              <Link to="/gdpr">GDPR</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 CreatorsMantra. All rights reserved.</p>
          <p>Made with ❤️ for Indian Creators</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

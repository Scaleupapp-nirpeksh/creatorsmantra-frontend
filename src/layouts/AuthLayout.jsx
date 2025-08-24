/**
 * Auth Layout Component
 * 
 * This layout wraps all authentication pages and provides:
 * - Centered form container
 * - Brand gradient background
 * - Feature highlights
 * - Responsive design
 * - Theme support
 * 
 * File: src/layouts/AuthLayout.jsx
 */

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store';
import {
  ArrowLeft,
  CheckCircle,
  Zap,
  Shield,
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

// ============================================
// Feature Cards Data
// ============================================
const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your performance with AI-powered insights'
  },
  {
    icon: DollarSign,
    title: 'Smart Invoicing',
    description: 'Create and manage invoices with GST compliance'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Bank-grade security for your business data'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work seamlessly with managers and brands'
  }
];

const stats = [
  { value: '10K+', label: 'Active Creators' },
  { value: '₹50Cr+', label: 'Revenue Managed' },
  { value: '98%', label: 'Happy Creators' },
  { value: '24/7', label: 'Support' }
];

const testimonials = [
  {
    content: "CreatorsMantra transformed how I manage my brand collaborations. The automated invoicing alone saves me hours every week!",
    author: "Priya Sharma",
    role: "Fashion Influencer",
    followers: "250K followers"
  },
  {
    content: "The analytics dashboard gives me insights I never had before. I can now make data-driven decisions for my content strategy.",
    author: "Rahul Verma",
    role: "Tech Creator",
    followers: "180K followers"
  },
  {
    content: "Managing multiple creators was a nightmare before CreatorsMantra. Now everything is organized and efficient.",
    author: "Neha Patel",
    role: "Talent Manager",
    followers: "Managing 15+ creators"
  }
];

// ============================================
// Auth Layout Component
// ============================================
const AuthLayout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useUIStore();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Check if we're on landing page
  const isLandingPage = location.pathname === '/';

  return (
    <div className="auth-layout">
      {/* Background Pattern */}
      <div className="bg-pattern">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Header */}
      <header className="auth-header">
        <div className="header-container">
          <Link to="/" className="logo-link">
            <div className="logo">
              <div className="logo-icon">
                <span className="logo-letter">C</span>
              </div>
              <span className="logo-text">CreatorsMantra</span>
            </div>
          </Link>

          <nav className="auth-nav">
            {!isLandingPage && (
              <Link to="/" className="nav-link">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            )}
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-container">
          {/* Left Side - Form */}
          <div className={`auth-content ${animateIn ? 'animate-in' : ''}`}>
            <Outlet />
          </div>

          {/* Right Side - Features */}
          {!isLandingPage && (
            <div className={`auth-features ${animateIn ? 'animate-in-delayed' : ''}`}>
              {/* Stats */}
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="features-section">
                <h3 className="features-title">
                  <Sparkles className="title-icon" />
                  Why Creators Love Us
                </h3>
                <div className="features-grid">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="feature-card">
                        <div className="feature-icon">
                          <Icon size={24} />
                        </div>
                        <h4 className="feature-title">{feature.title}</h4>
                        <p className="feature-description">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Testimonial */}
              <div className="testimonial-section">
                <div className="testimonial-card">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-content">
                    {testimonials[currentTestimonial].content}
                  </p>
                  <div className="testimonial-author">
                    <div className="author-name">{testimonials[currentTestimonial].author}</div>
                    <div className="author-role">{testimonials[currentTestimonial].role}</div>
                    <div className="author-followers">{testimonials[currentTestimonial].followers}</div>
                  </div>
                </div>
                <div className="testimonial-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentTestimonial ? 'dot-active' : ''}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-section">
                <div className="trust-badge">
                  <Shield size={16} />
                  <span>Bank-grade Security</span>
                </div>
                <div className="trust-badge">
                  <Globe size={16} />
                  <span>Made in India</span>
                </div>
                <div className="trust-badge">
                  <Award size={16} />
                  <span>GST Compliant</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-divider">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="footer-divider">•</span>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-copyright">
            © 2024 CreatorsMantra. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--gradient-mesh), var(--gradient-light);
          position: relative;
          overflow: hidden;
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .gradient-orb-1 {
          width: 600px;
          height: 600px;
          background: var(--gradient-purple);
          top: -200px;
          left: -200px;
          animation: float-1 20s ease-in-out infinite;
        }

        .gradient-orb-2 {
          width: 400px;
          height: 400px;
          background: var(--gradient-pink);
          bottom: -100px;
          right: -100px;
          animation: float-2 15s ease-in-out infinite;
        }

        .gradient-orb-3 {
          width: 300px;
          height: 300px;
          background: var(--gradient-blue);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float-3 25s ease-in-out infinite;
        }

        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -50px) scale(0.9); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-45%, -55%) scale(1.2); }
        }

        .auth-header {
          position: relative;
          z-index: var(--z-10);
          padding: var(--space-6);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-link {
          text-decoration: none;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-purple);
        }

        .logo-letter {
          color: white;
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          transform: translateX(-1px);
        }

        .logo-text {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--color-neutral-900);
        }

        .auth-nav {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-neutral-700);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: color var(--duration-150) var(--ease-out);
        }

        .nav-link:hover {
          color: var(--color-primary-600);
        }

        .theme-toggle {
          background: white;
          border: 1px solid var(--color-neutral-200);
          border-radius: var(--radius-lg);
          padding: var(--space-2);
          cursor: pointer;
          color: var(--color-neutral-700);
          transition: all var(--duration-150) var(--ease-out);
        }

        .theme-toggle:hover {
          background: var(--color-neutral-100);
        }

        .auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          position: relative;
          z-index: var(--z-10);
        }

        .auth-container {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
        }

        .auth-content {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-2xl);
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.6s var(--ease-out) forwards;
        }

        .animate-in {
          animation: slideUp 0.6s var(--ease-out) forwards;
        }

        .auth-features {
          opacity: 0;
          transform: translateX(20px);
        }

        .animate-in-delayed {
          animation: slideIn 0.6s var(--ease-out) 0.2s forwards;
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          background: white;
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          text-align: center;
          box-shadow: var(--shadow-sm);
        }

        .stat-value {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--color-neutral-600);
          margin-top: var(--space-1);
        }

        .features-section {
          margin-bottom: var(--space-8);
        }

        .features-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--color-neutral-900);
          margin-bottom: var(--space-4);
        }

        .title-icon {
          color: var(--color-primary-500);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .feature-card {
          background: white;
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: var(--space-3);
        }

        .feature-title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-neutral-900);
          margin-bottom: var(--space-1);
        }

        .feature-description {
          font-size: var(--text-xs);
          color: var(--color-neutral-600);
          line-height: var(--leading-relaxed);
        }

        .testimonial-section {
          margin-bottom: var(--space-6);
        }

        .testimonial-card {
          background: white;
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .quote-icon {
          font-size: var(--text-4xl);
          color: var(--color-primary-200);
          line-height: 1;
          margin-bottom: var(--space-2);
        }

        .testimonial-content {
          font-size: var(--text-sm);
          color: var(--color-neutral-700);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-4);
        }

        .testimonial-author {
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-neutral-200);
        }

        .author-name {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-neutral-900);
        }

        .author-role,
        .author-followers {
          font-size: var(--text-xs);
          color: var(--color-neutral-600);
        }

        .testimonial-dots {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-neutral-300);
          border: none;
          cursor: pointer;
          transition: all var(--duration-150) var(--ease-out);
        }

        .dot-active {
          background: var(--color-primary-500);
          width: 24px;
          border-radius: var(--radius-full);
        }

        .trust-section {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: white;
          border-radius: var(--radius-lg);
          font-size: var(--text-xs);
          color: var(--color-neutral-700);
          box-shadow: var(--shadow-sm);
        }

        .auth-footer {
          padding: var(--space-6);
          position: relative;
          z-index: var(--z-10);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .footer-links a {
          color: var(--color-neutral-600);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: color var(--duration-150) var(--ease-out);
        }

        .footer-links a:hover {
          color: var(--color-primary-600);
        }

        .footer-divider {
          color: var(--color-neutral-400);
        }

        .footer-copyright {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .auth-features {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .auth-content {
            padding: var(--space-6);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
import './styles/index.css';
import { useEffect, useState } from 'react';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="app">
      <div className="container">
        <header className={`hero-section ${mounted ? 'hero-animate' : ''}`}>
          <div className="hero-content">
            <div className="logo-wrapper">
              <div className="logo-gradient">
                <span className="logo-letter">C</span>
              </div>
            </div>
            <h1 className="hero-title">
              <span className="text-gradient">CreatorsMantra</span>
            </h1>
            <p className="hero-subtitle">
              Empowering creators to manage their business with intelligence
            </p>
            <div className="hero-stats">
              <div className="stat-card glass">
                <span className="stat-number text-gradient">10K+</span>
                <span className="stat-label">Active Creators</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient">₹50Cr+</span>
                <span className="stat-label">Revenue Managed</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient">98%</span>
                <span className="stat-label">Happy Creators</span>
              </div>
            </div>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                Get Started Free
              </button>
              <button className="btn btn-secondary glass">
                Watch Demo
              </button>
            </div>
          </div>
        </header>
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-4);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s var(--ease-out);
        }

        .hero-animate {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .logo-wrapper {
          margin-bottom: var(--space-6);
        }

        .logo-gradient {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background: var(--gradient-primary);
          border-radius: var(--radius-3xl);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-purple);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .logo-letter {
          font-size: var(--text-6xl);
          font-weight: var(--font-bold);
          color: white;
          transform: translateX(-5px);
        }

        .hero-title {
          font-size: var(--text-6xl);
          font-weight: var(--font-bold);
          margin-bottom: var(--space-4);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: var(--text-xl);
          color: var(--color-neutral-600);
          margin-bottom: var(--space-12);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-12);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-card {
          padding: var(--space-6) var(--space-4);
          border-radius: var(--radius-2xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .stat-number {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-neutral-600);
        }

        .cta-buttons {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-xl);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          border: none;
          cursor: pointer;
          transition: all var(--duration-200) var(--ease-out);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-purple);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl), var(--shadow-purple);
        }

        .btn-secondary {
          color: var(--color-neutral-700);
          border: 1px solid var(--color-neutral-200);
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: var(--text-4xl);
          }
          
          .hero-subtitle {
            font-size: var(--text-lg);
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
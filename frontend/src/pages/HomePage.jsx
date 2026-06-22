import { useState } from 'react'
import { ArrowRight, Shield, Globe, Zap, Award, Menu, X, TrendingUp, Target, Link } from 'lucide-react'

export default function HomePage({ onGetStarted }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const transactions = [
    {
      icon: <TrendingUp size={18} strokeWidth={2} />,
      color: '#10b981',
      title: 'Portfolio Fragility Score',
      subtitle: 'Last updated: Today, 2 min ago',
      amount: '42/100',
      change: '-5 pts'
    },
    {
      icon: <Target size={18} strokeWidth={2} />,
      color: '#3b82f6',
      title: 'Concentration Risk',
      subtitle: 'Herfindahl Index • HHI Score',
      amount: '2,450',
      change: '+320'
    },
    {
      icon: <Link size={18} strokeWidth={2} />,
      color: '#f59e0b',
      title: 'Correlation Check',
      subtitle: 'Asset correlation matrix • 11 min ago',
      amount: '0.68',
      change: '+0.12'
    },
  ]

  const howItWorksSteps = [
    { step: '01', title: 'Login with Angel One', description: 'Enter your client code, password, and TOTP from your authenticator app.' },
    { step: '02', title: 'We fetch holdings', description: 'Read-only access to your portfolio. We never trade or store your data.' },
    { step: '03', title: 'Risk engine runs', description: 'HHI, correlations, volatility, drawdown, and stress scenarios computed.' },
    { step: '04', title: 'Get your results', description: 'Fragility score, interactive charts, and plain-English warnings.' },
  ]

  return (
    <div className="homepage-new">
      {/* Header */}
      <header className="header">
        <div className="header__container">
          <div className="header__left">
            <div className="header__logo">
              <div className="header__logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" />
                  <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="header__logo-text">Fragility<span>Checker</span></span>
            </div>
          </div>
          <div className="header__actions">
            <button className="header__cta" onClick={onGetStarted}>
              Check Portfolio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button className="header__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="header__mobile-menu">
            <button className="header__login header__login--mobile">Log in</button>
            <button className="header__cta header__cta--mobile" onClick={onGetStarted}>
              Check Portfolio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero__title">
          Check Your Portfolio's <span className="hero__title-highlight">Fragility Score</span>
        </h1>
        <p className="hero__subtitle">
          Connect your Angel One account and get an instant risk assessment — concentration risk, 
          correlation breakdown, stress test scenarios, and plain-English warnings.
        </p>
        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary" onClick={onGetStarted}>
            Check Your Portfolio
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <button className="hero__btn hero__btn--secondary">
            Learn More
          </button>
        </div>
        <div className="hero__trust">
          <div className="hero__trust-item">
            <Shield size={14} strokeWidth={2.5} />
            <span>Angel One Official</span>
          </div>
          <div className="hero__trust-item">
            <Globe size={14} strokeWidth={2.5} />
            <span>Read-Only Access</span>
          </div>
          <div className="hero__trust-item">
            <Zap size={14} strokeWidth={2.5} />
            <span>&lt;30s Analysis</span>
          </div>
          <div className="hero__trust-item">
            <Award size={14} strokeWidth={2.5} />
            <span>99.9% Accurate</span>
          </div>
        </div>
      </section>

      {/* Split Section */}
      <section className="split-section">
        <div className="split-container">
          <div className="split-left">
            <div className="dashboard__window">
              <div className="dashboard__header">
                <div className="dashboard__dots">
                  <span className="dashboard__dot dashboard__dot--red" />
                  <span className="dashboard__dot dashboard__dot--yellow" />
                  <span className="dashboard__dot dashboard__dot--green" />
                </div>
                <span className="dashboard__url">app.fragilitychecker.com/dashboard</span>
              </div>
              <div className="dashboard__content">
                <div className="dashboard__top">
                  <h3 className="dashboard__title">Risk Analysis Overview</h3>
                  <span className="dashboard__period">Angel One Portfolio</span>
                </div>
                
                <div className="dashboard__stats">
                  <div className="dashboard__stat">
                    <span className="dashboard__stat-label">Fragility Score</span>
                    <span className="dashboard__stat-value">42<span className="dashboard__stat-unit">/100</span></span>
                    <span className="dashboard__stat-change dashboard__stat-change--warning">Moderate Risk</span>
                  </div>
                  <div className="dashboard__stat">
                    <span className="dashboard__stat-label">Holdings</span>
                    <span className="dashboard__stat-value">12<span className="dashboard__stat-unit">stocks</span></span>
                    <span className="dashboard__stat-change dashboard__stat-change--up">+2 new</span>
                  </div>
                  <div className="dashboard__stat">
                    <span className="dashboard__stat-label">Total Value</span>
                    <span className="dashboard__stat-value">₹24.5<span className="dashboard__stat-unit">L</span></span>
                    <span className="dashboard__stat-change dashboard__stat-change--up">+8.2%</span>
                  </div>
                  <div className="dashboard__stat">
                    <span className="dashboard__stat-label">Risk Level</span>
                    <span className="dashboard__stat-value">Medium</span>
                    <span className="dashboard__stat-change dashboard__stat-change--warning">Review Needed</span>
                  </div>
                </div>
                
                {/* Line Chart */}
                <div className="dashboard__line-chart">
                  <div className="chart-header">
                    <div>
                      <span className="chart-title">Portfolio Risk Trend</span>
                      <span className="chart-badge">Last 30 days</span>
                    </div>
                    <div className="chart-legend">
                      <span className="legend-dot"></span>
                      <span className="legend-text">Fragility Index</span>
                    </div>
                  </div>
                  
                  <div className="chart-container">
                    <svg viewBox="0 0 500 180" className="line-chart-svg" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                        </linearGradient>
                      </defs>
                      
                      <text x="10" y="20" className="chart-y-label">100</text>
                      <text x="10" y="56" className="chart-y-label">75</text>
                      <text x="10" y="92" className="chart-y-label">50</text>
                      <text x="10" y="128" className="chart-y-label">25</text>
                      <text x="10" y="164" className="chart-y-label">0</text>
                      
                      <line x1="40" y1="25" x2="480" y2="25" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6,4" />
                      <line x1="40" y1="61" x2="480" y2="61" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6,4" />
                      <line x1="40" y1="97" x2="480" y2="97" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6,4" />
                      <line x1="40" y1="133" x2="480" y2="133" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6,4" />
                      
                      <path d="M 45 145 L 75 132 L 105 125 L 135 118 L 165 108 L 195 95 L 225 88 L 255 78 L 285 68 L 315 55 L 345 45 L 375 52 L 405 60 L 435 55 L 465 50 L 465 160 L 45 160 Z" fill="url(#areaGradient)" />
                      
                      <path d="M 45 145 L 75 132 L 105 125 L 135 118 L 165 108 L 195 95 L 225 88 L 255 78 L 285 68 L 315 55 L 345 45 L 375 52 L 405 60 L 435 55 L 465 50" 
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" />
                      
                      <g className="data-points">
                        <circle cx="45" cy="145" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="75" cy="132" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="105" cy="125" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="135" cy="118" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="165" cy="108" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="195" cy="95" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="225" cy="88" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="255" cy="78" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="285" cy="68" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="315" cy="55" r="4" fill="white" stroke="#10b981" strokeWidth="2.5" />
                        <circle cx="345" cy="45" r="4" fill="white" stroke="#10b981" strokeWidth="2.5" />
                        <circle cx="375" cy="52" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="405" cy="60" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="435" cy="55" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                        <circle cx="465" cy="50" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      </g>
                    </svg>
                    
                    <div className="chart-x-labels">
                      <span>Jan 1</span>
                      <span>Jan 5</span>
                      <span>Jan 10</span>
                      <span>Jan 15</span>
                      <span>Jan 20</span>
                      <span>Jan 25</span>
                      <span>Today</span>
                    </div>
                  </div>
                  
                  <div className="chart-insights">
                    <div className="insight-card">
                      <span className="insight-value">+23%</span>
                      <span className="insight-label">Risk increase</span>
                      <span className="insight-trend up">↑</span>
                    </div>
                    <div className="insight-card">
                      <span className="insight-value">42/100</span>
                      <span className="insight-label">Current score</span>
                      <span className="insight-trend warning">●</span>
                    </div>
                    <div className="insight-card">
                      <span className="insight-value">Mar 15</span>
                      <span className="insight-label">Peak date</span>
                      <span className="insight-trend">📅</span>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard__transactions">
                  {transactions.map((tx, i) => (
                    <div key={i} className="dashboard__tx">
                      <div className="dashboard__tx-left">
                        <div className="dashboard__tx-icon" style={{ background: tx.color }}>
                          {tx.icon}
                        </div>
                        <div className="dashboard__tx-info">
                          <span className="dashboard__tx-title">{tx.title}</span>
                          <span className="dashboard__tx-subtitle">{tx.subtitle}</span>
                        </div>
                      </div>
                      <div className="dashboard__tx-right">
                        <span className="dashboard__tx-amount">{tx.amount}</span>
                        <span className={`dashboard__tx-change ${tx.change.includes('+') ? 'positive' : 'negative'}`}>
                          {tx.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="split-right">
            <div className="how-it-works-vertical">
              <div className="how-it-works-header">
                <span className="how-it-works-badge">Simple Process</span>
                <h2 className="how-it-works-title">How It <span>Works</span></h2>
                <p className="how-it-works-subtitle">Get started in 4 easy steps</p>
              </div>
              <div className="vertical-steps">
                {howItWorksSteps.map((item, idx) => (
                  <div className="vertical-step" key={idx}>
                    <div className="vertical-step-number">{item.step}</div>
                    <div className="vertical-step-content">
                      <h4 className="vertical-step-title">{item.title}</h4>
                      <p className="vertical-step-desc">{item.description}</p>
                    </div>
                    {idx < howItWorksSteps.length - 1 && (
                      <div className="vertical-step-line"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__content">
          <h2>Ready to know your portfolio's fragility?</h2>
          <p>Join 12,000+ investors who already checked their portfolio risk</p>
          <button className="cta__btn" onClick={onGetStarted}>
            Start Free Analysis
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <p className="cta__note">No credit card required · Free for Angel One users</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" />
                  <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span>FragilityChecker</span>
            </div>
            <p>Secure, transparent portfolio risk analysis for modern investors.</p>
          </div>
          <div className="footer__bottom">
            <p>© 2024 FragilityChecker. All rights reserved.</p>
            <div className="footer__badges">
              <span>🔒 FCA Registered</span>
              <span>🛡️ ESMA Compliant</span>
              <span>✓ ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
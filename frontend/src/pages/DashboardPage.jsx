import { useState } from 'react'
import axios from 'axios'
import {
  TrendingUp, TrendingDown, AlertTriangle, Shield, PieChart, 
  Activity, BarChart3, LineChart, Wallet, Building2, 
  Landmark, Package, Factory, Sparkles,
  RefreshCw, Zap, Target,
  Link as LinkIcon, ArrowUpRight, ArrowDownRight, LogOut
} from 'lucide-react'
import './DashboardPage.css'


const API_BASE_URL = ''
export default function DashboardPage({ clientCode, onLogout }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMetric, setSelectedMetric] = useState('fragility')

  async function handleAnalyze() {
    setLoading(true)
    setError('')
    try {
      const analysisRes = await axios.post('/Fragility_score/analyze', {
        client_code: clientCode
      })
      console.log('Full API Response:', analysisRes.data)
      console.log('Total Value from API:', analysisRes.data.total_value)
      console.log('Portfolio Value from API:', analysisRes.data.portfolio_value)
      setReport(analysisRes.data)
    } catch (err) {
      console.error('API Error:', err)
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check that all Docker containers are running.')
      } else if (err.response) {
        setError(err.response.data?.detail || `Server error: ${err.response.status}`)
      } else {
        setError(err.message || 'Analysis failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Chart data 
  const chartData = {
    fragility: [42, 45, 48, 52, 55, 58, 56, 54, 51, 48, 45, 42],
    concentration: [65, 63, 60, 58, 55, 52, 50, 48, 45, 43, 40, 38],
    correlation: [35, 38, 42, 45, 48, 52, 55, 58, 56, 53, 50, 48]
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const currentChartData = chartData[selectedMetric] || chartData.fragility
  const maxValue = Math.max(...currentChartData)
  const minValue = Math.min(...currentChartData)

  // Calculate points for line chart
  const chartWidth = 600
  const chartHeight = 200
  const padding = { top: 20, right: 20, bottom: 20, left: 40 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom

  const points = currentChartData.map((value, index) => ({
    x: padding.left + (index / (currentChartData.length - 1)) * graphWidth,
    y: padding.top + graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight
  }))
  
  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
  const areaPath = `${linePath} L ${points[points.length - 1].x},${padding.top + graphHeight} L ${points[0].x},${padding.top + graphHeight} Z`

  // Pie chart data
  const sectorData = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Finance', value: 32, color: '#10b981' },
    { name: 'Energy', value: 18, color: '#f59e0b' },
    { name: 'Consumer', value: 15, color: '#8b5cf6' }
  ]

  const [hoveredSector, setHoveredSector] = useState(null)

  // Calculate pie chart segments
  let startAngle = -90
  const pieSegments = []
  sectorData.forEach((sector, index) => {
    const angle = (sector.value / 100) * 360
    const endAngle = startAngle + angle
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = 100 + 80 * Math.cos(startRad)
    const y1 = 100 + 80 * Math.sin(startRad)
    const x2 = 100 + 80 * Math.cos(endRad)
    const y2 = 100 + 80 * Math.sin(endRad)
    const largeArc = angle > 180 ? 1 : 0
    
    pieSegments.push({
      ...sector,
      path: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
      endAngle
    })
    startAngle = endAngle
  })

  const getRiskColor = (score) => {
    if (!score) return { bg: '#f1f5f9', text: '#64748b', label: 'Not Analyzed' }
    if (score < 30) return { bg: '#dcfce7', text: '#16a34a', label: 'Low Risk' }
    if (score < 60) return { bg: '#fef3c7', text: '#d97706', label: 'Moderate Risk' }
    return { bg: '#fee2e2', text: '#dc2626', label: 'High Risk' }
  }

  const riskLevel = report ? getRiskColor(report.fragility_score) : { bg: '#f1f5f9', text: '#64748b', label: 'Not Analyzed' }

  // Safely format total value
  const formatTotalValue = (value) => {
    console.log('Formatting value:', value)
    if (!value) return '₹0'
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
    return `₹${value.toLocaleString()}`
  }

  // Get total value from report 
  const getTotalValue = () => {
    if (report?.total_value) {
      return report.total_value
    }
    if (report?.portfolio_value) {
      return report.portfolio_value
    }
    return null
  }

  const totalValue = getTotalValue()

  const metricsCards = [
    { 
      title: 'Fragility Score', 
      value: report?.fragility_score ?? 42, 
      unit: '/100', 
      change: -5, 
      icon: <Shield size={20} />,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    { 
      title: 'Concentration Risk (HHI)', 
      value: report?.metrics?.concentration_hhi ?? 2450, 
      unit: '', 
      change: 320, 
      icon: <Target size={20} />,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    { 
      title: 'Correlation Fragility', 
      value: report?.metrics?.correlation_fragility ?? 0.68, 
      unit: '', 
      change: 0.12, 
      icon: <LinkIcon size={20} />,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    { 
      title: 'Total Value', 
      value: formatTotalValue(totalValue), 
      unit: '', 
      change: 8.2, 
      icon: <Wallet size={20} />,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ]

  return (
    <div className="dashboard-modern">
      {/* Header */}
      <div className="dashboard-modern-header">
        <div>
          <h1>Portfolio Dashboard</h1>
          <p>Welcome back, <span>{clientCode || 'Guest'}</span></p>
        </div>
        <div className="dashboard-header-actions">
          <button className="action-btn secondary" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
          <button className="action-btn primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw size={16} className="spinning" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Portfolio
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-modern">
          <div className="loading-spinner"></div>
          <p>Analyzing your portfolio...</p>
          <span>This may take a few seconds</span>
        </div>
      )}

      {error && (
        <div className="error-modern">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {report && !loading && (
        <>
          {/* Debug info - remove after confirming it works */}
          <div style={{ display: 'none' }}>
            Debug: Total Value Raw = {JSON.stringify(report?.total_value)}
          </div>

          {/* Hero Metrics Cards */}
          <div className="metrics-grid">
            {metricsCards.map((card, idx) => (
              <div key={idx} className="metric-card-modern" style={{ borderTopColor: card.color }}>
                <div className="metric-header">
                  <div className="metric-icon" style={{ background: card.bgColor, color: card.color }}>
                    {card.icon}
                  </div>
                  <span className="metric-title">{card.title}</span>
                </div>
                <div className="metric-value">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  {card.unit === '/100' && <span className="metric-unit">/100</span>}
                </div>
                <div className={`metric-change ${card.change > 0 ? 'positive' : 'negative'}`}>
                  {card.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(card.change)}% vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-main-grid">
            {/* Line Chart Section */}
            <div className="chart-section">
              <div className="section-header">
                <div className="section-title">
                  <LineChart size={18} />
                  <h3>Risk Trend Analysis</h3>
                </div>
                <div className="chart-tabs">
                  {['fragility', 'concentration', 'correlation'].map((metric) => (
                    <button
                      key={metric}
                      className={`chart-tab ${selectedMetric === metric ? 'active' : ''}`}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-wrapper">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="clear-line-chart">
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = padding.top + graphHeight - (val / 100) * graphHeight
                    return (
                      <g key={val}>
                        <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4,4" />
                        <text x={padding.left - 8} y={y + 3} className="chart-y-label">{val}</text>
                      </g>
                    )
                  })}
                  
                  <path d={areaPath} fill="rgba(16, 185, 129, 0.1)" />
                  <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {points.map((point, idx) => (
                    <circle key={idx} cx={point.x} cy={point.y} r="3" fill="#10b981" stroke="white" strokeWidth="1.5" />
                  ))}
                </svg>
                
                <div className="chart-x-lines">
                  {months.map((month, idx) => (
                    <span key={idx} style={{ left: `${(idx / (months.length - 1)) * 100}%` }}>{month}</span>
                  ))}
                </div>
              </div>

              <div className="chart-insights-modern">
                <div className="insight">
                  <TrendingUp size={14} />
                  <span>Trend: <strong>{currentChartData[currentChartData.length - 1] > currentChartData[0] ? 'Increasing' : 'Decreasing'}</strong></span>
                </div>
                <div className="insight">
                  <Activity size={14} />
                  <span>Volatility: <strong>Medium</strong></span>
                </div>
                <div className="insight">
                  <Zap size={14} />
                  <span>Peak: <strong>{Math.max(...currentChartData)}</strong></span>
                </div>
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="pie-chart-section">
              <div className="section-header">
                <div className="section-title">
                  <PieChart size={18} />
                  <h3>Sector Allocation</h3>
                </div>
              </div>

              <div className="pie-chart-container">
                <div className="pie-chart-wrapper">
                  <svg viewBox="0 0 200 200" className="pie-chart-svg">
                    {pieSegments.map((segment, idx) => (
                      <path
                        key={idx}
                        d={segment.path}
                        fill={segment.color}
                        stroke="white"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredSector(idx)}
                        onMouseLeave={() => setHoveredSector(null)}
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'filter 0.2s', 
                          filter: hoveredSector === idx ? 'brightness(0.9)' : 'none',
                          opacity: hoveredSector !== null && hoveredSector !== idx ? 0.6 : 1
                        }}
                      />
                    ))}
                    <circle cx="100" cy="100" r="50" fill="white" />
                    <text x="100" y="95" textAnchor="middle" className="pie-center-text">Total</text>
                    <text x="100" y="115" textAnchor="middle" className="pie-center-value">100%</text>
                  </svg>
                </div>
                
                <div className="pie-legend">
                  {sectorData.map((sector, idx) => (
                    <div 
                      key={idx} 
                      className={`legend-item ${hoveredSector === idx ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredSector(idx)}
                      onMouseLeave={() => setHoveredSector(null)}
                    >
                      <div className="legend-color" style={{ background: sector.color }}></div>
                      <div className="legend-info">
                        <span className="legend-name">{sector.name}</span>
                        <span className="legend-value">{sector.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics Section */}
          <div className="risk-metrics-section">
            <div className="section-header">
              <div className="section-title">
                <Shield size={18} />
                <h3>Risk Metrics Overview</h3>
              </div>
            </div>

            <div className="risk-metrics-grid">
              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <Shield size={16} className="risk-metric-icon" />
                  <span>Fragility Score</span>
                </div>
                <div className="risk-metric-value">{report?.fragility_score ?? 42}/100</div>
                <div className="risk-metric-status" style={{ background: riskLevel.bg, color: riskLevel.text }}>
                  {riskLevel.label}
                </div>
              </div>

              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <Target size={16} className="risk-metric-icon" />
                  <span>HHI Index</span>
                </div>
                <div className="risk-metric-value">{report?.metrics?.concentration_hhi?.toLocaleString() ?? 2450}</div>
                <div className="risk-metric-desc">Measures concentration risk (0-10000)</div>
              </div>

              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <LinkIcon size={16} className="risk-metric-icon" />
                  <span>Correlation Fragility</span>
                </div>
                <div className="risk-metric-value">{report?.metrics?.correlation_fragility ?? 0.68}</div>
                <div className="risk-metric-desc">Difference between normal & crisis correlation</div>
              </div>

              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <BarChart3 size={16} className="risk-metric-icon" />
                  <span>Portfolio Volatility</span>
                </div>
                <div className="risk-metric-value">{((report?.metrics?.portfolio_volatility ?? 0.124) * 100).toFixed(1)}%</div>
                <div className="risk-metric-desc">Annualized volatility</div>
              </div>

              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <TrendingDown size={16} className="risk-metric-icon" />
                  <span>Max Drawdown</span>
                </div>
                <div className="risk-metric-value">{((report?.metrics?.max_drawdown ?? 0.185) * 100).toFixed(1)}%</div>
                <div className="risk-metric-desc">Largest peak-to-trough decline</div>
              </div>

              <div className="risk-metric-card">
                <div className="risk-metric-header">
                  <AlertTriangle size={16} className="risk-metric-icon" />
                  <span>Worst Stress Loss</span>
                </div>
                <div className="risk-metric-value">{Math.abs(report?.metrics?.worst_stress_loss ?? 0).toFixed(1)}%</div>
                <div className="risk-metric-desc">Maximum loss in stress scenarios</div>
              </div>
            </div>
          </div>

          {/* Stress Scenarios Section */}
          {report?.stress_scenarios && Object.keys(report.stress_scenarios).length > 0 && (
            <div className="stress-scenarios-section">
              <div className="section-header">
                <div className="section-title">
                  <Activity size={18} />
                  <h3>Stress Test Scenarios</h3>
                </div>
              </div>
              <div className="stress-scenarios-grid">
                {Object.entries(report.stress_scenarios).map(([scenario, impact], idx) => (
                  <div key={idx} className="stress-card">
                    <div className="stress-name">{scenario.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className={`stress-impact ${impact < -10 ? 'negative' : impact > 5 ? 'positive' : 'neutral'}`}>
                      {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
                    </div>
                    <div className="stress-bar">
                      <div 
                        className="stress-bar-fill" 
                        style={{ 
                          width: `${Math.min(Math.abs(impact), 30)}%`,
                          background: impact < -10 ? '#dc2626' : impact > 5 ? '#10b981' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings Section */}
          {report?.warnings && report.warnings.length > 0 && (
            <div className="warnings-section-modern">
              <div className="section-header">
                <div className="section-title">
                  <AlertTriangle size={18} />
                  <h3>Risk Warnings</h3>
                </div>
              </div>
              <div className="warnings-list-modern">
                {report.warnings.map((warning, idx) => (
                  <div key={idx} className="warning-card">
                    <AlertTriangle size={16} className="warning-icon" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!report && !loading && !error && (
        <div className="empty-state-modern">
          <PieChart size={48} strokeWidth={1.5} />
          <h3>No Analysis Yet</h3>
          <p>Click the "Analyze Portfolio" button to get your risk assessment</p>
        </div>
      )}
    </div>
  )
}
function colorForValue(key, value) {
  if (key === 'concentration_hhi') {
    if (value > 0.25) return 'val-red'
    if (value > 0.15) return 'val-yellow'
    return 'val-green'
  }
  if (key === 'portfolio_volatility') {
    if (value > 0.30) return 'val-red'
    if (value > 0.15) return 'val-yellow'
    return 'val-green'
  }
  if (key === 'max_drawdown') {
    if (value < -0.30) return 'val-red'
    if (value < -0.15) return 'val-yellow'
    return 'val-green'
  }
  if (key === 'worst_stress_loss') {
    if (value < -0.35) return 'val-red'
    if (value < -0.20) return 'val-yellow'
    return 'val-green'
  }
  return ''
}

// plain English labels and explanations for each metric
const METRIC_INFO = {
  concentration_hhi:     { label: 'Concentration (HHI)',   explain: 'How much of portfolio is in few stocks' },
  correlation_normal:    { label: 'Correlation (Normal)',   explain: 'How stocks move together normally' },
  correlation_crisis:    { label: 'Correlation (Crisis)',   explain: 'How stocks move together during a crash' },
  correlation_fragility: { label: 'Correlation Fragility',  explain: 'How much worse correlation gets in a crash' },
  portfolio_volatility:  { label: 'Annual Volatility',      explain: 'How much portfolio swings per year' },
  max_drawdown:          { label: 'Max Drawdown',           explain: 'Worst peak-to-trough drop in last year' },
  worst_stress_loss:     { label: 'Worst Stress Loss',      explain: 'Estimated loss in a COVID-like crash' },
}

function formatValue(key, value) {
  if (key === 'concentration_hhi') return (value * 100).toFixed(1) + '%'
  if (key === 'correlation_normal') return (value * 100).toFixed(1) + '%'
  if (key === 'correlation_crisis') return (value * 100).toFixed(1) + '%'
  if (key === 'correlation_fragility') return (value * 100).toFixed(1) + '%'
  if (key === 'portfolio_volatility') return (value * 100).toFixed(1) + '% / year'
  if (key === 'max_drawdown') return (value * 100).toFixed(1) + '%'
  if (key === 'worst_stress_loss') return (value * 100).toFixed(1) + '%'
  return value
}

export default function MetricsTable({ metrics }) {
  return (
    <div className="card">
      <h3>📈 Risk Metrics</h3>
      {Object.entries(metrics).map(([key, value]) => {
        const info = METRIC_INFO[key]
        if (!info) return null
        return (
          <div className="metric-row" key={key}>
            <div>
              <div className="metric-name">{info.label}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{info.explain}</div>
            </div>
            <div className={`metric-value ${colorForValue(key, value)}`}>
              {formatValue(key, value)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
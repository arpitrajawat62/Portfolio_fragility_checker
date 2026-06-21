export default function ScoreCard({ report }) {
  const score = report.fragility_score
  const label = report.fragility_label

  const numClass   = label === 'Low' ? 'score-low'    : label === 'Medium' ? 'score-medium'   : 'score-high'
  const labelClass = label === 'Low' ? 'label-low'    : label === 'Medium' ? 'label-medium'   : 'label-high'
  const barColor   = label === 'Low' ? '#16a34a'       : label === 'Medium' ? '#d97706'         : '#dc2626'

  return (
    <div className="score-card">
      <p className="score-card-top">Fragility Score</p>
      <div className={`score-number ${numClass}`}>{score}</div>
      <div className="score-out-of">out of 100</div>
      <span className={`score-label ${labelClass}`}>{label.toUpperCase()} RISK</span>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: barColor }} />
      </div>
      <div className="portfolio-value">
        Portfolio Value: ₹{report.portfolio_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </div>
    </div>
  )
}
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function StressChart({ report }) {
  const portfolioValue = report.portfolio_value

  const data = [
    {
      name: 'COVID 2020',
      loss_pct: Math.abs(report.stress_scenarios.covid_crash_2020 * 100).toFixed(1),
      loss_inr: Math.abs(report.stress_scenarios.covid_crash_2020 * portfolioValue).toFixed(0)
    },
    {
      name: 'Rate Hike 2022',
      loss_pct: Math.abs(report.stress_scenarios.rate_hike_2022 * 100).toFixed(1),
      loss_inr: Math.abs(report.stress_scenarios.rate_hike_2022 * portfolioValue).toFixed(0)
    },
    {
      name: 'INR Crisis',
      loss_pct: Math.abs(report.stress_scenarios.currency_crisis * 100).toFixed(1),
      loss_inr: Math.abs(report.stress_scenarios.currency_crisis * portfolioValue).toFixed(0)
    }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 6 }}>
          <p style={{ fontWeight: 700 }}>{label}</p>
          <p style={{ color: '#dc2626' }}>Loss: -{payload[0].value}%</p>
          <p style={{ color: '#dc2626' }}>≈ -₹{Number(data.find(d => d.name === label)?.loss_inr).toLocaleString('en-IN')}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3>💥 Stress Test Scenarios</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" tickFormatter={v => `${v}%`} domain={[0, 50]} />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="loss_pct" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#dc2626' : i === 1 ? '#f59e0b' : '#f97316'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
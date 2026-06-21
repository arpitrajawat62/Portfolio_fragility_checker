import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4']

export default function PortfolioPieChart({ holdings }) {
  if (!holdings || holdings.length === 0) return null

  const data = holdings.map(h => ({
    name: h.symbol.replace('-EQ', ''),     // strip "-EQ" for cleaner label
    value: parseFloat((h.portfolio_weight * 100).toFixed(1))
  }))

  return (
    <div className="card">
      <h3>📊 Portfolio Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
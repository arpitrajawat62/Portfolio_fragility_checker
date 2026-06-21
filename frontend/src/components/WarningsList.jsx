export default function WarningsList({ warnings }) {
  if (!warnings || warnings.length === 0) return null

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>⚠️ Warnings</h3>
      {warnings.map((w, i) => (
        <div className="warning-item" key={i}>
          <span>⚠️</span>
          <span>{w}</span>
        </div>
      ))}
    </div>
  )
}
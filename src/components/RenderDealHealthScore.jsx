import { Shield } from 'lucide-react'

const styles = {
  healthScore: {
    padding: '1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #10b981',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto 2rem',
  },
  healthScoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  healthScoreValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  healthScoreIssues: {
    fontSize: '0.875rem',
    color: '#475569',
    marginTop: '0.5rem',
  },
}

const getHealthColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
const RenderDealHealthScore = ({ dealHealth }) => {
  /*
      TODO: 
      1. Refactor this code
      2. Fix logic if any

      ToAsk:
      1. Why do we need this?
      2. Logic behind this
  */

  return (
    <>
      {dealHealth.score < 100 && (
        <div
          style={{
            ...styles.healthScore,
            backgroundColor:
              dealHealth.score >= 80 ? '#f0fdf4' : dealHealth.score >= 60 ? '#fef3c7' : '#fee2e2',
            borderColor: getHealthColor(dealHealth.score),
            maxWidth: '800px',
            margin: '0 auto 2rem',
          }}
        >
          <div style={styles.healthScoreHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} style={{ color: getHealthColor(dealHealth.score) }} />
              <span style={{ fontWeight: '600' }}>Deal Health Score</span>
            </div>
            <span
              style={{
                ...styles.healthScoreValue,
                color: getHealthColor(dealHealth.score),
              }}
            >
              {dealHealth.score}%
            </span>
          </div>
          {dealHealth.issues.length > 0 && (
            <div style={styles.healthScoreIssues}>
              <strong>Suggestions:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                {dealHealth.issues.slice(0, 3).map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RenderDealHealthScore

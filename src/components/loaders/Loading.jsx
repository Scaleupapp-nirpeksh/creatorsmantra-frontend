const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
}

const Loading = ({ page }) => {
  return (
    <div style={styles.container}>
      <div style={styles.loading}>
        <div style={styles.loadingSpinner}></div>
        <span>Loading {page}...</span>
      </div>
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  )
}

export default Loading

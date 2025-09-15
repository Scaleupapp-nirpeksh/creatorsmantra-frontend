const styles = {
  pageLoadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
  },

  pageSpinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    position: 'relative',
  },

  pageSpinnerGradient: {
    width: '100%',
    height: '100%',
    border: '3px solid rgba(102, 126, 234, 0.2)',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  pageLoadingText: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
}

const PageLoader = () => (
  <div style={styles.pageLoadingContainer}>
    <div style={styles.pageSpinner}>
      <div style={styles.pageSpinnerGradient}></div>
    </div>
    <p style={styles.pageLoadingText}>Loading...</p>
  </div>
)

export default PageLoader

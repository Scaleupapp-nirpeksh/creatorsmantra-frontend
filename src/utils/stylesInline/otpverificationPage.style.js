export const otpVerificationPageStyles = {
  container: {
    maxWidth: '420px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--color-neutral-900)',
    marginBottom: '0.5rem',
  },

  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-neutral-600)',
    marginBottom: '0.5rem',
  },

  phoneNumber: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--color-primary-600)',
  },

  otpContainer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },

  otpInput: {
    width: '50px',
    height: '50px',
    border: '2px solid var(--color-neutral-300)',
    borderRadius: '12px',
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    background: 'white',
  },

  otpInputFilled: {
    borderColor: 'var(--color-primary-500)',
    background: 'rgba(102, 126, 234, 0.05)',
  },

  verifyButton: {
    width: '100%',
    padding: '0.875rem',
    background:
      'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },

  resendContainer: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--color-neutral-600)',
  },

  resendButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary-600)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },

  resendDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-neutral-600)',
    fontSize: '0.875rem',
    marginBottom: '2rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0.5rem',
  },

  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-neutral-500)',
    textAlign: 'center',
    marginTop: '1rem',
  },
}

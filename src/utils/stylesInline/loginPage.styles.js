export const loginPageStyles = {
  container: {
    maxWidth: '440px',
    width: '100%',
    margin: '0 auto',
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
    fontSize: '1rem',
    color: 'var(--color-neutral-600)',
  },

  methodToggle: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.25rem',
    background: 'var(--color-neutral-100)',
    borderRadius: '12px',
    marginBottom: '2rem',
  },

  methodButton: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'transparent',
    color: 'var(--color-neutral-600)',
  },

  methodButtonActive: {
    background: 'white',
    color: 'var(--color-primary-600)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--color-neutral-700)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    paddingLeft: '2.75rem',
    border: '1px solid var(--color-neutral-300)',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'white',
  },

  inputError: {
    borderColor: 'var(--color-error)',
  },

  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--color-neutral-400)',
    pointerEvents: 'none',
  },

  passwordToggle: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--color-neutral-400)',
    cursor: 'pointer',
    padding: '0.25rem',
  },

  error: {
    fontSize: '0.75rem',
    color: 'var(--color-error)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    fontSize: '0.875rem',
    color: 'var(--color-primary-600)',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },

  submitButton: {
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
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },

  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0',
  },

  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--color-neutral-200)',
  },

  dividerText: {
    fontSize: '0.875rem',
    color: 'var(--color-neutral-500)',
    fontWeight: '500',
  },

  signupLink: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--color-neutral-600)',
  },

  signupLinkAnchor: {
    color: 'var(--color-primary-600)',
    textDecoration: 'none',
    fontWeight: '600',
  },

  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1.5rem',
    background: 'var(--color-neutral-50)',
    borderRadius: '12px',
    marginTop: '2rem',
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: 'var(--color-neutral-700)',
  },

  featureIcon: {
    color: 'var(--color-success)',
  },
}

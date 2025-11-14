export const registerPageStyles = {
  container: {
    maxWidth: '520px',
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
    color: '#111827',
    marginBottom: '0.5rem',
  },

  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
  },

  progressContainer: {
    marginBottom: '2rem',
  },

  progressBar: {
    height: '4px',
    background: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
  },

  progressSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },

  progressStep: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#9ca3af',
    transition: 'all 0.3s ease',
  },

  progressStepActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },

  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#9ca3af',
  },

  progressLabelActive: {
    color: '#667eea',
    fontWeight: '600',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  stepContent: {
    minHeight: '400px',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  required: {
    color: '#ef4444',
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
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'white',
    outline: 'none',
  },

  inputError: {
    borderColor: '#ef4444',
  },

  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#9ca3af',
    pointerEvents: 'none',
  },

  passwordToggle: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0.25rem',
  },

  error: {
    fontSize: '0.75rem',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },

  creatorTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginTop: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '0.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
  },

  creatorTypeOption: {
    padding: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    userSelect: 'none',
  },

  creatorTypeOptionSelected: {
    borderColor: '#667eea',
    background: 'rgba(102, 126, 234, 0.05)',
  },

  creatorTypeIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
  },

  creatorTypeLabel: {
    fontSize: '0.7rem',
    fontWeight: '500',
    color: '#374151',
  },

  socialSection: {
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '12px',
    marginBottom: '1rem',
  },

  socialHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },

  socialInputGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },

  backButton: {
    padding: '0.875rem 1.5rem',
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  nextButton: {
    flex: 1,
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  helpText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontStyle: 'italic',
  },

  loginLink: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '2rem',
  },

  loginLinkAnchor: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },

  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '12px',
    marginTop: '1rem',
  },

  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: '#374151',
  },

  benefitIcon: {
    color: '#10b981',
  },

  passwordStrength: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#f3f4f6',
    borderRadius: '8px',
  },

  passwordStrengthBar: {
    height: '4px',
    background: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },

  passwordStrengthFill: {
    height: '100%',
    transition: 'all 0.3s ease',
  },

  passwordRequirements: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },

  requirement: {
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
}

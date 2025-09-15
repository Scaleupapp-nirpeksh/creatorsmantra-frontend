const baseStyle = {
  padding: '0.625rem 0.875rem',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  outline: 'none',
  transition: 'all 0.2s',
  width: '100%',
  backgroundColor: '#fff',
}

const errorStyle = {
  borderColor: '#ef4444',
}

const Dropdown = ({
  name,
  label,
  options = [],
  required = false,
  error = false,
  style = {},
  className = '',
  placeholder = 'Select an option',
  ...rest
}) => {
  const mergedStyles = {
    ...baseStyle,
    ...(error ? errorStyle : {}),
    ...style,
  }

  return (
    <div className={`dropdown-wrapper ${className}`}>
      {label && (
        <div style={{ marginBottom: '0.25rem' }}>
          <label htmlFor={name} style={{ fontSize: '0.875rem' }}>
            {label}
          </label>
          {required && (
            <span
              style={{
                color: '#ef4444',
              }}
            >
              *
            </span>
          )}
        </div>
      )}

      <select id={name} name={name} style={mergedStyles} {...rest}>
        {/* <option value="" disabled>
          {placeholder}
        </option> */}
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span
          style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}
        >
          {typeof error === 'string' ? error : 'This field is required'}
        </span>
      )}
    </div>
  )
}

export default Dropdown

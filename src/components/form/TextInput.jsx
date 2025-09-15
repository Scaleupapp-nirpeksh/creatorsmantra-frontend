const baseStyle = {
  padding: '0.625rem 0.875rem',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  outline: 'none',
  transition: 'all 0.2s',
  width: '100%',
}

const errorStyle = {
  borderColor: '#ef4444',
}

const TextInput = ({
  type = 'text',
  name,
  label,
  required = false,
  value,
  onChange,
  placeholder,
  error = '',
  style = {}, // override styles
  className = '',
  ...rest
}) => {
  const ifCheckBox = type === 'checkbox'

  const mergedStyles = ifCheckBox
    ? {}
    : {
        ...baseStyle,
        ...(error ? errorStyle : {}),
        ...style,
      }

  return (
    <div
      className={`text-input-wrapper ${className}`}
      style={
        ifCheckBox
          ? {
              display: 'flex',
              alignIems: 'center',
              gap: '0.5rem',
            }
          : {}
      }
    >
      {label && (
        <div style={{ marginBottom: '0.25rem' }}>
          <label
            htmlFor={name}
            style={{
              fontSize: '0.875rem',
              ...(ifCheckBox ? { whiteSpace: 'nowrap' } : {}),
            }}
          >
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
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={mergedStyles}
        {...rest}
      />
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

export default TextInput

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
  const isCheckBox = type === 'checkbox'

  const mergedStyles = isCheckBox
    ? {}
    : {
        ...baseStyle,
        ...(error ? errorStyle : {}),
        ...style,
      }

  const inputElement = (
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
  )

  const labelElement = label && (
    <label
      htmlFor={name}
      style={{
        fontSize: '0.875rem',
        ...(isCheckBox ? { whiteSpace: 'nowrap', marginLeft: '0.5rem' } : {}),
      }}
    >
      {label}
      {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
  )

  return (
    <div
      className={`text-input-wrapper ${className}`}
      style={
        isCheckBox
          ? {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }
          : {}
      }
    >
      {isCheckBox ? (
        <>
          {inputElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement && <div style={{ marginBottom: '0.25rem' }}>{labelElement}</div>}
          {inputElement}
        </>
      )}

      {error && (
        <span
          style={{
            color: '#ef4444',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'block',
          }}
        >
          {typeof error === 'string' ? error : 'This field is required'}
        </span>
      )}
    </div>
  )
}

export default TextInput

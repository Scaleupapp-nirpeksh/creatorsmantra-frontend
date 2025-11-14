// TextArea.jsx
import React from 'react'

const baseStyle = {
  padding: '0.625rem 0.875rem',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  outline: 'none',
  transition: 'all 0.2s',
  width: '100%',
  resize: 'vertical', // allows vertical resizing
  minHeight: '80px',
  backgroundColor: '#fff',
}

const errorStyle = {
  borderColor: '#ef4444',
}

const TextArea = ({
  name,
  label,
  value,
  onChange,
  placeholder = '',
  error = false,
  required = false,
  style = {},
  className = '',
  rows = 4,
  ...rest
}) => {
  const mergedStyles = {
    ...baseStyle,
    ...(error ? errorStyle : {}),
    ...style,
  }

  return (
    <div className={`textarea-wrapper ${className}`}>
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
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

export default TextArea

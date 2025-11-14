import React, { useState } from 'react'
import TextInput from './TextInput' // import your existing TextInput

const TagsInput = ({
  tags,
  onChange,
  name,
  label,
  required = false,
  placeholder = 'Add Tags...',
  error = '',
  customStyle,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault()
      const newTag = inputValue.trim()

      if (!tags?.includes(newTag))
        onChange(
          {
            target: {
              name,
              value: [...(tags || []), newTag],
            },
          },
          name
        )

      setInputValue('')
      console.log(tags)
    }
  }

  const removeTag = (tagToRemove) => {
    onChange(
      {
        target: {
          name,
          value: tags.filter((tag) => tag !== tagToRemove),
        },
      },
      name
    )
  }

  return (
    <div>
      {/* Chips */}

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '8px' }}>
        {Array.isArray(tags) &&
          tags?.map((tag, idx) => {
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#e2e8f0',
                  borderRadius: '16px',
                  padding: '4px 8px',
                  margin: '4px',
                  fontSize: '14px',
                }}
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    marginLeft: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })}
      </div>

      <TextInput
        type="text"
        name={name}
        label={label}
        required={required}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        error={error}
        className={customStyle}
        {...rest}
      />
    </div>
  )
}

export default TagsInput

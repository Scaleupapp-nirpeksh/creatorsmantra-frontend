/**
 * CreatorsMantra Design System - Input Component
 * Comprehensive form input system with validation, icons, and multiple variants
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @path src/components/common/Input/index.js
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({
  type = 'text',
  variant = 'default',
  size = 'md',
  placeholder = '',
  label = '',
  value = '',
  defaultValue = '',
  error = '',
  helperText = '',
  success = false,
  disabled = false,
  required = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  clearable = false,
  autoFocus = false,
  maxLength = null,
  rows = 3,
  resize = 'vertical',
  options = [],
  multiple = false,
  searchable = false,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onClear = () => {},
  onIconClick = () => {},
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || value);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  // Update internal value when prop value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle value change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e, newValue);
  };

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus(e);
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur(e);
  };

  // Handle clear
  const handleClear = () => {
    setInternalValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    onClear();
    onChange({ target: { value: '' } }, '');
  };

  // Handle password toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // Get input classes
  const getInputClasses = () => {
    const classes = [
      'input',
      `input--${variant}`,
      `input--${size}`,
      {
        'input--focused': isFocused,
        'input--error': error,
        'input--success': success,
        'input--disabled': disabled,
        'input--loading': loading,
        'input--with-icon': icon,
        'input--icon-right': iconPosition === 'right',
        'input--clearable': clearable && internalValue,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  // Get wrapper classes
  const getWrapperClasses = () => {
    const classes = [
      'input-wrapper',
      className,
      {
        'input-wrapper--focused': isFocused,
        'input-wrapper--error': error,
        'input-wrapper--success': success,
        'input-wrapper--disabled': disabled,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  // Render icon
  const renderIcon = () => {
    if (loading) {
      return (
        <div className="input__icon input__icon--loading">
          <div className="input__spinner"></div>
        </div>
      );
    }

    if (type === 'password') {
      return (
        <button
          type="button"
          className="input__icon input__icon--clickable"
          onClick={handlePasswordToggle}
          tabIndex={-1}
        >
          {showPassword ? '👁️‍🗨️' : '👁️'}
        </button>
      );
    }

    if (icon) {
      return (
        <div 
          className={`input__icon ${onIconClick ? 'input__icon--clickable' : ''}`}
          onClick={onIconClick}
        >
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
      );
    }

    return null;
  };

  // Render clear button
  const renderClearButton = () => {
    if (clearable && internalValue && !disabled) {
      return (
        <button
          type="button"
          className="input__clear"
          onClick={handleClear}
          tabIndex={-1}
          aria-label="Clear input"
        >
          ✕
        </button>
      );
    }
    return null;
  };

  // Render character count
  const renderCharacterCount = () => {
    if (maxLength && (type === 'text' || type === 'textarea')) {
      return (
        <div className="input__character-count">
          {internalValue.length}/{maxLength}
        </div>
      );
    }
    return null;
  };

  // Common input props
  const commonProps = {
    ref: inputRef,
    value: internalValue,
    placeholder,
    disabled: disabled || loading,
    required,
    maxLength,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined,
    ...props
  };

  // Render input based on type
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            className={getInputClasses()}
            rows={rows}
            style={{ resize }}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            className={getInputClasses()}
            multiple={multiple}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option
                key={index}
                value={typeof option === 'object' ? option.value : option}
              >
                {typeof option === 'object' ? option.label : option}
              </option>
            ))}
          </select>
        );

      case 'password':
        return (
          <input
            {...commonProps}
            type={showPassword ? 'text' : 'password'}
            className={getInputClasses()}
            autoComplete="current-password"
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            className={getInputClasses()}
          />
        );
    }
  };

  return (
    <div className={getWrapperClasses()}>
      {/* Label */}
      {label && (
        <label className="input__label" htmlFor={props.id}>
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="input__container">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && renderIcon()}
        
        {/* Input Element */}
        {renderInput()}
        
        {/* Right Elements */}
        <div className="input__right-elements">
          {clearable && renderClearButton()}
          {icon && iconPosition === 'right' && renderIcon()}
          {type === 'password' && renderIcon()}
        </div>
      </div>

      {/* Helper Elements */}
      <div className="input__footer">
        {/* Error Message */}
        {error && (
          <div className="input__error" id={`${props.id}-error`} role="alert">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && typeof success === 'string' && (
          <div className="input__success">
            {success}
          </div>
        )}
        
        {/* Helper Text */}
        {helperText && !error && (
          <div className="input__helper" id={`${props.id}-helper`}>
            {helperText}
          </div>
        )}
        
        {/* Character Count */}
        {renderCharacterCount()}
      </div>
    </div>
  );
};

Input.propTypes = {
  // Basic props
  type: PropTypes.oneOf([
    'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'textarea', 'select'
  ]),
  variant: PropTypes.oneOf(['default', 'filled', 'outlined']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  // Content props
  placeholder: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  
  // State props
  error: PropTypes.string,
  helperText: PropTypes.string,
  success: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  loading: PropTypes.bool,
  
  // Icon props
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  
  // Behavior props
  clearable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  
  // Textarea specific
  rows: PropTypes.number,
  resize: PropTypes.oneOf(['none', 'vertical', 'horizontal', 'both']),
  
  // Select specific
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ])
  ),
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  
  // Event handlers
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  onIconClick: PropTypes.func,
  
  // Style props
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
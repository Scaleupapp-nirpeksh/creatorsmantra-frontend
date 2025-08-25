import React, { useState, useRef, useEffect } from 'react';
import { Search, AlertCircle, Check, Loader2, X } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({
  // Basic props
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  autoComplete,
  
  // Styling props
  variant = 'default', // default, search, currency
  size = 'medium', // small, medium, large
  fullWidth = false,
  className = '',
  
  // Label & Help
  label,
  helperText,
  
  // Validation
  error = false,
  errorMessage,
  success = false,
  successMessage,
  
  // Icons & Actions
  icon,
  iconPosition = 'left',
  clearable = false,
  onClear,
  
  // Loading
  loading = false,
  
  // Currency specific
  currency = 'INR',
  
  // Search specific
  onSearch,
  searchDebounce = 300,
  
  // Character limit
  maxLength,
  showCharCount = false,
  
  // Additional
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setInternalValue(value || '');
    setCharCount((value || '').length);
  }, [value]);

  // Format currency value
  const formatCurrency = (val) => {
    if (!val) return '';
    const number = parseFloat(val.replace(/[^\d.]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number);
  };

  // Handle input change
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Handle currency formatting
    if (variant === 'currency') {
      const rawValue = newValue.replace(/[^\d.]/g, '');
      setInternalValue(rawValue);
      newValue = rawValue;
    } else {
      setInternalValue(newValue);
    }
    
    setCharCount(newValue.length);
    
    if (onChange) {
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    }
    
    // Handle search with debounce
    if (variant === 'search' && onSearch) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(newValue);
      }, searchDebounce);
    }
  };

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    
    // Format currency on blur
    if (variant === 'currency' && internalValue) {
      const formatted = formatCurrency(internalValue);
      setInternalValue(formatted);
    }
    
    if (onBlur) onBlur(e);
  };

  // Handle clear
  const handleClear = () => {
    setInternalValue('');
    setCharCount(0);
    if (onChange) {
      onChange({
        target: {
          name,
          value: ''
        }
      });
    }
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  // Get icon component
  const getIcon = () => {
    if (loading) return <Loader2 className={styles.iconLoading} />;
    if (error) return <AlertCircle className={styles.iconError} />;
    if (success) return <Check className={styles.iconSuccess} />;
    if (variant === 'search') return <Search className={styles.icon} />;
    if (icon) return <span className={styles.icon}>{icon}</span>;
    return null;
  };

  // Build class names
  const containerClasses = [
    styles.inputContainer,
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    styles[`variant-${variant}`],
    error && styles.error,
    success && styles.success,
    isFocused && styles.focused,
    (icon || variant === 'search') && iconPosition === 'left' && styles.hasIconLeft,
    (icon || variant === 'search') && iconPosition === 'right' && styles.hasIconRight,
    clearable && internalValue && styles.hasClear
  ].filter(Boolean).join(' ');

  const displayValue = variant === 'currency' && !isFocused && internalValue
    ? formatCurrency(internalValue)
    : internalValue;

  return (
    <div className={containerClasses}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {iconPosition === 'left' && getIcon()}
        
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={variant === 'currency' ? 'text' : type}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={inputClasses}
          aria-invalid={error}
          aria-describedby={
            error ? `${name}-error` : 
            success ? `${name}-success` : 
            helperText ? `${name}-helper` : undefined
          }
          {...props}
        />
        
        {iconPosition === 'right' && !clearable && getIcon()}
        
        {clearable && internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear input"
          >
            <X />
          </button>
        )}
      </div>
      
      {(helperText || errorMessage || successMessage || (showCharCount && maxLength)) && (
        <div className={styles.helperSection}>
          <div className={styles.messages}>
            {error && errorMessage && (
              <span id={`${name}-error`} className={styles.errorMessage}>
                {errorMessage}
              </span>
            )}
            {success && successMessage && (
              <span id={`${name}-success`} className={styles.successMessage}>
                {successMessage}
              </span>
            )}
            {!error && !success && helperText && (
              <span id={`${name}-helper`} className={styles.helperText}>
                {helperText}
              </span>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <span className={styles.charCount}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
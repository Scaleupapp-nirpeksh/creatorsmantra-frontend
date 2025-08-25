/**
 * Select Component
 * Path: src/components/common/FormComponents/Select.jsx
 * 
 * Advanced dropdown component with search, multi-select, and async loading capabilities.
 * Used throughout the deals module for:
 * - Pipeline stage selection
 * - Brand/client selection
 * - Filter dropdowns
 * - Status updates
 * - Team member assignment
 * 
 * Features:
 * - Single and multi-select modes
 * - Searchable options
 * - Async data loading
 * - Custom option rendering
 * - Keyboard navigation
 * - Mobile-optimized
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Check, Search, Loader2, AlertCircle } from 'lucide-react';
import styles from './Select.module.css';

const Select = ({
  // Basic props
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  
  // Multi-select
  multiple = false,
  maxSelections = null,
  
  // Styling
  size = 'medium', // small, medium, large
  variant = 'default', // default, bordered, ghost
  fullWidth = false,
  className = '',
  
  // Label & Help
  label,
  helperText,
  
  // Validation
  error = false,
  errorMessage,
  
  // Search
  searchable = false,
  searchPlaceholder = 'Search...',
  noOptionsMessage = 'No options found',
  
  // Async
  loading = false,
  onSearch = null, // For async search
  
  // Custom rendering
  formatOptionLabel = null, // Custom option display
  formatValue = null, // Custom selected value display
  
  // Icons
  icon = null,
  clearable = false,
  
  // Grouping
  grouped = false, // If options have 'group' property
  
  // Position
  dropdownPosition = 'auto', // auto, top, bottom
  
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [internalValue, setInternalValue] = useState(value || (multiple ? [] : ''));
  const [dropdownDirection, setDropdownDirection] = useState('bottom');
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value || (multiple ? [] : ''));
  }, [value, multiple]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current && dropdownPosition === 'auto') {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownDirection('top');
      } else {
        setDropdownDirection('bottom');
      }
    }
  }, [isOpen, dropdownPosition]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Filter options based on search
  const getFilteredOptions = useCallback(() => {
    if (!searchTerm || onSearch) return options;
    
    return options.filter(option => {
      const label = option.label || option.value || option;
      return label.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [options, searchTerm, onSearch]);

  // Group options if needed
  const getGroupedOptions = useCallback(() => {
    const filtered = getFilteredOptions();
    
    if (!grouped) return { '': filtered };
    
    return filtered.reduce((groups, option) => {
      const group = option.group || '';
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    }, {});
  }, [getFilteredOptions, grouped]);

  // Handle selection
  const handleSelect = (option) => {
    const optionValue = option.value !== undefined ? option.value : option;
    
    if (multiple) {
      let newValue = [...internalValue];
      const index = newValue.findIndex(v => v === optionValue);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        if (!maxSelections || newValue.length < maxSelections) {
          newValue.push(optionValue);
        }
      }
      
      setInternalValue(newValue);
      if (onChange) {
        onChange({ target: { name, value: newValue } });
      }
    } else {
      setInternalValue(optionValue);
      setIsOpen(false);
      if (onChange) {
        onChange({ target: { name, value: optionValue } });
      }
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    const emptyValue = multiple ? [] : '';
    setInternalValue(emptyValue);
    if (onChange) {
      onChange({ target: { name, value: emptyValue } });
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setHighlightedIndex(0);
    
    if (onSearch) {
      onSearch(term);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const filtered = getFilteredOptions();
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filtered.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
        
      default:
        break;
    }
  };

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      if (internalValue.length === 0) return placeholder;
      
      if (formatValue) {
        return formatValue(internalValue, options);
      }
      
      const selectedOptions = options.filter(opt => 
        internalValue.includes(opt.value !== undefined ? opt.value : opt)
      );
      
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label || selectedOptions[0].value || selectedOptions[0];
      }
      
      return `${selectedOptions.length} selected`;
    } else {
      if (!internalValue) return placeholder;
      
      if (formatValue) {
        return formatValue(internalValue, options);
      }
      
      const selected = options.find(opt => 
        (opt.value !== undefined ? opt.value : opt) === internalValue
      );
      
      return selected ? (selected.label || selected.value || selected) : internalValue;
    }
  };

  // Check if option is selected
  const isSelected = (option) => {
    const optionValue = option.value !== undefined ? option.value : option;
    
    if (multiple) {
      return internalValue.includes(optionValue);
    }
    
    return internalValue === optionValue;
  };

  // Build class names
  const containerClasses = [
    styles.selectContainer,
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const selectClasses = [
    styles.select,
    styles[`variant-${variant}`],
    isOpen && styles.open,
    error && styles.error,
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  const dropdownClasses = [
    styles.dropdown,
    styles[`dropdown-${dropdownDirection}`],
    isOpen && styles.dropdownOpen
  ].filter(Boolean).join(' ');

  const hasValue = multiple ? internalValue.length > 0 : !!internalValue;

  return (
    <div className={containerClasses} ref={containerRef}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.selectWrapper}>
        <button
          ref={inputRef}
          id={name}
          type="button"
          className={selectClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error}
          aria-describedby={
            error ? `${name}-error` : 
            helperText ? `${name}-helper` : undefined
          }
        >
          {icon && <span className={styles.icon}>{icon}</span>}
          
          <span className={[
            styles.value,
            !hasValue && styles.placeholder
          ].filter(Boolean).join(' ')}>
            {getDisplayValue()}
          </span>
          
          <div className={styles.actions}>
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <X />
              </button>
            )}
            
            {loading ? (
              <Loader2 className={styles.loadingIcon} />
            ) : (
              <ChevronDown className={[
                styles.chevron,
                isOpen && styles.chevronOpen
              ].filter(Boolean).join(' ')} />
            )}
          </div>
        </button>
        
        {isOpen && (
          <div className={dropdownClasses} ref={dropdownRef}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            
            <div className={styles.optionsList} role="listbox">
              {loading ? (
                <div className={styles.loadingState}>
                  <Loader2 className={styles.spinner} />
                  <span>Loading options...</span>
                </div>
              ) : Object.entries(getGroupedOptions()).length === 0 ? (
                <div className={styles.noOptions}>
                  {noOptionsMessage}
                </div>
              ) : (
                Object.entries(getGroupedOptions()).map(([groupName, groupOptions]) => (
                  <div key={groupName}>
                    {groupName && (
                      <div className={styles.groupHeader}>{groupName}</div>
                    )}
                    {groupOptions.map((option, index) => {
                      const optionValue = option.value !== undefined ? option.value : option;
                      const optionLabel = option.label || option.value || option;
                      const isHighlighted = index === highlightedIndex;
                      const selected = isSelected(option);
                      
                      return (
                        <button
                          key={optionValue}
                          type="button"
                          className={[
                            styles.option,
                            selected && styles.selected,
                            isHighlighted && styles.highlighted,
                            option.disabled && styles.optionDisabled
                          ].filter(Boolean).join(' ')}
                          onClick={() => !option.disabled && handleSelect(option)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          role="option"
                          aria-selected={selected}
                          disabled={option.disabled}
                        >
                          {formatOptionLabel ? (
                            formatOptionLabel(option, { selected })
                          ) : (
                            <>
                              <span className={styles.optionLabel}>
                                {optionLabel}
                              </span>
                              {selected && (
                                <Check className={styles.checkIcon} />
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {(helperText || errorMessage) && (
        <div className={styles.helperSection}>
          {error && errorMessage && (
            <span id={`${name}-error`} className={styles.errorMessage}>
              <AlertCircle className={styles.errorIcon} />
              {errorMessage}
            </span>
          )}
          {!error && helperText && (
            <span id={`${name}-helper`} className={styles.helperText}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
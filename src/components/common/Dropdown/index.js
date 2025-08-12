/**
 * CreatorsMantra Design System - Dropdown Component
 * Comprehensive dropdown system with search, multi-select, and keyboard navigation
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @path src/components/common/Dropdown/index.js
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

const Dropdown = ({
  // Core props
  isOpen = false,
  onToggle = () => {},
  onClose = () => {},
  
  // Trigger props
  trigger = null,
  triggerElement = 'button',
  placeholder = 'Select option...',
  triggerClassName = '',
  
  // Options props
  options = [],
  value = null,
  defaultValue = null,
  multiple = false,
  clearable = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  
  // Behavior props
  closeOnSelect = true,
  closeOnClickOutside = true,
  disabled = false,
  loading = false,
  
  // Display props
  variant = 'default',
  size = 'md',
  position = 'bottom-left',
  width = 'auto',
  maxHeight = '300px',
  showCheckboxes = false,
  showIcons = false,
  
  // Event handlers
  onChange = () => {},
  onSearch = null,
  onOptionClick = () => {},
  onClear = () => {},
  
  // Content props
  emptyMessage = 'No options available',
  loadingMessage = 'Loading options...',
  
  // Style props
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  
  // Advanced props
  filterFunction = null,
  renderOption = null,
  renderTrigger = null,
  getOptionLabel = (option) => typeof option === 'object' ? option.label : option,
  getOptionValue = (option) => typeof option === 'object' ? option.value : option,
  getOptionIcon = (option) => typeof option === 'object' ? option.icon : null,
  isOptionDisabled = (option) => typeof option === 'object' ? option.disabled : false,
  
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || value || (multiple ? [] : null));
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [internalOpen, setInternalOpen] = useState(isOpen);
  
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const optionsRef = useRef([]);
  
  // Update internal state when props change
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);
  
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);
  
  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    if (filterFunction) {
      return filterFunction(options, searchTerm);
    }
    
    return options.filter(option => {
      const label = getOptionLabel(option).toLowerCase();
      return label.includes(searchTerm.toLowerCase());
    });
  }, [options, searchTerm, filterFunction, getOptionLabel]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeOnClickOutside &&
        internalOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [internalOpen, closeOnClickOutside]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && internalOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [internalOpen]);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (internalOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [internalOpen, searchable]);
  
  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;
    
    const newOpen = !internalOpen;
    setInternalOpen(newOpen);
    onToggle(newOpen);
    
    if (newOpen) {
      setFocusedIndex(-1);
      setSearchTerm('');
    }
  };
  
  // Handle close
  const handleClose = () => {
    setInternalOpen(false);
    onClose();
    setFocusedIndex(-1);
    setSearchTerm('');
  };
  
  // Handle option selection
  const handleOptionSelect = (option, optionIndex) => {
    if (isOptionDisabled(option)) return;
    
    let newValue;
    
    if (multiple) {
      const optionValue = getOptionValue(option);
      const currentValues = Array.isArray(internalValue) ? internalValue : [];
      
      if (currentValues.includes(optionValue)) {
        newValue = currentValues.filter(v => v !== optionValue);
      } else {
        newValue = [...currentValues, optionValue];
      }
    } else {
      newValue = getOptionValue(option);
    }
    
    setInternalValue(newValue);
    onChange(newValue, option);
    onOptionClick(option, optionIndex);
    
    if (closeOnSelect && !multiple) {
      handleClose();
    }
  };
  
  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    const newValue = multiple ? [] : null;
    setInternalValue(newValue);
    onChange(newValue, null);
    onClear();
  };
  
  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFocusedIndex(-1);
    
    if (onSearch) {
      onSearch(term);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!internalOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[focusedIndex], focusedIndex);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
        
      default:
        break;
    }
  };
  
  // Check if option is selected
  const isOptionSelected = (option) => {
    const optionValue = getOptionValue(option);
    
    if (multiple) {
      return Array.isArray(internalValue) && internalValue.includes(optionValue);
    }
    
    return internalValue === optionValue;
  };
  
  // Get display text for trigger
  const getDisplayText = () => {
    if (multiple) {
      const selectedCount = Array.isArray(internalValue) ? internalValue.length : 0;
      if (selectedCount === 0) return placeholder;
      if (selectedCount === 1) {
        const selectedOption = options.find(opt => getOptionValue(opt) === internalValue[0]);
        return selectedOption ? getOptionLabel(selectedOption) : placeholder;
      }
      return `${selectedCount} items selected`;
    }
    
    if (internalValue === null || internalValue === undefined) {
      return placeholder;
    }
    
    const selectedOption = options.find(opt => getOptionValue(opt) === internalValue);
    return selectedOption ? getOptionLabel(selectedOption) : placeholder;
  };
  
  // Get dropdown classes
  const getDropdownClasses = () => {
    const classes = [
      'dropdown',
      `dropdown--${variant}`,
      `dropdown--${size}`,
      `dropdown--${position}`,
      className,
      {
        'dropdown--open': internalOpen,
        'dropdown--disabled': disabled,
        'dropdown--loading': loading,
        'dropdown--multiple': multiple,
        'dropdown--searchable': searchable,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };
  
  // Render trigger
  const renderTriggerElement = () => {
    if (renderTrigger) {
      return renderTrigger({ 
        isOpen: internalOpen, 
        displayText: getDisplayText(),
        disabled,
        loading
      });
    }
    
    if (trigger) {
      return React.cloneElement(trigger, {
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        'aria-expanded': internalOpen,
        'aria-haspopup': 'listbox',
        disabled: disabled || loading,
        ref: triggerRef,
      });
    }
    
    const TriggerComponent = triggerElement;
    
    return (
      <TriggerComponent
        ref={triggerRef}
        className={`dropdown__trigger dropdown__trigger--${variant} dropdown__trigger--${size} ${triggerClassName}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-expanded={internalOpen}
        aria-haspopup="listbox"
        role="combobox"
        {...props}
      >
        <span className="dropdown__trigger-text">
          {getDisplayText()}
        </span>
        
        {clearable && internalValue && (multiple ? internalValue.length > 0 : true) && (
          <button
            type="button"
            className="dropdown__clear"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear selection"
          >
            ✕
          </button>
        )}
        
        {loading ? (
          <div className="dropdown__spinner"></div>
        ) : (
          <div className={`dropdown__arrow ${internalOpen ? 'dropdown__arrow--up' : ''}`}>
            ▼
          </div>
        )}
      </TriggerComponent>
    );
  };
  
  // Render option
  const renderOptionElement = (option, index) => {
    if (renderOption) {
      return renderOption(option, { 
        selected: isOptionSelected(option),
        focused: index === focusedIndex,
        disabled: isOptionDisabled(option),
        index
      });
    }
    
    const isSelected = isOptionSelected(option);
    const isFocused = index === focusedIndex;
    const isDisabled = isOptionDisabled(option);
    
    return (
      <div
        key={getOptionValue(option)}
        ref={el => optionsRef.current[index] = el}
        className={`dropdown__option ${optionClassName} ${
          isSelected ? 'dropdown__option--selected' : ''
        } ${
          isFocused ? 'dropdown__option--focused' : ''
        } ${
          isDisabled ? 'dropdown__option--disabled' : ''
        }`}
        onClick={() => handleOptionSelect(option, index)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isDisabled}
      >
        {showCheckboxes && multiple && (
          <div className="dropdown__checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              tabIndex={-1}
            />
          </div>
        )}
        
        {showIcons && getOptionIcon(option) && (
          <div className="dropdown__option-icon">
            {getOptionIcon(option)}
          </div>
        )}
        
        <span className="dropdown__option-label">
          {getOptionLabel(option)}
        </span>
        
        {isSelected && !multiple && !showCheckboxes && (
          <div className="dropdown__option-checkmark">
            ✓
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={getDropdownClasses()}>
      {/* Trigger */}
      {renderTriggerElement()}
      
      {/* Dropdown Menu */}
      {internalOpen && (
        <div
          ref={dropdownRef}
          className={`dropdown__menu ${dropdownClassName}`}
          style={{
            width: width === 'trigger' ? triggerRef.current?.offsetWidth : width,
            maxHeight
          }}
          role="listbox"
          aria-multiselectable={multiple}
        >
          {/* Search Input */}
          {searchable && (
            <div className="dropdown__search">
              <input
                ref={searchRef}
                type="text"
                className="dropdown__search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          
          {/* Options */}
          <div className="dropdown__options">
            {loading ? (
              <div className="dropdown__loading">
                <div className="dropdown__spinner"></div>
                <span>{loadingMessage}</span>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => renderOptionElement(option, index))
            ) : (
              <div className="dropdown__empty">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  // Core props
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  onClose: PropTypes.func,
  
  // Trigger props
  trigger: PropTypes.node,
  triggerElement: PropTypes.elementType,
  placeholder: PropTypes.string,
  triggerClassName: PropTypes.string,
  
  // Options props
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  
  // Behavior props
  closeOnSelect: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  
  // Display props
  variant: PropTypes.oneOf(['default', 'outline', 'filled']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  position: PropTypes.oneOf([
    'bottom-left', 'bottom-right', 'top-left', 'top-right',
    'left', 'right'
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.string,
  showCheckboxes: PropTypes.bool,
  showIcons: PropTypes.bool,
  
  // Event handlers
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onOptionClick: PropTypes.func,
  onClear: PropTypes.func,
  
  // Content props
  emptyMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  
  // Style props
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  optionClassName: PropTypes.string,
  
  // Advanced props
  filterFunction: PropTypes.func,
  renderOption: PropTypes.func,
  renderTrigger: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  getOptionIcon: PropTypes.func,
  isOptionDisabled: PropTypes.func,
};

export default Dropdown;
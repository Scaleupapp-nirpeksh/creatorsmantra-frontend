/**
 * DatePicker Component
 * Path: src/components/common/FormComponents/DatePicker.jsx
 * 
 * Advanced date selection component with range selection and time support.
 * Used throughout the deals module for:
 * - Deal deadlines
 * - Campaign start/end dates
 * - Payment due dates
 * - Content delivery dates
 * - Follow-up reminders
 * 
 * Features:
 * - Single date and date range selection
 * - Time selection support
 * - Quick date presets (Today, Tomorrow, Next Week, etc.)
 * - Min/max date validation
 * - Disabled dates
 * - Custom date formatting
 * - Mobile-optimized
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check,
  AlertCircle 
} from 'lucide-react';
import styles from './DatePicker.module.css';

const DatePicker = ({
  // Basic props
  name,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  
  // Date configuration
  mode = 'single', // single, range, multiple
  showTime = false,
  timeFormat = '12', // 12 or 24
  dateFormat = 'MMM DD, YYYY', // Display format
  
  // Validation
  minDate = null,
  maxDate = null,
  disabledDates = [], // Array of dates or date ranges
  
  // Styling
  size = 'medium',
  fullWidth = false,
  className = '',
  
  // Label & Help
  label,
  helperText,
  
  // Validation states
  error = false,
  errorMessage,
  
  // Quick presets
  showPresets = true,
  customPresets = null,
  
  // Icons
  clearable = true,
  
  // Position
  position = 'auto', // auto, top, bottom
  
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({ hours: 12, minutes: 0, period: 'AM' });
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Month names and day names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value || null);
  }, [value]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current && position === 'auto') {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      if (spaceBelow < 400) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen, position]);

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

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = d.getDate();
    const month = monthNamesShort[d.getMonth()];
    const year = d.getFullYear();
    
    let formatted = dateFormat
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('D', day.toString())
      .replace('MMM', month)
      .replace('MM', (d.getMonth() + 1).toString().padStart(2, '0'))
      .replace('YYYY', year.toString())
      .replace('YY', year.toString().slice(-2));
    
    if (showTime) {
      const hours = d.getHours();
      const minutes = d.getMinutes();
      
      if (timeFormat === '12') {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        formatted += ` ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      } else {
        formatted += ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    
    return formatted;
  }, [dateFormat, monthNamesShort, showTime, timeFormat]);

  // Get display value
  const getDisplayValue = () => {
    if (mode === 'range' && internalValue) {
      const { start, end } = internalValue;
      if (start && end) {
        return `${formatDate(start)} - ${formatDate(end)}`;
      } else if (start) {
        return `${formatDate(start)} - Select end date`;
      }
    }
    
    return internalValue ? formatDate(internalValue) : '';
  };

  // Check if date is disabled
  const isDateDisabled = useCallback((date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    
    return disabledDates.some(disabled => {
      if (disabled instanceof Date) {
        return date.toDateString() === disabled.toDateString();
      }
      if (disabled.start && disabled.end) {
        return date >= new Date(disabled.start) && date <= new Date(disabled.end);
      }
      return false;
    });
  }, [minDate, maxDate, disabledDates]);

  // Check if date is selected
  const isDateSelected = (date) => {
    if (!internalValue) return false;
    
    if (mode === 'range') {
      const { start, end } = internalValue;
      if (start && end) {
        return date >= new Date(start) && date <= new Date(end);
      }
      if (start) {
        return date.toDateString() === new Date(start).toDateString();
      }
    } else {
      return date.toDateString() === new Date(internalValue).toDateString();
    }
    
    return false;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    let newValue;
    
    if (mode === 'range') {
      if (!internalValue || (internalValue.start && internalValue.end)) {
        newValue = { start: date, end: null };
      } else if (internalValue.start && !internalValue.end) {
        if (date < internalValue.start) {
          newValue = { start: date, end: internalValue.start };
        } else {
          newValue = { start: internalValue.start, end: date };
        }
      }
    } else {
      newValue = date;
      if (!showTime) {
        setIsOpen(false);
      }
    }
    
    if (showTime) {
      const hours = timeFormat === '12' 
        ? (selectedTime.period === 'PM' ? selectedTime.hours % 12 + 12 : selectedTime.hours % 12)
        : selectedTime.hours;
      newValue.setHours(hours, selectedTime.minutes);
    }
    
    setInternalValue(newValue);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  // Handle time change
  const handleTimeChange = (type, value) => {
    const newTime = { ...selectedTime };
    
    if (type === 'hours') {
      newTime.hours = parseInt(value);
    } else if (type === 'minutes') {
      newTime.minutes = parseInt(value);
    } else if (type === 'period') {
      newTime.period = value;
    }
    
    setSelectedTime(newTime);
    
    if (internalValue) {
      const newDate = new Date(internalValue);
      const hours = timeFormat === '12' 
        ? (newTime.period === 'PM' ? newTime.hours % 12 + 12 : newTime.hours % 12)
        : newTime.hours;
      newDate.setHours(hours, newTime.minutes);
      
      setInternalValue(newDate);
      if (onChange) {
        onChange({ target: { name, value: newDate } });
      }
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    const today = new Date();
    let newValue;
    
    switch (preset) {
      case 'today':
        newValue = new Date();
        break;
      case 'tomorrow':
        newValue = new Date(today.setDate(today.getDate() + 1));
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        newValue = { start: startOfWeek, end: endOfWeek };
        break;
      case 'nextWeek':
        const nextWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 7));
        const nextWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 13));
        newValue = { start: nextWeekStart, end: nextWeekEnd };
        break;
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        newValue = { start: startOfMonth, end: endOfMonth };
        break;
      case 'nextMonth':
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        newValue = { start: nextMonthStart, end: nextMonthEnd };
        break;
      default:
        if (customPresets && customPresets[preset]) {
          newValue = customPresets[preset]();
        }
    }
    
    setInternalValue(newValue);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
    setIsOpen(false);
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    setInternalValue(null);
    if (onChange) {
      onChange({ target: { name, value: null } });
    }
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  // Default presets
  const defaultPresets = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    ...(mode === 'range' ? [
      { key: 'thisWeek', label: 'This Week' },
      { key: 'nextWeek', label: 'Next Week' },
      { key: 'thisMonth', label: 'This Month' },
      { key: 'nextMonth', label: 'Next Month' }
    ] : [])
  ];

  // Build class names
  const containerClasses = [
    styles.datePickerContainer,
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    isOpen && styles.open,
    error && styles.error,
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  const dropdownClasses = [
    styles.dropdown,
    styles[`dropdown-${dropdownPosition}`],
    isOpen && styles.dropdownOpen
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={containerRef}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        <button
          ref={inputRef}
          id={name}
          type="button"
          className={inputClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-invalid={error}
        >
          <Calendar className={styles.icon} />
          
          <span className={[
            styles.value,
            !internalValue && styles.placeholder
          ].filter(Boolean).join(' ')}>
            {getDisplayValue() || placeholder}
          </span>
          
          {clearable && internalValue && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear date"
            >
              <X />
            </button>
          )}
        </button>
        
        {isOpen && (
          <div className={dropdownClasses}>
            {showPresets && (
              <div className={styles.presets}>
                {defaultPresets.map(preset => (
                  <button
                    key={preset.key}
                    type="button"
                    className={styles.preset}
                    onClick={() => handlePresetSelect(preset.key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => navigateMonth(-1)}
                  aria-label="Previous month"
                >
                  <ChevronLeft />
                </button>
                
                <div className={styles.monthYear}>
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </div>
                
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => navigateMonth(1)}
                  aria-label="Next month"
                >
                  <ChevronRight />
                </button>
              </div>
              
              <div className={styles.weekDays}>
                {dayNames.map(day => (
                  <div key={day} className={styles.weekDay}>
                    {day}
                  </div>
                ))}
              </div>
              
              <div className={styles.days}>
                {getCalendarDays().map(({ date, isCurrentMonth }, index) => {
                  const disabled = isDateDisabled(date);
                  const selected = isDateSelected(date);
                  const today = isToday(date);
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      className={[
                        styles.day,
                        !isCurrentMonth && styles.otherMonth,
                        disabled && styles.disabled,
                        selected && styles.selected,
                        today && styles.today
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleDateSelect(date)}
                      disabled={disabled}
                      aria-label={formatDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {showTime && (
              <div className={styles.timeSelector}>
                <Clock className={styles.timeIcon} />
                <select
                  className={styles.timeInput}
                  value={selectedTime.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                >
                  {Array.from({ length: timeFormat === '12' ? 12 : 24 }, (_, i) => (
                    <option key={i} value={i + (timeFormat === '12' ? 1 : 0)}>
                      {(i + (timeFormat === '12' ? 1 : 0)).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span className={styles.timeSeparator}>:</span>
                <select
                  className={styles.timeInput}
                  value={selectedTime.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {timeFormat === '12' && (
                  <select
                    className={styles.timeInput}
                    value={selectedTime.period}
                    onChange={(e) => handleTimeChange('period', e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                )}
              </div>
            )}
            
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.todayButton}
                onClick={() => handlePresetSelect('today')}
              >
                Today
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => setIsOpen(false)}
              >
                <Check /> Done
              </button>
            </div>
          </div>
        )}
      </div>
      
      {(helperText || errorMessage) && (
        <div className={styles.helperSection}>
          {error && errorMessage && (
            <span className={styles.errorMessage}>
              <AlertCircle className={styles.errorIcon} />
              {errorMessage}
            </span>
          )}
          {!error && helperText && (
            <span className={styles.helperText}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
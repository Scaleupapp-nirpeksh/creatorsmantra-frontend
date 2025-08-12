/**
 * CreatorsMantra Design System - Button Component
 * Reusable button component with multiple variants and states
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description Production-ready button component with loading states, icons, and accessibility
 * @path src/components/common/Button/index.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button Component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, outline, ghost, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.leftIcon - Left icon component
 * @param {React.ReactNode} props.rightIcon - Right icon component
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.style - Inline styles
 * @param {string} props.id - Button ID
 * @param {string} props.ariaLabel - Accessibility label
 * @param {object} props.rest - Additional props
 * @returns {React.Component} Button component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  className = '',
  style = {},
  id,
  ariaLabel,
  ...rest
}) => {
  // Generate CSS classes
  const buttonClasses = [
    'btn', // Base button class
    `btn-${variant}`, // Variant class
    `btn-${size}`, // Size class
    loading && 'btn-loading', // Loading state
    fullWidth && 'btn-full-width', // Full width
    className // Additional classes
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (event) => {
    // Prevent click if disabled or loading
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    // Call onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  return (
    <button
      id={id}
      type={type}
      className={buttonClasses}
      style={style}
      disabled={isDisabled}
      onClick={handleClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...rest}
    >
      {/* Loading spinner - shown when loading */}
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg 
            className="btn-spinner-icon" 
            viewBox="0 0 24 24" 
            fill="none"
            width="16"
            height="16"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate 
                attributeName="stroke-dashoffset" 
                values="32;0;32" 
                dur="1.5s" 
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}

      {/* Left icon */}
      {leftIcon && !loading && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Button content */}
      <span className={`btn-content ${loading ? 'btn-content-loading' : ''}`}>
        {children}
      </span>

      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// PropTypes for development type checking
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;

// Named exports for specific button variants
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;

// Icon button wrapper
export const IconButton = ({ children, ...props }) => (
  <Button className="btn-icon" {...props}>
    {children}
  </Button>
);

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
};
/**
 * CreatorsMantra Design System - Card Component
 * Versatile card system for deals, dashboards, profiles, and content display
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @path src/components/common/Card/index.js
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = forwardRef(({
  children = null,
  variant = 'default',
  size = 'md',
  padding = 'default',
  shadow = 'default',
  border = true,
  borderColor = 'default',
  radius = 'default',
  background = 'default',
  hover = false,
  clickable = false,
  selected = false,
  disabled = false,
  loading = false,
  header = null,
  title = '',
  subtitle = '',
  footer = null,
  actions = null,
  icon = null,
  image = null,
  imagePosition = 'top',
  imageHeight = 'auto',
  badge = null,
  badgePosition = 'top-right',
  divider = false,
  onClick = null,
  onDoubleClick = null,
  onMouseEnter = null,
  onMouseLeave = null,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  as = 'div',
  href = null,
  target = null,
  role = null,
  tabIndex = null,
  ariaLabel = null,
  ariaDescribedBy = null,
  ...props
}, ref) => {
  // Determine the component element type
  const Component = href ? 'a' : as;
  
  // Get card classes
  const getCardClasses = () => {
    const classes = [
      'card',
      `card--${variant}`,
      `card--${size}`,
      `card--padding-${padding}`,
      `card--shadow-${shadow}`,
      `card--radius-${radius}`,
      `card--bg-${background}`,
      className,
      {
        'card--bordered': border,
        'card--hoverable': hover || clickable,
        'card--clickable': clickable,
        'card--selected': selected,
        'card--disabled': disabled,
        'card--loading': loading,
        'card--with-image': image,
        'card--image-top': image && imagePosition === 'top',
        'card--image-left': image && imagePosition === 'left',
        'card--image-right': image && imagePosition === 'right',
        'card--with-header': header || title || subtitle || icon,
        'card--with-footer': footer || actions,
        [`card--border-${borderColor}`]: border && borderColor !== 'default',
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  // Handle click events
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  // Handle double click events
  const handleDoubleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && clickable) {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Render badge
  const renderBadge = () => {
    if (!badge) return null;

    return (
      <div className={`card__badge card__badge--${badgePosition}`}>
        {badge}
      </div>
    );
  };

  // Render image
  const renderImage = () => {
    if (!image) return null;

    const imageElement = (
      <div 
        className="card__image"
        style={{ 
          height: imageHeight !== 'auto' ? imageHeight : undefined 
        }}
      >
        {typeof image === 'string' ? (
          <img 
            src={image} 
            alt="" 
            className="card__image-element"
            loading="lazy"
          />
        ) : (
          image
        )}
      </div>
    );

    return imageElement;
  };

  // Render header
  const renderHeader = () => {
    const hasHeaderContent = header || title || subtitle || icon;
    if (!hasHeaderContent) return null;

    if (header) {
      return (
        <div className={`card__header ${headerClassName}`}>
          {header}
        </div>
      );
    }

    return (
      <div className={`card__header ${headerClassName}`}>
        <div className="card__header-content">
          {icon && (
            <div className="card__icon">
              {typeof icon === 'string' ? <span>{icon}</span> : icon}
            </div>
          )}
          <div className="card__title-section">
            {title && (
              <h3 className="card__title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="card__subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render body
  const renderBody = () => {
    if (!children) return null;

    return (
      <div className={`card__body ${bodyClassName}`}>
        {children}
      </div>
    );
  };

  // Render footer
  const renderFooter = () => {
    const hasFooterContent = footer || actions;
    if (!hasFooterContent) return null;

    if (footer) {
      return (
        <div className={`card__footer ${footerClassName}`}>
          {footer}
        </div>
      );
    }

    if (actions) {
      return (
        <div className={`card__footer ${footerClassName}`}>
          <div className="card__actions">
            {actions}
          </div>
        </div>
      );
    }

    return null;
  };

  // Render divider
  const renderDivider = () => {
    if (!divider) return null;
    return <div className="card__divider" />;
  };

  // Render loading overlay
  const renderLoadingOverlay = () => {
    if (!loading) return null;

    return (
      <div className="card__loading-overlay">
        <div className="card__spinner"></div>
      </div>
    );
  };

  // Component props
  const componentProps = {
    ref,
    className: getCardClasses(),
    onClick: clickable || onClick ? handleClick : undefined,
    onDoubleClick: clickable || onDoubleClick ? handleDoubleClick : undefined,
    onMouseEnter,
    onMouseLeave,
    onKeyDown: clickable ? handleKeyDown : undefined,
    tabIndex: clickable ? (tabIndex !== null ? tabIndex : 0) : tabIndex,
    role: role || (clickable ? 'button' : undefined),
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': disabled,
    'aria-selected': selected,
    href: Component === 'a' ? href : undefined,
    target: Component === 'a' ? target : undefined,
    ...props
  };

  return (
    <Component {...componentProps}>
      {/* Badge */}
      {renderBadge()}

      {/* Loading Overlay */}
      {renderLoadingOverlay()}

      {/* Image - Top Position */}
      {image && imagePosition === 'top' && renderImage()}

      {/* Main Content Container */}
      <div className="card__content">
        {/* Image - Left Position */}
        {image && imagePosition === 'left' && renderImage()}

        {/* Content Area */}
        <div className="card__main">
          {/* Header */}
          {renderHeader()}

          {/* Divider after header */}
          {(header || title || subtitle || icon) && divider && renderDivider()}

          {/* Body */}
          {renderBody()}

          {/* Divider before footer */}
          {(footer || actions) && divider && renderDivider()}

          {/* Footer */}
          {renderFooter()}
        </div>

        {/* Image - Right Position */}
        {image && imagePosition === 'right' && renderImage()}
      </div>

      {/* Image - Bottom Position */}
      {image && imagePosition === 'bottom' && renderImage()}
    </Component>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  // Content
  children: PropTypes.node,
  header: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node,
  actions: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  // Image
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  imagePosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  imageHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Badge
  badge: PropTypes.node,
  badgePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  
  // Appearance
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'filled', 'minimal']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'default', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'default', 'md', 'lg', 'xl']),
  border: PropTypes.bool,
  borderColor: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  radius: PropTypes.oneOf(['none', 'sm', 'default', 'md', 'lg', 'xl', 'full']),
  background: PropTypes.oneOf(['default', 'primary', 'secondary', 'tertiary', 'gradient']),
  
  // Behavior
  hover: PropTypes.bool,
  clickable: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  divider: PropTypes.bool,
  
  // Events
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  
  // Element props
  as: PropTypes.elementType,
  href: PropTypes.string,
  target: PropTypes.string,
  
  // Accessibility
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  
  // Style classes
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};

// Convenience components for specific card types
export const DealCard = (props) => (
  <Card
    {...props}
    variant="elevated"
    hover={true}
    clickable={true}
    divider={true}
  />
);

export const MetricCard = (props) => (
  <Card
    {...props}
    variant="outlined"
    padding="lg"
    shadow="sm"
  />
);

export const ProfileCard = (props) => (
  <Card
    {...props}
    variant="default"
    imagePosition="top"
    padding="lg"
    hover={true}
  />
);

export const ActionCard = (props) => (
  <Card
    {...props}
    variant="minimal"
    hover={true}
    clickable={true}
    border={false}
  />
);

export default Card;
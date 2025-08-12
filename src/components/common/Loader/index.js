/**
 * CreatorsMantra Design System - Loader Component
 * Comprehensive loading system with spinners, skeletons, and overlay states
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @path src/components/common/Loader/index.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({
  // Core props
  type = 'spinner',
  variant = 'default',
  size = 'md',
  color = 'primary',
  
  // Behavior props
  loading = true,
  overlay = false,
  fullscreen = false,
  backdrop = true,
  
  // Content props
  text = '',
  description = '',
  children = null,
  
  // Style props
  className = '',
  style = {},
  
  // Skeleton specific props
  rows = 3,
  height = '20px',
  width = '100%',
  animated = true,
  rounded = false,
  
  // Progress specific props
  progress = 0,
  showProgress = false,
  
  // Timing props
  delay = 0,
  timeout = null,
  
  // Event props
  onTimeout = null,
  
  ...props
}) => {
  const [visible, setVisible] = React.useState(delay === 0);
  const [timedOut, setTimedOut] = React.useState(false);
  
  // Handle delay
  React.useEffect(() => {
    if (delay > 0 && loading) {
      const delayTimer = setTimeout(() => {
        setVisible(true);
      }, delay);
      
      return () => clearTimeout(delayTimer);
    } else {
      setVisible(loading);
    }
  }, [delay, loading]);
  
  // Handle timeout
  React.useEffect(() => {
    if (timeout && loading && visible) {
      const timeoutTimer = setTimeout(() => {
        setTimedOut(true);
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);
      
      return () => clearTimeout(timeoutTimer);
    }
  }, [timeout, loading, visible, onTimeout]);
  
  // Reset timeout when loading changes
  React.useEffect(() => {
    if (!loading) {
      setTimedOut(false);
    }
  }, [loading]);
  
  // Don't render if not loading or not visible
  if (!loading || !visible) {
    return children || null;
  }
  
  // Get loader classes
  const getLoaderClasses = () => {
    const classes = [
      'loader',
      `loader--${type}`,
      `loader--${variant}`,
      `loader--${size}`,
      `loader--${color}`,
      className,
      {
        'loader--overlay': overlay,
        'loader--fullscreen': fullscreen,
        'loader--with-backdrop': backdrop,
        'loader--animated': animated,
        'loader--rounded': rounded,
        'loader--timed-out': timedOut,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };
  
  // Render spinner
  const renderSpinner = () => {
    return (
      <div className="loader__spinner">
        <div className="loader__spinner-circle"></div>
      </div>
    );
  };
  
  // Render dots
  const renderDots = () => {
    return (
      <div className="loader__dots">
        <div className="loader__dot"></div>
        <div className="loader__dot"></div>
        <div className="loader__dot"></div>
      </div>
    );
  };
  
  // Render pulse
  const renderPulse = () => {
    return (
      <div className="loader__pulse">
        <div className="loader__pulse-circle"></div>
      </div>
    );
  };
  
  // Render skeleton
  const renderSkeleton = () => {
    if (typeof rows === 'number' && rows > 1) {
      return (
        <div className="loader__skeleton-container">
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className="loader__skeleton-line"
              style={{
                height,
                width: index === rows - 1 ? '60%' : width,
              }}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div
        className="loader__skeleton-line"
        style={{ height, width }}
      />
    );
  };
  
  // Render progress bar
  const renderProgress = () => {
    return (
      <div className="loader__progress-container">
        <div className="loader__progress-bar">
          <div
            className="loader__progress-fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        {showProgress && (
          <div className="loader__progress-text">
            {Math.round(progress)}%
          </div>
        )}
      </div>
    );
  };
  
  // Render content based on type
  const renderLoaderContent = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'progress':
        return renderProgress();
      default:
        return renderSpinner();
    }
  };
  
  // Render text content
  const renderTextContent = () => {
    if (!text && !description && !timedOut) return null;
    
    return (
      <div className="loader__content">
        {timedOut ? (
          <div className="loader__timeout">
            <div className="loader__timeout-title">Taking longer than expected</div>
            <div className="loader__timeout-description">
              Please check your connection and try again
            </div>
          </div>
        ) : (
          <>
            {text && (
              <div className="loader__text">
                {text}
              </div>
            )}
            {description && (
              <div className="loader__description">
                {description}
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  // Render loader
  const loaderElement = (
    <div className={getLoaderClasses()} style={style} {...props}>
      {type !== 'skeleton' && (
        <div className="loader__inner">
          {renderLoaderContent()}
          {renderTextContent()}
        </div>
      )}
      {type === 'skeleton' && renderLoaderContent()}
    </div>
  );
  
  // Render with overlay if needed
  if (overlay || fullscreen) {
    return (
      <div 
        className={`loader__overlay ${fullscreen ? 'loader__overlay--fullscreen' : ''} ${
          backdrop ? 'loader__overlay--backdrop' : ''
        }`}
      >
        {loaderElement}
        {children && (
          <div className="loader__overlay-content">
            {children}
          </div>
        )}
      </div>
    );
  }
  
  return loaderElement;
};

Loader.propTypes = {
  // Core props
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'skeleton', 'progress']),
  variant: PropTypes.oneOf(['default', 'minimal', 'branded']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral', 'white']),
  
  // Behavior props
  loading: PropTypes.bool,
  overlay: PropTypes.bool,
  fullscreen: PropTypes.bool,
  backdrop: PropTypes.bool,
  
  // Content props
  text: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  
  // Style props
  className: PropTypes.string,
  style: PropTypes.object,
  
  // Skeleton specific props
  rows: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  animated: PropTypes.bool,
  rounded: PropTypes.bool,
  
  // Progress specific props
  progress: PropTypes.number,
  showProgress: PropTypes.bool,
  
  // Timing props
  delay: PropTypes.number,
  timeout: PropTypes.number,
  
  // Event props
  onTimeout: PropTypes.func,
};

// Convenience components for specific loader types
export const SpinnerLoader = (props) => (
  <Loader {...props} type="spinner" />
);

export const DotsLoader = (props) => (
  <Loader {...props} type="dots" />
);

export const PulseLoader = (props) => (
  <Loader {...props} type="pulse" />
);

export const SkeletonLoader = (props) => (
  <Loader {...props} type="skeleton" />
);

export const ProgressLoader = (props) => (
  <Loader {...props} type="progress" />
);

export const OverlayLoader = (props) => (
  <Loader {...props} overlay={true} />
);

export const FullscreenLoader = (props) => (
  <Loader {...props} fullscreen={true} />
);

// Specific skeleton components for common UI patterns
export const CardSkeleton = (props) => (
  <div className="skeleton-card">
    <SkeletonLoader height="200px" width="100%" rounded {...props} />
    <div className="skeleton-card__content">
      <SkeletonLoader height="20px" width="80%" />
      <SkeletonLoader height="16px" width="60%" />
      <SkeletonLoader height="16px" width="90%" />
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5, ...props }) => (
  <div className="skeleton-list">
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="skeleton-list__item">
        <SkeletonLoader height="50px" width="50px" rounded />
        <div className="skeleton-list__content">
          <SkeletonLoader height="18px" width="70%" />
          <SkeletonLoader height="14px" width="50%" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4, ...props }) => (
  <div className="skeleton-table">
    {/* Header */}
    <div className="skeleton-table__header">
      {Array.from({ length: columns }, (_, index) => (
        <SkeletonLoader key={index} height="16px" width="80%" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table__row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <SkeletonLoader key={colIndex} height="14px" width="90%" />
        ))}
      </div>
    ))}
  </div>
);

export default Loader;
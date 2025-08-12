/**
 * CreatorsMantra Design System - Modal Component
 * Accessible modal system with multiple variants and focus management
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @path src/components/common/Modal/index.js
 */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = null,
  onCancel = null,
  title = '',
  children = null,
  size = 'md',
  variant = 'default',
  closable = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  showHeader = true,
  showFooter = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'secondary',
  loading = false,
  disabled = false,
  destroyOnClose = false,
  zIndex = 1000,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  overlayClassName = '',
  customFooter = null,
  icon = null,
  ...props
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape && isOpen) {
      onClose();
    }
  }, [closeOnEscape, isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current && closeOnOverlay) {
      onClose();
    }
  }, [closeOnOverlay, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add escape listener
      document.addEventListener('keydown', handleEscape);
    } else {
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Remove escape listener
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  // Handle confirm action
  const handleConfirm = () => {
    if (onConfirm && !loading && !disabled) {
      onConfirm();
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    if (onCancel && !loading && !disabled) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Focus trap
  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  // Get modal classes
  const getModalClasses = () => {
    const classes = [
      'modal',
      `modal--${size}`,
      `modal--${variant}`,
      className,
      {
        'modal--loading': loading,
        'modal--disabled': disabled,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  // Get overlay classes
  const getOverlayClasses = () => {
    const classes = [
      'modal__overlay',
      overlayClassName,
      {
        'modal__overlay--active': isOpen,
      }
    ];
    
    return classes.filter(Boolean).join(' ');
  };

  // Render close button
  const renderCloseButton = () => {
    if (!closable) return null;

    return (
      <button
        type="button"
        className="modal__close"
        onClick={onClose}
        disabled={loading || disabled}
        aria-label="Close modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    );
  };

  // Render header
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <div className={`modal__header ${headerClassName}`}>
        <div className="modal__title-container">
          {icon && (
            <div className="modal__icon">
              {typeof icon === 'string' ? <span>{icon}</span> : icon}
            </div>
          )}
          {title && (
            <h2 className="modal__title" id="modal-title">
              {title}
            </h2>
          )}
        </div>
        {renderCloseButton()}
      </div>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!showFooter && !customFooter) return null;

    if (customFooter) {
      return (
        <div className={`modal__footer ${footerClassName}`}>
          {customFooter}
        </div>
      );
    }

    return (
      <div className={`modal__footer ${footerClassName}`}>
        <div className="modal__actions">
          {onCancel && (
            <button
              type="button"
              className={`btn btn--${cancelVariant}`}
              onClick={handleCancel}
              disabled={loading || disabled}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              type="button"
              className={`btn btn--${confirmVariant}`}
              onClick={handleConfirm}
              disabled={loading || disabled}
            >
              {loading && <div className="btn__spinner"></div>}
              {confirmText}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Don't render if not open and destroyOnClose is true
  if (!isOpen && destroyOnClose) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={getOverlayClasses()}
        onClick={handleOverlayClick}
        style={{ zIndex }}
        aria-hidden={!isOpen}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className={getModalClasses()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleTabKey}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby="modal-body"
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {renderHeader()}

          {/* Body */}
          <div className={`modal__body ${bodyClassName}`} id="modal-body">
            {children}
          </div>

          {/* Footer */}
          {renderFooter()}

          {/* Loading Overlay */}
          {loading && (
            <div className="modal__loading-overlay">
              <div className="modal__spinner"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  // Core props
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  
  // Content props
  title: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  // Layout props
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  variant: PropTypes.oneOf(['default', 'danger', 'warning', 'success', 'info']),
  
  // Behavior props
  closable: PropTypes.bool,
  closeOnOverlay: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  
  // Display props
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  
  // Button props
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning']),
  cancelVariant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  
  // State props
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  
  // Style props
  zIndex: PropTypes.number,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  
  // Custom content
  customFooter: PropTypes.node,
};

// Convenience components for specific modal types
export const ConfirmModal = (props) => (
  <Modal
    {...props}
    variant="danger"
    showFooter={true}
    icon="⚠️"
    confirmText={props.confirmText || "Delete"}
    confirmVariant="danger"
  />
);

export const InfoModal = (props) => (
  <Modal
    {...props}
    variant="info"
    showFooter={true}
    icon="ℹ️"
    confirmText={props.confirmText || "Got it"}
    confirmVariant="primary"
    onCancel={null}
  />
);

export const SuccessModal = (props) => (
  <Modal
    {...props}
    variant="success"
    showFooter={true}
    icon="✅"
    confirmText={props.confirmText || "Continue"}
    confirmVariant="success"
    onCancel={null}
  />
);

export const FormModal = (props) => (
  <Modal
    {...props}
    variant="default"
    showFooter={true}
    confirmText={props.confirmText || "Save"}
    cancelText={props.cancelText || "Cancel"}
    confirmVariant="primary"
    cancelVariant="outline"
  />
);

export default Modal;
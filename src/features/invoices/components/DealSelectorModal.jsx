/**
 * Deal Selector Modal
 * Modal for selecting deals when creating invoices
 * 
 * Features:
 * - Search and filter deals
 * - Single/multiple selection based on invoice type
 * - Deal details preview
 * - Responsive design
 * 
 * Path: src/features/invoices/components/DealSelectorModal.jsx
 */

import React, { useState, useEffect } from 'react';
import { X, Search, Check, Package, Calendar, IndianRupee, Building, Tag } from 'lucide-react';

const DealSelectorModal = ({ 
  isOpen, 
  onClose, 
  deals, 
  selectedDeals, 
  onSelectDeals, 
  invoiceType,
  searchTerm,
  onSearchChange
}) => {
  const [localSelectedDeals, setLocalSelectedDeals] = useState([...selectedDeals]);

  useEffect(() => {
    setLocalSelectedDeals([...selectedDeals]);
  }, [selectedDeals, isOpen]);

  const handleDealToggle = (dealId) => {
    if (invoiceType === 'individual') {
      // For individual invoices, only allow one deal
      setLocalSelectedDeals([dealId]);
    } else {
      // For consolidated invoices, allow multiple
      setLocalSelectedDeals(prev => 
        prev.includes(dealId) 
          ? prev.filter(id => id !== dealId)
          : [...prev, dealId]
      );
    }
  };

  const handleConfirm = () => {
    onSelectDeals(localSelectedDeals);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedDeals([...selectedDeals]);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (!isOpen) return null;

  // Filter deals based on search term
  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      deal.title?.toLowerCase().includes(searchLower) ||
      deal.brand?.name?.toLowerCase().includes(searchLower) ||
      deal.platform?.toLowerCase().includes(searchLower) ||
      deal.dealId?.toLowerCase().includes(searchLower)
    );
  });

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      width: '90%',
      maxWidth: '900px',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    closeButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      color: '#64748b',
      transition: 'all 0.2s'
    },
    searchContainer: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #f1f5f9'
    },
    searchWrapper: {
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8'
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto'
    },
    dealGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem'
    },
    dealCard: {
      padding: '1.25rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dealCardSelected: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff'
    },
    dealHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    dealInfo: {
      flex: 1
    },
    dealTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.375rem'
    },
    dealId: {
      fontSize: '0.75rem',
      color: '#6366f1',
      fontWeight: '600',
      marginBottom: '0.25rem'
    },
    dealBrand: {
      fontSize: '0.875rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem'
    },
    dealAmount: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#059669',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    dealDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      fontSize: '0.8125rem'
    },
    dealField: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      color: '#64748b'
    },
    dealFieldLabel: {
      fontWeight: '600',
      color: '#475569'
    },
    checkbox: {
      width: '24px',
      height: '24px',
      border: '2px solid #e2e8f0',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      flexShrink: 0
    },
    checkboxSelected: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      color: '#ffffff'
    },
    statusBadge: {
      padding: '0.25rem 0.625rem',
      borderRadius: '0.375rem',
      fontSize: '0.6875rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    statusActive: {
      backgroundColor: '#bbf7d0',
      color: '#16a34a'
    },
    statusInactive: {
      backgroundColor: '#fecaca',
      color: '#dc2626'
    },
    footer: {
      padding: '1.5rem',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc'
    },
    selectedCount: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    buttons: {
      display: 'flex',
      gap: '0.75rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)'
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      color: '#475569',
      border: '2px solid #e2e8f0'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      color: '#94a3b8'
    },
    emptyText: {
      fontSize: '0.875rem',
      textAlign: 'center',
      marginTop: '0.75rem',
      color: '#64748b'
    },
    emptyTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#475569',
      marginTop: '0.75rem'
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>
              Select Deals for {invoiceType === 'individual' ? 'Individual' : 'Consolidated'} Invoice
            </h3>
            <p style={styles.subtitle}>
              {invoiceType === 'individual' 
                ? 'Choose one deal for this invoice'
                : 'Select multiple deals to consolidate'
              }
            </p>
          </div>
          <button style={styles.closeButton} onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Search style={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Search by deal title, brand name, platform, or deal ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {filteredDeals.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={64} />
              <div style={styles.emptyTitle}>
                {searchTerm ? 'No deals match your search' : 'No deals available'}
              </div>
              <div style={styles.emptyText}>
                {searchTerm 
                  ? 'Try adjusting your search terms or clear the search to see all deals'
                  : 'Create some deals first to generate invoices'
                }
              </div>
            </div>
          ) : (
            <div style={styles.dealGrid}>
              {filteredDeals.map(deal => {
                const isSelected = localSelectedDeals.includes(deal._id);
                const dealValue = deal.dealValue?.amount || 0;
                
                return (
                  <div
                    key={deal._id}
                    style={{
                      ...styles.dealCard,
                      ...(isSelected ? styles.dealCardSelected : {})
                    }}
                    onClick={() => handleDealToggle(deal._id)}
                  >
                    <div style={styles.dealHeader}>
                      <div style={styles.dealInfo}>
                        <div style={styles.dealId}>#{deal.dealId}</div>
                        <div style={styles.dealTitle}>{deal.title}</div>
                        <div style={styles.dealBrand}>
                          <Building size={14} />
                          {deal.brand?.name || 'Unknown Brand'}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={styles.dealAmount}>
                          <IndianRupee size={16} />
                          {formatCurrency(dealValue)}
                        </div>
                        <div style={{
                          ...styles.checkbox,
                          ...(isSelected ? styles.checkboxSelected : {})
                        }}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.dealDetails}>
                      <div style={styles.dealField}>
                        <Tag size={14} />
                        <span style={styles.dealFieldLabel}>Platform:</span>
                        <span style={{ textTransform: 'capitalize' }}>
                          {deal.platform || 'N/A'}
                        </span>
                      </div>
                      
                      <div style={styles.dealField}>
                        <Calendar size={14} />
                        <span style={styles.dealFieldLabel}>Content Due:</span>
                        <span>{formatDate(deal.timeline?.contentDeadline)}</span>
                      </div>
                      
                      <div style={styles.dealField}>
                        <span style={styles.dealFieldLabel}>Status:</span>
                        <span style={{
                          ...styles.statusBadge,
                          ...(deal.status === 'active' ? styles.statusActive : styles.statusInactive)
                        }}>
                          {deal.status || 'Unknown'}
                        </span>
                      </div>
                      
                      <div style={styles.dealField}>
                        <span style={styles.dealFieldLabel}>Stage:</span>
                        <span style={{ textTransform: 'capitalize' }}>
                          {deal.stage || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.selectedCount}>
            <strong>{localSelectedDeals.length}</strong> deal{localSelectedDeals.length !== 1 ? 's' : ''} selected
            {invoiceType === 'individual' && localSelectedDeals.length > 1 && 
              <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Individual invoices can only have 1 deal. Only the last selected deal will be used.
              </div>
            }
          </div>
          <div style={styles.buttons}>
            <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={handleCancel}>
              Cancel
            </button>
            <button 
              style={{ 
                ...styles.button, 
                ...styles.primaryButton,
                opacity: localSelectedDeals.length === 0 ? 0.5 : 1
              }} 
              onClick={handleConfirm}
              disabled={localSelectedDeals.length === 0}
            >
              Select {localSelectedDeals.length} Deal{localSelectedDeals.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input:focus {
          border-color: #6366f1;
          outline: none;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default DealSelectorModal;
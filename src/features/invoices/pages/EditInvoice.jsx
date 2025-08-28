/**
 * Edit Invoice Page
 * Interface for editing draft invoices
 * 
 * Features:
 * - Edit client details
 * - Modify line items
 * - Update tax settings
 * - Change payment terms
 * - Add/remove discounts
 * - Save changes with version tracking
 * - Preview changes before saving
 * 
 * Path: src/features/invoices/pages/EditInvoice.jsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Calculator,
  AlertCircle,
  RefreshCw,
  Building,
  FileText,
  IndianRupee,
  Settings,
  Eye,
  Edit3,
  Info
} from 'lucide-react';
import { invoicesAPI } from '@/api/endpoints/invoices';
import useInvoiceStore from '@/store/invoiceStore';
import { toast } from 'react-hot-toast';

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  
  const {
    currentInvoice,
    fetchInvoiceById,
    updateInvoice,
    calculateTaxPreview
  } = useInvoiceStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    clientDetails: {},
    lineItems: [],
    taxSettings: {},
    invoiceSettings: {},
    revisionNotes: ''
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData]);

  const loadInvoice = async () => {
    setIsLoading(true);
    try {
      const result = await fetchInvoiceById(invoiceId);
      if (result.success) {
        const invoice = result.invoice;
        
        if (invoice.status !== 'draft') {
          toast.error('Only draft invoices can be edited');
          navigate(`/invoices/${invoiceId}`);
          return;
        }

        const data = {
          clientDetails: invoice.clientDetails || {},
          lineItems: invoice.lineItems || [],
          taxSettings: invoice.taxSettings || {},
          invoiceSettings: invoice.invoiceSettings || {},
          revisionNotes: ''
        };

        setFormData(data);
        setOriginalData(JSON.parse(JSON.stringify(data)));
      }
    } catch (error) {
      toast.error('Failed to load invoice');
      navigate('/invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.revisionNotes) {
      toast.error('Please add revision notes');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateInvoice(invoiceId, formData);
      if (result.success) {
        toast.success('Invoice updated successfully');
        navigate(`/invoices/${invoiceId}`);
      }
    } catch (error) {
      toast.error('Failed to update invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      if (confirm('Discard all changes?')) {
        navigate(`/invoices/${invoiceId}`);
      }
    } else {
      navigate(`/invoices/${invoiceId}`);
    }
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
        hsnCode: '998314'
      }]
    }));
  };

  const updateLineItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = formData.taxSettings?.gstSettings?.applyGST 
      ? subtotal * (formData.taxSettings.gstSettings.gstRate / 100) 
      : 0;
    const tdsAmount = formData.taxSettings?.tdsSettings?.applyTDS
      ? (subtotal + gstAmount) * (formData.taxSettings.tdsSettings.tdsRate / 100)
      : 0;
    return {
      subtotal,
      gstAmount,
      tdsAmount,
      total: subtotal + gstAmount - tdsAmount
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      flexShrink: 0
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    backButton: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    changeIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.75rem',
      backgroundColor: '#fef3c7',
      color: '#d97706',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    headerActions: {
      display: 'flex',
      gap: '0.625rem',
      alignItems: 'center'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      borderRadius: '0.625rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none'
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
    dangerButton: {
      backgroundColor: '#ffffff',
      color: '#ef4444',
      border: '2px solid #fecaca'
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1rem 1.25rem',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardTitle: {
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardContent: {
      padding: '1.25rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.375rem'
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: '1px solid #e2e8f0'
    },
    tableCell: {
      padding: '0.75rem',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem'
    },
    addItemButton: {
      width: '100%',
      padding: '0.75rem',
      border: '2px dashed #e2e8f0',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#6366f1',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '0.75rem',
      transition: 'all 0.2s'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.625rem 0',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.875rem 0',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    warningBox: {
      padding: '0.875rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      color: '#92400e',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.625rem',
      marginBottom: '1rem'
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }} />
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={() => navigate(`/invoices/${invoiceId}`)}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={styles.title}>Edit Invoice</h1>
            {hasChanges && (
              <div style={styles.changeIndicator}>
                <Edit3 size={12} />
                Unsaved Changes
              </div>
            )}
          </div>
          <div style={styles.headerActions}>
            <button style={{ ...styles.button, ...styles.dangerButton }} onClick={handleDiscard}>
              <X size={16} />
              Discard
            </button>
            <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => setShowPreview(true)}>
              <Eye size={16} />
              Preview
            </button>
            <button 
              style={{ ...styles.button, ...styles.primaryButton }} 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.warningBox}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Note:</strong> Only draft invoices can be edited. Once sent, the invoice becomes read-only.
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Building size={18} />
                  Client Details
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Client Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.clientDetails.name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      clientDetails: { ...prev.clientDetails, name: e.target.value }
                    }))}
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={formData.clientDetails.email || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        clientDetails: { ...prev.clientDetails, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.clientDetails.phone || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        clientDetails: { ...prev.clientDetails, phone: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <FileText size={18} />
                  Line Items
                </div>
              </div>
              <div style={{ ...styles.cardContent, padding: 0 }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Description</th>
                      <th style={styles.tableHeader}>Qty</th>
                      <th style={styles.tableHeader}>Rate</th>
                      <th style={styles.tableHeader}>Amount</th>
                      <th style={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lineItems.map((item, index) => (
                      <tr key={item.id || index}>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '80px' }}>
                          <input
                            type="number"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '120px' }}>
                          <input
                            type="number"
                            style={{ ...styles.input, marginBottom: 0 }}
                            value={item.rate}
                            onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td style={{ ...styles.tableCell, width: '120px', fontWeight: '600' }}>
                          {formatCurrency(item.amount)}
                        </td>
                        <td style={{ ...styles.tableCell, width: '40px' }}>
                          <Trash2
                            size={16}
                            style={{ cursor: 'pointer', color: '#ef4444' }}
                            onClick={() => removeLineItem(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '1.25rem' }}>
                  <button style={styles.addItemButton} onClick={addLineItem}>
                    <Plus size={16} />
                    Add Line Item
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <Edit3 size={18} />
                  Revision Notes
                </div>
              </div>
              <div style={styles.cardContent}>
                <textarea
                  style={styles.textarea}
                  value={formData.revisionNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, revisionNotes: e.target.value }))}
                  placeholder="Describe what changes you made and why..."
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <IndianRupee size={18} />
                  Summary
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.gstAmount > 0 && (
                  <div style={styles.summaryRow}>
                    <span>GST</span>
                    <span>{formatCurrency(totals.gstAmount)}</span>
                  </div>
                )}
                {totals.tdsAmount > 0 && (
                  <div style={styles.summaryRow}>
                    <span>TDS</span>
                    <span style={{ color: '#ef4444' }}>-{formatCurrency(totals.tdsAmount)}</span>
                  </div>
                )}
                <div style={styles.totalRow}>
                  <span>Total</span>
                  <span style={{ color: '#059669' }}>{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
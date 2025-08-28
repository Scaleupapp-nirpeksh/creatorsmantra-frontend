/**
 * Tax Settings Page
 * Manage GST/TDS preferences and exemption certificates
 * 
 * Features:
 * - GST configuration (rate, type, exemptions)
 * - TDS settings (rate, entity type)
 * - Exemption certificate management
 * - Default tax preferences
 * - Save and apply to future invoices
 * - Preview tax calculations
 * 
 * Path: src/features/invoices/pages/TaxSettings.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Settings,
  Percent,
  FileText,
  AlertCircle,
  Info,
  Upload,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Calculator,
  RefreshCw,
  Building,
  User,
  IndianRupee,
  HelpCircle,
  Copy,
  Trash2
} from 'lucide-react';
import { invoicesAPI } from '@/api/endpoints/invoices';
import useInvoiceStore from '@/store/invoiceStore';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

const TaxSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { taxPreferences, fetchTaxPreferences, updateTaxPreferences } = useInvoiceStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const [formData, setFormData] = useState({
    // GST Settings
    applyGST: true,
    gstRate: 18,
    gstType: 'cgst_sgst',
    gstExemptionReason: '',
    hasGSTExemption: false,
    gstExemptionCertificate: '',
    gstExemptionValidUpto: '',
    
    // TDS Settings
    applyTDS: false,
    tdsRate: 10,
    entityType: 'individual',
    hasTDSExemption: false,
    tdsExemptionCertificate: '',
    tdsExemptionValidUpto: '',
    
    // Additional Settings
    autoCalculateTax: true,
    includeTermsInInvoice: true,
    defaultPaymentTerms: 30
  });

  const [originalData, setOriginalData] = useState(null);
  const [calculatorInput, setCalculatorInput] = useState({
    amount: 100000,
    applyDiscount: false,
    discountPercent: 0
  });

  useEffect(() => {
    loadTaxPreferences();
  }, []);

  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData]);

  const loadTaxPreferences = async () => {
    setIsLoading(true);
    try {
      const result = await fetchTaxPreferences();
      if (result.success && taxPreferences) {
        const data = {
          ...formData,
          ...taxPreferences
        };
        setFormData(data);
        setOriginalData(JSON.parse(JSON.stringify(data)));
      }
    } catch (error) {
      console.error('Failed to load tax preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateTaxPreferences(formData);
      if (result.success) {
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        setHasChanges(false);
        toast.success('Tax settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save tax settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
      setHasChanges(false);
    }
  };

  const calculateTaxPreview = () => {
    const baseAmount = calculatorInput.amount;
    let discountAmount = 0;
    
    if (calculatorInput.applyDiscount) {
      discountAmount = baseAmount * (calculatorInput.discountPercent / 100);
    }
    
    const taxableAmount = baseAmount - discountAmount;
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    
    if (formData.applyGST && !formData.hasGSTExemption) {
      gstAmount = taxableAmount * (formData.gstRate / 100);
      
      if (formData.gstType === 'cgst_sgst') {
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      } else {
        igstAmount = gstAmount;
      }
    }
    
    const totalWithGST = taxableAmount + gstAmount;
    let tdsAmount = 0;
    
    if (formData.applyTDS && !formData.hasTDSExemption) {
      tdsAmount = totalWithGST * (formData.tdsRate / 100);
    }
    
    const finalAmount = totalWithGST - tdsAmount;
    
    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      tdsAmount,
      finalAmount
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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
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
    subtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem'
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
    content: {
      flex: 1,
      padding: '1.5rem',
      overflow: 'auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      maxWidth: '1200px',
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
      padding: '1.125rem 1.25rem',
      borderBottom: '1px solid #f1f5f9',
      background: 'linear-gradient(to right, #f8fafc, #ffffff)'
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardDescription: {
      fontSize: '0.8125rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    cardContent: {
      padding: '1.25rem'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
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
    select: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
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
    toggleSwitch: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.625rem',
      marginBottom: '1rem',
      cursor: 'pointer'
    },
    switchContainer: {
      position: 'relative',
      width: '48px',
      height: '26px'
    },
    switch: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    },
    switchSlider: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#cbd5e1',
      borderRadius: '13px',
      transition: 'all 0.3s'
    },
    switchSliderActive: {
      backgroundColor: '#6366f1'
    },
    switchThumb: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '22px',
      height: '22px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
    },
    switchThumbActive: {
      transform: 'translateX(22px)'
    },
    infoBox: {
      padding: '1rem',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.625rem',
      fontSize: '0.8125rem',
      color: '#1e40af',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginBottom: '1.25rem'
    },
    warningBox: {
      padding: '1rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '0.625rem',
      fontSize: '0.8125rem',
      color: '#92400e',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginBottom: '1.25rem'
    },
    exemptionBox: {
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #86efac',
      borderRadius: '0.625rem',
      marginTop: '1rem'
    },
    uploadButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    calculatorCard: {
      backgroundColor: '#fafafa',
      borderRadius: '0.625rem',
      padding: '1rem',
      marginTop: '1rem'
    },
    calculatorRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '0.875rem'
    },
    calculatorTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      gap: '1rem'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <span style={{ color: '#64748b' }}>Loading tax settings...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const taxPreview = showCalculator ? calculateTaxPreview() : null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={() => navigate('/settings')}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={styles.title}>Tax Settings</h1>
              <p style={styles.subtitle}>Configure your GST and TDS preferences</p>
            </div>
            {hasChanges && (
              <div style={styles.changeIndicator}>
                <Settings size={12} />
                Unsaved Changes
              </div>
            )}
          </div>
          <div style={styles.headerActions}>
            {hasChanges && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleReset}
              >
                Reset
              </button>
            )}
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          {/* GST Settings */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Percent size={20} />
                GST Settings
              </div>
              <p style={styles.cardDescription}>
                Configure Goods and Services Tax preferences
              </p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.toggleSwitch}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Apply GST</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Add GST to all invoices by default
                  </div>
                </div>
                <div style={styles.switchContainer}>
                  <input
                    type="checkbox"
                    style={styles.switch}
                    checked={formData.applyGST}
                    onChange={(e) => setFormData(prev => ({ ...prev, applyGST: e.target.checked }))}
                  />
                  <div style={{
                    ...styles.switchSlider,
                    ...(formData.applyGST ? styles.switchSliderActive : {})
                  }}>
                    <div style={{
                      ...styles.switchThumb,
                      ...(formData.applyGST ? styles.switchThumbActive : {})
                    }} />
                  </div>
                </div>
              </div>

              {formData.applyGST && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      GST Rate (%)
                      <HelpCircle size={14} style={{ color: '#94a3b8' }} />
                    </label>
                    <select
                      style={styles.select}
                      value={formData.gstRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstRate: parseFloat(e.target.value) }))}
                    >
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST (Standard)</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>GST Type</label>
                    <select
                      style={styles.select}
                      value={formData.gstType}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstType: e.target.value }))}
                    >
                      <option value="cgst_sgst">CGST + SGST (Within State)</option>
                      <option value="igst">IGST (Inter State)</option>
                    </select>
                  </div>

                  <div style={styles.toggleSwitch}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>GST Exemption</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        I have GST exemption certificate
                      </div>
                    </div>
                    <div style={styles.switchContainer}>
                      <input
                        type="checkbox"
                        style={styles.switch}
                        checked={formData.hasGSTExemption}
                        onChange={(e) => setFormData(prev => ({ ...prev, hasGSTExemption: e.target.checked }))}
                      />
                      <div style={{
                        ...styles.switchSlider,
                        ...(formData.hasGSTExemption ? styles.switchSliderActive : {})
                      }}>
                        <div style={{
                          ...styles.switchThumb,
                          ...(formData.hasGSTExemption ? styles.switchThumbActive : {})
                        }} />
                      </div>
                    </div>
                  </div>

                  {formData.hasGSTExemption && (
                    <div style={styles.exemptionBox}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Certificate Number</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={formData.gstExemptionCertificate}
                          onChange={(e) => setFormData(prev => ({ ...prev, gstExemptionCertificate: e.target.value }))}
                          placeholder="Enter certificate number"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Valid Until</label>
                        <input
                          type="date"
                          style={styles.input}
                          value={formatDate(formData.gstExemptionValidUpto)}
                          onChange={(e) => setFormData(prev => ({ ...prev, gstExemptionValidUpto: e.target.value }))}
                        />
                      </div>
                      <button style={styles.uploadButton}>
                        <Upload size={16} />
                        Upload Certificate
                      </button>
                    </div>
                  )}

                  {!formData.hasGSTExemption && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Exemption Reason (if not applying GST)</label>
                      <textarea
                        style={styles.textarea}
                        value={formData.gstExemptionReason}
                        onChange={(e) => setFormData(prev => ({ ...prev, gstExemptionReason: e.target.value }))}
                        placeholder="Explain why GST is not applicable (optional)"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* TDS Settings */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Shield size={20} />
                TDS Settings
              </div>
              <p style={styles.cardDescription}>
                Configure Tax Deducted at Source preferences
              </p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.toggleSwitch}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Apply TDS</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Deduct TDS from invoice amount
                  </div>
                </div>
                <div style={styles.switchContainer}>
                  <input
                    type="checkbox"
                    style={styles.switch}
                    checked={formData.applyTDS}
                    onChange={(e) => setFormData(prev => ({ ...prev, applyTDS: e.target.checked }))}
                  />
                  <div style={{
                    ...styles.switchSlider,
                    ...(formData.applyTDS ? styles.switchSliderActive : {})
                  }}>
                    <div style={{
                      ...styles.switchThumb,
                      ...(formData.applyTDS ? styles.switchThumbActive : {})
                    }} />
                  </div>
                </div>
              </div>

              {formData.applyTDS && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Entity Type</label>
                    <select
                      style={styles.select}
                      value={formData.entityType}
                      onChange={(e) => setFormData(prev => ({ ...prev, entityType: e.target.value }))}
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      TDS Rate (%)
                      <HelpCircle size={14} style={{ color: '#94a3b8' }} />
                    </label>
                    <select
                      style={styles.select}
                      value={formData.tdsRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, tdsRate: parseFloat(e.target.value) }))}
                    >
                      {formData.entityType === 'individual' ? (
                        <>
                          <option value="10">10% (Individual)</option>
                          <option value="20">20% (No PAN)</option>
                        </>
                      ) : (
                        <>
                          <option value="2">2% (Company)</option>
                          <option value="10">10% (Professional Services)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div style={styles.infoBox}>
                    <Info size={16} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>TDS Information:</strong>
                      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                        <li>TDS is deducted from the total amount after GST</li>
                        <li>Individual: 10% | Company: 2%</li>
                        <li>Without PAN: 20% TDS applicable</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tax Calculator */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Calculator size={20} />
                Tax Calculator
              </div>
              <p style={styles.cardDescription}>
                Preview tax calculations with current settings
              </p>
            </div>
            <div style={styles.cardContent}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton, width: '100%', justifyContent: 'center' }}
                onClick={() => setShowCalculator(!showCalculator)}
              >
                <Calculator size={16} />
                {showCalculator ? 'Hide' : 'Show'} Tax Calculator
              </button>

              {showCalculator && (
                <div style={styles.calculatorCard}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Base Amount</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={calculatorInput.amount}
                      onChange={(e) => setCalculatorInput(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div style={styles.toggleSwitch}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Apply Discount</div>
                    </div>
                    <div style={styles.switchContainer}>
                      <input
                        type="checkbox"
                        style={styles.switch}
                        checked={calculatorInput.applyDiscount}
                        onChange={(e) => setCalculatorInput(prev => ({ ...prev, applyDiscount: e.target.checked }))}
                      />
                      <div style={{
                        ...styles.switchSlider,
                        ...(calculatorInput.applyDiscount ? styles.switchSliderActive : {})
                      }}>
                        <div style={{
                          ...styles.switchThumb,
                          ...(calculatorInput.applyDiscount ? styles.switchThumbActive : {})
                        }} />
                      </div>
                    </div>
                  </div>

                  {calculatorInput.applyDiscount && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Discount %</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={calculatorInput.discountPercent}
                        onChange={(e) => setCalculatorInput(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        max="100"
                      />
                    </div>
                  )}

                  {taxPreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={styles.calculatorRow}>
                        <span>Base Amount</span>
                        <span>{formatCurrency(taxPreview.baseAmount)}</span>
                      </div>
                      {taxPreview.discountAmount > 0 && (
                        <div style={styles.calculatorRow}>
                          <span>Discount</span>
                          <span style={{ color: '#ef4444' }}>-{formatCurrency(taxPreview.discountAmount)}</span>
                        </div>
                      )}
                      <div style={styles.calculatorRow}>
                        <span>Taxable Amount</span>
                        <span>{formatCurrency(taxPreview.taxableAmount)}</span>
                      </div>
                      {formData.applyGST && !formData.hasGSTExemption && (
                        <>
                          {formData.gstType === 'cgst_sgst' ? (
                            <>
                              <div style={styles.calculatorRow}>
                                <span>CGST (9%)</span>
                                <span>{formatCurrency(taxPreview.cgstAmount)}</span>
                              </div>
                              <div style={styles.calculatorRow}>
                                <span>SGST (9%)</span>
                                <span>{formatCurrency(taxPreview.sgstAmount)}</span>
                              </div>
                            </>
                          ) : (
                            <div style={styles.calculatorRow}>
                              <span>IGST (18%)</span>
                              <span>{formatCurrency(taxPreview.igstAmount)}</span>
                            </div>
                          )}
                        </>
                      )}
                      {formData.applyTDS && !formData.hasTDSExemption && (
                        <div style={styles.calculatorRow}>
                          <span>TDS ({formData.tdsRate}%)</span>
                          <span style={{ color: '#ef4444' }}>-{formatCurrency(taxPreview.tdsAmount)}</span>
                        </div>
                      )}
                      <div style={styles.calculatorTotal}>
                        <span>Final Amount</span>
                        <span style={{ color: '#059669' }}>{formatCurrency(taxPreview.finalAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Info size={20} />
                Important Information
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.warningBox}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Legal Compliance:</strong>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    Ensure your tax settings comply with current Indian tax laws. Consult with a tax professional if you're unsure about the correct rates or exemptions.
                  </p>
                </div>
              </div>

              <div style={styles.infoBox}>
                <Shield size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Data Security:</strong>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    All tax information is encrypted and stored securely. We do not share your tax details with third parties.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>Quick References:</h4>
                <ul style={{ fontSize: '0.8125rem', color: '#64748b', paddingLeft: '1.25rem' }}>
                  <li>GST rates: 5%, 12%, 18%, 28%</li>
                  <li>TDS for individuals: 10%</li>
                  <li>TDS for companies: 2%</li>
                  <li>TDS without PAN: 20%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input:focus, select:focus, textarea:focus {
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

export default TaxSettings;
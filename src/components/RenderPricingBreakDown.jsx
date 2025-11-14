import { Calculator, Info } from 'lucide-react'

const styles = {
  pricingPreview: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #3b82f6',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginTop: '2rem',
  },
  pricingTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  pricingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    fontSize: '0.9375rem',
  },
  pricingLabel: {
    color: '#475569',
  },
  pricingValue: {
    fontWeight: '500',
    color: '#0f172a',
  },
  pricingDivider: {
    borderTop: '1px solid #cbd5e1',
    margin: '0.75rem 0',
  },
  pricingTotal: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#059669',
  },
}
const RenderPricingBreakDown = () => {
  return (
    <div style={styles.pricingPreview}>
      <h3 style={styles.pricingTitle}>
        <Calculator size={18} />
        Final Pricing Breakdown
      </h3>

      <div style={styles.pricingRow}>
        <span style={styles.pricingLabel}>Base Amount:</span>
        <span style={styles.pricingValue}>{'10,000'}</span>
      </div>

      {/* Gst Applicability */}
      {/* {formData.gstApplicable && ( */}
      {true && (
        <div style={styles.pricingRow}>
          <span style={styles.pricingLabel}>+ GST (18%):</span>
          <span style={styles.pricingValue}>{'1,800'}</span>
          {/* <span style={styles.pricingValue}>{formatCurrency(pricing.gstAmount)}</span> */}
        </div>
      )}

      {/* {formData.gstApplicable && ( */}
      {true && (
        <div style={styles.pricingRow}>
          <span style={styles.pricingLabel}>Total with GST:</span>
          <span style={styles.pricingValue}>{'11,800'}</span>
          {/* <span style={styles.pricingValue}>{formatCurrency(pricing.amountWithGST)}</span> */}
        </div>
      )}

      {/* {formData.tdsApplicable && ( */}
      {true && (
        <>
          <div style={styles.pricingDivider}></div>
          <div style={styles.pricingRow}>
            <span style={styles.pricingLabel}>- TDS (10% on base):</span>
            <span style={{ ...styles.pricingValue, color: '#dc2626' }}>
              1,000
              {/* {formatCurrency(pricing.tdsAmount)} */}
            </span>
          </div>
        </>
      )}

      <div style={styles.pricingDivider}></div>

      <div style={styles.pricingRow}>
        <span style={{ ...styles.pricingLabel, fontSize: '1rem', fontWeight: '600' }}>
          Amount You'll Receive:
        </span>
        {/* <span style={styles.pricingTotal}>{formatCurrency(pricing.finalAmount)}</span> */}
        <span style={styles.pricingTotal}>{'10,080'}</span>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
        <Info size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
        This is an estimate. Actual amount may vary based on payment terms and processing fees.
      </div>
    </div>
  )
}

export default RenderPricingBreakDown

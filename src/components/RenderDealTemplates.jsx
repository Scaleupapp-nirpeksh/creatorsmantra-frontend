import { FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { dealsAPI } from '../api/endpoints'

const styles = {
  templateSelector: {
    maxWidth: '800px',
    margin: '0 auto 2rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  select: {
    padding: '0.625rem 0.875rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.2s',
    width: '100%',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
}

// Apply template
const applyTemplate = async ({ templates, templateId }) => {
  if (!templateId) return

  const template = templates.find((t) => t.id === templateId)
  if (!template) return

  // Merge template data with current form
  setFormData((prev) => ({
    ...prev,
    platform: template.template.platform || prev.platform,
    deliverables: template.template.deliverables || prev.deliverables,
    value: template.template.defaultValue || prev.value,
    paymentTerms: template.template.paymentTerms || prev.paymentTerms,
    ...(template.template.campaignRequirements && {
      exclusivityRequired: template.template.campaignRequirements.exclusivity?.required || false,
      exclusivityDuration: template.template.campaignRequirements.exclusivity?.duration || 30,
      contentGuidelines:
        template.template.campaignRequirements.contentGuidelines || prev.contentGuidelines,
    }),
  }))

  toast.success('Template applied successfully')
}

const RenderDealTemplates = ({ currentStep }) => {
  // Templates state
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true)
      try {
        const response = await dealsAPI.getTemplates()
        if (response.data && response.data.templates) {
          setTemplates(response.data.templates)
        }
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  return (
    <>
      {currentStep === 1 && templates.length > 0 && (
        <div style={styles.templateSelector}>
          <label style={{ ...styles.label, marginBottom: '0.5rem' }}>
            <FileText size={16} />
            Start from a template (Optional)
          </label>
          <select
            onChange={(e) => applyTemplate({ templateId: e.target.value, templates })}
            style={styles.select}
            disabled={loadingTemplates}
          >
            <option value="">-- Select a template --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.category}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}

export default RenderDealTemplates

/**
 * Create Deal Page - Enhanced Deal Creation Form
 * Path: src/features/deals/pages/CreateDealPage.jsx
 *
 * Complete implementation with GST/TDS integration and additional optional fields
 * All features use existing backend endpoints only
 */

// Dependencies
import { ArrowLeft, ArrowRight, Check, Clock, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// Store Imports
import useDealsStore from '../../../store/dealsStore'

// Constants
import { DealsConstants } from '../../../utils/constants'
import { CreateDealFields as FormFields, generateInitialState } from '../formFields'

// Components
import {
  Dropdown,
  GridContainer,
  GridItem,
  RenderStepper,
  TextArea,
  TextInput,
} from '../../../components'
import { checkCondition, validateSection } from '../../../utils/helpers'

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '2rem',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    color: '#475569',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  saveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  progressBar: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  primaryButtonDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },
}

const CreateDealPage = () => {
  // TEMP
  console.count('Rendered')
  /*
    TODO:
    1. Refactor Component - DONE
    2. Optimize Stepper - DONE
    3. Refactor Forms Handling - DONE
    4. Fix the logic of API Calls
    5. Get Info About Templates - Template Selector 
    6. Handle Deal Health Score - keep it onclick - reduces rerenders
    7. Handle Draft mode Logic
    9. Refactor AutoSave Draft Feature
    10. Refactor Form Logic to update Global state and not local state
  */

  // Constants
  const { Steps, SectionsSequence, TotalSteps: totalSteps } = DealsConstants

  // Hooks
  const navigate = useNavigate()
  const { createDeal, creating } = useDealsStore()

  // State Variables
  const [formSection, setFormSection] = useState({
    section: Steps.BASIC_INFO,
    formFields: FormFields[Steps.BASIC_INFO],
    isLast: false,
  })
  const [formState, setFormState] = useState(generateInitialState())
  const [ifFormHasError, setIfFormHasError] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)

  // Auto-save draft
  const [lastSaved, setLastSaved] = useState(null)
  const [saving, setSaving] = useState(false)

  // Handlers
  const changeSection = (direction) => {
    if (direction === 'next' && formSection.isLast) return

    if (direction === 'next') {
      setIfFormHasError(false)
      const { formValues, hasError } = validateSection(formState, formSection.formFields.fields)
      setFormState(formValues)
      if (hasError) {
        setIfFormHasError(hasError)
        return
      }
    }

    setFormSection((prev) => {
      const targetSection = SectionsSequence[prev.section][direction]
      if (!targetSection) return { ...prev, isLast: true }
      return {
        isLast: targetSection === Steps.ADDITIONAL,
        section: targetSection,
        formFields: FormFields[targetSection],
      }
    })
    window.scrollTo(0, 0)
  }

  const handleCreateDeal = () => {
    if (ifFormHasError) return

    setIfFormHasError(false)
    const { formValues, hasError } = validateSection(formState, formSection.formFields.fields)
    setFormState(formValues)
    if (hasError) {
      setIfFormHasError(hasError)
      return
    }

    console.log(formState)
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/deals')}>
          <ArrowLeft size={18} />
          Back to Deals
        </button>

        <h1 style={styles.title}>Create New Deal</h1>

        <div style={styles.saveIndicator}>
          {saving ? (
            <>
              <Clock size={16} />
              Saving...
            </>
          ) : lastSaved ? (
            <>
              <Check size={16} />
              Saved {lastSaved.toLocaleTimeString()}
            </>
          ) : null}
        </div>
      </div>

      {/* Stepper */}
      <RenderStepper currentStep={currentStep} totalSteps={totalSteps} />

      {/* Temp Deal Health Score */}
      {/* <RenderDealHealthScore dealHealth={dealHealth} /> */}

      {/* Form */}
      <div style={styles.formContainer}>
        <form>
          {/* --------------------- New Render --------------------- */}

          {true && (
            <div>
              {/* Section heading */}
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                {formSection.formFields.title}
              </h2>

              {/* Fields */}
              <GridContainer>
                {formSection.formFields.fields.map(
                  ({
                    id,
                    isRequired,
                    label,
                    name,
                    field,
                    type,
                    customStyle,
                    placeholder,
                    options,
                    showIf,
                    defaultValue,
                  }) => {
                    if (!checkCondition(showIf, formState)) return null

                    return (
                      <GridItem key={id} customStyleCls={customStyle}>
                        {field === 'text' && (
                          <TextInput
                            name={name}
                            label={label}
                            type={type}
                            placeholder={placeholder}
                            required={isRequired}
                            error={formState?.[name].error}
                            value={formState?.[name].value}
                            onChange={(e) => {
                              setFormState((prev) => ({
                                ...prev,
                                [name]: {
                                  value: e.target.value,
                                  error: '',
                                },
                              }))
                            }}
                          />
                        )}
                        {field === 'dropdown' && (
                          <Dropdown
                            name={name}
                            label={label}
                            options={options}
                            placeholder={placeholder}
                            required={isRequired}
                            value={formState[name].value}
                            error={formState?.[name].error}
                            onChange={(e) => {
                              setFormState((prev) => ({
                                ...prev,
                                [name]: {
                                  value: e.target.value,
                                },
                              }))
                            }}
                          />
                        )}
                        {field === 'textarea' && (
                          <TextArea
                            name={name}
                            label={label}
                            placeholder={placeholder}
                            required={isRequired}
                            error={formState?.[name].error}
                            value={formState?.[name].value}
                            onChange={(e) => {
                              setFormState((prev) => ({
                                ...prev,
                                [name]: {
                                  value: e.target.value,
                                  error: '',
                                },
                              }))
                            }}
                          />
                        )}
                      </GridItem>
                    )
                  }
                )}
              </GridContainer>
            </div>
          )}

          {/* --------------------- New Render --------------------- */}

          {/* Footer Actions */}
          <div style={styles.footerActions}>
            {/* Previous Button */}
            <div>
              {formSection.section !== Steps.BASIC_INFO && (
                <>
                  <button
                    type="button"
                    onClick={() => changeSection('prev')}
                    style={styles.secondaryButton}
                  >
                    <ArrowLeft size={18} />
                    Previous
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}

            {!formSection.isLast && (
              <button
                type="button"
                onClick={() => changeSection('next')}
                style={styles.primaryButton}
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
            {/* Submit Button */}
            {formSection.isLast && (
              // {formSection.isLast && (
              <button
                type="button"
                disabled={creating}
                onClick={handleCreateDeal}
                style={{
                  ...styles.primaryButton,
                  ...(creating ? styles.primaryButtonDisabled : {}),
                }}
              >
                <Save size={18} />
                {creating ? 'Creating...' : 'Create Deal'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDealPage

/**
 * Create Deal Page - Enhanced Deal Creation Form
 * Path: src/features/deals/pages/CreateDealPage.jsx
 *
 * Complete implementation with GST/TDS integration and additional optional fields
 * All features use existing backend endpoints only
 */

// Dependencies
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Clock,
  Delete,
  Info,
  Plus,
  Save,
  Trash,
} from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Store Imports
import useDealsStore from '../../../store/dealsStore'

// Constants
import { DealsConstants } from '../../../utils/constants'

// Components
import {
  GridContainer,
  GridItem,
  RenderPricingBreakDown,
  RenderSection,
  RenderStepper,
} from '../../../components'

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '2rem',
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
  /*
    TODO:
    1. Refactor Component - DONE
    2. Optimize Stepper - DONE
    3. Refactor Forms Handling - DONE
    4. Fix the logic of API Calls
    5. Get Info About Templates - Template Selector - Remove
    6. Handle Deal Health Score - keep it onclick - reduces rerenders - Remove
    7. Handle Draft mode Logic
    9. Refactor AutoSave Draft Feature
    10. Refactor Form Logic to update Global state and not local state
    11. Refactor Form rendering - DONE
  */

  // Constants
  const { CreateDealSections } = DealsConstants

  // Hooks
  const navigate = useNavigate()
  const {
    creating,
    sectionConfig,
    draftDeal,
    udpateSectionConfig,
    handleCreateDeal,
    handleOnChangeField,
    initiateDraftState,
    dynamicGroups,
    modifyDynamicGroups,
  } = useDealsStore()

  // State Variables
  const [lastSaved, setLastSaved] = useState(null)
  const [saving, setSaving] = useState(false)

  // Effects
  useEffect(() => {
    if (!sectionConfig?.fields?.length) return
    initiateDraftState()
  }, [sectionConfig])

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
      <RenderStepper currentSectionKey={sectionConfig.key} />

      {/* Form */}
      <div style={styles.formContainer}>
        <form>
          {/* --------------------- New Render --------------------- */}

          {/* Form Heading */}
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
            {sectionConfig.title}
          </h2>

          {/* 
            TODO:
              1. Implement the logic of render components conditionally using config
              2. Pricing Breakdown Section - PaymentInfo
          */}

          <div>
            {/* Form Fields */}
            <GridContainer>
              {sectionConfig.fields.map((attrs, idx) => {
                const isComponentGrouped = attrs.component === 'group'
                let canAddFields = false

                if ('group' in attrs.config) {
                  canAddFields =
                    'canAddFields' in attrs.config.group ? attrs.config.group.canAddFields : false
                }

                if (isComponentGrouped) {
                  const groupsToRender = canAddFields ? dynamicGroups[attrs.uid] : [attrs.group]

                  return (
                    <GridItem span={12} key={attrs.uid}>
                      <GridContainer className={attrs.style}>
                        <h6 className="span-12">{`${attrs.label} ${canAddFields ? `# ${groupsToRender?.length}` : ''}`}</h6>
                        {groupsToRender?.map((group, groupIdx) => {
                          const showDeleteBtn =
                            canAddFields && dynamicGroups?.[attrs.uid].length > 1

                          return (
                            <Fragment key={`${attrs.uid}_${groupIdx}`}>
                              {group?.map((groupAttrs) => {
                                return (
                                  <GridItem span={groupAttrs.colSpan} key={groupAttrs.uid}>
                                    <RenderSection
                                      attrs={groupAttrs}
                                      onChange={(e) => {
                                        handleOnChangeField(e, attrs.name, groupIdx, groupAttrs.uid)
                                      }}
                                      formState={draftDeal}
                                      parentKey={attrs.name}
                                    />
                                  </GridItem>
                                )
                              })}
                              {showDeleteBtn && (
                                <GridItem span={12}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      modifyDynamicGroups('remove', attrs.uid, attrs.name, groupIdx)
                                    }
                                    style={{
                                      ...styles.secondaryButton,
                                      width: '100%',
                                      justifyContent: 'center',
                                      borderColor: '#E53935',
                                    }}
                                  >
                                    Delete
                                    <Trash size={18} />
                                  </button>
                                </GridItem>
                              )}
                            </Fragment>
                          )
                        })}

                        {canAddFields && (
                          <GridItem span={12}>
                            <div style={{ border: '1px solid #e2e8f0', width: '100%' }}></div>
                          </GridItem>
                        )}

                        {canAddFields && (
                          <GridItem span={12}>
                            <button
                              type="button"
                              onClick={() => modifyDynamicGroups('add', attrs.uid, attrs.name)}
                              style={{
                                ...styles.primaryButton,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                            >
                              Add
                              <Plus size={18} />
                            </button>
                          </GridItem>
                        )}
                      </GridContainer>
                    </GridItem>
                  )
                }

                return (
                  <GridItem key={attrs.uid} span={attrs.colSpan}>
                    <RenderSection
                      key={attrs.uid}
                      attrs={attrs}
                      onChange={(e) => handleOnChangeField(e, attrs.name)}
                      formState={draftDeal}
                    />
                  </GridItem>
                )
              })}
            </GridContainer>
          </div>

          {/* Pricing BreakDown Component */}
          {sectionConfig.key === CreateDealSections.PaymentInfo.key && <RenderPricingBreakDown />}

          {/* --------------------- New Render --------------------- */}

          {/* Footer Actions */}
          <div style={styles.footerActions}>
            {/* Previous Button */}
            <div>
              {sectionConfig.key !== CreateDealSections.BasicInfo.key && (
                <>
                  <button
                    type="button"
                    onClick={() => udpateSectionConfig('prev')}
                    style={styles.secondaryButton}
                  >
                    <ArrowLeft size={18} />
                    Previous
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}

            {!sectionConfig.isLast && (
              <button
                type="button"
                onClick={() => udpateSectionConfig('next')}
                style={styles.primaryButton}
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
            {/* Submit Button */}
            {sectionConfig.isLast && (
              <button
                type="button"
                disabled={creating}
                onClick={async () => {
                  await handleCreateDeal()
                  navigate(`/deals`)
                }}
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

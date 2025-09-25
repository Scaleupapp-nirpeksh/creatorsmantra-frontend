/**
 * Deals Store - Centralized State Management
 * Path: src/store/dealsStore.js
 *
 * Manages all deals-related state using Zustand.
 * Handles API calls, caching, optimistic updates, and filters.
 *
 * Features:
 * - CRUD operations for deals
 * - Pipeline stage management
 * - Search and filtering
 * - Optimistic updates
 * - Error handling
 * - Analytics data
 */

import { create } from 'zustand'
import { dealsAPI } from '../api/endpoints/deals'
import { toast } from 'react-hot-toast'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { calculateAnalytics, checkOverdueStatus, validate } from '../utils/helpers'
import { DealsConstants } from '../utils/constants'
import { CreateDealForm } from '../features/deals/formFields'

// Storage key prefix from environment
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_'

const ifProd = import.meta.env.VITE_ENV === 'production'
const storeWrapper = (f) => (ifProd ? (f) => f : devtools(f, { name: 'dealsStore' }))

const { CreateDealSections, SectionMap } = DealsConstants

const getVal = (field) => field?.value ?? ''

function generatePayload(state) {
  return {
    title: getVal(state.title),

    brand: {
      name: getVal(state.brandName),
      website: getVal(state.brandWebsite),
      industry: getVal(state.brandIndustry),
      companySize: getVal(state.brandCompanySize),
      contactPerson: {
        name: getVal(state.contactName),
        email: getVal(state.contactEmail),
        phone: getVal(state.contactPhone),
        designation: getVal(state.contactDesignation),
      },
    },

    platform: getVal(state.platform),

    deliverables: (state.deliverables.group || []).map((d) => ({
      type: Object.values(d)[0]?.value ?? '', // map subField_1 etc → type
      quantity: Number(Object.values(d)[1]?.value ?? 1),
      description: Object.values(d)[2]?.value ?? '',
    })),

    dealValue: {
      amount: Number(getVal(state.value)),
      currency: getVal(state.currency),
      paymentTerms: getVal(state.paymentTerms),
      customPaymentTerms: getVal(state.customPaymentTerms),
      gstApplicable: state.gstApplicable?.value ?? false,
      tdsApplicable: state.tdsApplicable?.value ?? false,
    },

    timeline: {
      responseDeadline: getVal(state.deadline),
      contentDeadline: getVal(state.deadline), // or campaignStartDate if that's intended
      goLiveDate: getVal(state.campaignStartDate),
      paymentDueDate: getVal(state.campaignEndDate),
    },

    campaignRequirements: {
      contentGuidelines: state.contentGuidelines.group?.length
        ? {
            tone: state.contentGuidelines.group[0]['deliverables_info.tone.subField_1'].value,
            style: state.contentGuidelines.group[0]['deliverables_info.style.subField_2'].value,
          }
        : undefined,

      performanceTargets: state.performance.group?.length
        ? {
            minViews: Number(
              state.performance.group[0]['deliverables_info.min_views.subField_2'].value
            ),
            minLikes: Number(
              state.performance.group[0]['deliverables_info.min_likes.subField_3'].value
            ),
            minComments: Number(
              state.performance.group[0]['deliverables_info.min_comments.subField_4'].value
            ),
            minShares: Number(
              state.performance.group[0]['deliverables_info.min_likes.subField_5'].value
            ),
          }
        : undefined,
    },

    source: getVal(state.source),

    priority: getVal(state.priority),

    tags: Array.isArray(state.tags.value) ? state.tags.value : [],

    internalNotes: getVal(state.internalNotes),
  }
}

/*
    TODO:
    1. Add Reset Mechanism if user leaves the page in between
*/

const useDealsStore = create((set, get) => ({
  // --------------- STATE ---------------

  // Deals data
  deals: [],
  loading: false,
  error: null,
  viewType: 'pipeline', // pipeline, table, calendar
  analytics: {
    totalDeals: 0,
    totalValue: 0,
    avgDealValue: 0,
    conversionRate: 0,
    avgTimeToClose: 0,
    dealsWon: 0,
    dealsLost: 0,
    dealsByMonth: [],
    revenueByMonth: [],
    topBrands: [],
    performanceByStage: {},

    // Calculated Fields
    completedDeals: 0,
    overdueDeals: 0,
  },

  // Create Deals Operations
  sectionConfig: {
    key: CreateDealSections.BasicInfo.key,
    fields: CreateDealForm[CreateDealSections.BasicInfo.key].fields,
    title: CreateDealForm[CreateDealSections.BasicInfo.key].title,
    isLast: false,
  },
  draftDeal: {},
  dynamicGroups: {}, // Required for Deliverables
  ifFormHasError: false, // Required for Validation before moving to next step

  // Cache
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes

  // --------------- HANDLERS ---------------

  // Local Ops
  initiateDraftState: () => {
    const { sectionConfig, draftDeal } = get()
    const dynamicGrps = {}

    const newDraftDeal = { ...(draftDeal || {}) }

    sectionConfig.fields.forEach((f) => {
      if (f.component === 'group') {
        // Generate Dynamic Group Fields
        dynamicGrps[f.uid] = f.config?.group?.canAddFields ? [f.group] : []

        const grp = Object.fromEntries(f.group.map((g) => [g.uid, { value: '', error: '' }]))

        newDraftDeal[f.name] = {
          isGroupedField: true,
          group: [grp],
          value: '',
          error: '',
        }
      } else if ('default' in f) {
        newDraftDeal[f.name] = {
          isGroupedField: false,
          group: '',
          value: draftDeal?.[f.name]?.value ?? f.default,
          error: '',
        }
      }
    })

    set({
      draftDeal: newDraftDeal,
      ...(Object.keys(dynamicGrps).length > 0 && { dynamicGroups: dynamicGrps }),
    })
  },

  modifyDynamicGroups: (action, fieldUid, field, groupIdx = null) => {
    // groupIdx & field is required for gorouped data
    const sectionConfig = get().sectionConfig
    const dynamicGroups = get().dynamicGroups
    const draftDeal = get().draftDeal

    const fieldData = sectionConfig.fields.find((f) => f.uid === fieldUid)
    if (!fieldData) return

    if (action === 'remove') {
      const updatedGroups = {
        ...dynamicGroups,
        [fieldUid]: dynamicGroups?.[fieldUid].filter((_, i) => i !== groupIdx),
      }

      const updatedDraftGroup = draftDeal?.[field]?.group.filter((_, i) => i !== groupIdx)

      const updatedDraft = {
        ...draftDeal,
        [field]: {
          ...draftDeal[field],
          group: updatedDraftGroup,
        },
      }

      const stateToUpdate = {
        dynamicGroups: updatedGroups,
        draftDeal: updatedDraft,
      }

      set(stateToUpdate)
      return
    }

    // Generate unique Id For New Group
    const lastItemUid = dynamicGroups?.[fieldData.uid].at(-1).at(-1).uid
    const [base, lastNum] = lastItemUid.split(/_(\d+)$/)

    const newDynamicGroup = []
    const newDraftGroup = {}

    fieldData.group.forEach((item, idx) => {
      const newUid = `${base}_${+lastNum + idx + 1}`
      newDynamicGroup.push({
        ...item,
        uid: newUid,
      })
      newDraftGroup[newUid] = {
        value: '',
        error: '',
      }
    })

    const toSet = {
      dynamicGroups: {
        ...dynamicGroups,
        [fieldUid]: [...(dynamicGroups[fieldUid] ?? []), newDynamicGroup],
      },

      // Update Draft
      draftDeal: {
        ...draftDeal,
        [field]: {
          ...draftDeal[field],
          group: [...draftDeal[field]?.group, newDraftGroup],
        },
      },
    }

    set(toSet)
  },

  udpateSectionConfig: (direction) => {
    const prev = get().sectionConfig
    const draftDeal = get().draftDeal

    if (direction === 'next' && prev.isLast) return

    const { hasErrors, updatedDraft } = validate(draftDeal, prev.fields)

    if (hasErrors) {
      set({ ifFormHasError: true, draftDeal: updatedDraft })
      return
    }

    const targetSection = SectionMap[prev.key][direction]
    if (!targetSection) return { ...prev, isLast: true }
    const updatedConfig = {
      isLast: targetSection === CreateDealSections.AdditionalInfo.key,
      key: targetSection,
      fields: CreateDealForm[targetSection].fields,
      title: CreateDealForm[targetSection].title,
    }
    set({ sectionConfig: { ...updatedConfig } })
    window.scrollTo(0, 0)
  },

  handleCreateDealq: async () => {
    // const newDeal = get().draftDeal
    const _payload = generatePayload(get().draftDeal)
    const response = await dealsAPI.createDeal(_payload)
    console.log(_payload)
  },

  handleOnChangeField: (e, field, groupIdx = null, grpItemUid = null) => {
    const existingDraftDealData = get().draftDeal

    const fieldToUpdate = existingDraftDealData?.[field]
    const isCheckBox = e.target.type === 'checkbox'

    if (fieldToUpdate?.isGroupedField) {
      if (!groupIdx && !grpItemUid) return
      let fieldData = fieldToUpdate.group.at(groupIdx)

      fieldData[grpItemUid] = {
        error: '',
        value: isCheckBox ? e.target.checked : e.target.value,
      }
      fieldToUpdate.group[groupIdx] = fieldData

      const updatedDraft = {
        ...existingDraftDealData,
        [field]: {
          ...fieldToUpdate,
          group: fieldToUpdate.group,
        },
      }
      set({ draftDeal: updatedDraft })
      return
    }

    const value = isCheckBox ? e.target.checked : e.target.value

    const newDealData = {
      ...existingDraftDealData,
      [field]: { isGroupedField: false, group: [], value, error: '' },
    }
    set({ draftDeal: newDealData })
  },

  // APIs
  fetchDeals: async () => {
    /*
      TODO:
        1. Implement logic to fetch deals based on provided filters (if any)
        2. Implement Logic to calculate overDue deals count and Urgent deals count
        3. Implement caching logic to avoid redundant API calls
    */

    try {
      const { data, success, error } = await dealsAPI.getDeals()
      if (!success) {
        set({ error: error || 'No Data Found', isLoading: false })
        return
      }

      const { deals, summary } = data

      const { completedDealsCnt, conversionRatePercentage, overDueDealsCnt } = calculateAnalytics(
        deals,
        summary.totalDeals
      )

      set({
        deals,
        analytics: {
          ...summary,
          completedDeals: completedDealsCnt,
          conversionRate: conversionRatePercentage,
          overdueDeals: overDueDealsCnt,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ error: 'Failed to fetch deals', isLoading: false })
    }
  },
  updateStage: async (id, newStage) => {
    /*
        TODO:
        1. Make this function generic & not specific to stage
    */
    const currentDealsData = get().deals
    const summary = get().analytics

    try {
      const updatedDocument = await dealsAPI.patchDealData(id, {
        payload: {
          stage: newStage,
        },
        returnModified: true,
      })

      if (!updatedDocument) return

      const docIdx = currentDealsData.findIndex(({ _id }) => _id === id)
      currentDealsData[docIdx] = updatedDocument

      const { completedDealsCnt, conversionRatePercentage, overDueDealsCnt } = calculateAnalytics(
        currentDealsData,
        currentDealsData.length
      )

      set({
        deals: currentDealsData,
        analytics: {
          ...summary,
          completedDeals: completedDealsCnt,
          conversionRate: conversionRatePercentage,
          overdueDeals: overDueDealsCnt,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ error: 'Failed to update deals', isLoading: false })
    }
  },
  handleCreateDeal: async () => {
    set({ creating: true, error: null })

    try {
      // Call API
      const _payload = generatePayload(get().draftDeal)

      const response = await dealsAPI.createDeal(_payload)

      // Handle different response structures
      let newDeal
      if (response.data && response.data.data) {
        // This is the correct path based on your backend response
        newDeal = response.data.data
        if (response.data.deal) newDeal = response.data.deal
        else newDeal = response.data
      } else newDeal = response.data

      // CHANGE 1: Check for dealId as well (your backend uses dealId, not just id)
      if (newDeal && (newDeal.dealId || newDeal._id || newDeal.id)) {
        const deals = [newDeal, ...get().deals]
        const dealsByStage = { ...get().dealsByStage }

        const stageId = newDeal.stage || 'pitched' // CHANGE 2: Default should be 'pitched' not 'lead'
        if (!dealsByStage[stageId]) {
          dealsByStage[stageId] = []
        }
        dealsByStage[stageId].unshift(newDeal)

        set({
          deals,
          dealsByStage,
          creating: false,
        })

        // Refresh analytics in background
        // setTimeout(() => {
        //   get().fetchAnalytics()
        // }, 1000)

        // CHANGE 3: Return proper structure for navigation
        return {
          id: newDeal._id, // MongoDB ID for navigation
          _id: newDeal._id,
          dealId: newDeal.dealId, // Custom deal ID
          ...newDeal,
        }
      } else {
        throw new Error('Invalid deal response from server')
      }
    } catch (error) {
      // Extract error message - IMPROVED ERROR HANDLING
      let errorMessage = 'Failed to create deal'
      const errorMessages = []

      if (error.response?.data) {
        const errorData = error.response.data
        console.log('Error data structure:', JSON.stringify(errorData, null, 2))

        // Extract the main error message
        if (errorData.message) {
          errorMessage = errorData.message
        }

        // Handle the specific error structure from your backend
        if (errorData.error && errorData.error.errors && Array.isArray(errorData.error.errors)) {
          errorData.error.errors.forEach((err) => {
            let message = ''

            // Format field name nicely
            const fieldName = err.field
              ? err.field.charAt(0).toUpperCase() + err.field.slice(1)
              : 'Field'

            // Handle different field names
            if (err.field === 'brand') {
              message = 'Brand name is required'
            } else if (err.field === 'platform') {
              message = 'Platform selection is required'
            } else if (err.field === 'dealValue') {
              message = 'Deal value is required'
            } else if (err.field?.includes('deliverables')) {
              message = 'All deliverables must have a description'
            } else {
              message = err.message || `${fieldName} validation failed`
            }

            errorMessages.push(message)
            toast.error(message)
          })
        } else if (errorData.error) {
          // Handle other error formats
          if (typeof errorData.error === 'string') {
            errorMessages.push(errorData.error)
            toast.error(errorData.error)
          } else if (errorData.error.message) {
            errorMessages.push(errorData.error.message)
            toast.error(errorData.error.message)
          }
        }
      } else if (error.message) {
        toast.error(error.message)
      }

      // If no specific errors were found, show the general message
      if (errorMessages.length === 0) {
        toast.error(errorMessage)
      }

      set({
        error: errorMessages.length > 0 ? errorMessages.join(', ') : errorMessage,
        creating: false,
      })

      throw error
    }
  },
}))

// ----------------------------------------------------------------------------------------------------
// Old Code - Until new store is fullly tasted
const useDealsStoreLegacy = create(
  storeWrapper(
    persist(
      (set, get) => ({
        // ==================== STATE ====================

        // Deals data
        deals: [],
        currentDeal: null,

        // UI State
        loading: false,
        creating: false,
        updating: false,
        deleting: false,
        error: null,

        // Filters & Search
        filters: {
          search: '',
          stage: 'all',
          brandId: null,
          dateRange: null,
          minValue: null,
          maxValue: null,
          tags: [],
          assignee: null,
          status: 'active', // active, archived, all
        },

        // Sorting
        sortBy: 'updated_at',
        sortOrder: 'desc',

        // View preferences
        viewType: 'pipeline', // pipeline, table, calendar

        // Analytics
        analytics: {
          totalDeals: 0,
          totalValue: 0,
          avgDealSize: 0,
          conversionRate: 0,
          avgTimeToClose: 0,
          dealsWon: 0,
          dealsLost: 0,
          dealsByMonth: [],
          revenueByMonth: [],
          topBrands: [],
          performanceByStage: {},
          overdueDeals: 0,
          urgentDeals: 0,
        },

        // Cache
        lastFetch: null,
        cacheTimeout: 5 * 60 * 1000, // 5 minutes

        // ==================== ACTIONS ====================

        fetchDeals: async () => {
          const state = get()

          set({ loading: true, error: null })

          try {
            const { data, success } = await dealsAPI.getDeals()

            if (!success) {
              set({ error: 'No Data Found', deals: [], isLoading: false })
              return
            }

            const dealsAnalytics = { ...state.analytics, ...data.summary }
            const overdueCount = deals.filter((deal) => checkOverdueStatus(deal).isOverdue).length
            const urgentCount = deals.filter((deal) => {
              const status = checkOverdueStatus(deal)
              return status.urgency === 'warning' || status.urgency === 'critical'
            }).length

            set({
              deals: data.deals,
              analytics: {
                ...dealsAnalytics,
                overdueDeals: overdueCount || 0,
                urgentDeals: urgentCount,
              },
              isLoading: false,
            })
          } catch (error) {
            console.error('Error fetching deals:', error)
            set({
              error: error.response?.data?.message || error.message || 'Failed to fetch deals',
              loading: false,
            })
            return []
          }
        },

        // Fetch single deal
        fetchDeal: async (dealId) => {
          set({ loading: true, error: null })

          try {
            const response = await dealsAPI.getDeal(dealId)
            const deal = response.data

            set({
              currentDeal: deal,
              loading: false,
            })

            // Update in deals list if exists
            const deals = get().deals
            const index = deals.findIndex((d) => d.id === dealId)
            if (index !== -1) {
              deals[index] = deal
              set({ deals: [...deals] })
            }

            return deal
          } catch (error) {
            console.error('Error fetching deal:', error)
            set({
              error: error.message || 'Failed to fetch deal',
              loading: false,
            })
            toast.error('Failed to load deal details')
            return null
          }
        },

        createDeal: async (dealData) => {
          set({ creating: true, error: null })

          try {
            console.log('Creating deal with data:', dealData)

            // Call API
            const response = await dealsAPI.createDeal(dealData)
            console.log('API Response:', response)

            // Handle different response structures
            let newDeal
            if (response.data) {
              if (response.data.data) {
                // This is the correct path based on your backend response
                newDeal = response.data.data
              } else if (response.data.deal) {
                newDeal = response.data.deal
              } else {
                newDeal = response.data
              }
            } else {
              newDeal = response
            }

            console.log('New deal created:', newDeal)

            // CHANGE 1: Check for dealId as well (your backend uses dealId, not just id)
            if (newDeal && (newDeal.dealId || newDeal._id || newDeal.id)) {
              const deals = [newDeal, ...get().deals]
              const dealsByStage = { ...get().dealsByStage }

              const stageId = newDeal.stage || 'pitched' // CHANGE 2: Default should be 'pitched' not 'lead'
              if (!dealsByStage[stageId]) {
                dealsByStage[stageId] = []
              }
              dealsByStage[stageId].unshift(newDeal)

              set({
                deals,
                dealsByStage,
                creating: false,
              })

              // Refresh analytics in background
              setTimeout(() => {
                get().fetchAnalytics()
              }, 1000)

              // CHANGE 3: Return proper structure for navigation
              return {
                id: newDeal._id, // MongoDB ID for navigation
                _id: newDeal._id,
                dealId: newDeal.dealId, // Custom deal ID
                ...newDeal,
              }
            } else {
              throw new Error('Invalid deal response from server')
            }
          } catch (error) {
            console.error('Error creating deal:', error)
            console.error('Full error response:', error.response?.data)

            // Extract error message - IMPROVED ERROR HANDLING
            let errorMessage = 'Failed to create deal'
            const errorMessages = []

            if (error.response?.data) {
              const errorData = error.response.data
              console.log('Error data structure:', JSON.stringify(errorData, null, 2))

              // Extract the main error message
              if (errorData.message) {
                errorMessage = errorData.message
              }

              // Handle the specific error structure from your backend
              if (
                errorData.error &&
                errorData.error.errors &&
                Array.isArray(errorData.error.errors)
              ) {
                errorData.error.errors.forEach((err) => {
                  let message = ''

                  // Format field name nicely
                  const fieldName = err.field
                    ? err.field.charAt(0).toUpperCase() + err.field.slice(1)
                    : 'Field'

                  // Handle different field names
                  if (err.field === 'brand') {
                    message = 'Brand name is required'
                  } else if (err.field === 'platform') {
                    message = 'Platform selection is required'
                  } else if (err.field === 'dealValue') {
                    message = 'Deal value is required'
                  } else if (err.field?.includes('deliverables')) {
                    message = 'All deliverables must have a description'
                  } else {
                    message = err.message || `${fieldName} validation failed`
                  }

                  errorMessages.push(message)
                  toast.error(message)
                })
              } else if (errorData.error) {
                // Handle other error formats
                if (typeof errorData.error === 'string') {
                  errorMessages.push(errorData.error)
                  toast.error(errorData.error)
                } else if (errorData.error.message) {
                  errorMessages.push(errorData.error.message)
                  toast.error(errorData.error.message)
                }
              }
            } else if (error.message) {
              toast.error(error.message)
            }

            // If no specific errors were found, show the general message
            if (errorMessages.length === 0) {
              toast.error(errorMessage)
            }

            set({
              error: errorMessages.length > 0 ? errorMessages.join(', ') : errorMessage,
              creating: false,
            })

            throw error
          }
        },
        // Update deal
        updateDeal: async (dealId, updates) => {
          set({ updating: true, error: null })

          // Optimistic update
          const deals = get().deals
          const dealIndex = deals.findIndex((d) => d.id === dealId)
          const originalDeal = deals[dealIndex]

          if (dealIndex !== -1) {
            deals[dealIndex] = { ...originalDeal, ...updates }
            set({ deals: [...deals] })
          }

          try {
            const response = await dealsAPI.updateDeal(dealId, updates)
            const updatedDeal = response.data

            // Update with server response
            deals[dealIndex] = updatedDeal

            // Update dealsByStage if stage changed
            if (originalDeal.stage !== updatedDeal.stage) {
              const dealsByStage = { ...get().dealsByStage }

              // Remove from old stage
              dealsByStage[originalDeal.stage] = dealsByStage[originalDeal.stage].filter(
                (d) => d.id !== dealId
              )

              // Add to new stage
              if (!dealsByStage[updatedDeal.stage]) {
                dealsByStage[updatedDeal.stage] = []
              }
              dealsByStage[updatedDeal.stage].push(updatedDeal)

              set({ dealsByStage })
            }

            set({
              deals: [...deals],
              currentDeal: updatedDeal,
              updating: false,
            })

            // toast.success('Deal updated successfully');

            // Refresh analytics if value or stage changed
            if (
              originalDeal.value !== updatedDeal.value ||
              originalDeal.stage !== updatedDeal.stage
            ) {
              get().fetchAnalytics()
            }

            return updatedDeal
          } catch (error) {
            console.error('Error updating deal:', error)

            // Revert optimistic update
            deals[dealIndex] = originalDeal
            set({
              deals: [...deals],
              error: error.message || 'Failed to update deal',
              updating: false,
            })

            toast.error('Failed to update deal')
            throw error
          }
        },

        // Move deal to different stage
        moveDealToStage: async (dealId, newStage) => {
          const deals = get().deals
          const dealIndex = deals.findIndex((d) => d.id === dealId)

          if (dealIndex === -1) return

          const originalDeal = deals[dealIndex]
          const originalStage = originalDeal.stage

          // Optimistic update
          const dealsByStage = { ...get().dealsByStage }

          // Remove from current stage
          dealsByStage[originalStage] = dealsByStage[originalStage].filter((d) => d.id !== dealId)

          // Add to new stage
          if (!dealsByStage[newStage]) {
            dealsByStage[newStage] = []
          }

          const updatedDeal = { ...originalDeal, stage: newStage }
          dealsByStage[newStage].push(updatedDeal)
          deals[dealIndex] = updatedDeal

          set({
            deals: [...deals],
            dealsByStage,
          })

          try {
            await dealsAPI.updateDealStage(dealId, newStage)

            // Log stage transition
            await dealsAPI.addActivity(dealId, {
              type: 'stage_change',
              from: originalStage,
              to: newStage,
              timestamp: new Date().toISOString(),
            })

            // toast.success('Deal moved successfully');

            // Refresh analytics
            get().fetchAnalytics()
          } catch (error) {
            console.error('Error moving deal:', error)

            // Revert optimistic update
            dealsByStage[newStage] = dealsByStage[newStage].filter((d) => d.id !== dealId)
            dealsByStage[originalStage].push(originalDeal)
            deals[dealIndex] = originalDeal

            set({
              deals: [...deals],
              dealsByStage,
            })

            toast.error('Failed to move deal')
          }
        },

        // Delete deal
        deleteDeal: async (dealId) => {
          set({ deleting: true, error: null })

          // Store original state for rollback
          const originalDeals = get().deals
          const originalDealsByStage = get().dealsByStage

          // Optimistic delete
          const deals = originalDeals.filter((d) => d.id !== dealId)
          const deal = originalDeals.find((d) => d.id === dealId)

          if (deal) {
            const dealsByStage = { ...originalDealsByStage }
            dealsByStage[deal.stage] = dealsByStage[deal.stage].filter((d) => d.id !== dealId)

            set({ deals, dealsByStage })
          }

          try {
            await dealsAPI.deleteDeal(dealId)

            set({ deleting: false })
            // toast.success('Deal deleted successfully');

            // Refresh analytics
            get().fetchAnalytics()
          } catch (error) {
            console.error('Error deleting deal:', error)

            // Revert optimistic delete
            set({
              deals: originalDeals,
              dealsByStage: originalDealsByStage,
              error: error.message || 'Failed to delete deal',
              deleting: false,
            })

            toast.error('Failed to delete deal')
            throw error
          }
        },

        // Bulk update deals
        bulkUpdateDeals: async (dealIds, updates) => {
          set({ updating: true, error: null })

          try {
            await dealsAPI.bulkUpdate(dealIds, updates)

            // Refresh deals list
            await get().fetchDeals(true)

            set({ updating: false })
            toast.success(`${dealIds.length} deals updated successfully`)
          } catch (error) {
            console.error('Error bulk updating deals:', error)
            set({
              error: error.message || 'Failed to update deals',
              updating: false,
            })
            toast.error('Failed to update deals')
            throw error
          }
        },

        // Duplicate deal
        duplicateDeal: async (dealId) => {
          try {
            const deal = get().deals.find((d) => d.id === dealId)
            if (!deal) throw new Error('Deal not found')

            const newDealData = {
              ...deal,
              title: `${deal.title} (Copy)`,
              stage: 'lead',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            delete newDealData.id
            delete newDealData.activity
            delete newDealData.documents

            return await get().createDeal(newDealData)
          } catch (error) {
            console.error('Error duplicating deal:', error)
            toast.error('Failed to duplicate deal')
            throw error
          }
        },

        // Add activity to deal
        addActivity: async (dealId, activity) => {
          try {
            const response = await dealsAPI.addActivity(dealId, activity)

            // Update current deal if it's the one being viewed
            if (get().currentDeal?.id === dealId) {
              const currentDeal = get().currentDeal
              currentDeal.activity = [response.data, ...(currentDeal.activity || [])]
              set({ currentDeal: { ...currentDeal } })
            }

            return response.data
          } catch (error) {
            console.error('Error adding activity:', error)
            toast.error('Failed to add activity')
            throw error
          }
        },

        // Add note to deal
        addNote: async (dealId, note) => {
          try {
            const response = await dealsAPI.addNote(dealId, note)

            // Update current deal
            if (get().currentDeal?.id === dealId) {
              const currentDeal = get().currentDeal
              currentDeal.notes = [response.data, ...(currentDeal.notes || [])]
              set({ currentDeal: { ...currentDeal } })
            }

            toast.success('Note added successfully')
            return response.data
          } catch (error) {
            console.error('Error adding note:', error)
            toast.error('Failed to add note')
            throw error
          }
        },

        // Fetch analytics
        fetchAnalytics: async () => {
          try {
            const response = await dealsAPI.getAnalytics()
            set({ analytics: response.data })
            return response.data
          } catch (error) {
            console.error('Error fetching analytics:', error)
            return null
          }
        },

        // ==================== FILTERS & SEARCH ====================

        // Set filters
        setFilters: (filters) => {
          set({
            filters: { ...get().filters, ...filters },
            pagination: { ...get().pagination, page: 1 }, // Reset to first page
          })

          // Debounced fetch
          clearTimeout(get().filterTimeout)
          const timeout = setTimeout(() => {
            get().fetchDeals(true)
          }, 300)

          set({ filterTimeout: timeout })
        },

        // Clear filters
        clearFilters: () => {
          set({
            filters: {
              search: '',
              stage: 'all',
              brandId: null,
              dateRange: null,
              minValue: null,
              maxValue: null,
              tags: [],
              assignee: null,
              status: 'active',
            },
          })
          get().fetchDeals(true)
        },

        // Search deals
        searchDeals: (searchTerm) => {
          set({
            filters: { ...get().filters, search: searchTerm },
            pagination: { ...get().pagination, page: 1 },
          })

          // Debounced search
          clearTimeout(get().searchTimeout)
          const timeout = setTimeout(() => {
            get().fetchDeals(true)
          }, 500)

          set({ searchTimeout: timeout })
        },

        // ==================== VIEW PREFERENCES ====================

        // Set view type
        setViewType: (viewType) => {
          set({ viewType })
          localStorage.setItem('deals_view_type', viewType)
        },

        // Set sorting
        setSorting: (sortBy, sortOrder) => {
          set({ sortBy, sortOrder })
          get().fetchDeals(true)
        },

        // ==================== UTILITIES ====================

        // Get deals by stage
        getDealsByStage: (stageId) => {
          return get().dealsByStage[stageId] || []
        },

        // Get stage value
        getStageValue: (stageId) => {
          const deals = get().getDealsByStage(stageId)
          return deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
        },

        // Get stage stats
        getStageStats: (stageId) => {
          const deals = get().getDealsByStage(stageId)
          return {
            count: deals.length,
            value: get().getStageValue(stageId),
            avgValue: deals.length > 0 ? get().getStageValue(stageId) / deals.length : 0,
            avgAge:
              deals.reduce((sum, deal) => {
                const age = Math.floor(
                  (new Date() - new Date(deal.created_at)) / (1000 * 60 * 60 * 24)
                )
                return sum + age
              }, 0) / (deals.length || 1),
          }
        },

        // Reset store
        reset: () => {
          set({
            deals: [],
            currentDeal: null,
            dealsByStage: {},
            loading: false,
            creating: false,
            updating: false,
            deleting: false,
            error: null,
            lastFetch: null,
          })
        },

        // Initialize store
        init: () => {
          // Load saved preferences
          const savedViewType = localStorage.getItem('deals_view_type')
          if (savedViewType) {
            set({ viewType: savedViewType })
          }

          // Fetch initial data
          get().fetchDeals()
          get().fetchAnalytics()
        },
      }),
      {
        name: `${STORAGE_PREFIX}deals-storage`,
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)

export default useDealsStore

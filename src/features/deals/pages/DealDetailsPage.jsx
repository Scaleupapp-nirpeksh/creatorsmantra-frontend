/**
 * Deal Details Page
 * Path: src/features/deals/pages/DealDetailsPage.jsx
 *
 * - Fix: dealValue always an object (sanitized), no NaN
 * - Fix: communications validation (summary>=5, nextAction required, followUpDate valid date)
 * - Fix: Proper state management for editing to prevent data loss
 * - Removed: attachments/documents section completely
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  MoreVertical,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Activity,
  Copy,
  Send,
  CreditCard,
  Zap,
  IndianRupee,
  Hash,
  Target,
  Users,
  Globe,
} from 'lucide-react'
import { dealsAPI } from '../../../api/endpoints/deals'
import useAuthStore from '../../../store/authStore'
import useUIStore from '../../../store/uiStore'
import { toast } from 'react-hot-toast'

const DealDetailsPage = () => {
  const { dealId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setPageLoading } = useUIStore()

  // Main state
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedDeal, setEditedDeal] = useState({})

  const [showActions, setShowActions] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState('overview')

  // Communications state
  const [communications, setCommunications] = useState([])
  const [showAddComm, setShowAddComm] = useState(false)
  const next3DaysISO = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [newComm, setNewComm] = useState({
    type: 'email',
    direction: 'outbound',
    subject: '',
    summary: '',
    outcome: 'neutral',
    nextAction: '',
    followUpDate: next3DaysISO, // pre-fill valid date
  })
  const [commErrors, setCommErrors] = useState({})

  // Stage progression modal
  const [showStageModal, setShowStageModal] = useState(false)
  const [selectedStage, setSelectedStage] = useState(null)
  const [stageNotes, setStageNotes] = useState('')

  // Stages
  const stages = [
    { id: 'pitched', name: 'Pitched', color: '#8B5CF6', icon: Target },
    { id: 'in_talks', name: 'In Talks', color: '#3B82F6', icon: MessageSquare },
    { id: 'negotiating', name: 'Negotiating', color: '#06B6D4', icon: Users },
    { id: 'live', name: 'Live', color: '#F59E0B', icon: Activity },
    { id: 'completed', name: 'Completed', color: '#10B981', icon: CheckCircle },
    { id: 'paid', name: 'Paid', color: '#22C55E', icon: DollarSign },
    { id: 'cancelled', name: 'Cancelled', color: '#EF4444', icon: X },
    { id: 'rejected', name: 'Rejected', color: '#94A3B8', icon: X },
  ]

  const validTransitions = {
    pitched: ['in_talks', 'rejected', 'cancelled'],
    in_talks: ['negotiating', 'rejected', 'cancelled'],
    negotiating: ['live', 'rejected', 'cancelled'],
    live: ['completed', 'cancelled'],
    completed: ['paid', 'cancelled'],
    paid: [],
    cancelled: [],
    rejected: [],
  }

  const isValidTransition = (fromStage, toStage) =>
    validTransitions[fromStage]?.includes(toStage) || false

  // Helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0)

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const sanitizeNumber = (v, fallback = 0) => {
    const n = typeof v === 'string' ? Number(v.trim() === '' ? NaN : v) : Number(v)
    return Number.isFinite(n) ? n : fallback
  }

  const ensureDealValueObject = (dv) => {
    // Handle null, undefined, or any falsy value
    if (!dv) {
      return {
        currency: 'INR',
        amount: 0,
        paymentTerms: '50_50',
        gstApplicable: false,
        tdsApplicable: false,
        finalAmount: 0,
      }
    }

    // If dv is already an object, sanitize its fields
    if (typeof dv === 'object' && !Array.isArray(dv)) {
      const amount = sanitizeNumber(dv.amount, 0)
      const finalAmount = sanitizeNumber(dv.finalAmount ?? amount, amount)
      return {
        currency: dv.currency || 'INR',
        amount,
        paymentTerms: dv.paymentTerms || '50_50',
        gstApplicable: Boolean(dv.gstApplicable),
        tdsApplicable: Boolean(dv.tdsApplicable),
        finalAmount,
      }
    }

    // If it's a number or string, convert to object
    const amount = sanitizeNumber(dv, 0)
    return {
      currency: 'INR',
      amount,
      paymentTerms: '50_50',
      gstApplicable: false,
      tdsApplicable: false,
      finalAmount: amount,
    }
  }

  const getStageInfo = (stageId) => stages.find((s) => s.id === stageId) || stages[0]

  const calculateDealHealth = () => {
    if (!deal) return 0
    let score = 100
    const now = new Date()
    if (deal.timeline?.contentDeadline && new Date(deal.timeline.contentDeadline) < now) score -= 30
    if (
      deal.timeline?.paymentDueDate &&
      new Date(deal.timeline.paymentDueDate) < now &&
      deal.stage !== 'paid'
    )
      score -= 20
    const pendingDeliverables =
      deal.deliverables?.filter((d) => d.status !== 'completed').length || 0
    score -= pendingDeliverables * 5
    return Math.max(0, Math.min(100, score))
  }

  const currentStage = deal ? getStageInfo(deal.stage) : null
  const dealHealth = calculateDealHealth()

  // Styles
  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh' },
    header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 2rem' },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#475569',
      fontSize: '0.875rem',
      cursor: 'pointer',
    },
    titleSection: { flex: 1, margin: '0 2rem' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' },
    subtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    actions: { display: 'flex', gap: '0.75rem', position: 'relative' },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      transition: '0.2s',
    },
    primaryButton: { background: '#6366f1', color: '#fff' },
    secondaryButton: { background: '#fff', color: '#475569', border: '1px solid #e2e8f0' },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 50,
      minWidth: 200,
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 1rem',
      fontSize: '0.875rem',
      color: '#475569',
      cursor: 'pointer',
    },

    stageProgress: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 0',
      overflowX: 'auto',
    },
    stageItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: '0.2s',
    },
    stageActive: { background: currentStage?.color || '#8B5CF6', color: '#fff' },
    stageInactive: { background: '#f1f5f9', color: '#64748b' },

    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    statCard: {
      background: '#fff',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem',
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    content: {
      display: 'flex',
      gap: '1.5rem',
      padding: '1.5rem',
      maxWidth: 1400,
      margin: '0 auto',
    },
    mainColumn: { flex: '1 1 65%' },
    sideColumn: { flex: '1 1 35%' },

    card: {
      background: '#fff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      marginBottom: '1.5rem',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '1.25rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cardContent: { padding: '1.25rem' },

    tabs: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0 1.25rem',
      borderBottom: '1px solid #e2e8f0',
    },
    tab: {
      padding: '0.875rem 0',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
    },
    tabActive: { color: '#6366f1', borderBottomColor: '#6366f1' },

    field: { marginBottom: '1rem' },
    fieldLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: 500,
      textTransform: 'uppercase',
      marginBottom: '0.25rem',
    },
    fieldValue: { fontSize: '0.9375rem', color: '#0f172a' },
    input: {
      width: '100%',
      padding: '0.625rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '0.9375rem',
    },
    textarea: {
      width: '100%',
      padding: '0.625rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '0.9375rem',
      minHeight: 100,
      resize: 'vertical',
    },

    communicationItem: { padding: '1rem', borderLeft: '3px solid #e2e8f0', marginBottom: '1rem' },

    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      gap: '1rem',
    },
    spinner: {
      width: 40,
      height: 40,
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      gap: '1rem',
    },

    errorText: { color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' },
  }

  // Fetch deal data
  useEffect(() => {
    fetchDeal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId])

  const fetchDeal = async () => {
    try {
      setLoading(true)
      const response = await dealsAPI.getDeal(dealId)
      if (response?.data) {
        const dealData = response.data.data || response.data
        // Ensure dealValue is an object on load (prevents controlled input NaN flip)
        const normalized = {
          ...dealData,
          dealValue: ensureDealValueObject(dealData.dealValue),
        }
        setDeal(normalized)
        // Create a deep copy for editing
        setEditedDeal(JSON.parse(JSON.stringify(normalized)))
        fetchCommunications()
      }
    } catch (error) {
      toast.error('Failed to load deal details')
      navigate('/deals')
    } finally {
      setLoading(false)
    }
  }

  const fetchCommunications = async () => {
    try {
      const response = await dealsAPI.getCommunications(dealId)
      if (response?.data) setCommunications(response.data.communications || [])
    } catch {
      // silent
    }
  }

  // Handle entering edit mode
  const handleEditMode = () => {
    // Make a fresh deep copy of the current deal state
    setEditedDeal(JSON.parse(JSON.stringify(deal)))
    setEditMode(true)
  }

  // Handle canceling edit
  const handleCancel = () => {
    // Reset to original deal data
    setEditedDeal(JSON.parse(JSON.stringify(deal)))
    setEditMode(false)
  }

  // Save (ensures dealValue object + sanitized numbers)
  const handleSave = async () => {
    try {
      setUpdating(true)

      // Ensure dealValue is always an object
      const safeDealValue = ensureDealValueObject(editedDeal.dealValue)

      // Merge edited fields with original deal to ensure no data is lost
      const updateData = {
        title: editedDeal.title || deal.title,
        brand: {
          ...deal.brand, // Start with original brand data
          ...editedDeal.brand, // Override with edited values
        },
        platform: editedDeal.platform || deal.platform,
        dealValue: safeDealValue,
        timeline: editedDeal.timeline || deal.timeline || {},
        campaignRequirements: editedDeal.campaignRequirements || deal.campaignRequirements || {},
        internalNotes:
          editedDeal.internalNotes !== undefined ? editedDeal.internalNotes : deal.internalNotes,
        tags: editedDeal.tags || deal.tags || [],
      }

      console.log('Sending update:', updateData) // Debug log

      const response = await dealsAPI.updateDeal(dealId, updateData)

      if (response?.data) {
        // Update local state with the response data
        const updatedDeal = response.data.data || response.data
        const normalized = {
          ...updatedDeal,
          dealValue: ensureDealValueObject(updatedDeal.dealValue),
        }
        setDeal(normalized)
        setEditedDeal(normalized)
        setEditMode(false)
        // toast.success('Deal updated');
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update deal')
    } finally {
      setUpdating(false)
    }
  }

  // Stage change
  const handleStageChange = async () => {
    if (!selectedStage) return
    try {
      setUpdating(true)
      await dealsAPI.updateDealStage(dealId, selectedStage, stageNotes)
      setDeal((prev) => ({ ...prev, stage: selectedStage }))
      setShowStageModal(false)
      setSelectedStage(null)
      setStageNotes('')
      // toast.success('Deal stage updated');
      fetchDeal()
    } catch {
      toast.error('Failed to update stage')
    } finally {
      setUpdating(false)
    }
  }

  // Quick actions (if your API supports these)
  const handleQuickAction = async (action) => {
    try {
      setUpdating(true)
      switch (action) {
        case 'duplicate':
          await dealsAPI.performQuickAction(dealId, 'duplicate')
          // toast.success('Deal duplicated');
          navigate('/deals')
          break
        case 'convert_to_template':
          await dealsAPI.performQuickAction(dealId, 'convert_to_template')
          // toast.success('Template created');
          break
        case 'send_reminder': {
          const payload = {
            subject: `Follow-up: ${deal.title}`,
            message: 'Following up on our discussion',
            followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          }
          await dealsAPI.performQuickAction(dealId, 'send_reminder', payload)
          //  toast.success('Reminder sent');
          fetchCommunications()
          break
        }
        default:
          break
      }
    } catch {
      toast.error(`Action failed`)
    } finally {
      setUpdating(false)
      setShowActions(false)
    }
  }

  // Communications validation
  const validateComm = (c) => {
    const errs = {}
    if (!c.summary || c.summary.trim().length < 5)
      errs.summary = 'Summary must be at least 5 characters'
    if (!c.nextAction || !c.nextAction.trim()) errs.nextAction = 'Next action is required'
    if (!c.followUpDate || isNaN(new Date(c.followUpDate).getTime()))
      errs.followUpDate = 'Follow-up date must be valid'
    return errs
  }

  const handleAddCommunication = async () => {
    const payload = {
      type: newComm.type,
      direction: newComm.direction,
      subject: (newComm.subject || '').trim(),
      summary: (newComm.summary || '').trim(),
      outcome: newComm.outcome,
      nextAction: (newComm.nextAction || '').trim(),
      followUpDate: newComm.followUpDate ? new Date(newComm.followUpDate).toISOString() : '',
    }

    const errs = validateComm(payload)
    setCommErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      setUpdating(true)
      await dealsAPI.addCommunication(dealId, payload)
      setNewComm({
        type: 'email',
        direction: 'outbound',
        subject: '',
        summary: '',
        outcome: 'neutral',
        nextAction: '',
        followUpDate: next3DaysISO,
      })
      setShowAddComm(false)
      // toast.success('Communication added');
      fetchCommunications()
    } catch {
      toast.error('Failed to add communication')
    } finally {
      setUpdating(false)
    }
  }

  // Deliverables
  const handleUpdateDeliverable = async (deliverableId, status, additionalData = {}) => {
    try {
      setUpdating(true)
      await dealsAPI.updateDeliverable(dealId, deliverableId, { status, ...additionalData })
      // toast.success('Deliverable updated');
      fetchDeal()
    } catch {
      toast.error('Failed to update deliverable')
    } finally {
      setUpdating(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <span>Loading deal details...</span>
        <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!deal) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <h2>Deal not found</h2>
        <button onClick={() => navigate('/deals')} style={styles.button}>
          Back to Deals
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button style={styles.backButton} onClick={() => navigate('/deals')}>
            <ArrowLeft size={18} /> Back
          </button>

          <div style={styles.titleSection}>
            {editMode ? (
              <input
                type="text"
                value={editedDeal.title || ''}
                onChange={(e) => setEditedDeal((prev) => ({ ...prev, title: e.target.value }))}
                style={{ ...styles.input, fontSize: '1.75rem', fontWeight: 700 }}
              />
            ) : (
              <h1 style={styles.title}>{deal.title}</h1>
            )}
            <div style={styles.subtitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building size={14} /> {deal.brand?.name || 'No brand'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Hash size={14} /> {deal.dealId || deal._id}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} /> Created {formatDate(deal.createdAt)}
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            {editMode ? (
              <>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleCancel}
                  disabled={updating}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={handleSave}
                  disabled={updating}
                >
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleEditMode}
                >
                  <Edit2 size={16} /> Edit
                </button>

                {showActions && (
                  <div style={styles.dropdown}>
                    <div
                      className="dropdown-item"
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('duplicate')}
                    >
                      <Copy size={16} /> Duplicate Deal
                    </div>
                    <div
                      className="dropdown-item"
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('convert_to_template')}
                    >
                      <FileText size={16} /> Convert to Template
                    </div>
                    <div
                      className="dropdown-item"
                      style={styles.dropdownItem}
                      onClick={() => handleQuickAction('send_reminder')}
                    >
                      <Send size={16} /> Send Reminder
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stage progress */}
        <div style={styles.stageProgress}>
          {stages
            .filter((s) => !['cancelled', 'rejected'].includes(s.id))
            .map((stage) => {
              const StageIcon = stage.icon
              const isActive = deal.stage === stage.id
              const isValidNext = isValidTransition(deal.stage, stage.id)
              const isPast =
                stages.findIndex((s) => s.id === deal.stage) >
                stages.findIndex((s) => s.id === stage.id)
              return (
                <div
                  key={stage.id}
                  style={{
                    ...styles.stageItem,
                    ...(isActive ? styles.stageActive : styles.stageInactive),
                    opacity: !isActive && !isValidNext && !isPast ? 0.4 : 1,
                    cursor: isValidNext || isActive ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    if (!editMode && isValidNext) {
                      setSelectedStage(stage.id)
                      setShowStageModal(true)
                    } else if (!isValidNext && !isActive && !isPast) {
                      toast.error(`Cannot transition from ${deal.stage} to ${stage.id}`)
                    }
                  }}
                >
                  <StageIcon size={14} /> {stage.name}
                </div>
              )
            })}
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Final Amount</div>
            <div style={styles.statValue}>
              <IndianRupee size={18} />
              {formatCurrency(deal.dealValue?.finalAmount)}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Platform</div>
            <div style={styles.statValue}>
              <Globe size={18} />
              {deal.platform || 'Not set'}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Priority</div>
            <div style={styles.statValue}>
              <Zap size={18} />
              {deal.priority || 'Medium'}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Health Score</div>
            <div style={styles.statValue}>{dealHealth}%</div>
            <div
              style={{
                height: 6,
                background: '#e2e8f0',
                borderRadius: 3,
                overflow: 'hidden',
                marginTop: '0.5rem',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${dealHealth}%`,
                  background: dealHealth > 70 ? '#10b981' : dealHealth > 40 ? '#f59e0b' : '#ef4444',
                  transition: 'width .3s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.mainColumn}>
          {/* Tabs (documents removed) */}
          <div style={styles.card}>
            <div style={styles.tabs}>
              {['overview', 'deliverables', 'communications', 'timeline'].map((tab) => (
                <div
                  key={tab}
                  style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))}
            </div>

            <div style={styles.cardContent}>
              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Campaign Requirements</div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.campaignRequirements?.brief || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({
                            ...prev,
                            campaignRequirements: {
                              ...prev.campaignRequirements,
                              brief: e.target.value,
                            },
                          }))
                        }
                        style={styles.textarea}
                        placeholder="Enter campaign brief..."
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {deal.campaignRequirements?.brief || 'No requirements specified'}
                      </div>
                    )}
                  </div>

                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Internal Notes</div>
                    {editMode ? (
                      <textarea
                        value={editedDeal.internalNotes || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({ ...prev, internalNotes: e.target.value }))
                        }
                        style={styles.textarea}
                        placeholder="Add internal notes..."
                      />
                    ) : (
                      <div style={styles.fieldValue}>{deal.internalNotes || 'No notes added'}</div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>Payment Terms</div>
                      <div style={styles.fieldValue}>{deal.dealValue?.paymentTerms || '50_50'}</div>
                    </div>
                    <div style={styles.field}>
                      <div style={styles.fieldLabel}>Source</div>
                      <div style={styles.fieldValue}>{deal.source || 'direct_outreach'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {activeTab === 'deliverables' && (
                <div>
                  {(deal.deliverables || []).map((deliverable, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{deliverable.type}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          Qty: {deliverable.quantity}{' '}
                          {deliverable.description ? `| ${deliverable.description}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={deliverable.status}
                          onChange={(e) => {
                            const status = e.target.value
                            if (status === 'submitted') {
                              const url = window.prompt('Enter submission URL:')
                              if (url)
                                handleUpdateDeliverable(deliverable._id, status, {
                                  submissionUrl: url,
                                })
                            } else if (status === 'revision_required') {
                              const notes = window.prompt('Enter revision notes:')
                              if (notes)
                                handleUpdateDeliverable(deliverable._id, status, {
                                  revisionNotes: notes,
                                })
                            } else {
                              handleUpdateDeliverable(deliverable._id, status)
                            }
                          }}
                          style={{ ...styles.input, width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="revision_required">Revision Required</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {(!deal.deliverables || deal.deliverables.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No deliverables added
                    </div>
                  )}
                </div>
              )}

              {/* Communications */}
              {activeTab === 'communications' && (
                <div>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton, marginBottom: '1rem' }}
                    onClick={() => {
                      setCommErrors({})
                      setShowAddComm(true)
                    }}
                  >
                    <Plus size={16} /> Add Communication
                  </button>

                  {communications.map((comm, index) => (
                    <div key={index} style={styles.communicationItem}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{comm.subject || comm.type}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatDate(comm.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {comm.summary}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.75rem',
                          color: '#64748b',
                        }}
                      >
                        <span>{comm.type}</span>
                        <span>{comm.direction}</span>
                        <span>{comm.outcome}</span>
                      </div>
                    </div>
                  ))}

                  {communications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No communications recorded
                    </div>
                  )}
                </div>
              )}

              {/* Timeline */}
              {activeTab === 'timeline' && (
                <div>
                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Response Deadline</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.responseDeadline?.split?.('T')?.[0] || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({
                            ...prev,
                            timeline: {
                              ...prev.timeline,
                              responseDeadline: e.target.value,
                            },
                          }))
                        }
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.responseDeadline)}
                      </div>
                    )}
                  </div>

                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Content Deadline</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.contentDeadline?.split?.('T')?.[0] || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({
                            ...prev,
                            timeline: {
                              ...prev.timeline,
                              contentDeadline: e.target.value,
                            },
                          }))
                        }
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.contentDeadline)}
                      </div>
                    )}
                  </div>

                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Go Live Date</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.goLiveDate?.split?.('T')?.[0] || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({
                            ...prev,
                            timeline: {
                              ...prev.timeline,
                              goLiveDate: e.target.value,
                            },
                          }))
                        }
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>{formatDate(deal.timeline?.goLiveDate)}</div>
                    )}
                  </div>

                  <div style={styles.field}>
                    <div style={styles.fieldLabel}>Payment Due Date</div>
                    {editMode ? (
                      <input
                        type="date"
                        value={editedDeal.timeline?.paymentDueDate?.split?.('T')?.[0] || ''}
                        onChange={(e) =>
                          setEditedDeal((prev) => ({
                            ...prev,
                            timeline: {
                              ...prev.timeline,
                              paymentDueDate: e.target.value,
                            },
                          }))
                        }
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.fieldValue}>
                        {formatDate(deal.timeline?.paymentDueDate)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div style={styles.sideColumn}>
          {/* Brand Details */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Building size={18} /> Brand Details
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Brand Name</div>
                {editMode ? (
                  <input
                    value={editedDeal.brand?.name || ''}
                    onChange={(e) =>
                      setEditedDeal((prev) => ({
                        ...prev,
                        brand: {
                          ...deal.brand, // Preserve original brand data
                          ...prev.brand, // Keep any previous edits
                          name: e.target.value, // Update the name
                        },
                      }))
                    }
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>{deal.brand?.name || 'Not specified'}</div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Contact Person</div>
                {editMode ? (
                  <input
                    value={editedDeal.brand?.contactPerson?.name || ''}
                    onChange={(e) =>
                      setEditedDeal((prev) => ({
                        ...prev,
                        brand: {
                          ...deal.brand,
                          ...prev.brand,
                          contactPerson: {
                            ...deal.brand?.contactPerson,
                            ...prev.brand?.contactPerson,
                            name: e.target.value,
                          },
                        },
                      }))
                    }
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>
                    {deal.brand?.contactPerson?.name || 'Not specified'}
                  </div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Email</div>
                <div style={styles.fieldValue}>
                  {deal.brand?.contactPerson?.email || 'Not specified'}
                </div>
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Phone</div>
                <div style={styles.fieldValue}>
                  {deal.brand?.contactPerson?.phone || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <CreditCard size={18} /> Payment Details
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Deal Value</div>
                {editMode ? (
                  <input
                    type="number"
                    value={editedDeal.dealValue?.amount ?? 0}
                    onChange={(e) => {
                      const newAmount = sanitizeNumber(e.target.value, 0)
                      const currentDealValue = ensureDealValueObject(editedDeal.dealValue)
                      const newFinalAmount = sanitizeNumber(
                        (currentDealValue.gstApplicable ? newAmount * 1.18 : newAmount) -
                          (currentDealValue.tdsApplicable ? newAmount * 0.1 : 0),
                        newAmount
                      )

                      setEditedDeal((prev) => ({
                        ...prev,
                        dealValue: {
                          ...currentDealValue,
                          amount: newAmount,
                          finalAmount: newFinalAmount,
                        },
                      }))
                    }}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.fieldValue}>{formatCurrency(deal.dealValue?.amount)}</div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>GST Applicable</div>
                {editMode ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(editedDeal.dealValue?.gstApplicable)}
                      onChange={(e) => {
                        const currentDealValue = ensureDealValueObject(editedDeal.dealValue)
                        const baseAmount = currentDealValue.amount
                        const newGstApplicable = e.target.checked
                        const newFinalAmount = sanitizeNumber(
                          (newGstApplicable ? baseAmount * 1.18 : baseAmount) -
                            (currentDealValue.tdsApplicable ? baseAmount * 0.1 : 0),
                          baseAmount
                        )

                        setEditedDeal((prev) => ({
                          ...prev,
                          dealValue: {
                            ...currentDealValue,
                            gstApplicable: newGstApplicable,
                            finalAmount: newFinalAmount,
                          },
                        }))
                      }}
                    />
                    <span>{editedDeal.dealValue?.gstApplicable ? 'Yes (18%)' : 'No'}</span>
                  </label>
                ) : (
                  <div style={styles.fieldValue}>
                    {deal.dealValue?.gstApplicable ? 'Yes (18%)' : 'No'}
                  </div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>TDS Applicable</div>
                {editMode ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(editedDeal.dealValue?.tdsApplicable)}
                      onChange={(e) => {
                        const currentDealValue = ensureDealValueObject(editedDeal.dealValue)
                        const baseAmount = currentDealValue.amount
                        const newTdsApplicable = e.target.checked
                        const newFinalAmount = sanitizeNumber(
                          (currentDealValue.gstApplicable ? baseAmount * 1.18 : baseAmount) -
                            (newTdsApplicable ? baseAmount * 0.1 : 0),
                          baseAmount
                        )

                        setEditedDeal((prev) => ({
                          ...prev,
                          dealValue: {
                            ...currentDealValue,
                            tdsApplicable: newTdsApplicable,
                            finalAmount: newFinalAmount,
                          },
                        }))
                      }}
                    />
                    <span>{editedDeal.dealValue?.tdsApplicable ? 'Yes (10%)' : 'No'}</span>
                  </label>
                ) : (
                  <div style={styles.fieldValue}>
                    {deal.dealValue?.tdsApplicable ? 'Yes (10%)' : 'No'}
                  </div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Payment Terms</div>
                {editMode ? (
                  <select
                    value={editedDeal.dealValue?.paymentTerms || '50_50'}
                    onChange={(e) =>
                      setEditedDeal((prev) => ({
                        ...prev,
                        dealValue: {
                          ...ensureDealValueObject(prev.dealValue),
                          paymentTerms: e.target.value,
                        },
                      }))
                    }
                    style={styles.input}
                  >
                    <option value="full_advance">100% Advance</option>
                    <option value="50_50">50% Advance, 50% on Completion</option>
                    <option value="30_70">30% Advance, 70% on Completion</option>
                    <option value="on_delivery">100% on Delivery</option>
                    <option value="net_30">Net 30 Days</option>
                    <option value="net_15">Net 15 Days</option>
                    <option value="custom">Custom Terms</option>
                  </select>
                ) : (
                  <div style={styles.fieldValue}>{deal.dealValue?.paymentTerms || '50_50'}</div>
                )}
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Final Amount (After GST/TDS)</div>
                <div style={styles.fieldValue}>
                  {(() => {
                    const base = sanitizeNumber(
                      editMode ? editedDeal.dealValue?.amount : deal.dealValue?.amount,
                      0
                    )
                    const gst = (
                      editMode ? editedDeal.dealValue?.gstApplicable : deal.dealValue?.gstApplicable
                    )
                      ? base * 0.18
                      : 0
                    const tds = (
                      editMode ? editedDeal.dealValue?.tdsApplicable : deal.dealValue?.tdsApplicable
                    )
                      ? base * 0.1
                      : 0
                    return formatCurrency(base + gst - tds)
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Change Modal */}
      {showStageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: 500,
              width: '90%',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Update Deal Stage
            </h3>
            <div style={styles.field}>
              <div style={styles.fieldLabel}>New Stage</div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: getStageInfo(selectedStage).color,
                  color: '#fff',
                }}
              >
                {getStageInfo(selectedStage).name}
              </div>
            </div>
            <div style={styles.field}>
              <div style={styles.fieldLabel}>Notes (Optional)</div>
              <textarea
                value={stageNotes}
                onChange={(e) => setStageNotes(e.target.value)}
                style={styles.textarea}
                placeholder="Add notes about this stage change..."
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => {
                  setShowStageModal(false)
                  setSelectedStage(null)
                  setStageNotes('')
                }}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleStageChange}
                disabled={updating}
              >
                Update Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Communication Modal */}
      {showAddComm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: 560,
              width: '92%',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Add Communication
            </h3>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Type</div>
              <select
                value={newComm.type}
                onChange={(e) => setNewComm({ ...newComm, type: e.target.value })}
                style={styles.input}
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram_dm">Instagram DM</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Direction</div>
              <select
                value={newComm.direction}
                onChange={(e) => setNewComm({ ...newComm, direction: e.target.value })}
                style={styles.input}
              >
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Subject</div>
              <input
                value={newComm.subject}
                onChange={(e) => setNewComm({ ...newComm, subject: e.target.value })}
                style={styles.input}
                placeholder="Subject..."
              />
            </div>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Summary</div>
              <textarea
                value={newComm.summary}
                onChange={(e) => setNewComm({ ...newComm, summary: e.target.value })}
                style={styles.textarea}
                placeholder="At least 5 characters..."
              />
              {commErrors.summary && <div style={styles.errorText}>{commErrors.summary}</div>}
            </div>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Next Action</div>
              <input
                value={newComm.nextAction}
                onChange={(e) => setNewComm({ ...newComm, nextAction: e.target.value })}
                style={styles.input}
                placeholder="e.g., Send draft, share rates"
              />
              {commErrors.nextAction && <div style={styles.errorText}>{commErrors.nextAction}</div>}
            </div>

            <div style={styles.field}>
              <div style={styles.fieldLabel}>Follow-up Date</div>
              <input
                type="date"
                value={newComm.followUpDate}
                onChange={(e) => setNewComm({ ...newComm, followUpDate: e.target.value })}
                style={styles.input}
              />
              {commErrors.followUpDate && (
                <div style={styles.errorText}>{commErrors.followUpDate}</div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.25rem',
              }}
            >
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setShowAddComm(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleAddCommunication}
                disabled={updating}
              >
                Add Communication
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default DealDetailsPage

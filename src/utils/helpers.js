export const calculatePasswordStrength = (password) => {
  if (!password) return 0
  let strength = 0
  if (password.length >= 8) strength++
  if (password.match(/[a-z]/)) strength++
  if (password.match(/[A-Z]/)) strength++
  if (password.match(/[0-9]/)) strength++
  if (password.match(/[^a-zA-Z0-9]/)) strength++
  return (strength / 5) * 100
}

// Deals operations
export const checkOverdueStatus = (deal) => {
  const now = new Date()
  const status = {
    isOverdue: false,
    overdueType: null,
    daysOverdue: 0,
    urgency: 'normal',
  }

  // Check delivery overdue (for 'live' stage)
  if (deal.timeline?.goLiveDate) {
    const goLiveDate = new Date(deal.timeline.goLiveDate)
    if (goLiveDate < now && deal.stage !== 'completed' && deal.stage !== 'paid') {
      status.isOverdue = true
      status.overdueType = 'delivery'
      status.daysOverdue = Math.ceil((now - goLiveDate) / (1000 * 60 * 60 * 24))
      status.urgency = status.daysOverdue > 7 ? 'critical' : 'warning'
    }
  }

  // Check payment overdue (for 'completed' stage)
  if (deal.timeline?.paymentDueDate) {
    const paymentDueDate = new Date(deal.timeline.paymentDueDate)
    if (paymentDueDate < now && deal.stage !== 'paid') {
      status.isOverdue = true
      status.overdueType = 'payment'
      status.daysOverdue = Math.ceil((now - paymentDueDate) / (1000 * 60 * 60 * 24))
      status.urgency = 'critical'
    }
  }

  // Check content deadline (for 'live' stage)
  if (deal.timeline?.contentDeadline) {
    const contentDeadline = new Date(deal.timeline.contentDeadline)
    const daysUntil = Math.ceil((contentDeadline - now) / (1000 * 60 * 60 * 24))
    if (daysUntil <= 3 && daysUntil > 0 && deal.stage === 'live') {
      status.urgency = 'warning'
    }
  }

  // Check response deadline (for 'pitched' stage)
  if (deal.timeline?.responseDeadline && deal.stage === 'pitched') {
    const responseDeadline = new Date(deal.timeline.responseDeadline)
    if (responseDeadline < now) {
      status.isOverdue = true
      status.overdueType = 'response'
      status.daysOverdue = Math.ceil((now - responseDeadline) / (1000 * 60 * 60 * 24))
      status.urgency = status.daysOverdue > 5 ? 'warning' : 'normal'
    }
  }

  return status
}
export const formatDeliverable = (deliverable) => {
  if (typeof deliverable === 'string') return deliverable

  if (deliverable.type) {
    const formatted = deliverable.type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    if (deliverable.quantity > 1) {
      return `${formatted} (${deliverable.quantity})`
    }
    return formatted
  }

  return 'Deliverable'
}
export const calculateDaysInStage = (createdAt) => {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
export const getStageValue = (stageId, deals) => {
  const stageDeals = deals.filter((deal) => deal.stage === stageId)
  return stageDeals.reduce((sum, deal) => {
    const amount = deal.dealValue?.amount || deal.dealValue?.finalAmount || 0
    return sum + amount
  }, 0)
}
export const checkCondition = (cond, data) => {
  if (!cond) return true
  const val = data?.[cond.field]?.value === cond.value.toLowerCase()
  return val
}
export const validateSection = (formState, sectionFields) => {
  const result = { formValues: { ...formState }, hasError: false }

  sectionFields.forEach((field) => {
    const key = field.name
    const value = formState[key]?.value ?? ''

    result.formValues[key] = {
      value,
      error: '',
    }

    if (field.showIf) {
      const { field: depField, value: expectedValue, operation } = field.showIf
      const depFieldValue = formState[depField]?.value

      let isVisible = true
      if (operation === 'equals') {
        isVisible = depFieldValue === expectedValue
      } else if (operation === 'notEquals') {
        isVisible = depFieldValue !== expectedValue
      }

      if (!isVisible) return // skip validation for hidden field
    }

    // Field Validations
    if (field.isRequired && (!value || value.trim() === '')) {
      result.formValues[key].error = `${field.label || key} is required`
      result.hasError = true
    }
  })

  return result
}

// General
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}
export const formatDate = (date) => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
export const calculateAnalytics = (deals, totalDealsCnt) => {
  /*
        DealsConversion Rate Calculation:
        totalDeals = pitched + in_talks + negotiating + live + completed + paid
        convertedDeals = live + completed + paid

        conversionRate = (convertedDeals / totalDeals) x 100
      */
  const { completedDealsCnt, convertedDealsCnt, overDueDealsCnt } = deals.reduce(
    (acc, deal) => {
      // Completed Deals
      if (deal.stage === 'completed' || deal.stage === 'paid') acc.completedDealsCnt++

      // Converted Deals
      if (['live', 'completed', 'paid'].includes(deal.stage)) acc.convertedDealsCnt++

      // Overdue Deals
      if (checkOverdueStatus(deal).isOverdue) acc.overDueDealsCnt++

      return acc
    },
    { completedDealsCnt: 0, convertedDealsCnt: 0, overDueDealsCnt: 0 }
  )

  const conversionRatePercentage = (
    totalDealsCnt > 0 ? (convertedDealsCnt / totalDealsCnt) * 100 : 0
  ).toFixed(2)

  return { completedDealsCnt, conversionRatePercentage, overDueDealsCnt }
}
export const formatNumberWithCommas = (value) => {
  if (value === null || value === undefined) return ''
  const [integer, decimal] = value.toString().split('.')
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
}

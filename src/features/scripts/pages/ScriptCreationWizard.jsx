import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Wand2,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Target,
  Palette,
  Hash,
  Link2,
  Play,
  Shield,
  AlertTriangle,
  Loader2,
  XCircle,
  Mic,
} from 'lucide-react'
import { useScriptsStore } from '../../../store'

const ScriptCreationWizard = () => {
  // Mock navigation functions since we can't import react-router-dom
  const navigate = (path) => {
    console.log('Navigate to:', path)
    // In real app this would use useNavigate from react-router-dom
  }

  const navigateBack = () => {
    console.log('Navigate back to scripts')
    // In real app: navigate('/scripts');
  }

  // Mock store functions
  // const createTextScript = async (data) => {
  //   console.log('Creating text script:', data)
  //   return { success: true, script: { id: 'mock-id' } }
  // }
  const { createTextScript } = useScriptsStore((state) => ({
    createTextScript: state.createTextScript,
  }))

  const createFileScript = async (data, file) => {
    console.log('Creating file script:', data, file)
    return { success: true, script: { id: 'mock-id' } }
  }

  const fetchScriptMetadata = async () => console.log('Fetching metadata')
  const fetchAvailableDeals = async () => console.log('Fetching deals')

  // Mock toast function
  const toast = {
    success: (message) => console.log('Success:', message),
    error: (message) => console.log('Error:', message),
    warning: (message) => console.log('Warning:', message),
  }

  // Mock store state
  const isCreating = false
  const isUploading = false
  const uploadProgress = 0
  const scriptMetadata = null
  const availableDeals = []

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Upload limits state
  const [uploadLimits, setUploadLimits] = useState({
    maxFileSize: 25 * 1024 * 1024, // 25MB
    allowedFileTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    maxConcurrentUploads: 1,
    maxFilesPerScript: 1,
  })
  // const [isLoadingLimits, setIsLoadingLimits] = useState(false)

  // Generation status tracking
  const [generationStatus, setGenerationStatus] = useState(null)
  const [isPollingStatus, setIsPollingStatus] = useState(false)
  const [createdScriptId, setCreatedScriptId] = useState(null)
  const pollingIntervalRef = useRef(null)

  // Storage usage state
  const [storageUsage, setStorageUsage] = useState({
    used: 15 * 1024 * 1024, // 15MB used
    total: 100 * 1024 * 1024, // 100MB total
    percentage: 15,
  })

  // Enhanced validation state
  const [fileValidation, setFileValidation] = useState({
    isValid: true,
    message: '',
    type: 'info',
  })

  // Form data - removed video-related fields
  const [formData, setFormData] = useState({
    // Step 1: Input Method
    inputMethod: 'text_brief',

    // Step 2: Content Input
    title: '',
    briefText: '',
    uploadedFile: null,

    // Step 3: Configuration
    platform: 'instagram_reel',
    granularityLevel: 'detailed',
    targetDuration: '60_seconds',
    customDuration: '',

    // Step 4: Additional Settings
    creatorStyleNotes: '',
    tags: [],
    notes: '',
    dealId: '',
  })

  // Validation state
  const [errors, setErrors] = useState({})
  const [showLimitsInfo, setShowLimitsInfo] = useState(false)

  // File handling
  const [filePreview, setFilePreview] = useState(null)

  // Platform options
  const platformOptions = [
    {
      value: 'instagram_reel',
      label: 'Instagram Reel',
      duration: '15-90s',
      ratio: '9:16',
      icon: Hash,
    },
    {
      value: 'instagram_post',
      label: 'Instagram Post',
      duration: 'Static',
      ratio: '1:1',
      icon: Hash,
    },
    {
      value: 'instagram_story',
      label: 'Instagram Story',
      duration: '15s',
      ratio: '9:16',
      icon: Hash,
    },
    {
      value: 'youtube_video',
      label: 'YouTube Video',
      duration: 'Up to 60min',
      ratio: '16:9',
      icon: Play,
    },
    {
      value: 'youtube_shorts',
      label: 'YouTube Shorts',
      duration: '60s',
      ratio: '9:16',
      icon: Play,
    },
    {
      value: 'linkedin_video',
      label: 'LinkedIn Video',
      duration: 'Up to 10min',
      ratio: '16:9',
      icon: Link2,
    },
    {
      value: 'linkedin_post',
      label: 'LinkedIn Post',
      duration: 'Static',
      ratio: '1:1',
      icon: Link2,
    },
    {
      value: 'twitter_post',
      label: 'Twitter Post',
      duration: 'Static/Video',
      ratio: 'Various',
      icon: Hash,
    },
    {
      value: 'facebook_reel',
      label: 'Facebook Reel',
      duration: '15-90s',
      ratio: '9:16',
      icon: Hash,
    },
    { value: 'tiktok_video', label: 'TikTok Video', duration: '15-180s', ratio: '9:16', icon: Mic },
  ]

  const durationOptions = [
    { value: '15_seconds', label: '15 seconds' },
    { value: '30_seconds', label: '30 seconds' },
    { value: '60_seconds', label: '1 minute' },
    { value: '90_seconds', label: '1.5 minutes' },
    { value: '3_minutes', label: '3 minutes' },
    { value: '5_minutes', label: '5 minutes' },
    { value: '10_minutes', label: '10 minutes' },
    { value: 'custom', label: 'Custom Duration' },
  ]

  const granularityOptions = [
    { value: 'basic', label: 'Basic', description: 'Main content flow and key points' },
    {
      value: 'detailed',
      label: 'Detailed',
      description: 'Scene-by-scene with camera angles and visuals',
    },
    {
      value: 'comprehensive',
      label: 'Comprehensive',
      description: 'Shot-by-shot with complete production details',
    },
  ]

  // Initialize on mount
  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([fetchScriptMetadata(), fetchAvailableDeals()])
    }

    initializeDashboard()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Start polling for generation status
  const startGenerationStatusPolling = useCallback((scriptId) => {
    setCreatedScriptId(scriptId)
    setIsPollingStatus(true)

    // Mock polling - in real app this would call the API
    setTimeout(() => {
      setGenerationStatus({
        status: 'completed',
        message: 'Script generated successfully!',
      })
      setIsPollingStatus(false)
      toast.success('Script generated successfully!')
    }, 3000)
  }, [])

  // Validate file size
  const validateFileSize = (file) => {
    if (!uploadLimits) return { isValid: true }

    const maxSize = uploadLimits.maxFileSize

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      return {
        isValid: false,
        message: `File size exceeds maximum limit of ${maxSizeMB}MB`,
        type: 'error',
      }
    }

    // Check if storage quota would be exceeded
    if (storageUsage.total > 0) {
      const newUsage = storageUsage.used + file.size
      const newPercentage = (newUsage / storageUsage.total) * 100

      if (newPercentage > 95) {
        return {
          isValid: false,
          message: 'This upload would exceed your storage quota',
          type: 'error',
        }
      } else if (newPercentage > 80) {
        return {
          isValid: true,
          message: `Warning: You're using ${Math.round(newPercentage)}% of your storage`,
          type: 'warning',
        }
      }
    }

    return { isValid: true }
  }

  // Enhanced file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = uploadLimits?.allowedFileTypes || [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, DOCX, or TXT files only')
      return
    }

    // Validate file size
    const validation = validateFileSize(file)
    setFileValidation(validation)

    if (!validation.isValid) {
      toast.error(validation.message)
      return
    }

    if (validation.type === 'warning') {
      toast.warning(validation.message)
    }

    setFormData((prev) => ({ ...prev, uploadedFile: file }))
    setFilePreview({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      sizeBytes: file.size,
    })
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      const kb = bytes / 1024
      return `${kb.toFixed(1)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  // Calculate upload percentage for progress display
  const calculateUploadPercentage = (fileSize) => {
    if (!uploadLimits) return 0
    const maxSize = uploadLimits.maxFileSize || 25 * 1024 * 1024
    return Math.min(100, Math.round((fileSize / maxSize) * 100))
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific errors
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Remove uploaded file
  const removeFile = () => {
    setFormData((prev) => ({ ...prev, uploadedFile: null }))
    setFilePreview(null)
    setFileValidation({ isValid: true, message: '', type: 'info' })
  }

  // Add tag
  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      handleInputChange('tags', [...formData.tags, tag])
    } else if (formData.tags.length >= 10) {
      toast.warning('Maximum 10 tags allowed')
    }
  }

  // Remove tag
  const removeTag = (tagIndex) => {
    const newTags = formData.tags.filter((_, index) => index !== tagIndex)
    handleInputChange('tags', newTags)
  }

  // Validate step
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        // Input method validation is just selection
        break

      case 2:
        if (!formData.title?.trim()) {
          newErrors.title = 'Script title is required'
        } else if (formData.title.length > 100) {
          newErrors.title = 'Title must be less than 100 characters'
        }

        if (formData.inputMethod === 'text_brief' && !formData.briefText?.trim()) {
          newErrors.briefText = 'Brief content is required'
        } else if (formData.inputMethod === 'text_brief' && formData.briefText.length < 50) {
          newErrors.briefText = 'Brief should be at least 50 characters for better AI generation'
        }

        if (formData.inputMethod === 'file_upload' && !formData.uploadedFile) {
          newErrors.uploadedFile = 'Please upload a file'
        }
        break

      case 3:
        if (!formData.platform) {
          newErrors.platform = 'Platform is required'
        }
        if (formData.targetDuration === 'custom') {
          if (!formData.customDuration) {
            newErrors.customDuration = 'Custom duration is required'
          } else {
            const duration = parseInt(formData.customDuration)
            if (isNaN(duration) || duration < 5 || duration > 3600) {
              newErrors.customDuration = 'Duration must be between 5 and 3600 seconds'
            }
          }
        }
        break

      case 4:
        // Optional fields, but validate if provided
        if (formData.creatorStyleNotes && formData.creatorStyleNotes.length > 500) {
          newErrors.creatorStyleNotes = 'Style notes must be less than 500 characters'
        }
        if (formData.notes && formData.notes.length > 1000) {
          newErrors.notes = 'Notes must be less than 1000 characters'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigate between steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // TEMP: For testing
  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     inputMethod: 'text_brief',
  //     title: 'CORS in Depth',
  //     briefText:
  //       'Campaign: \nEducate developers on secure cross-domain requests. Audience: Frontend and backend engineers. \nKey Messages: \nCORS extends the Same-Origin Policy, manages simple, preflight, and credentialed requests, and uses headers like Access-Control-Allow-Origin to control access. \nProduct Details: \nBrowser-enforced mechanism for safe resource sharing across domains. \nOutcome: \nDevelopers build secure, API-friendly apps while avoiding common CORS pitfalls.',
  //     uploadedFile: null,
  //     platform: 'linkedin_post',
  //     granularityLevel: 'detailed',
  //     targetDuration: '3_minutes',
  //     customDuration: '',
  //     creatorStyleNotes:
  //       'Personal Style & Tone: Clear, concise, and professional with a friendly touch; practical and actionable insights; prefers structured content with signature elements like bullet points, short paragraphs, and emphasis on key terms; avoids jargon unless necessary; focuses on clarity, relevance, and engagement.',
  //     tags: ['CORS', 'Javascript', 'API'],
  //     notes: 'Keep it simple a 5 year old should understand this.',
  //     dealId: '',
  //   }))
  // }, [])

  // Handle submit
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    try {
      let result

      const baseData = {
        title: formData.title,
        platform: formData.platform,
        granularityLevel: formData.granularityLevel,
        targetDuration: formData.targetDuration,
        creatorStyleNotes: formData.creatorStyleNotes,
        tags: formData.tags,
        notes: formData.notes,
      }

      // Only include customDuration if targetDuration is 'custom' and value exists
      if (formData.targetDuration === 'custom' && formData.customDuration) {
        baseData.customDuration = parseInt(formData.customDuration)
      }

      // Only include dealId if it exists
      if (formData.dealId) {
        baseData.dealId = formData.dealId
      }

      switch (formData.inputMethod) {
        case 'text_brief':
          result = await createTextScript({
            ...baseData,
            briefText: formData.briefText,
          })
          break

        case 'file_upload':
          result = await createFileScript(baseData, formData.uploadedFile)
          break
      }

      if (result.success) {
        toast.success('Script created successfully! AI generation started.')

        // Start polling for generation status
        const scriptId = result.script.id || result.script._id
        startGenerationStatusPolling(scriptId)
      } else {
        toast.error(result.message || 'Failed to create script')
      }
    } catch (error) {
      console.error('Script creation failed:', error)
      toast.error('An error occurred while creating the script')
    }
  }

  const renderStep1 = () => (
    <>
      <h2 className="step-title">Choose Input Method</h2>

      {/* Upload Limits Info */}
      {/* 
        TEMP:
        REASON: No API Built for this in backend
      */}
      {/* {uploadLimits && (
        <div className="upload-limits-bar">
          <div className="limits-header">
            <Shield size={14} />
            <span>Upload Limits</span>
          </div>
          <div className="limits-grid">
            <div className="limit-item">
              <FileText size={12} />
              <span>Documents: {formatFileSize(uploadLimits.maxFileSize)}</span>
            </div>
          </div>
          {storageUsage.total > 0 && (
            <div className="storage-bar">
              <div className="storage-label">
                <span>Storage Usage</span>
                <span>{storageUsage.percentage}%</span>
              </div>
              <div className="storage-progress">
                <div
                  className="storage-fill"
                  style={{
                    width: `${storageUsage.percentage}%`,
                    backgroundColor:
                      storageUsage.percentage > 80
                        ? '#F59E0B'
                        : storageUsage.percentage > 95
                          ? '#EF4444'
                          : '#10B981',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )} */}

      <div className="input-method-grid">
        <div
          className={`input-method-card ${formData.inputMethod === 'text_brief' ? 'selected' : ''}`}
          onClick={() => handleInputChange('inputMethod', 'text_brief')}
        >
          <div className="input-method-icon">
            <FileText size={24} />
          </div>
          <h3 className="input-method-title">Text Brief</h3>
          <p className="input-method-description">
            Write your campaign brief directly and let AI generate the script
          </p>
        </div>

        <div
          className={`input-method-card ${formData.inputMethod === 'file_upload' ? 'selected' : ''}`}
          onClick={() => handleInputChange('inputMethod', 'file_upload')}
        >
          <div className="input-method-icon">
            <Upload size={24} />
          </div>
          <h3 className="input-method-title">File Upload</h3>
          <p className="input-method-description">
            Upload PDF, DOCX, or TXT files with your campaign details
          </p>
          {uploadLimits && (
            <p className="file-limit-hint">Max: {formatFileSize(uploadLimits.maxFileSize)}</p>
          )}
        </div>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <h2 className="step-title">Content Input</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">
            Script Title <span className="required">*</span>
            <span className="character-count">{formData.title.length}/100</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Instagram Reel - Product Launch Campaign"
            maxLength={100}
            className={`form-input ${errors.title ? 'error' : ''}`}
          />
          {errors.title && (
            <span className="error-message">
              <AlertCircle size={12} />
              {errors.title}
            </span>
          )}
        </div>
      </div>

      {formData.inputMethod === 'text_brief' && (
        <div className="form-group">
          <label className="form-label">
            Campaign Brief <span className="required">*</span>
            <span className="character-count">{formData.briefText.length} characters</span>
          </label>
          <textarea
            value={formData.briefText}
            onChange={(e) => handleInputChange('briefText', e.target.value)}
            placeholder="Describe your campaign, target audience, key messages, product details, and desired outcome..."
            className={`form-textarea ${errors.briefText ? 'error' : ''}`}
          />
          {errors.briefText && (
            <span className="error-message">
              <AlertCircle size={12} />
              {errors.briefText}
            </span>
          )}
        </div>
      )}

      {formData.inputMethod === 'file_upload' && (
        <div className="form-group">
          <label className="form-label">
            Upload Document <span className="required">*</span>
            {uploadLimits && (
              <span className="file-limit">Max: {formatFileSize(uploadLimits.maxFileSize)}</span>
            )}
          </label>

          {!filePreview ? (
            <div
              className="file-upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files[0]) {
                  const event = { target: { files } }
                  handleFileUpload(event)
                }
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <Upload size={32} className="upload-icon" />
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">
                PDF, DOCX, TXT (Max{' '}
                {uploadLimits ? formatFileSize(uploadLimits.maxFileSize) : '25MB'})
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden-input"
              />
            </div>
          ) : (
            <div>
              <div className="file-preview">
                <div className="file-info">
                  <FileText size={20} />
                  <div>
                    <div className="file-name">{filePreview.name}</div>
                    <div className="file-size">{filePreview.size}</div>
                  </div>
                </div>
                <button className="remove-file-btn" onClick={removeFile}>
                  <X size={16} />
                </button>
              </div>

              {fileValidation.type === 'warning' && (
                <div className="warning-message">
                  <AlertTriangle size={12} />
                  {fileValidation.message}
                </div>
              )}

              {uploadLimits && filePreview.sizeBytes && (
                <div className="upload-progress-info">
                  <div className="progress-label">
                    Upload size: {calculateUploadPercentage(filePreview.sizeBytes)}% of limit
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${calculateUploadPercentage(filePreview.sizeBytes)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.uploadedFile && (
            <span className="error-message">
              <AlertCircle size={12} />
              {errors.uploadedFile}
            </span>
          )}
        </div>
      )}
    </>
  )

  const renderStep3 = () => (
    <>
      <h2 className="step-title">Platform & Configuration</h2>

      <div className="form-group">
        <label className="form-label">
          <Target size={16} />
          Target Platform <span className="required">*</span>
        </label>
        <div className="platform-grid">
          {platformOptions.map((platform) => {
            const IconComponent = platform.icon
            return (
              <div
                key={platform.value}
                className={`platform-card ${formData.platform === platform.value ? 'selected' : ''}`}
                onClick={() => handleInputChange('platform', platform.value)}
              >
                <div className="platform-icon">
                  <IconComponent size={20} />
                </div>
                <div className="platform-title">{platform.label}</div>
                <div className="platform-meta">
                  {platform.duration} • {platform.ratio}
                </div>
              </div>
            )
          })}
        </div>
        {errors.platform && (
          <span className="error-message">
            <AlertCircle size={12} />
            {errors.platform}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          <Settings size={16} />
          Script Detail Level
        </label>
        <div className="granularity-options">
          {granularityOptions.map((option) => (
            <div
              key={option.value}
              className={`granularity-card ${formData.granularityLevel === option.value ? 'selected' : ''}`}
              onClick={() => handleInputChange('granularityLevel', option.value)}
            >
              <div className="granularity-title">{option.label}</div>
              <div className="granularity-description">{option.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <Clock size={16} />
            Target Duration
          </label>
          <select
            value={formData.targetDuration}
            onChange={(e) => handleInputChange('targetDuration', e.target.value)}
            className="form-select"
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.targetDuration === 'custom' && (
          <div className="form-group">
            <label className="form-label">
              Custom Duration (seconds) <span className="required">*</span>
            </label>
            <input
              type="number"
              value={formData.customDuration}
              onChange={(e) => handleInputChange('customDuration', e.target.value)}
              placeholder="60"
              min="5"
              max="3600"
              className={`form-input ${errors.customDuration ? 'error' : ''}`}
            />
            {errors.customDuration && (
              <span className="error-message">
                <AlertCircle size={12} />
                {errors.customDuration}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  )

  const renderStep4 = () => (
    <>
      <h2 className="step-title">Additional Settings</h2>

      <div className="form-group">
        <label className="form-label">
          <Palette size={16} />
          Creator Style Notes
          <span className="character-count">{formData.creatorStyleNotes.length}/500</span>
        </label>
        <textarea
          value={formData.creatorStyleNotes}
          onChange={(e) => handleInputChange('creatorStyleNotes', e.target.value)}
          placeholder="Describe your personal style, tone preferences, signature elements, or any specific requirements..."
          maxLength={500}
          className={`form-textarea ${errors.creatorStyleNotes ? 'error' : ''}`}
        />
        {errors.creatorStyleNotes && (
          <span className="error-message">
            <AlertCircle size={12} />
            {errors.creatorStyleNotes}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          <Hash size={16} />
          Tags
          <span className="character-count">{formData.tags.length}/10</span>
        </label>
        <div className="tag-input">
          <input
            type="text"
            placeholder="Add tags..."
            className="form-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const value = e.target.value.trim()
                if (value) {
                  addTag(value)
                  e.target.value = ''
                }
              }
            }}
          />
        </div>
        {formData.tags.length > 0 && (
          <div className="tag-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <X size={14} className="tag-remove" onClick={() => removeTag(index)} />
              </span>
            ))}
          </div>
        )}
      </div>

      {availableDeals && availableDeals.length > 0 && (
        <div className="form-group">
          <label className="form-label">
            <Link2 size={16} />
            Link to Deal (Optional)
          </label>
          <select
            value={formData.dealId}
            onChange={(e) => handleInputChange('dealId', e.target.value)}
            className="form-select"
          >
            <option value="">-- Select a deal --</option>
            {availableDeals.map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.title} - {deal.brandName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          Internal Notes
          <span className="character-count">{formData.notes.length}/1000</span>
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any internal notes or reminders..."
          maxLength={1000}
          className={`form-textarea compact ${errors.notes ? 'error' : ''}`}
        />
        {errors.notes && (
          <span className="error-message">
            <AlertCircle size={12} />
            {errors.notes}
          </span>
        )}
      </div>
    </>
  )

  // Render generation status popup
  const renderGenerationStatus = () => {
    if (!generationStatus || !isPollingStatus) return null

    const getStatusIcon = () => {
      switch (generationStatus.status) {
        case 'processing':
          return <Loader2 size={20} className="spin" style={{ color: '#F59E0B' }} />
        case 'completed':
          return <CheckCircle size={20} style={{ color: '#10B981' }} />
        case 'failed':
          return <XCircle size={20} style={{ color: '#EF4444' }} />
        default:
          return <Clock size={20} style={{ color: '#64748B' }} />
      }
    }

    return (
      <div className="generation-status">
        <div className="status-header">
          {getStatusIcon()}
          <div>
            <div className="status-title">AI Generation Status</div>
            <div className="status-message">
              {generationStatus.message || 'Processing your script...'}
            </div>
          </div>
        </div>

        {generationStatus.status === 'processing' && (
          <div className="status-progress">
            <div className="status-progress-fill" />
          </div>
        )}

        <div className="status-actions">
          {generationStatus.status === 'completed' && (
            <button
              className="status-btn success"
              onClick={() => navigate(`/scripts/${createdScriptId}`)}
            >
              View Script
            </button>
          )}

          {generationStatus.status === 'failed' && (
            <button className="status-btn error" onClick={() => handleSubmit()}>
              Retry
            </button>
          )}

          <button
            className="status-btn secondary"
            onClick={() => {
              setIsPollingStatus(false)
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
              }
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <button className="back-button" onClick={navigateBack}>
          <ArrowLeft size={18} />
          Back to Scripts
        </button>

        <h1 className="wizard-title">Create AI Script</h1>

        <div className="limits-info">
          <button className="limits-button" onClick={() => setShowLimitsInfo(!showLimitsInfo)}>
            <Info size={16} />
            Limits
          </button>

          {showLimitsInfo && uploadLimits && (
            <div className="limits-tooltip">
              <div className="tooltip-title">Upload Limits</div>
              <div className="tooltip-grid">
                <div className="tooltip-item">
                  <span>Documents:</span>
                  <span>{formatFileSize(uploadLimits.maxFileSize)}</span>
                </div>
                <div className="tooltip-item">
                  <span>Concurrent:</span>
                  <span>{uploadLimits.maxConcurrentUploads} file</span>
                </div>
              </div>

              {storageUsage.total > 0 && (
                <div className="storage-section">
                  <div className="storage-header">
                    <span>Storage</span>
                    <span>
                      {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.total)}
                    </span>
                  </div>
                  <div className="storage-progress">
                    <div
                      className="storage-fill"
                      style={{
                        width: `${storageUsage.percentage}%`,
                        backgroundColor:
                          storageUsage.percentage > 80
                            ? '#F59E0B'
                            : storageUsage.percentage > 95
                              ? '#EF4444'
                              : '#10B981',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-line"></div>
        <div
          className="progress-line-filled"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 80}%` }}
        />

        {['Input', 'Content', 'Config', 'Settings'].map((label, index) => {
          const stepNumber = index + 1
          return (
            <div key={stepNumber} className="progress-step">
              <div
                className={`progress-circle ${
                  currentStep >= stepNumber ? 'active' : ''
                } ${currentStep > stepNumber ? 'completed' : ''}`}
              >
                {currentStep > stepNumber ? <CheckCircle size={18} /> : stepNumber}
              </div>
              <span className="progress-label">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Form */}
      <div className="form-container">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Loading/Progress Indicator */}
        {(isCreating || isUploading) && (
          <div className="progress-indicator">
            <div className="progress-content">
              <Wand2 size={16} />
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : 'Creating script and starting AI generation...'}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="footer-actions">
          <div>
            {currentStep > 1 && (
              <button
                className="btn-secondary"
                onClick={prevStep}
                disabled={isCreating || isUploading}
              >
                <ArrowLeft size={18} />
                Previous
              </button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <button
                className="btn-primary"
                onClick={nextStep}
                disabled={isCreating || isUploading}
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className={`btn-primary ${isCreating || isUploading ? 'disabled' : ''}`}
                onClick={handleSubmit}
                disabled={isCreating || isUploading}
              >
                <Wand2 size={18} />
                {isCreating ? 'Creating...' : 'Create Script'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generation Status Popup */}
      {renderGenerationStatus()}

      <style jsx>{`
        /* Design System Variables */
        .wizard-container {
          --primary-50: #f5f3ff;
          --primary-100: #ede9fe;
          --primary-500: #8b5cf6;
          --primary-600: #7c3aed;
          --primary-700: #6d28d9;

          --secondary-500: #ec4899;
          --accent-500: #3b82f6;

          --neutral-0: #ffffff;
          --neutral-50: #fafafa;
          --neutral-100: #f4f4f5;
          --neutral-200: #e4e4e7;
          --neutral-300: #d4d4d8;
          --neutral-400: #a1a1aa;
          --neutral-500: #71717a;
          --neutral-600: #52525b;
          --neutral-700: #3f3f46;
          --neutral-800: #27272a;
          --neutral-900: #18181b;

          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --info: #3b82f6;

          --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%);
          --gradient-mesh:
            radial-gradient(at 40% 20%, hsla(280, 100%, 74%, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(330, 100%, 71%, 0.05) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(217, 100%, 62%, 0.05) 0px, transparent 50%);

          --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

          --radius-sm: 0.375rem;
          --radius-md: 0.5rem;
          --radius-lg: 0.75rem;
          --radius-xl: 1rem;

          --ease-out: cubic-bezier(0, 0, 0.2, 1);

          min-height: 100vh;
          background:
            var(--gradient-mesh),
            linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-100) 100%);
          font-family:
            'Plus Jakarta Sans',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
          padding: 2rem;
          color: var(--neutral-900);
        }

        /* Header */
        .wizard-header {
          max-width: 800px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--neutral-0);
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          color: var(--neutral-600);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
        }

        .back-button:hover {
          border-color: var(--primary-500);
          color: var(--primary-600);
          background: var(--primary-50);
          transform: translateY(-1px);
        }

        .wizard-title {
          font-size: 2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .limits-info {
          position: relative;
        }

        .limits-button {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.75rem;
          background: transparent;
          border: none;
          color: var(--neutral-500);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all 0.2s var(--ease-out);
        }

        .limits-button:hover {
          background: var(--neutral-100);
          color: var(--neutral-700);
        }

        .limits-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1rem;
          box-shadow: var(--shadow-lg);
          z-index: 100;
          min-width: 280px;
        }

        .tooltip-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--neutral-900);
        }

        .tooltip-grid {
          display: grid;
          gap: 0.5rem;
        }

        .tooltip-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--neutral-600);
        }

        .storage-section {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--neutral-200);
        }

        .storage-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--neutral-600);
          margin-bottom: 0.25rem;
        }

        .storage-progress {
          height: 6px;
          background: var(--neutral-200);
          border-radius: 3px;
          overflow: hidden;
        }

        .storage-fill {
          height: 100%;
          transition: width 0.3s var(--ease-out);
        }

        /* Progress Bar */
        .progress-container {
          max-width: 800px;
          margin: 0 auto 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .progress-line {
          position: absolute;
          top: 20px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--neutral-200);
          z-index: 0;
        }

        .progress-line-filled {
          position: absolute;
          top: 20px;
          left: 10%;
          height: 2px;
          background: var(--primary-500);
          transition: width 0.3s var(--ease-out);
          z-index: 1;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .progress-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--neutral-0);
          border: 2px solid var(--neutral-200);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-400);
          transition: all 0.3s var(--ease-out);
        }

        .progress-circle.active {
          background: var(--primary-500);
          border-color: var(--primary-500);
          color: var(--neutral-0);
        }

        .progress-circle.completed {
          background: var(--success);
          border-color: var(--success);
          color: var(--neutral-0);
        }

        .progress-label {
          font-size: 0.75rem;
          color: var(--neutral-500);
          font-weight: 600;
        }

        /* Form Container */
        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: var(--neutral-0);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--neutral-200);
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--neutral-900);
          margin: 0 0 2rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--neutral-200);
          letter-spacing: -0.025em;
        }

        /* Upload Limits Bar */
        .upload-limits-bar {
          margin-bottom: 2rem;
          padding: 1rem;
          background: linear-gradient(135deg, var(--neutral-50) 0%, var(--primary-50) 100%);
          border-radius: var(--radius-lg);
          border: 1px solid var(--primary-200);
        }

        .limits-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: var(--neutral-700);
          font-size: 0.875rem;
        }

        .limits-grid {
          display: grid;
          gap: 0.5rem;
        }

        .limit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--neutral-600);
        }

        .storage-bar {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--primary-200);
        }

        .storage-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--neutral-600);
          margin-bottom: 0.375rem;
        }

        /* Input Method Cards */
        .input-method-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-method-card {
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s var(--ease-out);
          text-align: center;
          background: var(--neutral-0);
        }

        .input-method-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-300);
        }

        .input-method-card.selected {
          border-color: var(--primary-500);
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .input-method-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          padding: 16px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-50) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s var(--ease-out);
        }

        .input-method-card.selected .input-method-icon {
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
          color: var(--neutral-0);
        }

        .input-method-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 0.75rem;
        }

        .input-method-description {
          font-size: 0.9375rem;
          color: var(--neutral-600);
          line-height: 1.5;
        }

        .file-limit-hint {
          font-size: 0.75rem;
          color: var(--neutral-400);
          margin-top: 0.75rem;
          font-style: italic;
        }

        /* Form Elements */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-700);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .required {
          color: var(--error);
        }

        .character-count {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--neutral-400);
          font-weight: 400;
        }

        .file-limit {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--neutral-400);
          font-weight: 400;
        }

        .form-input {
          padding: 0.875rem 1rem;
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          color: var(--neutral-700);
          background: var(--neutral-0);
          outline: none;
          transition: all 0.2s var(--ease-out);
        }

        .form-input:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-input.error {
          border-color: var(--error);
        }

        .form-textarea {
          padding: 0.875rem 1rem;
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          color: var(--neutral-700);
          background: var(--neutral-0);
          outline: none;
          transition: all 0.2s var(--ease-out);
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }

        .form-textarea:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-textarea.error {
          border-color: var(--error);
        }

        .form-textarea.compact {
          min-height: 80px;
        }

        .form-select {
          padding: 0.875rem 1rem;
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          color: var(--neutral-700);
          background: var(--neutral-0);
          outline: none;
          transition: all 0.2s var(--ease-out);
          cursor: pointer;
        }

        .form-select:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        /* File Upload */
        .file-upload-area {
          border: 2px dashed var(--neutral-300);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          background: linear-gradient(135deg, var(--neutral-50) 0%, rgba(255, 255, 255, 0.5) 100%);
        }

        .file-upload-area:hover {
          border-color: var(--primary-500);
          background: linear-gradient(135deg, var(--primary-50) 0%, rgba(139, 92, 246, 0.05) 100%);
        }

        .upload-icon {
          color: var(--neutral-400);
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 0.9375rem;
          color: var(--neutral-600);
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .upload-hint {
          font-size: 0.8125rem;
          color: var(--neutral-400);
          margin: 0;
        }

        .hidden-input {
          display: none;
        }

        .file-preview {
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1rem;
          background: var(--neutral-50);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .file-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-900);
        }

        .file-size {
          font-size: 0.75rem;
          color: var(--neutral-500);
        }

        .remove-file-btn {
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: var(--radius-md);
          color: var(--error);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
        }

        .remove-file-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        .upload-progress-info {
          margin-top: 0.75rem;
        }

        .progress-label {
          font-size: 0.75rem;
          color: var(--neutral-500);
          margin-bottom: 0.25rem;
        }

        .progress-bar {
          height: 6px;
          background: var(--neutral-200);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary-500);
          transition: width 0.3s var(--ease-out);
        }

        /* Platform Grid */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .platform-card {
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          background: var(--neutral-0);
        }

        .platform-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-300);
        }

        .platform-card.selected {
          border-color: var(--primary-500);
          background: var(--primary-50);
        }

        .platform-icon {
          margin-bottom: 0.5rem;
          color: var(--neutral-600);
        }

        .platform-card.selected .platform-icon {
          color: var(--primary-600);
        }

        .platform-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 0.25rem;
        }

        .platform-meta {
          font-size: 0.75rem;
          color: var(--neutral-500);
        }

        /* Granularity Options */
        .granularity-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .granularity-card {
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          background: var(--neutral-0);
        }

        .granularity-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-300);
        }

        .granularity-card.selected {
          border-color: var(--primary-500);
          background: var(--primary-50);
        }

        .granularity-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 0.5rem;
        }

        .granularity-description {
          font-size: 0.75rem;
          color: var(--neutral-600);
          line-height: 1.4;
        }

        /* Tags */
        .tag-input {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
          color: var(--primary-700);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid var(--primary-200);
        }

        .tag-remove {
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 50%;
          transition: all 0.2s var(--ease-out);
        }

        .tag-remove:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        /* Messages */
        .error-message {
          font-size: 0.8125rem;
          color: var(--error);
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 500;
        }

        .warning-message {
          font-size: 0.8125rem;
          color: var(--warning);
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        /* Progress Indicator */
        .progress-indicator {
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, var(--info) 0%, var(--primary-500) 100%);
          border-radius: var(--radius-lg);
          color: var(--neutral-0);
        }

        .progress-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        /* Footer Actions */
        .footer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--neutral-200);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--neutral-0);
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-600);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
        }

        .btn-secondary:hover {
          border-color: var(--primary-500);
          color: var(--primary-600);
          background: var(--primary-50);
          transform: translateY(-1px);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: var(--gradient-primary);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-0);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          box-shadow: 0 4px 14px -2px rgba(139, 92, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4);
        }

        .btn-primary.disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Generation Status */
        .generation-status {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-xl);
          min-width: 320px;
          z-index: 1000;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .status-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--neutral-900);
        }

        .status-message {
          font-size: 0.8125rem;
          color: var(--neutral-600);
          margin-bottom: 0.75rem;
        }

        .status-progress {
          height: 4px;
          background: var(--neutral-200);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .status-progress-fill {
          height: 100%;
          background: var(--primary-500);
          animation: progress 2s ease-in-out infinite;
        }

        .status-actions {
          display: flex;
          gap: 0.5rem;
        }

        .status-btn {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          font-weight: 600;
        }

        .status-btn.success {
          background: var(--success);
          color: var(--neutral-0);
        }

        .status-btn.error {
          background: var(--error);
          color: var(--neutral-0);
        }

        .status-btn.secondary {
          background: var(--neutral-100);
          color: var(--neutral-600);
        }

        .status-btn:hover {
          transform: translateY(-1px);
        }

        /* Animations */
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .wizard-container {
            padding: 1rem;
          }

          .wizard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            text-align: center;
          }

          .wizard-title {
            font-size: 1.5rem;
          }

          .form-container {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .input-method-grid {
            grid-template-columns: 1fr;
          }

          .platform-grid {
            grid-template-columns: 1fr;
          }

          .granularity-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ScriptCreationWizard

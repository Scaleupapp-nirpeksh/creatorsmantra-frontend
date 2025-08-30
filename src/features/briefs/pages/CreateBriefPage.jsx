/**
 * Create Brief Page - Text input and file upload for brand briefs
 * Path: src/features/briefs/pages/CreateBriefPage.jsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  Upload,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Bot,
  Sparkles,
  Zap,
  Clock,
  Tag,
  Save,
  Eye,
  AlertTriangle,
  Info,
  HelpCircle,
  FileUp,
  Type,
  Loader,
  Check,
  RefreshCw,
  Crown,
  Lock
} from 'lucide-react';
import { useBriefStore, useAuthStore } from '../../../store';
import { briefHelpers } from '../../../api/endpoints';
import { toast } from 'react-hot-toast';

const CreateBriefPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscription } = useAuthStore();
  const {
    createTextBrief,
    createFileBrief,
    fileUpload,
    briefsLoading
  } = useBriefStore();
  
  // Get initial type from URL params
  const initialType = searchParams.get('type') === 'file' ? 'file' : 'text';
  
  // Local state
  const [inputType, setInputType] = useState(initialType);
  const [textContent, setTextContent] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Auto-focus textarea when switching to text mode
    if (inputType === 'text' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inputType]);

  const subscriptionLimits = briefHelpers.getSubscriptionLimits(subscription?.tier || 'starter');
  const hasAIAccess = (() => {
    const tier = subscription?.tier || user?.subscriptionTier || 'starter';
    const aiEnabledTiers = ['pro', 'elite', 'agency_starter', 'agency_pro'];
    console.log('AI Access Debug:', { tier, aiEnabledTiers, includes: aiEnabledTiers.includes(tier) });
    return aiEnabledTiers.includes(tier);
  })();
  const validateForm = () => {
    const errors = [];
    
    if (inputType === 'text') {
      if (!textContent.trim()) {
        errors.push('Brief content is required');
      } else if (textContent.trim().length < 50) {
        errors.push('Brief content must be at least 50 characters long');
      } else if (textContent.trim().length > 50000) {
        errors.push('Brief content cannot exceed 50,000 characters');
      }
    } else {
      if (!selectedFile) {
        errors.push('Please select a file to upload');
      } else {
        const fileValidation = briefHelpers.validateFileUpload(selectedFile, subscription?.tier || 'starter');
        if (!fileValidation.valid) {
          errors.push(fileValidation.error);
        }
      }
    }
    
    // Validate tags
    if (tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }
    
    // Check subscription limits
    const monthlyLimit = subscriptionLimits.maxBriefsPerMonth;
    if (monthlyLimit !== 'Unlimited' && monthlyLimit <= 0) {
      errors.push(`Monthly brief limit reached for ${subscription?.tier || 'starter'} plan. Please upgrade to create more briefs.`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileSelect = (file) => {
    const validation = briefHelpers.validateFileUpload(file, subscription?.tier || 'starter');
    
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    setSelectedFile(file);
    setValidationErrors([]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      if (/^[a-zA-Z0-9_-]+$/.test(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      } else {
        toast.error('Tags can only contain letters, numbers, hyphens, and underscores');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsCreating(true);
    
    try {
      let result;
      
      if (inputType === 'text') {
        result = await createTextBrief({
          rawText: textContent.trim(),
          notes: notes.trim(),
          tags
        });
      } else {
        result = await createFileBrief(selectedFile, (progress) => {
          // Progress is handled by the store
        });
      }
      
      if (result.success) {
        toast.success('Brief created successfully!');
        
        if (hasAIAccess) {
          toast.success('AI analysis started automatically');
        }
        
        // Navigate to the brief details page
        const briefId = result.data.id || result.data._id;
        navigate(`/briefs/${briefId}`);
      } else {
        toast.error(result.error || 'Failed to create brief');
      }
    } catch (error) {
      toast.error('Failed to create brief');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (textContent || selectedFile || notes || tags.length > 0) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        navigate('/briefs');
      }
    } else {
      navigate('/briefs');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
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
    headerActions: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    typeToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.625rem',
      padding: '0.1875rem'
    },
    typeButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    typeButtonActive: {
      backgroundColor: '#ffffff',
      color: '#6366f1',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    content: {
      flex: 1,
      padding: '2rem',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center'
    },
    formContainer: {
      width: '100%',
      maxWidth: '800px',
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    sectionIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#0f172a'
    },
    sectionDescription: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    textarea: {
      width: '100%',
      minHeight: '300px',
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    textareaFocus: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
    },
    charCount: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.5rem',
      fontSize: '0.75rem',
      color: '#94a3b8'
    },
    fileDropZone: {
      border: '2px dashed #cbd5e1',
      borderRadius: '0.75rem',
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: '#f8fafc'
    },
    fileDropZoneActive: {
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      transform: 'translateY(-2px)'
    },
    fileDropZoneHover: {
      borderColor: '#8b5cf6',
      backgroundColor: '#f3f4f6'
    },
    dropIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 1rem',
      color: '#94a3b8'
    },
    dropTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    dropDescription: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1.5rem'
    },
    browseButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    selectedFile: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      marginTop: '1rem'
    },
    fileIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#dbeafe',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2563eb'
    },
    fileInfo: {
      flex: 1
    },
    fileName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1e40af'
    },
    fileSize: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginTop: '0.125rem'
    },
    removeFileButton: {
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    uploadProgress: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem'
    },
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.3s ease-in-out'
    },
    progressText: {
      fontSize: '0.75rem',
      color: '#374151',
      textAlign: 'center',
      marginTop: '0.5rem'
    },
    notesSection: {
      marginTop: '1.5rem'
    },
    notesTextarea: {
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    tagsSection: {
      marginTop: '1.5rem'
    },
    tagInput: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    tagInputField: {
      flex: 1,
      padding: '0.5rem 0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    addTagButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    tagsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.75rem'
    },
    tag: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.75rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      color: '#1e40af'
    },
    tagRemove: {
      width: '14px',
      height: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      color: '#64748b',
      cursor: 'pointer',
      fontSize: '10px'
    },
    errorList: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem'
    },
    errorItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#dc2626',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    aiInfo: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: hasAIAccess ? '#f0f9ff' : '#fef3c7',
      border: `1px solid ${hasAIAccess ? '#bfdbfe' : '#fde68a'}`,
      borderRadius: '0.75rem',
      marginTop: '1.5rem'
    },
    aiIcon: {
      width: '20px',
      height: '20px',
      color: hasAIAccess ? '#2563eb' : '#d97706',
      flexShrink: 0,
      marginTop: '0.125rem'
    },
    aiText: {
      flex: 1
    },
    aiTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: hasAIAccess ? '#1e40af' : '#92400e',
      marginBottom: '0.25rem'
    },
    aiDescription: {
      fontSize: '0.75rem',
      color: hasAIAccess ? '#64748b' : '#78716c',
      lineHeight: 1.4
    },
    upgradeLink: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '600'
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #f1f5f9'
    },
    cancelButton: {
      padding: '0.625rem 1.25rem',
      backgroundColor: 'transparent',
      color: '#64748b',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    subscriptionInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#f1f5f9',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      color: '#64748b',
      marginBottom: '1rem'
    },
    hiddenInput: {
      position: 'absolute',
      left: '-9999px',
      opacity: 0
    }
  };

  const isSubmitDisabled = isCreating || briefsLoading || fileUpload.isUploading;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleSection}>
            <button 
              style={styles.backButton}
              onClick={handleCancel}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={styles.title}>Create New Brief</h1>
              <p style={styles.subtitle}>
                Add a brand collaboration brief for AI analysis and deal conversion
              </p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <div style={styles.typeToggle}>
              <button
                style={{
                  ...styles.typeButton,
                  ...(inputType === 'text' ? styles.typeButtonActive : {})
                }}
                onClick={() => setInputType('text')}
              >
                <Type size={16} />
                Text Input
              </button>
              <button
                style={{
                  ...styles.typeButton,
                  ...(inputType === 'file' ? styles.typeButtonActive : {})
                }}
                onClick={() => setInputType('file')}
              >
                <FileUp size={16} />
                File Upload
              </button>
            </div>
          </div>
        </div>
        
        {/* Subscription Info */}
        <div style={styles.subscriptionInfo}>
          <Info size={16} />
          <span>
            {subscription?.tier || 'Starter'} Plan: {subscriptionLimits.maxBriefsPerMonth} briefs/month, 
            {subscriptionLimits.maxFileSize} max file size
            {hasAIAccess && ', AI analysis included'}
          </span>
          {!hasAIAccess && (
            <a href="/subscription" style={styles.upgradeLink}>
              Upgrade for AI features
            </a>
          )}
        </div>
      </div>

      <div style={styles.content}>
        <form style={styles.formContainer} onSubmit={handleSubmit}>
          {/* Main Content Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{
                ...styles.sectionIcon,
                backgroundColor: inputType === 'text' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)'
              }}>
                {inputType === 'text' ? (
                  <FileText size={20} color="#6366f1" />
                ) : (
                  <Upload size={20} color="#10b981" />
                )}
              </div>
              <div>
                <h2 style={styles.sectionTitle}>
                  {inputType === 'text' ? 'Brief Content' : 'Upload Brief File'}
                </h2>
                <p style={styles.sectionDescription}>
                  {inputType === 'text' 
                    ? 'Paste the brand collaboration brief content below'
                    : 'Upload a PDF, DOC, DOCX, or TXT file containing the brief'
                  }
                </p>
              </div>
            </div>

            {inputType === 'text' ? (
              <>
                <textarea
                  ref={textareaRef}
                  style={styles.textarea}
                  placeholder="Paste your brand brief content here...

Example:
Subject: Instagram Collaboration for Product Launch

Hi [Creator Name],

We'd like to collaborate with you for our new skincare product launch. We're looking for:
- 1 Instagram Reel showcasing the product
- 2 Instagram Stories
- Timeline: Content needed by March 15th
- Budget: ₹25,000

Please let us know if you're interested!"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.textareaFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                />
                <div style={styles.charCount}>
                  <span>
                    {textContent.length < 50 && textContent.length > 0 && (
                      <span style={{ color: '#ef4444' }}>
                        {50 - textContent.length} more characters needed
                      </span>
                    )}
                  </span>
                  <span>
                    {textContent.length.toLocaleString()}/50,000 characters
                  </span>
                </div>
              </>
            ) : (
              <>
                {!selectedFile ? (
                  <div
                    style={{
                      ...styles.fileDropZone,
                      ...(dragActive ? styles.fileDropZoneActive : {})
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload style={styles.dropIcon} />
                    <h3 style={styles.dropTitle}>
                      {dragActive ? 'Drop your file here' : 'Upload Brief File'}
                    </h3>
                    <p style={styles.dropDescription}>
                      Drag and drop your file here, or click to browse
                      <br />
                      <strong>Supported formats:</strong> PDF, DOC, DOCX, TXT
                      <br />
                      <strong>Max size:</strong> {subscriptionLimits.maxFileSize}
                    </p>
                    <button
                      type="button"
                      style={styles.browseButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <FileUp size={16} />
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div style={styles.selectedFile}>
                    <div style={styles.fileIcon}>
                      <FileText size={16} />
                    </div>
                    <div style={styles.fileInfo}>
                      <div style={styles.fileName}>{selectedFile.name}</div>
                      <div style={styles.fileSize}>{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <button
                      type="button"
                      style={styles.removeFileButton}
                      onClick={() => setSelectedFile(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {fileUpload.isUploading && (
                  <div style={styles.uploadProgress}>
                    <div style={styles.progressHeader}>
                      <RefreshCw size={16} color="#10b981" className="animate-spin" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                        Uploading and analyzing...
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${fileUpload.progress}%`
                        }}
                      />
                    </div>
                    <div style={styles.progressText}>
                      {fileUpload.progress}% complete - {fileUpload.currentFile}
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  style={styles.hiddenInput}
                  onChange={handleFileInputChange}
                />
              </>
            )}
          </div>

          {/* Notes Section */}
          <div style={styles.notesSection}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Additional Notes (Optional)
            </label>
            <textarea
              style={styles.notesTextarea}
              placeholder="Add any additional notes or context about this brief..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' })}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
            />
          </div>

          {/* Tags Section */}
          <div style={styles.tagsSection}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Tags (Optional)
            </label>
            <div style={styles.tagInput}>
              <input
                type="text"
                style={styles.tagInputField}
                placeholder="Add tags (e.g., skincare, reel, urgent)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
              />
              <button
                type="button"
                style={styles.addTagButton}
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 10}
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <div key={index} style={styles.tag}>
                    <Tag size={12} />
                    {tag}
                    <button
                      type="button"
                      style={styles.tagRemove}
                      onClick={() => removeTag(tag)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              {tags.length}/10 tags added
            </div>
          </div>

          {/* AI Information */}
          <div style={styles.aiInfo}>
            {hasAIAccess ? (
              <Bot style={styles.aiIcon} />
            ) : (
              <Lock style={styles.aiIcon} />
            )}
            <div style={styles.aiText}>
              <div style={styles.aiTitle}>
                {hasAIAccess ? 'AI Analysis Included' : 'AI Analysis Not Available'}
              </div>
              <div style={styles.aiDescription}>
                {hasAIAccess 
                  ? 'Your brief will be automatically analyzed by AI to extract brand info, deliverables, timeline, budget, and identify missing information.'
                  : (
                      <>
                        Upgrade to Pro or higher to get AI-powered brief analysis, automatic extraction, and deal conversion features. 
                        <a href="/subscription" style={styles.upgradeLink}> Upgrade now</a>
                      </>
                    )
                }
              </div>
            </div>
            {hasAIAccess && <Sparkles size={16} color="#2563eb" />}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div style={styles.errorList}>
              {validationErrors.map((error, index) => (
                <div key={index} style={styles.errorItem}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitDisabled}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitDisabled ? styles.submitButtonDisabled : {})
              }}
              disabled={isSubmitDisabled}
            >
              {isCreating ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create Brief
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .back-button:hover {
          background-color: #f1f5f9;
          color: #475569;
        }
        
        .browse-button:hover {
          background-color: #4f46e5;
        }
        
        .add-tag-button:hover:not(:disabled) {
          background-color: #4f46e5;
        }
        
        .add-tag-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cancel-button:hover {
          border-color: #94a3b8;
          color: #475569;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        
        .file-drop-zone:hover {
          border-color: #8b5cf6;
          background-color: #f3f4f6;
        }
        
        .remove-file-button:hover {
          background-color: #f1f5f9;
          color: #374151;
        }
        
        .tag-remove:hover {
          background-color: rgba(100, 116, 139, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CreateBriefPage;
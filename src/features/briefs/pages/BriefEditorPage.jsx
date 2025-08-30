/**
 * Brief Editor Page - Edit brief content and answer clarifications
 * Path: src/features/briefs/pages/BriefEditorPage.jsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Building,
  Package,
  Target,
  MessageSquare,
  Mail,
  Send,
  Tag,
  Info,
  HelpCircle,
  FileText,
  Upload,
  Bot,
  Sparkles,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Star,
  Flag,
  Timer,
  Hash
} from 'lucide-react';
import { useBriefStore, useAuthStore, useClarifications, useCurrentBrief } from '../../../store';
import { briefHelpers } from '../../../api/endpoints';
import { toast } from 'react-hot-toast';

const BriefEditorPage = () => {
  const navigate = useNavigate();
  const { briefId } = useParams();
  const { user, subscription } = useAuthStore();
  const {
    brief,
    isLoading,
    error,
    isDirty,
    fetchBrief,
    updateBrief,
    setDirty
  } = useCurrentBrief();
  
  const {
    generateEmail,
    addQuestion,
    answerQuestion,
    isGenerating: emailGenerating
  } = useClarifications();
  
  // Local state for form
  const [formData, setFormData] = useState({
    notes: '',
    tags: [],
    originalContent: ''
  });
  
  // UI state
  const [activeSection, setActiveSection] = useState('content');
  const [tagInput, setTagInput] = useState('');
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (briefId) {
      fetchBrief(briefId);
    }
  }, [briefId, fetchBrief]);

  useEffect(() => {
    if (brief) {
      setFormData({
        notes: brief.creatorNotes || '',
        tags: brief.tags || [],
        originalContent: brief.originalContent?.rawText || ''
      });
      
      // Initialize answers from brief data
      const initialAnswers = {};
      const allQuestions = [
        ...(brief.clarifications?.suggestedQuestions || []),
        ...(brief.clarifications?.customQuestions || [])
      ];
      
      allQuestions.forEach(q => {
        if (q.answer) {
          initialAnswers[q._id] = q.answer;
        }
      });
      
      setAnswers(initialAnswers);
    }
  }, [brief]);

  useEffect(() => {
    // Track unsaved changes
    if (brief) {
      const hasChanges = 
        formData.notes !== (brief.creatorNotes || '') ||
        JSON.stringify(formData.tags) !== JSON.stringify(brief.tags || []) ||
        Object.keys(answers).some(questionId => {
          const allQuestions = [
            ...(brief.clarifications?.suggestedQuestions || []),
            ...(brief.clarifications?.customQuestions || [])
          ];
          const question = allQuestions.find(q => q._id === questionId);
          return question && answers[questionId] !== (question.answer || '');
        });
      
      setHasUnsavedChanges(hasChanges);
      setDirty(hasChanges);
    }
  }, [formData, answers, brief, setDirty]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      if (/^[a-zA-Z0-9_-]+$/.test(tag)) {
        handleInputChange('tags', [...formData.tags, tag]);
        setTagInput('');
      } else {
        toast.error('Tags can only contain letters, numbers, hyphens, and underscores');
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAddCustomQuestion = async () => {
    const question = customQuestionInput.trim();
    if (!question) return;

    try {
      await addQuestion(briefId, question, 'other', 'medium');
      setCustomQuestionInput('');
      toast.success('Question added successfully');
      // Refresh brief to get updated questions
      await fetchBrief(briefId, true);
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save basic updates
      const updates = {
        creatorNotes: formData.notes,
        tags: formData.tags
      };
      
      await updateBrief(briefId, updates);
      
      // Save answers for clarifications
      const allQuestions = [
        ...(brief.clarifications?.suggestedQuestions || []),
        ...(brief.clarifications?.customQuestions || [])
      ];
      
      const answerPromises = [];
      for (const questionId in answers) {
        const question = allQuestions.find(q => q._id === questionId);
        if (question && answers[questionId] !== (question.answer || '')) {
          answerPromises.push(answerQuestion(briefId, questionId, answers[questionId]));
        }
      }
      
      await Promise.all(answerPromises);
      
      setHasUnsavedChanges(false);
      toast.success('Brief updated successfully');
      
      // If all critical questions are answered, check if ready for deal
      const criticalQuestions = allQuestions.filter(q => 
        (q.priority === 'high' || q.category === 'budget' || q.category === 'timeline')
      );
      const answeredCritical = criticalQuestions.filter(q => answers[q._id] || q.answer);
      
      if (criticalQuestions.length > 0 && answeredCritical.length === criticalQuestions.length) {
        toast.success('All critical questions answered! Brief may be ready for deal conversion.');
      }
      
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(`/briefs/${briefId}`);
      }
    } else {
      navigate(`/briefs/${briefId}`);
    }
  };

  const handleGenerateEmail = async () => {
    try {
      const result = await generateEmail(briefId);
      if (result.success) {
        toast.success('Clarification email generated');
        setActiveSection('clarifications');
      }
    } catch (error) {
      toast.error('Failed to generate email');
    }
  };

  const toggleQuestionExpanded = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getQuestionPriorityColor = (priority) => {
    const colorMap = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colorMap[priority] || '#64748b';
  };

  const getQuestionCategoryIcon = (category) => {
    const iconMap = {
      budget: DollarSign,
      timeline: Calendar,
      usage_rights: FileText,
      exclusivity: Star,
      payment_terms: CreditCard,
      content_specs: Package,
      brand_guidelines: Palette,
      contact_info: User,
      deliverables: Target,
      approval_process: CheckCircle,
      other: HelpCircle
    };
    return iconMap[category] || HelpCircle;
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
    titleContent: {
      display: 'flex',
      flexDirection: 'column'
    },
    briefTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
      lineHeight: 1.2
    },
    briefSubtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    headerActions: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    saveButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderColor: 'transparent',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.25)'
    },
    disabledButton: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    navigation: {
      display: 'flex',
      gap: '0.5rem'
    },
    navButton: {
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: '2px solid transparent',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    navButtonActive: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
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
      maxWidth: '800px'
    },
    section: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.25rem'
    },
    sectionIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      display: 'block',
      marginBottom: '0.5rem'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
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
    input: {
      width: '100%',
      padding: '0.625rem 0.875rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    tagInput: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    tagInputField: {
      flex: 1
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
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
      cursor: 'pointer'
    },
    questionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    questionCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      overflow: 'hidden'
    },
    questionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    questionIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    questionContent: {
      flex: 1
    },
    questionText: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#0f172a',
      lineHeight: 1.4,
      marginBottom: '0.25rem'
    },
    questionMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.75rem',
      color: '#64748b'
    },
    priorityBadge: {
      padding: '0.125rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.625rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    questionToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      color: '#64748b',
      cursor: 'pointer'
    },
    questionBody: {
      padding: '1rem',
      borderTop: '1px solid #f1f5f9'
    },
    answerTextarea: {
      width: '100%',
      minHeight: '80px',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.2s'
    },
    answerActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '0.75rem'
    },
    answerButton: {
      padding: '0.375rem 0.75rem',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      cursor: 'pointer'
    },
    answeredBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      backgroundColor: '#dcfce7',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      color: '#166534',
      fontWeight: '600'
    },
    emailSection: {
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      marginTop: '1rem'
    },
    emailText: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#1e40af',
      whiteSpace: 'pre-wrap',
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.375rem',
      border: '1px solid #e2e8f0',
      marginTop: '0.75rem'
    },
    unsavedIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#fef3c7',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: '#92400e',
      marginBottom: '1rem'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#94a3b8',
      textAlign: 'center'
    },
    emptyTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#475569',
      marginTop: '0.75rem',
      marginBottom: '0.5rem'
    },
    emptyDescription: {
      fontSize: '0.875rem'
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <RefreshCw size={24} className="animate-spin" color="#6366f1" />
          <span style={{ marginLeft: '0.75rem', color: '#64748b' }}>Loading brief...</span>
        </div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <XCircle size={48} color="#ef4444" />
          <h3 style={styles.emptyTitle}>Brief Not Found</h3>
          <p style={styles.emptyDescription}>
            The brief you're trying to edit doesn't exist or has been deleted.
          </p>
          <button
            style={styles.actionButton}
            onClick={() => navigate('/briefs')}
          >
            <ArrowLeft size={16} />
            Back to Briefs
          </button>
        </div>
      </div>
    );
  }

  const allQuestions = [
    ...(brief.clarifications?.suggestedQuestions || []),
    ...(brief.clarifications?.customQuestions || [])
  ];

  const unansweredQuestions = allQuestions.filter(q => !q.isAnswered && !answers[q._id]);
  const answeredQuestions = allQuestions.filter(q => q.isAnswered || answers[q._id]);

  const renderContentSection = () => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <div style={{
          ...styles.sectionIcon,
          backgroundColor: 'rgba(99, 102, 241, 0.1)'
        }}>
          <Edit2 size={16} color="#6366f1" />
        </div>
        <h2 style={styles.sectionTitle}>Brief Content</h2>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Creator Notes</label>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          placeholder="Add your notes about this brief..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          onFocus={(e) => Object.assign(e.target.style, styles.textareaFocus)}
          onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tags ({formData.tags.length}/10)</label>
        <div style={styles.tagInput}>
          <input
            type="text"
            style={{...styles.input, ...styles.tagInputField}}
            placeholder="Add tags (e.g., urgent, high-budget, skincare)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            onFocus={(e) => Object.assign(e.target.style, { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' })}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
          />
          <button
            type="button"
            style={styles.addButton}
            onClick={handleTagAdd}
            disabled={!tagInput.trim() || formData.tags.length >= 10}
          >
            <Plus size={16} />
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div style={styles.tagsList}>
            {formData.tags.map((tag, index) => (
              <div key={index} style={styles.tag}>
                <Tag size={12} />
                {tag}
                <button
                  type="button"
                  style={styles.tagRemove}
                  onClick={() => handleTagRemove(tag)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderClarificationsSection = () => (
    <>
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={{
            ...styles.sectionIcon,
            backgroundColor: 'rgba(245, 158, 11, 0.1)'
          }}>
            <MessageSquare size={16} color="#f59e0b" />
          </div>
          <h2 style={styles.sectionTitle}>Clarification Questions</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={styles.formGroup}>
            <input
              type="text"
              style={{...styles.input, width: '400px'}}
              placeholder="Add a custom clarification question..."
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomQuestion()}
            />
          </div>
          <button
            type="button"
            style={styles.addButton}
            onClick={handleAddCustomQuestion}
            disabled={!customQuestionInput.trim()}
          >
            <Plus size={16} />
          </button>
          
          <button
            type="button"
            style={styles.actionButton}
            onClick={handleGenerateEmail}
            disabled={emailGenerating}
          >
            {emailGenerating ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {emailGenerating ? 'Generating...' : 'Generate Email'}
          </button>
        </div>

        {unansweredQuestions.length > 0 && (
          <>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b', marginBottom: '1rem' }}>
              Unanswered Questions ({unansweredQuestions.length})
            </h3>
            <div style={styles.questionsList}>
              {unansweredQuestions.map((question) => {
                const CategoryIcon = getQuestionCategoryIcon(question.category);
                const isExpanded = expandedQuestions[question._id];
                const currentAnswer = answers[question._id] || '';

                return (
                  <div key={question._id} style={styles.questionCard}>
                    <div 
                      style={styles.questionHeader}
                      onClick={() => toggleQuestionExpanded(question._id)}
                    >
                      <div style={{
                        ...styles.questionIcon,
                        backgroundColor: `${getQuestionPriorityColor(question.priority)}20`
                      }}>
                        <CategoryIcon size={16} color={getQuestionPriorityColor(question.priority)} />
                      </div>
                      <div style={styles.questionContent}>
                        <div style={styles.questionText}>{question.question}</div>
                        <div style={styles.questionMeta}>
                          <div style={{
                            ...styles.priorityBadge,
                            backgroundColor: `${getQuestionPriorityColor(question.priority)}20`,
                            color: getQuestionPriorityColor(question.priority)
                          }}>
                            {question.priority}
                          </div>
                          <span>{question.category?.replace('_', ' ')}</span>
                          {currentAnswer && <span style={{ color: '#10b981', fontWeight: '600' }}>Draft answer</span>}
                        </div>
                      </div>
                      <button style={styles.questionToggle}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={styles.questionBody}>
                        <textarea
                          style={styles.answerTextarea}
                          placeholder="Type your answer here..."
                          value={currentAnswer}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          onFocus={(e) => Object.assign(e.target.style, { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' })}
                          onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                        />
                        <div style={styles.answerActions}>
                          <button
                            style={styles.answerButton}
                            onClick={() => {
                              if (currentAnswer.trim()) {
                                toast.success('Answer saved! Remember to save all changes.');
                              }
                            }}
                            disabled={!currentAnswer.trim()}
                          >
                            Save Answer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {answeredQuestions.length > 0 && (
          <>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981', marginTop: '2rem', marginBottom: '1rem' }}>
              Answered Questions ({answeredQuestions.length})
            </h3>
            <div style={styles.questionsList}>
              {answeredQuestions.map((question) => {
                const CategoryIcon = getQuestionCategoryIcon(question.category);
                const answer = answers[question._id] || question.answer;

                return (
                  <div key={question._id} style={styles.questionCard}>
                    <div style={styles.questionHeader}>
                      <div style={{
                        ...styles.questionIcon,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                      }}>
                        <CategoryIcon size={16} color="#10b981" />
                      </div>
                      <div style={styles.questionContent}>
                        <div style={styles.questionText}>{question.question}</div>
                        <div style={styles.questionMeta}>
                          <div style={styles.answeredBadge}>
                            <CheckCircle size={12} />
                            Answered
                          </div>
                          <span>{question.category?.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.questionBody}>
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#166534',
                        lineHeight: 1.6
                      }}>
                        {answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {allQuestions.length === 0 && (
          <div style={styles.emptyState}>
            <MessageSquare size={32} color="#cbd5e1" />
            <div style={styles.emptyTitle}>No Questions Yet</div>
            <div style={styles.emptyDescription}>
              AI analysis hasn't generated any clarification questions, or add your own custom questions.
            </div>
          </div>
        )}

        {/* Email Template */}
        {brief.clarifications?.clarificationEmail?.generated && (
          <div style={styles.emailSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Mail size={16} color="#2563eb" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                Generated Clarification Email
              </span>
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '0.75rem'
            }}>
              <strong>Subject:</strong> {brief.clarifications.clarificationEmail.subject}
            </div>
            <div style={styles.emailText}>
              {brief.clarifications.clarificationEmail.body}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'content':
        return renderContentSection();
      case 'clarifications':
        return renderClarificationsSection();
      default:
        return renderContentSection();
    }
  };

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
            <div style={styles.titleContent}>
              <h1 style={styles.briefTitle}>
                Edit Brief: {brief.aiExtraction?.brandInfo?.name || brief.briefId || briefId.slice(-6)}
              </h1>
              <p style={styles.briefSubtitle}>
                Make changes to brief content and answer clarification questions
              </p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <button
              style={styles.actionButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X size={16} />
              Cancel
            </button>
            
            <button
              style={{
                ...styles.actionButton,
                ...styles.saveButton,
                ...((!hasUnsavedChanges || isSaving) ? styles.disabledButton : {})
              }}
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            style={{
              ...styles.navButton,
              ...(activeSection === 'content' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveSection('content')}
          >
            <Edit2 size={14} />
            Content & Tags
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(activeSection === 'clarifications' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveSection('clarifications')}
          >
            <MessageSquare size={14} />
            Clarifications
            {unansweredQuestions.length > 0 && (
              <span style={{
                backgroundColor: activeSection === 'clarifications' ? 'rgba(255,255,255,0.2)' : '#ef4444',
                color: '#ffffff',
                padding: '0.125rem 0.375rem',
                borderRadius: '10px',
                fontSize: '0.625rem',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}>
                {unansweredQuestions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.formContainer}>
          {hasUnsavedChanges && (
            <div style={styles.unsavedIndicator}>
              <AlertCircle size={16} />
              You have unsaved changes
            </div>
          )}
          
          {renderActiveSection()}
        </div>
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
        
        .action-button:hover:not(:disabled) {
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        
        .add-button:hover:not(:disabled) {
          background-color: #4f46e5;
        }
        
        .add-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .question-header:hover {
          background-color: #f1f5f9;
        }
        
        .tag-remove:hover {
          background-color: rgba(100, 116, 139, 0.1);
        }
        
        .answer-button:hover:not(:disabled) {
          background-color: #059669;
        }
        
        .answer-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BriefEditorPage;
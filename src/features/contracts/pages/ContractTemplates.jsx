/**
 * Contract Templates & Knowledge Base - Creator-friendly templates and clause alternatives
 * 
 * Features:
 * - Contract templates by category (collaboration, sponsorship, licensing)
 * - Platform-specific templates (Instagram, YouTube, TikTok)
 * - Creator-friendly clause alternatives with success rates
 * - Template preview with copy functionality
 * - Usage statistics and success metrics
 * - Industry best practices guide
 * 
 * File Path: src/features/contracts/pages/ContractTemplates.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useContractTemplates, useCurrentUser } from '@/store';
import { canAccessClauseAlternatives } from '@/store';
import { CONTRACT_CONSTANTS } from '@/api/endpoints';
import toast from 'react-hot-toast';

const ContractTemplates = () => {
  // Store hooks
  const { 
    templates, 
    clauseAlternatives, 
    isLoading, 
    getTemplates, 
    getClauseAlternatives 
  } = useContractTemplates();
  
  const { user, subscription } = useCurrentUser();

  // Local state
  const [selectedCategory, setSelectedCategory] = useState('collaboration');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeClauseType, setActiveClauseType] = useState(null);
  const [showClauseAlternatives, setShowClauseAlternatives] = useState(false);

  // Template categories
  const categories = [
    { id: 'collaboration', name: 'Brand Collaboration', icon: '🤝', description: 'Partnership contracts with brands' },
    { id: 'sponsorship', name: 'Sponsorship', icon: '💼', description: 'Event and product sponsorship deals' },
    { id: 'licensing', name: 'Content Licensing', icon: '📄', description: 'Usage rights and licensing agreements' },
    { id: 'employment', name: 'Team Contracts', icon: '👥', description: 'Editor, assistant, and team agreements' }
  ];

  // Platform options
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '👥' }
  ];

  // Clause types for alternatives
  const clauseTypes = [
    { id: 'payment_terms', name: 'Payment Terms', description: 'When and how you get paid' },
    { id: 'usage_rights', name: 'Usage Rights', description: 'How brands can use your content' },
    { id: 'deliverables', name: 'Deliverables', description: 'What you need to create and deliver' },
    { id: 'exclusivity', name: 'Exclusivity', description: 'Restrictions on other partnerships' },
    { id: 'termination', name: 'Termination', description: 'How contracts can be ended' },
    { id: 'liability', name: 'Liability', description: 'Risk and responsibility clauses' }
  ];

  // Load templates on mount and when filters change
  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, selectedPlatforms]);

  const loadTemplates = useCallback(async () => {
    const params = {
      category: selectedCategory,
      platforms: selectedPlatforms.join(',')
    };
    
    await getTemplates(params);
  }, [selectedCategory, selectedPlatforms, getTemplates]);

  // Handle platform toggle
  const togglePlatform = useCallback((platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);

  // Handle template preview
  const previewTemplate = useCallback((template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  }, []);

  // Handle clause alternatives
  const showClauseAlternativesForType = useCallback(async (clauseType) => {
    if (!canAccessClauseAlternatives()) {
      toast.error('Clause alternatives are available in Pro+ plans');
      return;
    }
    
    setActiveClauseType(clauseType);
    setShowClauseAlternatives(true);
    
    if (!clauseAlternatives[clauseType]) {
      await getClauseAlternatives(clauseType);
    }
  }, [clauseAlternatives, getClauseAlternatives]);

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current category info
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      padding: 'var(--space-6) var(--space-8)'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: 'var(--space-8)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)'
            }}>
              Contract Templates & Knowledge Base
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)'
            }}>
              Creator-friendly templates and clause alternatives to protect your interests
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)'
          }}>
            {/* View Mode Toggle */}
            <div style={{
              background: 'var(--color-neutral-100)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-1)',
              display: 'flex'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  transition: 'all var(--duration-200) var(--ease-out)'
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: viewMode === 'list' ? 'white' : 'transparent',
                  color: viewMode === 'list' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  transition: 'all var(--duration-200) var(--ease-out)'
                }}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-xl)',
                border: 'none',
                background: selectedCategory === category.id 
                  ? 'var(--gradient-primary)' 
                  : 'white',
                color: selectedCategory === category.id 
                  ? 'white' 
                  : 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                transition: 'all var(--duration-200) var(--ease-out)',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === category.id 
                  ? 'var(--shadow-lg)' 
                  : 'var(--shadow-sm)'
              }}
            >
              <span style={{ fontSize: 'var(--text-lg)' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'var(--space-4)',
          alignItems: 'end'
        }}>
          {/* Search */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)'
            }}>
              Search Templates
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-base)',
                outline: 'none',
                transition: 'border-color var(--duration-200) var(--ease-out)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary-500)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
              }}
            />
          </div>

          {/* Platform Filters */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)'
            }}>
              Filter by Platform
            </label>
            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              flexWrap: 'wrap'
            }}>
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid',
                    borderColor: selectedPlatforms.includes(platform.id)
                      ? 'var(--color-primary-500)'
                      : 'var(--color-border)',
                    background: selectedPlatforms.includes(platform.id)
                      ? 'var(--color-primary-50)'
                      : 'white',
                    color: selectedPlatforms.includes(platform.id)
                      ? 'var(--color-primary-700)'
                      : 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    transition: 'all var(--duration-200) var(--ease-out)'
                  }}
                >
                  <span>{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-8)'
      }}>
        {/* Templates Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)'
          }}>
            <div>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-1)'
              }}>
                {currentCategory?.icon} {currentCategory?.name} Templates
              </h2>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)'
              }}>
                {currentCategory?.description}
              </p>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              {filteredTemplates.length} templates found
            </div>
          </div>

          {/* Templates Grid/List */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
              gap: 'var(--space-4)'
            }}>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{
                    height: '20px',
                    background: 'var(--color-neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-3)',
                    animation: 'pulse 2s infinite'
                  }} />
                  <div style={{
                    height: '14px',
                    background: 'var(--color-neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)',
                    animation: 'pulse 2s infinite'
                  }} />
                  <div style={{
                    height: '14px',
                    background: 'var(--color-neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    width: '70%',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
              gap: 'var(--space-4)'
            }}>
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border)',
                    transition: 'all var(--duration-200) var(--ease-out)',
                    cursor: 'pointer'
                  }}
                  onClick={() => previewTemplate(template)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <h3 style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      {template.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      padding: 'var(--space-1) var(--space-2)',
                      background: 'var(--color-success-light)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-success-dark)'
                    }}>
                      ⭐ {template.successRate}% success
                    </div>
                  </div>

                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: 'var(--leading-relaxed)'
                  }}>
                    {template.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {template.clauseCount} clauses • Used {template.usageCount} times
                    </div>
                  </div>

                  {/* Platform Tags */}
                  {template.targetPlatforms && template.targetPlatforms.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: 'var(--space-1)',
                      flexWrap: 'wrap',
                      marginBottom: 'var(--space-4)'
                    }}>
                      {template.targetPlatforms.slice(0, 3).map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        return platform ? (
                          <span
                            key={platformId}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-1)',
                              padding: 'var(--space-1) var(--space-2)',
                              background: 'var(--color-primary-50)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-primary-700)'
                            }}
                          >
                            {platform.icon}
                            {platform.name}
                          </span>
                        ) : null;
                      })}
                      {template.targetPlatforms.length > 3 && (
                        <span style={{
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--color-neutral-100)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)'
                        }}>
                          +{template.targetPlatforms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <button style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-200) var(--ease-out)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    Preview Template
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-12)',
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '2px dashed var(--color-border)'
            }}>
              <div style={{
                fontSize: 'var(--text-4xl)',
                marginBottom: 'var(--space-4)'
              }}>📄</div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)'
              }}>
                No templates found
              </h3>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)'
              }}>
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Clause Alternatives Sidebar */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text)'
              }}>
                Creator-Friendly Alternatives
              </h3>
              {!canAccessClauseAlternatives() && (
                <span style={{
                  padding: 'var(--space-1) var(--space-2)',
                  background: 'var(--color-warning-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--color-warning-dark)'
                }}>
                  Pro+
                </span>
              )}
            </div>
            
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              Get creator-friendly alternatives for common problematic clauses. These alternatives are proven to work and protect your interests.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              {clauseTypes.map(clauseType => (
                <button
                  key={clauseType.id}
                  onClick={() => showClauseAlternativesForType(clauseType.id)}
                  disabled={!canAccessClauseAlternatives()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-neutral-50)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: canAccessClauseAlternatives() ? 'var(--color-text)' : 'var(--color-text-light)',
                    cursor: canAccessClauseAlternatives() ? 'pointer' : 'not-allowed',
                    transition: 'all var(--duration-200) var(--ease-out)',
                    textAlign: 'left',
                    opacity: canAccessClauseAlternatives() ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (canAccessClauseAlternatives()) {
                      e.currentTarget.style.background = 'var(--color-neutral-100)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canAccessClauseAlternatives()) {
                      e.currentTarget.style.background = 'var(--color-neutral-50)';
                    }
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: 'var(--font-semibold)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {clauseType.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {clauseType.description}
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>

            {!canAccessClauseAlternatives() && (
              <div style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <h4 style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'white',
                  marginBottom: 'var(--space-2)'
                }}>
                  Unlock Creator-Friendly Alternatives
                </h4>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'white',
                  opacity: 0.9,
                  marginBottom: 'var(--space-3)'
                }}>
                  Get proven clause alternatives that protect your interests
                </p>
                <button style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'white',
                  color: 'var(--color-primary-600)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer'
                }}>
                  Upgrade Now
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-4)'
            }}>
              Template Success Rates
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              {categories.map(category => (
                <div
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3)',
                    background: selectedCategory === category.id 
                      ? 'var(--color-primary-50)' 
                      : 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-lg)',
                    border: selectedCategory === category.id 
                      ? '1px solid var(--color-primary-200)' 
                      : '1px solid var(--color-border)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <span style={{ fontSize: 'var(--text-base)' }}>{category.icon}</span>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text)'
                    }}>
                      {category.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-success-dark)'
                  }}>
                    {category.id === 'collaboration' ? '92%' :
                     category.id === 'sponsorship' ? '89%' :
                     category.id === 'licensing' ? '94%' : '87%'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplateModal && selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Clause Alternatives Modal */}
      {showClauseAlternatives && activeClauseType && (
        <ClauseAlternativesModal
          clauseType={activeClauseType}
          alternatives={clauseAlternatives[activeClauseType] || []}
          isLoading={isLoading}
          onClose={() => {
            setShowClauseAlternatives(false);
            setActiveClauseType(null);
          }}
        />
      )}

      {/* Global Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// Template Preview Modal
const TemplateModal = ({ template, onClose }) => {
  const copyTemplate = () => {
    // Here you would typically copy the template content
    // For now, we'll just show a success message
    toast.success('Template copied to clipboard!');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-modal)',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-2xl)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)'
            }}>
              {template.name}
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)'
            }}>
              {template.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--space-2)',
              background: 'var(--color-neutral-100)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Template Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-success-light)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-success-dark)',
              marginBottom: 'var(--space-1)'
            }}>
              {template.successRate}%
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-success-dark)'
            }}>
              Success Rate
            </div>
          </div>
          
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-info-light)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-info-dark)',
              marginBottom: 'var(--space-1)'
            }}>
              {template.usageCount}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-info-dark)'
            }}>
              Times Used
            </div>
          </div>
          
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-primary-50)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-primary-700)',
              marginBottom: 'var(--space-1)'
            }}>
              {template.clauseCount}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-primary-700)'
            }}>
              Clauses
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div style={{
          background: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text)',
            marginBottom: 'var(--space-4)'
          }}>
            Template Preview
          </h3>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            fontFamily: 'var(--font-mono)'
          }}>
            {/* This would contain the actual template content */}
            [Template content would be rendered here with key clauses highlighted and formatted]
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: 'var(--color-neutral-100)',
              color: 'var(--color-text)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button
            onClick={copyTemplate}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer'
            }}
          >
            Copy Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Clause Alternatives Modal
const ClauseAlternativesModal = ({ clauseType, alternatives, isLoading, onClose }) => {
  const clauseTypeInfo = {
    payment_terms: { name: 'Payment Terms', icon: '💰' },
    usage_rights: { name: 'Usage Rights', icon: '📄' },
    deliverables: { name: 'Deliverables', icon: '📦' },
    exclusivity: { name: 'Exclusivity', icon: '🤝' },
    termination: { name: 'Termination', icon: '🚪' },
    liability: { name: 'Liability', icon: '⚖️' }
  }[clauseType] || { name: clauseType, icon: '📋' };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-modal)',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-2xl)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span>{clauseTypeInfo.icon}</span>
              {clauseTypeInfo.name} Alternatives
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)'
            }}>
              Creator-friendly alternatives that protect your interests
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--space-2)',
              background: 'var(--color-neutral-100)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Alternatives List */}
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-neutral-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{
                  height: '16px',
                  background: 'var(--color-neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-2)',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{
                  height: '12px',
                  background: 'var(--color-neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  width: '80%',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
            ))}
          </div>
        ) : alternatives.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}>
            {alternatives.map((alternative, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-success-light)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-success)'
                }}
              >
                <div style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-2)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {alternative.content}
                </div>
                {alternative.explanation && (
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-success-dark)',
                    fontStyle: 'italic'
                  }}>
                    💡 {alternative.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-8)'
          }}>
            <div style={{
              fontSize: 'var(--text-4xl)',
              marginBottom: 'var(--space-4)'
            }}>🔍</div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)'
            }}>
              No alternatives found
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)'
            }}>
              We're working on adding more alternatives for this clause type
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractTemplates;
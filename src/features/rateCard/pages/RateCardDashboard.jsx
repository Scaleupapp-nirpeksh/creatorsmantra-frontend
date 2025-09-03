/**
 * Rate Card Dashboard Page
 * Main landing page for creators to view and manage all their rate cards
 * 
 * Features:
 * - Display all rate cards in a responsive grid
 * - Filter by status (all, draft, active, archived)
 * - Pagination for large datasets
 * - Quick actions (edit, publish, delete, analytics)
 * - Empty states and loading states
 * - Search and sorting capabilities
 * 
 * @filepath src/features/rateCard/pages/RateCardDashboard.jsx
 * @author CreatorsMantra Frontend Team
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Eye, 
  Share2, 
  Trash2, 
  BarChart3,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import useRateCardStore from '../../../store/ratecardStore';

const RateCardDashboard = () => {
  const navigate = useNavigate();
  const {
    rateCards,
    pagination,
    isLoading,
    error,
    fetchRateCards,
    deleteRateCard,
    publishRateCard,
    clearCurrentRateCard
  } = useRateCardStore();

  // Local state for filters and search
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch rate cards on mount and when filters change
  useEffect(() => {
    clearCurrentRateCard();
    fetchRateCards({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: currentPage,
      limit: 12
    });
  }, [statusFilter, currentPage, fetchRateCards, clearCurrentRateCard]);

  // Filter and search rate cards locally for better UX
  const filteredRateCards = useMemo(() => {
    if (!rateCards) return [];
    
    return rateCards.filter(card => {
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [rateCards, searchQuery]);

  // Status configuration
  const statusConfig = {
    draft: { 
      label: 'Draft', 
      icon: Clock, 
      bgColor: 'var(--color-neutral-100)', 
      textColor: 'var(--color-neutral-600)',
      borderColor: 'var(--color-neutral-300)'
    },
    active: { 
      label: 'Published', 
      icon: CheckCircle, 
      bgColor: 'var(--color-success-light)', 
      textColor: 'var(--color-success-dark)',
      borderColor: 'var(--color-success)'
    },
    archived: { 
      label: 'Archived', 
      icon: Archive, 
      bgColor: 'var(--color-neutral-100)', 
      textColor: 'var(--color-neutral-500)',
      borderColor: 'var(--color-neutral-300)'
    },
    expired: { 
      label: 'Expired', 
      icon: AlertCircle, 
      bgColor: 'var(--color-warning-light)', 
      textColor: 'var(--color-warning-dark)',
      borderColor: 'var(--color-warning)'
    }
  };

  // Handle actions
  const handleCreateNew = () => {
    navigate('/dashboard/rate-cards/create');
  };

  const handleEditCard = (cardId) => {
    navigate(`/dashboard/rate-cards/${cardId}/edit`);
  };

  const handleViewCard = (cardId) => {
    navigate(`/dashboard/rate-cards/${cardId}`);
  };

  const handlePublishCard = async (cardId) => {
    try {
      await publishRateCard(cardId);
      // Refresh the list
      fetchRateCards({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        limit: 12
      });
    } catch (error) {
      console.error('Failed to publish rate card:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this rate card? This action cannot be undone.')) {
      try {
        await deleteRateCard(cardId);
        // Refresh the list
        fetchRateCards({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page: currentPage,
          limit: 12
        });
      } catch (error) {
        console.error('Failed to delete rate card:', error);
      }
    }
  };

  const handleViewPublic = (publicId) => {
    window.open(`${window.location.origin}/card/${publicId}`, '_blank');
  };

  const handleViewAnalytics = (cardId) => {
    navigate(`/dashboard/rate-cards/${cardId}/analytics`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get pricing range for a rate card
  const getPricingRange = (rateCard) => {
    if (!rateCard.pricing?.deliverables?.length) return null;
    
    const allRates = rateCard.pricing.deliverables.flatMap(d => 
      d.rates.map(r => r.pricing.userRate)
    );
    
    if (allRates.length === 0) return null;
    
    const min = Math.min(...allRates);
    const max = Math.max(...allRates);
    
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  // Loading state
  if (isLoading && !rateCards.length) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50), var(--color-accent-50))',
        padding: 'var(--space-6)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="animate-pulse">
            <div style={{ 
              height: '2rem', 
              backgroundColor: 'var(--color-neutral-200)', 
              borderRadius: 'var(--radius-md)', 
              width: '16rem', 
              marginBottom: 'var(--space-8)' 
            }}></div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: 'var(--space-6)' 
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: 'var(--radius-xl)', 
                  padding: 'var(--space-6)', 
                  boxShadow: 'var(--shadow-sm)' 
                }}>
                  <div style={{ 
                    height: '1rem', 
                    backgroundColor: 'var(--color-neutral-200)', 
                    borderRadius: 'var(--radius-base)', 
                    width: '75%', 
                    marginBottom: 'var(--space-4)' 
                  }}></div>
                  <div style={{ 
                    height: '0.75rem', 
                    backgroundColor: 'var(--color-neutral-200)', 
                    borderRadius: 'var(--radius-base)', 
                    width: '50%', 
                    marginBottom: 'var(--space-6)' 
                  }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      height: '0.75rem', 
                      backgroundColor: 'var(--color-neutral-200)', 
                      borderRadius: 'var(--radius-base)' 
                    }}></div>
                    <div style={{ 
                      height: '0.75rem', 
                      backgroundColor: 'var(--color-neutral-200)', 
                      borderRadius: 'var(--radius-base)', 
                      width: '66%' 
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50), var(--color-accent-50))'
    }}>
      {/* Header Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid var(--color-border)', 
        padding: 'var(--space-6) var(--space-6) var(--space-8)' 
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-6)'
          }}>
            {/* Title and Description */}
            <div>
              <h1 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-bold)', 
                color: 'var(--color-text)', 
                marginBottom: 'var(--space-2)',
                lineHeight: 'var(--leading-tight)'
              }}>
                My Rate Cards
              </h1>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: 'var(--text-lg)' 
              }}>
                Manage your professional rate cards and pricing packages
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <button
                onClick={handleCreateNew}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-semibold)',
                  boxShadow: 'var(--shadow-lg)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--duration-200) ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <Plus size={20} />
                Create Rate Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-4)', 
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 0%', maxWidth: '28rem' }}>
              <div style={{ 
                position: 'absolute', 
                left: 'var(--space-3)', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--color-neutral-400)' 
              }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search rate cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 'var(--space-10)',
                  paddingRight: 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                  paddingBottom: 'var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'white',
                  fontSize: 'var(--text-base)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-primary-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3) var(--space-4)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color var(--duration-200) ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--color-primary-500)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <Filter size={20} style={{ color: 'var(--color-neutral-500)' }} />
                  <span style={{ color: 'var(--color-text)' }}>
                    {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter]?.label}
                  </span>
                </button>

                {showFilterDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: 'var(--space-2)',
                    width: '12rem',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border)',
                    zIndex: 50
                  }}>
                    <div style={{ padding: 'var(--space-2)' }}>
                      {['all', 'draft', 'active', 'archived'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowFilterDropdown(false);
                            setCurrentPage(1);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-base)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            backgroundColor: statusFilter === status ? 'var(--color-primary-50)' : 'transparent',
                            color: statusFilter === status ? 'var(--color-primary-700)' : 'var(--color-text)'
                          }}
                          onMouseEnter={(e) => {
                            if (statusFilter !== status) {
                              e.target.style.backgroundColor = 'var(--color-neutral-50)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (statusFilter !== status) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {status !== 'all' && (
                            <div
                              style={{
                                width: 'var(--space-2)',
                                height: 'var(--space-2)',
                                borderRadius: '50%',
                                backgroundColor: statusConfig[status]?.borderColor
                              }}
                            />
                          )}
                          {status === 'all' ? 'All Status' : statusConfig[status]?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 var(--space-6) var(--space-12)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Error State */}
          {error && (
            <div style={{
              backgroundColor: 'var(--color-error-light)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <AlertCircle size={20} style={{ color: 'var(--color-error)' }} />
                <p style={{ color: 'var(--color-error-dark)' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRateCards.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
              <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  margin: '0 auto var(--space-6)',
                  background: 'linear-gradient(to bottom right, var(--color-primary-100), var(--color-secondary-100))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={48} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-4)'
                }}>
                  {searchQuery ? 'No matching rate cards' : 'No rate cards yet'}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {searchQuery 
                    ? 'Try adjusting your search terms or filters'
                    : 'Create your first professional rate card to start showcasing your pricing to brands'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleCreateNew}
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      padding: 'var(--space-3) var(--space-8)',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 'var(--font-semibold)',
                      boxShadow: 'var(--shadow-lg)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all var(--duration-200) ease',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'var(--shadow-lg)';
                    }}
                  >
                    Create Your First Rate Card
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Rate Cards Grid */}
          {filteredRateCards.length > 0 && (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: 'var(--space-6)' 
              }}>
                {filteredRateCards.map((card) => {
                  const statusInfo = statusConfig[card.version?.status] || statusConfig.draft;
                  const StatusIcon = statusInfo.icon;
                  const pricingRange = getPricingRange(card);

                  return (
                    <div
                      key={card._id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-neutral-100)',
                        overflow: 'hidden',
                        transition: 'box-shadow var(--duration-200) ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          justifyContent: 'space-between', 
                          marginBottom: 'var(--space-4)' 
                        }}>
                          <div style={{ flex: '1 1 0%' }}>
                            <h3 style={{
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-semibold)',
                              color: 'var(--color-text)',
                              marginBottom: 'var(--space-1)',
                              lineHeight: 'var(--leading-snug)',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                              overflow: 'hidden'
                            }}>
                              {card.title}
                            </h3>
                            {card.description && (
                              <p style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden'
                              }}>
                                {card.description}
                              </p>
                            )}
                          </div>

                          {/* Actions Dropdown */}
                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === card._id ? null : card._id)}
                              style={{
                                padding: 'var(--space-2)',
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                opacity: 0.6,
                                transition: 'all var(--duration-200) ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--color-neutral-100)';
                                e.target.style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.opacity = '0.6';
                              }}
                            >
                              <MoreVertical size={16} style={{ color: 'var(--color-neutral-500)' }} />
                            </button>

                            {activeDropdown === card._id && (
                              <div style={{
                                position: 'absolute',
                                right: 0,
                                marginTop: 'var(--space-2)',
                                width: '14rem',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--color-border)',
                                zIndex: 50
                              }}>
                                <div style={{ padding: 'var(--space-2)' }}>
                                  <button
                                    onClick={() => {
                                      handleViewCard(card._id);
                                      setActiveDropdown(null);
                                    }}
                                    style={{
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: 'var(--space-2) var(--space-4)',
                                      borderRadius: 'var(--radius-base)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-3)',
                                      color: 'var(--color-text)',
                                      backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>
                                  
                                  <button
                                    onClick={() => {
                                      handleEditCard(card._id);
                                      setActiveDropdown(null);
                                    }}
                                    style={{
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: 'var(--space-2) var(--space-4)',
                                      borderRadius: 'var(--radius-base)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-3)',
                                      color: 'var(--color-text)',
                                      backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                  >
                                    <Edit3 size={16} />
                                    Edit
                                  </button>

                                  {card.version?.status === 'draft' && (
                                    <button
                                      onClick={() => {
                                        handlePublishCard(card._id);
                                        setActiveDropdown(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-base)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        color: 'var(--color-success-dark)',
                                        backgroundColor: 'transparent'
                                      }}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                      <Share2 size={16} />
                                      Publish
                                    </button>
                                  )}

                                  {card.sharing?.publicId && (
                                    <button
                                      onClick={() => {
                                        handleViewPublic(card.sharing.publicId);
                                        setActiveDropdown(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-base)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        color: 'var(--color-accent)',
                                        backgroundColor: 'transparent'
                                      }}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                      <ExternalLink size={16} />
                                      View Public
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      handleViewAnalytics(card._id);
                                      setActiveDropdown(null);
                                    }}
                                    style={{
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: 'var(--space-2) var(--space-4)',
                                      borderRadius: 'var(--radius-base)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-3)',
                                      color: 'var(--color-text)',
                                      backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                  >
                                    <BarChart3 size={16} />
                                    Analytics
                                  </button>

                                  <hr style={{ margin: 'var(--space-2) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                                  
                                  <button
                                    onClick={() => {
                                      handleDeleteCard(card._id);
                                      setActiveDropdown(null);
                                    }}
                                    style={{
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: 'var(--space-2) var(--space-4)',
                                      borderRadius: 'var(--radius-base)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-3)',
                                      color: 'var(--color-error-dark)',
                                      backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-neutral-50)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-1) var(--space-3)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-medium)',
                            border: '1px solid',
                            marginBottom: 'var(--space-4)',
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.textColor,
                            borderColor: statusInfo.borderColor
                          }}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </div>

                        {/* Card Stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          {pricingRange && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              fontSize: 'var(--text-sm)'
                            }}>
                              <span style={{ color: 'var(--color-text-secondary)' }}>Price Range</span>
                              <span style={{ 
                                fontWeight: 'var(--font-semibold)', 
                                color: 'var(--color-text)' 
                              }}>
                                {pricingRange}
                              </span>
                            </div>
                          )}

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            fontSize: 'var(--text-sm)'
                          }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Platforms</span>
                            <span style={{ 
                              fontWeight: 'var(--font-medium)', 
                              color: 'var(--color-text)' 
                            }}>
                              {card.metrics?.platforms?.length || 0}
                            </span>
                          </div>

                          {card.packages?.length > 0 && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              fontSize: 'var(--text-sm)'
                            }}>
                              <span style={{ color: 'var(--color-text-secondary)' }}>Packages</span>
                              <span style={{ 
                                fontWeight: 'var(--font-medium)', 
                                color: 'var(--color-text)' 
                              }}>
                                {card.packages.length}
                              </span>
                            </div>
                          )}

                          {card.sharing?.analytics?.totalViews > 0 && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              fontSize: 'var(--text-sm)'
                            }}>
                              <span style={{ color: 'var(--color-text-secondary)' }}>Views</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                <Eye size={12} style={{ color: 'var(--color-neutral-400)' }} />
                                <span style={{ 
                                  fontWeight: 'var(--font-medium)', 
                                  color: 'var(--color-text)' 
                                }}>
                                  {card.sharing.analytics.totalViews}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div style={{ 
                        padding: 'var(--space-4) var(--space-6)', 
                        backgroundColor: 'var(--color-neutral-50)', 
                        borderTop: '1px solid var(--color-border)' 
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          fontSize: 'var(--text-xs)', 
                          color: 'var(--color-neutral-500)' 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            <Calendar size={12} />
                            Updated {formatDate(card.updatedAt)}
                          </div>
                          {card.totalReach > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                              <Users size={12} />
                              {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(card.totalReach)} reach
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginTop: 'var(--space-12)', 
                  gap: 'var(--space-2)' 
                }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'white',
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage <= 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    {[...Array(pagination.pages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            padding: 'var(--space-2) var(--space-4)',
                            border: '1px solid',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'colors var(--duration-200) ease',
                            backgroundColor: currentPage === page ? 'var(--color-primary-600)' : 'white',
                            color: currentPage === page ? 'white' : 'var(--color-text)',
                            borderColor: currentPage === page ? 'var(--color-primary-600)' : 'var(--color-border)'
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage >= pagination.pages}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'white',
                      cursor: currentPage >= pagination.pages ? 'not-allowed' : 'pointer',
                      opacity: currentPage >= pagination.pages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Click outside handler for dropdowns */}
      {(showFilterDropdown || activeDropdown) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40
          }}
          onClick={() => {
            setShowFilterDropdown(false);
            setActiveDropdown(null);
          }}
        />
      )}
    </div>
  );
};

export default RateCardDashboard;
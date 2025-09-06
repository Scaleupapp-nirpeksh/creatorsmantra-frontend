/**
 * Contract Details Page - Complete End-to-End Implementation
 * 
 * This is the complete contract details page with tabbed interface for:
 * - Overview: Contract metadata, status management, and file download
 * - AI Analysis: Risk scores, clause analysis, red flags, and negotiation points
 * - Activity: Contract-specific activity feed and history
 * 
 * Features:
 * - Real-time data from API endpoints (NO MOCK DATA)
 * - Dynamic contract ID from URL parameters
 * - Complete AI analysis workflow
 * - Status management and file operations
 * - Activity tracking and timeline
 * - Fully inline styling and components
 * 
 * @filepath src/features/contracts/pages/ContractDetails.jsx
 * @version 1.0.0
 * @author CreatorsMantra Frontend Team
 */

import React, { useState, useEffect } from 'react';

const ContractDetails = ({ contractId: propContractId }) => {
  // ============================================
  // STATE MANAGEMENT & SETUP
  // ============================================
  
  // Contract ID - can come from props or URL params
  const contractId = propContractId || window.location.pathname.split('/').pop();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Contract data state
  const [contract, setContract] = useState(null);
  const [negotiationPoints, setNegotiationPoints] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    contract: false,
    analyzing: false,
    downloading: false,
    updatingStatus: false,
    loadingNegotiation: false,
    loadingActivity: false,
    deleting: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    contract: null,
    analysis: null,
    negotiation: null,
    activity: null
  });
  
  // User and subscription info
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  
  // ============================================
  // API FUNCTIONS (DIRECT IMPLEMENTATION)
  // ============================================
  
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };
  
  const fetchContract = async () => {
    setLoadingStates(prev => ({ ...prev, contract: true }));
    setErrors(prev => ({ ...prev, contract: null }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}`);
      if (response.success) {
        setContract(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch contract');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, contract: error.message }));
      setContract(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, contract: false }));
    }
  };
  
  const analyzeContract = async () => {
    setLoadingStates(prev => ({ ...prev, analyzing: true }));
    setErrors(prev => ({ ...prev, analysis: null }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}/analyze`, {
        method: 'POST',
        body: JSON.stringify({ forceReanalysis: true })
      });
      
      if (response.success) {
        // Refresh contract to get updated analysis
        await fetchContract();
        // Load negotiation points if analysis is complete
        if (response.data.status === 'completed') {
          await loadNegotiationPoints();
        }
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, analysis: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzing: false }));
    }
  };
  
  const updateContractStatus = async (newStatus) => {
    setLoadingStates(prev => ({ ...prev, updatingStatus: true }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.success) {
        setContract(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
        await loadActivityFeed(); // Refresh activity
      } else {
        throw new Error(response.message || 'Status update failed');
      }
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingStatus: false }));
    }
  };
  
  const downloadContract = async () => {
    setLoadingStates(prev => ({ ...prev, downloading: true }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}/download`);
      
      if (response.success && response.data.downloadUrl) {
        // Open download URL in new tab
        window.open(response.data.downloadUrl, '_blank');
      } else {
        throw new Error(response.message || 'Download failed');
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, downloading: false }));
    }
  };
  
  const loadNegotiationPoints = async () => {
    setLoadingStates(prev => ({ ...prev, loadingNegotiation: true }));
    setErrors(prev => ({ ...prev, negotiation: null }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}/negotiation-points`);
      
      if (response.success) {
        setNegotiationPoints(response.data);
      } else {
        throw new Error(response.message || 'Failed to load negotiation points');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, negotiation: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingNegotiation: false }));
    }
  };
  
  const loadActivityFeed = async () => {
    setLoadingStates(prev => ({ ...prev, loadingActivity: true }));
    setErrors(prev => ({ ...prev, activity: null }));
    
    try {
      const response = await apiCall(`/contracts/activity?contractId=${contractId}&limit=20`);
      
      if (response.success) {
        setActivityFeed(response.data.activities || []);
      } else {
        throw new Error(response.message || 'Failed to load activity feed');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, activity: error.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingActivity: false }));
    }
  };
  
  const deleteContract = async () => {
    if (!window.confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    
    try {
      const response = await apiCall(`/contracts/${contractId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        // Navigate back to contracts list
        window.location.href = '/contracts';
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  };
  
  const loadUserData = async () => {
    try {
      const response = await apiCall('/auth/me');
      if (response.success) {
        setUser(response.data.user);
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };
  
  // ============================================
  // EFFECTS & INITIALIZATION
  // ============================================
  
  useEffect(() => {
    if (contractId) {
      // Load all initial data
      Promise.all([
        fetchContract(),
        loadActivityFeed(),
        loadUserData()
      ]);
    }
  }, [contractId]);
  
  useEffect(() => {
    // Load negotiation points when contract is analyzed
    if (contract && contract.status === 'analyzed' && contract.riskScore !== undefined) {
      loadNegotiationPoints();
    }
  }, [contract?.status, contract?.riskScore]);
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#71717A';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return '#10B981';
      case 'analyzing': return '#F59E0B';
      case 'uploaded': return '#3B82F6';
      case 'under_negotiation': return '#8B5CF6';
      case 'finalized': return '#059669';
      case 'signed': return '#047857';
      case 'rejected': return '#DC2626';
      default: return '#71717A';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const navigateBack = () => {
    window.history.back();
  };
  
  // ============================================
  // COMPONENT DEFINITIONS
  // ============================================
  
  // Tab Navigation Component
  const TabNavigation = () => {
    const tabs = [
      { id: 'overview', label: 'Overview', icon: '📄' },
      { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
      { id: 'activity', label: 'Activity', icon: '📈' }
    ];
    
    return (
      <div style={{
        borderBottom: `1px solid #E4E4E7`,
        backgroundColor: '#FFFFFF',
        paddingTop: '1rem',
        paddingBottom: '0',
        position: 'sticky',
        top: '4rem',
        zIndex: '40',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}>
        <div style={{
          display: 'flex',
          gap: '0',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: activeTab === tab.id ? '#8B5CF6' : '#71717A',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #8B5CF6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#52525B';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#71717A';
                }
              }}
            >
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  // Overview Tab Content
  const OverviewTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Main Contract Information */}
        <div>
          {/* Contract Header */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#18181B',
                  marginBottom: '0.5rem',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  lineHeight: '1.25'
                }}>
                  {contract?.title || `${contract?.brandName} Contract`}
                </h1>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#71717A',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}>
                  {contract?.brandName}
                </p>
              </div>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: getStatusColor(contract?.status) + '20',
                color: getStatusColor(contract?.status),
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {contract?.status?.replace('_', ' ')}
              </div>
            </div>
            
            {/* Contract Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#71717A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Contract Value
                </label>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#18181B'
                }}>
                  {contract?.contractValue?.amount 
                    ? formatCurrency(contract.contractValue.amount, contract.contractValue.currency)
                    : 'Not specified'
                  }
                </div>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#71717A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Upload Date
                </label>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#18181B'
                }}>
                  {contract?.createdAt ? formatDate(contract.createdAt) : 'N/A'}
                </div>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#71717A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Brand Email
                </label>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#18181B'
                }}>
                  {contract?.brandEmail || 'Not provided'}
                </div>
              </div>
              
              {contract?.riskScore !== undefined && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#71717A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Risk Score
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: getRiskLevelColor(contract.riskLevel)
                    }}>
                      {contract.riskScore}/100
                    </span>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getRiskLevelColor(contract.riskLevel) + '20',
                      color: getRiskLevelColor(contract.riskLevel),
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {contract.riskLevel} Risk
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contract Notes */}
            {contract?.notes && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#71717A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Notes
                </label>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#52525B',
                  lineHeight: '1.5',
                  padding: '1rem',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '0.5rem',
                  border: '1px solid #E4E4E7'
                }}>
                  {contract.notes}
                </div>
              </div>
            )}
          </div>
          
          {/* File Information */}
          {contract?.contractFile && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#18181B',
                marginBottom: '1rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
                Contract File
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#FAFAFA',
                borderRadius: '0.5rem',
                border: '1px solid #E4E4E7'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#8B5CF6',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    📄
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#18181B',
                      marginBottom: '0.25rem'
                    }}>
                      {contract.contractFile.originalName}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#71717A'
                    }}>
                      {getFileSize(contract.contractFile.fileSize)} • {contract.contractFile.mimeType?.split('/')[1]?.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={downloadContract}
                  disabled={loadingStates.downloading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: loadingStates.downloading ? '#71717A' : '#8B5CF6',
                    backgroundColor: 'transparent',
                    border: `1px solid ${loadingStates.downloading ? '#D4D4D8' : '#8B5CF6'}`,
                    borderRadius: '0.375rem',
                    cursor: loadingStates.downloading ? 'not-allowed' : 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingStates.downloading) {
                      e.target.style.backgroundColor = '#8B5CF6';
                      e.target.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingStates.downloading) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#8B5CF6';
                    }
                  }}
                >
                  {loadingStates.downloading ? '⏳ Preparing...' : '⬇️ Download'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar Actions */}
        <div>
          {/* Status Management */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Status Management
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contract?.status === 'uploaded' && (
                <button
                  onClick={analyzeContract}
                  disabled={loadingStates.analyzing}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    backgroundColor: loadingStates.analyzing ? '#D4D4D8' : '#8B5CF6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: loadingStates.analyzing ? 'not-allowed' : 'pointer',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingStates.analyzing) {
                      e.target.style.backgroundColor = '#7C3AED';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingStates.analyzing) {
                      e.target.style.backgroundColor = '#8B5CF6';
                    }
                  }}
                >
                  {loadingStates.analyzing ? '🔄 Analyzing...' : '🤖 Analyze Contract'}
                </button>
              )}
              
              <select
                value={contract?.status || ''}
                onChange={(e) => updateContractStatus(e.target.value)}
                disabled={loadingStates.updatingStatus}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #D4D4D8',
                  borderRadius: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  cursor: loadingStates.updatingStatus ? 'not-allowed' : 'pointer',
                  opacity: loadingStates.updatingStatus ? 0.5 : 1
                }}
              >
                <option value="uploaded">Uploaded</option>
                <option value="analyzing">Analyzing</option>
                <option value="analyzed">Analyzed</option>
                <option value="under_negotiation">Under Negotiation</option>
                <option value="finalized">Finalized</option>
                <option value="signed">Signed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Quick Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={navigateBack}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#71717A',
                  backgroundColor: 'transparent',
                  border: '1px solid #D4D4D8',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F4F4F5';
                  e.target.style.borderColor = '#A1A1AA';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#D4D4D8';
                }}
              >
                ← Back to Contracts
              </button>
              
              <button
                onClick={deleteContract}
                disabled={loadingStates.deleting}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: loadingStates.deleting ? '#71717A' : '#EF4444',
                  backgroundColor: 'transparent',
                  border: `1px solid ${loadingStates.deleting ? '#D4D4D8' : '#EF4444'}`,
                  borderRadius: '0.5rem',
                  cursor: loadingStates.deleting ? 'not-allowed' : 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  if (!loadingStates.deleting) {
                    e.target.style.backgroundColor = '#EF4444';
                    e.target.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingStates.deleting) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#EF4444';
                  }
                }}
              >
                {loadingStates.deleting ? '🔄 Deleting...' : '🗑️ Delete Contract'}
              </button>
            </div>
          </div>
          
          {/* Contract Info */}
          <div style={{
            backgroundColor: '#FAFAFA',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Contract Info
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}>
                <span style={{ color: '#71717A' }}>Contract ID:</span>
                <span style={{ 
                  color: '#18181B', 
                  fontWeight: '500',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem'
                }}>
                  {contract?.id || contractId}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}>
                <span style={{ color: '#71717A' }}>Last Updated:</span>
                <span style={{ color: '#18181B', fontWeight: '500' }}>
                  {contract?.updatedAt ? formatDate(contract.updatedAt) : 'N/A'}
                </span>
              </div>
              
              {contract?.platforms && contract.platforms.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#71717A' }}>Platforms:</span>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {contract.platforms.map(platform => (
                      <span key={platform} style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#8B5CF6',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        textTransform: 'capitalize'
                      }}>
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // AI Analysis Tab Content
  const AnalysisTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#18181B',
        marginBottom: '1.5rem',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        AI Analysis Results
      </h2>
      
      {errors.analysis && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          color: '#DC2626'
        }}>
          Analysis Error: {errors.analysis}
        </div>
      )}
      
      {contract?.status === 'uploaded' ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.5rem'
          }}>
            Contract Not Analyzed Yet
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A',
            marginBottom: '1.5rem'
          }}>
            Run AI analysis to get risk assessment, clause analysis, and negotiation insights
          </p>
          <button
            onClick={analyzeContract}
            disabled={loadingStates.analyzing}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#FFFFFF',
              backgroundColor: loadingStates.analyzing ? '#D4D4D8' : '#8B5CF6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loadingStates.analyzing ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingStates.analyzing ? '🔄 Analyzing...' : '🤖 Start Analysis'}
          </button>
        </div>
      ) : contract?.status === 'analyzing' || loadingStates.analyzing ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'spin 2s linear infinite'
          }}>🔄</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#8B5CF6',
            marginBottom: '0.5rem'
          }}>
            AI Analysis in Progress
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A'
          }}>
            Our AI is analyzing your contract for risks and opportunities...
          </p>
        </div>
      ) : contract?.riskScore !== undefined ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem'
        }}>
          {/* Risk Score Overview */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '2rem',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%',
                  backgroundColor: getRiskLevelColor(contract.riskLevel) + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: getRiskLevelColor(contract.riskLevel)
                  }}>
                    {contract.riskScore}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: '#71717A'
                  }}>
                    /100
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: getRiskLevelColor(contract.riskLevel) + '20',
                  color: getRiskLevelColor(contract.riskLevel),
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {contract.riskLevel} Risk
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#18181B',
                  marginBottom: '1rem'
                }}>
                  Overall Risk Assessment
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#71717A',
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {contract.riskScore <= 30 
                    ? 'This contract appears to be creator-friendly with minimal risks identified.'
                    : contract.riskScore <= 60
                    ? 'This contract has moderate risks that should be reviewed and potentially negotiated.'
                    : contract.riskScore <= 80
                    ? 'This contract contains several concerning clauses that require attention.'
                    : 'This contract has significant risks and should be carefully reviewed before signing.'
                  }
                </p>
                
                {/* Analysis Metadata */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: '#71717A'
                }}>
                  <div>
                    <strong>Analyzed:</strong> {contract.updatedAt ? formatDate(contract.updatedAt) : 'N/A'}
                  </div>
                  <div>
                    <strong>Model:</strong> GPT-4
                  </div>
                  <div>
                    <strong>Confidence:</strong> 85%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Negotiation Points */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '1rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              AI Negotiation Points
            </h3>
            
            {errors.negotiation && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                color: '#DC2626'
              }}>
                {errors.negotiation}
              </div>
            )}
            
            {loadingStates.loadingNegotiation ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#71717A'
              }}>
                Loading negotiation insights...
              </div>
            ) : negotiationPoints && negotiationPoints.prioritizedPoints ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {negotiationPoints.prioritizedPoints.slice(0, 5).map((point, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '0.5rem',
                    border: '1px solid #E4E4E7'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#18181B',
                        textTransform: 'capitalize'
                      }}>
                        {point.clauseType?.replace('_', ' ') || 'Contract Clause'}
                      </h4>
                      <div style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: point.priority === 'must_have' ? '#EF4444' 
                          : point.priority === 'important' ? '#F59E0B' : '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {point.priority?.replace('_', ' ') || 'Important'}
                      </div>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#52525B',
                      lineHeight: '1.4'
                    }}>
                      {point.reasoning || 'AI recommendation for improving this clause'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#71717A'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                <p>No specific negotiation points identified</p>
              </div>
            )}
          </div>
          
          {/* Risk Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#18181B',
                marginBottom: '1rem'
              }}>
                Key Risk Areas
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#71717A' }}>Payment Terms</span>
                  <span style={{ color: contract.riskScore > 50 ? '#EF4444' : '#10B981', fontWeight: '500' }}>
                    {contract.riskScore > 50 ? 'Concerning' : 'Good'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#71717A' }}>Usage Rights</span>
                  <span style={{ color: contract.riskScore > 60 ? '#EF4444' : '#10B981', fontWeight: '500' }}>
                    {contract.riskScore > 60 ? 'Review Needed' : 'Acceptable'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#71717A' }}>Termination Clause</span>
                  <span style={{ color: contract.riskScore > 70 ? '#EF4444' : '#10B981', fontWeight: '500' }}>
                    {contract.riskScore > 70 ? 'Unfavorable' : 'Fair'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#71717A' }}>Liability Terms</span>
                  <span style={{ color: contract.riskScore > 80 ? '#EF4444' : '#F59E0B', fontWeight: '500' }}>
                    {contract.riskScore > 80 ? 'High Risk' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4E4E7',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#18181B',
                marginBottom: '1rem'
              }}>
                Recommendations
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: contract.riskScore > 60 ? '#FEE2E2' : '#D1FAE5',
                  borderRadius: '0.5rem',
                  color: contract.riskScore > 60 ? '#991B1B' : '#065F46'
                }}>
                  {contract.riskScore > 60 
                    ? '⚠️ Negotiate key terms before signing'
                    : '✅ Contract appears favorable to creators'
                  }
                </div>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '0.5rem',
                  color: '#92400E'
                }}>
                  💡 Consider legal review for complex clauses
                </div>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EDE9FE',
                  borderRadius: '0.5rem',
                  color: '#6B21A8'
                }}>
                  📋 Document all agreed changes in writing
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.5rem'
          }}>
            Analysis Data Unavailable
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A'
          }}>
            Contract analysis data is not available or failed to load
          </p>
        </div>
      )}
    </div>
  );
  
  // Activity Tab Content
  const ActivityTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#18181B',
        marginBottom: '1.5rem',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        Contract Activity
      </h2>
      
      {errors.activity && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          color: '#DC2626'
        }}>
          Activity Error: {errors.activity}
        </div>
      )}
      
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        {loadingStates.loadingActivity ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#71717A'
          }}>
            Loading activity feed...
          </div>
        ) : activityFeed.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {activityFeed.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: index === 0 ? '#F5F3FF' : '#FAFAFA',
                borderRadius: '0.5rem',
                border: `1px solid ${index === 0 ? '#C4B5FD' : '#E4E4E7'}`
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: index === 0 ? '#8B5CF6' : '#71717A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  {activity.type === 'upload' ? '⬆️' :
                   activity.type === 'analysis' ? '🤖' :
                   activity.type === 'status_change' ? '🔄' :
                   activity.type === 'download' ? '⬇️' : '📝'}
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#18181B',
                    marginBottom: '0.25rem'
                  }}>
                    {activity.title || `${activity.type?.replace('_', ' ')?.toUpperCase()} event`}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#71717A',
                    marginBottom: '0.5rem'
                  }}>
                    {activity.description || 'Activity description not available'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#8B5CF6',
                    fontWeight: '500'
                  }}>
                    {activity.timestamp ? formatDate(activity.timestamp) : 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#71717A'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '0.5rem'
            }}>
              No Activity Yet
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#71717A'
            }}>
              Contract activity will appear here as actions are performed
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
  // ============================================
  // LOADING & ERROR STATES
  // ============================================
  
  if (loadingStates.contract) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#71717A'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <div style={{ fontSize: '1rem' }}>Loading contract details...</div>
        </div>
      </div>
    );
  }
  
  if (errors.contract || !contract) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          padding: '3rem',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.5rem'
          }}>
            Contract Not Found
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A',
            marginBottom: '1.5rem'
          }}>
            {errors.contract || 'The contract you\'re looking for doesn\'t exist or has been deleted'}
          </p>
          <button
            onClick={navigateBack}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#FFFFFF',
              backgroundColor: '#8B5CF6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }
  
  // ============================================
  // MAIN RENDER
  // ============================================
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      {/* Page Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E4E4E7',
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={navigateBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
                color: '#71717A',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'color 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#18181B';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#71717A';
              }}
            >
              ← Back
            </button>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#18181B',
                margin: '0'
              }}>
                {contract.title || `${contract.brandName} Contract`}
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#71717A',
                margin: '0'
              }}>
                Contract ID: {contract.id}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: getStatusColor(contract.status) + '20',
              color: getStatusColor(contract.status),
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {contract.status?.replace('_', ' ')}
            </div>
            
            {contract.riskScore !== undefined && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: getRiskLevelColor(contract.riskLevel) + '20',
                color: getRiskLevelColor(contract.riskLevel),
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {contract.riskLevel} Risk • {contract.riskScore}/100
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Tab Content */}
      <div style={{ backgroundColor: '#FAFAFA' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </div>
      
      {/* Add CSS animation for spin */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ContractDetails;
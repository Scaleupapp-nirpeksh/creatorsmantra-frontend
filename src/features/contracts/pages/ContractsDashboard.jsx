import React, { useState, useEffect, useRef } from 'react';
import useContractsStore from '../../../store/contractsStore';

const ContractsDashboard = () => {
  // ============================================
  // STATE MANAGEMENT & STORE
  // ============================================
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    brandName: ''
  });
  
  // Store state and actions
  const {
    contracts,
    totalContracts,
    currentPage,
    totalPages,
    isLoading,
    isUploading,
    uploadProgress,
    analytics,
    isLoadingAnalytics,
    uploadLimits,
    filters,
    fetchContracts,
    uploadContract,
    updateContractStatus,
    deleteContract,
    bulkUpdateStatus,
    bulkDeleteContracts,
    fetchDashboardAnalytics,
    fetchUploadLimits,
    updateFilters,
    searchContracts,
    analyzeContract,
    isAnalyzing,
    init
  } = useContractsStore();
  
  const fileInputRef = useRef(null);
  
  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    // Initialize store when component mounts
    init();
  }, [init]);
  
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
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('contractFile', file);
    formData.append('brandName', 'New Brand'); // This should come from a form
    
    try {
      const result = await uploadContract(formData);
      if (result.success) {
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  const handleBulkAction = async (action) => {
    if (selectedContracts.length === 0) return;
    
    try {
      if (action === 'delete') {
        await bulkDeleteContracts(selectedContracts);
      } else {
        await bulkUpdateStatus(selectedContracts, action);
      }
      setSelectedContracts([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };
  
  const handleAnalyzeContract = async (contractId) => {
    try {
      await analyzeContract(contractId);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };
  
  const handleFilterChange = async (newFilters) => {
    // Convert 'all' values to empty strings for API
    const apiFilters = {
      status: newFilters.status === 'all' ? '' : newFilters.status,
      riskLevel: newFilters.riskLevel === 'all' ? '' : newFilters.riskLevel,
      brandName: newFilters.brandName || ''
    };
    
    await updateFilters(apiFilters);
    setLocalFilters(newFilters);
  };
  
  const handleSearch = async (query) => {
    await searchContracts(query);
  };
  
  // ============================================
  // COMPONENTS
  // ============================================
  
  const TabNavigation = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: '📋' },
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'upload', label: 'Upload', icon: '⬆️' },
      { id: 'search', label: 'Search', icon: '🔍' }
    ];
    
    return (
      <div style={{
        borderBottom: '1px solid #E4E4E7',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingTop: '1rem',
        position: 'sticky',
        top: '0',
        zIndex: 50
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
                transition: 'all 150ms ease'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const ContractCard = ({ contract }) => {
    const isSelected = selectedContracts.includes(contract.id);
    
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        border: isSelected ? '2px solid #8B5CF6' : '1px solid #E4E4E7',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 200ms ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => {
        if (isSelected) {
          setSelectedContracts(prev => prev.filter(id => id !== contract.id));
        } else {
          setSelectedContracts(prev => [...prev, contract.id]);
        }
      }}>
        {/* Selection Checkbox */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '1.25rem',
          height: '1.25rem',
          border: isSelected ? '2px solid #8B5CF6' : '2px solid #D4D4D8',
          borderRadius: '0.25rem',
          backgroundColor: isSelected ? '#8B5CF6' : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        
        {/* Contract Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.25rem',
            lineHeight: '1.375'
          }}>
            {contract.title || `${contract.brandName} Contract`}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A'
          }}>
            {contract.brandName}
          </p>
        </div>
        
        {/* Status & Risk Level */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            backgroundColor: getStatusColor(contract.status) + '20',
            color: getStatusColor(contract.status),
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {contract.status?.replace('_', ' ')}
          </div>
          
          {contract.riskLevel && (
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
          )}
        </div>
        
        {/* Contract Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <div>
            <span style={{ color: '#71717A', fontWeight: '500' }}>Value:</span>
            <div style={{ color: '#18181B', fontWeight: '600' }}>
              {contract.contractValue?.amount 
                ? formatCurrency(contract.contractValue.amount, contract.contractValue.currency)
                : 'Not specified'
              }
            </div>
          </div>
          <div>
            <span style={{ color: '#71717A', fontWeight: '500' }}>Uploaded:</span>
            <div style={{ color: '#18181B', fontWeight: '600' }}>
              {formatDate(contract.createdAt)}
            </div>
          </div>
        </div>
        
        {/* Risk Score Bar */}
        {contract.riskScore !== null && contract.riskScore !== undefined && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#71717A'
              }}>Risk Score</span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: getRiskLevelColor(contract.riskLevel)
              }}>
                {contract.riskScore}/100
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#F4F4F5',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${contract.riskScore}%`,
                height: '100%',
                backgroundColor: getRiskLevelColor(contract.riskLevel),
                borderRadius: '9999px',
                transition: 'width 300ms ease'
              }} />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #F4F4F5'
        }}>
          <button style={{
            flex: '1',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#8B5CF6',
            backgroundColor: 'transparent',
            border: '1px solid #8B5CF6',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/contracts/${contract.id}`;
          }}>
            View Details
          </button>
          
          {contract.status === 'uploaded' && (
            <button style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#FFFFFF',
              backgroundColor: isAnalyzing ? '#D4D4D8' : '#8B5CF6',
              border: '1px solid #8B5CF6',
              borderRadius: '0.375rem',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease'
            }}
            disabled={isAnalyzing}
            onClick={(e) => {
              e.stopPropagation();
              handleAnalyzeContract(contract.id);
            }}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const DashboardTab = () => (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#18181B',
          marginBottom: '0.5rem'
        }}>
          Contracts Dashboard
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#71717A'
        }}>
          Manage your brand collaboration contracts with AI-powered insights
        </p>
      </div>
      
      {/* Quick Stats */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: '0.75rem',
          textAlign: 'center',
          minWidth: '8rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#8B5CF6'
          }}>
            {totalContracts}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#71717A',
            fontWeight: '500'
          }}>
            Total Contracts
          </div>
        </div>
        
        {analytics && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: '0.75rem',
            textAlign: 'center',
            minWidth: '8rem'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#10B981'
            }}>
              {Math.round(analytics.avgRiskScore || 0)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#71717A',
              fontWeight: '500'
            }}>
              Avg Risk Score
            </div>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '1rem',
        backgroundColor: '#FAFAFA',
        borderRadius: '0.75rem',
        border: '1px solid #E4E4E7',
        marginBottom: '2rem'
      }}>
        <input
          type="text"
          placeholder="Search contracts..."
          value={filters.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid #D4D4D8',
            borderRadius: '0.5rem',
            backgroundColor: '#FFFFFF'
          }}
        />
        
        <select
          value={localFilters.status}
          onChange={(e) => handleFilterChange({ ...localFilters, status: e.target.value })}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid #D4D4D8',
            borderRadius: '0.5rem',
            backgroundColor: '#FFFFFF'
          }}
        >
          <option value="all">All Status</option>
          <option value="uploaded">Uploaded</option>
          <option value="analyzing">Analyzing</option>
          <option value="analyzed">Analyzed</option>
          <option value="under_negotiation">Under Negotiation</option>
          <option value="finalized">Finalized</option>
          <option value="signed">Signed</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select
          value={localFilters.riskLevel}
          onChange={(e) => handleFilterChange({ ...localFilters, riskLevel: e.target.value })}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid #D4D4D8',
            borderRadius: '0.5rem',
            backgroundColor: '#FFFFFF'
          }}
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical Risk</option>
        </select>
      </div>
      
      {/* Bulk Actions */}
      {selectedContracts.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#EDE9FE',
          borderRadius: '0.75rem',
          border: '1px solid #C4B5FD',
          marginBottom: '1.5rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#7C3AED'
          }}>
            {selectedContracts.length} contract{selectedContracts.length > 1 ? 's' : ''} selected
          </span>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleBulkAction('analyzed')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#FFFFFF',
                backgroundColor: '#10B981',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Mark Analyzed
            </button>
            
            <button
              onClick={() => handleBulkAction('finalized')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#FFFFFF',
                backgroundColor: '#8B5CF6',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Mark Finalized
            </button>
            
            <button
              onClick={() => handleBulkAction('delete')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#FFFFFF',
                backgroundColor: '#EF4444',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
            
            <button
              onClick={() => setSelectedContracts([])}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#71717A',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D4D4D8',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Contracts Grid */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20rem',
          fontSize: '1rem',
          color: '#71717A'
        }}>
          Loading contracts...
        </div>
      ) : contracts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FAFAFA',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.5rem'
          }}>
            No contracts found
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A',
            marginBottom: '1.5rem'
          }}>
            Upload your first contract to get started with AI-powered analysis
          </p>
          <button
            onClick={() => setActiveTab('upload')}
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
            Upload Contract
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {contracts.map(contract => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
  
  const AnalyticsTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#18181B',
        marginBottom: '1.5rem'
      }}>
        Contract Analytics
      </h2>
      
      {isLoadingAnalytics ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20rem',
          fontSize: '1rem',
          color: '#71717A'
        }}>
          Loading analytics...
        </div>
      ) : analytics ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Risk Distribution */}
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
              Risk Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics.riskDistribution && Object.entries(analytics.riskDistribution).map(([level, count]) => (
                <div key={level} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#71717A',
                    textTransform: 'capitalize'
                  }}>
                    {level} Risk
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '0.5rem',
                      backgroundColor: '#F4F4F5',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${totalContracts > 0 ? (count / totalContracts) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: getRiskLevelColor(level),
                        borderRadius: '9999px'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#18181B'
                    }}>
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contract Status */}
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
              Contract Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics.contractsByStatus && Object.entries(analytics.contractsByStatus).map(([status, count]) => (
                <div key={status} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#71717A',
                    textTransform: 'capitalize'
                  }}>
                    {status.replace('_', ' ')}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: getStatusColor(status)
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FAFAFA',
          borderRadius: '0.75rem',
          border: '1px solid #E4E4E7'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#18181B',
            marginBottom: '0.5rem'
          }}>
            No analytics data available
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#71717A'
          }}>
            Upload and analyze contracts to see insights here
          </p>
        </div>
      )}
    </div>
  );
  
  const UploadTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#18181B',
        marginBottom: '1.5rem'
      }}>
        Upload New Contract
      </h2>
      
      {/* Upload Limits */}
      {uploadLimits && (
        <div style={{
          backgroundColor: '#F5F3FF',
          border: '1px solid #C4B5FD',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#7C3AED',
              fontWeight: '500'
            }}>
              Upload Usage: {uploadLimits.currentUsage} / {uploadLimits.monthlyLimit === -1 ? '∞' : uploadLimits.monthlyLimit}
            </span>
            <div style={{
              fontSize: '0.75rem',
              color: '#8B5CF6',
              backgroundColor: '#FFFFFF',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: '500'
            }}>
              {uploadLimits.subscriptionTier?.toUpperCase()}
            </div>
          </div>
          
          {uploadLimits.monthlyLimit > 0 && (
            <div style={{
              marginTop: '0.5rem',
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#E5E7EB',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(uploadLimits.currentUsage / uploadLimits.monthlyLimit) * 100}%`,
                height: '100%',
                backgroundColor: '#8B5CF6',
                borderRadius: '9999px'
              }} />
            </div>
          )}
        </div>
      )}
      
      {/* Upload Area */}
      <div
        style={{
          border: isUploading ? '2px solid #8B5CF6' : '2px dashed #D4D4D8',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: isUploading ? '#F5F3FF' : '#FAFAFA',
          cursor: (uploadLimits?.canUpload && !isUploading) ? 'pointer' : 'not-allowed',
          transition: 'all 200ms ease',
          opacity: uploadLimits?.canUpload ? 1 : 0.5
        }}
        onClick={() => {
          if (uploadLimits?.canUpload && !isUploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          disabled={!uploadLimits?.canUpload || isUploading}
        />
        
        {isUploading ? (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#8B5CF6',
              marginBottom: '0.5rem'
            }}>
              Uploading Contract...
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#71717A',
              marginBottom: '1rem'
            }}>
              Please wait while we process your file
            </p>
            <div style={{
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto',
              height: '0.5rem',
              backgroundColor: '#E5E7EB',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#8B5CF6',
                borderRadius: '9999px',
                transition: 'width 300ms ease'
              }} />
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: '#8B5CF6',
              marginTop: '0.5rem',
              fontWeight: '500'
            }}>
              {uploadProgress}% complete
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#18181B',
              marginBottom: '0.5rem'
            }}>
              {uploadLimits?.canUpload ? 'Drop your contract here' : 'Upload limit reached'}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#71717A',
              marginBottom: '1rem'
            }}>
              {uploadLimits?.canUpload 
                ? 'Supports PDF, DOC, DOCX, JPG, PNG files up to 25MB'
                : 'Upgrade your plan to upload more contracts'
              }
            </p>
            {uploadLimits?.canUpload && (
              <button
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
                Choose File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  const SearchTab = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#18181B',
        marginBottom: '1.5rem'
      }}>
        Advanced Contract Search
      </h2>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: '1' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Search Query
            </label>
            <input
              type="text"
              placeholder="Search contract content, clauses, terms..."
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #D4D4D8',
                borderRadius: '0.5rem',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>
          
          <input
            type="text"
            placeholder="Filter by brand..."
            value={localFilters.brandName}
            onChange={(e) => handleFilterChange({ ...localFilters, brandName: e.target.value })}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              border: '1px solid #D4D4D8',
              borderRadius: '0.5rem',
              backgroundColor: '#FFFFFF',
              minWidth: '200px'
            }}
          />
        </div>
      </div>
      
      {/* Search Results */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#18181B',
          marginBottom: '1rem'
        }}>
          Search Results
        </h3>
        
        {filters.search ? (
          <div>
            <p style={{
              fontSize: '0.875rem',
              color: '#71717A',
              marginBottom: '1rem'
            }}>
              Showing results for: <strong>"{filters.search}"</strong>
            </p>
            
            {contracts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1rem'
              }}>
                {contracts.map(contract => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#71717A'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <p>No contracts found matching your search criteria</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#71717A'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <p>Enter a search query to find contracts</p>
          </div>
        )}
      </div>
    </div>
  );
  
  // ============================================
  // MAIN RENDER
  // ============================================
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid #E4E4E7',
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: '0',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#18181B',
              margin: '0'
            }}>
              Contracts
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#71717A',
              margin: '0'
            }}>
              Manage your brand collaboration contracts
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#FFFFFF',
              backgroundColor: '#8B5CF6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <span>⬆️</span>
            Upload Contract
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'search' && <SearchTab />}
      </div>
    </div>
  );
};

export default ContractsDashboard;
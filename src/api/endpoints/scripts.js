// src/api/endpoints/scripts.js
import { api } from '../client'

export const scriptsAPI = {
  // ============================================
  // SCRIPT CREATION ENDPOINTS
  // ============================================

  createTextScript: (data) => api.post('/scripts/create-text', data),

  createFileScript: (data) =>
    api.post('/scripts/create-file', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  createVideoScript: (data) =>
    api.post('/scripts/create-video', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // ============================================
  // SCRIPT RETRIEVAL ENDPOINTS
  // ============================================

  getDashboardStats: () => api.get('/scripts/dashboard/stats'),

  getScriptMetadata: () => api.get('/scripts/metadata'),

  getScriptsNeedingAttention: () => api.get('/scripts/attention-required'),

  getAvailableDeals: () => api.get('/scripts/available-deals'),

  getUserScripts: (params = {}) => api.get('/scripts', { params }),

  getScriptsByStatus: (status) => api.get(`/scripts/status/${status}`),

  getScriptById: (scriptId) => api.get(`/scripts/${scriptId}`),

  getScriptAnalysis: (scriptId) => api.get(`/scripts/${scriptId}/analysis`),

  exportScriptContent: (scriptId, format = 'json') =>
    api.get(`/scripts/${scriptId}/export`, {
      params: { format },
      responseType: format === 'text' ? 'blob' : 'json',
    }),

  // ============================================
  // SCRIPT UPDATE ENDPOINTS
  // ============================================

  updateScript: (scriptId, updateData) => api.patch(`/scripts/${scriptId}`, updateData),

  updateScriptStatus: (scriptId, status, reason = null, oldStatus = null) =>
    api.patch(`/scripts/${scriptId}/status`, {
      status,
      reason,
      oldStatus,
    }),

  updateCreatorNotes: (scriptId, notes) => api.patch(`/scripts/${scriptId}/notes`, { notes }),

  updateScriptTags: (scriptId, tags) => api.patch(`/scripts/${scriptId}/tags`, { tags }),

  bulkUpdateScripts: (scriptIds, updateData) =>
    api.patch('/scripts/bulk-update', { scriptIds, updateData }),

  // ============================================
  // AI PROCESSING ENDPOINTS
  // ============================================

  regenerateScript: (scriptId) => api.post(`/scripts/${scriptId}/regenerate`),

  getGenerationStatus: (scriptId) => api.get(`/scripts/${scriptId}/generation-status`),

  createScriptVariation: (scriptId, variationData) =>
    api.post(`/scripts/${scriptId}/variations`, variationData),

  getScriptVariations: (scriptId) => api.get(`/scripts/${scriptId}/variations`),

  // ============================================
  // DEAL CONNECTION ENDPOINTS
  // ============================================

  linkScriptToDeal: (scriptId, dealId) => api.post(`/scripts/${scriptId}/link-deal/${dealId}`),

  unlinkScriptFromDeal: (scriptId) => api.delete(`/scripts/${scriptId}/unlink-deal`),

  // ============================================
  // SEARCH AND UTILITY ENDPOINTS
  // ============================================

  searchScripts: (searchData) => api.post('/scripts/search', searchData),

  deleteScript: (scriptId) => api.delete(`/scripts/${scriptId}`),

  // ============================================
  // HEALTH AND DEBUG ENDPOINTS
  // ============================================

  getScriptsHealth: () => api.get('/scripts/health'),

  getUploadLimits: () => api.get('/scripts/debug/limits'),

  // ============================================
  // HELPER METHODS
  // ============================================

  createScriptWithFile: (scriptData, file, inputType = 'file_upload') => {
    const formData = new FormData()

    if (inputType === 'video_transcription') {
      formData.append('videoFile', file)
    } else {
      formData.append('scriptFile', file)
    }

    Object.keys(scriptData).forEach((key) => {
      if (scriptData[key] !== null && scriptData[key] !== undefined) {
        if (Array.isArray(scriptData[key])) {
          formData.append(key, JSON.stringify(scriptData[key]))
        } else {
          formData.append(key, scriptData[key])
        }
      }
    })

    const endpoint =
      inputType === 'video_transcription' ? '/scripts/create-video' : '/scripts/create-file'

    return api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  pollGenerationStatus: async (scriptId, maxAttempts = 30, interval = 2000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await api.get(`/scripts/${scriptId}/generation-status`)
        const { status, isGenerationComplete } = response.data

        if (isGenerationComplete || status === 'failed') {
          return response.data
        }
      } catch (error) {
        if (attempt === maxAttempts) throw error
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
    }

    throw new Error('Generation status polling timeout')
  },
}

// Export individual functions
export const {
  createTextScript,
  createFileScript,
  createVideoScript,
  getDashboardStats,
  getScriptMetadata,
  getScriptsNeedingAttention,
  getAvailableDeals,
  getUserScripts,
  getScriptsByStatus,
  getScriptById,
  getScriptAnalysis,
  exportScriptContent,
  updateScript,
  updateScriptStatus,
  updateCreatorNotes,
  updateScriptTags,
  bulkUpdateScripts,
  regenerateScript,
  getGenerationStatus,
  createScriptVariation,
  getScriptVariations,
  linkScriptToDeal,
  unlinkScriptFromDeal,
  searchScripts,
  deleteScript,
  getScriptsHealth,
  getUploadLimits,
  createScriptWithFile,
  pollGenerationStatus,
} = scriptsAPI

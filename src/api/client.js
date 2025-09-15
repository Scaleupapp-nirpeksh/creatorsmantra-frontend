import axios from 'axios'
import { toast } from 'react-hot-toast'

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000

// Storage Keys
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'cm_'
const AUTH_TOKEN_KEY = STORAGE_PREFIX + (import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token')
const REFRESH_TOKEN_KEY =
  STORAGE_PREFIX + (import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token')

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Token Management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clearTokens: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// Request Queue for Token Refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = tokenManager.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Add request timestamp
    config.metadata = { startTime: new Date() }

    // Log request in development
    // if (import.meta.env.VITE_ENV === 'development')
    //   console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // Calculate request duration
    if (originalRequest?.metadata?.startTime) {
      const duration = new Date() - originalRequest.metadata.startTime
      if (import.meta.env.DEV) {
        console.error(
          `❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - ${duration}ms`,
          error.response?.data || error.message
        )
      }
    }

    // Handle 401 Unauthorized - Token Expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Refresh token is also invalid
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Token refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        const refreshToken = tokenManager.getRefreshToken()

        if (!refreshToken) {
          tokenManager.clearTokens()
          window.location.href = '/login'
          return reject(error)
        }

        apiClient
          .post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            const { accessToken, refreshToken: newRefreshToken } = data
            tokenManager.setTokens(accessToken, newRefreshToken)
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            processQueue(null, accessToken)
            resolve(apiClient(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            tokenManager.clearTokens()
            window.location.href = '/login'
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    // Handle other error responses
    handleApiError(error)
    return Promise.reject(error)
  }
)

// Error Handler
const handleApiError = (error) => {
  let message = 'An unexpected error occurred'

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response

    switch (status) {
      case 400:
        message = data.message || 'Invalid request'
        break
      case 401:
        message = 'Please login to continue'
        break
      case 403:
        message = data.message || 'You do not have permission to perform this action'
        break
      case 404:
        message = data.message || 'Resource not found'
        break
      case 409:
        message = data.message || 'Conflict with existing data'
        break
      case 422:
        message = data.message || 'Validation failed'
        if (data.errors) {
          message += ': ' + Object.values(data.errors).flat().join(', ')
        }
        break
      case 429:
        message = 'Too many requests. Please try again later'
        break
      case 500:
        message = 'Server error. Please try again later'
        break
      case 503:
        message = 'Service temporarily unavailable'
        break
      default:
        message = data.message || message
    }
  } else if (error.request) {
    // Request made but no response
    message = 'Network error. Please check your connection'
  } else {
    // Request setup error
    message = error.message
  }

  // Show error toast (skip for 401 as it redirects to login)
  if (error.response?.status !== 401) {
    toast.error(message)
  }
}

// API Methods
export const api = {
  // GET request
  get: (url, config = {}) => apiClient.get(url, config),

  // POST request
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),

  // File upload
  upload: (url, formData, onProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
  },

  // File download
  download: (url, filename) => {
    return apiClient
      .get(url, {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
  },
}

// Request cancellation
export const createCancelToken = () => {
  const source = axios.CancelToken.source()
  return {
    token: source.token,
    cancel: source.cancel,
  }
}

// Batch requests
export const batchRequests = async (requests) => {
  try {
    const responses = await Promise.all(requests)
    return responses
  } catch (error) {
    console.error('Batch request failed:', error)
    throw error
  }
}

// Retry mechanism
export const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

export default apiClient

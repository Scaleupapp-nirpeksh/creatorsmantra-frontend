import { api } from '../client';

export const authAPI = {
  // Public endpoints
  checkPhone: (phone) => 
    api.post('/auth/check-phone', { phone }),
  
  sendOTP: (phone) => 
    api.post('/auth/send-otp', { phone }),
  
  verifyOTP: (phone, otp) => 
    api.post('/auth/verify-otp', { phone, otp }),
  
  register: (data) => 
    api.post('/auth/register', data),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  loginWithOTP: (phone, otp) => 
    api.post('/auth/login-otp', { phone, otp }),
  
  resetPassword: (email) => 
    api.post('/auth/reset-password', { email }),
  
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh', { refreshToken }),
  
  getSubscriptionTiers: () => 
    api.get('/auth/subscription-tiers'),
  
  acceptManagerInvitation: (token, data) => 
    api.post('/auth/accept-manager-invitation', { token, ...data }),
  
  // Protected endpoints
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (data) => 
    api.put('/auth/profile', data),
  
  inviteManager: (email, permissions) => 
    api.post('/auth/invite-manager', { email, permissions }),
  
  getSuggestedRates: () => 
    api.get('/auth/suggested-rates'),
  
  checkFeatureAccess: () => 
    api.get('/auth/feature-access'),
  
  logout: () => 
    api.post('/auth/logout'),
  
  deleteAccount: (password) => 
    api.delete('/auth/account', { data: { password } }),
};
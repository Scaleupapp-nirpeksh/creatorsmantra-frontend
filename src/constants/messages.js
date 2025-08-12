/**
 * CreatorsMantra Frontend - Message Constants
 * Centralized messaging system for UI text, notifications, and user communication
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description Error messages, success messages, validation messages, and UI text
 * @path src/constants/messages.js
 */

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
    // Authentication
    LOGIN_SUCCESS: 'Welcome back! You have been successfully logged in.',
    LOGOUT_SUCCESS: 'You have been successfully logged out.',
    REGISTER_SUCCESS: 'Account created successfully! Welcome to CreatorsMantra.',
    OTP_SENT: 'OTP has been sent to your mobile number.',
    OTP_VERIFIED: 'OTP verified successfully.',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully.',
    PROFILE_UPDATED: 'Your profile has been updated successfully.',
    
    // Deal CRM
    DEAL_CREATED: 'Deal created successfully and added to your pipeline.',
    DEAL_UPDATED: 'Deal information updated successfully.',
    DEAL_DELETED: 'Deal has been deleted successfully.',
    DEAL_ARCHIVED: 'Deal has been archived successfully.',
    DEAL_STAGE_UPDATED: 'Deal stage updated successfully.',
    COMMUNICATION_ADDED: 'Communication logged successfully.',
    DELIVERABLE_UPDATED: 'Deliverable status updated successfully.',
    BRAND_PROFILE_UPDATED: 'Brand profile updated successfully.',
    
    // Invoices
    INVOICE_CREATED: 'Invoice created successfully.',
    INVOICE_UPDATED: 'Invoice updated successfully.',
    INVOICE_DELETED: 'Invoice deleted successfully.',
    PAYMENT_RECORDED: 'Payment recorded successfully.',
    PAYMENT_VERIFIED: 'Payment verified successfully.',
    PDF_GENERATED: 'Invoice PDF generated successfully.',
    TAX_PREFERENCES_UPDATED: 'Tax preferences updated successfully.',
    REMINDER_SCHEDULED: 'Payment reminder scheduled successfully.',
    CONSOLIDATED_INVOICE_CREATED: 'Consolidated invoice created successfully.',
    
    // Rate Cards
    RATE_CARD_CREATED: 'Rate card created successfully.',
    RATE_CARD_UPDATED: 'Rate card updated successfully.',
    RATE_CARD_DELETED: 'Rate card deleted successfully.',
    RATE_CARD_SHARED: 'Rate card shared successfully. Link copied to clipboard.',
    RATE_CARD_CLONED: 'Rate card cloned successfully.',
    PACKAGE_CREATED: 'Package added successfully.',
    AI_SUGGESTIONS_GENERATED: 'AI pricing suggestions generated successfully.',
    
    // Brief Analyzer
    BRIEF_CREATED: 'Brief created successfully.',
    BRIEF_UPDATED: 'Brief updated successfully.',
    BRIEF_DELETED: 'Brief deleted successfully.',
    FILE_UPLOADED: 'File uploaded successfully. Processing will begin shortly.',
    AI_EXTRACTION_COMPLETE: 'AI analysis completed successfully.',
    CLARIFICATION_EMAIL_GENERATED: 'Clarification email generated successfully.',
    BRIEF_CONVERTED_TO_DEAL: 'Brief converted to deal successfully.',
    
    // Performance Vault
    CAMPAIGN_CREATED: 'Campaign created successfully.',
    CAMPAIGN_UPDATED: 'Campaign updated successfully.',
    CAMPAIGN_DELETED: 'Campaign archived successfully.',
    SCREENSHOT_UPLOADED: 'Screenshot uploaded successfully.',
    SCREENSHOT_DELETED: 'Screenshot deleted successfully.',
    REPORT_GENERATED: 'Performance report generated successfully.',
    REPORT_SHARED: 'Report shared successfully.',
    ANALYSIS_GENERATED: 'AI analysis generated successfully.',
    
    // Contracts
    CONTRACT_UPLOADED: 'Contract uploaded successfully.',
    CONTRACT_ANALYZED: 'Contract analysis completed successfully.',
    CONTRACT_DELETED: 'Contract deleted successfully.',
    NEGOTIATION_SAVED: 'Negotiation details saved successfully.',
    CONTRACT_CONVERTED_TO_DEAL: 'Contract converted to deal successfully.',
    
    // Analytics
    INSIGHTS_GENERATED: 'Business insights generated successfully.',
    CACHE_CLEARED: 'Analytics cache cleared successfully.',
    REPORT_EXPORTED: 'Analytics report exported successfully.',
    
    // Subscriptions
    PAYMENT_VERIFIED_SUCCESSFULLY: 'Payment verified successfully. Your subscription is now active.',
    SUBSCRIPTION_UPGRADED: 'Subscription upgraded successfully.',
    SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully.',
    AUTO_RENEWAL_UPDATED: 'Auto-renewal settings updated successfully.',
    
    // General
    SETTINGS_SAVED: 'Settings saved successfully.',
    FILE_UPLOADED_SUCCESS: 'File uploaded successfully.',
    COPY_TO_CLIPBOARD: 'Copied to clipboard successfully.',
    EMAIL_SENT: 'Email sent successfully.',
    DATA_EXPORTED: 'Data exported successfully.',
    CHANGES_SAVED: 'Changes saved successfully.',
  };
  
  // ============================================
  // ERROR MESSAGES
  // ============================================
  
  export const ERROR_MESSAGES = {
    // Authentication errors
    INVALID_CREDENTIALS: 'Invalid email/phone or password. Please try again.',
    INVALID_OTP: 'Invalid OTP. Please check and try again.',
    OTP_EXPIRED: 'OTP has expired. Please request a new one.',
    OTP_SEND_FAILED: 'Failed to send OTP. Please try again.',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
    PHONE_ALREADY_EXISTS: 'An account with this phone number already exists.',
    WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    
    // Validation errors
    FIELD_REQUIRED: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid Indian mobile number.',
    INVALID_GST: 'Please enter a valid GST number.',
    INVALID_PAN: 'Please enter a valid PAN number.',
    INVALID_IFSC: 'Please enter a valid IFSC code.',
    INVALID_DATE: 'Please enter a valid date.',
    INVALID_AMOUNT: 'Please enter a valid amount.',
    AMOUNT_TOO_LOW: 'Amount must be greater than ₹0.',
    AMOUNT_TOO_HIGH: 'Amount exceeds maximum limit.',
    
    // File upload errors
    FILE_TOO_LARGE: 'File size exceeds the maximum limit for your subscription plan.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload supported file formats only.',
    FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
    FILE_CORRUPTED: 'File appears to be corrupted. Please try uploading again.',
    MULTIPLE_FILES_NOT_ALLOWED: 'Only one file can be uploaded at a time.',
    
    // Deal CRM errors
    DEAL_NOT_FOUND: 'Deal not found or you do not have permission to access it.',
    DEAL_CREATION_FAILED: 'Failed to create deal. Please try again.',
    DEAL_UPDATE_FAILED: 'Failed to update deal. Please try again.',
    DEAL_DELETE_FAILED: 'Failed to delete deal. Please try again.',
    INVALID_DEAL_STAGE: 'Invalid deal stage selected.',
    BRAND_NOT_FOUND: 'Brand profile not found.',
    DUPLICATE_DEAL: 'A similar deal already exists for this brand.',
    
    // Invoice errors
    INVOICE_NOT_FOUND: 'Invoice not found or you do not have permission to access it.',
    INVOICE_CREATION_FAILED: 'Failed to create invoice. Please try again.',
    INVOICE_UPDATE_FAILED: 'Failed to update invoice. Please try again.',
    PAYMENT_RECORDING_FAILED: 'Failed to record payment. Please try again.',
    PDF_GENERATION_FAILED: 'Failed to generate PDF. Please try again.',
    INVALID_TAX_SETTINGS: 'Invalid tax settings. Please check your configuration.',
    NO_DEALS_AVAILABLE: 'No deals available for invoice creation.',
    INSUFFICIENT_PAYMENT_INFO: 'Insufficient payment information provided.',
    
    // Rate card errors
    RATE_CARD_NOT_FOUND: 'Rate card not found or you do not have permission to access it.',
    RATE_CARD_CREATION_FAILED: 'Failed to create rate card. Please try again.',
    INVALID_RATE_AMOUNT: 'Please enter valid rate amounts.',
    PACKAGE_CREATION_FAILED: 'Failed to create package. Please try again.',
    AI_SUGGESTIONS_FAILED: 'Failed to generate AI suggestions. Please try again.',
    
    // Brief analyzer errors
    BRIEF_NOT_FOUND: 'Brief not found or you do not have permission to access it.',
    BRIEF_CREATION_FAILED: 'Failed to create brief. Please try again.',
    AI_EXTRACTION_FAILED: 'AI extraction failed. Please try manual entry or contact support.',
    BRIEF_PROCESSING_ERROR: 'Error processing brief. Please try again.',
    UNSUPPORTED_FILE_FORMAT: 'Unsupported file format for brief analysis.',
    BRIEF_CONVERSION_FAILED: 'Failed to convert brief to deal. Please try again.',
    
    // Performance vault errors
    CAMPAIGN_NOT_FOUND: 'Campaign not found or you do not have permission to access it.',
    CAMPAIGN_CREATION_FAILED: 'Failed to create campaign. Please try again.',
    SCREENSHOT_UPLOAD_FAILED: 'Failed to upload screenshot. Please try again.',
    ANALYSIS_GENERATION_FAILED: 'Failed to generate analysis. Please try again.',
    REPORT_GENERATION_FAILED: 'Failed to generate report. Please try again.',
    INVALID_CAMPAIGN_DATA: 'Invalid campaign data provided.',
    
    // Contract errors
    CONTRACT_NOT_FOUND: 'Contract not found or you do not have permission to access it.',
    CONTRACT_UPLOAD_FAILED: 'Failed to upload contract. Please try again.',
    CONTRACT_ANALYSIS_FAILED: 'Contract analysis failed. Please try again.',
    NEGOTIATION_SAVE_FAILED: 'Failed to save negotiation details. Please try again.',
    
    // Analytics errors
    ANALYTICS_COMPUTATION_ERROR: 'Analytics computation failed. Please try again.',
    AI_SERVICE_ERROR: 'AI service temporarily unavailable. Please try again later.',
    INSUFFICIENT_DATA: 'Insufficient data for analytics computation. Complete more deals to enable analytics.',
    CACHE_ERROR: 'Cache operation failed. Data will be fetched fresh.',
    
    // Subscription errors
    PAYMENT_VERIFICATION_FAILED: 'Payment verification failed. Please check your payment details.',
    SUBSCRIPTION_UPGRADE_FAILED: 'Subscription upgrade failed. Please try again.',
    SUBSCRIPTION_REQUIRED: 'This feature requires a higher subscription plan.',
    FEATURE_NOT_AVAILABLE: 'This feature is not available in your current plan.',
    BILLING_INFO_MISSING: 'Billing information is missing. Please update your profile.',
    
    // Network and server errors
    NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait before trying again.',
    
    // Generic errors
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    OPERATION_FAILED: 'Operation failed. Please try again.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    RESOURCE_NOT_FOUND: 'Requested resource not found.',
    INVALID_REQUEST: 'Invalid request. Please check your input.',
    MAINTENANCE_MODE: 'System is under maintenance. Please try again later.',
  };
  
  // ============================================
  // WARNING MESSAGES
  // ============================================
  
  export const WARNING_MESSAGES = {
    // Data warnings
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    DATA_WILL_BE_LOST: 'This action will permanently delete your data. Are you sure?',
    IRREVERSIBLE_ACTION: 'This action cannot be undone. Please confirm.',
    
    // Subscription warnings
    TRIAL_ENDING_SOON: 'Your trial period ends in {days} days. Upgrade to continue using all features.',
    SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Some features may be limited.',
    PAYMENT_DUE: 'Your payment is overdue. Please update your payment to avoid service interruption.',
    FEATURE_LIMIT_REACHED: 'You have reached the limit for this feature in your current plan.',
    
    // Usage warnings
    STORAGE_LIMIT_APPROACHING: 'You are approaching your storage limit. Consider upgrading your plan.',
    API_LIMIT_APPROACHING: 'You are approaching your API usage limit for this month.',
    FILE_SIZE_WARNING: 'Large files may take longer to process.',
    
    // Security warnings
    WEAK_PASSWORD_WARNING: 'Your password is weak. Consider using a stronger password.',
    LOGIN_FROM_NEW_DEVICE: 'Login detected from a new device. If this was not you, please secure your account.',
    
    // Business warnings
    MISSING_BANK_DETAILS: 'Bank details are missing. Add them to receive payments.',
    INCOMPLETE_PROFILE: 'Your profile is incomplete. Complete it to unlock all features.',
    NO_RATE_CARD: 'You haven\'t created any rate cards yet. Create one to start sharing with brands.',
    OVERDUE_INVOICES: 'You have {count} overdue invoices. Consider sending reminders.',
  };
  
  // ============================================
  // INFO MESSAGES
  // ============================================
  
  export const INFO_MESSAGES = {
    // Feature information
    AI_FEATURE_INFO: 'AI features are available in Pro and higher plans.',
    UPGRADE_FOR_FEATURES: 'Upgrade your plan to unlock advanced features like AI analysis and unlimited storage.',
    BETA_FEATURE: 'This feature is in beta. Your feedback helps us improve.',
    
    // Process information
    PROCESSING_REQUEST: 'Processing your request. This may take a few moments.',
    AI_ANALYSIS_IN_PROGRESS: 'AI analysis is in progress. You will be notified when it\'s complete.',
    PDF_GENERATION_IN_PROGRESS: 'Generating PDF. This may take a few moments.',
    SYNC_IN_PROGRESS: 'Syncing your data. Please wait.',
    
    // Usage tips
    TIP_KEYBOARD_SHORTCUTS: 'Press Ctrl+K to open quick actions.',
    TIP_BULK_OPERATIONS: 'Select multiple items to perform bulk operations.',
    TIP_EXPORT_DATA: 'You can export your data from the settings page.',
    
    // Onboarding
    WELCOME_MESSAGE: 'Welcome to CreatorsMantra! Let\'s set up your profile to get started.',
    SETUP_COMPLETE: 'Great! Your setup is complete. You can now start managing your creator business.',
    TOUR_AVAILABLE: 'Take a quick tour to learn about all features.',
    
    // Updates
    NEW_FEATURES_AVAILABLE: 'New features are available! Check out what\'s new.',
    MAINTENANCE_SCHEDULED: 'Scheduled maintenance on {date} from {time}. Service may be briefly unavailable.',
  };
  
  // ============================================
  // CONFIRMATION MESSAGES
  // ============================================
  
  export const CONFIRMATION_MESSAGES = {
    // Delete confirmations
    DELETE_DEAL: 'Are you sure you want to delete this deal? This action cannot be undone.',
    DELETE_INVOICE: 'Are you sure you want to delete this invoice? This action cannot be undone.',
    DELETE_RATE_CARD: 'Are you sure you want to delete this rate card? This action cannot be undone.',
    DELETE_BRIEF: 'Are you sure you want to delete this brief? This action cannot be undone.',
    DELETE_CAMPAIGN: 'Are you sure you want to delete this campaign? This action cannot be undone.',
    DELETE_CONTRACT: 'Are you sure you want to delete this contract? This action cannot be undone.',
    DELETE_ACCOUNT: 'Are you sure you want to delete your account? This will permanently remove all your data.',
    
    // Archive confirmations
    ARCHIVE_DEAL: 'Are you sure you want to archive this deal?',
    ARCHIVE_CAMPAIGN: 'Are you sure you want to archive this campaign?',
    
    // Payment confirmations
    RECORD_PAYMENT: 'Confirm payment details before recording.',
    VERIFY_PAYMENT: 'Are you sure you want to verify this payment?',
    
    // Subscription confirmations
    UPGRADE_SUBSCRIPTION: 'Confirm subscription upgrade to {plan} plan.',
    CANCEL_SUBSCRIPTION: 'Are you sure you want to cancel your subscription?',
    
    // Send confirmations
    SEND_INVOICE: 'Are you sure you want to send this invoice to the client?',
    SEND_REMINDER: 'Are you sure you want to send a payment reminder?',
    SEND_RATE_CARD: 'Are you sure you want to share this rate card?',
    
    // Logout confirmation
    LOGOUT_CONFIRMATION: 'Are you sure you want to log out?',
  };
  
  // ============================================
  // PLACEHOLDER TEXT
  // ============================================
  
  export const PLACEHOLDER_TEXT = {
    // Search placeholders
    SEARCH_DEALS: 'Search deals by brand name, status, or platform...',
    SEARCH_INVOICES: 'Search invoices by number, client, or amount...',
    SEARCH_CAMPAIGNS: 'Search campaigns by name, brand, or platform...',
    SEARCH_CONTRACTS: 'Search contracts by brand or file name...',
    SEARCH_BRIEFS: 'Search briefs by brand or content...',
    
    // Input placeholders
    ENTER_EMAIL: 'Enter your email address',
    ENTER_PHONE: 'Enter your mobile number',
    ENTER_PASSWORD: 'Enter your password',
    ENTER_OTP: 'Enter 6-digit OTP',
    ENTER_AMOUNT: 'Enter amount',
    ENTER_DESCRIPTION: 'Enter description',
    ENTER_NOTES: 'Add notes or comments...',
    
    // Business placeholders
    BRAND_NAME: 'Enter brand name',
    CAMPAIGN_NAME: 'Enter campaign name',
    DEAL_TITLE: 'Enter deal title',
    INVOICE_NUMBER: 'Auto-generated',
    RATE_CARD_NAME: 'Enter rate card name',
    
    // Content placeholders
    NO_DEALS_FOUND: 'No deals found. Create your first deal to get started.',
    NO_INVOICES_FOUND: 'No invoices found. Create your first invoice to get started.',
    NO_CAMPAIGNS_FOUND: 'No campaigns found. Create your first campaign to get started.',
    NO_CONTRACTS_FOUND: 'No contracts found. Upload your first contract to get started.',
    NO_BRIEFS_FOUND: 'No briefs found. Create your first brief to get started.',
    NO_DATA_AVAILABLE: 'No data available.',
    
    // Loading placeholders
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    SAVING: 'Saving...',
    UPLOADING: 'Uploading...',
    GENERATING: 'Generating...',
    ANALYZING: 'Analyzing...',
  };
  
  // ============================================
  // VALIDATION MESSAGES
  // ============================================
  
  export const VALIDATION_MESSAGES = {
    // Required field messages
    EMAIL_REQUIRED: 'Email is required',
    PHONE_REQUIRED: 'Phone number is required',
    PASSWORD_REQUIRED: 'Password is required',
    NAME_REQUIRED: 'Name is required',
    AMOUNT_REQUIRED: 'Amount is required',
    DATE_REQUIRED: 'Date is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    
    // Format validation messages
    INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
    INVALID_PHONE_FORMAT: 'Please enter a valid 10-digit mobile number',
    INVALID_PASSWORD_FORMAT: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
    INVALID_AMOUNT_FORMAT: 'Please enter a valid amount',
    INVALID_DATE_FORMAT: 'Please enter a valid date',
    INVALID_GST_FORMAT: 'Please enter a valid GST number (15 digits)',
    INVALID_PAN_FORMAT: 'Please enter a valid PAN number (10 characters)',
    INVALID_IFSC_FORMAT: 'Please enter a valid IFSC code (11 characters)',
    
    // Range validation messages
    AMOUNT_MIN_ERROR: 'Amount must be greater than ₹0',
    AMOUNT_MAX_ERROR: 'Amount cannot exceed ₹10,00,000',
    NAME_MIN_LENGTH: 'Name must be at least 2 characters',
    NAME_MAX_LENGTH: 'Name cannot exceed 100 characters',
    DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 500 characters',
    
    // File validation messages
    FILE_REQUIRED: 'Please select a file',
    FILE_SIZE_ERROR: 'File size must be less than {maxSize}MB',
    FILE_TYPE_ERROR: 'Only {allowedTypes} files are allowed',
  };
  
  // ============================================
  // STATUS MESSAGES
  // ============================================
  
  export const STATUS_MESSAGES = {
    // Deal statuses
    DEAL_PITCHED: 'Deal pitched to brand',
    DEAL_IN_TALKS: 'In active negotiations',
    DEAL_LIVE: 'Campaign is live',
    DEAL_PAID: 'Payment received',
    
    // Invoice statuses
    INVOICE_DRAFT: 'Draft - not sent yet',
    INVOICE_SENT: 'Sent to client',
    INVOICE_PARTIALLY_PAID: 'Partially paid',
    INVOICE_PAID: 'Fully paid',
    INVOICE_OVERDUE: 'Payment overdue',
    
    // Brief statuses
    BRIEF_DRAFT: 'Draft - needs review',
    BRIEF_ANALYZING: 'AI analysis in progress',
    BRIEF_ANALYZED: 'Analysis complete',
    BRIEF_CLARIFICATION_NEEDED: 'Clarification required',
    BRIEF_CONVERTED: 'Converted to deal',
    
    // Campaign statuses
    CAMPAIGN_PLANNED: 'Campaign planned',
    CAMPAIGN_ACTIVE: 'Campaign active',
    CAMPAIGN_COMPLETED: 'Campaign completed',
    CAMPAIGN_ARCHIVED: 'Campaign archived',
    
    // Contract statuses
    CONTRACT_UPLOADED: 'Contract uploaded',
    CONTRACT_ANALYZING: 'Analysis in progress',
    CONTRACT_ANALYZED: 'Analysis complete',
    CONTRACT_UNDER_NEGOTIATION: 'Under negotiation',
    CONTRACT_FINALIZED: 'Contract finalized',
    CONTRACT_SIGNED: 'Contract signed',
    CONTRACT_REJECTED: 'Contract rejected',
    
    // Payment statuses
    PAYMENT_PENDING: 'Payment pending',
    PAYMENT_PROCESSING: 'Payment processing',
    PAYMENT_VERIFIED: 'Payment verified',
    PAYMENT_FAILED: 'Payment failed',
    
    // Subscription statuses
    SUBSCRIPTION_ACTIVE: 'Active subscription',
    SUBSCRIPTION_TRIAL: 'Trial period',
    SUBSCRIPTION_EXPIRED: 'Subscription expired',
    SUBSCRIPTION_CANCELLED: 'Subscription cancelled',
  };
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  /**
   * Replace placeholders in message with actual values
   * @param {string} message - Message with placeholders
   * @param {object} values - Values to replace placeholders
   * @returns {string} - Message with replaced values
   */
  export const formatMessage = (message, values = {}) => {
    let formattedMessage = message;
    
    Object.keys(values).forEach(key => {
      const placeholder = `{${key}}`;
      formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), values[key]);
    });
    
    return formattedMessage;
  };
  
  /**
   * Get validation message for field
   * @param {string} field - Field name
   * @param {string} type - Validation type
   * @param {object} params - Additional parameters
   * @returns {string} - Validation message
   */
  export const getValidationMessage = (field, type, params = {}) => {
    const messageKey = `${field.toUpperCase()}_${type.toUpperCase()}`;
    const message = VALIDATION_MESSAGES[messageKey] || VALIDATION_MESSAGES[type.toUpperCase()];
    
    return formatMessage(message, params);
  };
  
  /**
   * Get status message with proper formatting
   * @param {string} module - Module name
   * @param {string} status - Status value
   * @returns {string} - Formatted status message
   */
  export const getStatusMessage = (module, status) => {
    const messageKey = `${module.toUpperCase()}_${status.toUpperCase()}`;
    return STATUS_MESSAGES[messageKey] || status;
  };
  
  // ============================================
  // EXPORTS
  // ============================================
  
  export default {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    WARNING_MESSAGES,
    INFO_MESSAGES,
    CONFIRMATION_MESSAGES,
    PLACEHOLDER_TEXT,
    VALIDATION_MESSAGES,
    STATUS_MESSAGES,
    formatMessage,
    getValidationMessage,
    getStatusMessage,
  };
  
  // Debug helper for development
  if (process.env.NODE_ENV === 'development') {
    console.log('💬 CreatorsMantra Message System Loaded', {
      successMessages: Object.keys(SUCCESS_MESSAGES).length,
      errorMessages: Object.keys(ERROR_MESSAGES).length,
      warningMessages: Object.keys(WARNING_MESSAGES).length,
      infoMessages: Object.keys(INFO_MESSAGES).length,
      confirmationMessages: Object.keys(CONFIRMATION_MESSAGES).length,
      validationMessages: Object.keys(VALIDATION_MESSAGES).length,
      statusMessages: Object.keys(STATUS_MESSAGES).length,
      totalMessages: Object.keys({
        ...SUCCESS_MESSAGES,
        ...ERROR_MESSAGES,
        ...WARNING_MESSAGES,
        ...INFO_MESSAGES,
      }).length,
    });
  }
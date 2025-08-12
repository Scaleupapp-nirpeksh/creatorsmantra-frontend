/**
 * CreatorsMantra Design System - Color Constants
 * Central color palette for consistent theming across the application
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @description Brand colors, semantic colors, and utility colors
 * @path src/constants/colors.js
 */

// ============================================
// BRAND COLORS (Primary Gradient System)
// ============================================

export const BRAND_COLORS = {
    // Primary gradient colors
    purple: '#8B5CF6',      // Violet-500
    pink: '#EC4899',        // Pink-500  
    blue: '#3B82F6',        // Blue-500
    
    // Gradient definitions
    primaryGradient: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
    purplePinkGradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    pinkBlueGradient: 'linear-gradient(135deg, #EC4899, #3B82F6)',
    
    // Brand gradient variants
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
      secondary: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
      accent: 'linear-gradient(90deg, #EC4899 0%, #3B82F6 100%)',
      subtle: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 30%, #3B82F6 100%)',
      reverse: 'linear-gradient(135deg, #3B82F6 0%, #EC4899 50%, #8B5CF6 100%)',
    }
  };
  
  // ============================================
  // NEUTRAL COLORS (Grays & Base Colors)
  // ============================================
  
  export const NEUTRAL_COLORS = {
    // Pure colors
    white: '#FFFFFF',
    black: '#000000',
    
    // Light grays (backgrounds, subtle elements)
    gray50: '#F8F9FA',      // Light background
    gray100: '#F3F4F6',     // Card backgrounds
    gray200: '#E5E7EB',     // Borders, dividers
    gray300: '#D1D5DB',     // Input borders
    
    // Medium grays (text, placeholders)
    gray400: '#9CA3AF',     // Placeholder text
    gray500: '#6B7280',     // Secondary text
    gray600: '#4B5563',     // Body text
    
    // Dark grays (headings, emphasis)
    gray700: '#374151',     // Dark text
    gray800: '#1F2937',     // Headings
    gray900: '#111827',     // Primary text
  };
  
  // ============================================
  // SEMANTIC COLORS (Status & Feedback)
  // ============================================
  
  export const SEMANTIC_COLORS = {
    // Success colors
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5', 
      200: '#A7F3D0',
      500: '#10B981',    // Primary success
      600: '#059669',
      700: '#047857',
      900: '#064E3B',
    },
    
    // Error colors
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA', 
      500: '#EF4444',    // Primary error
      600: '#DC2626',
      700: '#B91C1C',
      900: '#7F1D1D',
    },
    
    // Warning colors  
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      500: '#F59E0B',    // Primary warning
      600: '#D97706', 
      700: '#B45309',
      900: '#78350F',
    },
    
    // Info colors
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      500: '#3B82F6',    // Primary info (matches brand blue)
      600: '#2563EB',
      700: '#1D4ED8', 
      900: '#1E3A8A',
    }
  };
  
  // ============================================
  // COMPONENT-SPECIFIC COLORS
  // ============================================
  
  export const COMPONENT_COLORS = {
    // Card colors
    card: {
      background: NEUTRAL_COLORS.white,
      border: NEUTRAL_COLORS.gray200,
      shadow: 'rgba(0, 0, 0, 0.1)',
      hoverShadow: 'rgba(0, 0, 0, 0.15)',
    },
    
    // Button colors
    button: {
      primary: {
        background: BRAND_COLORS.primaryGradient,
        text: NEUTRAL_COLORS.white,
        hover: 'linear-gradient(135deg, #7C3AED, #DB2777, #2563EB)',
        active: 'linear-gradient(135deg, #6D28D9, #BE185D, #1D4ED8)',
      },
      secondary: {
        background: NEUTRAL_COLORS.gray100,
        text: NEUTRAL_COLORS.gray700,
        hover: NEUTRAL_COLORS.gray200,
        active: NEUTRAL_COLORS.gray300,
        border: NEUTRAL_COLORS.gray300,
      },
      danger: {
        background: SEMANTIC_COLORS.error[500],
        text: NEUTRAL_COLORS.white,
        hover: SEMANTIC_COLORS.error[600],
        active: SEMANTIC_COLORS.error[700],
      }
    },
    
    // Input colors
    input: {
      background: NEUTRAL_COLORS.white,
      border: NEUTRAL_COLORS.gray300,
      borderFocus: BRAND_COLORS.blue,
      text: NEUTRAL_COLORS.gray900,
      placeholder: NEUTRAL_COLORS.gray400,
      error: SEMANTIC_COLORS.error[500],
    },
    
    // Badge colors
    badge: {
      draft: {
        background: NEUTRAL_COLORS.gray100,
        text: NEUTRAL_COLORS.gray600,
      },
      active: {
        background: SEMANTIC_COLORS.success[100],
        text: SEMANTIC_COLORS.success[700],
      },
      pending: {
        background: SEMANTIC_COLORS.warning[100], 
        text: SEMANTIC_COLORS.warning[700],
      },
      error: {
        background: SEMANTIC_COLORS.error[100],
        text: SEMANTIC_COLORS.error[700],
      }
    }
  };
  
  // ============================================
  // DEAL PIPELINE COLORS
  // ============================================
  
  export const PIPELINE_COLORS = {
    pitched: {
      background: '#FEF3C7',    // Warning 100
      border: '#F59E0B',        // Warning 500
      text: '#92400E',          // Warning 800
    },
    inTalks: {
      background: '#DBEAFE',    // Blue 100 
      border: '#3B82F6',        // Blue 500
      text: '#1E40AF',          // Blue 800
    },
    live: {
      background: '#D1FAE5',    // Success 100
      border: '#10B981',        // Success 500  
      text: '#047857',          // Success 700
    },
    paid: {
      background: '#E0E7FF',    // Indigo 100
      border: '#6366F1',        // Indigo 500
      text: '#4338CA',          // Indigo 700
    }
  };
  
  // ============================================
  // MODULE-SPECIFIC COLORS  
  // ============================================
  
  export const MODULE_COLORS = {
    // Deal CRM
    deals: {
      primary: BRAND_COLORS.blue,
      secondary: '#DBEAFE',
      icon: BRAND_COLORS.blue,
    },
    
    // Invoices  
    invoices: {
      primary: BRAND_COLORS.purple,
      secondary: '#F3E8FF',
      icon: BRAND_COLORS.purple,
    },
    
    // Briefs
    briefs: {
      primary: BRAND_COLORS.pink,
      secondary: '#FCE7F3', 
      icon: BRAND_COLORS.pink,
    },
    
    // Performance
    performance: {
      primary: SEMANTIC_COLORS.success[500],
      secondary: SEMANTIC_COLORS.success[100],
      icon: SEMANTIC_COLORS.success[500],
    },
    
    // Analytics  
    analytics: {
      primary: BRAND_COLORS.purple,
      secondary: '#F3E8FF',
      icon: BRAND_COLORS.purple,
    },
    
    // Contracts
    contracts: {
      primary: SEMANTIC_COLORS.warning[500],
      secondary: SEMANTIC_COLORS.warning[100],
      icon: SEMANTIC_COLORS.warning[500],
    }
  };
  
  // ============================================
  // DARK MODE COLORS (Future Implementation)
  // ============================================
  
  export const DARK_COLORS = {
    // Dark backgrounds
    background: '#0F172A',      // Slate 900
    surface: '#1E293B',        // Slate 800
    elevated: '#334155',       // Slate 700
    
    // Dark text
    text: {
      primary: '#F8FAFC',      // Slate 50
      secondary: '#CBD5E1',    // Slate 300  
      tertiary: '#94A3B8',     // Slate 400
    },
    
    // Dark borders
    border: '#475569',         // Slate 600
    divider: '#374151',        // Gray 700
  };
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  /**
   * Generate color with opacity
   * @param {string} color - Hex color code
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} - RGBA color string
   */
  export const withOpacity = (color, opacity) => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  /**
   * Get theme color based on context
   * @param {string} module - Module name
   * @param {string} variant - Color variant (primary, secondary, etc.)
   * @returns {string} - Color value
   */
  export const getThemeColor = (module, variant = 'primary') => {
    if (MODULE_COLORS[module] && MODULE_COLORS[module][variant]) {
      return MODULE_COLORS[module][variant];
    }
    
    // Fallback to brand colors
    return BRAND_COLORS[variant] || BRAND_COLORS.purple;
  };
  
  /**
   * Get status color
   * @param {string} status - Status type
   * @param {string} variant - Color variant
   * @returns {string} - Color value
   */
  export const getStatusColor = (status, variant = '500') => {
    const statusMap = {
      success: SEMANTIC_COLORS.success,
      error: SEMANTIC_COLORS.error,
      warning: SEMANTIC_COLORS.warning,
      info: SEMANTIC_COLORS.info,
    };
    
    return statusMap[status]?.[variant] || NEUTRAL_COLORS.gray500;
  };
  
  // ============================================
  // EXPORTED COMBINED COLORS
  // ============================================
  
  export const COLORS = {
    ...BRAND_COLORS,
    ...NEUTRAL_COLORS,
    semantic: SEMANTIC_COLORS,
    component: COMPONENT_COLORS,
    pipeline: PIPELINE_COLORS,
    module: MODULE_COLORS,
    dark: DARK_COLORS,
  };
  
  export default COLORS;
  
  // Debug helper for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🎨 CreatorsMantra Color System Loaded', {
      brandColors: Object.keys(BRAND_COLORS).length,
      neutralColors: Object.keys(NEUTRAL_COLORS).length,
      semanticColors: Object.keys(SEMANTIC_COLORS).length,
      componentColors: Object.keys(COMPONENT_COLORS).length,
      moduleColors: Object.keys(MODULE_COLORS).length,
      totalColors: Object.keys(COLORS).length
    });
  }
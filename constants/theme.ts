// Dark theme colors
export const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#121212',
    card: '#1A1A1A',
    border: '#2A2A2A',
    borderLight: '#333333',
    primary: '#007AFF',
    primaryDark: '#0051D5',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    accent: '#007AFF',
    accentFlick: 'rgba(0, 122, 255, 0.3)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Light theme colors (cream/brown palette)
export const lightTheme = {
  colors: {
    background: '#FFFBF5',      // Warm white/cream
    surface: '#FFF8F0',          // Light cream
    card: '#FFFFFF',             // Pure white for cards
    border: '#E8DDD0',           // Light brown border
    borderLight: '#F0E6D8',      // Very light brown
    primary: '#8B6F47',          // Warm brown
    primaryDark: '#6B5537',      // Dark brown
    text: '#2C2416',             // Dark brown text
    textSecondary: '#6B5D4F',    // Medium brown
    textTertiary: '#9B8B7E',     // Light brown
    success: '#6B8E23',          // Olive green
    error: '#C44536',            // Muted red
    warning: '#D4860C',          // Warm orange
    accent: '#8B6F47',           // Warm brown (same as primary)
    accentFlick: 'rgba(139, 111, 71, 0.2)', // Brown with transparency
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Default export for backwards compatibility
export const theme = darkTheme;

export type Theme = typeof darkTheme;

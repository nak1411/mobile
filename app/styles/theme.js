// app/styles/theme.js - Enhanced Theme System with Better Android Device Support
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Enhanced dimension calculations for better Android device support
const dimensionCache = {
  width,
  height,
  
  // More granular screen size detection for Android devices
  isSmallScreen: width < 360 || height < 640,
  isMediumScreen: width >= 360 && width < 400,
  isLargeScreen: width >= 400 && width < 450,
  isExtraLargeScreen: width >= 450,
  
  // Aspect ratio detection for modern Android devices
  aspectRatio: height / width,
  isTallScreen: (height / width) > 2.0, // Modern phones like S22
  isTablet: width > 600,
  
  // Screen category for easier responsive design
  screenCategory: width < 360 ? 'small' : 
                 width < 400 ? 'medium' : 
                 width < 450 ? 'large' : 'xlarge',
                 
  // Safe area calculations for different Android devices
  safeBottomPadding: height > 800 ? 48 : height > 700 ? 32 : 24,
  safeHorizontalPadding: width < 360 ? 12 : width > 400 ? 32 : 24,
};

// Base color palette - optimized structure
const baseColors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Emergency/SOS colors
  emergency: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main emergency red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning orange
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Warrior Book purple theme
  warrior: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main warrior purple
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// Optimized theme creator function
const createThemeColors = (isDark) => {
  if (isDark) {
    return {
      ...baseColors,
      text: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        tertiary: '#9ca3af',
        inverse: '#111827',
        light: 'rgba(255, 255, 255, 0.9)',
        medium: 'rgba(255, 255, 255, 0.7)',
        disabled: '#6b7280',
        placeholder: 'rgba(255, 255, 255, 0.5)',
        placeholderInverse: 'rgba(0, 0, 0, 0.5)',
      },
      background: {
        primary: '#1f2937',
        secondary: '#374151',
        tertiary: '#4b5563',
        dark: '#2c3e50', // Main app background
        darker: '#1a252f',
        black: '#000000',
        overlay: 'rgba(0, 0, 0, 0.7)',
        overlayLight: 'rgba(0, 0, 0, 0.5)',
        overlayDark: 'rgba(0, 0, 0, 0.9)',
        glass: 'rgba(255, 255, 255, 0.95)',
        glassLight: 'rgba(255, 255, 255, 0.1)',
        glassMedium: 'rgba(255, 255, 255, 0.15)',
        glassDark: 'rgba(0, 0, 0, 0.4)',
        card: '#374151',
      },
      border: {
        light: '#4b5563',
        medium: '#6b7280',
        dark: '#9ca3af',
        inverse: 'rgba(255, 255, 255, 0.3)',
        focus: '#3b82f6',
        error: '#ef4444',
        success: '#22c55e',
      },
    };
  }
  
  // Light theme colors
  return {
    ...baseColors,
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#6b7280',
      inverse: '#ffffff',
      light: '#6b7280',
      medium: '#9ca3af',
      disabled: '#d1d5db',
      placeholder: '#9ca3af',
      placeholderInverse: 'rgba(255, 255, 255, 0.6)',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      dark: '#ffffff',
      darker: '#f9fafb',
      black: '#111827',
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
      overlayDark: 'rgba(0, 0, 0, 0.8)',
      glass: 'rgba(255, 255, 255, 0.95)',
      glassLight: 'rgba(0, 0, 0, 0.05)',
      glassMedium: 'rgba(0, 0, 0, 0.08)',
      glassDark: 'rgba(0, 0, 0, 0.15)',
      card: '#ffffff',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af',
      inverse: 'rgba(0, 0, 0, 0.15)',
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
    },
  };
};

// Shared theme properties with enhanced responsive design
const sharedTheme = {
  typography: {
    fontSizes: {
      xs: dimensionCache.width < 360 ? 10 : 12,
      sm: dimensionCache.width < 360 ? 12 : 14,
      base: dimensionCache.width < 360 ? 14 : 16,
      lg: dimensionCache.width < 360 ? 16 : 18,
      xl: dimensionCache.width < 360 ? 18 : 20,
      '2xl': dimensionCache.width < 360 ? 20 : 24,
      '3xl': dimensionCache.width < 360 ? 24 : 28,
      '4xl': dimensionCache.width < 360 ? 28 : 32,
      '5xl': dimensionCache.width < 360 ? 32 : 36,
      '6xl': dimensionCache.width < 360 ? 40 : 48,
      '7xl': dimensionCache.width < 360 ? 50 : 60,
    },
    fontWeights: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      tight: dimensionCache.width < 360 ? 18 : 20,
      normal: dimensionCache.width < 360 ? 22 : 24,
      relaxed: dimensionCache.width < 360 ? 26 : 28,
      loose: dimensionCache.width < 360 ? 30 : 32,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },
  
  // Responsive spacing scale
  spacing: {
    0: 0,
    1: dimensionCache.width < 360 ? 3 : 4,
    2: dimensionCache.width < 360 ? 6 : 8,
    3: dimensionCache.width < 360 ? 9 : 12,
    4: dimensionCache.width < 360 ? 12 : 16,
    5: dimensionCache.width < 360 ? 15 : 20,
    6: dimensionCache.width < 360 ? 18 : 24,
    8: dimensionCache.width < 360 ? 24 : 32,
    10: dimensionCache.width < 360 ? 30 : 40,
    12: dimensionCache.width < 360 ? 36 : 48,
    16: dimensionCache.width < 360 ? 48 : 64,
    20: dimensionCache.width < 360 ? 60 : 80,
    24: dimensionCache.width < 360 ? 72 : 96,
    32: dimensionCache.width < 360 ? 96 : 128,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 6,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  // Responsive shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 10,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Enhanced responsive dimensions
  dimensions: dimensionCache,
};

// Theme cache for performance
const themeCache = new Map();

// Optimized theme creation with caching
const createTheme = (isDark) => {
  const cacheKey = isDark ? 'dark' : 'light';
  
  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey);
  }
  
  const theme = {
    ...sharedTheme,
    colors: createThemeColors(isDark),
    isDark,
  };
  
  themeCache.set(cacheKey, theme);
  return theme;
};

// Export themes
export const themes = {
  get dark() {
    return createTheme(true);
  },
  get light() {
    return createTheme(false);
  },
};

// Default theme (dark) - cached
export const theme = themes.dark;

// Enhanced common component styles with better responsive design
const styleCache = new Map();

export const createCommonStyles = (currentTheme) => {
  const cacheKey = `${currentTheme.isDark ? 'dark' : 'light'}_common_${currentTheme.dimensions.width}`;
  
  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }
  
  const { width, height, safeBottomPadding, safeHorizontalPadding, isSmallScreen } = currentTheme.dimensions;
  
  const commonStyles = {
    // Enhanced container styles
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background.dark,
    },
    
    safeArea: {
      flex: 1,
      backgroundColor: currentTheme.colors.background.dark,
    },
    
    content: {
      flex: 1,
      paddingHorizontal: safeHorizontalPadding,
    },
    
    // Enhanced header styles
    header: {
      paddingHorizontal: safeHorizontalPadding,
      paddingVertical: currentTheme.spacing[5],
      alignItems: 'center',
    },
    
    headerTitle: {
      color: currentTheme.colors.text.primary,
      fontSize: currentTheme.typography.fontSizes['4xl'],
      fontWeight: currentTheme.typography.fontWeights.bold,
      textAlign: 'center',
      marginBottom: currentTheme.spacing[2],
    },
    
    headerSubtitle: {
      color: currentTheme.colors.text.secondary,
      fontSize: currentTheme.typography.fontSizes.lg,
      textAlign: 'center',
      fontWeight: currentTheme.typography.fontWeights.medium,
    },
    
    // Section styles
    section: {
      marginBottom: currentTheme.spacing[8],
    },
    
    sectionTitle: {
      color: currentTheme.colors.text.primary,
      fontSize: currentTheme.typography.fontSizes.xl,
      fontWeight: currentTheme.typography.fontWeights.semibold,
      marginBottom: currentTheme.spacing[5],
      paddingHorizontal: currentTheme.spacing[2],
    },
    
    // Enhanced card styles
    card: {
      backgroundColor: currentTheme.colors.background.card,
      borderRadius: currentTheme.borderRadius.lg,
      padding: currentTheme.spacing[6],
      marginBottom: currentTheme.spacing[5],
      ...currentTheme.shadows.lg,
      borderWidth: 1,
      borderColor: currentTheme.colors.border.light,
    },
    
    cardTitle: {
      fontSize: currentTheme.typography.fontSizes.lg,
      fontWeight: currentTheme.typography.fontWeights.semibold,
      color: currentTheme.colors.text.primary,
      marginBottom: currentTheme.spacing[1],
    },
    
    cardSubtitle: {
      fontSize: currentTheme.typography.fontSizes.sm,
      color: currentTheme.colors.text.secondary,
      fontWeight: currentTheme.typography.fontWeights.medium,
    },
    
    // Enhanced button styles
    button: {
      borderRadius: currentTheme.borderRadius.md,
      paddingVertical: currentTheme.spacing[4],
      paddingHorizontal: currentTheme.spacing[6],
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: width < 360 ? 48 : 56,
      ...currentTheme.shadows.base,
    },
    
    buttonPrimary: {
      backgroundColor: currentTheme.colors.primary[500],
    },
    
    buttonEmergency: {
      backgroundColor: currentTheme.colors.emergency[500],
      ...currentTheme.shadows.xl,
    },
    
    buttonSuccess: {
      backgroundColor: currentTheme.colors.success[500],
    },
    
    buttonWarrior: {
      backgroundColor: currentTheme.colors.warrior[500],
    },
    
    buttonSecondary: {
      backgroundColor: currentTheme.colors.background.glassMedium,
      borderWidth: 1,
      borderColor: currentTheme.colors.border.inverse,
    },
    
    buttonGhost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: currentTheme.colors.border.light,
    },
    
    buttonDisabled: {
      backgroundColor: currentTheme.colors.neutral[400],
      ...currentTheme.shadows.sm,
    },
    
    // Button text styles
    buttonText: {
      fontSize: currentTheme.typography.fontSizes.base,
      fontWeight: currentTheme.typography.fontWeights.semibold,
      letterSpacing: currentTheme.typography.letterSpacing.wide,
    },
    
    buttonTextPrimary: {
      color: currentTheme.colors.text.inverse,
    },
    
    buttonTextSecondary: {
      color: currentTheme.colors.text.primary,
    },
    
    buttonTextLarge: {
      fontSize: currentTheme.typography.fontSizes.lg,
      fontWeight: currentTheme.typography.fontWeights.bold,
      letterSpacing: currentTheme.typography.letterSpacing.wide,
    },
    
    buttonTextDisabled: {
      color: currentTheme.colors.text.disabled,
    },
    
    // Enhanced input styles
    input: {
      backgroundColor: currentTheme.colors.background.secondary,
      borderWidth: 2,
      borderColor: currentTheme.colors.border.light,
      borderRadius: currentTheme.borderRadius.md,
      paddingVertical: currentTheme.spacing[4],
      paddingHorizontal: currentTheme.spacing[4],
      fontSize: currentTheme.typography.fontSizes.base,
      color: currentTheme.colors.text.primary,
      ...currentTheme.shadows.sm,
    },
    
    inputFocused: {
      borderColor: currentTheme.colors.border.focus,
      backgroundColor: currentTheme.colors.background.primary,
      ...currentTheme.shadows.base,
    },
    
    inputError: {
      borderColor: currentTheme.colors.border.error,
      backgroundColor: currentTheme.isDark 
        ? `${currentTheme.colors.emergency[500]}20` 
        : currentTheme.colors.emergency[50],
    },
    
    inputSuccess: {
      borderColor: currentTheme.colors.border.success,
      backgroundColor: currentTheme.isDark 
        ? `${currentTheme.colors.success[500]}20` 
        : currentTheme.colors.success[50],
    },
    
    // Text styles
    textPrimary: {
      color: currentTheme.colors.text.primary,
      fontSize: currentTheme.typography.fontSizes.base,
      lineHeight: currentTheme.typography.lineHeights.normal,
    },
    
    textSecondary: {
      color: currentTheme.colors.text.secondary,
      fontSize: currentTheme.typography.fontSizes.sm,
      lineHeight: currentTheme.typography.lineHeights.normal,
    },
    
    textLight: {
      color: currentTheme.colors.text.light,
      fontSize: currentTheme.typography.fontSizes.sm,
      lineHeight: currentTheme.typography.lineHeights.normal,
    },
    
    textError: {
      color: currentTheme.colors.emergency[600],
      fontSize: currentTheme.typography.fontSizes.sm,
      fontWeight: currentTheme.typography.fontWeights.medium,
    },
    
    textSuccess: {
      color: currentTheme.colors.success[600],
      fontSize: currentTheme.typography.fontSizes.sm,
      fontWeight: currentTheme.typography.fontWeights.semibold,
    },
    
    textHelper: {
      color: currentTheme.colors.text.secondary,
      fontSize: currentTheme.typography.fontSizes.sm,
      fontWeight: currentTheme.typography.fontWeights.medium,
    },
    
    // Badge styles
    badge: {
      borderRadius: currentTheme.borderRadius.full,
      paddingVertical: currentTheme.spacing[1],
      paddingHorizontal: currentTheme.spacing[2],
      ...currentTheme.shadows.sm,
    },
    
    badgeEmergency: {
      backgroundColor: currentTheme.colors.emergency[500],
    },
    
    badgeSuccess: {
      backgroundColor: currentTheme.colors.success[500],
    },
    
    badgeText: {
      color: currentTheme.colors.text.inverse,
      fontSize: currentTheme.typography.fontSizes.xs,
      fontWeight: currentTheme.typography.fontWeights.bold,
    },
    
    // Loading styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    loadingText: {
      color: currentTheme.colors.text.primary,
      fontSize: currentTheme.typography.fontSizes.lg,
      fontWeight: currentTheme.typography.fontWeights.medium,
      marginTop: currentTheme.spacing[4],
    },
    
    // Enhanced modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    modalContent: {
      backgroundColor: currentTheme.colors.background.card,
      marginHorizontal: safeHorizontalPadding,
      borderRadius: currentTheme.borderRadius.xl,
      maxHeight: '85%',
      width: width > 600 ? '70%' : '90%', // Tablet support
      ...currentTheme.shadows.xl,
    },
    
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: currentTheme.spacing[6],
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border.light,
    },
    
    modalTitle: {
      fontSize: currentTheme.typography.fontSizes.xl,
      fontWeight: currentTheme.typography.fontWeights.bold,
      color: currentTheme.colors.text.primary,
    },
    
    modalCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: currentTheme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      ...currentTheme.shadows.sm,
    },
    
    modalCloseText: {
      fontSize: currentTheme.typography.fontSizes.base,
      color: currentTheme.colors.text.secondary,
      fontWeight: currentTheme.typography.fontWeights.bold,
    },
    
    // Enhanced bottom section with better padding for different Android devices
    bottomSection: {
      padding: safeHorizontalPadding,
      paddingTop: currentTheme.spacing[4],
      paddingBottom: safeBottomPadding,
      // Extra padding for tall screens like S22
      ...(height > 800 && {
        paddingBottom: safeBottomPadding + currentTheme.spacing[4],
      }),
    },
    
    backButton: {
      backgroundColor: currentTheme.colors.background.glassMedium,
      borderWidth: 1,
      borderColor: currentTheme.colors.border.light,
      paddingVertical: currentTheme.spacing[4],
      paddingHorizontal: currentTheme.spacing[6],
      borderRadius: currentTheme.borderRadius.md,
      alignItems: 'center',
      ...currentTheme.shadows.base,
    },
    
    backButtonText: {
      color: currentTheme.colors.text.primary,
      fontSize: currentTheme.typography.fontSizes.base,
      fontWeight: currentTheme.typography.fontWeights.semibold,
      letterSpacing: currentTheme.typography.letterSpacing.wide,
    },
    
    // Responsive container for different screen sizes
    responsiveContainer: {
      paddingHorizontal: safeHorizontalPadding,
      paddingBottom: safeBottomPadding,
    },
    
    // Safe area container that adapts to different Android devices
    safeContainer: {
      flex: 1,
      backgroundColor: currentTheme.colors.background.dark,
      paddingBottom: height > 800 ? safeBottomPadding + currentTheme.spacing[2] : safeBottomPadding,
    },
  };
  
  styleCache.set(cacheKey, commonStyles);
  return commonStyles;
};

// Clear caches when needed (for development/testing)
export const clearThemeCache = () => {
  themeCache.clear();
  styleCache.clear();
};

export default theme;
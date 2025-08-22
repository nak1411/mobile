// app/styles/homescreen.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";

// For now, let's use inline theme values to avoid import issues
const theme = {
  colors: {
    emergency: { 400: '#f87171', 500: '#ef4444' },
    primary: { 500: '#0ea5e9' },
    warrior: { 500: '#a855f7' },
    neutral: { 500: '#737373' },
    text: { inverse: '#ffffff', light: 'rgba(255, 255, 255, 0.9)' },
    background: { 
      dark: '#2c3e50',
      glassMedium: 'rgba(255, 255, 255, 0.15)',
    },
    border: { inverse: 'rgba(255, 255, 255, 0.3)' }
  },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 },
  typography: {
    fontSizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24 },
    fontWeights: { medium: '500', semibold: '600', bold: '700', black: '900' }
  },
  borderRadius: { md: 12 },
  dimensions: { width: 375, height: 812, isSmallScreen: false }
};

const shadows = {
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
};

export const homescreenStyles = StyleSheet.create({
  // Base container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
    paddingTop: StatusBar.currentHeight,
  },

  // Logo section
  logoContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    maxHeight: theme.dimensions.height * 0.2,
  },

  logoimage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },

  // Main content layout
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },

  // SOS Button - Big Red Circle (Central focus)
  sosButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing[6],
    position: 'relative',
  },

  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.emergency[500],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Enhanced red emergency shadow
    shadowColor: theme.colors.emergency[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    // Additional glow effect
    borderWidth: 3,
    borderColor: theme.colors.emergency[400],
  },

  sosButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 25,
  },

  sosButtonInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },

  sosButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 42,
    fontWeight: theme.typography.fontWeights.black,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
    textAlign: 'center',
  },

  sosButtonSubtext: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing[1],
    textAlign: 'center',
    position: 'absolute',
    bottom: -theme.spacing[6],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Navigation buttons section
  navigationSection: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[4],
  },

  // Unified navigation button style
  navButton: {
    backgroundColor: theme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    width: '90%',
    maxWidth: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 52,
    ...shadows.base,
  },

  navButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 0.98 }],
  },

  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  navButtonIcon: {
    fontSize: theme.typography.fontSizes['2xl'],
    marginRight: theme.spacing[3],
  },

  navButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    letterSpacing: 0.5,
    flex: 1,
  },

  navButtonArrow: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '300',
  },

  // Specific button variants
  requestsButton: {
    backgroundColor: `${theme.colors.primary[500]}30`,
    borderColor: `${theme.colors.primary[500]}60`,
  },

  warriorBookButton: {
    backgroundColor: `${theme.colors.warrior[500]}30`,
    borderColor: `${theme.colors.warrior[500]}60`,
  },

  settingsButton: {
    backgroundColor: `${theme.colors.neutral[500]}30`,
    borderColor: `${theme.colors.neutral[500]}60`,
  },

  // Legacy button styles for compatibility
  requestsbutton: {
    backgroundColor: `${theme.colors.primary[500]}30`,
    borderColor: `${theme.colors.primary[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
    ...shadows.base,
  },

  warriorbookbutton: {
    backgroundColor: `${theme.colors.warrior[500]}30`,
    borderColor: `${theme.colors.warrior[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
    ...shadows.base,
  },

  settingsbutton: {
    backgroundColor: `${theme.colors.neutral[500]}30`,
    borderColor: `${theme.colors.neutral[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...shadows.base,
  },
});
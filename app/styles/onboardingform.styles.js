// app/styles/onboardingform.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const onboardingformStyles = StyleSheet.create({
  // Base container
  container: {
    ...commonStyles.container,
    paddingTop: StatusBar.currentHeight,
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.background.dark,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[16],
    paddingBottom: theme.spacing[10],
    justifyContent: 'space-between',
  },

  // Header section
  header: {
    ...commonStyles.header,
    marginBottom: theme.spacing[16],
  },

  title: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['6xl'],
    marginBottom: theme.spacing[4],
    textShadowColor: theme.colors.background.overlay,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    ...commonStyles.headerSubtitle,
    fontSize: theme.typography.fontSizes.xl,
    paddingHorizontal: theme.spacing[6],
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  // Welcome animation container
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },

  welcomeIcon: {
    fontSize: 80,
    marginBottom: theme.spacing[4],
  },

  // Input section with modern glass morphism
  inputSection: {
    marginBottom: theme.spacing[10],
  },

  inputCard: {
    ...commonStyles.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },

  inputLabel: {
    ...commonStyles.cardTitle,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacing.wider,
    marginBottom: theme.spacing[4],
  },

  // Modern input with enhanced styling
  input: {
    ...commonStyles.input,
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: "center",
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.lg,
    letterSpacing: theme.typography.letterSpacing.widest,
  },

  inputFocused: {
    ...commonStyles.inputFocused,
  },

  inputError: {
    ...commonStyles.inputError,
  },

  inputChanged: {
    ...commonStyles.inputSuccess,
  },

  // Helper text
  errorText: {
    ...commonStyles.textError,
    textAlign: "center",
    marginTop: theme.spacing[3],
  },

  helperText: {
    ...commonStyles.textHelper,
    textAlign: "center",
    marginTop: theme.spacing[3],
  },

  changedText: {
    ...commonStyles.textSuccess,
    textAlign: "center",
    marginTop: theme.spacing[3],
  },

  // Progress indicator
  progressSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },

  progressContainer: {
    width: theme.dimensions.width * 0.6,
    height: 6,
    backgroundColor: theme.colors.background.glassLight,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 3,
  },

  progressText: {
    ...commonStyles.textLight,
    marginTop: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Info section with enhanced styling
  infoSection: {
    backgroundColor: theme.colors.background.glassDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },

  infoText: {
    ...commonStyles.textLight,
    textAlign: "center",
    lineHeight: theme.typography.lineHeights.normal,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Button section
  buttonSection: {
    gap: theme.spacing[4],
    alignItems: 'center',
  },

  // Modern finish button
  finishButton: {
    ...commonStyles.button,
    ...commonStyles.buttonSuccess,
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[12],
    borderRadius: theme.borderRadius.lg,
    minWidth: theme.dimensions.width * 0.8,
    position: 'relative',
    overflow: 'hidden',
  },

  finishButtonDisabled: {
    ...commonStyles.buttonDisabled,
  },

  finishButtonText: {
    ...commonStyles.buttonTextLarge,
    ...commonStyles.buttonTextPrimary,
    letterSpacing: theme.typography.letterSpacing.wider,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  finishButtonTextDisabled: {
    ...commonStyles.buttonTextDisabled,
  },

  // Skip button (modern ghost button)
  skipButton: {
    ...commonStyles.button,
    ...commonStyles.buttonGhost,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    backgroundColor: theme.colors.background.glassLight,
  },

  skipButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextSecondary,
    textDecorationLine: "underline",
  },

  // Feature highlights
  featuresSection: {
    marginBottom: theme.spacing[8],
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.glassLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },

  featureIcon: {
    fontSize: theme.typography.fontSizes['2xl'],
    marginRight: theme.spacing[4],
  },

  featureText: {
    ...commonStyles.textLight,
    fontWeight: theme.typography.fontWeights.medium,
    flex: 1,
  },

  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingContent: {
    ...commonStyles.card,
    alignItems: 'center',
    minWidth: theme.dimensions.width * 0.6,
  },

  loadingText: {
    ...commonStyles.loadingText,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[4],
  },

  // Security note
  securityNote: {
    backgroundColor: `${theme.colors.primary[500]}20`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginTop: theme.spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },

  securityText: {
    ...commonStyles.textLight,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },

  // Responsive adjustments
  ...(theme.dimensions.isSmallScreen && {
    content: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[12],
    },
    
    header: {
      marginBottom: theme.spacing[12],
    },
    
    title: {
      fontSize: theme.typography.fontSizes['5xl'],
    },
    
    subtitle: {
      fontSize: theme.typography.fontSizes.lg,
      paddingHorizontal: theme.spacing[4],
    },
    
    inputCard: {
      padding: theme.spacing[6],
    },
    
    input: {
      fontSize: theme.typography.fontSizes['2xl'],
      paddingVertical: theme.spacing[5],
    },
    
    finishButton: {
      minWidth: theme.dimensions.width * 0.85,
      paddingVertical: theme.spacing[5],
    },
  }),
});
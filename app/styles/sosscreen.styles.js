// app/styles/sosscreen.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const sosscreenStyles = StyleSheet.create({
  // Base container
  container: {
    ...commonStyles.container,
    paddingTop: StatusBar.currentHeight,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },

  // Loading state
  loadingContainer: {
    ...commonStyles.loadingContainer,
    backgroundColor: theme.colors.background.overlayDark,
  },

  loadingText: {
    ...commonStyles.loadingText,
  },

  // Header section
  header: {
    ...commonStyles.header,
    marginBottom: theme.spacing[10],
    paddingTop: theme.spacing[6],
  },

  title: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['4xl'],
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[3],
  },

  subtitle: {
    ...commonStyles.headerSubtitle,
    paddingHorizontal: theme.spacing[4],
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  zipInfo: {
    color: theme.colors.text.medium,
    fontSize: theme.typography.fontSizes.base,
    textAlign: 'center',
    marginTop: theme.spacing[2],
    fontStyle: 'italic',
    opacity: 0.9,
  },

  // Prayer input section
  inputSection: {
    marginBottom: theme.spacing[6],
  },

  inputCard: {
    ...commonStyles.card,
    borderRadius: theme.borderRadius.xl,
  },

  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },

  inputLabel: {
    ...commonStyles.cardTitle,
    fontSize: theme.typography.fontSizes.lg,
    marginBottom: 0,
  },

  characterCount: {
    ...commonStyles.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  characterCountWarning: {
    color: theme.colors.emergency[500],
  },

  // Text input
  input: {
    ...commonStyles.input,
    minHeight: 160,
    textAlignVertical: 'top',
    fontSize: theme.typography.fontSizes.base,
    lineHeight: theme.typography.lineHeights.normal,
  },

  inputFocused: {
    ...commonStyles.inputFocused,
  },

  inputError: {
    ...commonStyles.inputError,
  },

  // Helper text
  errorText: {
    ...commonStyles.textError,
    marginTop: theme.spacing[2],
    marginLeft: theme.spacing[1],
  },

  helperText: {
    ...commonStyles.textSuccess,
    marginTop: theme.spacing[2],
    marginLeft: theme.spacing[1],
  },

  // Guidelines section
  guidelinesSection: {
    backgroundColor: theme.colors.background.glassDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },

  guidelinesTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[3],
  },

  guidelinesText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.base,
    lineHeight: theme.typography.lineHeights.normal,
  },

  // Button section
  buttonSection: {
    padding: theme.spacing[6],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[4],
  },

  // Clear button
  clearButton: {
    ...commonStyles.button,
    ...commonStyles.buttonSecondary,
  },

  clearButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextSecondary,
  },

  // Send button (Emergency style)
  sendButton: {
    ...commonStyles.button,
    ...commonStyles.buttonEmergency,
    paddingVertical: theme.spacing[6],
    borderRadius: theme.borderRadius.lg,
    // Enhanced emergency shadow
    shadowColor: theme.colors.emergency[500],
    shadowOpacity: 0.4,
  },

  sendButtonDisabled: {
    ...commonStyles.buttonDisabled,
  },

  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendingText: {
    ...commonStyles.buttonTextLarge,
    ...commonStyles.buttonTextPrimary,
    marginLeft: theme.spacing[3],
  },

  sendButtonText: {
    ...commonStyles.buttonTextLarge,
    ...commonStyles.buttonTextPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  sendButtonTextDisabled: {
    ...commonStyles.buttonTextDisabled,
  },

  // Back button
  backButton: {
    ...commonStyles.backButton,
  },

  backButtonText: {
    ...commonStyles.backButtonText,
  },

  // Progress indicator for character count
  progressContainer: {
    marginTop: theme.spacing[3],
    backgroundColor: theme.colors.neutral[200],
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 2,
  },

  progressBarWarning: {
    backgroundColor: theme.colors.emergency[500],
  },

  // Emergency indicator
  emergencyIndicator: {
    position: 'absolute',
    top: theme.spacing[4],
    right: theme.spacing[4],
    ...commonStyles.badge,
    ...commonStyles.badgeEmergency,
    flexDirection: 'row',
    alignItems: 'center',
  },

  emergencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.inverse,
    marginRight: theme.spacing[2],
  },

  emergencyText: {
    ...commonStyles.badgeText,
  },

  // Tips section
  tipsSection: {
    backgroundColor: `${theme.colors.primary[500]}20`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },

  tipsTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
  },

  tipsText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.normal,
  },

  // Responsive adjustments
  ...(theme.dimensions.isSmallScreen && {
    scrollContent: {
      padding: theme.spacing[4],
    },
    
    header: {
      paddingTop: theme.spacing[4],
      marginBottom: theme.spacing[8],
    },
    
    title: {
      fontSize: theme.typography.fontSizes['3xl'],
    },
    
    sendButton: {
      paddingVertical: theme.spacing[5],
    },
  }),
});
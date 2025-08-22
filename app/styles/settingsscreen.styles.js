// app/styles/settingsscreen.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const settingsscreenStyles = StyleSheet.create({
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
    marginBottom: theme.spacing[12],
    paddingTop: theme.spacing[6],
  },

  title: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['5xl'],
    marginBottom: theme.spacing[3],
  },

  subtitle: {
    ...commonStyles.headerSubtitle,
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  // Section containers
  section: {
    ...commonStyles.section,
  },

  sectionTitle: {
    ...commonStyles.sectionTitle,
  },

  // Current location card
  currentLocationCard: {
    ...commonStyles.card,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },

  currentLocationLabel: {
    ...commonStyles.cardSubtitle,
    fontSize: theme.typography.fontSizes.sm,
    letterSpacing: theme.typography.letterSpacing.wider,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },

  currentLocationValue: {
    fontSize: theme.typography.fontSizes['5xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  currentLocationNote: {
    ...commonStyles.cardSubtitle,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.normal,
  },

  // Input card for updating location
  inputCard: {
    ...commonStyles.card,
  },

  inputLabel: {
    ...commonStyles.cardSubtitle,
    fontSize: theme.typography.fontSizes.base,
    letterSpacing: theme.typography.letterSpacing.wider,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },

  // Input styling
  input: {
    ...commonStyles.input,
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    paddingVertical: theme.spacing[5],
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[3],
    letterSpacing: theme.typography.letterSpacing.wide,
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
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },

  helperText: {
    ...commonStyles.textHelper,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },

  changedText: {
    ...commonStyles.textSuccess,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },

  // Zip code action buttons
  zipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[5],
    gap: theme.spacing[3],
  },

  cancelButton: {
    flex: 1,
    ...commonStyles.button,
    backgroundColor: theme.colors.neutral[500],
  },

  cancelButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextPrimary,
  },

  saveButton: {
    flex: 1,
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
  },

  saveButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextPrimary,
  },

  buttonDisabled: {
    ...commonStyles.buttonDisabled,
  },

  buttonTextDisabled: {
    ...commonStyles.buttonTextDisabled,
  },

  // Action cards for app management
  actionCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
    padding: theme.spacing[6],
  },

  actionCardPressed: {
    backgroundColor: theme.colors.background.secondary,
    transform: [{ scale: 0.98 }],
  },

  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.emergency[500],
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    ...commonStyles.cardTitle,
    marginBottom: theme.spacing[1],
  },

  actionDescription: {
    ...commonStyles.cardSubtitle,
    lineHeight: theme.typography.lineHeights.normal,
  },

  actionArrow: {
    fontSize: theme.typography.fontSizes['2xl'],
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[4],
  },

  // Info section
  infoSection: {
    backgroundColor: theme.colors.background.glassDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },

  infoText: {
    ...commonStyles.textLight,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal,
  },

  // Bottom section
  bottomSection: {
    ...commonStyles.bottomSection,
  },

  backButton: {
    ...commonStyles.backButton,
  },

  backButtonText: {
    ...commonStyles.backButtonText,
  },

  // Status indicators
  statusSection: {
    backgroundColor: `${theme.colors.primary[500]}20`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },

  statusTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[3],
  },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
  },

  statusLabel: {
    ...commonStyles.textLight,
    fontWeight: theme.typography.fontWeights.medium,
  },

  statusValue: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },

  // Toggle switches
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...commonStyles.card,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[3],
  },

  toggleLabel: {
    ...commonStyles.textPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    flex: 1,
  },

  toggleDescription: {
    ...commonStyles.textSecondary,
    marginTop: theme.spacing[1],
  },

  // Legacy compatibility styles
  resetbutton: {
    ...commonStyles.button,
    backgroundColor: theme.colors.emergency[500],
    marginBottom: theme.spacing[5],
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.emergency[600],
    width: 250,
    height: 60,
    alignSelf: 'center',
  },

  backbutton: {
    ...commonStyles.backButton,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.inverse,
    width: 250,
    height: 60,
    alignSelf: 'center',
  },

  currentzip: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes['3xl'],
    paddingTop: theme.spacing[12],
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.bold,
  },

  // Responsive adjustments
  ...(theme.dimensions.isSmallScreen && {
    scrollContent: {
      padding: theme.spacing[4],
    },
    
    header: {
      paddingTop: theme.spacing[4],
      marginBottom: theme.spacing[10],
    },
    
    title: {
      fontSize: theme.typography.fontSizes['4xl'],
    },
    
    currentLocationValue: {
      fontSize: theme.typography.fontSizes['4xl'],
    },
    
    input: {
      fontSize: theme.typography.fontSizes['2xl'],
      paddingVertical: theme.spacing[4],
    },
    
    actionCard: {
      padding: theme.spacing[4],
    },
  }),
});
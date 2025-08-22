// app/styles/requestsscreen.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const requestsscreenStyles = StyleSheet.create({
  // Base container
  container: {
    ...commonStyles.container,
    paddingTop: StatusBar.currentHeight,
  },

  // Header section
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.glassDark,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes['2xl'],
    marginBottom: theme.spacing[1],
    textShadowColor: theme.colors.background.overlay,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  subtitle: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Real-time toggle
  realTimeToggle: {
    ...commonStyles.badge,
    backgroundColor: theme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },

  realTimeToggleText: {
    ...commonStyles.badgeText,
    fontSize: theme.typography.fontSizes.xs,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  // Real-time status bar
  realTimeStatus: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background.glassDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.inverse,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing[2],
  },

  statusText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginRight: theme.spacing[3],
  },

  lastUpdateText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xs,
    opacity: 0.8,
  },

  newPrayersNotification: {
    ...commonStyles.badge,
    ...commonStyles.badgeEmergency,
  },

  newPrayersText: {
    ...commonStyles.badgeText,
  },

  // Content area
  content: {
    flex: 1,
    marginHorizontal: theme.spacing[3],
  },

  // Loading states
  loadingContainer: {
    ...commonStyles.loadingContainer,
    paddingHorizontal: theme.spacing[6],
  },

  loadingText: {
    ...commonStyles.loadingText,
    textAlign: 'center',
  },

  // Feed container
  feedContainer: {
    paddingBottom: theme.spacing[6],
  },

  // Prayer item cards
  prayerItem: {
    ...commonStyles.card,
    marginHorizontal: theme.spacing[3],
    marginVertical: theme.spacing[2],
    padding: theme.spacing[5],
  },

  recentPrayerItem: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success[500],
    backgroundColor: theme.colors.background.glass,
    ...theme.shadows.lg,
  },

  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
    ...theme.shadows.sm,
  },

  avatarText: {
    fontSize: theme.typography.fontSizes.lg,
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    ...commonStyles.cardTitle,
    fontSize: theme.typography.fontSizes.base,
    marginBottom: theme.spacing[1],
  },

  timestamp: {
    ...commonStyles.cardSubtitle,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Badges section
  badges: {
    alignItems: 'flex-end',
    gap: theme.spacing[2],
  },

  newBadge: {
    ...commonStyles.badge,
    ...commonStyles.badgeSuccess,
  },

  newBadgeText: {
    ...commonStyles.badgeText,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  prayerBadge: {
    ...commonStyles.badge,
    ...commonStyles.badgeEmergency,
  },

  prayerBadgeText: {
    ...commonStyles.badgeText,
  },

  urgentBadge: {
    ...commonStyles.badge,
    backgroundColor: theme.colors.warrior[500],
  },

  urgentBadgeText: {
    ...commonStyles.badgeText,
  },

  // Prayer content
  prayerContent: {
    marginBottom: theme.spacing[4],
  },

  prayerText: {
    ...commonStyles.textPrimary,
    lineHeight: theme.typography.lineHeights.normal,
  },

  readMore: {
    color: theme.colors.primary[600],
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.semibold,
  },

  // Prayer actions
  prayerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing[2],
  },

  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    ...theme.shadows.sm,
  },

  actionButtonPressed: {
    backgroundColor: theme.colors.primary[100],
    transform: [{ scale: 0.95 }],
  },

  actionText: {
    ...commonStyles.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  actionTextActive: {
    color: theme.colors.primary[600],
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[10],
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing[6],
    opacity: 0.8,
  },

  emptyStateTitle: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['2xl'],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },

  emptyStateText: {
    ...commonStyles.textLight,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal,
    marginBottom: theme.spacing[6],
  },

  settingsButton: {
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
  },

  settingsButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextPrimary,
  },

  // Error state
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[10],
  },

  errorStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing[6],
    opacity: 0.8,
  },

  errorStateTitle: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['2xl'],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },

  errorStateText: {
    ...commonStyles.textLight,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal,
    marginBottom: theme.spacing[6],
  },

  retryButton: {
    ...commonStyles.button,
    ...commonStyles.buttonSuccess,
  },

  retryButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.buttonTextPrimary,
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

  // Modal styles
  modalOverlay: {
    ...commonStyles.modalOverlay,
  },

  modalContent: {
    ...commonStyles.modalContent,
  },

  modalHeader: {
    ...commonStyles.modalHeader,
  },

  modalTitle: {
    ...commonStyles.modalTitle,
  },

  closeButton: {
    ...commonStyles.modalCloseButton,
  },

  closeButtonText: {
    ...commonStyles.modalCloseText,
  },

  modalBody: {
    padding: theme.spacing[6],
  },

  modalPrayerHeader: {
    marginBottom: theme.spacing[5],
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  modalTimestamp: {
    ...commonStyles.textSecondary,
    fontSize: theme.typography.fontSizes.base,
    marginBottom: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },

  modalPrayerId: {
    ...commonStyles.textSecondary,
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  modalPrayerText: {
    ...commonStyles.textPrimary,
    fontSize: theme.typography.fontSizes.lg,
    lineHeight: theme.typography.lineHeights.relaxed,
    marginBottom: theme.spacing[6],
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing[3],
  },

  modalActionButton: {
    flex: 1,
    ...commonStyles.button,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    paddingVertical: theme.spacing[4],
  },

  modalActionButtonPressed: {
    backgroundColor: theme.colors.primary[100],
    borderColor: theme.colors.primary[300],
  },

  modalActionText: {
    ...commonStyles.buttonText,
    color: theme.colors.text.primary,
  },

  modalActionTextActive: {
    color: theme.colors.primary[600],
  },

  // Floating refresh button
  floatingRefresh: {
    position: 'absolute',
    bottom: theme.spacing[24],
    right: theme.spacing[6],
    backgroundColor: theme.colors.primary[500],
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },

  floatingRefreshIcon: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.xl,
  },

  // Legacy compatibility styles
  backbutton: {
    ...commonStyles.backButton,
    marginBottom: theme.spacing[5],
    width: 250,
    height: 60,
    alignSelf: 'center',
  },

  input: {
    ...commonStyles.input,
    height: 200,
    margin: theme.spacing[3],
    padding: theme.spacing[25],
  },

  // Responsive adjustments
  ...(theme.dimensions.isSmallScreen && {
    header: {
      paddingHorizontal: theme.spacing[4],
    },
    
    title: {
      fontSize: theme.typography.fontSizes.xl,
    },
    
    prayerItem: {
      marginHorizontal: theme.spacing[2],
      padding: theme.spacing[4],
    },
    
    modalContent: {
      width: theme.dimensions.width * 0.95,
    },
  }),
});
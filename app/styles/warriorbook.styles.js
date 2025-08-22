// app/styles/warriorbook.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const warriorbookStyles = StyleSheet.create({
  // Base container
  container: {
    ...commonStyles.container,
    paddingTop: StatusBar.currentHeight,
  },

  // Header
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.inverse,
    backgroundColor: theme.colors.background.glassDark,
  },

  titleContainer: {
    alignItems: 'center',
  },

  title: {
    ...commonStyles.headerTitle,
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[2],
  },

  subtitle: {
    ...commonStyles.headerSubtitle,
    textAlign: 'center',
  },

  // Search container
  searchContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.background.glassDark,
  },

  searchInput: {
    ...commonStyles.input,
    backgroundColor: theme.colors.background.glassLight,
    borderColor: theme.colors.border.inverse,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.base,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[3],
  },

  categoriesList: {
    paddingBottom: theme.spacing[6],
  },

  // Category cards
  categoryCard: {
    ...commonStyles.card,
    marginHorizontal: theme.spacing[3],
    marginVertical: theme.spacing[2],
    padding: theme.spacing[4],
    borderLeftWidth: 4,
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
    ...theme.shadows.sm,
  },

  categoryIcon: {
    fontSize: theme.typography.fontSizes['2xl'],
  },

  categoryInfo: {
    flex: 1,
  },

  categoryTitle: {
    ...commonStyles.cardTitle,
    marginBottom: theme.spacing[1],
  },

  categorySubtitle: {
    ...commonStyles.cardSubtitle,
  },

  categoryArrow: {
    fontSize: theme.typography.fontSizes['2xl'],
    color: theme.colors.text.secondary,
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
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
    minHeight: '60%',
    ...theme.shadows.xl,
  },

  modalHeader: {
    ...commonStyles.modalHeader,
  },

  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  modalIcon: {
    fontSize: theme.typography.fontSizes['2xl'],
    marginRight: theme.spacing[3],
  },

  modalTitle: {
    ...commonStyles.modalTitle,
    flex: 1,
  },

  closeButton: {
    ...commonStyles.modalCloseButton,
  },

  closeButtonText: {
    ...commonStyles.modalCloseText,
  },

  // Verses list
  versesList: {
    padding: theme.spacing[6],
  },

  verseCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warrior[500],
    ...theme.shadows.sm,
  },

  verseReference: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.warrior[600],
    marginBottom: theme.spacing[2],
  },

  verseText: {
    ...commonStyles.textPrimary,
    lineHeight: theme.typography.lineHeights.normal,
    fontStyle: 'italic',
  },

  // Category-specific border colors (these will be applied dynamically)
  fearCategory: {
    borderLeftColor: theme.colors.emergency[500],
  },

  prideCategory: {
    borderLeftColor: theme.colors.warrior[500],
  },

  angerCategory: {
    borderLeftColor: theme.colors.emergency[600],
  },

  lustCategory: {
    borderLeftColor: theme.colors.success[500],
  },

  discouragementCategory: {
    borderLeftColor: theme.colors.warning[500],
  },

  doubtCategory: {
    borderLeftColor: theme.colors.primary[500],
  },

  weaknessCategory: {
    borderLeftColor: theme.colors.success[600],
  },

  confusionCategory: {
    borderLeftColor: theme.colors.warrior[600],
  },

  offenseCategory: {
    borderLeftColor: theme.colors.primary[400],
  },

  condemnationCategory: {
    borderLeftColor: theme.colors.warning[600],
  },

  worryCategory: {
    borderLeftColor: theme.colors.success[500],
  },

  discontentmentCategory: {
    borderLeftColor: theme.colors.warning[500],
  },

  judgmentCategory: {
    borderLeftColor: theme.colors.neutral[600],
  },

  // Responsive adjustments
  ...(theme.dimensions.isSmallScreen && {
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
    },
    
    title: {
      fontSize: theme.typography.fontSizes['3xl'],
    },
    
    searchContainer: {
      paddingHorizontal: theme.spacing[4],
    },
    
    categoryCard: {
      marginHorizontal: theme.spacing[2],
      padding: theme.spacing[3],
    },
    
    categoryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: theme.spacing[3],
    },
    
    categoryIcon: {
      fontSize: theme.typography.fontSizes.xl,
    },
    
    modalContent: {
      maxHeight: '90%',
    },
    
    versesList: {
      padding: theme.spacing[4],
    },
  }),
});
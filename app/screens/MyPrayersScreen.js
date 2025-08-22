// app/screens/MyPrayersScreen.js - Display and manage user's own prayer requests
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { prayerAPI, validation, errorHandler } from "../config/api.js";
import { userUtils } from "../utils/user.js";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// Memoized components for better performance
const PrayerActions = React.memo(({ onEdit, onDelete, styles }) => (
  <View style={styles.prayerActions}>
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onEdit}
      activeOpacity={0.7}
    >
      <Text style={styles.actionText}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionButton, styles.deleteActionButton]}
      onPress={onDelete}
      activeOpacity={0.7}
    >
      <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
    </TouchableOpacity>
  </View>
));

PrayerActions.displayName = "PrayerActions";

const MyPrayerItem = React.memo(
  ({ item, onView, onEdit, onDelete, styles, formatTimestamp }) => {
    const prayerText =
      item.prayerText || item.prayer || item.text || "Prayer request";
    const timestamp = item.createdAt || item.created_at;

    const truncatedText = useMemo(() => {
      if (!prayerText || prayerText.length <= 150) return prayerText;
      return prayerText.substring(0, 150) + "...";
    }, [prayerText]);

    const handleView = useCallback(() => onView(item), [item, onView]);
    const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
    const handleDelete = useCallback(() => onDelete(item), [item, onDelete]);

    return (
      <TouchableOpacity
        style={styles.prayerItem}
        onPress={handleView}
        activeOpacity={0.7}
      >
        <View style={styles.prayerHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Your Prayer Request</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(timestamp)} • Zip {item.zip}
              </Text>
            </View>
          </View>
          <View style={styles.badges}>
            <View style={styles.prayerBadge}>
              <Text style={styles.prayerBadgeText}>Your Prayer</Text>
            </View>
          </View>
        </View>

        <View style={styles.prayerContent}>
          <Text style={styles.prayerText}>{truncatedText}</Text>
          {prayerText && prayerText.length > 150 && (
            <Text style={styles.readMore}>Read more...</Text>
          )}
        </View>

        <PrayerActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          styles={styles}
        />
      </TouchableOpacity>
    );
  }
);

MyPrayerItem.displayName = "MyPrayerItem";

const EmptyState = React.memo(({ styles }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateTitle}>No Prayer Requests Yet</Text>
    <Text style={styles.emptyStateText}>
      You have not made any prayer requests yet. When you do, they'll appear
      here where you can view, edit, or delete them.
    </Text>
  </View>
));

EmptyState.displayName = "EmptyState";

const ViewModal = React.memo(
  ({ visible, prayer, onClose, onEdit, onDelete, styles, formatTimestamp }) => {
    if (!prayer) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Prayer Request</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalPrayerHeader}>
                <Text style={styles.modalTimestamp}>
                  {formatTimestamp(prayer.createdAt || prayer.created_at)}
                </Text>
                <Text style={styles.modalPrayerId}>Prayer ID: {prayer.id}</Text>
              </View>

              <Text style={styles.modalPrayerText}>
                {prayer.prayerText ||
                  prayer.prayer ||
                  prayer.text ||
                  "Prayer request"}
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => {
                    onClose();
                    onEdit(prayer);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalActionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    styles.deleteModalActionButton,
                  ]}
                  onPress={() => {
                    onClose();
                    onDelete(prayer);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalActionText,
                      styles.deleteModalActionText,
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
);

ViewModal.displayName = "ViewModal";

const EditModal = React.memo(
  ({ visible, prayer, onClose, onSave, styles, colors }) => {
    const [editText, setEditText] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [characterCount, setCharacterCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const MAX_CHARACTERS = 125;
    const MIN_CHARACTERS = 5;

    // Reset state when modal opens
    useEffect(() => {
      if (visible && prayer) {
        const initialText =
          prayer.prayerText || prayer.prayer || prayer.text || "";
        setEditText(initialText);
        setCharacterCount(initialText.length);
        setValidationError("");
      }
    }, [visible, prayer]);

    const handleTextChange = useCallback((text) => {
      if (text.length <= MAX_CHARACTERS) {
        setEditText(text);
        setCharacterCount(text.length);
        setValidationError("");
      }
    }, []);

    const validateAndSave = useCallback(async () => {
      if (!editText.trim()) {
        setValidationError("Please enter your prayer request");
        return;
      }

      if (editText.trim().length < MIN_CHARACTERS) {
        setValidationError(
          `Prayer request must be at least ${MIN_CHARACTERS} characters`
        );
        return;
      }

      setIsValidating(true);

      try {
        const validationResult = await validation.validatePrayerText(
          editText.trim()
        );

        if (!validationResult.isValid) {
          setValidationError(
            validationResult.error || "Please review your prayer request"
          );
          return;
        }

        setIsSaving(true);
        await onSave(prayer.id, editText.trim());
        onClose();
      } catch (error) {
        console.error("Validation/Save error:", error);
        setValidationError(errorHandler.getErrorMessage(error));
      } finally {
        setIsValidating(false);
        setIsSaving(false);
      }
    }, [editText, prayer?.id, onSave, onClose]);

    const handleCancel = useCallback(() => {
      setEditText("");
      setCharacterCount(0);
      setValidationError("");
      onClose();
    }, [onClose]);

    if (!prayer) return null;

    const isSaveDisabled =
      !editText.trim() ||
      editText.trim().length < MIN_CHARACTERS ||
      isValidating ||
      isSaving;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Prayer Request</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputSection}>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Prayer Request</Text>
                  <Text
                    style={[
                      styles.characterCount,
                      characterCount > MAX_CHARACTERS * 0.9 &&
                        styles.characterCountWarning,
                    ]}
                  >
                    {characterCount}/{MAX_CHARACTERS}
                  </Text>
                </View>

                <TextInput
                  value={editText}
                  onChangeText={handleTextChange}
                  multiline={true}
                  numberOfLines={6}
                  maxLength={MAX_CHARACTERS}
                  style={[
                    styles.editInput,
                    validationError && styles.inputError,
                  ]}
                  placeholder="Share what you need prayer for..."
                  placeholderTextColor={colors.text.placeholder}
                  textAlignVertical="top"
                  editable={!isValidating && !isSaving}
                />

                {validationError ? (
                  <Text style={styles.errorText}>{validationError}</Text>
                ) : null}
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  disabled={isValidating || isSaving}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaveDisabled && styles.saveButtonDisabled,
                  ]}
                  onPress={validateAndSave}
                  disabled={isSaveDisabled}
                  activeOpacity={0.7}
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.saveButtonText,
                        isSaveDisabled && styles.saveButtonTextDisabled,
                      ]}
                    >
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
);

EditModal.displayName = "EditModal";

const MyPrayersScreen = React.memo(({ navigation }) => {
  const { colors, typography, spacing, borderRadius, shadows, isDark } =
    useTheme();

  // State management
  const [prayers, setPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  const mountedRef = useRef(true);

  // Memoized timestamp formatter
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return "Recently";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Fetch user's prayers
  const fetchMyPrayers = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        setError("");

        if (!userData) {
          const user = await userUtils.getUserData();
          setUserData(user);

          if (!user.userId) {
            setError("User not found. Please restart the app.");
            return;
          }
        }

        const userId =
          userData?.userId || (await userUtils.getUserData()).userId;
        console.log("[MyPrayers] Fetching prayers for user:", userId);

        const response = await prayerAPI.getByUser(userId);
        console.log("[MyPrayers] API Response:", response);

        let prayersData = [];
        if (Array.isArray(response)) {
          prayersData = response;
        } else if (response.data && Array.isArray(response.data)) {
          prayersData = response.data;
        } else if (response && typeof response === "object") {
          prayersData = [response];
        }

        if (prayersData.length > 0) {
          const sortedPrayers = prayersData.sort((a, b) => {
            const timeA = new Date(a.createdAt || a.created_at || 0);
            const timeB = new Date(b.createdAt || b.created_at || 0);
            return timeB - timeA;
          });

          if (mountedRef.current) {
            setPrayers(sortedPrayers);
          }

          console.log(`[MyPrayers] Loaded ${sortedPrayers.length} prayers`);
        } else {
          if (mountedRef.current) {
            setPrayers([]);
          }
          console.log("[MyPrayers] No prayers found for user");
        }
      } catch (error) {
        console.error("[MyPrayers] Failed to fetch prayers:", error);

        if (mountedRef.current) {
          setError(errorHandler.getErrorMessage(error));
          setPrayers([]);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [userData]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchMyPrayers(false);
  }, [fetchMyPrayers]);

  // Handle view prayer
  const handleViewPrayer = useCallback((prayer) => {
    setSelectedPrayer(prayer);
    setViewModalVisible(true);
  }, []);

  // Handle edit prayer
  const handleEditPrayer = useCallback((prayer) => {
    setSelectedPrayer(prayer);
    setEditModalVisible(true);
  }, []);

  // Handle save edited prayer
  const handleSaveEditedPrayer = useCallback(async (prayerId, newText) => {
    try {
      console.log("[MyPrayers] Updating prayer:", prayerId, newText);

      await prayerAPI.update(prayerId, { prayerText: newText });

      // Update local state
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer.id === prayerId
            ? { ...prayer, prayerText: newText, prayer: newText, text: newText }
            : prayer
        )
      );

      Alert.alert(
        "Prayer Updated",
        "Your prayer request has been updated successfully.",
        [{ text: "OK" }]
      );

      console.log("[MyPrayers] Prayer updated successfully");
    } catch (error) {
      console.error("[MyPrayers] Failed to update prayer:", error);
      throw error;
    }
  }, []);

  // Handle delete prayer
  const handleDeletePrayer = useCallback((prayer) => {
    Alert.alert(
      "Delete Prayer Request",
      "Are you sure you want to delete this prayer request? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("[MyPrayers] Deleting prayer:", prayer.id);

              await prayerAPI.delete(prayer.id);

              // Update local state
              setPrayers((prevPrayers) =>
                prevPrayers.filter((p) => p.id !== prayer.id)
              );

              Alert.alert(
                "Prayer Deleted",
                "Your prayer request has been deleted.",
                [{ text: "OK" }]
              );

              console.log("[MyPrayers] Prayer deleted successfully");
            } catch (error) {
              console.error("[MyPrayers] Failed to delete prayer:", error);
              Alert.alert(
                "Delete Failed",
                errorHandler.getErrorMessage(error),
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  }, []);

  // Handle back button press
  const handleBackPressed = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Close modals
  const handleCloseViewModal = useCallback(() => {
    setViewModalVisible(false);
    setSelectedPrayer(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setSelectedPrayer(null);
  }, []);

  // FlatList optimization callbacks
  const renderPrayerItem = useCallback(
    ({ item, index }) => (
      <MyPrayerItem
        item={item}
        index={index}
        onView={handleViewPrayer}
        onEdit={handleEditPrayer}
        onDelete={handleDeletePrayer}
        styles={styles}
        formatTimestamp={formatTimestamp}
      />
    ),
    [handleViewPrayer, handleEditPrayer, handleDeletePrayer, formatTimestamp]
  );

  const keyExtractor = useCallback(
    (item, index) =>
      `${item.id || item._id || index}-${item.timestamp || index}`,
    []
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // Component mount and cleanup
  useEffect(() => {
    mountedRef.current = true;
    fetchMyPrayers(true);

    return () => {
      mountedRef.current = false;
    };
  }, [fetchMyPrayers]);

  // Memoized styles for performance
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background.dark,
          paddingTop: StatusBar.currentHeight || 0,
        },

        header: {
          paddingHorizontal: spacing[6],
          paddingVertical: spacing[5],
          backgroundColor: colors.background.glassDark,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        },

        title: {
          color: colors.text.primary,
          fontWeight: typography.fontWeights.bold,
          fontSize:
            width < 360 ? typography.fontSizes.xl : typography.fontSizes["2xl"],
          textAlign: "center",
          textShadowColor: isDark ? "rgba(0, 0, 0, 0.5)" : "transparent",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },

        content: {
          flex: 1,
          marginHorizontal: spacing[3],
        },

        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing[6],
        },

        loadingText: {
          color: colors.text.primary,
          marginTop: spacing[4],
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.medium,
          textAlign: "center",
        },

        errorState: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing[10],
        },

        errorStateTitle: {
          color: colors.text.primary,
          fontSize: typography.fontSizes["2xl"],
          fontWeight: typography.fontWeights.bold,
          textAlign: "center",
          marginBottom: spacing[4],
        },

        errorStateText: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.base,
          textAlign: "center",
          lineHeight: typography.lineHeights.normal,
          marginBottom: spacing[6],
        },

        retryButton: {
          backgroundColor: colors.success[500],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
          borderRadius: borderRadius.md,
          ...shadows.base,
        },

        retryButtonText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
        },

        feedContainer: {
          paddingBottom: spacing[6],
        },

        prayerItem: {
          backgroundColor: colors.background.card,
          marginHorizontal: spacing[3],
          marginVertical: spacing[2],
          borderRadius: borderRadius.lg,
          padding: spacing[5],
          ...shadows.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary[500],
        },

        prayerHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: spacing[4],
        },

        userInfo: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        },

        userDetails: {
          flex: 1,
        },

        userName: {
          fontWeight: typography.fontWeights.semibold,
          fontSize: typography.fontSizes.base,
          color: colors.text.primary,
          marginBottom: spacing[1],
        },

        timestamp: {
          fontSize: typography.fontSizes.sm,
          color: colors.text.secondary,
          fontWeight: typography.fontWeights.medium,
        },

        badges: {
          alignItems: "flex-end",
        },

        prayerBadge: {
          backgroundColor: colors.primary[500],
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.full,
          ...shadows.sm,
        },

        prayerBadgeText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.fontWeights.semibold,
        },

        prayerContent: {
          marginBottom: spacing[4],
        },

        prayerText: {
          fontSize: typography.fontSizes.base,
          lineHeight: typography.lineHeights.normal,
          color: colors.text.primary,
          fontWeight: typography.fontWeights.normal,
        },

        readMore: {
          color: colors.primary[600],
          fontSize: typography.fontSizes.sm,
          marginTop: spacing[2],
          fontWeight: typography.fontWeights.semibold,
        },

        prayerActions: {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingTop: spacing[4],
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          gap: spacing[3],
        },

        actionButton: {
          flex: 1,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[2],
          borderRadius: borderRadius.base,
          backgroundColor: colors.background.secondary,
          alignItems: "center",
          ...shadows.sm,
        },

        deleteActionButton: {
          backgroundColor: colors.emergency[50],
          borderWidth: 1,
          borderColor: colors.emergency[200],
        },

        actionText: {
          fontSize: typography.fontSizes.sm,
          fontWeight: typography.fontWeights.medium,
          color: colors.text.primary,
        },

        deleteActionText: {
          color: colors.emergency[600],
        },

        separator: {
          height: 1,
          backgroundColor: "transparent",
        },

        emptyState: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing[10],
        },

        emptyStateIcon: {
          fontSize: 64,
          marginBottom: spacing[6],
        },

        emptyStateTitle: {
          color: colors.text.primary,
          fontSize: typography.fontSizes["2xl"],
          fontWeight: typography.fontWeights.bold,
          textAlign: "center",
          marginBottom: spacing[4],
        },

        emptyStateText: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.base,
          textAlign: "center",
          lineHeight: typography.lineHeights.normal,
          fontWeight: typography.fontWeights.medium,
        },

        bottomSection: {
          padding: spacing[6],
          paddingTop: spacing[4],
          paddingBottom: height > 800 ? spacing[12] : spacing[8],
        },

        backButton: {
          backgroundColor: colors.background.glassMedium,
          borderWidth: 1,
          borderColor: colors.border.light,
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[8],
          borderRadius: borderRadius.md,
          alignItems: "center",
          ...shadows.base,
        },

        backButtonText: {
          color: colors.text.primary,
          fontSize:
            width < 360 ? typography.fontSizes.sm : typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
          letterSpacing: typography.letterSpacing.wide,
        },

        // Modal styles
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        },

        modalContent: {
          backgroundColor: colors.background.card,
          marginHorizontal: spacing[6],
          borderRadius: borderRadius.xl,
          maxHeight: "85%",
          width: width > 600 ? "70%" : "90%", // Better tablet support
          ...shadows.xl,
        },

        modalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: spacing[6],
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        },

        modalTitle: {
          fontSize: typography.fontSizes.xl,
          fontWeight: typography.fontWeights.bold,
          color: colors.text.primary,
        },

        closeButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.background.secondary,
          justifyContent: "center",
          alignItems: "center",
          ...shadows.sm,
        },

        closeButtonText: {
          fontSize: typography.fontSizes.lg,
          color: colors.text.secondary,
          fontWeight: typography.fontWeights.bold,
        },

        modalBody: {
          padding: spacing[6],
        },

        modalPrayerHeader: {
          marginBottom: spacing[5],
          paddingBottom: spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        },

        modalTimestamp: {
          fontSize: typography.fontSizes.base,
          color: colors.text.secondary,
          marginBottom: spacing[2],
          fontWeight: typography.fontWeights.medium,
        },

        modalPrayerId: {
          fontSize: typography.fontSizes.sm,
          color: colors.text.tertiary,
          fontStyle: "italic",
        },

        modalPrayerText: {
          fontSize: typography.fontSizes.lg,
          lineHeight: typography.lineHeights.relaxed,
          color: colors.text.primary,
          marginBottom: spacing[6],
          fontWeight: typography.fontWeights.normal,
        },

        modalActions: {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingTop: spacing[5],
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          gap: spacing[3],
        },

        modalActionButton: {
          flex: 1,
          backgroundColor: colors.background.secondary,
          borderWidth: 1,
          borderColor: colors.border.light,
          paddingVertical: spacing[4],
          borderRadius: borderRadius.md,
          alignItems: "center",
          ...shadows.sm,
        },

        deleteModalActionButton: {
          backgroundColor: colors.emergency[50],
          borderColor: colors.emergency[200],
        },

        modalActionText: {
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
          color: colors.text.primary,
        },

        deleteModalActionText: {
          color: colors.emergency[600],
        },

        // Edit modal specific styles
        inputSection: {
          marginBottom: spacing[6],
        },

        inputHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing[4],
        },

        inputLabel: {
          color: colors.text.primary,
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.semibold,
        },

        characterCount: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.sm,
          fontWeight: typography.fontWeights.medium,
        },

        characterCountWarning: {
          color: colors.emergency[500],
        },

        editInput: {
          backgroundColor: colors.background.secondary,
          borderWidth: 2,
          borderColor: colors.border.light,
          borderRadius: borderRadius.md,
          padding: spacing[4],
          fontSize: typography.fontSizes.base,
          lineHeight: typography.lineHeights.normal,
          minHeight: 160,
          textAlignVertical: "top",
          color: colors.text.primary,
          ...shadows.sm,
        },

        inputError: {
          borderColor: colors.emergency[500],
          backgroundColor: isDark
            ? `${colors.emergency[500]}20`
            : colors.emergency[50],
        },

        errorText: {
          color: colors.emergency[600],
          fontSize: typography.fontSizes.sm,
          fontWeight: typography.fontWeights.medium,
          marginTop: spacing[2],
          marginLeft: spacing[1],
        },

        editActions: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: spacing[5],
          gap: spacing[3],
        },

        cancelButton: {
          flex: 1,
          backgroundColor: colors.neutral[500],
          paddingVertical: spacing[4],
          borderRadius: borderRadius.md,
          alignItems: "center",
          ...shadows.base,
        },

        cancelButtonText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
        },

        saveButton: {
          flex: 1,
          backgroundColor: colors.primary[500],
          paddingVertical: spacing[4],
          borderRadius: borderRadius.md,
          alignItems: "center",
          ...shadows.base,
        },

        saveButtonDisabled: {
          backgroundColor: colors.neutral[400],
          ...shadows.sm,
        },

        saveButtonText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
        },

        saveButtonTextDisabled: {
          color: colors.text.disabled,
        },
      }),
    [colors, typography, spacing, borderRadius, shadows, isDark]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Prayer Requests</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>Loading your prayers...</Text>
          </View>
        ) : error && prayers.length === 0 ? (
          <View style={styles.errorState}>
            <Text style={styles.errorStateTitle}>Unable to Load Prayers</Text>
            <Text style={styles.errorStateText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchMyPrayers(true)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : prayers.length === 0 ? (
          <EmptyState styles={styles} />
        ) : (
          <FlatList
            data={prayers}
            renderItem={renderPrayerItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.feedContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary[500]]}
                tintColor={colors.primary[500]}
              />
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPressed}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
      </View>

      {/* View Modal */}
      <ViewModal
        visible={viewModalVisible}
        prayer={selectedPrayer}
        onClose={handleCloseViewModal}
        onEdit={handleEditPrayer}
        onDelete={handleDeletePrayer}
        styles={styles}
        formatTimestamp={formatTimestamp}
      />

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        prayer={selectedPrayer}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditedPrayer}
        styles={styles}
        colors={colors}
      />
    </SafeAreaView>
  );
});

MyPrayersScreen.displayName = "MyPrayersScreen";

export default MyPrayersScreen;
// app/screens/RequestsScreen.js - Updated to show User IDs instead of "Community Member"
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
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
  AppState,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { prayerAPI, errorHandler } from "../config/api.js";
import { userUtils } from "../utils/user.js";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

if (prayerAPI) {
  console.log('prayerAPI.getByZip:', prayerAPI.getByZip);
  console.log('prayerAPI keys:', Object.keys(prayerAPI));
}
console.log('================================');

// Memoized components for better performance
const RealTimeToggle = React.memo(({ isActive, onToggle, styles }) => (
  <TouchableOpacity style={styles.realTimeToggle} onPress={onToggle}>
    <Text style={styles.realTimeToggleText}>
      {isActive ? "LIVE" : "MANUAL"}
    </Text>
  </TouchableOpacity>
));

RealTimeToggle.displayName = "RealTimeToggle";

const StatusIndicator = React.memo(
  ({ isActive, lastUpdate, colors, styles, formatTimestamp }) => (
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: isActive
              ? colors.success[500]
              : colors.neutral[500],
          },
        ]}
      />
      <Text style={styles.statusText}>
        {isActive ? "Live updates" : "Manual refresh"}
      </Text>
      {lastUpdate && (
        <Text style={styles.lastUpdateText}>
          Last: {formatTimestamp(lastUpdate)}
        </Text>
      )}
    </View>
  )
);

StatusIndicator.displayName = "StatusIndicator";

const NewPrayersNotification = React.memo(({ count, onClear, styles }) => {
  if (count <= 0) return null;

  return (
    <TouchableOpacity style={styles.newPrayersNotification} onPress={onClear}>
      <Text style={styles.newPrayersText}>
        {count} new prayer{count !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );
});

NewPrayersNotification.displayName = "NewPrayersNotification";

const PrayerItemBadges = React.memo(({ isRecent, styles }) => (
  <View style={styles.badges}>
    {isRecent && (
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>NEW</Text>
      </View>
    )}
    <View style={styles.prayerBadge}>
      <Text style={styles.prayerBadgeText}>Prayer Request</Text>
    </View>
  </View>
));

PrayerItemBadges.displayName = "PrayerItemBadges";

const PrayerItemContent = React.memo(({ prayerText, onReadMore, styles }) => {
  const truncatedText = useMemo(() => {
    if (!prayerText || prayerText.length <= 150) return prayerText;
    return prayerText.substring(0, 150) + "...";
  }, [prayerText]);

  const showReadMore = prayerText && prayerText.length > 150;

  return (
    <View style={styles.prayerContent}>
      <Text style={styles.prayerText}>{truncatedText}</Text>
      {showReadMore && (
        <Text style={styles.readMore} onPress={onReadMore}>
          Read more...
        </Text>
      )}
    </View>
  );
});

PrayerItemContent.displayName = "PrayerItemContent";

// Enhanced UserAvatar component with user ID display
const UserAvatar = React.memo(({ userId, styles }) => {
  // Generate avatar initials from user ID
  const getAvatarInitials = (id) => {
    if (!id) return "??";

    // For Reddit-style IDs like "AmazingWarrior1234"
    if (id.match(/^[A-Z][a-z]+[A-Z][a-z]+\d/)) {
      // Extract first letter of each word
      const matches = id.match(/[A-Z][a-z]*/g);
      if (matches && matches.length >= 2) {
        return `${matches[0][0]}${matches[1][0]}`;
      }
    }

    // For legacy IDs or fallback
    return id.substring(0, 2).toUpperCase();
  };

  // Generate consistent color from user ID
  const getAvatarColor = (id) => {
    if (!id) return "#6b7280";

    // Generate a hash from the user ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to a consistent hue
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  };

  const initials = getAvatarInitials(userId);
  const backgroundColor = getAvatarColor(userId);

  return (
    <View style={[styles.avatar, { backgroundColor }]}>
      <Text style={[styles.avatarText, { color: "#ffffff" }]}>{initials}</Text>
    </View>
  );
});

UserAvatar.displayName = "UserAvatar";

// Updated PrayerItem component with user ID display
const PrayerItem = React.memo(
  ({
    item,
    index,
    userZip,
    lastFetchTime,
    onPress,
    styles,
    formatTimestamp,
  }) => {
    const isRecent = useMemo(() => {
      if (!lastFetchTime) return false;
      const prayerTime = new Date(item.createdAt || item.created_at);
      return prayerTime > new Date(Date.now() - 5 * 60 * 1000);
    }, [item, lastFetchTime]);

    const prayerText =
      item.prayerText || item.prayer || item.text || "Prayer request";
    const timestamp = item.createdAt || item.created_at;

    // Extract user ID from prayer data
    const userId = item.userId || item.user_id || "Anonymous";

    // Format user ID for display (truncate if too long)
    const displayUserId = useMemo(() => {
      if (!userId || userId === "Anonymous") return "Anonymous";

      // For Reddit-style IDs, show full ID if reasonable length
      if (userId.length <= 20) {
        return userId;
      }

      // For very long IDs, truncate with ellipsis
      return `${userId.substring(0, 17)}...`;
    }, [userId]);

    const handlePress = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    const handleReadMore = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    return (
      <TouchableOpacity
        style={[styles.prayerItem, isRecent && styles.recentPrayerItem]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.prayerHeader}>
          <View style={styles.userInfo}>
            <UserAvatar userId={userId} styles={styles} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{displayUserId}</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(timestamp)} • Zip {item.zip || userZip}
              </Text>
            </View>
          </View>
          <PrayerItemBadges isRecent={isRecent} styles={styles} />
        </View>

        <PrayerItemContent
          prayerText={prayerText}
          onReadMore={handleReadMore}
          styles={styles}
        />
      </TouchableOpacity>
    );
  }
);

PrayerItem.displayName = "PrayerItem";

const EmptyState = React.memo(({ userZip, navigation, styles }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateTitle}>No Prayer Requests Yet</Text>
    <Text style={styles.emptyStateText}>
      {userZip
        ? `Be the first to share a prayer request in the ${userZip} area, or check back later for community updates.`
        : "Set your zip code in Settings to view and connect with local prayer requests."}
    </Text>
    {!userZip && (
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.settingsButtonText}>Go to Settings</Text>
      </TouchableOpacity>
    )}
  </View>
));

EmptyState.displayName = "EmptyState";

const ErrorState = React.memo(({ error, onRetry, styles }) => (
  <View style={styles.errorState}>
    <Text style={styles.errorStateTitle}>Unable to Load Prayers</Text>
    <Text style={styles.errorStateText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
));

ErrorState.displayName = "ErrorState";

// Enhanced PrayerModal with user ID display
const PrayerModal = React.memo(
  ({ visible, prayer, onClose, styles, formatTimestamp }) => {
    if (!prayer) return null;

    const userId = prayer.userId || prayer.user_id || "Anonymous";
    const displayUserId = userId === "Anonymous" ? "Anonymous User" : userId;

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
              <Text style={styles.modalTitle}>Prayer Request</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalPrayerHeader}>
                <View style={styles.modalUserInfo}>
                  <UserAvatar userId={userId} styles={styles} />
                  <View style={styles.modalUserDetails}>
                    <Text style={styles.modalUserName}>{displayUserId}</Text>
                    <Text style={styles.modalTimestamp}>
                      {formatTimestamp(prayer.createdAt || prayer.created_at)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalPrayerId}>Prayer ID: {prayer.id}</Text>
              </View>

              <Text style={styles.modalPrayerText}>
                {prayer.prayerText ||
                  prayer.prayer ||
                  prayer.text ||
                  "Prayer request"}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
);

PrayerModal.displayName = "PrayerModal";

const RequestsScreen = React.memo(({ navigation }) => {
  const { colors, typography, spacing, borderRadius, shadows, isDark } =
    useTheme();

  // State management
  const [prayers, setPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [error, setError] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [newPrayersCount, setNewPrayersCount] = useState(0);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Refs for managing intervals and app state
  const pollIntervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const lastFetchTimeRef = useRef(null);
  const mountedRef = useRef(true);

  // Real-time polling configuration
  const POLL_INTERVAL = 15000;
  const BACKGROUND_POLL_INTERVAL = 60000;

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

  // Fetch prayers from database with real-time capabilities
  const fetchPrayersFromDatabase = useCallback(
    async (showLoading = true, isBackgroundFetch = false) => {
      try {
        if (showLoading && !isBackgroundFetch) setIsLoading(true);
        if (!isBackgroundFetch) setError("");

        console.log(
          `[RealTime] Fetching prayers - Background: ${isBackgroundFetch}`
        );

        const userData = await userUtils.getUserData();

        if (!userData.zip) {
          if (!isBackgroundFetch) {
            setError(
              "Please set your zip code in Settings to view local prayers"
            );
          }
          return;
        }

        setUserZip(userData.zip);

        console.log(`[RealTime] Fetching prayers for zip: ${userData.zip}`);
        const response = await prayerAPI.getByZip(userData.zip);

        console.log(`[RealTime] API Response:`, response);

        let prayersData = [];
        if (Array.isArray(response)) {
          prayersData = response;
        } else if (response.data && Array.isArray(response.data)) {
          prayersData = response.data;
        } else if (response && typeof response === "object") {
          prayersData = [response];
        }

        if (prayersData.length > 0) {
          const currentTime = new Date().toISOString();

          const sortedPrayers = prayersData.sort((a, b) => {
            const timeA = new Date(a.createdAt || a.created_at || 0);
            const timeB = new Date(b.createdAt || b.created_at || 0);
            return timeB - timeA;
          });

          if (lastFetchTimeRef.current && isRealTimeActive) {
            const newPrayers = sortedPrayers.filter((prayer) => {
              const prayerTime = new Date(
                prayer.createdAt || prayer.created_at
              );
              return prayerTime > new Date(lastFetchTimeRef.current);
            });

            if (newPrayers.length > 0 && !isBackgroundFetch) {
              setNewPrayersCount((prev) => prev + newPrayers.length);
              console.log(`[RealTime] Found ${newPrayers.length} new prayers`);
            }
          }

          if (mountedRef.current) {
            setPrayers(sortedPrayers);
            setLastUpdateTime(currentTime);
            lastFetchTimeRef.current = currentTime;
          }

          console.log(
            `[RealTime] Loaded ${sortedPrayers.length} prayers for zip ${userData.zip}`
          );
        } else {
          if (mountedRef.current) {
            setPrayers([]);
          }
          console.log(`[RealTime] No prayers found for zip ${userData.zip}`);
        }
      } catch (error) {
        console.error("[RealTime] Failed to fetch prayers:", error);

        if (!isBackgroundFetch && mountedRef.current) {
          setError(errorHandler.getErrorMessage(error));
          setPrayers([]);
        }
      } finally {
        if (!isBackgroundFetch && mountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [isRealTimeActive]
  );

  // Setup real-time polling
  const startRealTimePolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const interval =
      appStateRef.current === "active"
        ? POLL_INTERVAL
        : BACKGROUND_POLL_INTERVAL;

    pollIntervalRef.current = setInterval(() => {
      if (mountedRef.current && isRealTimeActive) {
        const isBackground = appStateRef.current !== "active";
        fetchPrayersFromDatabase(false, isBackground);
      }
    }, interval);

    console.log(`[RealTime] Started polling every ${interval / 1000} seconds`);
  }, [isRealTimeActive, fetchPrayersFromDatabase]);

  // Stop real-time polling
  const stopRealTimePolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      console.log("[RealTime] Stopped polling");
    }
  }, []);

  // Handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState) => {
      console.log(
        `[RealTime] App state changed: ${appStateRef.current} -> ${nextAppState}`
      );

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("[RealTime] App came to foreground - refreshing data");
        fetchPrayersFromDatabase(false, false);
        if (isRealTimeActive) {
          startRealTimePolling();
        }
      }

      appStateRef.current = nextAppState;

      if (isRealTimeActive) {
        startRealTimePolling();
      }
    },
    [startRealTimePolling, isRealTimeActive, fetchPrayersFromDatabase]
  );

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setNewPrayersCount(0);
    fetchPrayersFromDatabase(false, false);
  }, [fetchPrayersFromDatabase]);

  // Toggle real-time updates
  const toggleRealTimeUpdates = useCallback(() => {
    setIsRealTimeActive((prev) => {
      const newState = !prev;
      if (newState) {
        startRealTimePolling();
      } else {
        stopRealTimePolling();
      }
      return newState;
    });
  }, [startRealTimePolling, stopRealTimePolling]);

  // Handle prayer item press
  const handlePrayerPress = useCallback((prayer) => {
    setSelectedPrayer(prayer);
    setModalVisible(true);
    console.log(`[RealTime] Prayer viewed: ${prayer.id || "unknown"}`);
  }, []);

  // Clear new prayers notification
  const clearNewPrayersNotification = useCallback(() => {
    setNewPrayersCount(0);
  }, []);

  // Back button handler
  const handleBackPressed = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  // Retry handler
  const handleRetry = useCallback(() => {
    fetchPrayersFromDatabase(true, false);
  }, [fetchPrayersFromDatabase]);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedPrayer(null);
  }, []);

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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.background.glassDark,
        },

        titleContainer: {
          flex: 1,
        },

        title: {
          color: colors.text.primary,
          fontWeight: typography.fontWeights.bold,
          fontSize:
            width < 360 ? typography.fontSizes.xl : typography.fontSizes["2xl"],
          marginBottom: spacing[1],
          textShadowColor: isDark ? "rgba(0, 0, 0, 0.5)" : "transparent",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },

        subtitle: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.medium,
        },

        realTimeToggle: {
          backgroundColor: colors.background.glassMedium,
          borderWidth: 1,
          borderColor: colors.border.light,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          borderRadius: borderRadius.full,
        },

        realTimeToggleText: {
          color: colors.text.primary,
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.fontWeights.bold,
          letterSpacing: typography.letterSpacing.wide,
        },

        realTimeStatus: {
          paddingHorizontal: spacing[6],
          paddingVertical: spacing[3],
          backgroundColor: colors.background.glassDark,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        },

        statusContainer: {
          flexDirection: "row",
          alignItems: "center",
        },

        statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginRight: spacing[2],
        },

        statusText: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.sm,
          fontWeight: typography.fontWeights.medium,
          marginRight: spacing[3],
        },

        lastUpdateText: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.xs,
          opacity: 0.8,
        },

        newPrayersNotification: {
          backgroundColor: colors.emergency[500],
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.full,
          ...shadows.base,
        },

        newPrayersText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.fontWeights.bold,
        },

        myPrayersButton: {
          backgroundColor: colors.background.glassMedium,
          borderWidth: 1,
          borderColor: colors.border.light,
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[8],
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginBottom: spacing[4],
          ...shadows.base,
        },

        myPrayersButtonText: {
          color: colors.text.primary,
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
          letterSpacing: typography.letterSpacing.wide,
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
        },

        recentPrayerItem: {
          borderLeftWidth: 4,
          borderLeftColor: colors.success[500],
          backgroundColor: colors.background.card,
          ...shadows.lg,
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

        avatar: {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          alignItems: "center",
          marginRight: spacing[3],
          ...shadows.sm,
        },

        avatarText: {
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.bold,
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
          gap: spacing[2],
        },

        newBadge: {
          backgroundColor: colors.success[500],
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.sm,
          ...shadows.sm,
        },

        newBadgeText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.fontWeights.bold,
          letterSpacing: typography.letterSpacing.wide,
        },

        prayerBadge: {
          backgroundColor: colors.emergency[500],
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

        emptyStateTitle: {
          color: colors.text.primary,
          fontSize: typography.fontSizes["2xl"],
          fontWeight: typography.fontWeights.bold,
          textAlign: "center",
          marginBottom: spacing[4],
          textShadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "transparent",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },

        emptyStateText: {
          color: colors.text.secondary,
          fontSize: typography.fontSizes.base,
          textAlign: "center",
          lineHeight: typography.lineHeights.normal,
          marginBottom: spacing[6],
          fontWeight: typography.fontWeights.medium,
        },

        settingsButton: {
          backgroundColor: colors.primary[500],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
          borderRadius: borderRadius.md,
          ...shadows.base,
        },

        settingsButtonText: {
          color: "#ffffff",
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
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
          width: "90%",
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

        modalUserInfo: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: spacing[3],
        },

        modalUserDetails: {
          marginLeft: spacing[3],
          flex: 1,
        },

        modalUserName: {
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.semibold,
          color: colors.text.primary,
          marginBottom: spacing[1],
        },

        modalTimestamp: {
          fontSize: typography.fontSizes.base,
          color: colors.text.secondary,
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
      }),
    [colors, typography, spacing, borderRadius, shadows, isDark]
  );

  // FlatList optimization callbacks - defined after styles
  const renderPrayerItem = useCallback(
    ({ item, index }) => (
      <PrayerItem
        item={item}
        index={index}
        userZip={userZip}
        lastFetchTime={lastFetchTimeRef.current}
        onPress={handlePrayerPress}
        styles={styles}
        formatTimestamp={formatTimestamp}
      />
    ),
    [userZip, handlePrayerPress, formatTimestamp, styles]
  );

  const keyExtractor = useCallback(
    (item, index) =>
      `${item.id || item._id || index}-${item.timestamp || index}`,
    []
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [styles]
  );

  // Component mount and cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopRealTimePolling();
    };
  }, [stopRealTimePolling]);

  // Setup app state listener
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  // Initial load and start real-time updates
  useEffect(() => {
    fetchPrayersFromDatabase(true, false);

    const startPollingTimer = setTimeout(() => {
      if (mountedRef.current && isRealTimeActive) {
        startRealTimePolling();
      }
    }, 2000);

    return () => clearTimeout(startPollingTimer);
  }, [fetchPrayersFromDatabase, startRealTimePolling, isRealTimeActive]);

  // Handle navigation focus/blur for real-time updates
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("[RealTime] Screen focused - starting updates");
      setIsRealTimeActive(true);
      fetchPrayersFromDatabase(false, false);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      console.log("[RealTime] Screen blurred - stopping updates");
      setIsRealTimeActive(false);
      stopRealTimePolling();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, stopRealTimePolling, fetchPrayersFromDatabase]);

  // Render real-time status indicator
  const renderRealTimeStatus = useCallback(
    () => (
      <View style={styles.realTimeStatus}>
        <StatusIndicator
          isActive={isRealTimeActive}
          lastUpdate={lastUpdateTime}
          colors={colors}
          styles={styles}
          formatTimestamp={formatTimestamp}
        />

        <NewPrayersNotification
          count={newPrayersCount}
          onClear={clearNewPrayersNotification}
          styles={styles}
        />
      </View>
    ),
    [
      isRealTimeActive,
      lastUpdateTime,
      newPrayersCount,
      colors,
      styles,
      formatTimestamp,
      clearNewPrayersNotification,
    ]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Local Prayer Requests</Text>
          {userZip && <Text style={styles.subtitle}>{userZip}</Text>}
        </View>

        {/* Real-time Toggle */}
        <RealTimeToggle
          isActive={isRealTimeActive}
          onToggle={toggleRealTimeUpdates}
          styles={styles}
        />
      </View>

      {/* Real-time Status */}
      {renderRealTimeStatus()}

      {/* Content */}
      <View style={styles.content}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>
              Loading prayers from database...
            </Text>
          </View>
        ) : error && prayers.length === 0 ? (
          <ErrorState error={error} onRetry={handleRetry} styles={styles} />
        ) : prayers.length === 0 ? (
          <EmptyState
            userZip={userZip}
            navigation={navigation}
            styles={styles}
          />
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
            onScrollBeginDrag={clearNewPrayersNotification}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            getItemLayout={(data, index) => ({
              length: 200, // Approximate item height
              offset: 200 * index,
              index,
            })}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.myPrayersButton}
          onPress={() => navigation.navigate("MyPrayers")}
        >
          <Text style={styles.myPrayersButtonText}>MY PRAYERS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBackPressed}>
          <Text style={styles.backButtonText}>BACK TO HOME</Text>
        </TouchableOpacity>
      </View>

      {/* Prayer Detail Modal */}
      <PrayerModal
        visible={modalVisible}
        prayer={selectedPrayer}
        onClose={handleModalClose}
        styles={styles}
        formatTimestamp={formatTimestamp}
      />
    </SafeAreaView>
  );
});

RequestsScreen.displayName = "RequestsScreen";

export default RequestsScreen;
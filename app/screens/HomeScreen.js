// app/screens/HomeScreen.js - Fully Responsive with Better Android Support
import React, { useEffect, useMemo, useCallback } from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import logoimage from "../../assets/logo.png";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get('window');

// Memoized navigation button component
const NavigationButton = React.memo(({ 
  onPress, 
  style, 
  textStyle, 
  children, 
  accessibilityLabel,
  testID 
}) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
  >
    <Text style={textStyle}>{children}</Text>
  </TouchableOpacity>
));

NavigationButton.displayName = 'NavigationButton';

// Memoized SOS button component with responsive sizing
const SOSButton = React.memo(({ onPress, styles }) => (
  <View style={styles.sosButtonContainer}>
    <TouchableOpacity
      style={styles.sosButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS Button"
      testID="sos-button"
    >
      <View style={styles.sosButtonInner}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </View>
    </TouchableOpacity>
  </View>
));

SOSButton.displayName = 'SOSButton';

const HomeScreen = React.memo(({ navigation }) => {
  const {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark,
  } = useTheme();

  // Get screen dimensions directly from Dimensions for calculations
  const screenWidth = width;
  const screenHeight = height;

  // Memoized navigation handlers to prevent recreation on every render
  const handleSOSPress = useCallback(() => {
    console.log("SOS");
    navigation.navigate("Sos");
  }, [navigation]);

  const handleRequestsPress = useCallback(() => {
    console.log("REQUESTS");
    navigation.navigate("Requests");
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    console.log("SETTINGS");
    navigation.navigate("Settings");
  }, [navigation]);

  const handleWarriorBookPress = useCallback(() => {
    console.log("WARRIOR BOOK");
    navigation.navigate("WarriorBook");
  }, [navigation]);

  const runOnboarding = useCallback(async () => {
    console.log("ONBOARDING");
    // Add your existing readOnboarded logic here if needed
  }, []);

  useEffect(() => {
    runOnboarding();
  }, [runOnboarding]);

  // Calculate responsive sizes
  const sosButtonSize = useMemo(() => {
    // Scale SOS button based on screen width, with different sizing for different screen categories
    if (width < 360) {
      return Math.min(180, width * 0.5); // Smaller screens - 50% of width, max 180px
    } else if (width < 400) {
      return Math.min(220, width * 0.55); // Medium screens - 55% of width, max 220px
    } else if (width < 450) {
      return Math.min(260, width * 0.6); // Large screens - 60% of width, max 260px
    } else {
      return Math.min(280, width * 0.62); // Extra large screens - 62% of width, max 280px
    }
  }, []);

  const sosButtonInnerSize = useMemo(() => {
    return sosButtonSize * 0.9; // Inner button is 90% of outer button
  }, [sosButtonSize]);

  const sosButtonFontSize = useMemo(() => {
    // Scale font size proportionally to button size
    const baseRatio = 52 / 260; // Original ratio
    return Math.min(52, Math.max(32, sosButtonSize * baseRatio));
  }, [sosButtonSize]);

  // Memoized styles with full responsive design
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
      paddingTop: StatusBar.currentHeight || 0,
    },

    logoContainer: {
      flex: width < 360 ? 0.35 : width < 400 ? 0.4 : 0.45, // Responsive flex based on screen size
      justifyContent: "center",
      alignItems: "center",
      paddingTop: spacing[2],
      paddingBottom: spacing[1],
      maxHeight: height * 0.2, // Limit max height to 20% of screen
    },

    logoimage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      resizeMode: "center",
    },

    mainContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: width < 360 ? spacing[3] : spacing[4],
      paddingBottom: height > 800 ? spacing[12] : spacing[6],
    },

    // Fully responsive SOS Button
    sosButtonContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: width < 360 ? spacing[4] : spacing[6],
      position: "relative",
      flex: width < 360 ? 0.5 : 0.6, // Less flex on small screens
    },

    sosButton: {
      width: sosButtonSize,
      height: sosButtonSize,
      borderRadius: sosButtonSize / 2,
      backgroundColor: colors.emergency[500],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.emergency[500],
      shadowOffset: { 
        width: 0, 
        height: width < 360 ? 4 : 6 
      },
      shadowOpacity: width < 360 ? 0.4 : 0.5,
      shadowRadius: width < 360 ? 12 : 15,
      elevation: width < 360 ? 12 : 15,
      borderWidth: width < 360 ? 2 : 3,
      borderColor: colors.emergency[400],
    },

    sosButtonInner: {
      width: sosButtonInnerSize,
      height: sosButtonInnerSize,
      borderRadius: sosButtonInnerSize / 2,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: width < 360 ? 1.5 : 2,
      borderColor: "rgba(255, 255, 255, 0.4)",
    },

    sosButtonText: {
      color: "#ffffff",
      fontSize: sosButtonFontSize,
      fontWeight: typography.fontWeights.black,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: width < 360 ? 1 : 2,
      textAlign: "center",
    },

    // Navigation Section with better responsive spacing
    navigationSection: {
      width: "100%",
      alignItems: "center",
      gap: width < 360 ? spacing[2] : spacing[3],
      paddingBottom: spacing[2],
      paddingTop: spacing[2],
      // Additional spacing for tall screens
      ...(height > 800 && {
        gap: spacing[4],
        paddingBottom: spacing[4],
      }),
    },

    // Responsive navigation buttons
    navButton: {
      width: width < 360 ? "90%" : width < 400 ? "85%" : "80%",
      maxWidth: width < 360 ? 280 : width < 400 ? 300 : 350,
      height: width < 360 ? 48 : width < 400 ? 52 : 56,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      ...shadows.base,
    },

    // Theme-specific button styles with better contrast
    requestsButton: {
      backgroundColor: isDark
        ? `${colors.primary[500]}30`
        : `${colors.primary[100]}`,
      borderColor: isDark
        ? `${colors.primary[500]}60`
        : `${colors.primary[400]}`,
    },

    warriorBookButton: {
      backgroundColor: isDark
        ? `${colors.warrior[500]}30`
        : `${colors.warrior[100]}`,
      borderColor: isDark
        ? `${colors.warrior[500]}60`
        : `${colors.warrior[400]}`,
    },

    settingsButton: {
      backgroundColor: isDark
        ? `${colors.neutral[500]}30`
        : `${colors.neutral[200]}`,
      borderColor: isDark
        ? `${colors.neutral[500]}60`
        : `${colors.neutral[400]}`,
    },

    // Responsive button text
    buttonText: {
      color: colors.text.primary,
      fontSize: width < 360 
        ? typography.fontSizes.sm 
        : width < 400 
          ? typography.fontSizes.base 
          : typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: width < 360 
        ? typography.letterSpacing.normal 
        : typography.letterSpacing.wide,
      textAlign: "center",
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "transparent",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  }), [
    colors, 
    typography, 
    spacing, 
    borderRadius, 
    shadows, 
    isDark,
    sosButtonSize,
    sosButtonInnerSize,
    sosButtonFontSize
  ]);

  // Memoized button styles to prevent recreation
  const buttonStyles = useMemo(() => ({
    requests: [styles.navButton, styles.requestsButton],
    warriorBook: [styles.navButton, styles.warriorBookButton],
    settings: [styles.navButton, styles.settingsButton],
  }), [styles]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <ImageBackground
          source={logoimage}
          resizeMode="center"
          style={styles.logoimage}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Responsive SOS Button */}
        <SOSButton onPress={handleSOSPress} styles={styles} />

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          {/* Prayer Requests Button */}
          <NavigationButton
            style={buttonStyles.requests}
            textStyle={styles.buttonText}
            onPress={handleRequestsPress}
            accessibilityLabel="Navigate to Prayer Requests"
            testID="requests-button"
          >
            PRAYER REQUESTS
          </NavigationButton>

          {/* Warrior Book Button */}
          <NavigationButton
            style={buttonStyles.warriorBook}
            textStyle={styles.buttonText}
            onPress={handleWarriorBookPress}
            accessibilityLabel="Navigate to Warrior Book"
            testID="warrior-book-button"
          >
            WARRIOR BOOK
          </NavigationButton>

          {/* Settings Button */}
          <NavigationButton
            style={buttonStyles.settings}
            textStyle={styles.buttonText}
            onPress={handleSettingsPress}
            accessibilityLabel="Navigate to Settings"
            testID="settings-button"
          >
            SETTINGS
          </NavigationButton>
        </View>
      </View>
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
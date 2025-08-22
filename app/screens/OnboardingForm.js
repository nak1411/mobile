// app/screens/OnboardingForm.js - Theme-Aware Version
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default function OnboardingForm({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } =
    useTheme();

  const [zip, setZip] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const storeOnboarded = async (value) => {
    try {
      await AsyncStorage.setItem("onboarded", value);
      console.log("Onboarded status set to:", value);
    } catch (error) {
      console.error("Failed to store onboarded status:", error);
    }
  };

  const storeZip = async (value) => {
    try {
      await AsyncStorage.setItem("zip", value);
      console.log("Zip code stored:", value);
    } catch (error) {
      console.error("Failed to store zip code:", error);
    }
  };

  const readZip = async () => {
    try {
      const savedZip = await AsyncStorage.getItem("zip");
      if (savedZip !== null) {
        setZip(savedZip);
        validateZip(savedZip);
      }
    } catch (error) {
      console.error("Failed to read zip code:", error);
    }
  };

  const validateZip = (zipCode) => {
    const isValidZip = /^\d{5}$/.test(zipCode);
    setIsValid(isValidZip);
    return isValidZip;
  };

  const handleZipChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "").substring(0, 5);
    setZip(numericValue);
    validateZip(numericValue);
  };

  const finishPressed = async () => {
    if (!isValid) {
      Alert.alert(
        "Invalid ZIP Code",
        "Please enter a valid 5-digit ZIP code to continue.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);

    try {
      await storeZip(zip);
      await storeOnboarded("true");
      console.log("Onboarding completed successfully");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      Alert.alert(
        "Setup Failed",
        "There was an error completing the setup. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    readZip();
  }, []);

  // Dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },

    keyboardView: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      padding: spacing[6],
      paddingBottom: 120,
    },

    header: {
      alignItems: "center",
      marginBottom: spacing[10],
      paddingTop: spacing[5],
    },

    title: {
      color: colors.text.primary,
      fontWeight: typography.fontWeights.bold,
      fontSize:
        width < 360 ? typography.fontSizes["4xl"] : typography.fontSizes["5xl"],
      marginBottom: spacing[4],
      textAlign: "center",
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.5)" : "transparent",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },

    subtitle: {
      color: colors.text.secondary,
      fontSize:
        width < 360 ? typography.fontSizes.base : typography.fontSizes.lg,
      textAlign: "center",
      lineHeight: typography.lineHeights.relaxed,
      fontWeight: typography.fontWeights.medium,
      paddingHorizontal: spacing[5],
    },

    inputSection: {
      marginBottom: spacing[8],
    },

    inputCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    inputLabel: {
      fontSize: typography.fontSizes.base,
      color: colors.text.primary,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wider,
      marginBottom: spacing[2],
      textAlign: "center",
    },

    inputHelper: {
      fontSize: typography.fontSizes.sm,
      color: colors.text.secondary,
      textAlign: "center",
      marginBottom: spacing[5],
      lineHeight: typography.lineHeights.normal,
    },

    input: {
      backgroundColor: colors.background.secondary,
      fontSize:
        width < 360 ? typography.fontSizes["2xl"] : typography.fontSizes["3xl"],
      fontWeight: typography.fontWeights.bold,
      textAlign: "center",
      paddingVertical: width < 360 ? spacing[4] : spacing[5],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.border.light,
      marginBottom: spacing[4],
      letterSpacing: typography.letterSpacing.widest,
      minHeight: width < 360 ? 70 : 80,
      color: colors.text.primary,
      ...shadows.sm,
    },

    inputError: {
      borderColor: colors.emergency[500],
      backgroundColor: isDark
        ? `${colors.emergency[500]}20`
        : colors.emergency[50],
    },

    inputSuccess: {
      borderColor: colors.success[500],
      backgroundColor: isDark ? `${colors.success[500]}20` : colors.success[50],
    },

    errorText: {
      color: colors.emergency[600],
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      fontWeight: typography.fontWeights.medium,
      marginTop: -spacing[2],
    },

    successText: {
      color: colors.success[600],
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      fontWeight: typography.fontWeights.semibold,
      marginTop: -spacing[2],
    },

    infoSection: {
      backgroundColor: isDark
        ? `${colors.primary[500]}20`
        : `${colors.primary[100]}`,
      borderRadius: borderRadius.lg,
      padding: spacing[5],
      marginBottom: spacing[8],
      borderLeftWidth: 4,
      borderLeftColor: colors.primary[500],
    },

    infoTitle: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[2],
      textAlign: "center",
    },

    infoText: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      lineHeight: typography.lineHeights.normal,
    },

    featuresSection: {
      marginBottom: spacing[8],
    },

    featureItem: {
      backgroundColor: colors.background.glassMedium,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.border.light,
      alignItems: "center",
    },

    featureText: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.medium,
      textAlign: "center",
    },

    buttonSection: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: width < 360 ? spacing[4] : spacing[6],
      paddingBottom: height > 800 ? spacing[12] : spacing[8], // Extra padding for tall screens
      backgroundColor: colors.background.dark,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },

    finishButton: {
      backgroundColor: colors.success[500],
      paddingVertical: width < 360 ? spacing[4] : spacing[5],
      paddingHorizontal: spacing[8],
      borderRadius: borderRadius.lg,
      alignItems: "center",
      ...shadows.lg,
      borderWidth: 2,
      borderColor: colors.success[600],
    },

    finishButtonDisabled: {
      backgroundColor: colors.neutral[400],
      borderColor: colors.neutral[500],
      ...shadows.sm,
    },

    finishButtonText: {
      color: "#ffffff",
      fontSize:
        width < 360 ? typography.fontSizes.base : typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.wide,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },

    finishButtonTextDisabled: {
      color: colors.text.disabled,
    },

    bottomHint: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      marginTop: spacing[3],
      fontStyle: "italic",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>
              Let's set up your Kingdom United app to connect you with your
              local prayer community.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>ZIP CODE</Text>
              <Text style={styles.inputHelper}>
                Enter your 5-digit ZIP code to find local prayer requests
              </Text>

              <TextInput
                value={zip}
                onChangeText={handleZipChange}
                maxLength={5}
                style={[
                  styles.input,
                  zip.length > 0 && !isValid && styles.inputError,
                  isValid && styles.inputSuccess,
                ]}
                placeholder="12345"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={finishPressed}
                autoFocus={true}
                textAlign="center"
              />

              {/* Validation Messages */}
              {zip.length > 0 && !isValid && (
                <Text style={styles.errorText}>
                  {zip.length < 5
                    ? `${5 - zip.length} more digit${
                        5 - zip.length !== 1 ? "s" : ""
                      } needed`
                    : "Please enter a valid ZIP code"}
                </Text>
              )}

              {isValid && (
                <Text style={styles.successText}>
                  ✓ Great! You'll see prayers from the {zip} area
                </Text>
              )}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
            <Text style={styles.infoText}>
              Your ZIP code helps us show you prayer requests from your local
              community. We never share your personal information and all
              prayers are anonymous.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[
              styles.finishButton,
              (!isValid || isLoading) && styles.finishButtonDisabled,
            ]}
            onPress={finishPressed}
            disabled={!isValid || isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.finishButtonText,
                (!isValid || isLoading) && styles.finishButtonTextDisabled,
              ]}
            >
              {isLoading ? "SETTING UP..." : "START PRAYING"}
            </Text>
          </TouchableOpacity>

          {!isValid && zip.length === 0 && (
            <Text style={styles.bottomHint}>
              Enter your ZIP code above to continue
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

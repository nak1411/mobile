// app/App.js - Optimized with Performance Improvements
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	View,
	ActivityIndicator,
	Text,
	StatusBar,
	AppState,
} from "react-native";

// Import Theme Provider
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Import screens directly (React.lazy not fully supported in React Native)
import OnboardingForm from "./screens/OnboardingForm.js";
import HomeScreen from "./screens/HomeScreen.js";
import SosScreen from "./screens/SosScreen.js";
import RequestsScreen from "./screens/RequestsScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import WarriorBookScreen from "./screens/WarriorBookScreen.js";
import MyPrayersScreen from "./screens/MyPrayersScreen.js";

const Stack = createNativeStackNavigator();

// Memoized loading component to prevent unnecessary re-renders
const LoadingScreen = React.memo(({ message = "Loading...", colors }) => (
	<View
		style={{
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: colors.background.dark,
		}}
	>
		<ActivityIndicator size="large" color={colors.primary[500]} />
		<Text
			style={{
				marginTop: 16,
				color: colors.text.primary,
				fontSize: 16,
				fontWeight: "500",
			}}
		>
			{message}
		</Text>
	</View>
));

LoadingScreen.displayName = "LoadingScreen";

// Cache for onboarding status to reduce AsyncStorage calls
let onboardingCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute

// Main App Component (wrapped with theme)
const AppContent = React.memo(() => {
	const { colors, isDark } = useTheme();
	const [isOnboarded, setIsOnboarded] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [appState, setAppState] = useState(AppState.currentState);

	// Optimized onboarding status checker with caching
	const checkOnboardingStatus = useCallback(async (forceRefresh = false) => {
		try {
			const now = Date.now();

			// Use cache if available and not forced refresh
			if (
				!forceRefresh &&
				onboardingCache !== null &&
				now - cacheTimestamp < CACHE_DURATION
			) {
				setIsOnboarded(onboardingCache);
				return;
			}

			const onboardedValue = await AsyncStorage.getItem("onboarded");
			console.log("Onboarding status:", onboardedValue);

			const isOnboardedValue = onboardedValue === "true";
			setIsOnboarded(isOnboardedValue);

			// Update cache
			onboardingCache = isOnboardedValue;
			cacheTimestamp = now;
		} catch (error) {
			console.error("Failed to check onboarding status:", error);
			setIsOnboarded(false);
			// Don't cache errors
		}
	}, []);

	// Handle app state changes for cache invalidation
	const handleAppStateChange = useCallback(
		(nextAppState) => {
			if (appState.match(/inactive|background/) && nextAppState === "active") {
				// App came to foreground, check for changes
				checkOnboardingStatus(true);
			}
			setAppState(nextAppState);
		},
		[appState, checkOnboardingStatus]
	);

	// Effect for app state listener
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange
		);
		return () => subscription?.remove();
	}, [handleAppStateChange]);

	// Initial onboarding check
	useEffect(() => {
		const initializeApp = async () => {
			setIsLoading(true);
			await checkOnboardingStatus();
			setIsLoading(false);
		};

		initializeApp();
	}, [checkOnboardingStatus]);

	// Memoized screen options
	const defaultScreenOptions = useMemo(
		() => ({
			headerShown: false,
			animation: "fade_from_bottom",
			contentStyle: { backgroundColor: colors.background.dark },
		}),
		[colors.background.dark]
	);

	// Show loading screen
	if (isLoading) {
		return (
			<>
				<StatusBar
					barStyle={isDark ? "light-content" : "dark-content"}
					backgroundColor={colors.background.dark}
				/>
				<LoadingScreen message="Initializing app..." colors={colors} />
			</>
		);
	}

	return (
		<NavigationContainer>
			<StatusBar
				barStyle={isDark ? "light-content" : "dark-content"}
				backgroundColor={colors.background.dark}
			/>
			<Stack.Navigator screenOptions={defaultScreenOptions}>
				{!isOnboarded ? (
					// Show onboarding if user hasn't completed setup
					<Stack.Screen
						name="Onboarding"
						component={OnboardingForm}
						options={{
							animation: "none",
						}}
					/>
				) : null}

				{/* Main app screens */}
				<Stack.Screen name="Home" component={HomeScreen} />

				<Stack.Screen name="Sos" component={SosScreen} />

				<Stack.Screen name="Requests" component={RequestsScreen} />

				<Stack.Screen name="Settings" component={SettingsScreen} />

				<Stack.Screen name="WarriorBook" component={WarriorBookScreen} />

				<Stack.Screen name="MyPrayers" component={MyPrayersScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
});

AppContent.displayName = "AppContent";

// Error Boundary for better error handling
class AppErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("App Error Boundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#2c3e50",
						padding: 20,
					}}
				>
					<Text
						style={{
							color: "#ffffff",
							fontSize: 18,
							fontWeight: "bold",
							marginBottom: 10,
							textAlign: "center",
						}}
					>
						Something went wrong
					</Text>
					<Text
						style={{
							color: "#e5e7eb",
							fontSize: 14,
							textAlign: "center",
							marginBottom: 20,
						}}
					>
						Please restart the app to continue
					</Text>
				</View>
			);
		}
		return this.props.children;
	}
}

// Root App Component
const App = React.memo(() => {
	return (
		<AppErrorBoundary>
			<ThemeProvider>
				<AppContent />
			</ThemeProvider>
		</AppErrorBoundary>
	);
});

export default App;

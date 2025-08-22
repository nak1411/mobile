// app/context/ThemeContext.js - Optimized Theme Management Context
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, createCommonStyles } from '../styles/theme';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component - Optimized with memoization
export const ThemeProvider = React.memo(({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.dark); // Default to dark
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized theme preference loader
  const loadThemePreference = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      console.log('Loaded theme preference:', savedTheme);
      
      if (savedTheme === 'light') {
        setCurrentTheme(themes.light);
        setIsDark(false);
      } else {
        setCurrentTheme(themes.dark);
        setIsDark(true);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      // Default to dark theme on error
      setCurrentTheme(themes.dark);
      setIsDark(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized theme preference saver
  const saveThemePreference = useCallback(async (themeType) => {
    try {
      await AsyncStorage.setItem('theme', themeType);
      console.log('Saved theme preference:', themeType);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, []);

  // Optimized theme toggler with batched state updates
  const toggleTheme = useCallback(async () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? themes.dark : themes.light;
    const themeType = newIsDark ? 'dark' : 'light';
    
    // Batch state updates to prevent multiple re-renders
    setIsDark(newIsDark);
    setCurrentTheme(newTheme);
    
    // Save preference
    await saveThemePreference(themeType);
    
    console.log('Theme toggled to:', themeType);
  }, [isDark, saveThemePreference]);

  // Optimized theme setter with batched state updates
  const setTheme = useCallback(async (themeType) => {
    const newIsDark = themeType === 'dark';
    const newTheme = newIsDark ? themes.dark : themes.light;
    
    // Batch state updates to prevent multiple re-renders
    setIsDark(newIsDark);
    setCurrentTheme(newTheme);
    
    // Save preference
    await saveThemePreference(themeType);
    
    console.log('Theme set to:', themeType);
  }, [saveThemePreference]);

  // Load theme on mount
  useEffect(() => {
    loadThemePreference();
  }, [loadThemePreference]);

  // Memoized common styles - only recalculate when theme changes
  const commonStyles = useMemo(() => 
    createCommonStyles(currentTheme), 
    [currentTheme]
  );

  // Memoized context value - prevents unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Theme state
    currentTheme,
    isDark,
    isLoading,
    
    // Theme actions
    toggleTheme,
    setTheme,
    
    // Convenience properties (cached from current theme)
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
    dimensions: currentTheme.dimensions,
    
    // Common styles (memoized)
    commonStyles,
  }), [
    currentTheme,
    isDark,
    isLoading,
    toggleTheme,
    setTheme,
    commonStyles,
  ]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

// Custom hook to use theme - optimized with error handling
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC for components that need theme - optimized with memo
export const withTheme = (Component) => {
  const WrappedComponent = React.memo((props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  });
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ThemeContext;
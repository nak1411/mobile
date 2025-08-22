// app/utils/user.js - Optimized User Management Utilities with Reddit-style User IDs
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cache for user data to reduce AsyncStorage calls
let userDataCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Storage keys as constants to prevent typos and enable better minification
const STORAGE_KEYS = Object.freeze({
  USER_ID: 'userId',
  ZIP: 'zip',
  ONBOARDED: 'onboarded',
  PRAYER: 'prayer',
  USER_ID_VERSION: 'userIdVersion', // New key for tracking migration
});

// Current user ID version for migration tracking
const CURRENT_USER_ID_VERSION = '2.0'; // Version for Reddit-style IDs

// Enhanced word lists for Reddit-style user IDs
const ADJECTIVES = [
  'Amazing', 'Brave', 'Creative', 'Dynamic', 'Epic', 'Fierce', 'Golden', 'Happy',
  'Incredible', 'Joyful', 'Kind', 'Loyal', 'Mighty', 'Noble', 'Outstanding', 'Peaceful',
  'Quick', 'Radiant', 'Strong', 'Triumphant', 'Ultimate', 'Vibrant', 'Wise', 'Zealous',
  'Brilliant', 'Cheerful', 'Daring', 'Elegant', 'Fantastic', 'Graceful', 'Heroic', 'Inspiring',
  'Lucky', 'Majestic', 'Optimistic', 'Perfect', 'Quiet', 'Reliable', 'Spectacular', 'Trustworthy',
  'Unique', 'Victorious', 'Wonderful', 'Extraordinary', 'Youthful', 'Zestful', 'Bold', 'Cosmic'
];

const NOUNS = [
  'Warrior', 'Eagle', 'Phoenix', 'Thunder', 'Spirit', 'Champion', 'Guardian', 'Knight',
  'Hero', 'Saint', 'Lion', 'Tiger', 'Dragon', 'Falcon', 'Wolf', 'Bear', 'Ranger',
  'Scout', 'Hunter', 'Defender', 'Fighter', 'Builder', 'Leader', 'Pioneer', 'Explorer',
  'Voyager', 'Seeker', 'Master', 'Legend', 'Titan', 'Giant', 'Force', 'Storm',
  'Comet', 'Star', 'Meteor', 'Blaze', 'Flash', 'Spark', 'Flame', 'Rocket', 'Arrow',
  'Sword', 'Shield', 'Crown', 'Gem', 'Crystal', 'Diamond', 'Pearl', 'Jewel'
];

// Reddit-style user ID generator
const generateRedditStyleUserId = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const numbers = Math.floor(Math.random() * 9999);
  
  return `${adjective}${noun}${numbers}`;
};

// Legacy user ID generation (kept for reference)
const generateLegacyUserId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const performance = typeof performance !== 'undefined' ? performance.now() : Date.now();
  return `user_${timestamp}_${random}_${Math.floor(performance)}`;
};

// Cached user ID to prevent regeneration
let cachedUserId = null;

// Enhanced getUserId with automatic migration support
const getUserId = async () => {
  try {
    // Return cached ID if available
    if (cachedUserId) {
      return cachedUserId;
    }

    // Get both user ID and version in a single batch operation
    const storageResults = await AsyncStorage.multiGet([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_ID_VERSION
    ]);

    const existingUserId = storageResults[0][1];
    const userIdVersion = storageResults[1][1];

    let userId = existingUserId;

    // Check if migration is needed
    if (existingUserId && userIdVersion !== CURRENT_USER_ID_VERSION) {
      console.log('🔄 Migrating user ID from old format to Reddit-style format');
      console.log('📝 Old user ID:', existingUserId);
      
      // Generate new Reddit-style ID
      const newUserId = generateRedditStyleUserId();
      
      // Update storage with new ID and version
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_ID, newUserId],
        [STORAGE_KEYS.USER_ID_VERSION, CURRENT_USER_ID_VERSION]
      ]);
      
      userId = newUserId;
      console.log('✅ User ID migrated successfully:', newUserId);
      
      // Log migration for analytics/debugging
      if (__DEV__) {
        console.log('🔍 Migration details:', {
          oldFormat: existingUserId,
          newFormat: newUserId,
          version: CURRENT_USER_ID_VERSION,
          timestamp: new Date().toISOString()
        });
      }
      
    } else if (!existingUserId) {
      // New user - generate Reddit-style ID
      userId = generateRedditStyleUserId();
      
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_ID, userId],
        [STORAGE_KEYS.USER_ID_VERSION, CURRENT_USER_ID_VERSION]
      ]);
      
      console.log('🆕 Generated new Reddit-style user ID:', userId);
    } else {
      // Existing user with current version - no migration needed
      console.log('✅ Using existing Reddit-style user ID:', userId);
    }
    
    cachedUserId = userId;
    return userId;
  } catch (error) {
    console.error('❌ Failed to get/create user ID:', error);
    // Return a temporary Reddit-style ID as fallback but don't cache it
    const fallbackId = generateRedditStyleUserId();
    console.log('🚨 Using temporary fallback ID:', fallbackId);
    return fallbackId;
  }
};

// Check if user ID needs migration (utility function)
const needsUserIdMigration = async () => {
  try {
    const version = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID_VERSION);
    const hasUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    return hasUserId && version !== CURRENT_USER_ID_VERSION;
  } catch (error) {
    console.error('❌ Failed to check migration status:', error);
    return false;
  }
};

// Force migration for testing/admin purposes
const forceUserIdMigration = async () => {
  try {
    const oldUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    const newUserId = generateRedditStyleUserId();
    
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER_ID, newUserId],
      [STORAGE_KEYS.USER_ID_VERSION, CURRENT_USER_ID_VERSION]
    ]);
    
    // Clear cache to force refresh
    userDataCache = null;
    cacheTimestamp = 0;
    cachedUserId = null;
    
    console.log('🔄 Forced user ID migration:', { old: oldUserId, new: newUserId });
    return newUserId;
  } catch (error) {
    console.error('❌ Failed to force user ID migration:', error);
    throw error;
  }
};

// Get migration status for debugging
const getMigrationStatus = async () => {
  try {
    const [userId, version] = await AsyncStorage.multiGet([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_ID_VERSION
    ]);

    const currentUserId = userId[1];
    const currentVersion = version[1];
    const needsMigration = currentUserId && currentVersion !== CURRENT_USER_ID_VERSION;
    
    return {
      userId: currentUserId,
      version: currentVersion,
      currentVersion: CURRENT_USER_ID_VERSION,
      needsMigration,
      isRedditStyle: currentVersion === CURRENT_USER_ID_VERSION,
      isLegacyFormat: currentUserId && currentUserId.startsWith('user_'),
    };
  } catch (error) {
    console.error('❌ Failed to get migration status:', error);
    return {
      userId: null,
      version: null,
      currentVersion: CURRENT_USER_ID_VERSION,
      needsMigration: false,
      isRedditStyle: false,
      isLegacyFormat: false,
      error: error.message,
    };
  }
};

// Batch AsyncStorage operations for better performance
const batchAsyncStorageGet = async (keys) => {
  try {
    const results = await AsyncStorage.multiGet(keys);
    return results.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error('❌ Failed to batch get from AsyncStorage:', error);
    return {};
  }
};

const batchAsyncStorageSet = async (keyValuePairs) => {
  try {
    const pairs = Object.entries(keyValuePairs).map(([key, value]) => [key, String(value)]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('❌ Failed to batch set to AsyncStorage:', error);
    throw error;
  }
};

// Enhanced getUserData with migration support
const getUserData = async () => {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (userDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return userDataCache;
    }

    // This will automatically handle migration if needed
    const userId = await getUserId();
    
    // Batch get remaining data including version tracking
    const storageData = await batchAsyncStorageGet([
      STORAGE_KEYS.ZIP,
      STORAGE_KEYS.ONBOARDED,
      STORAGE_KEYS.USER_ID_VERSION,
    ]);

    const userData = {
      userId,
      zip: storageData[STORAGE_KEYS.ZIP] || null,
      isOnboarded: storageData[STORAGE_KEYS.ONBOARDED] === "true",
      userIdVersion: storageData[STORAGE_KEYS.USER_ID_VERSION] || CURRENT_USER_ID_VERSION,
      isRedditStyleId: storageData[STORAGE_KEYS.USER_ID_VERSION] === CURRENT_USER_ID_VERSION,
    };

    // Cache the result
    userDataCache = userData;
    cacheTimestamp = now;

    return userData;
  } catch (error) {
    console.error('❌ Failed to get user data:', error);
    // Return fallback data with new format
    return {
      userId: generateRedditStyleUserId(),
      zip: null,
      isOnboarded: false,
      userIdVersion: CURRENT_USER_ID_VERSION,
      isRedditStyleId: true,
    };
  }
};

// Update user data with cache invalidation and batch operations
const updateUserData = async (data) => {
  try {
    const updates = {};
    
    if (data.zip !== undefined) {
      updates[STORAGE_KEYS.ZIP] = String(data.zip);
    }
    
    if (data.onboarded !== undefined) {
      updates[STORAGE_KEYS.ONBOARDED] = String(data.onboarded);
    }
    
    if (data.userId !== undefined) {
      updates[STORAGE_KEYS.USER_ID] = String(data.userId);
      updates[STORAGE_KEYS.USER_ID_VERSION] = CURRENT_USER_ID_VERSION;
      cachedUserId = String(data.userId); // Update cache
    }

    if (Object.keys(updates).length > 0) {
      await batchAsyncStorageSet(updates);
      
      // Invalidate cache to force refresh on next getUserData call
      userDataCache = null;
      cacheTimestamp = 0;
      
      console.log('✅ User data updated:', data);
    }
  } catch (error) {
    console.error('❌ Failed to update user data:', error);
    throw error;
  }
};

// Enhanced clearUserData with version cleanup
const clearUserData = async () => {
  try {
    const keysToRemove = [
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.ZIP,
      STORAGE_KEYS.PRAYER,
      STORAGE_KEYS.USER_ID_VERSION, // Also remove version tracking
    ];

    // Use multiRemove for better performance
    await AsyncStorage.multiRemove(keysToRemove);
    
    // Reset onboarded to false instead of removing
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, "false");
    
    // Clear caches
    userDataCache = null;
    cacheTimestamp = 0;
    cachedUserId = null;
    
    console.log('🧹 User data cleared (including version tracking)');
  } catch (error) {
    console.error('❌ Failed to clear user data:', error);
    throw error;
  }
};

// Enhanced validation with Reddit-style ID support
const validateUserData = (userData) => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }

  // Check required fields
  if (!userData.userId || typeof userData.userId !== 'string') {
    return false;
  }

  // Validate user ID format (support both legacy and Reddit-style)
  const isLegacyFormat = userData.userId.startsWith('user_');
  const isRedditFormat = /^[A-Z][a-z]+[A-Z][a-z]+\d{1,4}$/.test(userData.userId);
  
  if (!isLegacyFormat && !isRedditFormat) {
    console.warn('⚠️ User ID has unexpected format:', userData.userId);
    // Don't fail validation, just warn
  }

  // Validate zip code format if present
  if (userData.zip !== null && !/^\d{5}$/.test(String(userData.zip))) {
    return false;
  }

  // Validate onboarded status
  if (typeof userData.isOnboarded !== 'boolean') {
    return false;
  }

  return true;
};

// Get user preferences with defaults
const getUserPreferences = async () => {
  try {
    const prefsString = await AsyncStorage.getItem('userPreferences');
    const preferences = prefsString ? JSON.parse(prefsString) : {};
    
    // Return preferences with defaults
    return {
      notifications: true,
      darkMode: true,
      realTimeUpdates: true,
      ...preferences,
    };
  } catch (error) {
    console.error('❌ Failed to get user preferences:', error);
    // Return defaults on error
    return {
      notifications: true,
      darkMode: true,
      realTimeUpdates: true,
    };
  }
};

// Update user preferences
const updateUserPreferences = async (preferences) => {
  try {
    const currentPrefs = await getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    console.log('✅ User preferences updated:', preferences);
  } catch (error) {
    console.error('❌ Failed to update user preferences:', error);
    throw error;
  }
};

// Check if user setup is complete
const isUserSetupComplete = async () => {
  try {
    const userData = await getUserData();
    return userData.isOnboarded && userData.zip !== null;
  } catch (error) {
    console.error('❌ Failed to check user setup:', error);
    return false;
  }
};

// Export optimized user utilities with migration support
export const userUtils = Object.freeze({
  // Core functions
  generateRedditStyleUserId,
  generateLegacyUserId, // Keep for reference
  getUserId,
  getUserData,
  updateUserData,
  clearUserData,
  
  // Migration functions
  needsUserIdMigration,
  forceUserIdMigration,
  getMigrationStatus,
  
  // Utility functions
  validateUserData,
  getUserPreferences,
  updateUserPreferences,
  isUserSetupComplete,
  
  // Cache management
  clearCache: () => {
    userDataCache = null;
    cacheTimestamp = 0;
    cachedUserId = null;
  },
  
  // Constants
  CURRENT_USER_ID_VERSION,
  
  // For testing/debugging
  __testing__: __DEV__ ? {
    userDataCache,
    cacheTimestamp,
    cachedUserId,
    STORAGE_KEYS,
    CACHE_DURATION,
    ADJECTIVES,
    NOUNS,
  } : {},
});

// Auto-cleanup on app termination (if supported)
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('beforeunload', () => {
    userUtils.clearCache();
  });
}

export default userUtils;
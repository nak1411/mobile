// app/config/api.js - Complete API Configuration with all missing functions
import { Platform } from 'react-native';
import { validatePrayerContent, quickValidateContent } from '../utils/contentFilter.js';

// Environment detection
const isProduction = !__DEV__;
const isStaging = process.env.NODE_ENV === 'staging';

// Production API URLs
const getBaseURL = () => {
  if (isProduction) {
    return 'https://kingdom-united-api.onrender.com'; // Your production API
  } else if (isStaging) {
    return 'https://kingdom-united-staging.onrender.com'; // Staging API
  } else {
    // Development URLs
    return Platform.OS === 'ios' 
      ? 'http://localhost:5001'
      : 'https://kingdom-united-app.onrender.com';
  }
};

// Production-optimized configuration
export const API_CONFIG = Object.freeze({
  BASE_URL: getBaseURL(),
  
  ENDPOINTS: Object.freeze({
    PRAYERS: '/data',
    PRAYERS_BY_USER: '/data/user',
    PRAYERS_BY_ZIP: '/data/zip',
    HEALTH: '/health',
  }),
  
  // Production-optimized timeouts
  TIMEOUT: isProduction ? 30000 : 15000,
  
  DEFAULT_HEADERS: Object.freeze({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': `KingdomUnited/1.0.0`,
  }),
  
  // Enhanced retry for production
  RETRY_ATTEMPTS: isProduction ? 3 : 1,
  RETRY_DELAY: 2000,
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  CACHE_TTL: isProduction ? 300000 : 30000, // 5 min prod, 30 sec dev
});

// Request rate limiting
const requestTracker = new Map();
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of requestTracker) {
    if (now - timestamp > 60000) { // 1 minute
      requestTracker.delete(key);
    }
  }
}, 30000); // Clean up every 30 seconds

// Enhanced request function with full implementation
const executeRequest = async (url, options, requestKey) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    console.log(`[API] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response: ${errorText}`);
      
      if (response.status >= 500) {
        throw new Error(`Server error (${response.status}): ${errorText || 'Internal server error'}`);
      } else if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorText || 'Invalid request data'}`);
      } else {
        throw new Error(`Request failed (${response.status}): ${errorText || response.statusText}`);
      }
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    
    console.error(`[API] Request failed:`, error);
    throw error;
  }
};

// Main API request function with rate limiting
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const requestKey = `${options.method || 'GET'}_${endpoint}`;
  
  // Rate limiting check
  const now = Date.now();
  const recentRequests = Array.from(requestTracker.values())
    .filter(timestamp => now - timestamp < 60000);
  
  if (recentRequests.length >= API_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  
  requestTracker.set(`${requestKey}_${now}`, now);
  
  // Retry logic
  let lastError;
  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      return await executeRequest(url, options, requestKey);
    } catch (error) {
      lastError = error;
      
      if (attempt < API_CONFIG.RETRY_ATTEMPTS && isRetryableError(error)) {
        console.log(`[API] Attempt ${attempt} failed, retrying in ${API_CONFIG.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

// Helper function to determine if error is retryable
const isRetryableError = (error) => {
  const retryableMessages = [
    'network request failed',
    'request timeout',
    'server error',
    'internal server error',
    'service unavailable',
    'bad gateway',
    'gateway timeout'
  ];
  
  return retryableMessages.some(msg => 
    error.message.toLowerCase().includes(msg)
  );
};

// Prayer API functions
export const prayerAPI = Object.freeze({
  // Submit new prayer request
  submit: async (prayerData) => {
    try {
      console.log('[prayerAPI] Submitting prayer:', prayerData);
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRAYERS, {
        method: 'POST',
        body: JSON.stringify(prayerData),
      });
      
      console.log('[prayerAPI] Prayer submitted successfully:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Submit failed:', error);
      throw error;
    }
  },

  // Get all prayers
  getAll: async () => {
    try {
      console.log('[prayerAPI] Fetching all prayers');
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRAYERS, {
        method: 'GET',
      });
      
      console.log('[prayerAPI] All prayers fetched:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Get all failed:', error);
      throw error;
    }
  },

  // Get prayers by user ID
  getByUser: async (userId) => {
    try {
      console.log('[prayerAPI] Fetching prayers for user:', userId);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS_BY_USER}/${userId}`, {
        method: 'GET',
      });
      
      console.log('[prayerAPI] User prayers fetched:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Get by user failed:', error);
      throw error;
    }
  },

  // Get prayers by zip code
  getByZip: async (zip) => {
    try {
      console.log('[prayerAPI] Fetching prayers for zip:', zip);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS_BY_ZIP}/${zip}`, {
        method: 'GET',
      });
      
      console.log('[prayerAPI] Zip prayers fetched:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Get by zip failed:', error);
      throw error;
    }
  },

  // Get single prayer by ID
  getById: async (id) => {
    try {
      console.log('[prayerAPI] Fetching prayer by ID:', id);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`, {
        method: 'GET',
      });
      
      console.log('[prayerAPI] Prayer fetched:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Get by ID failed:', error);
      throw error;
    }
  },

  // Update prayer (all fields)
  update: async (id, updateData) => {
    try {
      console.log('[prayerAPI] Updating prayer:', id, updateData);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      console.log('[prayerAPI] Prayer updated:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Update failed:', error);
      throw error;
    }
  },

  // Update prayer text only
  updateText: async (id, prayerText) => {
    try {
      console.log('[prayerAPI] Updating prayer text:', id, prayerText);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}/text`, {
        method: 'PUT',
        body: JSON.stringify({ prayerText }),
      });
      
      console.log('[prayerAPI] Prayer text updated:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Update text failed:', error);
      throw error;
    }
  },

  // Update zip only
  updateZip: async (id, zip) => {
    try {
      console.log('[prayerAPI] Updating prayer zip:', id, zip);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}/zip`, {
        method: 'PUT',
        body: JSON.stringify({ zip }),
      });
      
      console.log('[prayerAPI] Prayer zip updated:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Update zip failed:', error);
      throw error;
    }
  },

  // Delete prayer
  delete: async (id) => {
    try {
      console.log('[prayerAPI] Deleting prayer:', id);
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRAYERS}/${id}`, {
        method: 'DELETE',
      });
      
      console.log('[prayerAPI] Prayer deleted:', response);
      return response;
    } catch (error) {
      console.error('[prayerAPI] Delete failed:', error);
      throw error;
    }
  },
});

// Validation functions
export const validation = Object.freeze({
  // Validate prayer text with content filtering
  validatePrayerText: async (text, minLength = 5, maxLength = 125) => {
    try {
      console.log('[validation] Validating prayer text:', text);
      
      if (!text || typeof text !== 'string') {
        return {
          isValid: false,
          error: 'Please enter your prayer request',
          suggestions: ['Share what you need prayer for in a respectful way'],
          hasInappropriateContent: false,
        };
      }

      const trimmedText = text.trim();
      
      if (trimmedText.length === 0) {
        return {
          isValid: false,
          error: 'Please enter your prayer request',
          suggestions: ['Share what you need prayer for'],
          hasInappropriateContent: false,
        };
      }

      if (trimmedText.length < minLength) {
        return {
          isValid: false,
          error: `Prayer request must be at least ${minLength} characters`,
          suggestions: ['Add more details about your prayer request'],
          hasInappropriateContent: false,
        };
      }

      if (trimmedText.length > maxLength) {
        return {
          isValid: false,
          error: `Prayer request must be no more than ${maxLength} characters`,
          suggestions: ['Please shorten your prayer request'],
          hasInappropriateContent: false,
        };
      }

      // Use content filter for validation
      const contentResult = validatePrayerContent(trimmedText);
      
      return {
        isValid: contentResult.isValid,
        error: contentResult.error,
        suggestions: contentResult.suggestions || [],
        hasInappropriateContent: contentResult.hasInappropriateContent,
      };
      
    } catch (error) {
      console.error('[validation] Prayer text validation failed:', error);
      return {
        isValid: false,
        error: 'Validation error - please try again',
        suggestions: [],
        hasInappropriateContent: false,
      };
    }
  },

  // Quick validation for real-time feedback
  quickValidatePrayerText: (text) => {
    try {
      console.log('[validation] Quick validating prayer text');
      
      if (!text || typeof text !== 'string') {
        return { isValid: true };
      }

      const trimmedText = text.trim();
      if (trimmedText.length === 0) {
        return { isValid: true };
      }

      // Use content filter for quick validation
      return quickValidateContent(trimmedText);
      
    } catch (error) {
      console.error('[validation] Quick validation failed:', error);
      return { isValid: true }; // Fail gracefully
    }
  },

  // Validate zip code format
  validateZipCode: (zip) => {
    try {
      if (!zip) return false;
      const zipString = String(zip).trim();
      return /^\d{5}$/.test(zipString);
    } catch (error) {
      console.error('[validation] Zip validation failed:', error);
      return false;
    }
  },

  // Validate user ID format
  validateUserId: (userId) => {
    try {
      if (!userId || typeof userId !== 'string') return false;
      
      const trimmedId = userId.trim();
      if (trimmedId.length === 0) return false;
      
      // Accept both legacy and Reddit-style IDs
      const isLegacyFormat = trimmedId.startsWith('user_');
      const isRedditFormat = /^[A-Z][a-z]+[A-Z][a-z]+\d{1,4}$/.test(trimmedId);
      const isValidLength = trimmedId.length >= 3 && trimmedId.length <= 50;
      
      return isValidLength && (isLegacyFormat || isRedditFormat || trimmedId.length > 5);
    } catch (error) {
      console.error('[validation] User ID validation failed:', error);
      return false;
    }
  },
});

// Error handling utilities
export const errorHandler = Object.freeze({
  // Get user-friendly error message
  getErrorMessage: (error) => {
    try {
      if (!error) return 'An unknown error occurred';
      
      const message = error.message || error.toString();
      
      // Network errors
      if (message.includes('Network request failed') || message.includes('fetch')) {
        return 'Network connection failed. Please check your internet connection and try again.';
      }
      
      if (message.includes('timeout')) {
        return 'Request timed out. Please check your connection and try again.';
      }
      
      // Server errors
      if (message.includes('Server error') || message.includes('500')) {
        return 'Server is temporarily unavailable. Please try again in a moment.';
      }
      
      if (message.includes('404') || message.includes('not found')) {
        return 'The requested resource was not found.';
      }
      
      if (message.includes('400') || message.includes('Bad request')) {
        return 'Invalid request data. Please check your input and try again.';
      }
      
      // Rate limiting
      if (message.includes('Rate limit')) {
        return 'Too many requests. Please wait a moment before trying again.';
      }
      
      // Content filtering
      if (message.includes('inappropriate') || message.includes('content')) {
        return 'Please review your content and ensure it follows community guidelines.';
      }
      
      // Generic fallback
      return message.length > 100 ? 'An error occurred. Please try again.' : message;
      
    } catch (err) {
      console.error('[errorHandler] Error processing error message:', err);
      return 'An error occurred. Please try again.';
    }
  },

  // Check if error is network-related
  isNetworkError: (error) => {
    try {
      if (!error) return false;
      
      const message = (error.message || error.toString()).toLowerCase();
      const networkIndicators = [
        'network request failed',
        'network error',
        'connection failed',
        'timeout',
        'fetch',
        'enotfound',
        'econnrefused',
        'econnreset',
      ];
      
      return networkIndicators.some(indicator => message.includes(indicator));
    } catch (err) {
      console.error('[errorHandler] Error checking network error:', err);
      return false;
    }
  },

  // Check if error is server-related
  isServerError: (error) => {
    try {
      if (!error) return false;
      
      const message = (error.message || error.toString()).toLowerCase();
      return message.includes('server error') || 
             message.includes('500') || 
             message.includes('502') || 
             message.includes('503') || 
             message.includes('504');
    } catch (err) {
      console.error('[errorHandler] Error checking server error:', err);
      return false;
    }
  },
});

// Debug connection function
export const debugConnection = async () => {
  try {
    console.log('[debugConnection] Testing API connection...');
    console.log('[debugConnection] Base URL:', API_CONFIG.BASE_URL);
    
    const response = await apiRequest(API_CONFIG.ENDPOINTS.HEALTH, {
      method: 'GET',
    });
    
    console.log('[debugConnection] Health check successful:', response);
    
    return {
      success: true,
      message: 'API connection successful',
      baseUrl: API_CONFIG.BASE_URL,
      timestamp: new Date().toISOString(),
      response: response,
    };
    
  } catch (error) {
    console.error('[debugConnection] Health check failed:', error);
    
    return {
      success: false,
      error: errorHandler.getErrorMessage(error),
      baseUrl: API_CONFIG.BASE_URL,
      timestamp: new Date().toISOString(),
      details: error.message,
    };
  }
};

// Cleanup function for rate limiting
export const cleanup = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  requestTracker.clear();
};

// Export default configuration
export default {
  API_CONFIG,
  apiRequest,
  prayerAPI,
  validation,
  errorHandler,
  debugConnection,
  cleanup,
};
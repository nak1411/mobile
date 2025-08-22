// app/utils/contentFilter.js - Optimized Content Filter for Prayer Requests

// Basic profanity words - optimized as Set for O(1) lookup
const PROFANITY_SET = new Set([
  // Strong profanity
  'fuck', 'fucking', 'shit', 'bitch', 'damn', 'hell', 'ass', 'crap',
  'bastard', 'whore', 'slut', 'piss', 'cock', 'dick', 'pussy',
  // Variants and common misspellings
  'f*ck', 'f**k', 'sh*t', 'sh**', 'b*tch', 'd*mn', 'a**', 'cr*p',
  'fck', 'fuk', 'sht', 'btch', 'dmn', 'ars', 'azz',
  // Intentional character substitutions
  'f4ck', 'sh1t', 'b1tch', 'd4mn', '@ss', '$hit', 'fu©k'
]);

// Compiled regex patterns for better performance
const INAPPROPRIATE_PATTERNS = [
  // Sexual content (not including appropriate discussion of intimacy issues)
  /\b(porn|pornography|sex tape|nude|naked|horny|sexy time)\b/gi,
  /\b(masturbat|orgasm|climax|cum|cumming)\b/gi,
  /\b(hooker|prostitute|escort|stripper)\b/gi,
  
  // Hate speech and discrimination
  /\b(faggot|fag|dyke|tranny|retard|retarded|spic|chink|nigger|nigga)\b/gi,
  /\b(kike|wetback|towelhead|sandnigger|raghead)\b/gi,
  
  // Violence/threats (excluding appropriate requests for safety)
  /\b(kill myself|suicide|end it all|not worth living)\b/gi,
  /\b(murder|kill you|death threat|bomb|terrorist)\b/gi,
  
  // Spam/promotional content
  /\b(buy now|click here|visit my|check out my|follow me)\b/gi,
  /\b(make money|get rich|free money|bitcoin|crypto)\b/gi,
  /(http|www\.|\.com|\.org|\.net)/gi,
  
  // Inappropriate requests
  /\b(send nudes|hook up|looking for sex|one night stand)\b/gi,
  /\b(drug dealer|selling drugs|buy weed|cocaine|heroin)\b/gi
];

// Sensitive topics that ARE allowed when discussed appropriately - as Set for performance
const ALLOWED_SENSITIVE_TOPICS = new Set([
  'abuse', 'addiction', 'depression', 'anxiety', 'suicide thoughts', 
  'self harm', 'eating disorder', 'alcoholism', 'divorce', 'death',
  'cancer', 'illness', 'miscarriage', 'infertility', 'unemployment',
  'homeless', 'poverty', 'domestic violence', 'sexual assault',
  'trauma', 'ptsd', 'mental health', 'therapy', 'counseling'
]);

// Spam patterns - compiled for performance
const SPAM_PATTERNS = [
  /(.)\1{10,}/g, // Same character repeated 10+ times
  /\b(\w+)\s+\1\s+\1/gi, // Same word repeated 3+ times
  /[A-Z]{20,}/g, // 20+ consecutive capital letters
  /[!?]{5,}/g, // 5+ consecutive exclamation/question marks
  /\.{10,}/g, // 10+ consecutive periods
];

// Cache for validation results to improve performance
const validationCache = new Map();
const CACHE_SIZE_LIMIT = 500;
const CACHE_CLEANUP_THRESHOLD = 400;

// Helper function to manage cache size
const manageCacheSize = () => {
  if (validationCache.size > CACHE_SIZE_LIMIT) {
    // Remove oldest entries
    const keysToDelete = Array.from(validationCache.keys()).slice(0, CACHE_CLEANUP_THRESHOLD);
    keysToDelete.forEach(key => validationCache.delete(key));
  }
};

// Helper function to create cache key
const createCacheKey = (text, type = 'full') => {
  // Use first 100 chars + length for cache key to balance uniqueness and performance
  const truncated = text.slice(0, 100);
  return `${type}_${truncated}_${text.length}`;
};

/**
 * Optimized Content Filter Class
 */
export class ContentFilter {
  constructor(options = {}) {
    this.strictness = options.strictness || 'moderate';
    this.allowSensitiveTopics = options.allowSensitiveTopics !== false;
    this.cacheEnabled = options.cacheEnabled !== false;
  }

  /**
   * Main filtering function with caching
   * @param {string} text - Text to filter
   * @returns {Object} - Filter result with isClean, reason, and suggestions
   */
  filterContent(text) {
    if (!text || typeof text !== 'string') {
      return {
        isClean: false,
        reason: 'Please enter your prayer request',
        suggestions: ['Share what you need prayer for in a respectful way']
      };
    }

    const cleanText = text.trim();
    
    if (cleanText.length === 0) {
      return {
        isClean: false,
        reason: 'Please enter your prayer request',
        suggestions: ['Share what you need prayer for']
      };
    }

    // Check cache first
    if (this.cacheEnabled) {
      const cacheKey = createCacheKey(cleanText, 'full');
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey);
      }
    }

    // Perform validation
    const result = this._performValidation(cleanText);

    // Cache result if enabled
    if (this.cacheEnabled) {
      manageCacheSize();
      const cacheKey = createCacheKey(cleanText, 'full');
      validationCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Internal validation logic
   */
  _performValidation(text) {
    // Check for profanity
    const profanityResult = this.checkProfanity(text);
    if (!profanityResult.isClean) {
      return profanityResult;
    }

    // Check for inappropriate content patterns
    const inappropriateResult = this.checkInappropriateContent(text);
    if (!inappropriateResult.isClean) {
      return inappropriateResult;
    }

    // Check for spam patterns
    const spamResult = this.checkSpamPatterns(text);
    if (!spamResult.isClean) {
      return spamResult;
    }

    // Check content length and quality
    const qualityResult = this.checkContentQuality(text);
    if (!qualityResult.isClean) {
      return qualityResult;
    }

    return {
      isClean: true,
      reason: null,
      suggestions: []
    };
  }

  /**
   * Optimized profanity check using Set lookup
   */
  checkProfanity(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    const words = text.toLowerCase().split(/\s+/);
    
    // Use Set.has() for O(1) lookup instead of Array.includes()
    for (const word of words) {
      // Remove common punctuation
      const cleanWord = word.replace(/[^\w]/g, '');
      if (PROFANITY_SET.has(cleanWord)) {
        return {
          isClean: false,
          reason: 'Please keep your prayer request respectful',
          suggestions: [
            'Share your feelings without using inappropriate language',
            'Our community values respectful communication',
            'Express your concerns in a way that honors others'
          ]
        };
      }
    }

    return { isClean: true };
  }

  /**
   * Optimized inappropriate content check
   */
  checkInappropriateContent(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    const lowerText = text.toLowerCase();

    for (const pattern of INAPPROPRIATE_PATTERNS) {
      if (pattern.test(text)) {
        // Check if it's a sensitive topic that should be allowed
        const isSensitiveTopicDiscussion = Array.from(ALLOWED_SENSITIVE_TOPICS).some(topic => 
          lowerText.includes(topic.toLowerCase())
        );

        // If it's not a sensitive topic discussion, filter it
        if (!isSensitiveTopicDiscussion) {
          return {
            isClean: false,
            reason: 'Please keep your prayer request appropriate for our community',
            suggestions: [
              'Focus on how we can pray for your situation',
              'Share your needs in a way that respects all community members',
              'Remember this is a safe space for spiritual support'
            ]
          };
        }
      }
    }

    return { isClean: true };
  }

  /**
   * Optimized spam pattern check
   */
  checkSpamPatterns(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    for (const pattern of SPAM_PATTERNS) {
      // Reset regex lastIndex to ensure consistent behavior
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        return {
          isClean: false,
          reason: 'Please write your prayer request naturally',
          suggestions: [
            'Avoid excessive repetition or special characters',
            'Write in a conversational, sincere manner',
            'Share your genuine prayer needs'
          ]
        };
      }
    }

    // Check for URLs or promotional content
    if (/(http|www\.|\.com|\.org|\.net)/gi.test(text)) {
      return {
        isClean: false,
        reason: 'Please don\'t include links or promotional content',
        suggestions: [
          'Focus on your prayer request without external links',
          'Share your personal situation instead',
          'Keep the focus on spiritual support'
        ]
      };
    }

    return { isClean: true };
  }

  /**
   * Optimized content quality check
   */
  checkContentQuality(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    const trimmed = text.trim();

    // Check if it's too short to be meaningful
    if (trimmed.length < 5) {
      return {
        isClean: false,
        reason: 'Please share more details about your prayer request',
        suggestions: [
          'Help us understand how to pray for you',
          'Share what specific support you need',
          'Give us enough context to pray effectively'
        ]
      };
    }

    // Check if it's just random characters or gibberish
    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const totalLength = trimmed.length;
    
    if (letterCount / totalLength < 0.5 && totalLength > 10) {
      return {
        isClean: false,
        reason: 'Please write your prayer request clearly',
        suggestions: [
          'Use regular words to describe your situation',
          'Help us understand your prayer needs',
          'Write in a way others can relate to and pray for'
        ]
      };
    }

    return { isClean: true };
  }

  /**
   * Quick validation for real-time feedback with caching
   */
  quickValidate(text) {
    if (!text || typeof text !== 'string') {
      return { isValid: true };
    }
    
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return { isValid: true };
    }

    // Check cache first for quick validation
    if (this.cacheEnabled) {
      const cacheKey = createCacheKey(trimmed, 'quick');
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey);
      }
    }
    
    const lowerText = trimmed.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    // Quick profanity check (first 10 words for performance)
    const wordsToCheck = words.slice(0, 10);
    for (const word of wordsToCheck) {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (PROFANITY_SET.has(cleanWord)) {
        const result = { 
          isValid: false, 
          message: 'Please keep your language respectful' 
        };
        
        if (this.cacheEnabled) {
          manageCacheSize();
          const cacheKey = createCacheKey(trimmed, 'quick');
          validationCache.set(cacheKey, result);
        }
        
        return result;
      }
    }

    // Quick inappropriate content check (first 3 patterns)
    const patternsToCheck = INAPPROPRIATE_PATTERNS.slice(0, 3);
    const hasInappropriate = patternsToCheck.some(pattern => {
      pattern.lastIndex = 0;
      return pattern.test(trimmed);
    });
    
    if (hasInappropriate) {
      const result = {
        isValid: false,
        message: 'Please keep your content appropriate'
      };
      
      if (this.cacheEnabled) {
        manageCacheSize();
        const cacheKey = createCacheKey(trimmed, 'quick');
        validationCache.set(cacheKey, result);
      }
      
      return result;
    }

    const result = { isValid: true };
    
    if (this.cacheEnabled) {
      manageCacheSize();
      const cacheKey = createCacheKey(trimmed, 'quick');
      validationCache.set(cacheKey, result);
    }
    
    return result;
  }

  /**
   * Clear validation cache
   */
  clearCache() {
    validationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: validationCache.size,
      limit: CACHE_SIZE_LIMIT,
      enabled: this.cacheEnabled
    };
  }
}

// Default content filter instance
export const contentFilter = new ContentFilter({
  strictness: 'moderate',
  allowSensitiveTopics: true,
  cacheEnabled: true
});

// Validation helper for forms with caching
export const validatePrayerContent = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: 'Please enter your prayer request',
      suggestions: ['Share what you need prayer for in a respectful way'],
      hasInappropriateContent: false
    };
  }

  const result = contentFilter.filterContent(text);
  
  return {
    isValid: Boolean(result.isClean),
    error: result.reason || null,
    suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    hasInappropriateContent: Boolean(!result.isClean)
  };
};

// Quick validation for real-time input with caching
export const quickValidateContent = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: true };
  }
  
  const result = contentFilter.quickValidate(text);
  
  return {
    isValid: Boolean(result.isValid),
    message: result.message || null
  };
};

// Clear all caches - useful for memory management
export const clearContentFilterCache = () => {
  contentFilter.clearCache();
};

// Get cache statistics - useful for debugging
export const getContentFilterStats = () => {
  return contentFilter.getCacheStats();
};

// Export for testing and configuration
export { 
  PROFANITY_SET as PROFANITY_WORDS, 
  INAPPROPRIATE_PATTERNS, 
  ALLOWED_SENSITIVE_TOPICS 
};

export default contentFilter;
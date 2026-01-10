/**
 * Node Helper for MMM-DailyLDSVerse
 * 
 * Handles API calls and verse selection logic
 */

const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

module.exports = NodeHelper.create({
  // Module state
  verseLists: {
    bible: [],
    bookOfMormon: [],
    doctrineAndCovenants: [],
    pearlOfGreatPrice: []
  },
  apiBaseUrl: null, // To be determined from API research
  apiEndpointPattern: null, // To be determined from API research

  /**
   * Start the node helper
   * Initializes the helper by loading verse lists and API configuration
   * @function start
   */
  start: function() {
    console.log("Starting node helper for: " + this.name);
    this.loadVerseLists();
    this.loadAPIConfig();
  },

  /**
   * Load API configuration from API_RESEARCH.md or environment variables
   * Reads API base URL and endpoint pattern from API_RESEARCH.md file or environment variables
   * Falls back to environment variables if file doesn't exist or doesn't contain config
   * @function loadAPIConfig
   */
  loadAPIConfig: function() {
    const researchFile = path.join(__dirname, "API_RESEARCH.md");
    
    try {
      if (fs.existsSync(researchFile)) {
        const content = fs.readFileSync(researchFile, "utf8");
        // Try to extract API info from the markdown file
        const baseUrlMatch = content.match(/Base URL[:\s]+(https?:\/\/[^\s]+)/i);
        const endpointMatch = content.match(/Endpoint[:\s]+([^\n]+)/i);
        
        if (baseUrlMatch) {
          this.apiBaseUrl = baseUrlMatch[1];
          console.log(`Loaded API base URL from API_RESEARCH.md: ${this.apiBaseUrl}`);
        }
        if (endpointMatch) {
          this.apiEndpointPattern = endpointMatch[1].trim();
          console.log(`Loaded API endpoint pattern: ${this.apiEndpointPattern}`);
        }
      }
    } catch (error) {
      console.warn("Could not load API config from API_RESEARCH.md:", error.message);
    }
    
    // Fallback to environment variables or defaults
    this.apiBaseUrl = this.apiBaseUrl || process.env.OPEN_SCRIPTURE_API_URL || null;
    this.apiEndpointPattern = this.apiEndpointPattern || process.env.OPEN_SCRIPTURE_API_PATTERN || null;
    
    if (!this.apiBaseUrl) {
      console.warn("API base URL not configured. API calls will fail until configured.");
    }
  },

  /**
   * Load verse lists from JSON files
   * Loads all four volume verse lists from the verses/ directory
   * Handles missing files gracefully (logs warning, continues with empty array)
   * @function loadVerseLists
   */
  loadVerseLists: function() {
    const volumes = [
      { key: "bible", file: "bible.json" },
      { key: "bookOfMormon", file: "book-of-mormon.json" },
      { key: "doctrineAndCovenants", file: "doctrine-and-covenants.json" },
      { key: "pearlOfGreatPrice", file: "pearl-of-great-price.json" }
    ];

    const versesDir = path.join(__dirname, "verses");

    volumes.forEach(volume => {
      const filePath = path.join(versesDir, volume.file);
      try {
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath, "utf8");
          this.verseLists[volume.key] = JSON.parse(data);
          console.log(`Loaded ${this.verseLists[volume.key].length} verses from ${volume.file}`);
        } else {
          console.warn(`Verse list file not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error loading ${volume.file}:`, error.message);
      }
    });
  },

  /**
   * Calculate day of year (1-366)
   * Handles both regular years (365 days) and leap years (366 days)
   * @function getDayOfYear
   * @param {Date} date - The date to calculate day of year for
   * @returns {number} Day of year (1-366)
   */
  getDayOfYear: function(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },

  /**
   * Get volume for a given day (cycles through 4 volumes)
   * Cycles through: Bible → Book of Mormon → Doctrine and Covenants → Pearl of Great Price
   * Pattern: Day 1 = Bible, Day 2 = Book of Mormon, Day 3 = D&C, Day 4 = Pearl, Day 5 = Bible (repeat)
   * @function getVolumeForDay
   * @param {number} dayOfYear - Day of year (1-366)
   * @returns {string} Volume name: 'bible', 'bookOfMormon', 'doctrineAndCovenants', or 'pearlOfGreatPrice'
   */
  getVolumeForDay: function(dayOfYear) {
    const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
    const volumeIndex = (dayOfYear - 1) % 4;
    return volumes[volumeIndex];
  },

  /**
   * Get verse index for a given day (ensures variety)
   * Uses a formula to ensure different verses are shown for the same volume on different days
   * Formula: floor((dayOfYear - 1) / 4) % volumeList.length
   * This ensures variety while cycling through all verses in the volume
   * @function getVerseIndexForDay
   * @param {number} dayOfYear - Day of year (1-366)
   * @param {Array<string>} volumeList - Array of verse references for the volume
   * @returns {number} Index of verse to use (0-based)
   */
  getVerseIndexForDay: function(dayOfYear, volumeList) {
    if (volumeList.length === 0) return 0;
    // Use day of year to create variety, cycling through verses
    const volumeCycle = Math.floor((dayOfYear - 1) / 4);
    return volumeCycle % volumeList.length;
  },

  /**
   * Get verse reference for a given day
   * Combines volume selection and verse index calculation to get the verse reference
   * @function getVerseForDay
   * @param {number} dayOfYear - Day of year (1-366)
   * @returns {string} Verse reference (e.g., "1 Nephi 3:7")
   * @throws {Error} If no verses are available for the selected volume
   */
  getVerseForDay: function(dayOfYear) {
    const volume = this.getVolumeForDay(dayOfYear);
    const volumeList = this.verseLists[volume];
    
    if (!volumeList || volumeList.length === 0) {
      throw new Error(`No verses available for volume: ${volume}`);
    }

    const verseIndex = this.getVerseIndexForDay(dayOfYear, volumeList);
    return volumeList[verseIndex];
  },

  /**
   * Parse verse reference into book, chapter, verse components
   * Handles formats like "1 Nephi 3:7", "John 3:16", "D&C 1:1"
   * Also supports verse ranges like "1 Nephi 3:7-8"
   * @function parseVerseReference
   * @param {string} verseReference - Verse reference string (e.g., "1 Nephi 3:7")
   * @returns {Object} Parsed reference with book, chapter, verse, and optional endVerse
   * @returns {string} returns.book - Book name
   * @returns {number} returns.chapter - Chapter number
   * @returns {number} returns.verse - Verse number
   * @returns {number|null} returns.endVerse - End verse number (if range) or null
   * @throws {Error} If verse reference format is invalid
   */
  parseVerseReference: function(verseReference) {
    // Match pattern: "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
    const match = verseReference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    
    if (!match) {
      throw new Error(`Invalid verse reference format: ${verseReference}`);
    }
    
    return {
      book: match[1].trim(),
      chapter: parseInt(match[2], 10),
      verse: parseInt(match[3], 10),
      endVerse: match[4] ? parseInt(match[4], 10) : null
    };
  },

  /**
   * Build API URL from verse reference
   * Constructs the API endpoint URL using the configured base URL and endpoint pattern
   * Supports both custom endpoint patterns and default pattern
   * @function buildAPIUrl
   * @param {string} verseReference - Verse reference string (e.g., "1 Nephi 3:7")
   * @returns {string} Complete API URL
   * @throws {Error} If API base URL is not configured
   */
  buildAPIUrl: function(verseReference) {
    if (!this.apiBaseUrl) {
      throw new Error("API base URL not configured");
    }
    
    const parsed = this.parseVerseReference(verseReference);
    
    // If we have a specific endpoint pattern, use it
    if (this.apiEndpointPattern) {
      return this.apiEndpointPattern
        .replace("{book}", encodeURIComponent(parsed.book))
        .replace("{chapter}", parsed.chapter)
        .replace("{verse}", parsed.verse);
    }
    
    // Default pattern: /verses/{book}/{chapter}/{verse}
    return `${this.apiBaseUrl}/verses/${encodeURIComponent(parsed.book)}/${parsed.chapter}/${parsed.verse}`;
  },

  /**
   * Fetch verse from API
   * Makes HTTP/HTTPS request to the Open Scripture API
   * Handles both HTTP and HTTPS protocols automatically
   * Includes 30-second timeout to prevent hanging requests
   * @function fetchVerseFromAPI
   * @param {string} verseReference - Verse reference string (e.g., "1 Nephi 3:7")
   * @returns {Promise<Object>} Promise that resolves with verse data
   * @returns {string} returns.text - Verse text
   * @returns {string} returns.reference - Verse reference
   * @throws {Error} If API request fails or API is not configured
   */
  fetchVerseFromAPI: function(verseReference) {
    return new Promise((resolve, reject) => {
      if (!this.apiBaseUrl) {
        reject(new Error("API endpoint not yet configured"));
        return;
      }
      
      const url = this.buildAPIUrl(verseReference);
      const protocol = url.startsWith("https") ? https : http;
      
      console.log(`Fetching verse from API: ${url}`);
      
      const req = protocol.get(url, (res) => {
        let data = "";
        
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`API returned status ${res.statusCode}: ${data.substring(0, 100)}`));
            return;
          }
          
          try {
            const jsonData = JSON.parse(data);
            const parsed = this.parseAPIResponse(jsonData, verseReference);
            resolve(parsed);
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });
      
      req.on("error", (err) => {
        reject(new Error(`Network error: ${err.message}`));
      });
      
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });
    });
  },

  /**
   * Parse API response to extract verse text and reference
   * Handles multiple API response formats:
   * - Simple: { text: "...", reference: "..." }
   * - Nested: { verse: { text: "...", reference: "..." } }
   * - Data wrapper: { data: { text: "...", reference: "..." } }
   * - String format: "verse text"
   * @function parseAPIResponse
   * @param {Object|string} apiResponse - API response object or string
   * @param {string} verseReference - Original verse reference (used as fallback)
   * @returns {Object} Parsed verse data
   * @returns {string} returns.text - Verse text
   * @returns {string} returns.reference - Verse reference
   * @throws {Error} If verse text cannot be extracted from response
   */
  parseAPIResponse: function(apiResponse, verseReference) {
    // This will need to be adjusted based on actual API response format
    // Common patterns:
    // - { text: "...", reference: "..." }
    // - { verse: { text: "...", reference: "..." } }
    // - { data: { text: "...", reference: "..." } }
    
    let text = null;
    let reference = verseReference;
    
    // Try various response formats
    if (apiResponse.text) {
      text = apiResponse.text;
    } else if (apiResponse.verse && apiResponse.verse.text) {
      text = apiResponse.verse.text;
    } else if (apiResponse.data && apiResponse.data.text) {
      text = apiResponse.data.text;
    } else if (apiResponse.content) {
      text = apiResponse.content;
    } else if (typeof apiResponse === "string") {
      text = apiResponse;
    }
    
    if (!text) {
      throw new Error("Could not extract verse text from API response");
    }
    
    // Use provided reference or extract from response
    if (apiResponse.reference) {
      reference = apiResponse.reference;
    } else if (apiResponse.verse && apiResponse.verse.reference) {
      reference = apiResponse.verse.reference;
    }
    
    return {
      text: text.trim(),
      reference: reference
    };
  },

  /**
   * Fetch with retry logic (3 attempts, 5 second delay)
   * Implements exponential retry strategy for handling transient API failures
   * Retries up to maxRetries times with delayMs milliseconds between attempts
   * Logs each attempt for debugging purposes
   * @function fetchWithRetry
   * @param {string} verseReference - Verse reference string (e.g., "1 Nephi 3:7")
   * @param {number} [maxRetries=3] - Maximum number of retry attempts
   * @param {number} [delayMs=5000] - Delay in milliseconds between retries
   * @returns {Promise<Object>} Promise that resolves with verse data
   * @throws {Error} If all retry attempts fail
   */
  fetchWithRetry: async function(verseReference, maxRetries = 3, delayMs = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching verse (attempt ${attempt}/${maxRetries}): ${verseReference}`);
        const result = await this.fetchVerseFromAPI(verseReference);
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  },

  /**
   * Handle socket notifications from frontend
   */
  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VERSE") {
      this.handleGetVerse();
    }
  },

  /**
   * Handle GET_VERSE request
   * Main handler for verse requests from the frontend module
   * Calculates current day of year, selects verse, fetches from API, and sends result
   * Handles errors gracefully and sends error notification to frontend
   * @function handleGetVerse
   * @async
   */
  handleGetVerse: async function() {
    try {
      const today = new Date();
      const dayOfYear = this.getDayOfYear(today);
      const verseReference = this.getVerseForDay(dayOfYear);

      console.log(`Day ${dayOfYear}: Fetching verse: ${verseReference}`);

      // Fetch verse from API
      const verseData = await this.fetchWithRetry(verseReference);

      // Send result to frontend
      this.sendSocketNotification("VERSE_RESULT", {
        text: verseData.text,
        reference: verseReference
      });
    } catch (error) {
      console.error("Error fetching verse:", error);
      this.sendSocketNotification("VERSE_ERROR", {
        message: error.message
      });
    }
  }
});


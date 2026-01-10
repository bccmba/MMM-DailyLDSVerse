/**
 * MMM-DailyLDSVerse
 * 
 * Magic Mirror module to display daily LDS scripture verses
 * Rotates through Bible, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price
 */

Module.register("MMM-DailyLDSVerse", {
  // Default module config
  defaults: {
    updateInterval: 86400000, // 24 hours in milliseconds
  },

  // Module state
  verseText: null,
  verseReference: null,
  isLoading: true,
  hasError: false,
  updateTimer: null,
  lastUpdateDate: null, // Track last update date to detect day changes

  /**
   * Start the module
   * Initializes the module, requests initial verse, and schedules updates
   * @function start
   */
  start: function() {
    Log.info("Starting module: " + this.name);
    this.isLoading = true;
    this.hasError = false;
    
    // Request initial verse
    this.sendSocketNotification("GET_VERSE");
    
    // Schedule next update for midnight
    this.scheduleNextUpdate();
  },

  /**
   * Calculate milliseconds until next midnight
   * Handles year, month, and leap year boundaries correctly
   * @function getNextMidnight
   * @returns {number} Milliseconds until next midnight
   */
  getNextMidnight: function() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  },

  /**
   * Schedule the next update for midnight
   * Uses configured updateInterval if provided, otherwise uses midnight update
   * Recursively schedules next update after current one completes
   * @function scheduleNextUpdate
   */
  scheduleNextUpdate: function() {
    // Clear existing timer if any
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    // Use configured updateInterval if provided, otherwise use midnight
    let msUntilUpdate;
    if (this.config.updateInterval && this.config.updateInterval > 0) {
      // Use configured interval
      msUntilUpdate = this.config.updateInterval;
      const minutesUntilUpdate = Math.round(msUntilUpdate / 1000 / 60);
      Log.info(`Next update scheduled in ${minutesUntilUpdate} minutes (using configured interval)`);
    } else {
      // Default to midnight
      msUntilUpdate = this.getNextMidnight();
      const minutesUntilMidnight = Math.round(msUntilUpdate / 1000 / 60);
      Log.info(`Next update scheduled in ${minutesUntilMidnight} minutes (${new Date(Date.now() + msUntilUpdate).toLocaleTimeString()})`);
    }

    this.updateTimer = setTimeout(() => {
      Log.info("Scheduled update triggered");
      this.sendSocketNotification("GET_VERSE");
      this.scheduleNextUpdate(); // Schedule next update
    }, msUntilUpdate);
  },

  /**
   * Check if a new day has started (for manual refresh if needed)
   * Compares current date with last update date to detect day changes
   * @function isNewDay
   * @returns {boolean} True if a new day has started since last update
   */
  isNewDay: function() {
    if (!this.lastUpdateDate) {
      return true;
    }
    const now = new Date();
    const lastUpdate = new Date(this.lastUpdateDate);
    return now.getDate() !== lastUpdate.getDate() ||
           now.getMonth() !== lastUpdate.getMonth() ||
           now.getFullYear() !== lastUpdate.getFullYear();
  },

  /**
   * Handle socket notifications from node_helper
   * Processes VERSE_RESULT and VERSE_ERROR notifications
   * Updates module state and triggers DOM update
   * @function socketNotificationReceived
   * @param {string} notification - Notification type ('VERSE_RESULT' or 'VERSE_ERROR')
   * @param {Object} payload - Notification payload with verse data or error message
   */
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VERSE_RESULT") {
      this.verseText = payload.text;
      this.verseReference = payload.reference;
      this.isLoading = false;
      this.hasError = false;
      this.lastUpdateDate = new Date();
      Log.info(`Verse loaded: ${this.verseReference}`);
      this.updateDom();
    } else if (notification === "VERSE_ERROR") {
      this.isLoading = false;
      this.hasError = true;
      Log.error(`Error loading verse: ${payload.message || "Unknown error"}`);
      this.updateDom();
    }
  },

  /**
   * Create the DOM element
   * Builds the module's DOM structure based on current state
   * Handles three states: loading, error, and success
   * Uses textContent for XSS prevention (not innerHTML)
   * @function getDom
   * @returns {HTMLElement} DOM wrapper element containing verse display
   */
  getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.className = "MMM-DailyLDSVerse";

    if (this.isLoading) {
      const loading = document.createElement("div");
      loading.className = "loading";
      loading.innerHTML = "Loading verse...";
      wrapper.appendChild(loading);
    } else if (this.hasError) {
      const error = document.createElement("div");
      error.className = "error";
      error.innerHTML = "Unable to load scripture verse";
      wrapper.appendChild(error);
    } else if (this.verseText && this.verseReference) {
      const verseDiv = document.createElement("div");
      verseDiv.className = "verse-text";
      // Sanitize and set text content to prevent XSS
      verseDiv.textContent = this.verseText;

      const referenceDiv = document.createElement("div");
      referenceDiv.className = "verse-reference";
      referenceDiv.textContent = this.verseReference;

      wrapper.appendChild(verseDiv);
      wrapper.appendChild(referenceDiv);
    } else {
      // Fallback: show loading if no data
      const loading = document.createElement("div");
      loading.className = "loading";
      loading.innerHTML = "Loading verse...";
      wrapper.appendChild(loading);
    }

    return wrapper;
  },

  /**
   * Clean up on module stop
   * Clears any pending timers to prevent memory leaks
   * Called automatically by Magic Mirror when module is stopped
   * @function stop
   */
  stop: function() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  }
});


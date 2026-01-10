/**
 * Example configuration for MMM-DailyLDSVerse
 * 
 * Add this to your Magic Mirror config/config.js file
 */

{
  module: "MMM-DailyLDSVerse",
  position: "top_center",  // Optional: position on screen
  config: {
    // Optional: Update interval in milliseconds
    // If not specified, defaults to once per day at midnight
    // Examples:
    //   86400000 = 24 hours (1 day) - default
    //   43200000 = 12 hours
    //   3600000 = 1 hour
    //   0 or null = use midnight update (default behavior)
    updateInterval: 86400000  // Optional, defaults to daily at midnight
  }
}

// Full example with comments:
/*
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    updateInterval: 86400000  // Update once per day (24 hours)
  }
}
*/

// Example with midnight update (default):
/*
{
  module: "MMM-DailyLDSVerse",
  position: "top_center"
  // No config needed - will update at midnight by default
}
*/

// Example with custom update interval:
/*
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    updateInterval: 43200000  // Update every 12 hours
  }
}
*/


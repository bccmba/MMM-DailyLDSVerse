# MMM-DailyLDSVerse - Detailed Specification

## Module Overview
- **Module Name:** `MMM-DailyLDSVerse`
- **Purpose:** Display a daily scripture verse from LDS scriptures (King James Version Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price) on a Magic Mirror

## Core Functionality

### Verse Selection Logic
- **Frequency:** One verse per day
- **Volume Rotation:** Daily cycle through four volumes:
  1. Bible (KJV)
  2. Book of Mormon
  3. Doctrine and Covenants
  4. Pearl of Great Price
  - Pattern: Day 1 = Bible, Day 2 = Book of Mormon, Day 3 = D&C, Day 4 = Pearl, Day 5 = Bible (repeat)
- **Verse Mapping:** Day of year (1-365/366) maps to a specific verse using a formula to ensure variety
- **Leap Year Handling:** Day 366 is treated as an extra day (continues the daily cycle)

### Data Source
- **API:** Open Scripture API (https://openscriptureapi.org)
- **Query Method:** Query by book/chapter/verse structure (e.g., "1 Nephi 3:7")
- **API Research:** Research exact API endpoints and response format during development

### Verse List Management
- **Organization:** Verse lists organized by volume (separate files per volume)
- **Content:** Each volume file contains all verses from that volume
- **Format:** Simple string format for references (e.g., "1 Nephi 3:7")
- **Generation:** Script queries the API to build the index
  - Run during initial setup
  - Available as utility script for updates

### Verse Curation
- **Approach:** Balanced distribution across all four volumes with preference for meaningful verses
- **Distribution:** Ensures all books within each volume are represented over time

## Display

### Content
- **Format:** Verse text with reference (e.g., "1 Nephi 3:7")
- **Styling:** Default Magic Mirror styling (no custom CSS)

### States
- **Loading:** Show loading message while fetching
- **Error:** Display simple error message if all retries fail
- **Success:** Display verse text with reference

## Update Schedule

### Frequency
- **Default:** Once per day at midnight (system local timezone)
- **Configuration:** Optional `updateInterval` in config (defaults to daily)

### Behavior
- Fetch immediately on module start/load
- Schedule next fetch for midnight
- Use system's local timezone for midnight calculation

## Error Handling

### Retry Logic
- **Attempts:** 3 retry attempts
- **Wait Time:** 5 seconds between retries
- **Failure:** Display simple error message if all retries fail

### Error Message
- Simple message format (e.g., "Unable to load scripture verse")

## Technical Implementation

### Module Structure
- Standard Magic Mirror module pattern:
  - Main module file: `MMM-DailyLDSVerse.js`
  - Node helper file: `node_helper.js` (for API calls)
  - Configuration example file
  - README with documentation

### Dependencies
- **Approach:** Minimal dependencies
- **HTTP Client:** Use built-in Node.js modules (e.g., `https` or `http`)

### Logging
- Console logs for debugging (API calls, errors, verse selection)

## Configuration

### Config Options (MVP - Minimal)
- **updateInterval:** Optional configuration (defaults to once per day at midnight)
- **Position:** Use Magic Mirror's standard `position` config if needed
- **Styling:** Use Magic Mirror defaults

### Example Config Structure
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",  // Optional, uses MM defaults
  config: {
    updateInterval: 86400000  // Optional, defaults to daily
  }
}
```

## Documentation

### README Contents
- Installation instructions
- Configuration example
- Instructions for running verse list generation script
- Troubleshooting section
- All standard Magic Mirror module documentation

## Development Notes

### API Integration
- Research Open Scripture API endpoints during development
- Verify API response format and structure
- Document API endpoint format in code comments

### Verse List Generation Script
- Script to query Open Scripture API
- Builds verse index files organized by volume
- Available for both initial setup and future updates
- Outputs JSON files with simple string format references

## File Structure
```
MMM-DailyLDSVerse/
├── MMM-DailyLDSVerse.js
├── node_helper.js
├── package.json
├── README.md
├── config.example.js (optional)
├── generate-verse-lists.js (or similar name)
└── verses/
    ├── bible.json
    ├── book-of-mormon.json
    ├── doctrine-and-covenants.json
    └── pearl-of-great-price.json
```

## Summary
A Magic Mirror module that displays a daily LDS scripture verse, rotating through four volumes, using the Open Scripture API. Minimal configuration, standard Magic Mirror styling, and error handling with retries. Includes a script to generate verse lists from the API for setup and updates.


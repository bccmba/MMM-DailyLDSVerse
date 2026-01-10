# MMM-DailyLDSVerse - Technical Blueprint

## Architecture Overview

### Module Pattern
This module follows the standard Magic Mirror module architecture:
- **Frontend (MMM-DailyLDSVerse.js):** Handles DOM updates and user interface
- **Backend (node_helper.js):** Handles API calls and data processing
- **Communication:** Uses Magic Mirror's notification system for frontend/backend communication

## Component Design

### 1. Main Module (MMM-DailyLDSVerse.js)

#### Responsibilities
- Initialize module and register with Magic Mirror
- Display verse text and reference
- Handle loading and error states
- Schedule daily updates
- Listen for notifications from node_helper

#### Key Methods
- `start()`: Initialize module, request initial verse, set up update schedule
- `getDom()`: Return DOM element with current verse or loading/error state
- `socketNotificationReceived()`: Handle verse data from node_helper
- `scheduleNextUpdate()`: Calculate next midnight and set timer
- `getDayOfYear()`: Calculate current day of year (1-366)
- `getVolumeForDay()`: Determine which volume to use based on day
- `getVerseIndexForDay()`: Calculate which verse index to use within volume

#### State Management
- `verseText`: Current verse text
- `verseReference`: Current verse reference
- `isLoading`: Boolean for loading state
- `hasError`: Boolean for error state
- `lastUpdateDate`: Track last update date to detect day changes

### 2. Node Helper (node_helper.js)

#### Responsibilities
- Load verse list JSON files
- Calculate which verse to fetch based on day of year
- Make API calls to Open Scripture API
- Implement retry logic
- Send verse data to frontend module

#### Key Methods
- `start()`: Initialize helper, load verse lists
- `socketNotificationReceived()`: Handle requests from frontend
- `loadVerseLists()`: Load all four volume JSON files
- `getVerseForDay()`: Calculate and return verse reference for given day
- `fetchVerseFromAPI()`: Make HTTP request to Open Scripture API
- `retryFetch()`: Implement retry logic with delays
- `parseAPIResponse()`: Extract verse text and reference from API response

#### Data Structures
- `verseLists`: Object containing arrays of verse references per volume
  ```javascript
  {
    bible: ["Genesis 1:1", "Genesis 1:2", ...],
    bookOfMormon: ["1 Nephi 1:1", "1 Nephi 1:2", ...],
    doctrineAndCovenants: ["D&C 1:1", "D&C 1:2", ...],
    pearlOfGreatPrice: ["Moses 1:1", "Moses 1:2", ...]
  }
  ```

### 3. Verse List Generation Script (generate-verse-lists.js)

#### Responsibilities
- Query Open Scripture API for all verses in each volume
- Organize verses by volume
- Output JSON files with verse references
- Handle API rate limiting and errors

#### Key Methods
- `main()`: Main execution function
- `fetchAllVersesForVolume()`: Query API for all verses in a volume
- `getVolumeMetadata()`: Get list of books/chapters for a volume
- `saveVerseList()`: Write JSON file for a volume
- `delay()`: Utility for rate limiting

#### Output Format
Each JSON file contains an array of verse reference strings:
```json
[
  "1 Nephi 1:1",
  "1 Nephi 1:2",
  "1 Nephi 1:3",
  ...
]
```

## Algorithm Details

### Day of Year Calculation
```javascript
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
```

### Volume Selection
```javascript
function getVolumeForDay(dayOfYear) {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  return volumes[volumeIndex];
}
```

### Verse Index Calculation
```javascript
function getVerseIndexForDay(dayOfYear, volumeList) {
  // Use modulo to ensure variety and wrap around if needed
  const volumeIndex = Math.floor((dayOfYear - 1) / 4);
  return volumeIndex % volumeList.length;
}
```

### Midnight Calculation
```javascript
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}
```

## API Integration

### Open Scripture API Research Required
- Base URL structure
- Endpoint format for verse queries
- Request parameters (book, chapter, verse)
- Response format (JSON structure)
- Authentication requirements (if any)
- Rate limiting considerations

### Expected API Call Pattern
```javascript
// Example (to be verified during development)
GET https://api.openscriptureapi.org/verses/{book}/{chapter}/{verse}
// or
GET https://api.openscriptureapi.org/verses?book={book}&chapter={chapter}&verse={verse}
```

### Response Parsing
- Extract verse text from response
- Extract or construct reference string
- Handle API errors and edge cases

## Error Handling Strategy

### Retry Implementation
```javascript
async function fetchWithRetry(verseReference, maxRetries = 3, delayMs = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchVerseFromAPI(verseReference);
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await delay(delayMs);
    }
  }
}
```

### Error States
- Network errors: Retry with exponential backoff
- API errors (4xx): Log and show error (likely invalid reference)
- API errors (5xx): Retry
- Timeout: Retry

## File Structure Details

```
MMM-DailyLDSVerse/
├── MMM-DailyLDSVerse.js          # Main module (frontend)
├── node_helper.js                 # Node helper (backend)
├── package.json                   # Module metadata
├── README.md                      # Documentation
├── .gitignore                     # Git ignore rules
├── generate-verse-lists.js        # Verse list generation script
└── verses/                        # Verse list directory
    ├── bible.json
    ├── book-of-mormon.json
    ├── doctrine-and-covenants.json
    └── pearl-of-great-price.json
```

## Dependencies

### package.json
```json
{
  "name": "mmm-dailyldsverse",
  "version": "1.0.0",
  "description": "Magic Mirror module for daily LDS scripture verses",
  "main": "MMM-DailyLDSVerse.js",
  "author": "",
  "license": "MIT",
  "dependencies": {}
}
```

Note: Using built-in Node.js modules only (no external dependencies)

## Communication Flow

### Initialization
1. Frontend module starts
2. Frontend sends `GET_VERSE` notification to node_helper
3. Node helper calculates verse for today
4. Node helper fetches verse from API
5. Node helper sends `VERSE_RESULT` notification to frontend
6. Frontend updates DOM

### Daily Update
1. Timer triggers at midnight
2. Frontend sends `GET_VERSE` notification
3. Process repeats (steps 3-6 above)

### Error Flow
1. API call fails
2. Retry logic executes (up to 3 attempts)
3. If all retries fail, node_helper sends `VERSE_ERROR` notification
4. Frontend displays error message

## Testing Considerations

### Unit Tests (Future Enhancement)
- Day of year calculation
- Volume selection logic
- Verse index calculation
- Leap year handling

### Integration Tests (Future Enhancement)
- API response parsing
- Error handling
- Retry logic

### Manual Testing Checklist
- Module loads and displays verse
- Daily update at midnight
- Error handling when API unavailable
- Leap year handling (Feb 29)
- All four volumes display correctly

## Performance Considerations

### Optimization
- Load verse lists once at startup (not on every request)
- Cache current verse to avoid unnecessary API calls
- Use efficient date calculations
- Minimize DOM updates

### Memory Management
- Verse lists stored in memory (reasonable size for MVP)
- Clear timers on module stop

## Security Considerations

### API Calls
- Validate verse references before API calls
- Handle malformed API responses
- Sanitize verse text before displaying (XSS prevention)

## Future Enhancement Opportunities

### Potential Features (Post-MVP)
- Custom styling options
- Multiple verses per day
- Verse history
- Favorite verses
- Custom update times
- Offline mode with cached verses
- Verse sharing functionality


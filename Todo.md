# MMM-DailyLDSVerse - Implementation Todo List

## Phase 1: Research & Setup

### API Research
- [ ] Research Open Scripture API documentation
- [ ] Identify base URL and endpoint structure
- [ ] Test API endpoint with sample verse query (e.g., "1 Nephi 3:7")
- [ ] Document API response format
- [ ] Verify API supports all four volumes (Bible, Book of Mormon, D&C, Pearl of Great Price)
- [ ] Check for rate limiting or authentication requirements
- [ ] Test API error responses

### Project Setup
- [ ] Create module directory structure
- [ ] Initialize package.json
- [ ] Create .gitignore file
- [ ] Set up basic file structure (main module, node_helper, README)

## Phase 2: Verse List Generation Script

### Script Development
- [ ] Create generate-verse-lists.js
- [ ] Implement function to query Open Scripture API for volume metadata
- [ ] Implement function to fetch all verses for a volume
- [ ] Implement function to organize verses by volume
- [ ] Implement JSON file writing functionality
- [ ] Add error handling for API failures
- [ ] Add rate limiting/delays to avoid API throttling
- [ ] Test script with one volume (e.g., Book of Mormon)
- [ ] Run script for all four volumes
- [ ] Verify generated JSON files are properly formatted
- [ ] Document script usage in README

### Verse List Files
- [ ] Generate bible.json
- [ ] Generate book-of-mormon.json
- [ ] Generate doctrine-and-covenants.json
- [ ] Generate pearl-of-great-price.json
- [ ] Verify all files contain valid verse references
- [ ] Verify verse references are in simple string format

## Phase 3: Node Helper Development

### Core Functionality
- [ ] Create node_helper.js file
- [ ] Implement start() method
- [ ] Implement loadVerseLists() to load all four JSON files
- [ ] Implement getDayOfYear() function
- [ ] Implement getVolumeForDay() function (daily cycle logic)
- [ ] Implement getVerseIndexForDay() function (variety formula)
- [ ] Implement getVerseForDay() function (combines above logic)

### API Integration
- [ ] Implement fetchVerseFromAPI() function
- [ ] Implement parseAPIResponse() function
- [ ] Add proper error handling for API calls
- [ ] Implement retry logic (3 attempts, 5 second delay)
- [ ] Add console logging for debugging

### Communication
- [ ] Implement socketNotificationReceived() handler
- [ ] Handle GET_VERSE notification
- [ ] Send VERSE_RESULT notification to frontend
- [ ] Send VERSE_ERROR notification on failure

## Phase 4: Main Module Development

### Core Functionality
- [ ] Create MMM-DailyLDSVerse.js file
- [ ] Implement start() method
- [ ] Implement getDom() method
- [ ] Implement socketNotificationReceived() handler
- [ ] Add state variables (verseText, verseReference, isLoading, hasError)

### Display Logic
- [ ] Implement loading state display
- [ ] Implement verse display (text + reference)
- [ ] Implement error state display
- [ ] Use default Magic Mirror styling

### Update Scheduling
- [ ] Implement getNextMidnight() function
- [ ] Implement scheduleNextUpdate() function
- [ ] Set up initial fetch on module start
- [ ] Handle day change detection
- [ ] Test midnight update functionality

### Date/Time Logic
- [ ] Implement getDayOfYear() function (handle leap years)
- [ ] Test with various dates (regular year, leap year, year boundaries)
- [ ] Verify day 366 handling

## Phase 5: Configuration & Integration

### Configuration
- [ ] Add optional updateInterval config support
- [ ] Set default updateInterval to daily
- [ ] Create config.example.js (optional)
- [ ] Document configuration options in README

### Magic Mirror Integration
- [ ] Test module registration
- [ ] Test notification system
- [ ] Verify module appears in Magic Mirror
- [ ] Test module positioning

## Phase 6: Error Handling & Edge Cases

### Error Scenarios
- [ ] Test with API unavailable (network error)
- [ ] Test with invalid verse reference
- [ ] Test retry logic (simulate failures)
- [ ] Test error message display
- [ ] Test recovery after error (next day update)

### Edge Cases
- [ ] Test leap year (February 29)
- [ ] Test year boundary (Dec 31 to Jan 1)
- [ ] Test with missing verse list files
- [ ] Test with empty verse list files
- [ ] Test with malformed verse list JSON

## Phase 7: Testing & Validation

### Functional Testing
- [ ] Verify all four volumes display correctly
- [ ] Verify daily rotation works (test multiple days)
- [ ] Verify verse variety (same volume shows different verses)
- [ ] Verify midnight update works
- [ ] Verify loading state appears
- [ ] Verify error handling works

### Data Validation
- [ ] Verify verse references are correct
- [ ] Verify verse text displays correctly
- [ ] Verify all 365/366 days have valid verses
- [ ] Spot check verses from each volume

## Phase 8: Documentation

### README
- [ ] Write installation instructions
- [ ] Add configuration example
- [ ] Document verse list generation script usage
- [ ] Add troubleshooting section
- [ ] Include screenshots (if available)
- [ ] Add license information
- [ ] Add credits/attributions (Open Scripture API)

### Code Documentation
- [ ] Add JSDoc comments to main functions
- [ ] Document API endpoint format in code
- [ ] Add inline comments for complex logic
- [ ] Document retry logic and error handling

## Phase 9: Final Polish

### Code Quality
- [ ] Review code for consistency
- [ ] Remove debug console logs (or make them conditional)
- [ ] Optimize performance if needed
- [ ] Verify no memory leaks

### Final Testing
- [ ] Full end-to-end test (module start to verse display)
- [ ] Test over multiple days
- [ ] Test error recovery
- [ ] Test on fresh Magic Mirror installation

### Release Preparation
- [ ] Update version number in package.json
- [ ] Create release notes
- [ ] Verify all files are included
- [ ] Test installation from scratch

## Notes
- Prioritize MVP features first
- Test incrementally as you build
- Document API findings as you research
- Keep verse list generation script separate and reusable


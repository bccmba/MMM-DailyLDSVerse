# Test Suite for MMM-DailyLDSVerse

## Running Tests

To run all tests:
```bash
npm test
```

To run specific test files:
```bash
node --test tests/node-helper.test.js
node --test tests/api-research.test.js
```

## Test Files

### `node-helper.test.js`
Unit tests for utility functions in node_helper.js:
- `getDayOfYear()` - Day of year calculation
- `getVolumeForDay()` - Volume selection logic
- `getVerseIndexForDay()` - Verse index calculation
- `getNextMidnight()` - Midnight calculation

### `api-research.test.js`
API research script to discover Open Scripture API endpoints and structure.

### `utils.test.js`
Placeholder for additional utility function tests (to be implemented).

## Test Coverage

### Phase 1 Tests
- ✅ Day of year calculation (including leap years)
- ✅ Volume selection (daily cycling)
- ✅ Verse index calculation (variety formula)
- ✅ Midnight calculation
- ⏳ API endpoint discovery (requires network access)

## Running Tests Without Node.js

If Node.js is not available in your environment, you can:
1. Install Node.js from https://nodejs.org/
2. Run tests in a different environment
3. Use the test files as documentation of expected behavior


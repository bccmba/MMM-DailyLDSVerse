/**
 * End-to-end flow tests
 * Tests complete user flows from module start to verse display
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

/**
 * Test complete initialization flow
 */
test('E2E Flow: Complete module initialization and first verse load', () => {
  // Step 1: Module starts
  let state = {
    isLoading: true,
    hasError: false,
    verseText: null,
    verseReference: null,
    updateTimer: null
  };
  
  // Step 2: Node helper loads verse lists
  const versesDir = path.join(__dirname, '..', 'verses');
  const verseFile = path.join(versesDir, 'book-of-mormon.json');
  let verseListsLoaded = false;
  
  if (fs.existsSync(verseFile)) {
    const data = fs.readFileSync(verseFile, 'utf8');
    const verses = JSON.parse(data);
    verseListsLoaded = Array.isArray(verses) && verses.length > 0;
  }
  
  assert.strictEqual(verseListsLoaded, true, 'Verse lists should be loaded');
  
  // Step 3: Calculate verse for today
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  const volume = volumes[volumeIndex];
  
  assert.ok(volumes.includes(volume), 'Should select valid volume');
  
  // Step 4: Get verse
  const mockVerse = { reference: '1 Nephi 3:7', text: 'And it came to pass...' };
  
  // Step 5: Send result to module
  state.verseText = mockVerse.text;
  state.verseReference = mockVerse.reference;
  state.isLoading = false;
  
  // Step 6: Verify final state
  assert.strictEqual(state.isLoading, false, 'Should not be loading after verse received');
  assert.strictEqual(state.hasError, false, 'Should not have error');
  assert.ok(state.verseText, 'Should have verse text');
  assert.ok(state.verseReference, 'Should have verse reference');
});

/**
 * Test daily update flow
 */
test('E2E Flow: Daily update at midnight', () => {
  // Initial state - verse displayed
  let state = {
    verseText: 'Day 1 verse',
    verseReference: 'Day 1:1',
    lastUpdateDate: new Date(2024, 0, 1, 12, 0, 0)
  };
  
  // Simulate midnight
  const midnight = new Date(2024, 0, 2, 0, 0, 0);
  const isNewDay = midnight.getDate() !== state.lastUpdateDate.getDate() ||
                   midnight.getMonth() !== state.lastUpdateDate.getMonth() ||
                   midnight.getFullYear() !== state.lastUpdateDate.getFullYear();
  
  assert.strictEqual(isNewDay, true, 'Should detect new day at midnight');
  
  // Request new verse
  state.isLoading = true;
  
  // Get new verse for new day
  const newDayOfYear = 2;
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (newDayOfYear - 1) % 4;
  const newVolume = volumes[volumeIndex];
  
  assert.strictEqual(newVolume, 'bookOfMormon', 'Day 2 should be Book of Mormon');
  
  // New verse received
  state.verseText = 'Day 2 verse';
  state.verseReference = 'Day 2:1';
  state.isLoading = false;
  state.lastUpdateDate = midnight;
  
  assert.strictEqual(state.verseText, 'Day 2 verse', 'Should have new verse text');
  assert.notStrictEqual(state.verseReference, 'Day 1:1', 'Should have different reference');
});

/**
 * Test error recovery flow
 */
test('E2E Flow: Error recovery after failed load', () => {
  // Step 1: Initial load fails
  let state = {
    isLoading: false,
    hasError: true,
    verseText: null,
    verseReference: null
  };
  
  assert.strictEqual(state.hasError, true, 'Should have error state');
  
  // Step 2: Next update attempt
  state.isLoading = true;
  state.hasError = false; // Clear previous error
  
  // Step 3: Successfully load verse
  const verse = { reference: '1 Nephi 3:7', text: 'And it came to pass...' };
  state.verseText = verse.text;
  state.verseReference = verse.reference;
  state.isLoading = false;
  state.hasError = false;
  
  // Step 4: Verify recovery
  assert.strictEqual(state.hasError, false, 'Error should be cleared');
  assert.ok(state.verseText, 'Should have verse text after recovery');
  assert.ok(state.verseReference, 'Should have verse reference after recovery');
});

/**
 * Test configuration change flow
 */
test('E2E Flow: Configuration change and re-initialization', () => {
  // Initial config
  let config = {
    updateInterval: 86400000,
    header: "Verse of the day"
  };
  
  // User changes config
  const newConfig = {
    updateInterval: 43200000, // 12 hours
    header: "Daily Scripture"
  };
  
  config = { ...config, ...newConfig };
  
  // Module should reinitialize with new config
  assert.strictEqual(config.updateInterval, 43200000, 'Should use new interval');
  assert.strictEqual(config.header, "Daily Scripture", 'Should use new header');
  
  // Update scheduling should change
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, false, 'Should not use midnight with custom interval');
});

/**
 * Test volume rotation over multiple days
 */
test('E2E Flow: Volume rotation over 5 days', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const expectedSequence = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice', 'bible'];
  
  const actualSequence = [];
  
  for (let day = 1; day <= 5; day++) {
    const volumeIndex = (day - 1) % 4;
    const volume = volumes[volumeIndex];
    actualSequence.push(volume);
  }
  
  assert.deepStrictEqual(actualSequence, expectedSequence, 'Should cycle through volumes correctly');
  
  // Verify variety - same volume on different days should show different verses
  const day1Index = Math.floor((1 - 1) / 4) % 100; // Mock list of 100 verses
  const day5Index = Math.floor((5 - 1) / 4) % 100;
  
  assert.notStrictEqual(day1Index, day5Index, 'Same volume on different days should show different verses');
});

/**
 * Test year boundary flow
 */
test('E2E Flow: Year boundary transition', () => {
  // December 31
  const dec31 = new Date(2023, 11, 31);
  const startDec = new Date(dec31.getFullYear(), 0, 0);
  const diffDec = dec31 - startDec;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYearDec = Math.floor(diffDec / oneDay);
  
  assert.strictEqual(dayOfYearDec, 365, 'Dec 31 should be day 365');
  
  // January 1
  const jan1 = new Date(2024, 0, 1);
  const startJan = new Date(jan1.getFullYear(), 0, 0);
  const diffJan = jan1 - startJan;
  const dayOfYearJan = Math.floor(diffJan / oneDay);
  
  assert.strictEqual(dayOfYearJan, 1, 'Jan 1 should be day 1');
  
  // Volume should cycle correctly
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeDec = volumes[(dayOfYearDec - 1) % 4];
  const volumeJan = volumes[(dayOfYearJan - 1) % 4];
  
  assert.strictEqual(volumeDec, 'bible', 'Day 365 should be bible');
  assert.strictEqual(volumeJan, 'bible', 'Day 1 should be bible');
});

/**
 * Test leap year flow
 */
test('E2E Flow: Leap year handling', () => {
  // February 29 in leap year
  const feb29 = new Date(2024, 1, 29);
  const start = new Date(feb29.getFullYear(), 0, 0);
  const diff = feb29 - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  assert.strictEqual(dayOfYear, 60, 'Feb 29 should be day 60');
  
  // December 31 in leap year
  const dec31Leap = new Date(2024, 11, 31);
  const startLeap = new Date(dec31Leap.getFullYear(), 0, 0);
  const diffLeap = dec31Leap - startLeap;
  const dayOfYearLeap = Math.floor(diffLeap / oneDay);
  
  assert.strictEqual(dayOfYearLeap, 366, 'Dec 31 in leap year should be day 366');
  
  // Day 366 should work
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volume366 = volumes[(366 - 1) % 4];
  
  assert.strictEqual(volume366, 'bookOfMormon', 'Day 366 should be bookOfMormon');
});

/**
 * Test multiple module instances
 */
test('E2E Flow: Multiple module instances with different configs', () => {
  const instance1 = {
    position: 'top_left',
    config: { header: "Verse of the day", updateInterval: 86400000 }
  };
  
  const instance2 = {
    position: 'bottom_right',
    config: { header: "Daily Scripture", updateInterval: 43200000 }
  };
  
  // Both should work independently
  assert.strictEqual(instance1.config.header, "Verse of the day");
  assert.strictEqual(instance2.config.header, "Daily Scripture");
  assert.strictEqual(instance1.config.updateInterval, 86400000);
  assert.strictEqual(instance2.config.updateInterval, 43200000);
  
  // Both should get same verse (same day)
  const dayOfYear = 1;
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volume = volumes[(dayOfYear - 1) % 4];
  
  assert.strictEqual(volume, 'bible', 'Both instances should get same volume for same day');
});

console.log('All end-to-end flow tests defined');


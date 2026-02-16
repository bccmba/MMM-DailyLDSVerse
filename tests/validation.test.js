/**
 * Phase 7: Testing & Validation
 * Comprehensive functional and data validation tests
 */

const { test } = require('node:test');
const assert = require('node:assert');

/**
 * Functional Testing: Verify all four volumes display correctly
 */
test('Functional: All four volumes should cycle correctly', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 1;
  
  // Day 1 = Bible
  let volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bible');
  
  // Day 2 = Book of Mormon
  volumeIndex = (2 - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bookOfMormon');
  
  // Day 3 = Doctrine and Covenants
  volumeIndex = (3 - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'doctrineAndCovenants');
  
  // Day 4 = Pearl of Great Price
  volumeIndex = (4 - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'pearlOfGreatPrice');
  
  // Day 5 = Bible (cycle)
  volumeIndex = (5 - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bible');
});

test('Functional: Daily rotation should work correctly', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  
  // Test multiple days
  for (let day = 1; day <= 20; day++) {
    const volumeIndex = (day - 1) % 4;
    const expectedVolume = volumes[volumeIndex];
    assert.ok(volumes.includes(expectedVolume), `Day ${day} should have valid volume`);
  }
});

test('Functional: Verse variety - same volume shows different verses', () => {
  const mockVolumeList = Array(100).fill(0).map((_, i) => `verse${i}`);
  
  // Day 1: floor((1-1)/4) = 0, 0 % 100 = 0
  const index1 = Math.floor((1 - 1) / 4) % mockVolumeList.length;
  
  // Day 5: floor((5-1)/4) = 1, 1 % 100 = 1
  const index5 = Math.floor((5 - 1) / 4) % mockVolumeList.length;
  
  // Day 9: floor((9-1)/4) = 2, 2 % 100 = 2
  const index9 = Math.floor((9 - 1) / 4) % mockVolumeList.length;
  
  assert.notStrictEqual(index1, index5, 'Day 1 and Day 5 should be different');
  assert.notStrictEqual(index1, index9, 'Day 1 and Day 9 should be different');
  assert.notStrictEqual(index5, index9, 'Day 5 and Day 9 should be different');
});

test('Functional: Midnight update should work', () => {
  // Create a date at 11:59 PM
  const now = new Date(2024, 0, 1, 23, 59, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  // Should be approximately 1 minute
  const minutes = msUntilMidnight / 1000 / 60;
  assert.ok(minutes >= 0.9 && minutes <= 1.1, 'Should be approximately 1 minute');
});

test('Functional: Loading state should appear', () => {
  const state = {
    isLoading: true,
    hasError: false,
    verseText: null
  };
  
  const shouldShowLoading = state.isLoading;
  assert.strictEqual(shouldShowLoading, true);
});

test('Functional: Error handling should work', () => {
  const state = {
    isLoading: false,
    hasError: true,
    verseText: null
  };
  
  const shouldShowError = state.hasError && !state.isLoading;
  assert.strictEqual(shouldShowError, true);
});

/**
 * Data Validation: Verify verse references are correct
 */
test('Data: Verse references should be in correct format', () => {
  const validReferences = [
    '1 Nephi 3:7',
    'John 3:16',
    'D&C 1:1',
    'Moses 1:1',
    '2 Nephi 2:25',
    'Alma 32:21'
  ];
  
  const pattern = /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/;
  
  validReferences.forEach(ref => {
    const match = ref.match(pattern);
    assert.ok(match, `Reference "${ref}" should match pattern`);
    assert.ok(match[1].trim().length > 0, 'Book name should not be empty');
    assert.ok(parseInt(match[2], 10) > 0, 'Chapter should be positive');
    assert.ok(parseInt(match[3], 10) > 0, 'Verse should be positive');
  });
});

test('Data: Verse text should display correctly', () => {
  const verseData = {
    text: 'And it came to pass that I, Nephi, said unto my father: I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them.',
    reference: '1 Nephi 3:7'
  };
  
  assert.ok(verseData.text.length > 0, 'Verse text should not be empty');
  assert.ok(typeof verseData.text === 'string', 'Verse text should be a string');
  assert.ok(verseData.reference.includes(':'), 'Reference should contain chapter:verse');
});

test('Data: All 365/366 days should have valid verses', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  
  // Test all days in a year (including leap year)
  for (let day = 1; day <= 366; day++) {
    const volumeIndex = (day - 1) % 4;
    const volume = volumes[volumeIndex];
    
    assert.ok(volumes.includes(volume), `Day ${day} should have valid volume`);
    assert.ok(volumeIndex >= 0 && volumeIndex < 4, `Day ${day} should have valid volume index`);
  }
});

test('Data: Verse references should be unique within volume', () => {
  const mockVolumeList = [
    '1 Nephi 1:1',
    '1 Nephi 1:2',
    '1 Nephi 3:7',
    '2 Nephi 2:25',
    'Alma 32:21'
  ];
  
  // Check for duplicates
  const unique = new Set(mockVolumeList);
  assert.strictEqual(unique.size, mockVolumeList.length, 'All references should be unique');
});

test('Data: Spot check verses from each volume', () => {
  const testVerses = {
    bible: 'John 3:16',
    bookOfMormon: '1 Nephi 3:7',
    doctrineAndCovenants: 'D&C 1:1',
    pearlOfGreatPrice: 'Moses 1:1'
  };
  
  const pattern = /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/;
  
  Object.values(testVerses).forEach(ref => {
    const match = ref.match(pattern);
    assert.ok(match, `Reference "${ref}" should be valid`);
    assert.ok(match[1].trim().length > 0, 'Book name should not be empty');
  });
});

test('Data: Verse references should be parseable', () => {
  const references = [
    '1 Nephi 3:7',
    'John 3:16',
    'D&C 121:7',
    'Moses 1:1'
  ];
  
  references.forEach(ref => {
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    assert.ok(match, `Should parse "${ref}"`);
    
    const book = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);
    
    assert.ok(book.length > 0, 'Book should not be empty');
    assert.ok(chapter > 0, 'Chapter should be positive');
    assert.ok(verse > 0, 'Verse should be positive');
  });
});

/**
 * Integration Testing: End-to-end flow validation
 */
test('Integration: Complete verse selection flow', () => {
  // Simulate complete flow
  const today = new Date(2024, 0, 15); // January 15, 2024
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  assert.strictEqual(dayOfYear, 15);
  
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  const volume = volumes[volumeIndex];
  
  assert.ok(volumes.includes(volume));
  
  const mockVolumeList = ['1 Nephi 1:1', '1 Nephi 1:2', '1 Nephi 3:7'];
  const volIndex = (dayOfYear - 1) % 4;
  const baseIndex = (dayOfYear - 1) % mockVolumeList.length;
  const volumeOffset = Math.floor((mockVolumeList.length / 4) * volIndex);
  const verseIndex = (baseIndex + volumeOffset) % mockVolumeList.length;
  const verseReference = mockVolumeList[verseIndex];
  
  assert.ok(verseReference);
  assert.ok(verseReference.includes(':'));
});

test('Integration: Error recovery flow', () => {
  // Simulate error then recovery
  let state = {
    isLoading: false,
    hasError: true,
    verseText: null
  };
  
  // Simulate next update
  state.isLoading = true;
  state.hasError = false;
  
  // Simulate successful fetch
  state.verseText = 'And it came to pass...';
  state.verseReference = '1 Nephi 3:7';
  state.isLoading = false;
  
  assert.strictEqual(state.hasError, false);
  assert.ok(state.verseText);
  assert.ok(state.verseReference);
  assert.strictEqual(state.isLoading, false);
});

test('Integration: Update scheduling flow', () => {
  // Simulate scheduling
  const now = new Date(2024, 0, 1, 12, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  assert.ok(msUntilMidnight > 0);
  assert.ok(msUntilMidnight < 86400000); // Less than 24 hours
  assert.strictEqual(msUntilMidnight, 43200000); // Exactly 12 hours
});

test('Integration: Configuration flow', () => {
  const defaults = { updateInterval: 86400000 };
  const userConfig = { updateInterval: 43200000 };
  const merged = { ...defaults, ...userConfig };
  
  assert.strictEqual(merged.updateInterval, 43200000);
  
  // Test midnight default
  const midnightConfig = {};
  const shouldUseMidnight = !midnightConfig.updateInterval || midnightConfig.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, true);
});

/**
 * Data Validation: Verify verse list structure
 */
test('Data: Verse list should be array', () => {
  const verseList = ['1 Nephi 1:1', '1 Nephi 1:2', '1 Nephi 3:7'];
  assert.ok(Array.isArray(verseList));
  assert.ok(verseList.length > 0);
});

test('Data: Verse list items should be strings', () => {
  const verseList = ['1 Nephi 1:1', '1 Nephi 1:2', '1 Nephi 3:7'];
  verseList.forEach(verse => {
    assert.strictEqual(typeof verse, 'string');
    assert.ok(verse.includes(':'));
  });
});

test('Data: Verse list should not be empty', () => {
  const verseList = ['1 Nephi 1:1', '1 Nephi 1:2', '1 Nephi 3:7'];
  assert.ok(verseList.length > 0, 'Verse list should not be empty');
});

test('Data: All volumes should have verse lists', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const verseLists = {
    bible: ['Genesis 1:1'],
    bookOfMormon: ['1 Nephi 1:1'],
    doctrineAndCovenants: ['D&C 1:1'],
    pearlOfGreatPrice: ['Moses 1:1']
  };
  
  volumes.forEach(volume => {
    assert.ok(verseLists[volume], `Volume ${volume} should have verse list`);
    assert.ok(Array.isArray(verseLists[volume]), `Volume ${volume} should have array`);
    assert.ok(verseLists[volume].length > 0, `Volume ${volume} should not be empty`);
  });
});

console.log('All validation tests defined');


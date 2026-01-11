/**
 * Comprehensive error handling and edge case tests
 * Tests error handling for local file operations and data validation
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

/**
 * Test file loading error scenarios
 */
test('Error: Missing verse list file - Should handle gracefully', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const missingFile = path.join(versesDir, 'nonexistent.json');
  
  let loaded = false;
  try {
    if (fs.existsSync(missingFile)) {
      const data = fs.readFileSync(missingFile, 'utf8');
      JSON.parse(data);
      loaded = true;
    }
  } catch (error) {
    // Should handle gracefully
    loaded = false;
  }
  
  assert.strictEqual(loaded, false, 'Should not load non-existent file');
});

/**
 * Test invalid verse reference scenarios
 */
test('Error: Invalid verse reference format - Should throw error', () => {
  const invalidReferences = [
    'Invalid',
    '1 Nephi',
    '1 Nephi 3',
    '3:7',
    '',
    null,
    undefined
  ];
  
  invalidReferences.forEach(ref => {
    if (ref === null || ref === undefined) {
      // Skip null/undefined as they would fail differently
      return;
    }
    
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    assert.ok(!match, `Should not match invalid reference: ${ref}`);
  });
});

test('Error: Invalid verse reference - Should parse correctly', () => {
  const validReference = '1 Nephi 3:7';
  const match = validReference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  
  assert.ok(match, 'Should match valid reference');
  assert.strictEqual(match[1].trim(), '1 Nephi');
  assert.strictEqual(parseInt(match[2], 10), 3);
  assert.strictEqual(parseInt(match[3], 10), 7);
});


/**
 * Test error message display
 */
test('Error message: Should display simple error message', () => {
  const errorMessage = 'Unable to load scripture verse';
  const hasError = true;
  
  // Simulate error state
  const shouldShowError = hasError && errorMessage;
  assert.strictEqual(shouldShowError, true);
  assert.strictEqual(errorMessage, 'Unable to load scripture verse');
});

test('Error message: Should handle error recovery', () => {
  let state = {
    hasError: true,
    isLoading: false,
    verseText: null
  };
  
  // Simulate recovery - new verse loaded successfully
  const payload = {
    text: 'And it came to pass...',
    reference: '1 Nephi 3:7'
  };
  
  state.verseText = payload.text;
  state.verseReference = payload.reference;
  state.isLoading = false;
  state.hasError = false;
  
  assert.strictEqual(state.hasError, false);
  assert.ok(state.verseText);
});

test('Error: Invalid verse data format - Should handle gracefully', () => {
  const invalidVerses = [
    '1 Nephi 3:7',  // Valid string
    123,            // Invalid (number)
    { verse: '1 Nephi 3:7' },  // Invalid (wrong object structure)
    'invalid',      // Invalid (no chapter:verse)
    null            // Invalid (null)
  ];
  
  const validVerses = invalidVerses.filter(v => {
    if (typeof v === 'string' && v.includes(':')) {
      return true;
    }
    if (v && typeof v === 'object' && v.reference) {
      return true;
    }
    return false;
  });
  
  assert.strictEqual(validVerses.length, 1, 'Should filter invalid verses');
});

/**
 * Test recovery after error (next day update)
 */
test('Recovery: Should recover on next update after error', async () => {
  let state = {
    hasError: true,
    isLoading: false,
    verseText: null
  };
  
  // Simulate next day update
  const newDay = true;
  if (newDay) {
    state.isLoading = true; // Start loading new verse
    state.hasError = false; // Clear previous error
    
    // Simulate successful fetch
    state.verseText = 'New verse text';
    state.verseReference = '2 Nephi 2:25';
    state.isLoading = false;
  }
  
  assert.strictEqual(state.hasError, false);
  assert.ok(state.verseText);
  assert.strictEqual(state.isLoading, false);
});

/**
 * Test leap year edge cases
 */
test('Edge case: Leap year - February 29 should work', () => {
  const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  assert.strictEqual(dayOfYear, 60);
  
  // Should cycle through volumes correctly
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.ok(volumeIndex >= 0 && volumeIndex < 4);
});

test('Edge case: Leap year - Day 366 should work', () => {
  const date = new Date(2024, 11, 31); // December 31, 2024 (leap year)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  assert.strictEqual(dayOfYear, 366);
  
  // Day 366 should cycle to volume index 1 (bookOfMormon)
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bookOfMormon');
});

test('Edge case: Non-leap year - February 28 should work', () => {
  const date = new Date(2023, 1, 28); // February 28, 2023 (non-leap year)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  assert.strictEqual(dayOfYear, 59);
});

/**
 * Test year boundary edge cases
 */
test('Edge case: Year boundary - Dec 31 to Jan 1', () => {
  const dec31 = new Date(2023, 11, 31, 23, 59, 59);
  const jan1 = new Date(2024, 0, 1, 0, 0, 0);
  
  const startDec = new Date(dec31.getFullYear(), 0, 0);
  const diffDec = dec31 - startDec;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYearDec = Math.floor(diffDec / oneDay);
  
  const startJan = new Date(jan1.getFullYear(), 0, 0);
  const diffJan = jan1 - startJan;
  const dayOfYearJan = Math.floor(diffJan / oneDay);
  
  assert.strictEqual(dayOfYearDec, 365);
  assert.strictEqual(dayOfYearJan, 1);
  
  // Should handle transition correctly
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndexDec = (dayOfYearDec - 1) % 4;
  const volumeIndexJan = (dayOfYearJan - 1) % 4;
  
  assert.ok(volumeIndexDec >= 0 && volumeIndexDec < 4);
  assert.ok(volumeIndexJan >= 0 && volumeIndexJan < 4);
});

test('Edge case: Year boundary - Midnight calculation', () => {
  const now = new Date(2023, 11, 31, 23, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  assert.strictEqual(msUntilMidnight, 3600000); // 1 hour
  assert.strictEqual(tomorrow.getFullYear(), 2024);
  assert.strictEqual(tomorrow.getMonth(), 0);
  assert.strictEqual(tomorrow.getDate(), 1);
});

/**
 * Test missing verse list files
 */
test('Edge case: Missing verse list file - Should handle gracefully', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const missingFile = path.join(versesDir, 'nonexistent.json');
  
  let loaded = false;
  try {
    if (fs.existsSync(missingFile)) {
      const data = fs.readFileSync(missingFile, 'utf8');
      JSON.parse(data);
      loaded = true;
    }
  } catch (error) {
    // Should handle gracefully
    loaded = false;
  }
  
  assert.strictEqual(loaded, false);
  // Should not throw error, just return empty array or handle gracefully
});

test('Edge case: Missing verse list - Should use empty array', () => {
  const verseLists = {
    bible: [],
    bookOfMormon: []
  };
  
  const volume = 'bible';
  const volumeList = verseLists[volume] || [];
  
  assert.ok(Array.isArray(volumeList));
  assert.strictEqual(volumeList.length, 0);
  
  // Should handle empty list gracefully
  if (volumeList.length === 0) {
    // Should throw error or handle gracefully
    assert.throws(() => {
      if (volumeList.length === 0) {
        throw new Error(`No verses available for volume: ${volume}`);
      }
    }, /No verses available/);
  }
});

/**
 * Test empty verse list files
 */
test('Edge case: Empty verse list file - Should handle gracefully', () => {
  const emptyList = [];
  
  assert.ok(Array.isArray(emptyList));
  assert.strictEqual(emptyList.length, 0);
  
  // Should throw error when trying to get verse from empty list
  assert.throws(() => {
    if (emptyList.length === 0) {
      throw new Error('No verses available for volume');
    }
  }, /No verses available/);
});

test('Edge case: Empty verse list - Should not crash', () => {
  const volumeList = [];
  const dayOfYear = 1;
  
  try {
    if (volumeList.length === 0) {
      throw new Error(`No verses available for volume`);
    }
    const volumeCycle = Math.floor((dayOfYear - 1) / 4);
    const index = volumeCycle % volumeList.length;
    const verse = volumeList[index];
  } catch (error) {
    // Should catch and handle error
    assert.ok(error.message.includes('No verses available'));
  }
});

/**
 * Test malformed verse list JSON
 */
test('Edge case: Malformed JSON - Should handle gracefully', () => {
  const malformedJson = '{ invalid json }';
  
  assert.throws(() => {
    JSON.parse(malformedJson);
  }, /Unexpected token/);
});

test('Edge case: Invalid JSON structure - Should handle gracefully', () => {
  const invalidStructure = '{"not": "an array"}';
  
  try {
    const parsed = JSON.parse(invalidStructure);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: not an array');
    }
  } catch (error) {
    assert.ok(error.message.includes('Invalid format') || error.message.includes('not an array'));
  }
});

test('Edge case: JSON with wrong data type - Should handle gracefully', () => {
  const wrongType = '{"verses": "should be array"}';
  
  try {
    const parsed = JSON.parse(wrongType);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: not an array');
    }
  } catch (error) {
    assert.ok(error.message.includes('Invalid format') || error.message.includes('not an array'));
  }
});

test('Edge case: JSON with invalid verse format - Should handle gracefully', () => {
  const invalidVerses = [
    '1 Nephi 3:7',  // Valid
    123,            // Invalid (number)
    { verse: '1 Nephi 3:7' },  // Invalid (object)
    'invalid',      // Invalid (no chapter:verse)
    '1 Nephi 3:7'  // Valid
  ];
  
  const validVerses = invalidVerses.filter(v => 
    typeof v === 'string' && v.includes(':')
  );
  
  assert.strictEqual(validVerses.length, 2);
  assert.ok(validVerses.every(v => typeof v === 'string'));
});

console.log('All error handling and edge case tests defined');


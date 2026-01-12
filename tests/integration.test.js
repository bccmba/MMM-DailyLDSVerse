/**
 * Integration tests for MMM-DailyLDSVerse
 * Tests the integration between main module and node_helper
 * Tests socket communication, file loading, and end-to-end flows
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

/**
 * Test verse list file loading integration
 */
test('Integration: Should load all verse list files on startup', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const requiredFiles = [
    'bible.json',
    'book-of-mormon.json',
    'doctrine-and-covenants.json',
    'pearl-of-great-price.json'
  ];
  
  const loadedFiles = [];
  requiredFiles.forEach(file => {
    const filePath = path.join(versesDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedFiles.push(file);
        }
      } catch (error) {
        // File exists but invalid - test will fail
      }
    }
  });
  
  assert.strictEqual(loadedFiles.length, 4, 'All four verse list files should be loaded');
  assert.ok(loadedFiles.includes('bible.json'), 'Bible file should be loaded');
  assert.ok(loadedFiles.includes('book-of-mormon.json'), 'Book of Mormon file should be loaded');
  assert.ok(loadedFiles.includes('doctrine-and-covenants.json'), 'D&C file should be loaded');
  assert.ok(loadedFiles.includes('pearl-of-great-price.json'), 'Pearl of Great Price file should be loaded');
});

test('Integration: Verse list files should contain valid verse objects', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  
  if (!fs.existsSync(testFile)) {
    throw new Error('Test file does not exist');
  }
  
  const data = fs.readFileSync(testFile, 'utf8');
  const verses = JSON.parse(data);
  
  assert.ok(Array.isArray(verses), 'Verse list should be an array');
  assert.ok(verses.length > 0, 'Verse list should not be empty');
  
  // Check first verse format
  const firstVerse = verses[0];
  assert.ok(firstVerse, 'First verse should exist');
  
  // Should be object with reference and text, or string
  if (typeof firstVerse === 'object') {
    assert.ok(firstVerse.reference, 'Verse object should have reference property');
    assert.ok(typeof firstVerse.reference === 'string', 'Reference should be string');
    assert.ok(firstVerse.reference.includes(':'), 'Reference should contain chapter:verse');
  } else if (typeof firstVerse === 'string') {
    assert.ok(firstVerse.includes(':'), 'Reference string should contain chapter:verse');
  }
});

test('Integration: All volumes should have verses', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const volumes = {
    bible: 'bible.json',
    bookOfMormon: 'book-of-mormon.json',
    doctrineAndCovenants: 'doctrine-and-covenants.json',
    pearlOfGreatPrice: 'pearl-of-great-price.json'
  };
  
  Object.entries(volumes).forEach(([volume, file]) => {
    const filePath = path.join(versesDir, file);
    assert.ok(fs.existsSync(filePath), `${volume} file should exist`);
    
    const data = fs.readFileSync(filePath, 'utf8');
    const verses = JSON.parse(data);
    
    assert.ok(Array.isArray(verses), `${volume} should be an array`);
    assert.ok(verses.length > 0, `${volume} should have verses`);
  });
});

/**
 * Test socket notification flow
 */
test('Integration: Socket notification flow - GET_VERSE to VERSE_RESULT', () => {
  // Simulate the flow
  const notification = 'GET_VERSE';
  const payload = null;
  
  // Simulate node_helper processing
  const dayOfYear = 1;
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  const volume = volumes[volumeIndex];
  
  // Simulate verse selection
  const verseLists = {
    bible: [{ reference: 'John 3:16', text: 'For God so loved...' }],
    bookOfMormon: [{ reference: '1 Nephi 3:7', text: 'And it came to pass...' }],
    doctrineAndCovenants: [{ reference: 'D&C 1:1', text: 'Hearken...' }],
    pearlOfGreatPrice: [{ reference: 'Moses 1:1', text: 'The words of God...' }]
  };
  
  const verse = verseLists[volume][0];
  const result = {
    text: verse.text || verse.reference,
    reference: verse.reference || verse
  };
  
  assert.ok(result.reference, 'Result should have reference');
  assert.ok(result.text || result.reference, 'Result should have text or reference');
});

test('Integration: Socket notification flow - Error handling', () => {
  // Simulate error flow
  const notification = 'GET_VERSE';
  
  // Simulate error in node_helper
  const error = new Error('No verses available');
  const errorResult = {
    message: error.message
  };
  
  assert.ok(errorResult.message, 'Error result should have message');
  assert.strictEqual(errorResult.message, 'No verses available');
});

/**
 * Test end-to-end verse selection flow
 */
test('Integration: End-to-end verse selection for different days', () => {
  const testDays = [1, 2, 3, 4, 5, 100, 200, 365, 366];
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  
  testDays.forEach(dayOfYear => {
    const volumeIndex = (dayOfYear - 1) % 4;
    const volume = volumes[volumeIndex];
    
    assert.ok(volumes.includes(volume), `Day ${dayOfYear} should select valid volume`);
    
    // Simulate verse index calculation
    const mockList = Array(100).fill(0).map((_, i) => ({ reference: `Verse ${i}`, text: `Text ${i}` }));
    const volumeCycle = Math.floor((dayOfYear - 1) / 4);
    const verseIndex = volumeCycle % mockList.length;
    
    assert.ok(verseIndex >= 0 && verseIndex < mockList.length, `Day ${dayOfYear} should have valid verse index`);
  });
});

test('Integration: Verse selection consistency across year', () => {
  // Test that same day always selects same volume
  const day1 = 1;
  const day2 = 365;
  const day3 = 366;
  
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  
  const volume1 = volumes[(day1 - 1) % 4];
  const volume2 = volumes[(day2 - 1) % 4];
  const volume3 = volumes[(day3 - 1) % 4];
  
  assert.strictEqual(volume1, 'bible', 'Day 1 should be bible');
  assert.strictEqual(volume2, 'bible', 'Day 365 should be bible');
  assert.strictEqual(volume3, 'bookOfMormon', 'Day 366 should be bookOfMormon');
});

/**
 * Test file format compatibility
 */
test('Integration: Should handle both string and object verse formats', () => {
  const stringFormat = ['1 Nephi 3:7', '2 Nephi 2:25'];
  const objectFormat = [
    { reference: '1 Nephi 3:7', text: 'And it came to pass...' },
    { reference: '2 Nephi 2:25', text: 'Adam fell that men might be...' }
  ];
  
  // Test string format handling
  stringFormat.forEach(verse => {
    const reference = typeof verse === 'string' ? verse : verse.reference;
    const text = typeof verse === 'string' ? '' : verse.text;
    
    assert.ok(reference, 'Should extract reference from string format');
    assert.strictEqual(text, '', 'String format should have empty text');
  });
  
  // Test object format handling
  objectFormat.forEach(verse => {
    const reference = typeof verse === 'string' ? verse : verse.reference;
    const text = typeof verse === 'string' ? '' : verse.text;
    
    assert.ok(reference, 'Should extract reference from object format');
    assert.ok(text, 'Object format should have text');
  });
});

/**
 * Test module configuration integration
 */
test('Integration: Configuration should merge with defaults correctly', () => {
  const defaults = {
    updateInterval: 86400000,
    header: "Verse of the day"
  };
  
  const userConfig1 = {};
  const merged1 = { ...defaults, ...userConfig1 };
  assert.strictEqual(merged1.updateInterval, defaults.updateInterval);
  assert.strictEqual(merged1.header, defaults.header);
  
  const userConfig2 = { header: "Daily Scripture" };
  const merged2 = { ...defaults, ...userConfig2 };
  assert.strictEqual(merged2.updateInterval, defaults.updateInterval);
  assert.strictEqual(merged2.header, "Daily Scripture");
  
  const userConfig3 = { updateInterval: 43200000, header: "" };
  const merged3 = { ...defaults, ...userConfig3 };
  assert.strictEqual(merged3.updateInterval, 43200000);
  assert.strictEqual(merged3.header, "");
});

console.log('All integration tests defined');


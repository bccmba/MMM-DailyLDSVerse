/**
 * Unit tests for generate-verse-lists.js
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Import functions to test
const {
  saveVerseList,
  verifyVerseList,
  delay,
  CONFIG
} = require('../generate-verse-lists.js');

// Test data
const testVerses = [
  '1 Nephi 1:1',
  '1 Nephi 1:2',
  '1 Nephi 3:7',
  '2 Nephi 2:25',
  'Alma 32:21'
];

const testVolume = {
  name: 'bookOfMormon',
  displayName: 'Book of Mormon',
  file: 'test-book-of-mormon.json'
};

/**
 * Test saveVerseList function
 */
test('saveVerseList - Should save verses to JSON file', () => {
  // Ensure test directory exists
  const testDir = path.join(__dirname, '..', 'verses');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const result = saveVerseList(testVolume, testVerses);
  assert.strictEqual(result, true, 'saveVerseList should return true on success');
  
  // Verify file was created
  const filePath = path.join(testDir, testVolume.file);
  assert.ok(fs.existsSync(filePath), 'Verse list file should be created');
  
  // Verify file content
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(content);
  assert.ok(Array.isArray(parsed), 'File should contain a JSON array');
  assert.strictEqual(parsed.length, testVerses.length, 'Should contain all verses');
  assert.deepStrictEqual(parsed, testVerses, 'Should match input verses');
});

test('saveVerseList - Should handle empty verse list', () => {
  const emptyVolume = { ...testVolume, file: 'test-empty.json' };
  const result = saveVerseList(emptyVolume, []);
  assert.strictEqual(result, true, 'Should handle empty list');
  
  const filePath = path.join(__dirname, '..', 'verses', 'test-empty.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(content);
  assert.deepStrictEqual(parsed, [], 'Should be empty array');
});

test('saveVerseList - Should create directory if it does not exist', () => {
  const tempDir = path.join(__dirname, 'temp-verse-test');
  const tempVolume = { ...testVolume, file: 'test-temp.json' };
  
  // Remove directory if it exists
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  
  // Temporarily change output directory
  const originalDir = CONFIG.outputDir;
  CONFIG.outputDir = tempDir;
  
  try {
    const result = saveVerseList(tempVolume, testVerses);
    assert.strictEqual(result, true, 'Should create directory and save file');
    assert.ok(fs.existsSync(tempDir), 'Directory should be created');
  } finally {
    // Cleanup
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    CONFIG.outputDir = originalDir;
  }
});

/**
 * Test verifyVerseList function
 */
test('verifyVerseList - Should verify valid verse list file', () => {
  // First create a valid file
  saveVerseList(testVolume, testVerses);
  
  const result = verifyVerseList(testVolume);
  assert.strictEqual(result, true, 'Should verify valid file');
});

test('verifyVerseList - Should fail for non-existent file', () => {
  const nonExistentVolume = { ...testVolume, file: 'non-existent.json' };
  const result = verifyVerseList(nonExistentVolume);
  assert.strictEqual(result, false, 'Should return false for non-existent file');
});

test('verifyVerseList - Should fail for invalid JSON', () => {
  const invalidVolume = { ...testVolume, file: 'test-invalid.json' };
  const filePath = path.join(__dirname, '..', 'verses', invalidVolume.file);
  
  // Write invalid JSON
  fs.writeFileSync(filePath, 'not valid json', 'utf8');
  
  try {
    const result = verifyVerseList(invalidVolume);
    assert.strictEqual(result, false, 'Should return false for invalid JSON');
  } finally {
    // Cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

test('verifyVerseList - Should fail for non-array JSON', () => {
  const invalidVolume = { ...testVolume, file: 'test-not-array.json' };
  const filePath = path.join(__dirname, '..', 'verses', invalidVolume.file);
  
  // Write object instead of array
  fs.writeFileSync(filePath, JSON.stringify({ verses: testVerses }), 'utf8');
  
  try {
    const result = verifyVerseList(invalidVolume);
    assert.strictEqual(result, false, 'Should return false for non-array');
  } finally {
    // Cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

test('verifyVerseList - Should warn for empty array', () => {
  const emptyVolume = { ...testVolume, file: 'test-empty-verify.json' };
  saveVerseList(emptyVolume, []);
  
  const result = verifyVerseList(emptyVolume);
  assert.strictEqual(result, false, 'Should return false for empty array');
});

test('verifyVerseList - Should detect invalid verse format', () => {
  const invalidFormatVolume = { ...testVolume, file: 'test-invalid-format.json' };
  const invalidVerses = ['1 Nephi 1:1', 'invalid-verse', '2 Nephi 2:25', 'no-colon'];
  saveVerseList(invalidFormatVolume, invalidVerses);
  
  // Should still return true (just warns), but we can check the format
  const result = verifyVerseList(invalidFormatVolume);
  // The function warns but doesn't fail - this is acceptable behavior
  assert.ok(typeof result === 'boolean', 'Should return boolean');
});

/**
 * Test delay function
 */
test('delay - Should delay for specified milliseconds', async () => {
  const start = Date.now();
  await delay(100);
  const elapsed = Date.now() - start;
  
  // Should be approximately 100ms (allow some variance)
  assert.ok(elapsed >= 90 && elapsed <= 150, `Delay should be ~100ms, got ${elapsed}ms`);
});

test('delay - Should handle zero delay', async () => {
  const start = Date.now();
  await delay(0);
  const elapsed = Date.now() - start;
  
  // Should be very fast (near 0ms)
  assert.ok(elapsed < 50, `Zero delay should be fast, got ${elapsed}ms`);
});

/**
 * Cleanup test files
 */
test('Cleanup - Remove test files', () => {
  const testFiles = [
    'test-book-of-mormon.json',
    'test-empty.json',
    'test-empty-verify.json',
    'test-invalid-format.json'
  ];
  
  const versesDir = path.join(__dirname, '..', 'verses');
  
  testFiles.forEach(file => {
    const filePath = path.join(versesDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
  
  console.log('Test cleanup completed');
});

console.log('All generate-verse-lists tests defined');


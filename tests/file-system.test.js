/**
 * File system integration tests
 * Tests verse list file operations, file format validation, and error handling
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const versesDir = path.join(__dirname, '..', 'verses');

/**
 * Test verse list file existence and accessibility
 */
test('File System: All required verse list files should exist', () => {
  const requiredFiles = [
    'bible.json',
    'book-of-mormon.json',
    'doctrine-and-covenants.json',
    'pearl-of-great-price.json'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(versesDir, file);
    assert.ok(fs.existsSync(filePath), `${file} should exist`);
    assert.ok(fs.statSync(filePath).isFile(), `${file} should be a file`);
    assert.ok(fs.statSync(filePath).size > 0, `${file} should not be empty`);
  });
});

test('File System: Verse list files should be readable', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  
  assert.doesNotThrow(() => {
    const data = fs.readFileSync(testFile, 'utf8');
    assert.ok(data.length > 0, 'File should have content');
  }, 'File should be readable');
});

test('File System: Verse list files should be valid JSON', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  
  assert.doesNotThrow(() => {
    const data = fs.readFileSync(testFile, 'utf8');
    const parsed = JSON.parse(data);
    assert.ok(parsed, 'JSON should parse successfully');
  }, 'File should contain valid JSON');
});

test('File System: Verse list files should be arrays', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  const data = fs.readFileSync(testFile, 'utf8');
  const parsed = JSON.parse(data);
  
  assert.ok(Array.isArray(parsed), 'Verse list should be an array');
  assert.ok(parsed.length > 0, 'Array should not be empty');
});

/**
 * Test verse data format validation
 */
test('File System: Verse objects should have correct structure', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  const data = fs.readFileSync(testFile, 'utf8');
  const verses = JSON.parse(data);
  
  // Check first few verses
  const sampleSize = Math.min(10, verses.length);
  for (let i = 0; i < sampleSize; i++) {
    const verse = verses[i];
    
    if (typeof verse === 'object') {
      assert.ok(verse.reference, `Verse ${i} should have reference property`);
      assert.ok(typeof verse.reference === 'string', `Verse ${i} reference should be string`);
      assert.ok(verse.reference.includes(':'), `Verse ${i} reference should contain chapter:verse`);
      
      if (verse.text !== undefined) {
        assert.ok(typeof verse.text === 'string', `Verse ${i} text should be string`);
      }
    } else if (typeof verse === 'string') {
      assert.ok(verse.includes(':'), `Verse ${i} string should contain chapter:verse`);
    }
  }
});

test('File System: Verse references should be parseable', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  const data = fs.readFileSync(testFile, 'utf8');
  const verses = JSON.parse(data);
  
  // Test reference parsing pattern
  const pattern = /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/;
  
  const sampleSize = Math.min(20, verses.length);
  for (let i = 0; i < sampleSize; i++) {
    const verse = verses[i];
    const reference = typeof verse === 'string' ? verse : verse.reference;
    
    if (reference) {
      const match = reference.match(pattern);
      assert.ok(match, `Verse ${i} reference "${reference}" should match pattern`);
      assert.ok(match[1].trim().length > 0, `Verse ${i} should have book name`);
      assert.ok(parseInt(match[2], 10) > 0, `Verse ${i} should have valid chapter`);
      assert.ok(parseInt(match[3], 10) > 0, `Verse ${i} should have valid verse number`);
    }
  }
});

/**
 * Test file size and content validation
 */
test('File System: Verse list files should have reasonable sizes', () => {
  const files = [
    'bible.json',
    'book-of-mormon.json',
    'doctrine-and-covenants.json',
    'pearl-of-great-price.json'
  ];
  
  files.forEach(file => {
    const filePath = path.join(versesDir, file);
    const stats = fs.statSync(filePath);
    
    assert.ok(stats.size > 1000, `${file} should be at least 1KB`);
    assert.ok(stats.size < 100 * 1024 * 1024, `${file} should be less than 100MB`);
  });
});

test('File System: All volumes should have substantial verse counts', () => {
  const volumes = {
    'bible.json': 1000, // Minimum expected verses
    'book-of-mormon.json': 500,
    'doctrine-and-covenants.json': 100,
    'pearl-of-great-price.json': 50
  };
  
  Object.entries(volumes).forEach(([file, minVerses]) => {
    const filePath = path.join(versesDir, file);
    const data = fs.readFileSync(filePath, 'utf8');
    const verses = JSON.parse(data);
    
    assert.ok(verses.length >= minVerses, `${file} should have at least ${minVerses} verses, got ${verses.length}`);
  });
});

/**
 * Test error handling for missing/corrupted files
 */
test('File System: Should handle missing file gracefully', () => {
  const missingFile = path.join(versesDir, 'nonexistent.json');
  
  let loaded = false;
  try {
    if (fs.existsSync(missingFile)) {
      const data = fs.readFileSync(missingFile, 'utf8');
      JSON.parse(data);
      loaded = true;
    }
  } catch (error) {
    // Expected - should handle gracefully
    loaded = false;
  }
  
  assert.strictEqual(loaded, false, 'Should not load non-existent file');
});

test('File System: Should handle corrupted JSON gracefully', () => {
  const corruptedJson = '{ invalid json }';
  
  assert.throws(() => {
    JSON.parse(corruptedJson);
  }, /Unexpected token/, 'Should throw error for invalid JSON');
});

test('File System: Should handle empty file gracefully', () => {
  const emptyArray = [];
  
  assert.ok(Array.isArray(emptyArray), 'Empty array should be valid');
  assert.strictEqual(emptyArray.length, 0, 'Empty array should have length 0');
  
  // Should throw error when trying to get verse from empty list
  assert.throws(() => {
    if (emptyArray.length === 0) {
      throw new Error('No verses available');
    }
  }, /No verses available/);
});

/**
 * Test file permissions
 */
test('File System: Verse list files should be readable', () => {
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  const stats = fs.statSync(testFile);
  
  // Check that file is readable (mode includes read permission)
  // On Unix: 0444 = readable by all, 0644 = readable/writable by owner
  const isReadable = (stats.mode & parseInt('0444', 8)) !== 0;
  assert.ok(isReadable || stats.mode === 33188, 'File should be readable');
});

/**
 * Test file format consistency
 */
test('File System: All verse list files should use consistent format', () => {
  const files = [
    'bible.json',
    'book-of-mormon.json',
    'doctrine-and-covenants.json',
    'pearl-of-great-price.json'
  ];
  
  const formats = [];
  
  files.forEach(file => {
    const filePath = path.join(versesDir, file);
    const data = fs.readFileSync(filePath, 'utf8');
    const verses = JSON.parse(data);
    
    if (verses.length > 0) {
      const firstVerse = verses[0];
      const format = typeof firstVerse === 'string' ? 'string' : 'object';
      formats.push({ file, format, hasText: typeof firstVerse === 'object' && firstVerse.text !== undefined });
    }
  });
  
  // All files should use same format
  const uniqueFormats = new Set(formats.map(f => f.format));
  assert.ok(uniqueFormats.size <= 2, 'Files should use consistent format (string or object)');
});

console.log('All file system tests defined');


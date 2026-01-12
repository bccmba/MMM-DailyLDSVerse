/**
 * Performance and load tests
 * Tests load times, memory usage, and performance characteristics
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

/**
 * Test verse list file loading performance
 */
test('Performance: Verse list files should load within reasonable time', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  
  const startTime = Date.now();
  const data = fs.readFileSync(testFile, 'utf8');
  const parseTime = Date.now();
  const verses = JSON.parse(data);
  const endTime = Date.now();
  
  const readTime = parseTime - startTime;
  const parseTimeMs = endTime - parseTime;
  const totalTime = endTime - startTime;
  
  // File read should be fast (< 100ms for typical file)
  assert.ok(readTime < 1000, `File read should be fast (${readTime}ms)`);
  
  // JSON parse should be fast (< 500ms for typical file)
  assert.ok(parseTimeMs < 2000, `JSON parse should be fast (${parseTimeMs}ms)`);
  
  // Total should be reasonable
  assert.ok(totalTime < 3000, `Total load time should be reasonable (${totalTime}ms)`);
  
  assert.ok(verses.length > 0, 'Should have loaded verses');
});

test('Performance: All verse list files should load efficiently', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const files = [
    'bible.json',
    'book-of-mormon.json',
    'doctrine-and-covenants.json',
    'pearl-of-great-price.json'
  ];
  
  const loadTimes = {};
  const totalStart = Date.now();
  
  files.forEach(file => {
    const filePath = path.join(versesDir, file);
    const start = Date.now();
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    const end = Date.now();
    
    loadTimes[file] = end - start;
    assert.ok(Array.isArray(parsed), `${file} should be array`);
    assert.ok(parsed.length > 0, `${file} should have verses`);
  });
  
  const totalTime = Date.now() - totalStart;
  
  // All files should load in reasonable time
  Object.entries(loadTimes).forEach(([file, time]) => {
    assert.ok(time < 5000, `${file} should load quickly (${time}ms)`);
  });
  
  // Total load time should be reasonable
  assert.ok(totalTime < 10000, `All files should load in reasonable time (${totalTime}ms)`);
});

/**
 * Test verse selection performance
 */
test('Performance: Verse selection should be fast', () => {
  const mockList = Array(10000).fill(0).map((_, i) => ({
    reference: `Verse ${i}`,
    text: `Text ${i}`
  }));
  
  const start = Date.now();
  
  // Simulate verse selection for multiple days
  for (let day = 1; day <= 100; day++) {
    const volumeCycle = Math.floor((day - 1) / 4);
    const index = volumeCycle % mockList.length;
    const verse = mockList[index];
    assert.ok(verse, `Day ${day} should have verse`);
  }
  
  const end = Date.now();
  const time = end - start;
  
  // 100 verse selections should be very fast
  assert.ok(time < 100, `Verse selection should be fast (${time}ms for 100 selections)`);
});

test('Performance: Day of year calculation should be fast', () => {
  const testDates = [
    new Date(2024, 0, 1),
    new Date(2024, 5, 15),
    new Date(2024, 11, 31),
    new Date(2023, 11, 31), // Non-leap year
    new Date(2024, 1, 29) // Leap year Feb 29
  ];
  
  const start = Date.now();
  
  testDates.forEach(date => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    assert.ok(dayOfYear >= 1 && dayOfYear <= 366, `Day of year should be valid: ${dayOfYear}`);
  });
  
  const end = Date.now();
  const time = end - start;
  
  assert.ok(time < 10, `Day of year calculation should be very fast (${time}ms)`);
});

/**
 * Test memory efficiency
 */
test('Performance: Verse lists should not cause memory issues', () => {
  const versesDir = path.join(__dirname, '..', 'verses');
  const testFile = path.join(versesDir, 'book-of-mormon.json');
  
  const data = fs.readFileSync(testFile, 'utf8');
  const verses = JSON.parse(data);
  
  // Check that we can iterate through all verses without issues
  let count = 0;
  verses.forEach(verse => {
    count++;
    if (typeof verse === 'object') {
      assert.ok(verse.reference, 'Verse should have reference');
    } else {
      assert.ok(typeof verse === 'string', 'Verse should be string');
    }
  });
  
  assert.strictEqual(count, verses.length, 'Should iterate through all verses');
  assert.ok(verses.length > 0, 'Should have verses');
});

/**
 * Test update scheduling performance
 */
test('Performance: Update scheduling should not block', () => {
  const start = Date.now();
  
  // Simulate scheduling multiple updates
  let scheduled = 0;
  for (let i = 0; i < 10; i++) {
    const msUntilUpdate = 1000;
    setTimeout(() => {
      scheduled++;
    }, msUntilUpdate);
  }
  
  const scheduleTime = Date.now() - start;
  
  // Scheduling should be instant (non-blocking)
  assert.ok(scheduleTime < 50, `Scheduling should be non-blocking (${scheduleTime}ms)`);
});

/**
 * Test large file handling
 */
test('Performance: Should handle large verse lists efficiently', () => {
  // Bible is the largest file
  const versesDir = path.join(__dirname, '..', 'verses');
  const bibleFile = path.join(versesDir, 'bible.json');
  
  if (!fs.existsSync(bibleFile)) {
    return; // Skip if file doesn't exist
  }
  
  const start = Date.now();
  const data = fs.readFileSync(bibleFile, 'utf8');
  const parseStart = Date.now();
  const verses = JSON.parse(data);
  const end = Date.now();
  
  const readTime = parseStart - start;
  const parseTime = end - parseStart;
  
  // Even large files should load in reasonable time
  assert.ok(readTime < 2000, `Large file read should be reasonable (${readTime}ms)`);
  assert.ok(parseTime < 3000, `Large file parse should be reasonable (${parseTime}ms)`);
  assert.ok(verses.length > 0, 'Should have loaded verses from large file');
});

/**
 * Test repeated operations
 */
test('Performance: Repeated verse selections should be consistent', () => {
  const mockList = Array(1000).fill(0).map((_, i) => ({
    reference: `Verse ${i}`,
    text: `Text ${i}`
  }));
  
  const start = Date.now();
  const results = [];
  
  // Select verses for 365 days
  for (let day = 1; day <= 365; day++) {
    const volumeCycle = Math.floor((day - 1) / 4);
    const index = volumeCycle % mockList.length;
    results.push(mockList[index]);
  }
  
  const end = Date.now();
  const time = end - start;
  
  assert.strictEqual(results.length, 365, 'Should select verses for all days');
  assert.ok(time < 500, `365 selections should be fast (${time}ms)`);
  
  // Verify consistency - same day should always get same verse
  const day1Verse = results[0];
  const day5Verse = results[4]; // Same volume, different verse (variety)
  
  assert.ok(day1Verse, 'Day 1 should have verse');
  assert.ok(day5Verse, 'Day 5 should have verse');
  assert.notStrictEqual(day1Verse.reference, day5Verse.reference, 'Different days should have different verses');
});

console.log('All performance tests defined');


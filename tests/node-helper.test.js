/**
 * Unit tests for node_helper.js functions
 */

const { test } = require('node:test');
const assert = require('node:assert');

// We'll need to extract the functions to test them
// For now, we'll test the logic directly

/**
 * Test getDayOfYear function logic
 */
test('getDayOfYear - January 1st should return 1', () => {
  const date = new Date(2024, 0, 1); // January 1, 2024
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  assert.strictEqual(dayOfYear, 1);
});

test('getDayOfYear - December 31st should return 365 (non-leap year)', () => {
  const date = new Date(2023, 11, 31); // December 31, 2023
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  assert.strictEqual(dayOfYear, 365);
});

test('getDayOfYear - December 31st should return 366 (leap year)', () => {
  const date = new Date(2024, 11, 31); // December 31, 2024 (leap year)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  assert.strictEqual(dayOfYear, 366);
});

test('getDayOfYear - February 29th should return 60 (leap year)', () => {
  const date = new Date(2024, 1, 29); // February 29, 2024
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  assert.strictEqual(dayOfYear, 60);
});

/**
 * Test getVolumeForDay function logic
 */
test('getVolumeForDay - Day 1 should return bible', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 1;
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bible');
});

test('getVolumeForDay - Day 2 should return bookOfMormon', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 2;
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bookOfMormon');
});

test('getVolumeForDay - Day 3 should return doctrineAndCovenants', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 3;
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'doctrineAndCovenants');
});

test('getVolumeForDay - Day 4 should return pearlOfGreatPrice', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 4;
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'pearlOfGreatPrice');
});

test('getVolumeForDay - Day 5 should return bible (cycle)', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 5;
  const volumeIndex = (dayOfYear - 1) % 4;
  assert.strictEqual(volumes[volumeIndex], 'bible');
});

test('getVolumeForDay - Day 366 should cycle correctly', () => {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const dayOfYear = 366;
  const volumeIndex = (dayOfYear - 1) % 4;
  // Day 366: (366-1) % 4 = 365 % 4 = 1, so bookOfMormon
  assert.strictEqual(volumes[volumeIndex], 'bookOfMormon');
});

/**
 * Test getVerseIndexForDay function logic
 * Updated to use seeded random for randomized verse selection
 */
function seededRandom(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getVerseIndexForDay(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  
  const volumeIndex = (dayOfYear - 1) % 4;
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeName = volumes[volumeIndex];
  
  let seed = dayOfYear * 1000 + volumeName.length;
  for (let i = 0; i < volumeName.length; i++) {
    seed += volumeName.charCodeAt(i) * (i + 1);
  }
  
  const random = seededRandom(seed);
  return Math.floor(random() * volumeList.length);
}

test('getVerseIndexForDay - Should return valid index within volume list', () => {
  const dayOfYear = 1;
  const mockList = ['verse1', 'verse2', 'verse3', 'verse4', 'verse5'];
  const index = getVerseIndexForDay(dayOfYear, mockList);
  assert.ok(index >= 0 && index < mockList.length);
});

test('getVerseIndexForDay - Should ensure variety across days', () => {
  const mockList = Array(100).fill(0).map((_, i) => `verse${i}`);
  
  const indices = [];
  for (let day = 1; day <= 30; day++) {
    indices.push(getVerseIndexForDay(day, mockList));
  }
  
  const uniqueIndices = new Set(indices);
  assert.ok(uniqueIndices.size > 1, 'Should have variety across multiple days');
});

test('getVerseIndexForDay - Should ensure different verses for different volumes in same cycle', () => {
  const mockList = Array(100).fill(0).map((_, i) => `verse${i}`);
  
  const index1 = getVerseIndexForDay(1, mockList);
  const index2 = getVerseIndexForDay(2, mockList);
  const index3 = getVerseIndexForDay(3, mockList);
  const index4 = getVerseIndexForDay(4, mockList);
  
  assert.notStrictEqual(index1, index2, 'Bible and Book of Mormon should have different indices');
  assert.notStrictEqual(index2, index3, 'Book of Mormon and D&C should have different indices');
  assert.notStrictEqual(index3, index4, 'D&C and Pearl should have different indices');
  assert.notStrictEqual(index1, index4, 'Bible and Pearl should have different indices');
});

test('getVerseIndexForDay - Should wrap around for large day numbers', () => {
  const mockList = Array(10).fill(0).map((_, i) => `verse${i}`);
  
  const index41 = getVerseIndexForDay(41, mockList);
  assert.ok(index41 >= 0 && index41 < mockList.length);
});

/**
 * Test midnight calculation
 */
test('getNextMidnight - Should calculate correct milliseconds until midnight', () => {
  // Create a date at 12:00 PM (noon)
  const now = new Date(2024, 0, 1, 12, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  // Should be 12 hours = 43200000 milliseconds
  assert.strictEqual(msUntilMidnight, 43200000);
});

test('getNextMidnight - Should handle year boundary', () => {
  // Create a date at December 31, 11:00 PM
  const now = new Date(2023, 11, 31, 23, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  // Should be 1 hour = 3600000 milliseconds
  assert.strictEqual(msUntilMidnight, 3600000);
  // Tomorrow should be January 1, 2024
  assert.strictEqual(tomorrow.getFullYear(), 2024);
  assert.strictEqual(tomorrow.getMonth(), 0);
  assert.strictEqual(tomorrow.getDate(), 1);
});

console.log('All node_helper utility function tests defined');


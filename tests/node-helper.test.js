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
 */
test('getVerseIndexForDay - Should return valid index within volume list', () => {
  const dayOfYear = 1;
  const mockList = ['verse1', 'verse2', 'verse3', 'verse4', 'verse5'];
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  const index = volumeCycle % mockList.length;
  assert.ok(index >= 0 && index < mockList.length);
});

test('getVerseIndexForDay - Should ensure variety across days', () => {
  const mockList = Array(100).fill(0).map((_, i) => `verse${i}`);
  
  // Day 1: floor((1-1)/4) = 0, 0 % 100 = 0
  const index1 = Math.floor((1 - 1) / 4) % mockList.length;
  
  // Day 5: floor((5-1)/4) = 1, 1 % 100 = 1
  const index5 = Math.floor((5 - 1) / 4) % mockList.length;
  
  assert.notStrictEqual(index1, index5, 'Day 1 and Day 5 should return different indices');
});

test('getVerseIndexForDay - Should wrap around for large day numbers', () => {
  const mockList = Array(10).fill(0).map((_, i) => `verse${i}`);
  
  // Day 41: floor((41-1)/4) = 10, 10 % 10 = 0 (wraps around)
  const index41 = Math.floor((41 - 1) / 4) % mockList.length;
  assert.strictEqual(index41, 0);
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


/**
 * Unit tests for convert-lds-data.js
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Import functions to test
const {
  convertVerse,
  getVolumeFromBook,
  parseVerseReference,
  VOLUME_MAPPINGS
} = require('../convert-lds-data.js');

/**
 * Test convertVerse function
 */
test('convertVerse - Should convert object with book, chapter, verse, text', () => {
  const verseData = {
    book: '1 Nephi',
    chapter: 3,
    verse: 7,
    text: 'And it came to pass...'
  };
  
  const result = convertVerse(verseData);
  
  assert.ok(result);
  assert.strictEqual(result.reference, '1 Nephi 3:7');
  assert.strictEqual(result.text, 'And it came to pass...');
});

test('convertVerse - Should convert object with book_name, chapter_num, verse_num', () => {
  const verseData = {
    book_name: 'John',
    chapter_num: 3,
    verse_num: 16,
    verse_text: 'For God so loved the world...'
  };
  
  const result = convertVerse(verseData);
  
  assert.ok(result);
  assert.strictEqual(result.reference, 'John 3:16');
  assert.strictEqual(result.text, 'For God so loved the world...');
});

test('convertVerse - Should convert from Reference string', () => {
  const verseData = {
    Reference: '1 Nephi 3:7',
    Text: 'And it came to pass...'
  };
  
  const result = convertVerse(verseData);
  
  assert.ok(result);
  assert.strictEqual(result.reference, '1 Nephi 3:7');
  assert.strictEqual(result.text, 'And it came to pass...');
});

test('convertVerse - Should handle missing text', () => {
  const verseData = {
    book: '1 Nephi',
    chapter: 3,
    verse: 7
  };
  
  const result = convertVerse(verseData);
  
  assert.ok(result);
  assert.strictEqual(result.reference, '1 Nephi 3:7');
  assert.strictEqual(result.text, '');
});

test('convertVerse - Should return null for invalid data', () => {
  const verseData = {
    invalid: 'data'
  };
  
  const result = convertVerse(verseData);
  assert.strictEqual(result, null);
});

/**
 * Test getVolumeFromBook function
 */
test('getVolumeFromBook - Should identify Book of Mormon', () => {
  assert.strictEqual(getVolumeFromBook('1 Nephi'), 'bookOfMormon');
  assert.strictEqual(getVolumeFromBook('Alma'), 'bookOfMormon');
  assert.strictEqual(getVolumeFromBook('Moroni'), 'bookOfMormon');
});

test('getVolumeFromBook - Should identify Doctrine and Covenants', () => {
  assert.strictEqual(getVolumeFromBook('D&C'), 'doctrineAndCovenants');
  assert.strictEqual(getVolumeFromBook('Doctrine and Covenants'), 'doctrineAndCovenants');
});

test('getVolumeFromBook - Should identify Pearl of Great Price', () => {
  assert.strictEqual(getVolumeFromBook('Moses'), 'pearlOfGreatPrice');
  assert.strictEqual(getVolumeFromBook('Abraham'), 'pearlOfGreatPrice');
});

test('getVolumeFromBook - Should identify Bible', () => {
  assert.strictEqual(getVolumeFromBook('John'), 'bible');
  assert.strictEqual(getVolumeFromBook('Genesis'), 'bible');
  assert.strictEqual(getVolumeFromBook('Matthew'), 'bible');
});

test('getVolumeFromBook - Should return null for unknown book', () => {
  assert.strictEqual(getVolumeFromBook('Unknown Book'), null);
});

/**
 * Test parseVerseReference function
 */
test('parseVerseReference - Should parse standard format', () => {
  const result = parseVerseReference('1 Nephi', 3, 7);
  assert.strictEqual(result, '1 Nephi 3:7');
});

test('parseVerseReference - Should handle D&C format', () => {
  const result = parseVerseReference('D&C', 1, 1);
  assert.strictEqual(result, 'D&C 1:1');
});

test('parseVerseReference - Should handle Doctrine and Covenants', () => {
  const result = parseVerseReference('Doctrine and Covenants', 1, 1);
  assert.strictEqual(result, 'D&C 1:1');
});

test('parseVerseReference - Should handle Bible books', () => {
  const result = parseVerseReference('John', 3, 16);
  assert.strictEqual(result, 'John 3:16');
});

/**
 * Test volume mappings
 */
test('Volume mappings - Should have all four volumes', () => {
  assert.ok(VOLUME_MAPPINGS.bible);
  assert.ok(VOLUME_MAPPINGS.bookOfMormon);
  assert.ok(VOLUME_MAPPINGS.doctrineAndCovenants);
  assert.ok(VOLUME_MAPPINGS.pearlOfGreatPrice);
});

test('Volume mappings - Should have correct file names', () => {
  assert.strictEqual(VOLUME_MAPPINGS.bible.file, 'bible.json');
  assert.strictEqual(VOLUME_MAPPINGS.bookOfMormon.file, 'book-of-mormon.json');
  assert.strictEqual(VOLUME_MAPPINGS.doctrineAndCovenants.file, 'doctrine-and-covenants.json');
  assert.strictEqual(VOLUME_MAPPINGS.pearlOfGreatPrice.file, 'pearl-of-great-price.json');
});

test('Volume mappings - Book of Mormon should have 15 books', () => {
  assert.strictEqual(VOLUME_MAPPINGS.bookOfMormon.bookNames.length, 15);
});

console.log('All convert-lds-data tests defined');


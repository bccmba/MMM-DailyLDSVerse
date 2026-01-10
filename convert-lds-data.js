/**
 * LDS Documentation Project Data Converter
 * 
 * Converts LDS Documentation Project database files to verse list JSON files
 * 
 * Usage: node convert-lds-data.js [input-file] [output-dir]
 * 
 * Example:
 *   node convert-lds-data.js lds-scriptures.json verses/
 * 
 * Input formats supported:
 * - JSON array of verse objects
 * - JSON object with verses array
 * - CSV file
 * 
 * Output: JSON files in verses/ directory with format:
 * [
 *   {
 *     "reference": "1 Nephi 3:7",
 *     "text": "And it came to pass..."
 *   },
 *   ...
 * ]
 */

const fs = require('fs');
const path = require('path');

// Volume mappings
const VOLUME_MAPPINGS = {
  'bible': {
    file: 'bible.json',
    displayName: 'Bible',
    bookNames: [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
      'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
      'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
      'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
      'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
      'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
      'Matthew', 'Mark', 'Luke', 'John', 'Acts',
      'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
      'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
      '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
      'James', '1 Peter', '2 Peter', '1 John', '2 John',
      '3 John', 'Jude', 'Revelation'
    ]
  },
  'bookOfMormon': {
    file: 'book-of-mormon.json',
    displayName: 'Book of Mormon',
    bookNames: [
      '1 Nephi', '2 Nephi', 'Jacob', 'Enos', 'Jarom',
      'Omni', 'Words of Mormon', 'Mosiah', 'Alma', 'Helaman',
      '3 Nephi', '4 Nephi', 'Mormon', 'Ether', 'Moroni'
    ]
  },
  'doctrineAndCovenants': {
    file: 'doctrine-and-covenants.json',
    displayName: 'Doctrine and Covenants',
    bookNames: ['D&C', 'Doctrine and Covenants']
  },
  'pearlOfGreatPrice': {
    file: 'pearl-of-great-price.json',
    displayName: 'Pearl of Great Price',
    bookNames: [
      'Moses', 'Abraham', 'Joseph Smith--Matthew', 
      'Joseph Smith--History', 'Articles of Faith'
    ]
  }
};

/**
 * Parse verse reference from various formats
 */
function parseVerseReference(book, chapter, verse) {
  // Handle different book name formats
  let bookName = book;
  
  // Normalize book names
  if (book === 'Doctrine and Covenants' || book === 'D&C') {
    bookName = 'D&C';
  } else if (book === 'Joseph Smith--Matthew') {
    bookName = 'Joseph Smith--Matthew';
  } else if (book === 'Joseph Smith--History') {
    bookName = 'Joseph Smith--History';
  }
  
  return `${bookName} ${chapter}:${verse}`;
}

/**
 * Determine volume from book name
 */
function getVolumeFromBook(bookName) {
  const normalized = bookName.trim();
  
  for (const [volumeKey, volume] of Object.entries(VOLUME_MAPPINGS)) {
    if (volume.bookNames.some(name => 
      normalized === name || 
      normalized.includes(name) ||
      name.includes(normalized)
    )) {
      return volumeKey;
    }
  }
  
  // Special cases
  if (normalized === 'D&C' || normalized === 'Doctrine and Covenants') {
    return 'doctrineAndCovenants';
  }
  
  return null;
}

/**
 * Parse JSON input file
 */
function parseJSONFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Handle different JSON structures
    if (Array.isArray(data)) {
      return data;
    } else if (data.verses && Array.isArray(data.verses)) {
      return data.verses;
    } else if (data.scriptures && Array.isArray(data.scriptures)) {
      return data.scriptures;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error('Unknown JSON structure');
  } catch (error) {
    throw new Error(`Failed to parse JSON file: ${error.message}`);
  }
}

/**
 * Parse CSV input file
 */
function parseCSVFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const verses = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const verse = {};
      
      headers.forEach((header, index) => {
        verse[header] = values[index] || '';
      });
      
      verses.push(verse);
    }
    
    return verses;
  } catch (error) {
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
}

/**
 * Convert verse data to our format
 */
function convertVerse(verseData) {
  // Handle different input formats
  let book, chapter, verse, text;
  
  if (verseData.book && verseData.chapter && verseData.verse) {
    book = verseData.book;
    chapter = verseData.chapter;
    verse = verseData.verse;
    text = verseData.text || verseData.verse_text || verseData.content || '';
  } else if (verseData.book_name && verseData.chapter_num && verseData.verse_num) {
    book = verseData.book_name;
    chapter = verseData.chapter_num;
    verse = verseData.verse_num;
    text = verseData.verse_text || verseData.text || '';
  } else if (verseData.Reference) {
    // Parse from reference string like "1 Nephi 3:7"
    const match = verseData.Reference.match(/^(.+?)\s+(\d+):(\d+)/);
    if (match) {
      book = match[1].trim();
      chapter = parseInt(match[2], 10);
      verse = parseInt(match[3], 10);
      text = verseData.Text || verseData.Verse || verseData.text || '';
    } else {
      return null;
    }
  } else {
    return null;
  }
  
  if (!book || !chapter || !verse) {
    return null;
  }
  
  const reference = parseVerseReference(book, chapter, verse);
  
  return {
    reference: reference,
    text: text || '' // Empty text if not available
  };
}

/**
 * Process input file and generate verse lists
 */
function processInputFile(inputFile, outputDir) {
  console.log('='.repeat(60));
  console.log('LDS Documentation Project Data Converter');
  console.log('='.repeat(60));
  console.log('');
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`Reading input file: ${inputFile}`);
  
  // Parse input file
  let verses;
  const ext = path.extname(inputFile).toLowerCase();
  
  if (ext === '.json') {
    verses = parseJSONFile(inputFile);
  } else if (ext === '.csv') {
    verses = parseCSVFile(inputFile);
  } else {
    console.error(`Error: Unsupported file format: ${ext}`);
    console.error('Supported formats: .json, .csv');
    process.exit(1);
  }
  
  console.log(`Found ${verses.length} verses in input file`);
  console.log('');
  
  // Organize verses by volume
  const volumeVerses = {
    bible: [],
    bookOfMormon: [],
    doctrineAndCovenants: [],
    pearlOfGreatPrice: []
  };
  
  let processed = 0;
  let skipped = 0;
  
  for (const verseData of verses) {
    const converted = convertVerse(verseData);
    
    if (!converted) {
      skipped++;
      continue;
    }
    
    const volume = getVolumeFromBook(converted.reference.split(' ')[0]);
    
    if (volume && volumeVerses[volume]) {
      volumeVerses[volume].push(converted);
      processed++;
    } else {
      skipped++;
    }
  }
  
  console.log(`Processed: ${processed} verses`);
  console.log(`Skipped: ${skipped} verses`);
  console.log('');
  
  // Sort verses by reference (book, chapter, verse)
  function sortVerses(a, b) {
    return a.reference.localeCompare(b.reference);
  }
  
  // Save verse lists
  const results = {
    success: [],
    failed: []
  };
  
  for (const [volumeKey, volume] of Object.entries(VOLUME_MAPPINGS)) {
    const verses = volumeVerses[volumeKey];
    
    if (verses.length === 0) {
      console.warn(`⚠ No verses found for ${volume.displayName}`);
      results.failed.push({ volume: volume.displayName, reason: 'No verses found' });
      continue;
    }
    
    // Sort verses
    verses.sort(sortVerses);
    
    // Remove duplicates
    const uniqueVerses = [];
    const seen = new Set();
    for (const verse of verses) {
      if (!seen.has(verse.reference)) {
        seen.add(verse.reference);
        uniqueVerses.push(verse);
      }
    }
    
    // Save to file
    const outputFile = path.join(outputDir, volume.file);
    
    try {
      // Option 1: Save with reference and text
      const jsonContent = JSON.stringify(uniqueVerses, null, 2);
      fs.writeFileSync(outputFile, jsonContent, 'utf8');
      
      console.log(`✓ Saved ${uniqueVerses.length} verses to ${volume.file}`);
      results.success.push({
        volume: volume.displayName,
        count: uniqueVerses.length,
        file: volume.file
      });
    } catch (error) {
      console.error(`✗ Error saving ${volume.file}:`, error.message);
      results.failed.push({
        volume: volume.displayName,
        reason: error.message
      });
    }
  }
  
  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Conversion Summary');
  console.log('='.repeat(60));
  console.log(`Successfully converted: ${results.success.length} volume(s)`);
  results.success.forEach(item => {
    console.log(`  ✓ ${item.volume}: ${item.count} verses → ${item.file}`);
  });
  
  if (results.failed.length > 0) {
    console.log(`\nFailed: ${results.failed.length} volume(s)`);
    results.failed.forEach(item => {
      console.log(`  ✗ ${item.volume}: ${item.reason}`);
    });
  }
  
  console.log('');
  
  if (results.failed.length === 0) {
    console.log('✓ All verse lists generated successfully!');
    process.exit(0);
  } else {
    console.log('⚠ Some verse lists failed to generate.');
    process.exit(1);
  }
}

/**
 * Alternative: Generate verse lists from structure (if data not available)
 */
function generateFromStructure(outputDir) {
  console.log('='.repeat(60));
  console.log('Generating Verse Lists from Structure');
  console.log('='.repeat(60));
  console.log('');
  console.log('This function generates verse references from known scripture structure.');
  console.log('Note: This generates references only, not verse text.');
  console.log('');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Book of Mormon structure (example)
  const bookOfMormonStructure = {
    '1 Nephi': { chapters: 22 },
    '2 Nephi': { chapters: 33 },
    'Jacob': { chapters: 7 },
    'Enos': { chapters: 1 },
    'Jarom': { chapters: 1 },
    'Omni': { chapters: 1 },
    'Words of Mormon': { chapters: 1 },
    'Mosiah': { chapters: 29 },
    'Alma': { chapters: 63 },
    'Helaman': { chapters: 16 },
    '3 Nephi': { chapters: 30 },
    '4 Nephi': { chapters: 1 },
    'Mormon': { chapters: 9 },
    'Ether': { chapters: 15 },
    'Moroni': { chapters: 10 }
  };
  
  const verses = [];
  
  for (const [book, info] of Object.entries(bookOfMormonStructure)) {
    for (let chapter = 1; chapter <= info.chapters; chapter++) {
      // Estimate verses per chapter (varies, but average ~30)
      const estimatedVerses = 30;
      for (let verse = 1; verse <= estimatedVerses; verse++) {
        verses.push({
          reference: `${book} ${chapter}:${verse}`,
          text: '' // No text available
        });
      }
    }
  }
  
  const outputFile = path.join(outputDir, 'book-of-mormon.json');
  fs.writeFileSync(outputFile, JSON.stringify(verses, null, 2), 'utf8');
  
  console.log(`Generated ${verses.length} verse references for Book of Mormon`);
  console.log('Note: This is a placeholder. Use actual data from LDS Documentation Project for complete data.');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node convert-lds-data.js <input-file> [output-dir]');
    console.log('');
    console.log('Options:');
    console.log('  <input-file>  Path to LDS Documentation Project data file (JSON or CSV)');
    console.log('  [output-dir]  Output directory (default: verses/)');
    console.log('');
    console.log('Example:');
    console.log('  node convert-lds-data.js lds-scriptures.json verses/');
    console.log('');
    console.log('Alternative (structure-based):');
    console.log('  node convert-lds-data.js --structure [output-dir]');
    process.exit(1);
  }
  
  if (args[0] === '--structure') {
    const outputDir = args[1] || 'verses';
    generateFromStructure(outputDir);
  } else {
    const inputFile = args[0];
    const outputDir = args[1] || 'verses';
    processInputFile(inputFile, outputDir);
  }
}

module.exports = {
  processInputFile,
  parseJSONFile,
  parseCSVFile,
  convertVerse,
  getVolumeFromBook,
  VOLUME_MAPPINGS
};


/**
 * Verse List Generation Script
 * 
 * This script queries the Open Scripture API to generate verse list files
 * for each volume (Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price).
 * 
 * Usage: node generate-verse-lists.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // API configuration (to be updated after API research)
  apiBaseUrl: null, // Will be set from API_RESEARCH.md or environment
  apiEndpointPattern: null, // Will be determined from API research
  
  // Rate limiting
  delayBetweenRequests: 500, // milliseconds between API calls
  delayBetweenVolumes: 2000, // milliseconds between volumes
  
  // Output directory
  outputDir: path.join(__dirname, 'verses'),
  
  // Volume definitions
  volumes: [
    {
      name: 'bible',
      displayName: 'Bible',
      file: 'bible.json',
      books: [
        // Will be populated from API or predefined list
        // Example: 'Genesis', 'Exodus', 'Leviticus', ...
      ]
    },
    {
      name: 'bookOfMormon',
      displayName: 'Book of Mormon',
      file: 'book-of-mormon.json',
      books: [
        '1 Nephi', '2 Nephi', 'Jacob', 'Enos', 'Jarom', 'Omni',
        'Words of Mormon', 'Mosiah', 'Alma', 'Helaman', '3 Nephi',
        '4 Nephi', 'Mormon', 'Ether', 'Moroni'
      ]
    },
    {
      name: 'doctrineAndCovenants',
      displayName: 'Doctrine and Covenants',
      file: 'doctrine-and-covenants.json',
      books: [
        'D&C'
      ]
    },
    {
      name: 'pearlOfGreatPrice',
      displayName: 'Pearl of Great Price',
      file: 'pearl-of-great-price.json',
      books: [
        'Moses', 'Abraham', 'Joseph Smith--Matthew', 'Joseph Smith--History', 'Articles of Faith'
      ]
    }
  ]
};

/**
 * Make HTTP/HTTPS request (promise-based)
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: jsonData });
        } catch (e) {
          // If not JSON, return raw data
          resolve({ status: res.statusCode, headers: res.headers, data: data });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Delay utility for rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load API configuration from API_RESEARCH.md or use defaults
 */
function loadAPIConfig() {
  const researchFile = path.join(__dirname, 'API_RESEARCH.md');
  
  try {
    if (fs.existsSync(researchFile)) {
      const content = fs.readFileSync(researchFile, 'utf8');
      // Try to extract API info from the markdown file
      // This is a simple parser - can be enhanced
      const baseUrlMatch = content.match(/Base URL[:\s]+(https?:\/\/[^\s]+)/i);
      const endpointMatch = content.match(/Endpoint[:\s]+([^\n]+)/i);
      
      if (baseUrlMatch) {
        CONFIG.apiBaseUrl = baseUrlMatch[1];
      }
      if (endpointMatch) {
        CONFIG.apiEndpointPattern = endpointMatch[1].trim();
      }
    }
  } catch (error) {
    console.warn('Could not load API config from API_RESEARCH.md:', error.message);
  }
  
  // If still not set, use environment variable or default
  CONFIG.apiBaseUrl = CONFIG.apiBaseUrl || process.env.OPEN_SCRIPTURE_API_URL || 'https://api.openscriptureapi.org';
  CONFIG.apiEndpointPattern = CONFIG.apiEndpointPattern || process.env.OPEN_SCRIPTURE_API_PATTERN || null;
}

/**
 * Get volume metadata from API (list of books and chapters)
 * This function will be implemented based on actual API structure
 */
async function getVolumeMetadata(volume) {
  // TODO: Implement based on API research
  // This is a placeholder that will need to be updated
  console.log(`Getting metadata for ${volume.displayName}...`);
  
  // For now, return empty - will be populated from API
  return {
    books: volume.books || []
  };
}

/**
 * Get all chapters for a book from API
 */
async function getBookChapters(volume, book) {
  // TODO: Implement based on API research
  // Placeholder - will query API for chapter list
  console.log(`  Getting chapters for ${book}...`);
  
  // Return empty array for now - will be populated from API
  return [];
}

/**
 * Get all verses for a book/chapter from API
 */
async function getChapterVerses(volume, book, chapter) {
  // TODO: Implement based on API research
  // Placeholder - will query API for verse count
  console.log(`    Getting verses for ${book} ${chapter}...`);
  
  // Return empty array for now - will be populated from API
  return [];
}

/**
 * Fetch all verses for a volume
 */
async function fetchAllVersesForVolume(volume) {
  console.log(`\nFetching verses for ${volume.displayName}...`);
  const verses = [];
  
  try {
    const metadata = await getVolumeMetadata(volume);
    
    for (const book of metadata.books) {
      await delay(CONFIG.delayBetweenRequests);
      
      const chapters = await getBookChapters(volume, book);
      
      for (const chapter of chapters) {
        await delay(CONFIG.delayBetweenRequests);
        
        const chapterVerses = await getChapterVerses(volume, book, chapter);
        
        for (const verse of chapterVerses) {
          verses.push(`${book} ${chapter}:${verse}`);
        }
      }
    }
    
    console.log(`  Found ${verses.length} verses for ${volume.displayName}`);
    return verses;
  } catch (error) {
    console.error(`  Error fetching verses for ${volume.displayName}:`, error.message);
    throw error;
  }
}

/**
 * Alternative: Generate verse list from known book/chapter/verse structure
 * This can be used if API doesn't provide metadata endpoints
 */
async function generateVerseListFromStructure(volume) {
  console.log(`\nGenerating verse list for ${volume.displayName} from structure...`);
  const verses = [];
  
  // This is a fallback method that generates verse references
  // based on known scripture structure
  // Will need to be populated with actual book/chapter/verse counts
  
  // Example structure (to be filled with actual data):
  const structure = {
    'bookOfMormon': {
      '1 Nephi': { chapters: 22, maxVerses: 30 },
      '2 Nephi': { chapters: 33, maxVerses: 30 },
      // ... more books
    },
    // ... more volumes
  };
  
  // For now, return empty - this will be implemented based on API or manual data
  console.log(`  Structure-based generation not yet implemented`);
  return verses;
}

/**
 * Save verse list to JSON file
 */
function saveVerseList(volume, verses) {
  const filePath = path.join(CONFIG.outputDir, volume.file);
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    // Write JSON file with pretty formatting
    const jsonContent = JSON.stringify(verses, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
    
    console.log(`  ✓ Saved ${verses.length} verses to ${volume.file}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error saving ${volume.file}:`, error.message);
    return false;
  }
}

/**
 * Verify generated verse list file
 */
function verifyVerseList(volume) {
  const filePath = path.join(CONFIG.outputDir, volume.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`  ✗ File not found: ${volume.file}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const verses = JSON.parse(content);
    
    if (!Array.isArray(verses)) {
      console.error(`  ✗ Invalid format: ${volume.file} is not an array`);
      return false;
    }
    
    if (verses.length === 0) {
      console.warn(`  ⚠ Warning: ${volume.file} is empty`);
      return false;
    }
    
    // Verify verse format (simple string)
    const invalidVerses = verses.filter(v => typeof v !== 'string' || !v.includes(':'));
    if (invalidVerses.length > 0) {
      console.warn(`  ⚠ Warning: ${invalidVerses.length} invalid verse format(s) in ${volume.file}`);
    }
    
    console.log(`  ✓ Verified ${volume.file}: ${verses.length} verses, all valid format`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error verifying ${volume.file}:`, error.message);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Verse List Generation Script');
  console.log('='.repeat(60));
  console.log('');
  
  // Load API configuration
  loadAPIConfig();
  
  if (!CONFIG.apiBaseUrl) {
    console.error('Error: API base URL not configured.');
    console.error('Please run API research script first or set OPEN_SCRIPTURE_API_URL environment variable.');
    process.exit(1);
  }
  
  console.log(`API Base URL: ${CONFIG.apiBaseUrl}`);
  if (CONFIG.apiEndpointPattern) {
    console.log(`API Endpoint Pattern: ${CONFIG.apiEndpointPattern}`);
  }
  console.log('');
  
  const results = {
    success: [],
    failed: []
  };
  
  // Process each volume
  for (const volume of CONFIG.volumes) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${volume.displayName}`);
      console.log('='.repeat(60));
      
      // Try to fetch verses from API
      let verses = [];
      
      try {
        verses = await fetchAllVersesForVolume(volume);
      } catch (apiError) {
        console.warn(`  API fetch failed, trying structure-based generation...`);
        verses = await generateVerseListFromStructure(volume);
      }
      
      if (verses.length === 0) {
        console.warn(`  ⚠ No verses found for ${volume.displayName}`);
        results.failed.push({ volume: volume.displayName, reason: 'No verses found' });
        continue;
      }
      
      // Save verse list
      const saved = saveVerseList(volume, verses);
      
      if (saved) {
        // Verify the file
        const verified = verifyVerseList(volume);
        
        if (verified) {
          results.success.push(volume.displayName);
        } else {
          results.failed.push({ volume: volume.displayName, reason: 'Verification failed' });
        }
      } else {
        results.failed.push({ volume: volume.displayName, reason: 'Save failed' });
      }
      
      // Delay between volumes
      if (volume !== CONFIG.volumes[CONFIG.volumes.length - 1]) {
        await delay(CONFIG.delayBetweenVolumes);
      }
    } catch (error) {
      console.error(`\n✗ Error processing ${volume.displayName}:`, error.message);
      results.failed.push({ volume: volume.displayName, reason: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Generation Summary');
  console.log('='.repeat(60));
  console.log(`Successfully generated: ${results.success.length} volume(s)`);
  results.success.forEach(vol => console.log(`  ✓ ${vol}`));
  
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
    console.log('⚠ Some verse lists failed to generate. Check errors above.');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  makeRequest,
  delay,
  fetchAllVersesForVolume,
  generateVerseListFromStructure,
  saveVerseList,
  verifyVerseList,
  getVolumeMetadata,
  getBookChapters,
  getChapterVerses,
  CONFIG
};


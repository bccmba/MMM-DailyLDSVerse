/**
 * API Research Test Script
 * 
 * This script tests the Open Scripture API to understand:
 * - Base URL and endpoint structure
 * - Request/response format
 * - Supported volumes (Bible, Book of Mormon, D&C, Pearl of Great Price)
 * - Rate limiting and authentication requirements
 */

const https = require('https');
const http = require('http');

// Test configurations
const TEST_VERSES = [
  { volume: 'Bible', reference: 'John 3:16', book: 'John', chapter: 3, verse: 16 },
  { volume: 'Book of Mormon', reference: '1 Nephi 3:7', book: '1 Nephi', chapter: 3, verse: 7 },
  { volume: 'Doctrine and Covenants', reference: 'D&C 1:1', book: 'D&C', chapter: 1, verse: 1 },
  { volume: 'Pearl of Great Price', reference: 'Moses 1:1', book: 'Moses', chapter: 1, verse: 1 }
];

// Possible API base URLs to test
const API_BASE_URLS = [
  'https://api.openscriptureapi.org',
  'https://openscriptureapi.org',
  'https://scriptures.byu.edu'
];

/**
 * Make HTTP request (promise-based)
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Test API endpoint patterns
 */
async function testEndpointPatterns(baseUrl, verse) {
  const patterns = [
    `${baseUrl}/verses/${verse.book}/${verse.chapter}/${verse.verse}`,
    `${baseUrl}/verses?book=${encodeURIComponent(verse.book)}&chapter=${verse.chapter}&verse=${verse.verse}`,
    `${baseUrl}/api/verses/${verse.book}/${verse.chapter}/${verse.verse}`,
    `${baseUrl}/api/verses?book=${encodeURIComponent(verse.book)}&chapter=${verse.chapter}&verse=${verse.verse}`,
    `${baseUrl}/scriptures/${verse.book}/${verse.chapter}/${verse.verse}`,
    `${baseUrl}/lds/verses/${verse.book}/${verse.chapter}/${verse.verse}`
  ];
  
  const results = [];
  
  for (const pattern of patterns) {
    try {
      console.log(`Testing: ${pattern}`);
      const response = await makeRequest(pattern);
      results.push({
        pattern,
        success: response.status === 200,
        status: response.status,
        hasData: !!response.data,
        contentType: response.headers['content-type']
      });
      
      if (response.status === 200) {
        console.log(`  ✓ Success! Status: ${response.status}`);
        console.log(`  Response sample:`, JSON.stringify(response.data).substring(0, 200));
        return { baseUrl, workingPattern: pattern, response };
      }
    } catch (error) {
      results.push({
        pattern,
        success: false,
        error: error.message
      });
      console.log(`  ✗ Failed: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return { baseUrl, results, workingPattern: null };
}

/**
 * Main test function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Open Scripture API Research Test');
  console.log('='.repeat(60));
  console.log('');
  
  const findings = {
    baseUrl: null,
    endpointPattern: null,
    responseFormat: null,
    supportedVolumes: [],
    rateLimiting: null,
    authentication: null,
    testResults: []
  };
  
  // Test with Book of Mormon verse first (most likely to work)
  const testVerse = TEST_VERSES[1]; // 1 Nephi 3:7
  
  for (const baseUrl of API_BASE_URLS) {
    console.log(`\nTesting base URL: ${baseUrl}`);
    console.log('-'.repeat(60));
    
    const result = await testEndpointPatterns(baseUrl, testVerse);
    
    if (result.workingPattern) {
      findings.baseUrl = result.baseUrl;
      findings.endpointPattern = result.workingPattern;
      findings.responseFormat = result.response.data;
      console.log(`\n✓ Found working endpoint: ${result.workingPattern}`);
      break;
    }
  }
  
  // If we found a working endpoint, test all volumes
  if (findings.endpointPattern) {
    console.log('\n' + '='.repeat(60));
    console.log('Testing all volumes...');
    console.log('='.repeat(60));
    
    for (const verse of TEST_VERSES) {
      console.log(`\nTesting ${verse.volume}: ${verse.reference}`);
      try {
        // Replace the test verse in the pattern
        const testUrl = findings.endpointPattern
          .replace('1 Nephi', verse.book)
          .replace('3', verse.chapter.toString())
          .replace('7', verse.verse.toString());
        
        const response = await makeRequest(testUrl);
        findings.supportedVolumes.push({
          volume: verse.volume,
          supported: response.status === 200,
          status: response.status
        });
        
        if (response.status === 200) {
          console.log(`  ✓ ${verse.volume} is supported`);
        } else {
          console.log(`  ✗ ${verse.volume} returned status ${response.status}`);
        }
      } catch (error) {
        console.log(`  ✗ ${verse.volume} error: ${error.message}`);
        findings.supportedVolumes.push({
          volume: verse.volume,
          supported: false,
          error: error.message
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } else {
    console.log('\n✗ No working endpoint found. Manual API research required.');
    console.log('Please check: https://openscriptureapi.org for documentation');
  }
  
  // Output findings
  console.log('\n' + '='.repeat(60));
  console.log('API Research Findings');
  console.log('='.repeat(60));
  console.log(JSON.stringify(findings, null, 2));
  
  return findings;
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, testEndpointPatterns, makeRequest };


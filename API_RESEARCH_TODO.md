# API Research - What Remains To Be Done

## Current Status

The API research script (`tests/api-research.test.js`) has been created and is ready to run, but **has not been executed yet** because it requires:
1. Node.js installed and available
2. Network access to test API endpoints

## What Needs To Be Done

### Step 1: Run the API Research Script

Execute the research script:
```bash
node tests/api-research.test.js
```

This script will:
- Test multiple possible API base URLs
- Test various endpoint patterns
- Attempt to fetch sample verses from each volume
- Document findings automatically

### Step 2: Document Findings

The script will output findings, but you need to manually update `API_RESEARCH.md` with:

#### Required Information:

1. **Base URL** ✅
   - The actual working API base URL
   - Example: `https://api.openscriptureapi.org`

2. **Endpoint Pattern** ✅
   - How to construct the API endpoint
   - Examples:
     - `/verses/{book}/{chapter}/{verse}`
     - `/verses?book={book}&chapter={chapter}&verse={verse}`
     - `/api/verses/{book}/{chapter}/{verse}`

3. **Request Format** ✅
   - How to format requests
   - URL encoding requirements
   - Query parameters vs path parameters

4. **Response Format** ✅
   - Structure of API response
   - Where verse text is located
   - Where reference is located
   - Example response structure

5. **Supported Volumes** ✅
   - Verify all four volumes work:
     - [ ] Bible (KJV)
     - [ ] Book of Mormon
     - [ ] Doctrine and Covenants
     - [ ] Pearl of Great Price

6. **Rate Limiting** ✅
   - Any rate limits?
   - Requests per minute/hour?
   - Error responses for rate limiting?

7. **Authentication** ✅
   - Required? (API keys, tokens, etc.)
   - How to authenticate?
   - Headers needed?

8. **Example Requests** ✅
   - Working examples for each volume
   - Example URLs that work
   - Example responses

## What Happens After API Research

Once `API_RESEARCH.md` is populated with the above information:

1. **Automatic Configuration**: The `node_helper.js` will automatically load the API configuration from `API_RESEARCH.md`

2. **Verse List Generation**: The `generate-verse-lists.js` script will be able to:
   - Query the API for all verses
   - Generate the verse list JSON files
   - Create `verses/bible.json`
   - Create `verses/book-of-mormon.json`
   - Create `verses/doctrine-and-covenants.json`
   - Create `verses/pearl-of-great-price.json`

3. **Module Functionality**: The module will be able to:
   - Fetch verses from the API
   - Display daily verses
   - Handle API responses correctly

## Current Code Status

### What's Ready:
- ✅ API research script created
- ✅ API configuration loading code ready
- ✅ API request code ready (just needs endpoint)
- ✅ Response parsing code ready (handles multiple formats)
- ✅ Error handling ready
- ✅ Retry logic ready

### What's Waiting:
- ⏳ Actual API endpoint discovery
- ⏳ Response format verification
- ⏳ Rate limiting information
- ⏳ Authentication requirements (if any)

## Manual Research Alternative

If the automated script doesn't work, you can manually research:

1. **Visit Open Scripture API website**: https://openscriptureapi.org
2. **Check documentation** for:
   - API endpoints
   - Request/response formats
   - Authentication requirements
   - Rate limits
3. **Test endpoints manually** using curl or Postman
4. **Update API_RESEARCH.md** with findings

## Example API_RESEARCH.md Format

After research, `API_RESEARCH.md` should look like:

```markdown
## Base URL
https://api.openscriptureapi.org

## Endpoint Structure
/verses/{book}/{chapter}/{verse}

## Request Format
GET https://api.openscriptureapi.org/verses/1%20Nephi/3/7

## Response Format
{
  "text": "And it came to pass...",
  "reference": "1 Nephi 3:7",
  "book": "1 Nephi",
  "chapter": 3,
  "verse": 7
}

## Supported Volumes
- [x] Bible (KJV)
- [x] Book of Mormon
- [x] Doctrine and Covenants
- [x] Pearl of Great Price

## Rate Limiting
No rate limiting detected (or: 100 requests per minute)

## Authentication
None required (or: API key in header)

## Example Requests
- Bible: https://api.openscriptureapi.org/verses/John/3/16
- Book of Mormon: https://api.openscriptureapi.org/verses/1%20Nephi/3/7
- D&C: https://api.openscriptureapi.org/verses/D%26C/1/1
- Pearl: https://api.openscriptureapi.org/verses/Moses/1/1
```

## Next Steps

1. **Run the research script** (when Node.js and network are available):
   ```bash
   node tests/api-research.test.js
   ```

2. **Review the output** and update `API_RESEARCH.md`

3. **Test with a sample verse** to verify the format

4. **Generate verse lists**:
   ```bash
   node generate-verse-lists.js
   ```

5. **Test the module** in Magic Mirror

## Summary

**What's Done**: ✅
- Research script created
- Code ready to use API
- Configuration loading ready

**What's Needed**: ⏳
- Run the research script
- Document API endpoints
- Verify all volumes work
- Update API_RESEARCH.md

Once the API research is complete and `API_RESEARCH.md` is populated, the module will be fully functional!


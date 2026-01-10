# API Alternatives - Open Scripture API Not Found

## Issue

The automated API research script found that `api.openscriptureapi.org` does not exist (DNS error: ENOTFOUND). This means we need to find an alternative source for LDS scripture data.

## Alternative Options

### Option 1: LDS Documentation Project (Recommended)

**URL**: https://scriptures.nephi.org

**What it provides**:
- Downloadable database files in multiple formats:
  - SQL (MySQL, PostgreSQL, SQLite)
  - JSON
  - CSV
  - XML

**How to use**:
1. Download the scripture database files
2. Extract verse data
3. Generate verse list JSON files locally
4. Use local files instead of API calls

**Advantages**:
- ✅ No API rate limiting
- ✅ Works offline
- ✅ Complete control over data
- ✅ No network dependency
- ✅ Faster (no API calls)

**Implementation**:
- Modify `generate-verse-lists.js` to read from downloaded database files
- Or create a script to convert database files to our JSON format

### Option 2: BYU Scriptures

**URL**: https://scriptures.byu.edu

**Status**: Unknown - needs manual verification
- May have REST API endpoints
- May require authentication
- May have rate limiting

**Action Required**: Manual research needed

### Option 3: Church Website

**URL**: https://www.churchofjesuschrist.org

**Status**: Unknown - needs manual verification
- May have internal API
- May require authentication
- May have usage restrictions

**Action Required**: Manual research needed

### Option 4: Build Verse Lists Manually

**Approach**: Create verse list JSON files manually or from known scripture structure

**How**:
1. Use known book/chapter/verse counts
2. Generate all verse references programmatically
3. Save to JSON files
4. Module uses local files (no API needed)

**Advantages**:
- ✅ No API dependency
- ✅ Works offline
- ✅ Fast

**Disadvantages**:
- ⚠️ Requires manual verse text (if needed)
- ⚠️ Large files to maintain

## Recommended Solution

**Use LDS Documentation Project (Option 1)** because:
1. Provides complete scripture data
2. Multiple format options
3. No API dependency
4. Can work offline
5. Matches original spec mention of "LDS Documentation Project"

## Implementation Plan

### Step 1: Download Data from LDS Documentation Project

1. Visit https://scriptures.nephi.org
2. Download scripture database files (JSON format recommended)
3. Save to project directory

### Step 2: Create Conversion Script

Create a script to:
1. Read downloaded database files
2. Extract verse references
3. Generate verse list JSON files in our format:
   ```json
   [
     "1 Nephi 1:1",
     "1 Nephi 1:2",
     ...
   ]
   ```

### Step 3: Update Module

Two options:

**Option A: Use Local Files Only (No API)**
- Remove API dependency
- Module reads from local verse list files
- No verse text fetching needed (if verse text not required)
- Or: Include verse text in JSON files

**Option B: Hybrid Approach**
- Use local verse lists for verse selection
- Fetch verse text from API (if available) or use local text

## Next Steps

1. **Visit LDS Documentation Project**: https://scriptures.nephi.org
2. **Download database files** (JSON format)
3. **Create conversion script** to generate verse list files
4. **Update generate-verse-lists.js** to use local data
5. **Test verse list generation**

## Updated Approach

Since there's no working public API, the module should:

1. **Use Local Verse Lists**: Pre-generated JSON files with all verse references
2. **Optional Verse Text**: 
   - Include verse text in JSON files (larger files)
   - Or display only references (simpler)
   - Or fetch from alternative source if found

## Action Items

- [ ] Visit https://scriptures.nephi.org
- [ ] Download scripture database files
- [ ] Create script to convert to our JSON format
- [ ] Generate verse list files
- [ ] Update module to use local files
- [ ] Test module functionality

## Notes

The original spec mentioned "Open Scripture API" but this appears to not exist as a public API. The LDS Documentation Project (scriptures.nephi.org) was also mentioned in the spec as an alternative, which is the recommended approach.


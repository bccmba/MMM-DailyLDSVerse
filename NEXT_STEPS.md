# Next Steps - After API Research

## Current Situation

The API research revealed that **Open Scripture API does not exist** as a public API. The domain `api.openscriptureapi.org` returns DNS errors.

## Recommended Solution: Use LDS Documentation Project

Since there's no working public API, we should use the **LDS Documentation Project** (https://scriptures.nephi.org) which provides downloadable database files.

## Implementation Options

### Option 1: Local Verse Lists Only (Simplest)

**Approach**: Generate verse list JSON files from LDS Documentation Project data, module uses local files only.

**Steps**:
1. Download scripture database from https://scriptures.nephi.org
2. Create conversion script to extract verse references
3. Generate verse list JSON files
4. Module reads from local files (no API calls)

**Pros**:
- ✅ No API dependency
- ✅ Works offline
- ✅ Fast
- ✅ Simple

**Cons**:
- ⚠️ Verse text not included (only references)
- ⚠️ Or: Include verse text in JSON (larger files)

### Option 2: Local Lists + Optional Text Display

**Approach**: Use local verse lists for selection, display only references (no verse text).

**Steps**:
1. Generate verse list files with references only
2. Module displays: "1 Nephi 3:7" (reference only)
3. No verse text needed

**Pros**:
- ✅ Simple
- ✅ Small files
- ✅ Fast

**Cons**:
- ⚠️ No verse text displayed (only reference)

### Option 3: Local Lists + Verse Text in Files

**Approach**: Include verse text in JSON files along with references.

**Steps**:
1. Download scripture database
2. Create JSON files with both reference and text:
   ```json
   [
     {
       "reference": "1 Nephi 3:7",
       "text": "And it came to pass..."
     },
     ...
   ]
   ```
3. Module reads from local files

**Pros**:
- ✅ Complete verse display
- ✅ No API needed
- ✅ Works offline

**Cons**:
- ⚠️ Larger file sizes
- ⚠️ More complex data structure

## Recommended: Option 1 or 3

I recommend **Option 3** (local lists with verse text) because:
- Users expect to see verse text, not just references
- File sizes are manageable
- No API dependency
- Works offline

## Immediate Next Steps

1. **Visit LDS Documentation Project**: https://scriptures.nephi.org
2. **Download database files** (JSON format preferred)
3. **Create conversion script** to:
   - Read downloaded database
   - Extract verse references and text
   - Generate our JSON format
4. **Generate verse list files**
5. **Update module** to read from local files (remove API dependency)

## Code Changes Needed

### For Option 3 (Recommended):

1. **Update `generate-verse-lists.js`**:
   - Remove API calls
   - Add function to read LDS Documentation Project files
   - Generate JSON with reference + text

2. **Update `node_helper.js`**:
   - Remove API fetching code
   - Read verse text from local JSON files
   - No API calls needed

3. **Update `MMM-DailyLDSVerse.js`**:
   - No changes needed (already handles local data)

## Alternative: Manual Verse List Creation

If downloading from LDS Documentation Project is not feasible:

1. Create verse list files manually with known verse references
2. Use structure-based generation (already in code)
3. Populate with curated verses

## Summary

**Current Status**: ❌ No working public API found

**Recommended Path**: ✅ Use LDS Documentation Project data files

**Action Required**: 
1. Download data from scriptures.nephi.org
2. Create conversion script
3. Generate verse list files
4. Update module to use local files

The module architecture already supports local files - we just need to generate them from the LDS Documentation Project data instead of an API.


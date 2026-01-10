# Open Scripture API Research

This document tracks findings from API research and testing.

## Research Date
2024 (Test run completed)

## Finding: Open Scripture API Does Not Exist

**Result**: The domain `api.openscriptureapi.org` does not exist (DNS error: ENOTFOUND).

**Tested URLs**:
- ❌ `https://api.openscriptureapi.org` - Domain does not exist
- ❌ `https://openscriptureapi.org` - No API endpoints found
- ⏳ `https://scriptures.byu.edu` - Needs manual verification
- ⏳ `https://www.churchofjesuschrist.org` - Needs manual verification

## Base URL
**Status**: No working public API found

## Endpoint Structure
**Status**: Not available (API does not exist)

## Request Format
**Status**: Not available (API does not exist)

## Response Format
**Status**: Not available (API does not exist)

## Supported Volumes
**Status**: Cannot verify (API does not exist)
- [ ] Bible (KJV)
- [ ] Book of Mormon
- [ ] Doctrine and Covenants
- [ ] Pearl of Great Price

## Rate Limiting
**Status**: Not applicable (API does not exist)

## Authentication
**Status**: Not applicable (API does not exist)

## Example Requests
**Status**: No working examples (API does not exist)

## Recommended Alternative: LDS Documentation Project

Since Open Scripture API does not exist, use the **LDS Documentation Project**:

**URL**: https://scriptures.nephi.org

**What it provides**:
- Downloadable database files (SQL, JSON, CSV, XML)
- Complete LDS scripture data
- No API rate limiting
- Works offline

**Implementation**:
1. Download database files from https://scriptures.nephi.org
2. Convert to our JSON format using a conversion script
3. Generate verse list files locally
4. Module uses local files (no API needed)

See `API_ALTERNATIVES.md` for detailed implementation plan.

## Notes

- Open Scripture API mentioned in spec does not exist as a public API
- LDS Documentation Project (scriptures.nephi.org) was also mentioned in spec as alternative
- Recommended approach: Use LDS Documentation Project data files
- Module can work with local verse list files (no API dependency)
- Verse text can be included in JSON files or fetched separately if needed


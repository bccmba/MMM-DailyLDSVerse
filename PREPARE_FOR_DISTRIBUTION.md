# Preparing Verse Lists for Distribution

## Goal

Generate the verse list files from LDS Documentation Project data and include them in the repository so users don't need to download/convert data themselves.

## Steps

### 1. Run the Conversion

You have the LDS scriptures data downloaded. Run the conversion:

```bash
cd /Users/bchristensen/MMM-DailyVerseOfTheDayLDS
node convert-lds-data.js /Users/bchristensen/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt verses/
```

Or use the setup script:

```bash
./setup-verse-lists.sh /Users/bchristensen/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt
```

### 2. Verify Generated Files

Check that all four files were created:

```bash
ls -lh verses/*.json
```

You should see:
- `verses/bible.json`
- `verses/book-of-mormon.json`
- `verses/doctrine-and-covenants.json`
- `verses/pearl-of-great-price.json`

### 3. Verify File Sizes

The files should be substantial (containing all verses):
- `bible.json` - Should be largest (Old + New Testament)
- `book-of-mormon.json` - Should be large
- `doctrine-and-covenants.json` - Medium size
- `pearl-of-great-price.json` - Smallest

### 4. Test the Files

Quick test to verify format:

```bash
# Check first verse in Book of Mormon
head -20 verses/book-of-mormon.json

# Should show something like:
# [
#   {
#     "reference": "1 Nephi 1:1",
#     "text": "I, Nephi, having been born..."
#   },
#   ...
```

### 5. Commit to Repository

Once verified, commit the verse list files:

```bash
git add verses/*.json
git commit -m "Add pre-generated verse list files from LDS Documentation Project"
```

### 6. Update .gitignore (Already Done)

The `.gitignore` has been updated to allow verse files to be committed.

## Result

After these steps:
- ✅ Verse list files are included in the repository
- ✅ Users can install and use the module immediately
- ✅ No download/conversion step needed for end users
- ✅ Module works out of the box

## File Sizes

The verse list files will be large (several MB each) because they contain:
- All verse references
- Full verse text for each verse

This is acceptable because:
- Users get complete functionality immediately
- No API dependency
- Works offline
- Faster than API calls

## Alternative: Reference-Only Files

If file sizes are a concern, you could generate reference-only files (smaller, but no verse text):

The current conversion includes both reference and text, which is recommended for best user experience.

## Notes

- The verse files are generated from public domain data (LDS Documentation Project)
- Files can be safely committed to the repository
- Users will get the verse lists automatically when they clone/install
- Files can be regenerated anytime if needed


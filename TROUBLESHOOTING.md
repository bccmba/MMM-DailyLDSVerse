# Troubleshooting Guide

## Error: "No verses available for volume"

### Symptoms
- Module shows "Unable to load" error
- Error message: `No verses available for volume: bookOfMormon` (or other volume)
- Module doesn't display any verse

### Cause
The verse list JSON files are missing or empty in the `verses/` directory.

### Solution

#### Step 1: Check if verse files exist

```bash
cd ~/MagicMirror/modules/MMM-DailyLDSVerse
ls -la verses/
```

You should see 4 files:
- `bible.json`
- `book-of-mormon.json`
- `doctrine-and-covenants.json`
- `pearl-of-great-price.json`

#### Step 2: If files are missing, generate them

1. **Download LDS Scriptures Data**:
   - Visit: https://scriptures.nephi.org
   - Click "Download"
   - Extract the ZIP file
   - Locate: `json/lds-scriptures-json.txt`

2. **Run the conversion script**:
   ```bash
   cd ~/MagicMirror/modules/MMM-DailyLDSVerse
   node convert-lds-data.js ~/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt verses/
   ```

3. **Verify files were created**:
   ```bash
   ls -lh verses/*.json
   ```

   You should see all 4 files with substantial sizes (several MB each).

#### Step 3: Check Magic Mirror logs

After generating files, restart Magic Mirror and check the logs. You should see:

```
[MMM-DailyLDSVerse] Loaded X verses (with text) from bible.json
[MMM-DailyLDSVerse] Loaded X verses (with text) from book-of-mormon.json
[MMM-DailyLDSVerse] Loaded X verses (with text) from doctrine-and-covenants.json
[MMM-DailyLDSVerse] Loaded X verses (with text) from pearl-of-great-price.json
[MMM-DailyLDSVerse] Successfully loaded verse lists for all 4 volumes.
```

### Quick Fix

If you just want to test the module quickly, you can create placeholder files:

```bash
cd ~/MagicMirror/modules/MMM-DailyLDSVerse
mkdir -p verses
echo '["1 Nephi 3:7"]' > verses/book-of-mormon.json
echo '["John 3:16"]' > verses/bible.json
echo '["D&C 1:1"]' > verses/doctrine-and-covenants.json
echo '["Moses 1:1"]' > verses/pearl-of-great-price.json
```

**Note**: This creates minimal files with only one verse each. For full functionality, use the conversion script above.

## Other Common Issues

### Module shows "Loading verse..." indefinitely

**Cause**: Verse list files exist but are empty or malformed.

**Solution**:
1. Check file sizes: `ls -lh verses/*.json`
2. Verify JSON format: `head -5 verses/book-of-mormon.json`
3. Regenerate files using conversion script

### Module shows "Unable to load scripture verse"

**Cause**: Error in verse selection or file format.

**Solution**:
1. Check Magic Mirror logs for detailed error
2. Verify JSON files are valid: `node -e "console.log(JSON.parse(require('fs').readFileSync('verses/book-of-mormon.json')))"`
3. Regenerate files if corrupted

### Files exist but module still shows error

**Possible causes**:
1. File permissions - ensure files are readable
2. JSON format - verify files are valid JSON arrays
3. File encoding - ensure files are UTF-8

**Solution**:
```bash
# Check permissions
ls -la verses/

# Fix permissions if needed
chmod 644 verses/*.json

# Verify JSON format
node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('verses/book-of-mormon.json')); console.log('Valid JSON,', d.length, 'items')"
```

## Getting Help

If you continue to have issues:

1. Check Magic Mirror logs for detailed error messages
2. Verify all files are in place and have correct format
3. Try regenerating verse lists from scratch
4. Open an issue on GitHub with:
   - Error message from logs
   - Output of `ls -la verses/`
   - Output of `head -20 verses/book-of-mormon.json`


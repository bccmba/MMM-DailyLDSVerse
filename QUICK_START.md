# Quick Start - Generate Verse Lists

## You Have the Data - Let's Convert It!

You've downloaded the LDS scriptures data. Now let's convert it to verse list files that can be included in the repository.

## Run the Conversion

Execute this command in your terminal:

```bash
cd /Users/bchristensen/MMM-DailyVerseOfTheDayLDS
node convert-lds-data.js /Users/bchristensen/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt verses/
```

Or use the setup script:

```bash
./setup-verse-lists.sh /Users/bchristensen/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt
```

## What Happens

The script will:
1. Read the LDS scriptures JSON file
2. Parse all verses
3. Organize by volume (Bible, Book of Mormon, D&C, Pearl of Great Price)
4. Generate 4 JSON files in `verses/` directory:
   - `bible.json`
   - `book-of-mormon.json`
   - `doctrine-and-covenants.json`
   - `pearl-of-great-price.json`

## Expected Output

You should see output like:

```
============================================================
LDS Documentation Project Data Converter
============================================================

Reading input file: /Users/bchristensen/Downloads/...
Found 419951 verses in input file

Processed: 419951 verses
Skipped: 0 verses

Volume Statistics:
  Bible: 31102
  Book of Mormon: 6604
  Doctrine and Covenants: 2865
  Pearl of Great Price: 1380

✓ Saved X verses to bible.json
✓ Saved X verses to book-of-mormon.json
✓ Saved X verses to doctrine-and-covenants.json
✓ Saved X verses to pearl-of-great-price.json

✓ All verse lists generated successfully!
```

## After Conversion

1. **Verify files were created**:
   ```bash
   ls -lh verses/*.json
   ```

2. **Check file format** (should have reference and text):
   ```bash
   head -20 verses/book-of-mormon.json
   ```

3. **Commit to repository** (so users get them automatically):
   ```bash
   git add verses/*.json
   git commit -m "Add pre-generated verse list files"
   ```

## Result

Once committed, users can:
- ✅ Clone the repository
- ✅ Use the module immediately
- ✅ No download/conversion step needed
- ✅ Module works out of the box!

The verse list files will be included in the repository, making installation seamless for end users.


# Generating Verse Lists - Quick Start

## Option 1: Pre-Generated Files (Recommended for Users)

The verse list files are **pre-generated and included in this repository**. If you're installing the module, you don't need to generate them - they're already in the `verses/` directory!

**Skip to installation** - the verse lists are ready to use.

## Option 2: Generate Your Own (For Developers)

If you want to regenerate the verse lists from the latest LDS Documentation Project data:

### Quick Setup

1. **Download LDS Scriptures Data**:
   - Visit: https://scriptures.nephi.org
   - Click "Download" 
   - Extract the ZIP file
   - Locate: `json/lds-scriptures-json.txt`

2. **Run Setup Script**:
   ```bash
   ./setup-verse-lists.sh ~/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt
   ```

   Or manually:
   ```bash
   node convert-lds-data.js <path-to-lds-scriptures-json.txt> verses/
   ```

### What Gets Generated

The script generates 4 JSON files in the `verses/` directory:

- `bible.json` - King James Version Bible (Old & New Testament)
- `book-of-mormon.json` - Book of Mormon
- `doctrine-and-covenants.json` - Doctrine and Covenants
- `pearl-of-great-price.json` - Pearl of Great Price

Each file contains an array of verse objects:
```json
[
  {
    "reference": "1 Nephi 3:7",
    "text": "And it came to pass that I, Nephi, said unto my father..."
  },
  ...
]
```

### File Format

The generated files use the format:
- **reference**: Verse reference string (e.g., "1 Nephi 3:7")
- **text**: Verse text (full scripture text)

This format allows the module to display both the reference and the verse text without needing an API.

## For Repository Maintainers

If you're maintaining this repository and want to update the verse lists:

1. Download latest data from https://scriptures.nephi.org
2. Run the conversion script
3. Commit the updated `verses/*.json` files to the repository
4. Users will get the latest verse lists automatically

## Troubleshooting

**File not found**: Make sure you've downloaded and extracted the LDS scriptures ZIP file

**Conversion errors**: Check that the input file is valid JSON and matches the expected format

**Missing volumes**: The script should find all four volumes. If some are missing, check the volume mappings in `convert-lds-data.js`


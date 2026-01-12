# MMM-DailyLDSVerse

A Magic Mirror module that displays a daily scripture verse from LDS scriptures (King James Version Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price).

## Installation

1. Navigate to your Magic Mirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/bccmba/MMM-DailyLDSVerse.git
   ```

3. Navigate to the module directory:
   ```bash
   cd MMM-DailyLDSVerse
   ```

4. Verse lists are pre-generated and included! (No conversion needed)

5. Add the module to your `config/config.js` file:
   ```javascript
   {
     module: "MMM-DailyLDSVerse",
     position: "top_center",
     config: {
       header: "Verse of the day",  // Optional, defaults to "Verse of the day"
       updateInterval: 86400000     // Optional, defaults to daily at midnight
     }
   }
   ```

6. Restart Magic Mirror to load the module.

## Verse Lists

**Good News**: Verse list files are **pre-generated and included** in this repository! You don't need to generate them - they're ready to use in the `verses/` directory.

The module will work immediately after installation.

### Regenerating Verse Lists (Optional)

If you want to regenerate verse lists from the latest LDS Documentation Project data (for example, if new scriptures are added), you can use the conversion script:

### Method 1: Using LDS Documentation Project

The **LDS Documentation Project** (https://scriptures.nephi.org) provides downloadable database files with complete LDS scripture data.

#### Step 1: Download Data

1. Visit https://scriptures.nephi.org
2. Click "Download" to get the ZIP file
3. Extract the ZIP file
4. Locate the JSON file: `json/lds-scriptures-json.txt`

#### Step 2: Convert Data

**Option A: Use the setup script** (easiest):
```bash
chmod +x setup-verse-lists.sh  # Make script executable (first time only)
./setup-verse-lists.sh ~/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt
```

**Option B: Run conversion directly**:
```bash
node convert-lds-data.js <path-to-lds-scriptures-json.txt> verses/
```

This script will:
- Parse the LDS Documentation Project data file
- Extract verse references and text
- Organize verses by volume
- Generate JSON files in the `verses/` directory:
  - `bible.json`
  - `book-of-mormon.json`
  - `doctrine-and-covenants.json`
  - `pearl-of-great-price.json`

#### Output Format

The script generates JSON files with verse data:

```json
[
  {
    "reference": "1 Nephi 3:7",
    "text": "And it came to pass that I, Nephi, said unto my father..."
  },
  {
    "reference": "1 Nephi 3:8",
    "text": "And it came to pass that when my father had heard these words..."
  }
]
```

**Note**: If verse text is not available in the source data, the `text` field will be empty and only the reference will be displayed.

### Method 2: Using generate-verse-lists.js (Deprecated)

The `generate-verse-lists.js` script is deprecated and requires API configuration. It's recommended to use `convert-lds-data.js` instead (Method 1).

**Note**: The module uses local verse list files from the LDS Documentation Project. No API is required for normal operation.

### Method 3: Structure-Based Generation (Placeholder)

For testing purposes, you can generate placeholder verse lists:

```bash
node convert-lds-data.js --structure verses/
```

**Note**: This generates references only (no verse text) and is intended for testing.

### Updating Verse Lists

To update verse lists, simply run the conversion script again with fresh data:

```bash
node convert-lds-data.js lds-scriptures.json verses/
```

The script will overwrite existing files with fresh data.

### Troubleshooting Verse List Generation

- **File not found**: Ensure the input data file exists and path is correct
- **Empty files**: Check that the input file contains verse data in expected format
- **Format errors**: Verify the input file is valid JSON or CSV
- **Missing volumes**: Some volumes may not be found if book names don't match - check volume mappings in `convert-lds-data.js`

## Configuration

### Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `header` | Header text to display above the verse. Set to empty string or `null` to hide the header | `"Verse of the day"` | `"Daily Scripture"` |
| `updateInterval` | Update interval in milliseconds. Set to `0`, `null`, or omit to use midnight updates | `null` (midnight) | `86400000` (24 hours) |

### Configuration Examples

#### Basic Configuration (Midnight Update - Default)
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center"
  // No config needed - updates at midnight by default, shows "Verse of the day" header
}
```

#### Custom Header
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    header: "Daily Scripture"  // Custom header text
  }
}
```

#### Hide Header
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    header: ""  // Empty string hides the header
    // or header: null
  }
}
```

#### Custom Update Interval
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    updateInterval: 86400000  // Update every 24 hours
  }
}
```

#### Common Update Intervals
- `86400000` = 24 hours (1 day)
- `43200000` = 12 hours
- `3600000` = 1 hour
- `1800000` = 30 minutes
- `0` or `null` = Use midnight update (default)

#### Multiple Positions
You can add the module multiple times with different positions:
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_left"
},
{
  module: "MMM-DailyLDSVerse",
  position: "bottom_right",
  config: {
    updateInterval: 43200000  // Update every 12 hours
  }
}
```

### Position Options

The module supports all standard Magic Mirror positions:
- `top_left`, `top_center`, `top_right`
- `upper_third`, `middle_center`, `lower_third`
- `bottom_left`, `bottom_center`, `bottom_right`
- `fullscreen_above`, `fullscreen_below`

See the [Magic Mirror documentation](https://docs.magicmirror.builders/modules/configuration.html#position) for more details.

## Troubleshooting

### Module Not Displaying

1. **Check Magic Mirror logs**: Look for errors in the console or log files
2. **Verify module registration**: Ensure the module name matches exactly: `MMM-DailyLDSVerse`
3. **Check verse list files**: Ensure verse list JSON files exist in the `verses/` directory
4. **Verify verse list format**: Check that JSON files are valid arrays (of strings or objects)

### Verse Not Updating

1. **Check update interval**: Verify your `updateInterval` configuration
2. **Check system time**: Ensure your system clock is correct (midnight updates depend on system time)
3. **Check logs**: Look for update scheduling messages in Magic Mirror logs
4. **Manual refresh**: Restart Magic Mirror to force an immediate update

### Verse Text Not Displaying

1. **Check verse list format**: Verify JSON files contain verse objects with `text` field
2. **Verify file structure**: Verse files should be arrays of objects with `reference` and `text` properties
3. **Check file content**: Use `head verses/book-of-mormon.json` to verify the format
4. **Regenerate if needed**: If files are corrupted, regenerate using `convert-lds-data.js`

### Empty Verse Lists

1. **Verify files exist**: Check that all four JSON files exist in the `verses/` directory
2. **Regenerate verse lists**: If files are missing or empty, run `node convert-lds-data.js <input-file> verses/`
3. **Check file permissions**: Ensure the `verses/` directory is readable
4. **Verify file format**: Check that JSON files are valid JSON arrays
5. **Check file location**: Ensure verse files are in the `verses/` directory

### Common Issues

**Issue**: Module shows "Loading verse..." indefinitely
- **Solution**: Check that verse list files exist and are valid JSON. Restart Magic Mirror.

**Issue**: Module shows "Unable to load scripture verse"
- **Solution**: Check that verse list files exist and contain valid data. Verify JSON format is correct.

**Issue**: Verse doesn't change at midnight
- **Solution**: Check system timezone and ensure Magic Mirror is running at midnight

**Issue**: Module appears but is empty
- **Solution**: Check that verse list files contain data and are properly formatted

## Features

- **Daily Verse Rotation**: Automatically cycles through four volumes (Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price)
- **Verse Variety**: Ensures different verses are shown each day, even for the same volume
- **Automatic Updates**: Updates at midnight (default) or at custom intervals
- **Error Handling**: Graceful error handling for missing files and invalid data
- **Customizable Header**: Display a custom header above the verse (or hide it)
- **Leap Year Support**: Handles leap years correctly (366 days)
- **Minimal Configuration**: Works out of the box with sensible defaults

## How It Works

1. **Verse Selection**: The module uses the day of year (1-366) to select which verse to display
2. **Volume Rotation**: Cycles through the four volumes daily (Day 1 = Bible, Day 2 = Book of Mormon, etc.)
3. **Verse Variety**: Uses a formula to ensure variety - same volume shows different verses on different days
4. **Local Data**: Reads verse data from local JSON files (generated from LDS Documentation Project)
5. **Automatic Updates**: Updates at midnight (default) or at your configured interval

## Development

### Running Tests

```bash
npm test
```

### Test Files

**Unit Tests:**
- `tests/node-helper.test.js` - Core utility function tests
- `tests/node-helper-complete.test.js` - Comprehensive node_helper tests
- `tests/main-module.test.js` - Main module tests
- `tests/configuration.test.js` - Configuration tests
- `tests/validation.test.js` - Functional and data validation tests
- `tests/error-handling.test.js` - Error handling and edge case tests
- `tests/convert-lds-data.test.js` - Verse list conversion tests
- `tests/generate-verse-lists.test.js` - Verse list generation tests (deprecated script)

**Integration Tests:**
- `tests/integration.test.js` - Module and node_helper integration
- `tests/file-system.test.js` - File system operations
- `tests/module-lifecycle.test.js` - Module lifecycle management

**End-to-End Tests:**
- `tests/e2e-flow.test.js` - Complete user flows

**Performance Tests:**
- `tests/performance.test.js` - Performance and load characteristics

**DOM Tests:**
- `tests/dom-rendering.test.js` - DOM structure and rendering

### Running Tests by Category

```bash
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:performance   # Performance tests
npm run test:dom           # DOM rendering tests
```

### Project Structure

```
MMM-DailyLDSVerse/
├── MMM-DailyLDSVerse.js      # Main module (frontend)
├── node_helper.js             # Node helper (backend)
├── generate-verse-lists.js    # Verse list generation script (API-based, deprecated)
├── convert-lds-data.js        # LDS Documentation Project data converter (recommended)
├── package.json               # Module metadata
├── README.md                  # This file
├── config.example.js          # Configuration examples
├── tests/                     # Test files
└── verses/                    # Verse list JSON files (generated)
```

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Credits

- **LDS Documentation Project**: Uses data from the LDS Documentation Project
  - Website: https://scriptures.nephi.org
  - Provides downloadable database files with complete LDS scripture data
  - Formats: SQL, JSON, CSV, XML
- **Magic Mirror**: Built for the Magic Mirror² platform
  - Website: https://magicmirror.builders
- **Inspiration**: Inspired by MMM-DailyBibleVerse module

## Data Source

This module uses local verse list files generated from the **LDS Documentation Project** (https://scriptures.nephi.org). The module does not require an active API connection to function - it reads from local JSON files.

**Note**: The Open Scripture API mentioned in the original specification does not exist as a public API. The module has been updated to use local data files instead.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Changelog

### Version 1.0.0
- Initial release
- Support for all four LDS scripture volumes
- Daily verse rotation
- Automatic midnight updates
- Error handling with retry logic
- Comprehensive test coverage


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

4. Generate verse lists (see below)

5. Add the module to your `config/config.js` file:
   ```javascript
   {
     module: "MMM-DailyLDSVerse",
     position: "top_center",
     config: {
       updateInterval: 86400000  // Optional, defaults to daily
     }
   }
   ```

## Generating Verse Lists

Before using the module, you need to generate the verse list files. These files contain all verse references (and optionally verse text) for each volume and are used by the module to select daily verses.

### Method 1: Using LDS Documentation Project (Recommended)

The **LDS Documentation Project** (https://scriptures.nephi.org) provides downloadable database files with complete LDS scripture data.

#### Step 1: Download Data

1. Visit https://scriptures.nephi.org
2. Download the scripture database files (JSON format recommended)
3. Save the file to your project directory (e.g., `lds-scriptures.json`)

#### Step 2: Convert Data

Run the conversion script:

```bash
node convert-lds-data.js lds-scriptures.json verses/
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

### Method 2: Using API (If Available)

If you have access to a working scripture API, you can use the original generation script:

```bash
node generate-verse-lists.js
```

**Note**: The Open Scripture API mentioned in the spec does not exist as a public API. See `API_RESEARCH.md` for details.

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
| `updateInterval` | Update interval in milliseconds. Set to `0`, `null`, or omit to use midnight updates | `null` (midnight) | `86400000` (24 hours) |

### Configuration Examples

#### Basic Configuration (Midnight Update - Default)
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center"
  // No config needed - updates at midnight by default
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
2. **Local files only**: If verse lists only have references (no text), only references will display
3. **API fallback**: If API is configured, module will attempt to fetch text (but API may not be available)
4. **Check logs**: Look for messages about verse text availability

### Empty Verse Lists

1. **Generate verse lists**: Run `node generate-verse-lists.js` to create verse list files
2. **Check file permissions**: Ensure the `verses/` directory is readable
3. **Verify file format**: Check that JSON files are valid JSON arrays
4. **Check file location**: Ensure verse files are in the `verses/` directory

### Common Issues

**Issue**: Module shows "Loading verse..." indefinitely
- **Solution**: Check that node_helper is running and can access the API

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
- **Error Handling**: Robust retry logic with graceful error handling
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

- `tests/node-helper.test.js` - Core utility function tests
- `tests/node-helper-complete.test.js` - Comprehensive node_helper tests
- `tests/main-module.test.js` - Main module tests
- `tests/generate-verse-lists.test.js` - Verse list generation tests
- `tests/error-handling.test.js` - Error handling and edge case tests
- `tests/validation.test.js` - Functional and data validation tests
- `tests/configuration.test.js` - Configuration tests

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


# MMM-DailyLDSVerse

A Magic Mirror module that displays a daily scripture verse from LDS scriptures (King James Version Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price).

## Installation

1. Navigate to your Magic Mirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/MMM-DailyLDSVerse.git
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

Before using the module, you need to generate the verse list files. These files contain all verse references for each volume and are used by the module to select daily verses.

### Prerequisites

1. **Node.js**: Ensure Node.js is installed (v14 or higher)
2. **API Research**: Run the API research script first to discover API endpoints:
   ```bash
   node tests/api-research.test.js
   ```
   This will update `API_RESEARCH.md` with endpoint information.

### Generating Verse Lists

Run the generation script:

```bash
node generate-verse-lists.js
```

This script will:
- Query the Open Scripture API for all verses in each volume
- Generate JSON files in the `verses/` directory:
  - `bible.json`
  - `book-of-mormon.json`
  - `doctrine-and-covenants.json`
  - `pearl-of-great-price.json`

### Script Options

The script includes rate limiting to avoid API throttling:
- 500ms delay between individual verse requests
- 2 second delay between volumes

### Updating Verse Lists

To update verse lists (e.g., if new verses are added), simply run the script again:

```bash
node generate-verse-lists.js
```

The script will overwrite existing files with fresh data from the API.

### Troubleshooting Verse List Generation

- **API errors**: Check your internet connection and verify the API is accessible
- **Empty files**: Ensure the API endpoints are correctly configured in `API_RESEARCH.md`
- **Rate limiting**: If you encounter rate limiting errors, increase delays in `generate-verse-lists.js`

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
4. **Verify API configuration**: Check that `API_RESEARCH.md` contains valid API endpoint information

### Verse Not Updating

1. **Check update interval**: Verify your `updateInterval` configuration
2. **Check system time**: Ensure your system clock is correct (midnight updates depend on system time)
3. **Check logs**: Look for update scheduling messages in Magic Mirror logs
4. **Manual refresh**: Restart Magic Mirror to force an immediate update

### API Errors

1. **Network connectivity**: Ensure your Magic Mirror has internet access
2. **API endpoint**: Verify the API endpoint in `API_RESEARCH.md` is correct
3. **Rate limiting**: If you see rate limit errors, the module will retry automatically (3 attempts)
4. **Check logs**: Look for API error messages in the node_helper logs

### Empty Verse Lists

1. **Generate verse lists**: Run `node generate-verse-lists.js` to create verse list files
2. **Check file permissions**: Ensure the `verses/` directory is readable
3. **Verify file format**: Check that JSON files are valid JSON arrays
4. **Check file location**: Ensure verse files are in the `verses/` directory

### Common Issues

**Issue**: Module shows "Loading verse..." indefinitely
- **Solution**: Check that node_helper is running and can access the API

**Issue**: Module shows "Unable to load scripture verse"
- **Solution**: Check API connectivity and verify API endpoints are correct

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
4. **API Integration**: Fetches verse text from the Open Scripture API
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
├── generate-verse-lists.js    # Verse list generation script
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

- **Open Scripture API**: Uses the Open Scripture API for verse data
  - Website: https://openscriptureapi.org
  - Provides access to LDS scriptures including Bible, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price
- **Magic Mirror**: Built for the Magic Mirror² platform
  - Website: https://magicmirror.builders
- **Inspiration**: Inspired by MMM-DailyBibleVerse module

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


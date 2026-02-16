# Release Notes

## Version 1.0.0 - Initial Release

### Features

- **Daily LDS Scripture Verses**: Displays a daily verse from four LDS scripture volumes
  - King James Version Bible
  - Book of Mormon
  - Doctrine and Covenants
  - Pearl of Great Price

- **Automatic Rotation**: Cycles through all four volumes daily
  - Day 1 = Bible
  - Day 2 = Book of Mormon
  - Day 3 = Doctrine and Covenants
  - Day 4 = Pearl of Great Price
  - Day 5 = Bible (cycle repeats)

- **Verse Variety**: Ensures different verses are shown for the same volume on different days

- **Automatic Updates**: Updates at midnight (default) or at custom intervals

- **Error Handling**: Graceful error handling for missing files and invalid data

- **Customizable Header**: Display a custom header above the verse (or hide it)
  - Uses Magic Mirror's standard `<header>` element styling
  - Automatic uppercase text transformation
  - Border-bottom line for consistency with other modules

- **Leap Year Support**: Handles leap years correctly (366 days)

- **Minimal Configuration**: Works out of the box with sensible defaults

### Technical Details

- **Local File-Based**: Uses pre-generated verse list files from LDS Documentation Project
- **No API Required**: Module operates entirely from local JSON files
- **Minimal Dependencies**: Uses only built-in Node.js modules
- **Comprehensive Testing**: Full test coverage with 100+ test cases
- **Well Documented**: Complete JSDoc comments and README documentation
- **CI/CD Integration**: Automated testing with GitHub Actions and GitLab CI

### Installation

1. Clone repository to Magic Mirror modules directory
2. Verse list files are pre-generated and included - no conversion needed!
3. Add module to Magic Mirror config.js
4. Restart Magic Mirror

**Note**: The module's CSS file (`MMM-DailyLDSVerse.css`) is automatically loaded by Magic Mirror.

### Configuration

- `header`: Optional header text (defaults to "Verse of the day")
- `updateInterval`: Optional update interval in milliseconds (defaults to midnight)

### Files Included

- `MMM-DailyLDSVerse.js` - Main module (frontend)
- `MMM-DailyLDSVerse.css` - Module stylesheet
- `node_helper.js` - Backend helper
- `convert-lds-data.js` - LDS Documentation Project data converter (for regenerating verse lists)
- `generate-verse-lists.js` - Deprecated verse list generation script (API-based)
- `package.json` - Module metadata
- `README.md` - Complete documentation
- `config.example.js` - Configuration examples
- `tests/` - Comprehensive test suite
- `verses/` - Verse list JSON files (pre-generated and included)

### Testing

All tests can be run with:
```bash
npm test
```

Test categories:
- Unit tests
- Integration tests
- End-to-end tests
- DOM rendering tests
- Performance tests

### Documentation

- Complete README with installation, configuration, and troubleshooting
- JSDoc comments on all main functions
- Testing guide for manual testing
- Configuration examples
- CI/CD setup guide

### Credits

- **LDS Documentation Project**: Uses data from the LDS Documentation Project
  - Website: https://scriptures.nephi.org
  - Provides downloadable database files with complete LDS scripture data
- **Magic Mirror²**: Built for the Magic Mirror² platform
  - Website: https://magicmirror.builders
- **Inspiration**: Inspired by MMM-DailyBibleVerse module

### License

MIT License

### Known Issues

None at this time.

### Future Enhancements

- Custom styling options
- Multiple verses per day
- Verse history
- Favorite verses
- Additional customization options

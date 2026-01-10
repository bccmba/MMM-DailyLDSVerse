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

- **Error Handling**: Robust retry logic (3 attempts, 5 second delay) with graceful error handling

- **Leap Year Support**: Handles leap years correctly (366 days)

- **Minimal Configuration**: Works out of the box with sensible defaults

### Technical Details

- **API Integration**: Uses Open Scripture API for verse data
- **Minimal Dependencies**: Uses only built-in Node.js modules
- **Comprehensive Testing**: Full test coverage with 100+ test cases
- **Well Documented**: Complete JSDoc comments and README documentation

### Installation

1. Clone repository to Magic Mirror modules directory
2. Generate verse lists: `node generate-verse-lists.js`
3. Add module to Magic Mirror config.js

### Configuration

- `updateInterval`: Optional update interval in milliseconds (defaults to midnight)

### Files Included

- `MMM-DailyLDSVerse.js` - Main module
- `node_helper.js` - Backend helper
- `generate-verse-lists.js` - Verse list generation script
- `package.json` - Module metadata
- `README.md` - Complete documentation
- `config.example.js` - Configuration examples
- `tests/` - Comprehensive test suite
- `verses/` - Verse list JSON files (generated)

### Testing

All tests can be run with:
```bash
npm test
```

### Documentation

- Complete README with installation, configuration, and troubleshooting
- JSDoc comments on all main functions
- Testing guide for manual testing
- Configuration examples

### Credits

- Open Scripture API for verse data
- Magic Mirror² platform
- Inspired by MMM-DailyBibleVerse

### License

MIT License

### Known Issues

- API endpoint configuration required (see API_RESEARCH.md)
- Verse list generation requires API research first

### Future Enhancements

- Custom styling options
- Multiple verses per day
- Verse history
- Favorite verses
- Offline mode with cached verses


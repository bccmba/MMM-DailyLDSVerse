# MMM-DailyLDSVerse

[![CI](https://github.com/bccmba/MMM-DailyLDSVerse/workflows/CI/badge.svg)](https://github.com/bccmba/MMM-DailyLDSVerse/actions)
[![npm version](https://img.shields.io/npm/v/mmm-dailyldsverse.svg)](https://www.npmjs.com/package/mmm-dailyldsverse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MagicMirror Compatible](https://img.shields.io/badge/MagicMirror-2.1.0+-green.svg)](https://github.com/MagicMirrorOrg/MagicMirror)

A MagicMirror² module that displays a daily LDS scripture verse (Bible, Book of Mormon, Doctrine and Covenants, or Pearl of Great Price). Works completely offline using pre-loaded verse data.

## Screenshot

```
┌─────────────────────────────────────┐
│ VERSE OF THE DAY                    │
├─────────────────────────────────────┤
│ And it came to pass that I, Nephi,  │
│ said unto my father: I will go and  │
│ do the things which the Lord hath   │
│ commanded, for I know that the     │
│ Lord giveth no commandments unto    │
│ the children of men, save he shall  │
│ prepare a way for them...           │
│                                     │
│ 1 Nephi 3:7                         │
└─────────────────────────────────────┘
```

## Features

- **Daily Scripture Rotation**: Cycles through four LDS volumes (Bible, Book of Mormon, Doctrine and Covenants, Pearl of Great Price)
- **Configurable Volumes**: Choose which standard works to include in the rotation
- **Randomized Verse Selection**: Different verse each day, randomly selected from the volume
- **Offline Operation**: Pre-loaded verse data - no API calls needed
- **Automatic Updates**: Updates at midnight (default) or custom intervals
- **Minimal Configuration**: Works out of the box with sensible defaults

## Requirements

- MagicMirror² version 2.1.0 or higher
- Node.js 14 or higher

## Installation

1. Navigate to your Magic Mirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/bccmba/MMM-DailyLDSVerse.git
   ```

3. Verse lists are pre-generated and included! No additional steps needed.

4. Add the module to your `config/config.js` file:
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

5. Restart Magic Mirror.

## Configuration

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `header` | Header text displayed above the verse. Set to `""` or `null` to hide | `"Verse of the day"` | `"Daily Scripture"` |
| `updateInterval` | Update interval in milliseconds. `0`, `null`, or omit for midnight updates | `null` (midnight) | `86400000` (24 hours) |
| `volumes` | Array of standard works to select verses from. Valid values: `"bible"`, `"bookOfMormon"`, `"doctrineAndCovenants"`, `"pearlOfGreatPrice"` | All 4 volumes | `["bookOfMormon"]` |

### Configuration Examples

**Basic (Midnight Update):**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center"
}
```

**Custom Header:**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    header: "Daily Scripture"
  }
}
```

**Hide Header:**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    header: ""
  }
}
```

**Update Every 12 Hours:**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    updateInterval: 43200000
  }
}
```

**Select Only Book of Mormon:**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    volumes: ["bookOfMormon"]
  }
}
```

**Select Bible and Doctrine and Covenants Only:**
```javascript
{
  module: "MMM-DailyLDSVerse",
  position: "top_center",
  config: {
    volumes: ["bible", "doctrineAndCovenants"]
  }
}
```

### Position Options

The module supports all standard MagicMirror positions:
- `top_left`, `top_center`, `top_right`
- `upper_third`, `middle_center`, `lower_third`
- `bottom_left`, `bottom_center`, `bottom_right`
- `fullscreen_above`, `fullscreen_below`

## Dependencies

This module uses **local verse data only** - no external APIs required:

- **Data Source**: LDS Documentation Project (https://scriptures.nephi.org)
- **Storage**: Local JSON files in `verses/` directory
- **No API keys needed**: Works completely offline

## Updating Verse Lists

To update verse lists with the latest data from LDS Documentation Project:

```bash
# Download data from https://scriptures.nephi.org
node convert-lds-data.js <path-to-lds-scriptures-json.txt> verses/
```

The script generates these files:
- `verses/bible.json`
- `verses/book-of-mormon.json`
- `verses/doctrine-and-covenants.json`
- `verses/pearl-of-great-price.json`

## Troubleshooting

**Module not displaying:**
- Check MagicMirror logs for errors
- Verify verse JSON files exist in `verses/` directory
- Restart MagicMirror

**Verse not changing:**
- Verify `updateInterval` configuration
- Check system timezone for midnight updates

**Empty verse display:**
- Verify JSON files contain valid data
- Try regenerating verse lists

## Development

```bash
npm test   # Run all tests (247 tests)
```

## Project Structure

```
MMM-DailyLDSVerse/
├── MMM-DailyLDSVerse.js      # Main module (frontend)
├── MMM-DailyLDSVerse.css    # Module stylesheet
├── node_helper.js           # Node helper (backend)
├── convert-lds-data.js      # Data converter script
├── package.json             # Module metadata
├── README.md                # This file
├── tests/                   # Test files (247 tests)
└── verses/                  # Pre-loaded verse JSON files
```

## License

MIT License - See LICENSE file for details

## Credits

- **LDS Documentation Project**: https://scriptures.nephi.org
- **MagicMirror²**: https://magicmirror.builders


# Installation Checklist

Use this checklist to ensure proper installation of MMM-DailyLDSVerse.

## Prerequisites

- [ ] Magic Mirror² installed and running
- [ ] Node.js installed (v14 or higher)
- [ ] Internet connection (for API calls and verse list generation)

## Installation Steps

### 1. Module Installation

- [ ] Navigate to Magic Mirror modules directory
  ```bash
  cd ~/MagicMirror/modules
  ```

- [ ] Clone the repository
  ```bash
  git clone https://github.com/yourusername/MMM-DailyLDSVerse.git
  ```

- [ ] Navigate to module directory
  ```bash
  cd MMM-DailyLDSVerse
  ```

### 2. Download LDS Scripture Data

- [ ] Visit LDS Documentation Project: https://scriptures.nephi.org
- [ ] Download scripture database files (JSON format recommended)
- [ ] Save to project directory (e.g., `lds-scriptures.json`)

### 3. Convert Data to Verse Lists

- [ ] Run conversion script
  ```bash
  node convert-lds-data.js lds-scriptures.json verses/
  ```

- [ ] Verify verse list files created:
  - [ ] `verses/bible.json`
  - [ ] `verses/book-of-mormon.json`
  - [ ] `verses/doctrine-and-covenants.json`
  - [ ] `verses/pearl-of-great-price.json`

- [ ] Verify files contain verse references (not empty)

### 4. Magic Mirror Configuration

- [ ] Open Magic Mirror config file
  ```bash
  nano ~/MagicMirror/config/config.js
  ```

- [ ] Add module to modules array:
  ```javascript
  {
    module: "MMM-DailyLDSVerse",
    position: "top_center"
  }
  ```

- [ ] Save config file

### 5. Testing

- [ ] Restart Magic Mirror
  ```bash
  pm2 restart mm
  # or
  npm start
  ```

- [ ] Verify module appears on screen
- [ ] Verify verse displays correctly
- [ ] Verify verse reference displays
- [ ] Check Magic Mirror logs for errors

### 6. Verification

- [ ] Module displays verse text
- [ ] Module displays verse reference
- [ ] No errors in Magic Mirror logs
- [ ] Module updates at midnight (or configured interval)
- [ ] All four volumes cycle correctly

## Troubleshooting

If any step fails:

1. **Check Magic Mirror logs** for error messages
2. **Verify verse list files exist** and are not empty
3. **Check API configuration** in API_RESEARCH.md
4. **Verify internet connection** for API calls
5. **Check module name** matches exactly: `MMM-DailyLDSVerse`

## Post-Installation

- [ ] Test module over multiple days
- [ ] Verify all four volumes display
- [ ] Test error handling (disconnect internet)
- [ ] Verify midnight updates work
- [ ] Test custom update interval (if configured)

## Success Criteria

✅ Module displays on Magic Mirror  
✅ Verse text and reference are visible  
✅ No errors in logs  
✅ Module updates automatically  
✅ All volumes cycle correctly  

## Notes

- First installation may take time to generate verse lists
- API research must be completed before verse list generation
- Module requires internet connection for API calls
- Verse lists can be regenerated anytime by running the script again


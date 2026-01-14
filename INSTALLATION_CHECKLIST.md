# Installation Checklist

Use this checklist to ensure proper installation of MMM-DailyLDSVerse.

## Prerequisites

- [ ] Magic Mirror² installed and running
- [ ] Node.js installed (v14 or higher)
- [ ] Internet connection (only needed for cloning the repository)

## Installation Steps

### 1. Module Installation

- [ ] Navigate to Magic Mirror modules directory
  ```bash
  cd ~/MagicMirror/modules
  ```

- [ ] Clone the repository
  ```bash
  git clone https://github.com/bccmba/MMM-DailyLDSVerse.git
  ```

- [ ] Navigate to module directory
  ```bash
  cd MMM-DailyLDSVerse
  ```

### 2. Verify Verse Lists (Pre-Generated)

**Good News**: Verse list files are **pre-generated and included** in the repository!

- [ ] Verify verse list files exist:
  - [ ] `verses/bible.json` ✓ (included)
  - [ ] `verses/book-of-mormon.json` ✓ (included)
  - [ ] `verses/doctrine-and-covenants.json` ✓ (included)
  - [ ] `verses/pearl-of-great-price.json` ✓ (included)

**No conversion needed** - the files are ready to use!

### 2b. Regenerate Verse Lists (Optional - Only if Needed)

If you want to regenerate from latest data (usually not needed):

- [ ] Download latest data from https://scriptures.nephi.org
- [ ] Run conversion script:
  ```bash
  node convert-lds-data.js <path-to-downloaded-file>/json/lds-scriptures-json.txt verses/
  ```
  
  Example:
  ```bash
  node convert-lds-data.js ~/Downloads/lds-scriptures-json/json/lds-scriptures-json.txt verses/
  ```

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
3. **Check module name** matches exactly: `MMM-DailyLDSVerse`

## Post-Installation

- [ ] Test module over multiple days
- [ ] Verify all four volumes display
- [ ] Test error handling (remove a verse file temporarily)
- [ ] Verify midnight updates work
- [ ] Test custom update interval (if configured)
- [ ] Verify header displays correctly (if configured)
- [ ] Check that CSS styling is applied correctly

## Success Criteria

✅ Module displays on Magic Mirror  
✅ Verse text and reference are visible  
✅ No errors in logs  
✅ Module updates automatically  
✅ All volumes cycle correctly  

## Notes

- Verse list files are pre-generated and included - no generation needed!
- Module uses local files - no internet connection required for operation
- Verse lists can be regenerated anytime by running the conversion script
- CSS file is automatically loaded by Magic Mirror
- Module works immediately after installation


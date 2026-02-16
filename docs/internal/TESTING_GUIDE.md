# Testing Guide for MMM-DailyLDSVerse

This guide provides a comprehensive checklist for manually testing the module in Magic Mirror.

## Prerequisites

1. Magic Mirror installed and running
2. Module installed in `modules/` directory
3. Verse list files present in `verses/` directory (pre-generated and included)

## Functional Testing Checklist

### Volume Display Testing

- [ ] **Bible Volume**
  - [ ] Module displays Bible verse
  - [ ] Verse reference is in correct format (e.g., "John 3:16")
  - [ ] Verse text displays correctly

- [ ] **Book of Mormon Volume**
  - [ ] Module displays Book of Mormon verse
  - [ ] Verse reference is in correct format (e.g., "1 Nephi 3:7")
  - [ ] Verse text displays correctly

- [ ] **Doctrine and Covenants Volume**
  - [ ] Module displays D&C verse
  - [ ] Verse reference is in correct format (e.g., "D&C 1:1")
  - [ ] Verse text displays correctly

- [ ] **Pearl of Great Price Volume**
  - [ ] Module displays Pearl of Great Price verse
  - [ ] Verse reference is in correct format (e.g., "Moses 1:1")
  - [ ] Verse text displays correctly

### Daily Rotation Testing

- [ ] **Day 1 (Bible)**
  - [ ] Module shows Bible verse
  - [ ] Verse is correct for day 1

- [ ] **Day 2 (Book of Mormon)**
  - [ ] Module shows Book of Mormon verse
  - [ ] Verse is different from day 1

- [ ] **Day 3 (Doctrine and Covenants)**
  - [ ] Module shows D&C verse
  - [ ] Verse is different from previous days

- [ ] **Day 4 (Pearl of Great Price)**
  - [ ] Module shows Pearl of Great Price verse
  - [ ] Verse is different from previous days

- [ ] **Day 5 (Bible - Cycle)**
  - [ ] Module shows Bible verse again
  - [ ] Verse is different from day 1 (variety)

### Verse Variety Testing

- [ ] **Same Volume, Different Days**
  - [ ] Day 1 Bible verse is different from Day 5 Bible verse
  - [ ] Day 2 Book of Mormon verse is different from Day 6 Book of Mormon verse
  - [ ] Variety formula works correctly

### Update Scheduling Testing

- [ ] **Initial Load**
  - [ ] Module loads verse immediately on start
  - [ ] Loading message appears briefly
  - [ ] Verse displays after loading

- [ ] **Midnight Update**
  - [ ] Module updates at midnight (test by changing system time)
  - [ ] New verse appears at midnight
  - [ ] Update happens automatically

- [ ] **Custom Interval Update**
  - [ ] Configure custom updateInterval (e.g., 1 hour)
  - [ ] Module updates at configured interval
  - [ ] Updates continue automatically

### State Management Testing

- [ ] **Loading State**
  - [ ] "Loading verse..." message appears when fetching
  - [ ] Loading state clears when verse loads
  - [ ] Loading state appears on module start

- [ ] **Error State**
  - [ ] "Unable to load scripture verse" appears on error
  - [ ] Error state appears when verse list files are missing or invalid
  - [ ] Error state clears on successful fetch

- [ ] **Success State**
  - [ ] Verse text displays correctly
  - [ ] Verse reference displays correctly
  - [ ] Both text and reference are visible

## Data Validation Testing

### Verse Reference Format

- [ ] **Format Validation**
  - [ ] All references match pattern: `Book Chapter:Verse`
  - [ ] References are parseable
  - [ ] No invalid formats appear

- [ ] **Volume-Specific Formats**
  - [ ] Bible: "Book Chapter:Verse" (e.g., "John 3:16")
  - [ ] Book of Mormon: "Book Chapter:Verse" (e.g., "1 Nephi 3:7")
  - [ ] D&C: "D&C Chapter:Verse" (e.g., "D&C 1:1")
  - [ ] Pearl of Great Price: "Book Chapter:Verse" (e.g., "Moses 1:1")

### Verse Content

- [ ] **Text Validation**
  - [ ] Verse text is not empty
  - [ ] Verse text is readable
  - [ ] Verse text matches reference

- [ ] **Reference Validation**
  - [ ] Reference is displayed
  - [ ] Reference is correct format
  - [ ] Reference matches verse text

### Day Coverage

- [ ] **All Days Covered**
  - [ ] Test multiple days throughout year
  - [ ] All days have valid verses
  - [ ] No missing verses

- [ ] **Leap Year Testing**
  - [ ] February 29 works correctly (if leap year)
  - [ ] Day 366 works correctly (if leap year)
  - [ ] Year boundary works correctly

## Error Handling Testing

### File Errors

- [ ] **Missing Verse List Files**
  - [ ] Remove one verse list file
  - [ ] Module handles missing file gracefully
  - [ ] Error logged but module continues

- [ ] **Empty Verse List Files**
  - [ ] Create empty verse list file
  - [ ] Module handles empty file
  - [ ] Error message appears

- [ ] **Malformed JSON**
  - [ ] Create malformed JSON file
  - [ ] Module handles parse error
  - [ ] Error logged but module continues

## Integration Testing

### Magic Mirror Integration

- [ ] **Module Registration**
  - [ ] Module appears in Magic Mirror
  - [ ] Module is positioned correctly
  - [ ] Module updates display

- [ ] **Configuration**
  - [ ] Default configuration works
  - [ ] Custom updateInterval works
  - [ ] Position configuration works

- [ ] **Notifications**
  - [ ] Module receives notifications
  - [ ] Module sends notifications
  - [ ] Communication works correctly

### End-to-End Testing

- [ ] **Complete Flow**
  1. Module starts
  2. Requests verse from node_helper
  3. Node helper calculates verse
  4. Node helper reads from local verse list files
  5. Verse displays in module
  6. Update scheduled for midnight

- [ ] **Error Recovery Flow**
  1. File error occurs (missing or invalid verse list)
  2. Error message displays
  3. Next update attempts
  4. Verse loads successfully when file is restored
  5. Error clears

## Performance Testing

- [ ] **Load Time**
  - [ ] Module loads quickly
  - [ ] Verse appears within reasonable time
  - [ ] No noticeable delays

- [ ] **Update Performance**
  - [ ] Midnight update is smooth
  - [ ] No flickering or delays
  - [ ] Update completes quickly

- [ ] **Memory Usage**
  - [ ] Module doesn't cause memory leaks
  - [ ] Memory usage is reasonable
  - [ ] No performance degradation over time

## Browser Compatibility

- [ ] **Chrome/Chromium**
  - [ ] Module displays correctly
  - [ ] All features work

- [ ] **Firefox**
  - [ ] Module displays correctly
  - [ ] All features work

- [ ] **Safari**
  - [ ] Module displays correctly
  - [ ] All features work

## Accessibility Testing

- [ ] **Text Readability**
  - [ ] Verse text is readable
  - [ ] Reference is readable
  - [ ] Text size is appropriate

- [ ] **Color Contrast**
  - [ ] Text is visible against background
  - [ ] Good contrast ratio

## Test Results Template

```
Test Date: ___________
Tester: ___________
Magic Mirror Version: ___________
Node.js Version: ___________

Functional Tests: ___/___ passed
Data Validation Tests: ___/___ passed
Error Handling Tests: ___/___ passed
Integration Tests: ___/___ passed

Issues Found:
1. 
2. 
3. 

Notes:
```

## Troubleshooting Test Failures

### Module Not Displaying
- Check Magic Mirror logs
- Verify module name in config.js
- Check verse list files exist

### Verse Not Updating
- Check system time
- Verify updateInterval configuration
- Check Magic Mirror logs

### File Errors
- Verify verse list files exist
- Check file permissions
- Validate JSON format

### File Errors
- Verify verse list files exist
- Check file permissions
- Validate JSON format


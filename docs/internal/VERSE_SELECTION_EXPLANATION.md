# Verse Selection Algorithm Explanation

## Current Algorithm

The module uses a **deterministic** (not random) formula to select verses. Here's how it works:

### Step 1: Calculate Day of Year
```javascript
getDayOfYear(date) // Returns 1-366 (1 = Jan 1, 366 = Dec 31 in leap year)
```

### Step 2: Select Volume (Cycles Every 4 Days)
```javascript
getVolumeForDay(dayOfYear) {
  const volumes = ['bible', 'bookOfMormon', 'doctrineAndCovenants', 'pearlOfGreatPrice'];
  const volumeIndex = (dayOfYear - 1) % 4;
  return volumes[volumeIndex];
}
```

**Pattern:**
- Day 1, 5, 9, 13... → Bible
- Day 2, 6, 10, 14... → Book of Mormon
- Day 3, 7, 11, 15... → Doctrine and Covenants
- Day 4, 8, 12, 16... → Pearl of Great Price

### Step 3: Select Verse Index (The Problem You're Seeing)
```javascript
getVerseIndexForDay(dayOfYear, volumeList) {
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  return volumeCycle % volumeList.length;
}
```

## The Issue

**The current formula causes the same verse index to be used across all four volumes within the same cycle.**

### Example with Days 1-4:
- **Day 1 (Bible)**: `volumeCycle = Math.floor((1-1)/4) = 0` → Verse index `0 % length = 0`
- **Day 2 (Book of Mormon)**: `volumeCycle = Math.floor((2-1)/4) = 0` → Verse index `0 % length = 0`
- **Day 3 (D&C)**: `volumeCycle = Math.floor((3-1)/4) = 0` → Verse index `0 % length = 0`
- **Day 4 (Pearl)**: `volumeCycle = Math.floor((4-1)/4) = 0` → Verse index `0 % length = 0`

**Result**: All four volumes show verse at index 0 on days 1-4!

### Example with Days 5-8:
- **Day 5 (Bible)**: `volumeCycle = Math.floor((5-1)/4) = 1` → Verse index `1 % length = 1`
- **Day 6 (Book of Mormon)**: `volumeCycle = Math.floor((6-1)/4) = 1` → Verse index `1 % length = 1`
- **Day 7 (D&C)**: `volumeCycle = Math.floor((7-1)/4) = 1` → Verse index `1 % length = 1`
- **Day 8 (Pearl)**: `volumeCycle = Math.floor((8-1)/4) = 1` → Verse index `1 % length = 1`

**Result**: All four volumes show verse at index 1 on days 5-8!

## Why This Happens

The formula `Math.floor((dayOfYear - 1) / 4)` groups days into cycles of 4:
- Days 1-4: cycle 0
- Days 5-8: cycle 1
- Days 9-12: cycle 2
- etc.

Within each 4-day cycle, all volumes get the **same cycle number**, which means they all get the **same verse index**.

## Current Behavior Summary

✅ **Volume Variety**: Different volume each day (cycles every 4 days)  
❌ **Verse Variety Within Cycle**: Same verse index for all volumes in same cycle  
✅ **Verse Variety Over Time**: Different verses on different cycles (Day 1 vs Day 5)

## Proposed Solutions

### Option 1: Add Volume Offset (Recommended)
Modify the formula to include the volume index, so each volume gets a different verse even within the same cycle:

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  const volumeIndex = (dayOfYear - 1) % 4; // 0, 1, 2, or 3
  // Add volume offset to create variety within cycle
  const offset = volumeIndex * Math.floor(volumeList.length / 4);
  return (volumeCycle + offset) % volumeList.length;
}
```

### Option 2: Use Day of Year Directly (More Variety)
Use the day of year directly with volume offset:

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  const volumeIndex = (dayOfYear - 1) % 4; // 0, 1, 2, or 3
  // Use day of year with volume offset for better distribution
  const baseIndex = (dayOfYear - 1) % volumeList.length;
  const offset = volumeIndex * Math.floor(volumeList.length / 4);
  return (baseIndex + offset) % volumeList.length;
}
```

### Option 3: True Randomization (Most Variety)
Use a seeded random number generator based on day of year:

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  // Simple seeded random based on day of year
  // This ensures same day = same verse (deterministic) but more variety
  const seed = dayOfYear * 2654435761; // Large prime for better distribution
  return Math.abs(seed) % volumeList.length;
}
```

### Option 4: Volume-Specific Cycle (Best Distribution)
Each volume cycles independently:

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  const volumeIndex = (dayOfYear - 1) % 4; // 0, 1, 2, or 3
  // Each volume cycles independently based on how many times it's appeared
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  // Add volume-specific offset for better distribution
  const volumeOffset = volumeIndex * Math.floor(volumeList.length / 4);
  return (volumeCycle + volumeOffset) % volumeList.length;
}
```

## Recommendation

**Option 1 or Option 4** would provide the best balance:
- ✅ Different verse for each volume each day
- ✅ Deterministic (same day = same verse)
- ✅ Good variety over time
- ✅ Simple to understand and maintain

Would you like me to implement one of these solutions?

# Verse Selection Algorithm - Current Issue Analysis

## The Problem You're Experiencing

You're seeing the **same verse index** across all four volumes within each 4-day cycle. This is a bug in the current algorithm.

## Current Algorithm Breakdown

### Step 1: Volume Selection (Works Correctly)
```javascript
getVolumeForDay(dayOfYear) {
  const volumeIndex = (dayOfYear - 1) % 4;
  // Day 1 → Bible (index 0)
  // Day 2 → Book of Mormon (index 1)
  // Day 3 → D&C (index 2)
  // Day 4 → Pearl (index 3)
  // Day 5 → Bible (index 0) - cycle repeats
}
```

### Step 2: Verse Index Selection (THE PROBLEM)
```javascript
getVerseIndexForDay(dayOfYear, volumeList) {
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  return volumeCycle % volumeList.length;
}
```

## Why This Causes the Issue

The formula `Math.floor((dayOfYear - 1) / 4)` creates **4-day cycles**:

| Day | Volume | Calculation | Cycle | Verse Index |
|-----|--------|-------------|-------|-------------|
| 1   | Bible  | floor(0/4) = 0 | 0 | 0 |
| 2   | Book of Mormon | floor(1/4) = 0 | 0 | **0** ← Same! |
| 3   | D&C    | floor(2/4) = 0 | 0 | **0** ← Same! |
| 4   | Pearl  | floor(3/4) = 0 | 0 | **0** ← Same! |
| 5   | Bible  | floor(4/4) = 1 | 1 | 1 |
| 6   | Book of Mormon | floor(5/4) = 1 | 1 | **1** ← Same! |
| 7   | D&C    | floor(6/4) = 1 | 1 | **1** ← Same! |
| 8   | Pearl  | floor(7/4) = 1 | 1 | **1** ← Same! |

**Result**: All four volumes get the same verse index within each 4-day cycle!

## The Fix

We need to add a **volume-specific offset** so each volume gets a different verse even within the same cycle.

### Improved Algorithm

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  const volumeIndex = (dayOfYear - 1) % 4; // 0, 1, 2, or 3
  
  // Add volume offset to create variety within cycle
  // Each volume gets a different starting point
  const volumeOffset = Math.floor((volumeList.length / 4) * volumeIndex);
  
  // Combine cycle and offset for variety
  return (volumeCycle + volumeOffset) % volumeList.length;
}
```

### How This Fix Works

| Day | Volume | Cycle | Volume Index | Offset (if 1000 verses) | Final Index |
|-----|--------|-------|--------------|-------------------------|-------------|
| 1   | Bible  | 0     | 0            | 0                       | 0           |
| 2   | Book of Mormon | 0 | 1            | 250                     | 250         |
| 3   | D&C    | 0     | 2            | 500                     | 500         |
| 4   | Pearl  | 0     | 3            | 750                     | 750         |
| 5   | Bible  | 1     | 0            | 0                       | 1           |
| 6   | Book of Mormon | 1 | 1            | 250                     | 251         |
| 7   | D&C    | 1     | 2            | 500                     | 501         |
| 8   | Pearl  | 1     | 3            | 750                     | 751         |

**Result**: Each volume gets a **different verse** every day! ✅

## Alternative: Even Better Distribution

For even more variety, we can use the day of year more directly:

```javascript
getVerseIndexForDay: function(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  
  const volumeIndex = (dayOfYear - 1) % 4;
  
  // Use day of year with volume-specific multiplier
  // This creates better distribution across the entire year
  const baseIndex = (dayOfYear - 1) % volumeList.length;
  const volumeOffset = Math.floor((volumeList.length / 4) * volumeIndex);
  
  return (baseIndex + volumeOffset) % volumeList.length;
}
```

This approach:
- ✅ Uses the full day of year (1-366) for better distribution
- ✅ Adds volume offset so each volume gets different verses
- ✅ Still deterministic (same day = same verse)
- ✅ Better variety over the entire year

## Recommendation

I recommend implementing the **second approach** (better distribution) as it provides:
1. Different verse for each volume each day
2. Better variety across the entire year
3. Still deterministic (reproducible)
4. More even distribution of verses

Would you like me to implement this fix?

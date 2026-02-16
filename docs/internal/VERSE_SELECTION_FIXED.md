# Verse Selection Algorithm - Fixed

## The Problem (Before Fix)

The original algorithm had a flaw where **all four volumes got the same verse index** within each 4-day cycle:

### Original Algorithm
```javascript
getVerseIndexForDay(dayOfYear, volumeList) {
  const volumeCycle = Math.floor((dayOfYear - 1) / 4);
  return volumeCycle % volumeList.length;
}
```

### Why This Was Wrong

| Day | Volume | Calculation | Cycle | Verse Index | Problem |
|-----|--------|-------------|-------|-------------|---------|
| 1   | Bible  | floor(0/4) = 0 | 0 | **0** | |
| 2   | Book of Mormon | floor(1/4) = 0 | 0 | **0** | ❌ Same! |
| 3   | D&C    | floor(2/4) = 0 | 0 | **0** | ❌ Same! |
| 4   | Pearl  | floor(3/4) = 0 | 0 | **0** | ❌ Same! |
| 5   | Bible  | floor(4/4) = 1 | 1 | **1** | |
| 6   | Book of Mormon | floor(5/4) = 1 | 1 | **1** | ❌ Same! |

**Result**: All four volumes showed verse at the same index (e.g., all showing verse #0, then all showing verse #1).

---

## The Fix (After)

### New Algorithm
```javascript
getVerseIndexForDay(dayOfYear, volumeList) {
  if (volumeList.length === 0) return 0;
  
  // Get which volume this day represents (0-3)
  const volumeIndex = (dayOfYear - 1) % 4;
  
  // Use day of year with volume-specific multiplier for better distribution
  const baseIndex = (dayOfYear - 1) % volumeList.length;
  
  // Add volume-specific offset so each volume gets different verses
  // Divides the verse list into 4 sections, one per volume
  const volumeOffset = Math.floor((volumeList.length / 4) * volumeIndex);
  
  // Combine base index with volume offset, wrapping around if needed
  return (baseIndex + volumeOffset) % volumeList.length;
}
```

### How It Works Now

**Example with 1000 verses per volume:**

| Day | Volume | Volume Index | Base Index | Volume Offset | Final Index | Result |
|-----|--------|--------------|------------|---------------|-------------|--------|
| 1   | Bible  | 0            | 0          | 0             | **0**       | ✅ Different |
| 2   | Book of Mormon | 1    | 1          | 250           | **251**     | ✅ Different |
| 3   | D&C    | 2            | 2          | 500           | **502**     | ✅ Different |
| 4   | Pearl  | 3            | 3          | 750           | **753**     | ✅ Different |
| 5   | Bible  | 0            | 4          | 0             | **4**       | ✅ Different |
| 6   | Book of Mormon | 1    | 5          | 250           | **255**     | ✅ Different |
| 7   | D&C    | 2            | 6          | 500           | **506**     | ✅ Different |
| 8   | Pearl  | 3            | 7          | 750           | **757**     | ✅ Different |

**Result**: Each volume now gets a **different verse** every day! ✅

---

## How the Formula Works

### Step 1: Determine Volume Index
```javascript
const volumeIndex = (dayOfYear - 1) % 4;
```
- Day 1, 5, 9... → 0 (Bible)
- Day 2, 6, 10... → 1 (Book of Mormon)
- Day 3, 7, 11... → 2 (D&C)
- Day 4, 8, 12... → 3 (Pearl)

### Step 2: Calculate Base Index
```javascript
const baseIndex = (dayOfYear - 1) % volumeList.length;
```
- Uses the full day of year (1-366) for better distribution
- Wraps around using modulo to stay within verse list bounds

### Step 3: Calculate Volume Offset
```javascript
const volumeOffset = Math.floor((volumeList.length / 4) * volumeIndex);
```
- Divides the verse list into 4 equal sections
- Each volume gets its own section:
  - Bible: 0 to 25% of verses
  - Book of Mormon: 25% to 50% of verses
  - D&C: 50% to 75% of verses
  - Pearl: 75% to 100% of verses

### Step 4: Combine and Wrap
```javascript
return (baseIndex + volumeOffset) % volumeList.length;
```
- Adds the offset to the base index
- Wraps around if the result exceeds the list length
- Ensures we always get a valid index

---

## Benefits of the New Algorithm

✅ **Different Verse Each Day**: Each volume gets a unique verse every day  
✅ **Better Distribution**: Uses full day of year (1-366) for variety  
✅ **Volume Separation**: Each volume gets its own "section" of verses  
✅ **Deterministic**: Same day = same verse (reproducible)  
✅ **No Randomization**: Predictable and testable  
✅ **Handles All Sizes**: Works with any verse list length  

---

## Example Over Full Year

**Day 1 (Jan 1)**: Bible → Verse 0  
**Day 2 (Jan 2)**: Book of Mormon → Verse 251  
**Day 3 (Jan 3)**: D&C → Verse 502  
**Day 4 (Jan 4)**: Pearl → Verse 753  
**Day 5 (Jan 5)**: Bible → Verse 4  
**Day 6 (Jan 6)**: Book of Mormon → Verse 255  
...and so on

Each volume cycles through its section of verses independently, ensuring variety every single day!

---

## Testing the Fix

You can verify the fix by:
1. Restarting Magic Mirror
2. Checking verses over 4 consecutive days
3. You should see different verse references for each volume each day

The fix is now implemented and ready to use!

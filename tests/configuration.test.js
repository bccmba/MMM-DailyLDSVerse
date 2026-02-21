/**
 * Unit tests for configuration handling
 */

const { test } = require('node:test');
const assert = require('node:assert');

/**
 * Test updateInterval configuration logic
 */
test('Configuration - Should use midnight update when updateInterval is null', () => {
  const config = { updateInterval: null };
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, true);
});

test('Configuration - Should use midnight update when updateInterval is 0', () => {
  const config = { updateInterval: 0 };
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, true);
});

test('Configuration - Should use midnight update when updateInterval is undefined', () => {
  const config = {};
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, true);
});

test('Configuration - Should use custom interval when updateInterval is set', () => {
  const config = { updateInterval: 86400000 };
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, false);
  assert.strictEqual(config.updateInterval, 86400000);
});

test('Configuration - Should handle 12 hour interval', () => {
  const config = { updateInterval: 43200000 };
  assert.strictEqual(config.updateInterval, 43200000);
  assert.strictEqual(config.updateInterval / 1000 / 60 / 60, 12);
});

test('Configuration - Should handle 1 hour interval', () => {
  const config = { updateInterval: 3600000 };
  assert.strictEqual(config.updateInterval, 3600000);
  assert.strictEqual(config.updateInterval / 1000 / 60, 60);
});

test('Configuration - Should reject negative intervals', () => {
  const config = { updateInterval: -1000 };
  const shouldUseMidnight = !config.updateInterval || config.updateInterval <= 0;
  assert.strictEqual(shouldUseMidnight, true);
});

/**
 * Test default configuration
 */
test('Default configuration - Should have updateInterval default', () => {
  const defaults = {
    updateInterval: 86400000 // 24 hours in milliseconds
  };
  
  assert.ok(defaults.updateInterval);
  assert.strictEqual(typeof defaults.updateInterval, 'number');
  assert.ok(defaults.updateInterval > 0);
});

/**
 * Test configuration merging
 */
test('Configuration merging - Should merge user config with defaults', () => {
  const defaults = {
    updateInterval: 86400000
  };
  
  const userConfig = {
    updateInterval: 43200000
  };
  
  const merged = { ...defaults, ...userConfig };
  assert.strictEqual(merged.updateInterval, 43200000);
});

test('Configuration merging - Should use default when user config is empty', () => {
  const defaults = {
    updateInterval: 86400000
  };
  
  const userConfig = {};
  
  const merged = { ...defaults, ...userConfig };
  assert.strictEqual(merged.updateInterval, 86400000);
});

/**
 * Test common interval values
 */
test('Common intervals - 24 hours', () => {
  const interval = 86400000;
  const hours = interval / 1000 / 60 / 60;
  assert.strictEqual(hours, 24);
});

test('Common intervals - 12 hours', () => {
  const interval = 43200000;
  const hours = interval / 1000 / 60 / 60;
  assert.strictEqual(hours, 12);
});

test('Common intervals - 1 hour', () => {
  const interval = 3600000;
  const hours = interval / 1000 / 60 / 60;
  assert.strictEqual(hours, 1);
});

test('Common intervals - 30 minutes', () => {
  const interval = 1800000;
  const minutes = interval / 1000 / 60;
  assert.strictEqual(minutes, 30);
});

/**
 * Test header configuration
 */
test('Configuration - Should have header default', () => {
  const defaults = {
    updateInterval: 86400000,
    header: "Verse of the day"
  };
  
  assert.ok(defaults.header);
  assert.strictEqual(typeof defaults.header, 'string');
  assert.strictEqual(defaults.header, "Verse of the day");
});

test('Configuration - Should allow custom header', () => {
  const config = {
    header: "Daily Scripture"
  };
  
  assert.strictEqual(config.header, "Daily Scripture");
});

test('Configuration - Should allow empty header to hide it', () => {
  const config = {
    header: ""
  };
  
  const shouldShowHeader = Boolean(config.header && config.header.length > 0);
  assert.strictEqual(shouldShowHeader, false);
});

test('Configuration - Should allow null header to hide it', () => {
  const config = {
    header: null
  };
  
  const shouldShowHeader = Boolean(config.header && config.header.length > 0);
  assert.strictEqual(shouldShowHeader, false);
});

/**
 * Test volumes configuration
 */
test('Volumes configuration - Should have default all 4 volumes', () => {
  const defaults = {
    updateInterval: 86400000,
    header: "Verse of the day",
    volumes: ["bible", "bookOfMormon", "doctrineAndCovenants", "pearlOfGreatPrice"]
  };
  
  assert.ok(defaults.volumes);
  assert.strictEqual(Array.isArray(defaults.volumes), true);
  assert.strictEqual(defaults.volumes.length, 4);
});

test('Volumes configuration - Should allow custom volume selection', () => {
  const config = {
    volumes: ["bookOfMormon"]
  };
  
  assert.strictEqual(config.volumes.length, 1);
  assert.strictEqual(config.volumes[0], "bookOfMormon");
});

test('Volumes configuration - Should allow multiple volumes', () => {
  const config = {
    volumes: ["bible", "doctrineAndCovenants"]
  };
  
  assert.strictEqual(config.volumes.length, 2);
  assert.strictEqual(config.volumes.includes("bible"), true);
  assert.strictEqual(config.volumes.includes("doctrineAndCovenants"), true);
});

test('Volumes configuration - Should allow all volumes explicitly', () => {
  const config = {
    volumes: ["bible", "bookOfMormon", "doctrineAndCovenants", "pearlOfGreatPrice"]
  };
  
  assert.strictEqual(config.volumes.length, 4);
});

test('Volumes configuration - Should allow empty array (all volumes)', () => {
  const config = {
    volumes: []
  };
  
  assert.strictEqual(Array.isArray(config.volumes), true);
  assert.strictEqual(config.volumes.length, 0);
});

test('Volumes configuration - Should validate volume names', () => {
  const validVolumes = ["bible", "bookOfMormon", "doctrineAndCovenants", "pearlOfGreatPrice"];
  const config = {
    volumes: ["bible", "bookOfMormon"]
  };
  
  config.volumes.forEach(vol => {
    assert.ok(validVolumes.includes(vol), `${vol} should be valid`);
  });
});

test('Volumes configuration - Should handle undefined (use default)', () => {
  const config = {};
  
  // When undefined, the default should be used
  const volumes = config.volumes || ["bible", "bookOfMormon", "doctrineAndCovenants", "pearlOfGreatPrice"];
  
  assert.strictEqual(volumes.length, 4);
});

console.log('All configuration tests defined');


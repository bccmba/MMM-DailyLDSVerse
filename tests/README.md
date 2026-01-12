# Test Suite for MMM-DailyLDSVerse

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests by Category
```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end flow tests
npm run test:performance   # Performance tests
npm run test:dom           # DOM rendering tests
```

### Run Specific Test Files
```bash
node --test tests/node-helper.test.js
node --test tests/integration.test.js
```

## Test Files

### Unit Tests

#### `node-helper.test.js`
Core utility function tests:
- `getDayOfYear()` - Day of year calculation
- `getVolumeForDay()` - Volume selection logic
- `getVerseIndexForDay()` - Verse index calculation
- `getNextMidnight()` - Midnight calculation

#### `node-helper-complete.test.js`
Comprehensive node_helper tests:
- Verse selection logic
- Verse data format handling
- Volume cycling

#### `main-module.test.js`
Main module logic tests:
- DOM structure logic
- State management
- Update scheduling
- Header configuration

#### `configuration.test.js`
Configuration handling tests:
- Update interval configuration
- Header configuration
- Configuration merging

#### `validation.test.js`
Data validation tests:
- Verse reference format validation
- Verse content validation
- Day coverage validation

#### `error-handling.test.js`
Error handling and edge case tests:
- File loading errors
- Invalid data handling
- Error recovery

#### `convert-lds-data.test.js`
Verse list conversion script tests:
- Verse conversion logic
- Volume identification
- Reference parsing

### Integration Tests

#### `integration.test.js`
Integration between module and node_helper:
- Verse list file loading
- Socket notification flow
- End-to-end verse selection
- Configuration integration
- File format compatibility

#### `file-system.test.js`
File system operations:
- File existence and accessibility
- File format validation
- Error handling for missing/corrupted files
- File permissions
- Format consistency

#### `module-lifecycle.test.js`
Module lifecycle management:
- Module initialization
- Start sequence
- State transitions
- DOM update triggers
- Stop/cleanup
- Update scheduling

### End-to-End Tests

#### `e2e-flow.test.js`
Complete user flows:
- Module initialization and first verse load
- Daily update at midnight
- Error recovery flow
- Configuration change flow
- Volume rotation over multiple days
- Year boundary transition
- Leap year handling
- Multiple module instances

### Performance Tests

#### `performance.test.js`
Performance and load characteristics:
- Verse list file loading performance
- Verse selection performance
- Day of year calculation performance
- Memory efficiency
- Update scheduling performance
- Large file handling
- Repeated operations

### DOM Tests

#### `dom-rendering.test.js`
DOM structure and rendering:
- Loading state DOM structure
- Error state DOM structure
- Success state DOM structure
- CSS class application
- Text content sanitization
- Element order
- Header visibility

### Other Tests

#### `api-research.test.js`
API research script (utility, not unit test):
- Tests potential API endpoints
- Kept for reference only

#### `utils.test.js`
Placeholder for utility function tests (if utils.js is created in future)

## Test Coverage Summary

### Unit Tests ✅
- Day of year calculation (including leap years)
- Volume selection (daily cycling)
- Verse index calculation (variety formula)
- Midnight calculation
- Configuration handling
- Error handling
- Data validation

### Integration Tests ✅
- Socket communication
- File system operations
- Module lifecycle
- Configuration integration

### End-to-End Tests ✅
- Complete initialization flow
- Daily update flow
- Error recovery flow
- Year boundary handling
- Leap year handling

### Performance Tests ✅
- Load time performance
- Memory efficiency
- Large file handling

### DOM Tests ✅
- DOM structure validation
- CSS class application
- Text sanitization

## Test Statistics

- **Total Test Files**: 11
- **Test Categories**: 5 (Unit, Integration, E2E, Performance, DOM)
- **Coverage Areas**: Module logic, file operations, DOM rendering, performance, error handling

## Running Tests in CI/CD

For continuous integration, you can run specific test suites:

```bash
# Fast unit tests for quick feedback
npm run test:unit

# Integration tests for staging
npm run test:integration

# Full test suite for release
npm test
```

## Test Best Practices

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test interactions between components
3. **E2E Tests**: Test complete user flows
4. **Performance Tests**: Monitor load times and memory usage
5. **DOM Tests**: Verify correct rendering and structure

## Troubleshooting Tests

If tests fail:
1. Verify verse list files exist in `verses/` directory
2. Check file permissions (files should be readable)
3. Ensure Node.js version is compatible (v14+)
4. Check test output for specific error messages


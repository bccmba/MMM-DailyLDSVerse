# CI/CD Pipeline Setup Guide

This document describes the CI/CD pipeline configuration for MMM-DailyLDSVerse and how to integrate it with your CI/CD system.

## Overview

The module includes CI/CD configurations for:
- **GitHub Actions** (`.github/workflows/`)
- **GitLab CI** (`.gitlab-ci.yml`)

## GitHub Actions

### Workflows

#### 1. CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **Test**: Runs all test suites across Node.js 18.x and 20.x
  - Unit tests
  - Integration tests
  - E2E tests
  - DOM tests
  - Performance tests (non-blocking)
- **Lint**: Checks JavaScript syntax and JSON validity
- **Build**: Verifies module structure and file presence

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

#### 2. Release Workflow (`.github/workflows/release.yml`)

Runs when a release is created or manually triggered.

**Jobs:**
- **Release Check**: Verifies release readiness
  - Version validation
  - Full test suite
  - Verse list file verification
  - Documentation verification

**Triggers:**
- Release creation
- Manual workflow dispatch

### Setup Instructions

1. **Enable GitHub Actions** (if not already enabled):
   - Go to repository Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

2. **Push workflow files**:
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions CI/CD workflows"
   git push origin main
   ```

3. **Verify workflow runs**:
   - Go to repository → Actions tab
   - Workflows should run automatically on push

### Customization

To customize the workflows:

1. **Change Node.js versions**: Edit `strategy.matrix.node-version` in `ci.yml`
2. **Add additional test steps**: Add new steps in the `test` job
3. **Modify triggers**: Update `on:` section in workflow files

## GitLab CI

### Pipeline Stages

1. **test**: Runs all test suites
2. **lint**: Syntax and JSON validation
3. **build**: Structure verification

### Jobs

- `test:unit` - Unit tests only
- `test:integration` - Integration tests
- `test:e2e` - End-to-end tests
- `test:all` - All tests
- `lint` - Linting and validation
- `build` - Build verification

### Setup Instructions

1. **Push `.gitlab-ci.yml`**:
   ```bash
   git add .gitlab-ci.yml
   git commit -m "Add GitLab CI/CD configuration"
   git push origin main
   ```

2. **Enable GitLab CI** (if not already enabled):
   - Go to repository → Settings → CI/CD
   - Ensure "CI/CD" is enabled

3. **Verify pipeline runs**:
   - Go to repository → CI/CD → Pipelines
   - Pipeline should run automatically on push

### Customization

To customize the pipeline:

1. **Change Node.js version**: Edit `NODE_VERSION` variable
2. **Add stages**: Add to `stages:` array
3. **Modify job conditions**: Update `only:` sections

## Requirements

### Prerequisites

- **Node.js**: Version 18.x or 20.x (specified in CI configs)
- **Verse List Files**: Must be present in `verses/` directory
- **No Dependencies**: Module has no npm dependencies (uses built-in Node.js modules)

### File Requirements

The CI pipeline expects:
- ✅ `MMM-DailyLDSVerse.js` - Main module file
- ✅ `node_helper.js` - Node helper file
- ✅ `package.json` - Package configuration
- ✅ `verses/*.json` - Verse list files (4 files)
- ✅ `tests/` - Test directory
- ✅ `README.md` - Documentation

## Test Execution in CI

### Test Scripts

The CI pipeline uses these npm scripts:

```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:dom           # DOM tests
npm run test:performance   # Performance tests
```

### Test Environment

Tests run in a clean CI environment:
- Fresh Node.js installation
- No cached dependencies
- Isolated test execution
- Verse list files must be committed to repository

## CI/CD Best Practices

### 1. Fast Feedback

- Unit tests run first (fastest)
- Integration tests run in parallel
- Performance tests are non-blocking

### 2. Fail Fast

- Syntax errors caught in lint stage
- Invalid JSON caught early
- Missing files detected in build stage

### 3. Comprehensive Coverage

- All test categories run
- Multiple Node.js versions tested
- File validation included

### 4. Release Safety

- Release workflow verifies everything
- Version validation
- Documentation check

## Troubleshooting CI/CD

### Common Issues

#### Tests Fail in CI but Pass Locally

**Possible Causes:**
- Missing verse list files (not committed)
- File path differences (Windows vs Linux)
- Node.js version differences

**Solutions:**
- Ensure `verses/*.json` files are committed
- Use relative paths in tests
- Match Node.js version in CI config

#### Performance Tests Fail

**Solution:**
- Performance tests are marked `continue-on-error: true`
- They may vary by CI environment
- Adjust thresholds if needed

#### JSON Validation Fails

**Solution:**
- Verify verse list files are valid JSON
- Check file encoding (should be UTF-8)
- Ensure files are not corrupted

### Debugging

1. **Check CI logs**: Review full output in CI/CD interface
2. **Run locally**: Reproduce CI commands locally
3. **Verify files**: Ensure all required files are present
4. **Check Node version**: Match CI Node.js version locally

## Adding New CI Features

### Code Coverage

To add code coverage reporting:

1. Install coverage tool:
   ```bash
   npm install --save-dev c8
   ```

2. Add coverage script to `package.json`:
   ```json
   "scripts": {
     "test:coverage": "c8 npm test"
   }
   ```

3. Add coverage step to CI:
   ```yaml
   - name: Generate coverage report
     run: npm run test:coverage
   
   - name: Upload coverage
     uses: codecov/codecov-action@v3
   ```

### Automated Releases

To automate releases:

1. Add release workflow step
2. Use semantic versioning
3. Create GitHub releases automatically
4. Publish to npm (if applicable)

### Security Scanning

To add security scanning:

1. Add Dependabot (GitHub) or similar
2. Run security audits
3. Scan for vulnerabilities

## CI/CD Status Badges

Add to README.md:

```markdown
![CI](https://github.com/yourusername/MMM-DailyLDSVerse/workflows/CI/badge.svg)
```

For GitLab:
```markdown
![pipeline status](https://gitlab.com/yourusername/MMM-DailyLDSVerse/badges/main/pipeline.svg)
```

## Next Steps

1. ✅ **Push CI/CD files** to repository
2. ✅ **Enable CI/CD** in your platform (GitHub/GitLab)
3. ✅ **Verify first pipeline run**
4. ✅ **Add status badges** to README
5. ⏳ **Optional**: Add code coverage
6. ⏳ **Optional**: Add automated releases

## Support

For CI/CD issues:
- Check CI/CD logs for specific errors
- Verify all required files are committed
- Ensure Node.js version matches CI config
- Review this guide for common solutions


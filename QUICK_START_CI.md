# Quick Start: CI/CD Integration

## What's Included

✅ **GitHub Actions** workflows (`.github/workflows/`)
✅ **GitLab CI** configuration (`.gitlab-ci.yml`)
✅ **Test scripts** in `package.json`
✅ **Documentation** (CI_CD_SETUP.md)

## Quick Setup (5 minutes)

### For GitHub

1. **Push the CI files**:
   ```bash
   git add .github/ .gitlab-ci.yml CI_CD_SETUP.md
   git commit -m "Add CI/CD pipeline configuration"
   git push origin main
   ```

2. **Verify it works**:
   - Go to your GitHub repository
   - Click "Actions" tab
   - You should see the CI workflow running

3. **Done!** ✅
   - CI runs automatically on every push
   - Tests run on Node.js 18.x and 20.x
   - Pull requests are automatically tested

### For GitLab

1. **Push the CI file**:
   ```bash
   git add .gitlab-ci.yml
   git commit -m "Add GitLab CI/CD configuration"
   git push origin main
   ```

2. **Verify it works**:
   - Go to your GitLab repository
   - Click "CI/CD" → "Pipelines"
   - You should see the pipeline running

3. **Done!** ✅

## What Gets Tested

### On Every Push/PR

- ✅ All unit tests
- ✅ Integration tests
- ✅ E2E tests
- ✅ DOM rendering tests
- ✅ Performance tests
- ✅ Code syntax validation
- ✅ JSON file validation
- ✅ Module structure verification

### On Release

- ✅ Full test suite
- ✅ Version validation
- ✅ Verse list file verification
- ✅ Documentation check

## Requirements

- ✅ Verse list files must be committed to repository
- ✅ Node.js 18.x or 20.x (handled by CI)
- ✅ No npm dependencies (uses built-in modules)

## Troubleshooting

### CI Fails: "Verse list files not found"

**Solution**: Ensure verse list files are committed:
```bash
git add verses/*.json
git commit -m "Add verse list files"
git push
```

### CI Fails: "Tests fail"

**Solution**: Run tests locally first:
```bash
npm test
```

Fix any failing tests before pushing.

### CI Fails: "Invalid JSON"

**Solution**: Verify JSON files are valid:
```bash
node -e "JSON.parse(require('fs').readFileSync('verses/bible.json','utf8'))"
```

## Next Steps

1. ✅ Push CI/CD files
2. ✅ Verify first pipeline run
3. ⏳ Add status badge to README (already added)
4. ⏳ Optional: Add code coverage
5. ⏳ Optional: Set up automated releases

## Need Help?

See [CI_CD_SETUP.md](CI_CD_SETUP.md) for detailed documentation.


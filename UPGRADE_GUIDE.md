# Upgrade Guide

## Upgrading from an older version

If you're upgrading from a previous version of MMM-DailyLDSVerse, you may encounter issues when pulling the latest changes.

### Error: "package-lock.json would be overwritten by merge"

If you get this error when running `git pull`:

```
error: The following untracked working tree files would be overwritten by merge: package-lock.json
Please move or remove them before you merge
Abortin
```

**Quick Fix:**
```bash
rm package-lock.json
git pull
```

**Explanation:** This occurs because the module previously didn't include a `package-lock.json` file, and you may have run `npm install` locally which created one. The simplest solution is to remove it before pulling.

### Upgrading Steps

1. **Remove the local package-lock.json** (if it exists):
   ```bash
   rm package-lock.json
   ```

2. **Pull the latest changes:**
   ```bash
   cd ~/MagicMirror/modules/MMM-DailyLDSVerse
   git pull
   ```

3. **Restart Magic Mirror:**
   ```bash
   pm2 restart mm
   ```

### New Installation

If you're installing MMM-DailyLDSVerse for the first time, no special steps are needed:
```bash
cd ~/MagicMirror/modules
git clone https://github.com/bccmba/MMM-DailyLDSVerse.git
```

Then add the module to your `config.js` as shown in the README.

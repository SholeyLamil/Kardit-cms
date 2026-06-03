# 🔧 Comprehensive Troubleshooting Guide

## Pre-Flight Checklist

Before running the script, verify:

- [ ] You have Node.js 14+ installed: `node --version`
- [ ] You have npm installed: `npm --version`
- [ ] You're in the correct project directory: `pwd` (should show your project root)
- [ ] You have a `dist` folder: `ls dist/` (should show `index.html` and `assets/`)
- [ ] You have `dist/assets/*.js` files: `ls dist/assets/`
- [ ] You have run `npm run build` recently

---

## Installation Issues

### ❌ "npm: command not found"
**Cause:** Node.js/npm not installed
**Solution:**
1. Download Node.js from https://nodejs.org/ (use LTS version)
2. Install it
3. Restart your terminal
4. Verify: `node --version` and `npm --version`

### ❌ "Cannot find module 'rollup'"
**Cause:** Dependencies not installed
**Solution:**
```bash
# Reinstall all dependencies
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs

# Verify installation
npm list rollup
```

### ❌ "EACCES: permission denied"
**Cause:** Missing write permissions
**Solution (macOS/Linux):**
```bash
# Try with sudo (not ideal, but works)
sudo npm install --save-dev rollup

# Or fix npm permissions permanently
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install --save-dev rollup
```

### ❌ "npm ERR! code ERESOLVE"
**Cause:** Dependency conflict
**Solution:**
```bash
# Use legacy peer deps flag
npm install --save-dev --legacy-peer-deps rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs

# Or clear cache and retry
npm cache clean --force
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

### ❌ "Module not found after npm install"
**Cause:** Corrupted node_modules
**Solution:**
```bash
# Complete clean reinstall
rm -rf node_modules package-lock.json
npm install
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

---

## Script Execution Issues

### ❌ "dist directory not found"
**Cause:** Running script from wrong directory or missing dist folder
**Solution:**
```bash
# 1. Verify you're in project root
pwd  # Should show your project path

# 2. Check if dist folder exists
ls dist/

# 3. If not, run a build first
npm run build

# 4. Then run the script
node flatten-build-enhanced.js
```

### ❌ "No JavaScript files found in dist/assets"
**Cause:** Build incomplete or not in assets folder
**Solution:**
```bash
# 1. Check what's in assets
ls -la dist/assets/

# 2. Verify build completed
npm run build -- --verbose

# 3. Check for hidden files
ls -la dist/assets/ | grep -E "\\.js$|\\.css$"

# 4. Ensure Vite config has correct output
# Check vite.config.js has: build: { outDir: 'dist' }
```

### ❌ "Cannot read property 'length' of undefined"
**Cause:** Rollup plugin error or corrupted JS file
**Solution:**
```bash
# 1. Try basic version instead
node flatten-build.js

# 2. Check for corrupted files
find dist/assets -name "*.js" -exec wc -l {} \;

# 3. Rebuild from scratch
rm -rf dist
npm run build
node flatten-build-enhanced.js

# 4. Run with debug
DEBUG=1 node flatten-build-enhanced.js
```

### ❌ "Error: ENOENT: no such file or directory"
**Cause:** Missing or deleted file during processing
**Solution:**
```bash
# 1. Verify dist folder is not being modified
npm run build

# 2. Close any file editors that might lock files
# (on Windows, file handles can be locked)

# 3. Try again
node flatten-build-enhanced.js

# 4. On Windows, try in a new terminal
cmd /c "node flatten-build-enhanced.js"
```

---

## Build Output Issues

### ❌ "offline_ready_site/index.html not created"
**Cause:** Script failed silently or didn't write file
**Solution:**
```bash
# 1. Check script output carefully for errors
node flatten-build-enhanced.js 2>&1 | tee build.log

# 2. Verify directory can be created
mkdir -p offline_ready_site

# 3. Check write permissions
touch offline_ready_site/test.txt

# 4. Try explicit path
DEBUG=1 node flatten-build-enhanced.js
```

### ❌ "offline_ready_site/index.html is empty or very small"
**Cause:** Bundling failed silently
**Solution:**
```bash
# 1. Check file size
ls -lh offline_ready_site/index.html

# 2. Compare to original
ls -lh dist/index.html

# 3. View the generated HTML
head -100 offline_ready_site/index.html

# 4. If empty, re-run with debug
DEBUG=1 node flatten-build-enhanced.js 2>&1
```

### ❌ "Generated file size is unexpected"
**Causes:**
- Too large: CSS/JS might be duplicated
- Too small: Not all assets bundled

**Solution:**
```bash
# Check what got bundled
wc -c offline_ready_site/index.html

# Compare to original assets
du -sh dist/
du -sh dist/assets/

# Try basic version
node flatten-build.js

# Check if minified
npm run build -- --minify=terser
node flatten-build-enhanced.js
```

---

## Browser / Runtime Issues

### ❌ "Blank white page when opened"
**Causes:**
- JavaScript error
- React mounting issue
- CSS issues
- Module system not working

**Solution:**
```bash
# 1. Open Developer Console (F12 or Cmd+Option+I)
# → Look for red errors

# 2. Check for common errors:
# "Cannot find module" → Dynamic import issue
# "Cannot read property of undefined" → Initialization error
# "CORS" → Wrong protocol (use file://, not http://)

# 3. Verify original build works
npm run build
npm run preview  # Should show app working

# 4. Try basic version
node flatten-build.js
# Open in browser and check console

# 5. Check React root element
grep -n "id=\"root\"" offline_ready_site/index.html
# Should show: <div id="root"></div>
```

### ❌ "Module not found: [module-name]"
**Cause:** Dynamic import couldn't be resolved
**Solution:**
```bash
# 1. Check console for exact module name
# Example: "Module not found: ./routes/Home"

# 2. Check if file exists
ls dist/assets/ | grep -i home

# 3. The script should have bundled it
# If not, try:
node flatten-build-enhanced.js

# 4. Some imports might be truly external
# Edit the script to mark them as external:
# external: ['external-module']

# 5. Verify relative imports in source use ./
# Bad: import { Component } from 'routes/Home'
# Good: import { Component } from './routes/Home'
```

### ❌ "Styles not loading / CSS not applied"
**Cause:** CSS didn't get extracted or inlined correctly
**Solution:**
```bash
# 1. Check if CSS file was generated
grep -c "<style>" offline_ready_site/index.html

# 2. View the extracted CSS
grep -A 100 "<style>" offline_ready_site/index.html | head -20

# 3. Check original CSS exists
ls -la dist/assets/*.css

# 4. Try enhanced version (better CSS handling)
node flatten-build-enhanced.js

# 5. Check for CSS compilation errors
npm run build -- --verbose
```

### ❌ "Works in dist/index.html but not in offline_ready_site"
**Cause:** Dynamic imports behaving differently
**Solution:**
```bash
# 1. Serve dist via local server for comparison
npx serve dist/

# 2. The difference is likely dynamic imports
# The script should handle these, but:

# 3. Check what's being imported
grep -r "import(" dist/assets/ | head -10

# 4. Try basic version
node flatten-build.js

# 5. If basic works but enhanced doesn't
# There's an issue with CSS extraction
# Revert to basic or debug CSS

# 6. Check console warnings
# They might give hints about what failed
```

---

## Platform-Specific Issues

### 🪟 Windows Issues

#### ❌ "Cannot find files with special characters"
**Solution:**
```powershell
# Use PowerShell instead of CMD
pwsh
node flatten-build-enhanced.js

# Or use backslash escaping
cd "offline_ready_site"
```

#### ❌ "File in use" errors
**Solution:**
```powershell
# Close the file in other programs
# VS Code might lock the file during preview
# Close any open file viewers

# Kill any hanging node processes
taskkill /F /IM node.exe
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
node flatten-build-enhanced.js
```

#### ❌ "Path too long"
**Solution:**
```powershell
# Move project to shorter path
# Windows has MAX_PATH of 260 characters
# Move: C:\Users\YourName\Very\Long\Nested\Folder\Structure\project
# To: C:\dev\project

# Or enable long paths (Windows 10+)
# Run as admin:
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1
```

### 🍎 macOS Issues

#### ❌ "Cannot open file" (Security warning)
**Solution:**
```bash
# macOS might block unsigned scripts
# Open via terminal instead
node flatten-build-enhanced.js

# Or allow execution
chmod +x flatten-build-enhanced.js
./flatten-build-enhanced.js
```

#### ❌ "xcrun: error" during npm install
**Solution:**
```bash
# Update Xcode command line tools
xcode-select --install

# Or set path
sudo xcode-select --reset

# Then retry
npm install --save-dev rollup
```

### 🐧 Linux Issues

#### ❌ "Permission denied"
**Solution:**
```bash
# Grant execute permissions
chmod +x flatten-build-enhanced.js

# Then run
./flatten-build-enhanced.js
# or
node flatten-build-enhanced.js
```

#### ❌ "node: command not found"
**Solution:**
```bash
# Install Node.js via package manager
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install nodejs npm

# Fedora:
sudo dnf install nodejs npm

# Arch:
sudo pacman -S nodejs npm

# Verify
node --version
```

---

## Advanced Debugging

### Enable Full Debug Output

```bash
# Add debug output
DEBUG=1 node flatten-build-enhanced.js

# Or even more detailed
DEBUG=* node flatten-build-enhanced.js

# Capture output to file
node flatten-build-enhanced.js > build-output.log 2>&1
cat build-output.log
```

### Manual Step-by-Step Testing

```bash
# 1. Check Node.js
node -v

# 2. Check npm
npm -v

# 3. Check dist folder
ls -R dist/

# 4. Test rollup directly
npx rollup --version

# 5. Check package.json
cat package.json | grep -A 5 "devDependencies"

# 6. Check if modules exist
node -e "console.log(require.resolve('rollup'))"
```

### Test File Parsing

```bash
# Check if main JS file is valid
node -c dist/assets/main.*.js

# Check if HTML is valid
node -e "
const fs = require('fs');
const html = fs.readFileSync('offline_ready_site/index.html', 'utf8');
console.log('HTML size:', html.length);
console.log('Has <script>:', html.includes('<script'));
console.log('Has root div:', html.includes('id=\"root\"'));
"
```

---

## Performance Optimization Debugging

### File Size Issues

```bash
# Check original build size
du -sh dist/
du -sh dist/assets/

# Check generated file size
du -sh offline_ready_site/index.html

# Compare
ls -lh dist/index.html offline_ready_site/index.html

# Find what's large in the bundle
# (Install source-map-explorer if using source maps)
npm install source-map-explorer
source-map-explorer 'dist/assets/*.js'
```

### Speed Issues

```bash
# Time the build
time node flatten-build-enhanced.js

# Profile with Node.js
node --prof flatten-build-enhanced.js
node --prof-process isolate-*.log > profile.txt
cat profile.txt | head -50

# Check system resources during build
# Open system monitor/Activity Monitor in separate terminal
# Watch CPU/Memory while build runs
```

---

## Getting Help

If you still have issues:

1. **Check the browser console (F12)**
   - Look for red error messages
   - Copy the exact error message

2. **Run with debug enabled**
   ```bash
   DEBUG=1 node flatten-build-enhanced.js 2>&1 | tee debug.log
   ```
   - Share the output

3. **Check these files exist**
   ```bash
   ls dist/index.html
   ls dist/assets/main.*.js
   node_modules/rollup/package.json
   ```

4. **Verify your setup**
   ```bash
   node --version  # Should be 14+
   npm --version   # Should be 6+
   npm list rollup # Should show rollup version
   ```

5. **Try the simplest possible case**
   ```bash
   # Start fresh
   rm -rf offline_ready_site
   npm run build
   node flatten-build.js  # Try basic version
   ```

---

## Recovery Steps

If everything is broken:

```bash
# Full reset
rm -rf node_modules package-lock.json offline_ready_site

# Reinstall fresh
npm install
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs

# Rebuild everything
npm run build

# Try basic script first
node flatten-build.js

# If that works, try enhanced
node flatten-build-enhanced.js
```

---

## Success Indicators ✅

Your build was successful if:

- [ ] `offline_ready_site/index.html` was created
- [ ] File size is > 100 KB (depends on your app)
- [ ] File can be double-clicked to open in browser
- [ ] Page loads and shows content (not blank)
- [ ] Browser console has no red errors
- [ ] Page works when disconnected from internet
- [ ] Links and buttons function correctly
- [ ] Styles are applied correctly

---

Need more help? Create an issue or check the main INSTALLATION.md file for more details.

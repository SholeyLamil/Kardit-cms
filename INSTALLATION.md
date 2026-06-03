# 🚀 Flatten Build - Complete Installation & Usage Guide

## Overview

Convert your Vite/React Router production build with code-splitting into a **single, self-contained HTML file** that works offline with the `file://` protocol.

## 📋 Prerequisites

- **Node.js** v14 or higher (check with: `node --version`)
- **npm** or **yarn**
- A production build in the `dist` folder (run: `npm run build`)

## 🔧 Installation

### Option 1: Automatic Installation (Recommended)

Run this command in your project root:

```bash
node setup.js 2
```

This will:
1. Check your environment
2. Install all required dependencies
3. Run the enhanced flatten-build script
4. Generate `offline_ready_site/index.html`

### Option 2: Manual Installation

```bash
# Install dependencies
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs

# Run basic version
node flatten-build.js

# OR run enhanced version (more features)
node flatten-build-enhanced.js
```

### Option 3: Add to package.json

Add these to your `package.json` file:

```json
{
  "devDependencies": {
    "rollup": "^4.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0"
  },
  "scripts": {
    "build": "vite build",
    "build:offline": "npm run build && node flatten-build-enhanced.js"
  }
}
```

Then run:
```bash
npm install
npm run build:offline
```

## 📊 Available Scripts

### 1. **flatten-build.js** (Basic)
Fast, straightforward bundling with minimal logging.

```bash
node flatten-build.js
```

**Pros:**
- Lightweight, quick execution
- Essential features only
- Smaller output for debugging

**Cons:**
- Less detailed logging
- Fewer error recovery options

### 2. **flatten-build-enhanced.js** (Recommended)
Enhanced version with better CSS handling and detailed logging.

```bash
node flatten-build-enhanced.js
```

**Pros:**
- Better CSS extraction and @import handling
- Detailed progress logging
- Better error messages
- Robust chunk detection

**Cons:**
- Slightly longer execution time
- More verbose output

### 3. **setup.js** (Quick Start)
Automated setup that installs dependencies and runs a script.

```bash
# Show available options
node setup.js

# Run basic version
node setup.js 1
node setup.js basic

# Run enhanced version
node setup.js 2
node setup.js enhanced
```

## 🎯 Quick Start (5 minutes)

```bash
# 1. Navigate to your project root
cd path/to/your/project

# 2. Make sure you have a production build
npm run build

# 3. Option A: Automatic (recommended)
node setup.js 2

# Option B: Manual
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
node flatten-build-enhanced.js

# 4. Open the generated file
# Windows: start offline_ready_site\index.html
# Mac: open offline_ready_site/index.html
# Linux: xdg-open offline_ready_site/index.html

# OR just double-click the file in your file explorer!
```

## 📁 What Gets Generated

```
your-project/
├── dist/                          (original Vite build)
│   ├── index.html
│   ├── assets/
│   │   ├── main.xxxxx.js
│   │   ├── main.xxxxx.css
│   │   ├── chunk-about.xxxxx.js
│   │   ├── chunk-contact.xxxxx.js
│   │   └── ... more chunks
│
├── offline_ready_site/            ← GENERATED
│   └── index.html                 ← Single file, no dependencies!
│
├── flatten-build.js               (basic script)
├── flatten-build-enhanced.js      (recommended script)
├── setup.js                       (auto installer)
└── INSTALLATION.md                (this file)
```

## ✅ Verification

After running the script:

1. **Check output was created:**
   ```bash
   ls -la offline_ready_site/
   # Should show: index.html (size will be larger than original, all assets inlined)
   ```

2. **Open in browser:**
   - Windows File Explorer: Right-click `offline_ready_site/index.html` → Open with browser
   - Or drag and drop into browser
   - Or copy file path and paste in address bar as `file:///path/to/offline_ready_site/index.html`

3. **Test offline functionality:**
   - Disconnect from internet (or use browser DevTools offline mode)
   - Refresh the page
   - Should still work perfectly!

## 🔍 Troubleshooting

### "dist directory not found"
```bash
# Solution: Run a production build first
npm run build
node flatten-build-enhanced.js
```

### "No JavaScript files found in dist/assets"
```bash
# Solution: Verify dist/assets/ contains .js files
ls dist/assets/

# If empty, your build might have failed
npm run build --verbose
```

### "Module not found" errors in console
These are usually harmless if from optional dependencies. Check the console for the specific module name.

To debug:
```bash
DEBUG=1 node flatten-build-enhanced.js
```

### File is too large
The single-file approach bundles everything together, which increases total size because:
- No compression between files
- Duplicate code can't be deduplicated across chunks
- All CSS is inline

**Solutions:**
1. Keep the `dist` folder for users with better connections
2. Use gzip compression on your server
3. Minify your React app more aggressively

### White/blank page when opened
**Causes:**
- Dynamic imports that couldn't be resolved
- React mount point (#root) missing
- CSS issues

**Solutions:**
1. Check browser console for errors (F12)
2. Verify original build works: `npm start`
3. Try both basic and enhanced scripts
4. Check that `dist/index.html` has a `<div id="root"></div>`

### CORS errors still appearing
If you see "Failed to fetch dynamically imported module" errors:

1. This is normal for some edge cases
2. Make sure you're using `file://` protocol (not `http://`)
3. Check that all imports are relative paths
4. Try the enhanced version which has better import handling

## 🛠️ Advanced Usage

### Modify Output Directory

Edit the script file:
```javascript
// Line: const OUTPUT_DIR = ...
const OUTPUT_DIR = path.join(__dirname, 'my-custom-folder');
```

Then run:
```bash
node flatten-build-enhanced.js
```

### Exclude Specific Modules

In the Rollup configuration section:
```javascript
external: ['react-dom', 'some-large-library'],  // Don't bundle these
globals: {
  'react-dom': 'ReactDOM',
  'some-large-library': 'SomeLib'
}
```

### Build Multiple Formats

Create a wrapper script:
```javascript
const scripts = ['flatten-build.js', 'flatten-build-enhanced.js'];
for (const script of scripts) {
  require(script);
}
```

## 📈 Performance Tips

1. **Remove source maps before building:**
   Edit your `vite.config.js`:
   ```javascript
   export default {
     build: {
       sourcemap: false  // Reduces bundle size
     }
   }
   ```
   Then rebuild:
   ```bash
   npm run build
   node flatten-build-enhanced.js
   ```

2. **Use compression:**
   ```bash
   # Compress the final HTML (still text, so very compressible)
   gzip offline_ready_site/index.html -c > offline_ready_site/index.html.gz
   ```

3. **Lazy load non-critical features:**
   Consider keeping critical paths bundled while lazy-loading heavy features.

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank page | Dynamic imports failed | Check console (F12), verify build succeeded |
| Large file size | All code bundled together | Normal for this approach, remove source maps |
| "Module registry not found" | Dynamic import system issue | Verify script ran without errors |
| CSS not loading | CSS extraction failed | Try enhanced version, check dist/assets/*.css exists |
| "Cannot find module X" | Missing dependency | Ensure npm install ran, check node_modules/ |

## 📚 Understanding the Process

### What the script does:

1. **Scans** `dist/assets/` for all `.js` and `.css` files
2. **Bundles** everything using Rollup into a single IIFE (Immediately Invoked Function Expression)
3. **Inlines** all CSS directly into a `<style>` tag
4. **Registers** all modules in a global registry for dynamic imports
5. **Generates** a single `index.html` with everything embedded
6. **Outputs** to `offline_ready_site/` ready to use offline

### Why it works:

- **IIFE** wrapping prevents global namespace pollution
- **Module registry** simulates dynamic imports without requiring a server
- **Inlined assets** eliminate file loading dependencies
- **file://** protocol no longer blocks anything since everything is in one file

## ⚙️ System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| Node.js | 14.0.0 | 18+ |
| npm | 6.0.0 | 8+ |
| Disk Space | 100 MB | 500 MB |
| RAM | 512 MB | 2 GB |

## 📞 Need Help?

1. **Check the scripts have execute permissions:**
   ```bash
   chmod +x flatten-build.js flatten-build-enhanced.js setup.js
   ```

2. **Verify all dependencies are installed:**
   ```bash
   npm list rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
   ```

3. **Run with debug mode:**
   ```bash
   DEBUG=1 node flatten-build-enhanced.js
   ```

4. **Check Node.js and npm versions:**
   ```bash
   node --version
   npm --version
   ```

## 📝 License & Attribution

These scripts use:
- [Rollup](https://rollupjs.org/) - Module bundler
- [@rollup plugins](https://github.com/rollup/plugins) - CommonJS and Node resolution

## 🎉 You're All Set!

Your production-ready, offline-capable single-file application is ready. Share the `offline_ready_site/index.html` file with anyone, and it will work perfectly in their browser without any setup or internet connection.

Happy building! 🚀

# Flatten Build Setup Guide

This script converts your Vite/React Router build with code-splitting into a single offline-ready HTML file.

## Installation

Run these commands in your project root:

```bash
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

**Dependencies needed:**
- `rollup` - Module bundler
- `@rollup/plugin-node-resolve` - Resolves node modules
- `@rollup/plugin-commonjs` - Converts CommonJS to ES modules

## Quick Start

### 1. Navigate to your project root
```bash
cd c:\Users\Sholeyy\Downloads\kardit-merged (5)\kardit-react
```

### 2. Run the script
```bash
node flatten-build.js
```

### 3. Open the result
The script generates `offline_ready_site/index.html`. Open it by:
- Double-clicking the file in File Explorer
- Or opening directly in any browser

## What the script does

✅ **Bundles all JS chunks** - Combines main.js, route chunks, and lazy-loaded components  
✅ **Resolves dynamic imports** - Converts `import('./route')` to work in single file  
✅ **Inlines all CSS** - Extracts and embeds all stylesheets  
✅ **Works offline** - Eliminates CORS issues with `file://` protocol  
✅ **Single file** - Creates a standalone HTML that needs no server  

## Troubleshooting

### "Assets directory not found"
- Ensure you have run a production build: `npm run build`
- Check that `dist/assets` folder exists

### "No JavaScript files found"
- Verify your Vite build completed successfully
- Make sure `dist/assets` contains `.js` files

### File size too large
- The single-file approach increases size due to inlining
- For very large apps, consider running with source maps removed:
  ```bash
  # In your Vite config: build.sourcemap = false
  npm run build
  node flatten-build.js
  ```

### Dynamic imports still failing
- Some complex dynamic imports might need manual refactoring
- Check browser console for specific import errors
- The script includes a module registry that can be extended

## Advanced Options

### Modifying the script

Edit `flatten-build.js` to:

1. **Change output directory:**
   ```javascript
   const OUTPUT_DIR = path.join(__dirname, 'your-folder-name');
   ```

2. **Adjust bundled code format:**
   ```javascript
   format: 'umd'  // or 'cjs', 'es', etc.
   ```

3. **Add external libraries:**
   ```javascript
   external: ['react', 'react-dom']  // These won't be bundled
   ```

## File Structure After Running

```
your-project/
├── dist/                        (original Vite build)
│   ├── index.html
│   ├── assets/
│   │   ├── main.xxxxx.js
│   │   ├── main.xxxxx.css
│   │   ├── chunk-1.xxxxx.js
│   │   └── chunk-2.xxxxx.js
│
└── offline_ready_site/          (generated single-file version)
    └── index.html              (self-contained, no dependencies)
```

## Requirements

- **Node.js** v14+
- **npm** or **yarn**
- A production build in the `dist` folder
- Rollup and plugins installed via npm

## Limitations & Notes

- **Size**: Single-file approach increases total size (all code bundled together)
- **Lazy loading**: Dynamic imports work but aren't truly lazy in single-file
- **Module scoping**: All code runs in IIFE (Immediately Invoked Function Expression)
- **Source maps**: Generated file is minified; consider keeping dist/ for debugging

## Support

If you encounter issues:
1. Check that `dist/index.html` and `dist/assets/` exist
2. Verify all dependencies installed: `npm list rollup`
3. Check Node.js version: `node --version` (should be v14+)
4. Try deleting `node_modules` and reinstalling: `npm install`

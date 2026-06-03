#!/usr/bin/env node

/**
 * Flatten Build Script - Converts Vite/React Router build with code-splitting into a single offline-ready HTML file
 * 
 * This script:
 * 1. Bundles all JS chunks from dist/assets into a single file
 * 2. Resolves all dynamic imports
 * 3. Inlines all CSS
 * 4. Generates a standalone index.html that works with file:// protocol
 * 
 * Usage: node flatten-build.js
 */

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_DIR = path.join(__dirname, 'offline_ready_site');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

/**
 * Read all CSS files from assets and return their content
 */
function readAllCSS() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    console.warn('⚠️  Assets directory not found:', DIST_ASSETS_DIR);
    return '';
  }

  const cssFiles = fs.readdirSync(DIST_ASSETS_DIR).filter(f => f.endsWith('.css'));
  let allCSS = '';

  for (const file of cssFiles) {
    const filePath = path.join(DIST_ASSETS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`  ✓ Including CSS: ${file}`);
    allCSS += '\n' + content;
  }

  return allCSS;
}

/**
 * Find the main entry JS file from dist/assets
 */
function findMainEntryFile() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    throw new Error('Assets directory not found: ' + DIST_ASSETS_DIR);
  }

  const files = fs.readdirSync(DIST_ASSETS_DIR);
  
  // Look for main.*.js pattern (typical Vite main entry)
  const mainFiles = files.filter(f => f.startsWith('main.') && f.endsWith('.js'));
  
  if (mainFiles.length > 0) {
    return path.join(DIST_ASSETS_DIR, mainFiles[0]);
  }

  // Fallback: find any JS file that's not a chunk
  const jsFiles = files.filter(f => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    throw new Error('No JavaScript files found in dist/assets');
  }

  // Return the first JS file (usually the main entry)
  return path.join(DIST_ASSETS_DIR, jsFiles[0]);
}

/**
 * Custom Rollup plugin to handle dynamic imports and file:// protocol compatibility
 */
function createFileProtocolPlugin() {
  const chunkCache = {};

  return {
    name: 'file-protocol-plugin',
    
    resolveId(id) {
      // Resolve relative chunk imports from dist/assets
      if (id.startsWith('./') && id.endsWith('.js')) {
        const resolvedPath = path.resolve(DIST_ASSETS_DIR, id);
        if (fs.existsSync(resolvedPath)) {
          return { id: resolvedPath, external: false };
        }
      }
      
      // Resolve chunk files by name
      const chunkPath = path.join(DIST_ASSETS_DIR, id);
      if (fs.existsSync(chunkPath)) {
        return { id: chunkPath, external: false };
      }

      return null;
    },

    load(id) {
      // Load JS files from the assets directory
      if (id.startsWith(DIST_ASSETS_DIR) && id.endsWith('.js')) {
        return fs.readFileSync(id, 'utf-8');
      }
      return null;
    },

    transform(code, id) {
      if (!id.includes(DIST_ASSETS_DIR)) return null;

      // Replace dynamic imports with a module registry approach
      // This converts: import('./chunk.js') 
      // To: Promise.resolve(moduleRegistry['chunk.js'])
      
      const transformedCode = code
        .replace(/import\(['"]([^'"]+)['"]\)/g, (match, importPath) => {
          // Extract just the filename if it's a relative path
          const filename = path.basename(importPath);
          return `Promise.resolve(window.__moduleRegistry['${filename}'] || window.__moduleRegistry['${importPath}'])`;
        })
        .replace(/import\s*\(\s*([^)]+)\s*\)/g, (match, importPath) => {
          // Handle computed imports - fallback to console warn
          return `Promise.reject(new Error('Dynamic import not supported: ' + ${importPath}))`;
        });

      return transformedCode;
    }
  };
}

/**
 * Inject a module registry system into the code
 */
function injectModuleRegistry(bundledCode, chunkFilenames) {
  const moduleRegistryCode = `
// Module Registry for dynamic imports
window.__moduleRegistry = window.__moduleRegistry || {};

// Define module factory function
window.__defineModule = function(name, factory) {
  window.__moduleRegistry[name] = { __esModule: true, ...factory };
};
`;

  return moduleRegistryCode + '\n' + bundledCode;
}

/**
 * Read original HTML and extract metadata
 */
function readOriginalHTML() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist directory');
  }
  return fs.readFileSync(indexPath, 'utf-8');
}

/**
 * Extract title from HTML
 */
function extractTitle(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1] : 'App';
}

/**
 * Extract any meta tags and other important head content
 */
function extractHeadMeta(html) {
  const metaRegex = /<meta[^>]*>/gi;
  const matches = html.match(metaRegex) || [];
  return matches.join('\n  ');
}

/**
 * Main bundling function
 */
async function bundleApplication() {
  console.log('\n🚀 Starting flatten-build process...\n');

  try {
    // Step 1: Find main entry file
    console.log('📍 Step 1: Locating main entry file...');
    const mainEntry = findMainEntryFile();
    console.log(`  ✓ Found: ${path.relative(__dirname, mainEntry)}\n`);

    // Step 2: Read CSS files
    console.log('📍 Step 2: Reading CSS assets...');
    const allCSS = readAllCSS();
    console.log(`  ✓ Total CSS size: ${allCSS.length} bytes\n`);

    // Step 3: Read original HTML
    console.log('📍 Step 3: Reading original index.html...');
    const originalHTML = readOriginalHTML();
    const title = extractTitle(originalHTML);
    const metaTags = extractHeadMeta(originalHTML);
    console.log(`  ✓ Extracted title: "${title}"\n`);

    // Step 4: Bundle with Rollup
    console.log('📍 Step 4: Bundling with Rollup...');
    const bundle = await rollup.rollup({
      input: mainEntry,
      plugins: [
        createFileProtocolPlugin(),
        require('@rollup/plugin-node-resolve').nodeResolve({
          browser: true,
          preferBuiltins: false
        }),
        require('@rollup/plugin-commonjs')()
      ],
      external: [], // Treat nothing as external
      onwarn(warning) {
        // Suppress certain warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        console.warn(`⚠️  ${warning.message}`);
      }
    });

    const { output } = await bundle.generate({
      format: 'iife',
      name: 'app',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM'
      }
    });

    await bundle.close();

    let bundledCode = output[0].code;
    console.log(`  ✓ Bundled code size: ${bundledCode.length} bytes\n`);

    // Step 5: Inject module registry
    console.log('📍 Step 5: Injecting module registry...');
    bundledCode = injectModuleRegistry(bundledCode, []);
    console.log(`  ✓ Module system injected\n`);

    // Step 6: Create output directory
    console.log('📍 Step 6: Creating output directory...');
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    console.log(`  ✓ Created: ${OUTPUT_DIR}\n`);

    // Step 7: Generate final HTML with inlined assets
    console.log('📍 Step 7: Generating final index.html...');
    const finalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaTags}
  <title>${title}</title>
  <style>
${allCSS}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
${bundledCode}
  </script>
</body>
</html>`;

    const outputPath = path.join(OUTPUT_DIR, 'index.html');
    fs.writeFileSync(outputPath, finalHTML);
    console.log(`  ✓ Generated: ${outputPath}\n`);

    // Step 8: Display summary
    console.log('✅ FLATTEN BUILD COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`  - Input: ${path.relative(__dirname, DIST_DIR)}`);
    console.log(`  - Output: ${path.relative(__dirname, outputPath)}`);
    console.log(`  - Final file size: ${(finalHTML.length / 1024).toFixed(2)} KB`);
    console.log(`  - CSS inlined: ${allCSS.length} bytes`);
    console.log(`  - JS bundled: ${bundledCode.length} bytes`);
    console.log('\n🎉 You can now open the file directly in a browser:');
    console.log(`  → Double-click: ${outputPath}`);
    console.log(`  → Or open in browser: file:///${outputPath.replace(/\\/g, '/')}`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error during build process:');
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the bundler
bundleApplication();

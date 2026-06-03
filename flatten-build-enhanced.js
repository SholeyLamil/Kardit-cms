#!/usr/bin/env node

/**
 * Enhanced Flatten Build Script
 * 
 * Improvements over basic version:
 * - Better CSS extraction from HTML references
 * - Handles CSS @import statements
 * - More robust chunk detection
 * - Better error handling and logging
 * - Support for source map removal
 */

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_DIR = path.join(__dirname, 'offline_ready_site');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

/**
 * Parse CSS files and inline any @import statements
 */
function processCSSContent(cssContent, assetsDir) {
  return cssContent.replace(/@import\s+url\(['"]?([^'"]+)['"]?\);?/g, (match, importPath) => {
    const importFile = path.join(assetsDir, importPath);
    if (fs.existsSync(importFile)) {
      try {
        console.log(`    → Resolved @import: ${importPath}`);
        return fs.readFileSync(importFile, 'utf-8');
      } catch (e) {
        console.warn(`    ⚠️  Could not inline @import: ${importPath}`);
        return match;
      }
    }
    return match;
  });
}

/**
 * Read all CSS files from assets with enhanced processing
 */
function readAllCSS() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    console.warn('⚠️  Assets directory not found:', DIST_ASSETS_DIR);
    return '';
  }

  const cssFiles = fs.readdirSync(DIST_ASSETS_DIR).filter(f => f.endsWith('.css'));
  let allCSS = '';

  console.log(`  Found ${cssFiles.length} CSS file(s):`);
  for (const file of cssFiles) {
    const filePath = path.join(DIST_ASSETS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Process @import statements
    content = processCSSContent(content, DIST_ASSETS_DIR);
    
    console.log(`    ✓ ${file} (${content.length} bytes)`);
    allCSS += '\n' + content;
  }

  return allCSS;
}

/**
 * Extract CSS links from original HTML
 */
function extractCSSFromHTML(htmlContent) {
  const linkRegex = /<link[^>]*rel=['"]?stylesheet['"]?[^>]*href=['"]?([^'">\s]+)['"]?[^>]*>/gi;
  let css = '';
  let match;

  const matches = [];
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    matches.push(match[1]);
  }

  if (matches.length > 0) {
    console.log(`  Found ${matches.length} CSS link(s) in HTML:`);
    for (const href of matches) {
      // Handle relative paths
      const cssPath = path.join(DIST_DIR, href);
      if (fs.existsSync(cssPath)) {
        try {
          let content = fs.readFileSync(cssPath, 'utf-8');
          content = processCSSContent(content, path.dirname(cssPath));
          console.log(`    ✓ Loaded from: ${href}`);
          css += '\n' + content;
        } catch (e) {
          console.warn(`    ⚠️  Could not read: ${href}`);
        }
      } else {
        console.log(`    ℹ️  File not found: ${href} (trying assets/)`);
      }
    }
  }

  return css;
}

/**
 * Find all JS files that need to be bundled
 */
function findAllJSChunks() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    throw new Error('Assets directory not found: ' + DIST_ASSETS_DIR);
  }

  const files = fs.readdirSync(DIST_ASSETS_DIR);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  if (jsFiles.length === 0) {
    throw new Error('No JavaScript files found in dist/assets');
  }

  console.log(`  Found ${jsFiles.length} JS file(s):`);
  jsFiles.forEach(f => {
    const size = fs.statSync(path.join(DIST_ASSETS_DIR, f)).size;
    console.log(`    • ${f} (${(size / 1024).toFixed(2)} KB)`);
  });

  return jsFiles;
}

/**
 * Find main entry point (largest JS file or main.*.js pattern)
 */
function findMainEntryFile(jsFiles) {
  // Priority 1: main.*.js pattern
  const mainFiles = jsFiles.filter(f => f.startsWith('main.') && f.endsWith('.js'));
  if (mainFiles.length > 0) {
    return path.join(DIST_ASSETS_DIR, mainFiles[0]);
  }

  // Priority 2: largest JS file (usually the main bundle)
  const sizes = jsFiles.map(f => ({
    name: f,
    path: path.join(DIST_ASSETS_DIR, f),
    size: fs.statSync(path.join(DIST_ASSETS_DIR, f)).size
  }));
  
  const largest = sizes.sort((a, b) => b.size - a.size)[0];
  return largest.path;
}

/**
 * Custom Rollup plugin for file:// protocol
 */
function createFileProtocolPlugin() {
  return {
    name: 'file-protocol-plugin',
    
    resolveId(id) {
      // Skip node modules marked as external
      if (id.startsWith('node_modules/')) return null;
      
      // Resolve relative imports
      if ((id.startsWith('./') || id.startsWith('../')) && id.endsWith('.js')) {
        const resolved = path.resolve(DIST_ASSETS_DIR, id);
        if (fs.existsSync(resolved)) {
          return { id: resolved, external: false };
        }
      }
      
      // Try direct path
      const direct = path.join(DIST_ASSETS_DIR, id);
      if (fs.existsSync(direct)) {
        return { id: direct, external: false };
      }

      return null;
    },

    load(id) {
      if (id.startsWith(DIST_ASSETS_DIR) && id.endsWith('.js')) {
        return fs.readFileSync(id, 'utf-8');
      }
      return null;
    },

    transform(code, id) {
      if (!id.includes(DIST_ASSETS_DIR)) return null;

      // Transform dynamic imports to use module registry
      let transformed = code
        .replace(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (match, importPath) => {
          return `Promise.resolve(window.__getModule('${importPath}'))`;
        });

      return transformed;
    }
  };
}

/**
 * Inject module system for handling dynamic imports
 */
function injectModuleSystem(bundledCode) {
  const moduleSystem = `
// ===== Dynamic Module System =====
(function() {
  window.__moduleRegistry = window.__moduleRegistry || {};
  window.__getModule = function(name) {
    if (window.__moduleRegistry[name]) {
      return window.__moduleRegistry[name];
    }
    console.warn('Module not found: ' + name);
    return Promise.reject(new Error('Module not found: ' + name));
  };
})();
// ===== End Module System =====
`;
  return moduleSystem + '\n' + bundledCode;
}

/**
 * Read and parse original HTML
 */
function readOriginalHTML() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist directory');
  }
  return fs.readFileSync(indexPath, 'utf-8');
}

/**
 * Extract HTML metadata
 */
function extractHTMLMetadata(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'Application';

  const metaRegex = /<meta[^>]*>/gi;
  const metaTags = (html.match(metaRegex) || []).join('\n  ');

  const langMatch = html.match(/<html[^>]*lang=['"]?([^'">\s]+)/i);
  const lang = langMatch ? langMatch[1] : 'en';

  return { title, metaTags, lang };
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  🚀 FLATTEN BUILD - Offline Single-File Generator');
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Validate dist folder
    console.log('📍 Step 1: Validating dist directory...');
    if (!fs.existsSync(DIST_DIR)) {
      throw new Error(`dist directory not found at: ${DIST_DIR}`);
    }
    console.log(`  ✓ Found: ${path.relative(__dirname, DIST_DIR)}\n`);

    // Step 2: Find JS chunks
    console.log('📍 Step 2: Scanning JavaScript files...');
    const jsChunks = findAllJSChunks();
    const mainEntry = findMainEntryFile(jsChunks);
    console.log(`  ✓ Entry point: ${path.basename(mainEntry)}\n`);

    // Step 3: Read CSS
    console.log('📍 Step 3: Extracting CSS assets...');
    const originalHTML = readOriginalHTML();
    let allCSS = extractCSSFromHTML(originalHTML);
    if (!allCSS) {
      console.log('  Trying direct asset read...');
      allCSS = readAllCSS();
    }
    console.log(`  ✓ Total CSS: ${allCSS.length} bytes\n`);

    // Step 4: Extract HTML metadata
    console.log('📍 Step 4: Reading HTML metadata...');
    const { title, metaTags, lang } = extractHTMLMetadata(originalHTML);
    console.log(`  ✓ Title: ${title}`);
    console.log(`  ✓ Language: ${lang}`);
    console.log(`  ✓ Meta tags: ${(metaTags.match(/name|property/g) || []).length}\n`);

    // Step 5: Bundle with Rollup
    console.log('📍 Step 5: Bundling with Rollup...');
    const inputOptions = {
      input: mainEntry,
      plugins: [
        createFileProtocolPlugin(),
        require('@rollup/plugin-node-resolve').nodeResolve({
          browser: true,
          preferBuiltins: false
        }),
        require('@rollup/plugin-commonjs')()
      ],
      onwarn(warning) {
        if (['CIRCULAR_DEPENDENCY', 'THIS_IS_UNDEFINED', 'EVAL'].includes(warning.code)) {
          return; // Suppress these warnings
        }
        console.warn(`  ⚠️  [${warning.code}] ${warning.message}`);
      }
    };

    const bundle = await rollup.rollup(inputOptions);
    const { output } = await bundle.generate({
      format: 'iife',
      name: '__APP__',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM'
      }
    });
    await bundle.close();

    let bundledCode = output[0].code;
    console.log(`  ✓ Bundled code: ${(bundledCode.length / 1024).toFixed(2)} KB\n`);

    // Step 6: Inject module system
    console.log('📍 Step 6: Injecting module system...');
    bundledCode = injectModuleSystem(bundledCode);
    console.log(`  ✓ Module registry injected\n`);

    // Step 7: Create output directory
    console.log('📍 Step 7: Creating output directory...');
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    console.log(`  ✓ Directory: ${OUTPUT_DIR}\n`);

    // Step 8: Generate final HTML
    console.log('📍 Step 8: Generating final index.html...');
    const finalHTML = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaTags}
  <title>${title}</title>
  <style>
/* ===== Inlined Styles ===== */
${allCSS}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
// ===== Inlined Application Bundle =====
${bundledCode}
  </script>
</body>
</html>`;

    const outputPath = path.join(OUTPUT_DIR, 'index.html');
    fs.writeFileSync(outputPath, finalHTML);
    const fileSize = fs.statSync(outputPath).size;
    console.log(`  ✓ Generated: ${path.relative(__dirname, outputPath)}`);
    console.log(`  ✓ File size: ${(fileSize / 1024).toFixed(2)} KB\n`);

    // Step 9: Summary and next steps
    console.log('='.repeat(60));
    console.log('  ✅ FLATTEN BUILD COMPLETE!');
    console.log('='.repeat(60) + '\n');

    console.log('📊 Summary:');
    console.log(`  Input directory:  ${path.relative(__dirname, DIST_DIR)}`);
    console.log(`  Output file:      ${path.relative(__dirname, outputPath)}`);
    console.log(`  Final size:       ${(fileSize / 1024).toFixed(2)} KB`);
    console.log(`  CSS bundled:      ${(allCSS.length / 1024).toFixed(2)} KB`);
    console.log(`  JS bundled:       ${(bundledCode.length / 1024).toFixed(2)} KB`);
    console.log(`  Total chunks:     ${jsChunks.length}\n`);

    console.log('🎯 Next Steps:');
    console.log(`  1. Double-click to open in browser:`);
    console.log(`     → ${outputPath}\n`);
    console.log(`  2. Or open in your browser (paste this address):`);
    console.log(`     → file:///${outputPath.replace(/\\/g, '/')}\n`);
    console.log(`  3. The page will work offline - no server needed!\n`);

    console.log('ℹ️  Notes:');
    console.log('  • Single file contains all code and styles');
    console.log('  • Works with file:// protocol (no CORS issues)');
    console.log('  • Keep original dist/ folder for debugging\n');

  } catch (error) {
    console.error('\n❌ ERROR:\n');
    console.error('  ' + error.message);
    if (process.env.DEBUG) {
      console.error('\n' + error.stack);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('  1. Ensure you ran: npm run build');
    console.error('  2. Check dist/ folder exists');
    console.error('  3. Verify dist/assets/ has .js and .css files');
    console.error('  4. Run with DEBUG=1 for stack trace:\n');
    console.error('     → DEBUG=1 node flatten-build.js\n');
    process.exit(1);
  }
}

main();

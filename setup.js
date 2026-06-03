#!/usr/bin/env node

/**
 * Quick Setup Script
 * Installs all required dependencies and runs the flatten-build script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('  📦 Flatten Build - Quick Setup');
console.log('='.repeat(60) + '\n');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.log('❌ Error: package.json not found in current directory');
    console.log('📍 Make sure you are in your project root directory\n');
    process.exit(1);
  }

  // Check Node version
  const nodeVersion = process.version.split('.')[0].slice(1);
  if (parseInt(nodeVersion) < 14) {
    console.log(`❌ Error: Node.js 14+ required (you have ${process.version})\n`);
    process.exit(1);
  }

  console.log('✓ Node.js version OK\n');

  // Install dependencies
  console.log('📍 Installing Rollup and plugins...\n');
  
  const deps = [
    'rollup',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-commonjs'
  ];

  for (const dep of deps) {
    try {
      require.resolve(dep);
      console.log(`  ✓ ${dep} already installed`);
    } catch {
      console.log(`  ⏳ Installing ${dep}...`);
      execSync(`npm install --save-dev ${dep}`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log(`  ✓ ${dep} installed\n`);
    }
  }

  console.log('\n✅ Dependencies installed!\n');

  // Ask which script to run
  console.log('Choose which script to run:\n');
  console.log('  1. Basic version (faster, stable)');
  console.log('  2. Enhanced version (more features, logging)\n');

  const arg = process.argv[2];
  if (arg === '1' || arg === 'basic') {
    console.log('Running basic version...\n');
    require('./flatten-build.js');
  } else if (arg === '2' || arg === 'enhanced') {
    console.log('Running enhanced version...\n');
    require('./flatten-build-enhanced.js');
  } else {
    console.log('Usage: node setup.js [1|2|basic|enhanced]\n');
    console.log('Example: node setup.js 2\n');
    process.exit(0);
  }

} catch (error) {
  console.error('\n❌ Setup failed:\n');
  console.error(error.message);
  process.exit(1);
}

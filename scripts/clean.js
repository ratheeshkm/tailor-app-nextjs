#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.turbo',
];

const cacheFiles = [
  '.env.local.backup',
  '.vercel',
];

console.log('🧹 Clearing cache directories...\n');

// Clear directories
cacheDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${dir}`);
    } catch (error) {
      console.log(`⚠ Failed to remove ${dir}: ${error.message}`);
    }
  }
});

// Clear files
cacheFiles.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${file}`);
    } catch (error) {
      console.log(`⚠ Failed to remove ${file}: ${error.message}`);
    }
  }
});

console.log('\n✅ Cache cleared successfully!');

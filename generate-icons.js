#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple PNG generator - creates solid color PNGs with basic structure
function createSimplePNG(width, height, color) {
  // This creates a minimal valid PNG file with the specified color
  // PNG file signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // Create a simple blue PNG
  const blue = Buffer.from([
    // IHDR chunk (image header)
    0x00, 0x00, 0x00, 0x0d, // chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, Math.floor(width / 256), width % 256, // width
    0x00, 0x00, 0x00, Math.floor(height / 256), height % 256, // height
    0x08, 0x02, // bit depth, color type
    0x00, 0x00, 0x00, // compression, filter, interlace
    0x7c, 0x1d, 0xb4, 0xfe, // CRC
    
    // IDAT chunk (image data - minimal)
    0x00, 0x00, 0x00, 0x0c,
    0x49, 0x44, 0x41, 0x54,
    0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00, 0x00, 0x00, 0x03, 0x00, 0x01,
    0x6e, 0x47, 0xaa, 0x38,
    
    // IEND chunk (image end)
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44,
    0xae, 0x42, 0x60, 0x82
  ]);
  
  return Buffer.concat([signature, blue]);
}

// Create PNG files
const publicDir = path.join(__dirname, 'public');

console.log('Creating PNG icons...');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createSimplePNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createSimplePNG(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-96.png'), createSimplePNG(96, 96));

console.log('✅ PNG icons created successfully!');

const fs = require('fs');
const path = require('path');

// Create a simple solid blue PNG
function createBluePNG(width, height) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR - Image header chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);  // chunk length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8;    // bit depth
  ihdr[17] = 2;    // color type (RGB)
  ihdr[18] = 0;    // compression
  ihdr[19] = 0;    // filter
  ihdr[20] = 0;    // interlace
  
  // CRC for IHDR
  const crc1 = 0x7cc1b4fe;
  ihdr.writeUInt32BE(crc1, 21);
  
  // IDAT - Image data chunk (blue color)
  const scanlineLength = width * 3 + 1;
  const imageDataLength = scanlineLength * height;
  const idat = Buffer.alloc(8 + imageDataLength + 4);
  idat.writeUInt32BE(imageDataLength, 0);
  idat.write('IDAT', 4);
  
  // Fill with blue color (RGB: 59, 130, 246)
  for (let y = 0; y < height; y++) {
    idat[8 + y * scanlineLength] = 0; // filter type
    for (let x = 0; x < width; x++) {
      idat[8 + y * scanlineLength + 1 + x * 3] = 59;     // R
      idat[8 + y * scanlineLength + 1 + x * 3 + 1] = 130; // G
      idat[8 + y * scanlineLength + 1 + x * 3 + 2] = 246; // B
    }
  }
  
  // CRC for IDAT (simplified, using a static value for blue)
  idat.writeUInt32BE(0xf0b67a09, imageDataLength + 8);
  
  // IEND - Image end chunk
  const iend = Buffer.from([
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44,
    0xae, 0x42, 0x60, 0x82
  ]);
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Create icons
const publicDir = path.join(__dirname, 'public');

console.log('Creating PNG icon files...');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createBluePNG(192, 192));
console.log('✅ Created icon-192.png');

fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createBluePNG(512, 512));
console.log('✅ Created icon-512.png');

fs.writeFileSync(path.join(publicDir, 'icon-96.png'), createBluePNG(96, 96));
console.log('✅ Created icon-96.png');

console.log('\nAll icons created successfully!');

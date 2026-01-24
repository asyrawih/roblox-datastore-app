import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import png2icons from 'png2icons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '..', 'build');

console.log('Creating Windows ICO file...');

// Read PNG files in the sizes we need for ICO
const sizes = [16, 24, 32, 48, 64, 96, 128, 256];
const pngBuffers = [];

for (const size of sizes) {
  const pngPath = join(buildDir, 'icons', `${size}x${size}.png`);
  try {
    const buffer = readFileSync(pngPath);
    pngBuffers.push(buffer);
    console.log(`Added ${size}x${size}.png`);
  } catch (error) {
    console.warn(`Warning: Could not read ${size}x${size}.png`);
  }
}

if (pngBuffers.length === 0) {
  console.error('No PNG files found!');
  process.exit(1);
}

// Create ICO file
const icoBuffer = png2icons.createICO(pngBuffers, png2icons.BICUBIC, 0, true);
const icoPath = join(buildDir, 'icon.ico');
writeFileSync(icoPath, icoBuffer);

console.log(`✓ Created ${icoPath}`);
console.log('Done!');

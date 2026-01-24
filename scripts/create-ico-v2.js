import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import toIco from 'to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '..', 'build');

async function createICO() {
  console.log('Creating Windows ICO file...\n');

  // Read PNG files
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const files = [];

  for (const size of sizes) {
    const pngPath = join(buildDir, 'icons', `${size}x${size}.png`);
    try {
      const buffer = readFileSync(pngPath);
      files.push(buffer);
      console.log(`✓ Added ${size}x${size}.png`);
    } catch (error) {
      console.warn(`⚠ Warning: Could not read ${size}x${size}.png`);
    }
  }

  if (files.length === 0) {
    console.error('❌ No PNG files found!');
    process.exit(1);
  }

  console.log('\nConverting to ICO format...');

  try {
    const icoBuffer = await toIco(files);
    const icoPath = join(buildDir, 'icon.ico');
    writeFileSync(icoPath, icoBuffer);
    console.log(`✓ Created ${icoPath}`);
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Failed to create ICO:', error.message);
    process.exit(1);
  }
}

createICO();

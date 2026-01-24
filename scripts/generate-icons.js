#!/usr/bin/env node

import { spawn } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import png2icons from 'png2icons';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const buildDir = join(rootDir, 'build');
const svgPath = join(buildDir, 'icon.svg');

// Sizes needed for different platforms
const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024];

async function exec(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => (stdout += data.toString()));
    proc.stderr.on('data', (data) => (stderr += data.toString()));

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function convertSVGToPNG(svgPath, pngPath, size) {
  console.log(`Converting SVG to PNG (${size}x${size})...`);

  // Use sips for conversion on macOS
  try {
    // First convert SVG to PNG at larger size, then resize
    const tempPng = join(buildDir, 'temp.png');

    // For macOS, we'll use a different approach with built-in tools
    // Create a simple conversion using qlmanage (QuickLook)
    await exec('qlmanage', ['-t', '-s', String(size), '-o', buildDir, svgPath]);

    // Rename the generated file
    const generatedFile = join(buildDir, 'icon.svg.png');
    await exec('mv', [generatedFile, pngPath]);

    console.log(`✓ Created ${pngPath}`);
  } catch (error) {
    console.error(`Failed to convert SVG to PNG:`, error.message);
    console.log('You may need to manually convert icon.svg to PNG files');
    throw error;
  }
}

async function generatePNGSizes() {
  console.log('Generating PNG files in various sizes...\n');

  await mkdir(join(buildDir, 'icons'), { recursive: true });

  const pngFiles = {};

  for (const size of sizes) {
    const pngPath = join(buildDir, 'icons', `${size}x${size}.png`);
    try {
      await convertSVGToPNG(svgPath, pngPath, size);
      pngFiles[size] = pngPath;
    } catch (error) {
      console.error(`Failed to generate ${size}x${size} PNG`);
    }
  }

  return pngFiles;
}

async function generateICO(pngFiles) {
  console.log('\nGenerating Windows ICO file...');

  try {
    // Use the largest available PNGs for ICO
    const icoSizes = [16, 24, 32, 48, 64, 96, 128, 256];
    const pngBuffers = [];

    for (const size of icoSizes) {
      if (pngFiles[size]) {
        const buffer = await readFile(pngFiles[size]);
        pngBuffers.push(buffer);
      }
    }

    if (pngBuffers.length === 0) {
      throw new Error('No PNG files available for ICO generation');
    }

    const icoBuffer = png2icons.createICO(pngBuffers, png2icons.BICUBIC, 0, true);
    await writeFile(join(buildDir, 'icon.ico'), icoBuffer);

    console.log('✓ Created build/icon.ico');
  } catch (error) {
    console.error('Failed to generate ICO:', error.message);
  }
}

async function generateICNS(pngFiles) {
  console.log('\nGenerating macOS ICNS file...');

  try {
    // Create iconset directory
    const iconsetDir = join(buildDir, 'icon.iconset');
    await mkdir(iconsetDir, { recursive: true });

    // Copy PNGs to iconset with proper naming
    const iconMapping = {
      16: 'icon_16x16.png',
      32: 'icon_16x16@2x.png',
      32: 'icon_32x32.png',
      64: 'icon_32x32@2x.png',
      128: 'icon_128x128.png',
      256: 'icon_128x128@2x.png',
      256: 'icon_256x256.png',
      512: 'icon_256x256@2x.png',
      512: 'icon_512x512.png',
      1024: 'icon_512x512@2x.png',
    };

    for (const [size, filename] of Object.entries(iconMapping)) {
      if (pngFiles[parseInt(size)]) {
        const src = pngFiles[parseInt(size)];
        const dest = join(iconsetDir, filename);
        await exec('cp', [src, dest]);
      }
    }

    // Convert iconset to ICNS using iconutil
    await exec('iconutil', ['-c', 'icns', iconsetDir, '-o', join(buildDir, 'icon.icns')]);

    // Clean up iconset directory
    await exec('rm', ['-rf', iconsetDir]);

    console.log('✓ Created build/icon.icns');
  } catch (error) {
    console.error('Failed to generate ICNS:', error.message);
    console.log('You may need to manually create icon.icns using iconutil');
  }
}

async function main() {
  console.log('🎨 Generating app icons...\n');
  console.log('Source: build/icon.svg\n');

  try {
    const pngFiles = await generatePNGSizes();
    await generateICO(pngFiles);
    await generateICNS(pngFiles);

    console.log('\n✅ Icon generation complete!');
    console.log('\nGenerated files:');
    console.log('  • build/icon.ico (Windows)');
    console.log('  • build/icon.icns (macOS)');
    console.log('  • build/icons/*.png (Linux)');
  } catch (error) {
    console.error('\n❌ Icon generation failed:', error.message);
    process.exit(1);
  }
}

main();

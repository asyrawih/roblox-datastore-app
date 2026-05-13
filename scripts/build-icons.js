import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import png2icons from 'png2icons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '..', 'build');
const iconsDir = join(buildDir, 'icons');

const source = readFileSync(join(iconsDir, '1024x1024.png'));

const ico = png2icons.createICO(source, png2icons.BICUBIC, 0, false, true);
if (!ico) throw new Error('ICO generation failed');
writeFileSync(join(buildDir, 'icon.ico'), ico);
console.log('Wrote build/icon.ico');

const icns = png2icons.createICNS(source, png2icons.BICUBIC, 0);
if (!icns) throw new Error('ICNS generation failed');
writeFileSync(join(buildDir, 'icon.icns'), icns);
console.log('Wrote build/icon.icns');

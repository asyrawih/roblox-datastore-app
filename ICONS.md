# App Icon Information

## Icon Design

The Kelas Malam DataStore Editor uses a custom icon that combines:
- **Database/DataStore symbol** (top) - Representing Roblox DataStore functionality
- **"km" logo** (bottom) - Kelas Malam branding
- **Connecting arrow** - Showing the connection between the platform and data

### Color Scheme
- Primary: Indigo (#6366F1)
- Accent: White (#FFFFFF)
- Style: Modern, flat design with high contrast

## Generated Icons

All icons have been generated and are ready for distribution builds:

### Windows
- `build/icon.ico` - Multi-resolution ICO file
  - Contains: 16x16, 24x24, 32x32, 48x48, 64x64, 96x96, 128x128, 256x256

### macOS
- `build/icon.icns` - Retina-ready ICNS file
  - Contains: All standard sizes from 16x16 to 1024x1024
  - Supports both regular and @2x retina displays

### Linux
- `build/icons/*.png` - Individual PNG files
  - Sizes: 16, 24, 32, 48, 64, 96, 128, 256, 512

## Usage in Builds

The icons are automatically used when building:

```bash
npm run build:win      # Uses icon.ico
npm run build:mac      # Uses icon.icns  
npm run build:all      # Uses all icons
```

## Regenerating Icons

If you modify `build/icon.svg`, regenerate all formats:

```bash
npm run icons
```

This command:
1. Converts SVG to high-res PNG
2. Creates multiple PNG sizes (16-512px)
3. Generates macOS ICNS file
4. Generates Windows ICO file

## Customizing

To customize the icon:

1. **Edit the SVG:**
   - Open `build/icon.svg` in Figma, Inkscape, or any SVG editor
   - Modify colors, shapes, or design
   - Save the file

2. **Regenerate:**
   ```bash
   npm run icons
   ```

3. **Test:**
   ```bash
   npm run build:mac  # or build:win
   ```

## Technical Details

### SVG Source
- File: `build/icon.svg`
- Dimensions: 512x512px
- Format: Scalable Vector Graphics
- Editable with any SVG editor

### Generation Scripts
- `scripts/create-icons-simple.sh` - Bash script for PNG/ICNS generation
- `scripts/create-ico-v2.js` - Node.js script for Windows ICO

### Dependencies
- macOS `sips` - Built-in image resizing (macOS only)
- macOS `iconutil` - ICNS generation (macOS only)
- `to-ico` npm package - ICO file generation

## Preview

The app icon appears in:
- Windows taskbar and Start menu
- macOS Dock and Applications folder
- Linux application launchers
- Window title bars
- File associations (if configured)

## Best Practices

- Keep the design simple and recognizable at small sizes
- Use high contrast for visibility
- Maintain square aspect ratio
- Test at various sizes (16x16 to 512x512)
- Avoid fine details that don't scale well

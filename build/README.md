# Build Assets

This directory contains assets for building the Kelas Malam DataStore Editor application.

## App Icons ✅

The app icons have been generated and are ready to use!

### Generated Files:
- ✅ `icon.svg` - Source SVG file (editable)
- ✅ `icon.ico` - Windows icon file (16-256px, multiple sizes)
- ✅ `icon.icns` - macOS icon file (16-1024px retina-ready)
- ✅ `icons/*.png` - Linux PNG icons (16-512px)

### Icon Design:
The icon features:
- **Database symbol** at the top (representing DataStore)
- **"km" logo** at the bottom (Kelas Malam branding)
- **Connecting arrow** between them
- **Indigo/purple color scheme** (#6366F1)
- **White elements** on colored background

## Regenerating Icons

If you need to regenerate icons (e.g., after modifying `icon.svg`):

```bash
npm run icons
```

This will:
1. Convert SVG to PNG in multiple sizes
2. Generate macOS ICNS file
3. Generate Windows ICO file
4. Create Linux PNG icons

## Customizing the Icon

To customize the icon design:

1. Edit `build/icon.svg` in any SVG editor (Figma, Inkscape, etc.)
2. Run `npm run icons` to regenerate all formats
3. Icons will be automatically used in builds

### Manual Icon Creation

If you want to create icons from a PNG source file:

#### macOS (built-in tools):
```bash
# From the project root
bash scripts/create-icons-simple.sh
```

#### Windows ICO:
```bash
# From the project root
node scripts/create-ico-v2.js
```

## DMG Background (Optional)

For macOS DMG installer, you can add a custom background:
- Create: `build/background.png` (540x380px recommended)
- The DMG will use this as the installer background

## Notes
- All icons are generated from `icon.svg`
- Icons support both light and dark system themes
- Transparent backgrounds work best for app icons
- The icon generation scripts require macOS for ICNS creation

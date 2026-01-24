#!/bin/bash

# Simple icon generation script for macOS
# This script requires: sips (built-in), iconutil (built-in)

set -e

echo "🎨 Generating app icons..."
echo ""

BUILD_DIR="$(cd "$(dirname "$0")/.." && pwd)/build"
SVG_PATH="$BUILD_DIR/icon.svg"
ICONS_DIR="$BUILD_DIR/icons"
ICONSET_DIR="$BUILD_DIR/icon.iconset"

# Check if SVG exists
if [ ! -f "$SVG_PATH" ]; then
    echo "❌ Error: icon.svg not found at $SVG_PATH"
    exit 1
fi

# Create directories
mkdir -p "$ICONS_DIR"
mkdir -p "$ICONSET_DIR"

echo "📝 Converting SVG to PNG..."

# Convert SVG to a high-res PNG first using QuickLook
qlmanage -t -s 1024 -o "$BUILD_DIR" "$SVG_PATH" 2>/dev/null || {
    echo "❌ Failed to convert SVG with qlmanage"
    echo "Please convert icon.svg to a 1024x1024 PNG manually"
    exit 1
}

# Rename the generated file
mv "$BUILD_DIR/icon.svg.png" "$BUILD_DIR/icon-1024.png"

BASE_PNG="$BUILD_DIR/icon-1024.png"

echo "✓ Created base PNG (1024x1024)"
echo ""

# Generate PNG sizes for Linux
echo "📦 Generating PNG sizes for Linux..."
for size in 16 24 32 48 64 96 128 256 512; do
    sips -z $size $size "$BASE_PNG" --out "$ICONS_DIR/${size}x${size}.png" > /dev/null 2>&1
    echo "  ✓ ${size}x${size}.png"
done

# Generate iconset for macOS ICNS
echo ""
echo "🍎 Generating macOS icon.icns..."

# Create all required sizes for iconset
sips -z 16 16     "$BASE_PNG" --out "$ICONSET_DIR/icon_16x16.png" > /dev/null 2>&1
sips -z 32 32     "$BASE_PNG" --out "$ICONSET_DIR/icon_16x16@2x.png" > /dev/null 2>&1
sips -z 32 32     "$BASE_PNG" --out "$ICONSET_DIR/icon_32x32.png" > /dev/null 2>&1
sips -z 64 64     "$BASE_PNG" --out "$ICONSET_DIR/icon_32x32@2x.png" > /dev/null 2>&1
sips -z 128 128   "$BASE_PNG" --out "$ICONSET_DIR/icon_128x128.png" > /dev/null 2>&1
sips -z 256 256   "$BASE_PNG" --out "$ICONSET_DIR/icon_128x128@2x.png" > /dev/null 2>&1
sips -z 256 256   "$BASE_PNG" --out "$ICONSET_DIR/icon_256x256.png" > /dev/null 2>&1
sips -z 512 512   "$BASE_PNG" --out "$ICONSET_DIR/icon_256x256@2x.png" > /dev/null 2>&1
sips -z 512 512   "$BASE_PNG" --out "$ICONSET_DIR/icon_512x512.png" > /dev/null 2>&1
sips -z 1024 1024 "$BASE_PNG" --out "$ICONSET_DIR/icon_512x512@2x.png" > /dev/null 2>&1

# Convert iconset to ICNS
iconutil -c icns "$ICONSET_DIR" -o "$BUILD_DIR/icon.icns"
echo "  ✓ icon.icns created"

# Clean up iconset directory
rm -rf "$ICONSET_DIR"
rm "$BASE_PNG"

echo ""
echo "🪟 For Windows ICO file:"
echo "  You can use an online converter:"
echo "  https://convertio.co/png-ico/"
echo "  Upload: $ICONS_DIR/512x512.png"
echo "  Save as: $BUILD_DIR/icon.ico"
echo ""
echo "  Or use ImageMagick (install with: brew install imagemagick):"
echo "  convert $ICONS_DIR/512x512.png -define icon:auto-resize=256,128,96,64,48,32,24,16 $BUILD_DIR/icon.ico"

echo ""
echo "✅ Icon generation complete!"
echo ""
echo "Generated files:"
echo "  • $BUILD_DIR/icon.icns (macOS)"
echo "  • $ICONS_DIR/*.png (Linux)"
echo "  • $BUILD_DIR/icon.ico (Windows - needs manual creation)"

#!/bin/bash
set -e

BUILD_DIR="build"
SVG_PATH="$BUILD_DIR/icon.svg"

echo "Converting SVG to PNG..."
qlmanage -t -s 1024 -o "$BUILD_DIR" "$SVG_PATH" 2>/dev/null
mv "$BUILD_DIR/icon.svg.png" "$BUILD_DIR/icon-1024.png"

echo "Creating icon directories..."
mkdir -p "$BUILD_DIR/icons"
mkdir -p "$BUILD_DIR/icon.iconset"

BASE_PNG="$BUILD_DIR/icon-1024.png"

echo "Generating PNG sizes..."
for size in 16 24 32 48 64 96 128 256 512; do
    sips -z $size $size "$BASE_PNG" --out "$BUILD_DIR/icons/${size}x${size}.png" > /dev/null 2>&1
    echo "Created ${size}x${size}.png"
done

echo "Creating macOS iconset..."
sips -z 16 16 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_16x16.png" > /dev/null 2>&1
sips -z 32 32 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_16x16@2x.png" > /dev/null 2>&1
sips -z 32 32 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_32x32.png" > /dev/null 2>&1
sips -z 64 64 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_32x32@2x.png" > /dev/null 2>&1
sips -z 128 128 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_128x128.png" > /dev/null 2>&1
sips -z 256 256 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_128x128@2x.png" > /dev/null 2>&1
sips -z 256 256 "$BUILD_PNG" --out "$BUILD_DIR/icon.iconset/icon_256x256.png" > /dev/null 2>&1
sips -z 512 512 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_256x256@2x.png" > /dev/null 2>&1
sips -z 512 512 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_512x512.png" > /dev/null 2>&1
sips -z 1024 1024 "$BASE_PNG" --out "$BUILD_DIR/icon.iconset/icon_512x512@2x.png" > /dev/null 2>&1

echo "Converting to ICNS..."
iconutil -c icns "$BUILD_DIR/icon.iconset" -o "$BUILD_DIR/icon.icns"

echo "Cleaning up..."
rm -rf "$BUILD_DIR/icon.iconset"
rm "$BASE_PNG"

echo "Done! Created icon.icns and PNG files."
echo "For Windows ICO, use: https://convertio.co/png-ico/"

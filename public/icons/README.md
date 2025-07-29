# Excalidraw PWA Icons

This directory contains all the icons needed for the Progressive Web App (PWA) functionality.

## Files

- `generate-icons.sh` - Script to generate all PWA icons from SVG
- `excalidraw-icon.svg` - Base SVG icon (auto-generated)
- `icon-{size}x{size}.png` - PNG icons for different sizes
- `favicon.ico` - Windows favicon (if available)

## Generating Icons

### Method 1: Automatic (Recommended)
```bash
cd public/icons
chmod +x generate-icons.sh
./generate-icons.sh
```

### Method 2: Manual (if no CLI tools available)
1. Run the script to generate HTML converter files
2. Open each `icon-{size}x{size}-converter.html` in a browser
3. Click "Download Icon" to save each PNG file

## Required Tools (Optional)

For automatic PNG generation, install one of these:

### Ubuntu/Debian
```bash
sudo apt install inkscape imagemagick librsvg2-bin
```

### macOS
```bash
brew install inkscape imagemagick librsvg
```

### Windows
- Install Inkscape: https://inkscape.org/
- Install ImageMagick: https://imagemagick.org/

## Icon Sizes

The script generates icons for all PWA requirements:
- 72x72, 96x96, 128x128, 144x144, 152x152 (mobile)
- 180x180 (iOS)
- 192x192, 384x384, 512x512 (Android/Chrome)

## Design

The Excalidraw icon features:
- Dark theme background
- White drawing canvas
- Colored drawing elements (circle, rectangle, arrow, curve)
- Toolbar representation
- App title

Perfect for representing the drawing/sketching nature of Excalidraw!

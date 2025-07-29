#!/bin/bash

# Script to generate PWA icons from SVG
# This script creates proper Excalidraw-themed icons for PWA

echo "Creating Excalidraw PWA icons..."

# Create icon sizes needed for PWA
sizes=(72 96 128 144 152 180 192 384 512)

# First, create the base SVG icon if it doesn't exist
cat > excalidraw-icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="64" fill="#1e1e1e"/>
  
  <!-- Inner container -->
  <rect x="32" y="32" width="448" height="448" rx="32" fill="#2d2d2d"/>
  
  <!-- Drawing canvas representation -->
  <rect x="64" y="96" width="384" height="320" rx="16" fill="#ffffff" stroke="#404040" stroke-width="4"/>
  
  <!-- Drawing elements - circle -->
  <circle cx="180" cy="200" r="32" fill="none" stroke="#0066cc" stroke-width="6"/>
  
  <!-- Drawing elements - rectangle -->
  <rect x="240" y="240" width="80" height="60" fill="none" stroke="#ff6b6b" stroke-width="6" rx="8"/>
  
  <!-- Drawing elements - arrow -->
  <path d="M140 280 L200 320 M200 320 L185 305 M200 320 L215 305" 
        stroke="#4ecdc4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Drawing elements - line/scribble -->
  <path d="M280 160 Q320 140 360 160 T400 180" 
        stroke="#ff9f43" stroke-width="6" stroke-linecap="round" fill="none"/>
  
  <!-- Toolbar representation at bottom -->
  <rect x="96" y="360" width="320" height="32" rx="16" fill="#404040"/>
  
  <!-- Tool icons in toolbar -->
  <circle cx="120" cy="376" r="6" fill="#0066cc"/>
  <rect x="142" y="370" width="12" height="12" fill="#ff6b6b" rx="2"/>
  <path d="M170 370 L182 382 M170 382 L182 370" stroke="#4ecdc4" stroke-width="2"/>
  
  <!-- App title at top -->
  <text x="256" y="80" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold">Excalidraw</text>
</svg>
EOF

echo "Base SVG icon created: excalidraw-icon.svg"

# Function to create PNG from SVG using different methods
create_png_icon() {
  local size=$1
  local output="icon-${size}x${size}.png"
  
  echo "Creating ${size}x${size} PNG icon..."
  
  # Try different methods to convert SVG to PNG
  if command -v inkscape &> /dev/null; then
    # Method 1: Inkscape (best quality)
    inkscape --export-type=png --export-filename="$output" --export-width=$size --export-height=$size excalidraw-icon.svg 2>/dev/null
    echo "  ✓ Created $output using Inkscape"
  elif command -v convert &> /dev/null; then
    # Method 2: ImageMagick
    convert -background transparent -size ${size}x${size} excalidraw-icon.svg "$output" 2>/dev/null
    echo "  ✓ Created $output using ImageMagick"
  elif command -v rsvg-convert &> /dev/null; then
    # Method 3: rsvg-convert
    rsvg-convert -w $size -h $size excalidraw-icon.svg -o "$output" 2>/dev/null
    echo "  ✓ Created $output using rsvg-convert"
  else
    # Method 4: Create HTML page for browser conversion
    create_html_converter $size
    echo "  ⚠ Created HTML converter for $output (manual conversion needed)"
  fi
}

# Function to create HTML converter when no CLI tools available
create_html_converter() {
  local size=$1
  cat > "icon-${size}x${size}-converter.html" << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Icon Converter ${size}x${size}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    canvas { border: 1px solid #ccc; margin: 10px 0; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Excalidraw Icon Generator ${size}x${size}</h2>
  <canvas id="canvas" width="${size}" height="${size}"></canvas><br>
  <button onclick="downloadIcon()">Download Icon</button>
  
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const size = ${size};
    
    function drawIcon() {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Scale factor
      const scale = size / 512;
      ctx.scale(scale, scale);
      
      // Background with rounded corners
      ctx.fillStyle = '#1e1e1e';
      roundRect(ctx, 0, 0, 512, 512, 64);
      ctx.fill();
      
      // Inner container
      ctx.fillStyle = '#2d2d2d';
      roundRect(ctx, 32, 32, 448, 448, 32);
      ctx.fill();
      
      // Drawing canvas
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 4;
      roundRect(ctx, 64, 96, 384, 320, 16);
      ctx.fill();
      ctx.stroke();
      
      // Drawing elements
      ctx.lineWidth = 6;
      
      // Circle
      ctx.strokeStyle = '#0066cc';
      ctx.beginPath();
      ctx.arc(180, 200, 32, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Rectangle
      ctx.strokeStyle = '#ff6b6b';
      roundRect(ctx, 240, 240, 80, 60, 8);
      ctx.stroke();
      
      // Arrow
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(140, 280);
      ctx.lineTo(200, 320);
      ctx.moveTo(200, 320);
      ctx.lineTo(185, 305);
      ctx.moveTo(200, 320);
      ctx.lineTo(215, 305);
      ctx.stroke();
      
      // Curved line
      ctx.strokeStyle = '#ff9f43';
      ctx.beginPath();
      ctx.moveTo(280, 160);
      ctx.quadraticCurveTo(320, 140, 360, 160);
      ctx.quadraticCurveTo(380, 170, 400, 180);
      ctx.stroke();
      
      // Toolbar
      ctx.fillStyle = '#404040';
      roundRect(ctx, 96, 360, 320, 32, 16);
      ctx.fill();
      
      // Tool icons
      ctx.fillStyle = '#0066cc';
      ctx.beginPath();
      ctx.arc(120, 376, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#ff6b6b';
      roundRect(ctx, 142, 370, 12, 12, 2);
      ctx.fill();
      
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Excalidraw', 256, 80);
    }
    
    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    }
    
    function downloadIcon() {
      const link = document.createElement('a');
      link.download = 'icon-${size}x${size}.png';
      link.href = canvas.toDataURL();
      link.click();
    }
    
    // Draw the icon when page loads
    drawIcon();
  </script>
</body>
</html>
EOF
}

# Generate icons for all sizes
for size in "${sizes[@]}"; do
  create_png_icon $size
done

# Create ICO file for Windows if convert is available
if command -v convert &> /dev/null; then
  echo "Creating favicon.ico..."
  convert icon-16x16.png icon-32x32.png icon-48x48.png favicon.ico 2>/dev/null || echo "  ⚠ Could not create favicon.ico"
fi

echo ""
echo "✅ Icon generation complete!"
echo ""
echo "Generated files:"
ls -la *.png *.svg *.ico 2>/dev/null || ls *.png *.svg *.ico 2>/dev/null || echo "  Check directory for generated files"
echo ""
echo "📝 Notes:"
echo "  - If PNG files weren't created automatically, open the HTML converter files in a browser"
echo "  - Click 'Download Icon' button in each HTML page to get the PNG files"
echo "  - For production, ensure you have proper PNG files for all sizes"
echo ""
echo "🔧 To install conversion tools:"
echo "  Ubuntu/Debian: sudo apt install inkscape imagemagick librsvg2-bin"
echo "  macOS: brew install inkscape imagemagick librsvg"
echo "  Windows: Install Inkscape or ImageMagick manually"

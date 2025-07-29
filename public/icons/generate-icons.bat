@echo off
REM Script to generate PWA icons for Windows
REM This creates the base SVG and HTML converters for manual PNG generation

echo Creating Excalidraw PWA icons...

REM Create icon sizes needed for PWA
set sizes=72 96 128 144 152 180 192 384 512

REM Create the base SVG icon
echo Creating base SVG icon: excalidraw-icon.svg
(
echo ^<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"^>
echo   ^<!-- Background with rounded corners --^>
echo   ^<rect width="512" height="512" rx="64" fill="#1e1e1e"/^>
echo   
echo   ^<!-- Inner container --^>
echo   ^<rect x="32" y="32" width="448" height="448" rx="32" fill="#2d2d2d"/^>
echo   
echo   ^<!-- Drawing canvas representation --^>
echo   ^<rect x="64" y="96" width="384" height="320" rx="16" fill="#ffffff" stroke="#404040" stroke-width="4"/^>
echo   
echo   ^<!-- Drawing elements - circle --^>
echo   ^<circle cx="180" cy="200" r="32" fill="none" stroke="#0066cc" stroke-width="6"/^>
echo   
echo   ^<!-- Drawing elements - rectangle --^>
echo   ^<rect x="240" y="240" width="80" height="60" fill="none" stroke="#ff6b6b" stroke-width="6" rx="8"/^>
echo   
echo   ^<!-- Drawing elements - arrow --^>
echo   ^<path d="M140 280 L200 320 M200 320 L185 305 M200 320 L215 305" 
echo         stroke="#4ecdc4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/^>
echo   
echo   ^<!-- Drawing elements - line/scribble --^>
echo   ^<path d="M280 160 Q320 140 360 160 T400 180" 
echo         stroke="#ff9f43" stroke-width="6" stroke-linecap="round" fill="none"/^>
echo   
echo   ^<!-- Toolbar representation at bottom --^>
echo   ^<rect x="96" y="360" width="320" height="32" rx="16" fill="#404040"/^>
echo   
echo   ^<!-- Tool icons in toolbar --^>
echo   ^<circle cx="120" cy="376" r="6" fill="#0066cc"/^>
echo   ^<rect x="142" y="370" width="12" height="12" fill="#ff6b6b" rx="2"/^>
echo   ^<path d="M170 370 L182 382 M170 382 L182 370" stroke="#4ecdc4" stroke-width="2"/^>
echo   
echo   ^<!-- App title at top --^>
echo   ^<text x="256" y="80" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold"^>Excalidraw^</text^>
echo ^</svg^>
) > excalidraw-icon.svg

echo Base SVG icon created successfully!

REM Create HTML converters for each size
for %%s in (%sizes%) do (
    echo Creating HTML converter for %%sx%%s...
    call :create_html_converter %%s
)

echo.
echo ✅ Icon generation setup complete!
echo.
echo Generated files:
dir /b *.svg *.html 2>nul
echo.
echo 📝 Next steps:
echo   1. Open each 'icon-{size}x{size}-converter.html' file in a web browser
echo   2. Click 'Download Icon' button to save each PNG file
echo   3. All PNG files will be downloaded to your Downloads folder
echo   4. Move the PNG files back to this icons directory
echo.
echo 🎨 The SVG icon is ready to use and features:
echo   - Dark theme Excalidraw design
echo   - Drawing canvas with colored elements
echo   - Professional PWA-ready appearance

goto :eof

:create_html_converter
set size=%1
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo   ^<title^>Icon Converter %size%x%size%^</title^>
echo   ^<style^>
echo     body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
echo     .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
echo     canvas { border: 2px solid #ddd; margin: 20px 0; border-radius: 8px; display: block; }
echo     button { padding: 15px 30px; font-size: 16px; cursor: pointer; background: #0066cc; color: white; border: none; border-radius: 5px; }
echo     button:hover { background: #0052a3; }
echo     .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
echo   ^</style^>
echo ^</head^>
echo ^<body^>
echo   ^<div class="container"^>
echo     ^<h2^>Excalidraw Icon Generator %size%x%size%^</h2^>
echo     ^<div class="info"^>
echo       ^<strong^>Instructions:^</strong^> The icon will be automatically drawn below. Click the download button to save it as a PNG file.
echo     ^</div^>
echo     ^<canvas id="canvas" width="%size%" height="%size%"^>^</canvas^>^<br^>
echo     ^<button onclick="downloadIcon()"^>📥 Download icon-%size%x%size%.png^</button^>
echo   ^</div^>
echo   
echo   ^<script^>
echo     const canvas = document.getElementById('canvas'^);
echo     const ctx = canvas.getContext('2d'^);
echo     const size = %size%;
echo     
echo     function drawIcon(^) {
echo       // Clear canvas
echo       ctx.clearRect(0, 0, size, size^);
echo       
echo       // Scale factor
echo       const scale = size / 512;
echo       ctx.save(^);
echo       ctx.scale(scale, scale^);
echo       
echo       // Background with rounded corners
echo       ctx.fillStyle = '#1e1e1e';
echo       roundRect(ctx, 0, 0, 512, 512, 64^);
echo       ctx.fill(^);
echo       
echo       // Inner container
echo       ctx.fillStyle = '#2d2d2d';
echo       roundRect(ctx, 32, 32, 448, 448, 32^);
echo       ctx.fill(^);
echo       
echo       // Drawing canvas
echo       ctx.fillStyle = '#ffffff';
echo       ctx.strokeStyle = '#404040';
echo       ctx.lineWidth = 4;
echo       roundRect(ctx, 64, 96, 384, 320, 16^);
echo       ctx.fill(^);
echo       ctx.stroke(^);
echo       
echo       // Drawing elements
echo       ctx.lineWidth = 6;
echo       
echo       // Circle
echo       ctx.strokeStyle = '#0066cc';
echo       ctx.beginPath(^);
echo       ctx.arc(180, 200, 32, 0, 2 * Math.PI^);
echo       ctx.stroke(^);
echo       
echo       // Rectangle
echo       ctx.strokeStyle = '#ff6b6b';
echo       ctx.beginPath(^);
echo       roundRect(ctx, 240, 240, 80, 60, 8^);
echo       ctx.stroke(^);
echo       
echo       // Arrow
echo       ctx.strokeStyle = '#4ecdc4';
echo       ctx.lineCap = 'round';
echo       ctx.lineJoin = 'round';
echo       ctx.beginPath(^);
echo       ctx.moveTo(140, 280^);
echo       ctx.lineTo(200, 320^);
echo       ctx.moveTo(200, 320^);
echo       ctx.lineTo(185, 305^);
echo       ctx.moveTo(200, 320^);
echo       ctx.lineTo(215, 305^);
echo       ctx.stroke(^);
echo       
echo       // Curved line
echo       ctx.strokeStyle = '#ff9f43';
echo       ctx.beginPath(^);
echo       ctx.moveTo(280, 160^);
echo       ctx.quadraticCurveTo(320, 140, 360, 160^);
echo       ctx.quadraticCurveTo(380, 170, 400, 180^);
echo       ctx.stroke(^);
echo       
echo       // Toolbar
echo       ctx.fillStyle = '#404040';
echo       roundRect(ctx, 96, 360, 320, 32, 16^);
echo       ctx.fill(^);
echo       
echo       // Tool icons
echo       ctx.fillStyle = '#0066cc';
echo       ctx.beginPath(^);
echo       ctx.arc(120, 376, 6, 0, 2 * Math.PI^);
echo       ctx.fill(^);
echo       
echo       ctx.fillStyle = '#ff6b6b';
echo       roundRect(ctx, 142, 370, 12, 12, 2^);
echo       ctx.fill(^);
echo       
echo       // Title (scaled appropriately^)
echo       if (size ^>= 128^) {
echo         ctx.fillStyle = '#ffffff';
echo         ctx.font = '24px Arial, sans-serif';
echo         ctx.textAlign = 'center';
echo         ctx.fillText('Excalidraw', 256, 80^);
echo       }
echo       
echo       ctx.restore(^);
echo     }
echo     
echo     function roundRect(ctx, x, y, width, height, radius^) {
echo       ctx.beginPath(^);
echo       ctx.moveTo(x + radius, y^);
echo       ctx.arcTo(x + width, y, x + width, y + height, radius^);
echo       ctx.arcTo(x + width, y + height, x, y + height, radius^);
echo       ctx.arcTo(x, y + height, x, y, radius^);
echo       ctx.arcTo(x, y, x + width, y, radius^);
echo       ctx.closePath(^);
echo     }
echo     
echo     function downloadIcon(^) {
echo       const link = document.createElement('a'^);
echo       link.download = 'icon-%size%x%size%.png';
echo       link.href = canvas.toDataURL('image/png'^);
echo       link.click(^);
echo     }
echo     
echo     // Draw the icon when page loads
echo     setTimeout(drawIcon, 100^);
echo   ^</script^>
echo ^</body^>
echo ^</html^>
) > icon-%size%x%size%-converter.html
goto :eof

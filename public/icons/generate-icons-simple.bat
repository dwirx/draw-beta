@echo off
echo Creating Excalidraw PWA icons...

echo Creating base SVG icon...
echo ^<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"^> > excalidraw-icon.svg
echo   ^<rect width="512" height="512" rx="64" fill="#1e1e1e"/^> >> excalidraw-icon.svg
echo   ^<rect x="32" y="32" width="448" height="448" rx="32" fill="#2d2d2d"/^> >> excalidraw-icon.svg
echo   ^<rect x="64" y="96" width="384" height="320" rx="16" fill="#ffffff" stroke="#404040" stroke-width="4"/^> >> excalidraw-icon.svg
echo   ^<circle cx="180" cy="200" r="32" fill="none" stroke="#0066cc" stroke-width="6"/^> >> excalidraw-icon.svg
echo   ^<rect x="240" y="240" width="80" height="60" fill="none" stroke="#ff6b6b" stroke-width="6" rx="8"/^> >> excalidraw-icon.svg
echo   ^<path d="M140 280 L200 320 M200 320 L185 305 M200 320 L215 305" stroke="#4ecdc4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/^> >> excalidraw-icon.svg
echo   ^<path d="M280 160 Q320 140 360 160 T400 180" stroke="#ff9f43" stroke-width="6" stroke-linecap="round" fill="none"/^> >> excalidraw-icon.svg
echo   ^<rect x="96" y="360" width="320" height="32" rx="16" fill="#404040"/^> >> excalidraw-icon.svg
echo   ^<circle cx="120" cy="376" r="6" fill="#0066cc"/^> >> excalidraw-icon.svg
echo   ^<rect x="142" y="370" width="12" height="12" fill="#ff6b6b" rx="2"/^> >> excalidraw-icon.svg
echo   ^<path d="M170 370 L182 382 M170 382 L182 370" stroke="#4ecdc4" stroke-width="2"/^> >> excalidraw-icon.svg
echo   ^<text x="256" y="80" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold"^>Excalidraw^</text^> >> excalidraw-icon.svg
echo ^</svg^> >> excalidraw-icon.svg

echo SVG icon created successfully!
echo.
echo ✅ Icon generation complete!
echo.
echo Generated files:
dir /b *.svg 2>nul
echo.
echo 📝 Next steps to create PNG icons:
echo   1. Install a SVG to PNG converter like:
echo      - Inkscape (https://inkscape.org/)
echo      - Online converter (https://convertio.co/svg-png/)
echo      - Use the provided HTML converters
echo.
echo 🎨 Created Excalidraw-themed SVG icon with:
echo   - Dark background with rounded corners
echo   - White drawing canvas
echo   - Colored drawing elements (circle, rectangle, arrow, curve)
echo   - Toolbar representation
echo   - App title
echo.
echo For PWA, you need PNG icons in these sizes:
echo 72x72, 96x96, 128x128, 144x144, 152x152, 180x180, 192x192, 384x384, 512x512

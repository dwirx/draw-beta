@echo off
echo.
echo ================================
echo   PWA Test and Build Script
echo ================================
echo.

echo [1/5] Installing dependencies...
call npm install

echo.
echo [2/5] Checking PWA icons...
if not exist "public\icons\icon-192x192.png" (
    echo WARNING: PWA icons missing! Opening icon generator...
    start "" "public\icons\quick-icon-generator.html"
    echo.
    echo Please:
    echo  1. Generate icons using the opened page
    echo  2. Download all icons
    echo  3. Save them to public\icons\ folder
    echo  4. Press any key to continue...
    pause >nul
)

echo.
echo [3/5] Building PWA with optimizations...
set NODE_OPTIONS=--max-old-space-size=4096
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo Build failed! This might be due to large bundle size.
    echo Running build-pwa.bat for advanced troubleshooting...
    call build-pwa.bat
    goto :end
)

echo.
echo [4/5] Starting preview server...
echo.
echo PWA will be available at:
echo  - Local:   http://localhost:4173
echo  - Network: Check console for IP address
echo.
echo To test PWA features:
echo  1. Open in Chrome/Edge
echo  2. Go to Developer Tools - Application - Service Workers
echo  3. Check "Offline" to test offline mode
echo  4. Install PWA using address bar install button
echo  5. Test on mobile: use ngrok or similar for HTTPS
echo.
echo PWA Testing Checklist:
echo  - Service Worker registration
echo  - Manifest.json validation
echo  - Icon display (all sizes)
echo  - Offline functionality
echo  - Install prompt
echo  - Mobile responsiveness
echo.
echo Press Ctrl+C to stop the server
echo.

start "" "http://localhost:4173"
call npm run preview

:end
echo.
echo PWA testing completed!
pause

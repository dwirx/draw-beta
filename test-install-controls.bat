@echo off
echo.
echo ========================================
echo   PWA Install Controls Test Script
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Building for PWA testing...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed! Please check the console for errors.
    pause
    exit /b 1
)

echo.
echo [3/4] Starting preview server...
echo.
echo Testing PWA Install Controls:
echo.
echo New Features to Test:
echo  1. Install button appears after 5 seconds
echo  2. Close button (×) - hides for session
echo  3. Minimize button (-) - minimizes to icon
echo  4. Restore from minimize (click 📱 icon)
echo  5. Hover effects on all buttons
echo  6. Smooth animations
echo.
echo PWA will be available at:
echo  - Local:   http://localhost:4173
echo  - Network: Check console for IP address
echo.
echo Testing Steps:
echo  1. Wait 5 seconds for install button to appear
echo  2. Test hover effects on all buttons
echo  3. Click minimize (-) button
echo  4. Click restored 📱 icon to expand
echo  5. Click close (×) button
echo  6. Refresh page to test session storage
echo  7. Test on mobile device for touch experience
echo.
echo Advanced Testing:
echo  - Open Developer Tools → Application → Storage
echo  - Check sessionStorage for 'pwa-install-dismissed'
echo  - Test PWA installation process
echo  - Test minimized reminder after 2 minutes
echo.
echo Press Ctrl+C to stop the server when done testing
echo.

start "" "http://localhost:4173"
call npm run preview

echo.
echo Testing completed!
echo.
echo If you found any issues:
echo  1. Check browser console for errors
echo  2. Verify PWA requirements are met
echo  3. Test in different browsers
echo  4. Check mobile responsiveness
echo.
pause

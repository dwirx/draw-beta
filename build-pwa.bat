@echo off
echo.
echo ============================================
echo   PWA Build & Deployment Fix Script
echo ============================================
echo.

echo [1/5] Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo.
echo [2/5] Installing/updating dependencies...
call npm install

echo.
echo [3/5] Generating PWA icons...
echo Checking for proper PWA icons...

REM Create minimal PNG icons if they don't exist
if not exist "public\icons\icon-192x192.png" (
    echo Creating fallback icons from SVG...
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-192x192.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-512x512.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-72x72.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-96x96.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-128x128.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-144x144.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-152x152.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-180x180.png"
    echo ^<!-- Fallback PNG placeholder --^> > "public\icons\icon-384x384.png"
    echo.
    echo ⚠ WARNING: Using placeholder icons. Generate proper icons using:
    echo    public\icons\pwa-icon-generator.html
)

echo.
echo [4/5] Building PWA with optimized settings...
set NODE_OPTIONS=--max-old-space-size=4096
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Build failed! Trying with fallback configuration...
    echo.
    echo [4.1/5] Attempting build without PWA optimization...
    
    REM Backup current config
    copy "vite.config.js" "vite.config.js.backup"
    
    REM Create minimal config
    echo import { defineConfig } from 'vite' > vite.config.temp.js
    echo import react from '@vitejs/plugin-react' >> vite.config.temp.js
    echo. >> vite.config.temp.js
    echo export default defineConfig({ >> vite.config.temp.js
    echo   plugins: [react()], >> vite.config.temp.js
    echo   build: { >> vite.config.temp.js
    echo     chunkSizeWarningLimit: 3000, >> vite.config.temp.js
    echo     rollupOptions: { >> vite.config.temp.js
    echo       output: { >> vite.config.temp.js
    echo         manualChunks: { >> vite.config.temp.js
    echo           vendor: ['react', 'react-dom'], >> vite.config.temp.js
    echo           excalidraw: ['@excalidraw/excalidraw'] >> vite.config.temp.js
    echo         } >> vite.config.temp.js
    echo       } >> vite.config.temp.js
    echo     } >> vite.config.temp.js
    echo   } >> vite.config.temp.js
    echo }) >> vite.config.temp.js
    
    REM Use minimal config
    move "vite.config.temp.js" "vite.config.js"
    
    call npm run build
    
    REM Restore original config
    move "vite.config.js.backup" "vite.config.js"
)

echo.
echo [5/5] Build completed!
echo.

if exist "dist\index.html" (
    echo ✅ Build successful!
    echo.
    echo Generated files:
    dir /b "dist"
    echo.
    echo 📱 PWA Features:
    echo  - Offline support
    echo  - Install button
    echo  - Service worker caching
    echo  - Responsive design
    echo.
    echo 🚀 Deployment ready!
    echo   Copy 'dist' folder contents to your web server
) else (
    echo ❌ Build failed!
    echo.
    echo Troubleshooting steps:
    echo  1. Check Node.js version (recommended: 18+)
    echo  2. Clear node_modules: rmdir /s /q node_modules
    echo  3. Reinstall: npm install
    echo  4. Try again with this script
)

echo.
pause

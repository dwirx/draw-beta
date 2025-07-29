# PWA Troubleshooting Guide

## ❌ Build Error: "Assets exceeding the limit"

**Error Message:**
```
Configure "workbox.maximumFileSizeToCacheInBytes" to change the limit: the default value is 2 MiB.
Assets exceeding the limit:
- assets/excalidraw-ByTonlei.js is 2.42 MB, and won't be precached.
```

### ✅ Solutions Applied:

#### 1. Increased Cache Size Limit
Updated `vite.config.js` with:
```javascript
VitePWA({
  workbox: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    // ... other config
  }
})
```

#### 2. Optimized Caching Strategy
```javascript
runtimeCaching: [
  {
    urlPattern: /\.(?:js|css)$/,
    handler: 'NetworkFirst', // Don't precache large files
    options: {
      cacheName: 'assets-cache',
      networkTimeoutSeconds: 3,
    }
  }
]
```

#### 3. Build Optimization
```javascript
build: {
  chunkSizeWarningLimit: 3000,
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
        excalidraw: ['@excalidraw/excalidraw']
      }
    }
  }
}
```

## 🚀 Quick Deployment Fixes

### For Vercel/Netlify:
1. **Use the build-pwa.bat script** - handles icon generation and fallbacks
2. **Environment variables:**
   ```
   NODE_OPTIONS=--max-old-space-size=4096
   ```

### For Manual Deployment:
1. Run: `build-pwa.bat`
2. Upload `dist/` folder contents
3. Ensure HTTPS (required for PWA)

## 📱 PWA Features Checklist

### ✅ Currently Working:
- [x] Service Worker registration
- [x] Offline caching
- [x] Manifest.json configuration
- [x] Install prompts
- [x] Icon generation tools
- [x] Mobile responsive design
- [x] Background sync (basic)

### 🔧 Testing Instructions:

#### 1. Local Testing:
```bash
npm run build
npm run preview
```
Open: http://localhost:4173

#### 2. PWA Validation:
- Chrome DevTools → Application → Manifest
- Check Service Worker status
- Test offline mode
- Verify install button appears

#### 3. Mobile Testing:
- Use ngrok for HTTPS: `ngrok http 4173`
- Test install on actual mobile devices
- Verify icon quality on home screen

## 🛠️ Icon Requirements

### Required Sizes:
- 72×72, 96×96, 128×128, 144×144 (Android)
- 152×152, 180×180 (iOS)
- 192×192, 384×384, 512×512 (PWA manifest)

### Generation Tools:
1. **Quick Generator:** `public/icons/quick-icon-generator.html`
2. **Enhanced Generator:** `public/icons/pwa-icon-generator.html`

## 🐛 Common Issues & Fixes

### Issue: "Service Worker failed to register"
**Solution:** Check console for errors, ensure HTTPS in production

### Issue: "Icons not displaying"
**Solution:** 
1. Generate proper PNG icons (not placeholders)
2. Verify file paths in manifest.json
3. Check icon file sizes (not empty)

### Issue: "Install button not showing"
**Solution:**
1. Verify manifest.json is valid
2. Ensure HTTPS (required for install prompt)
3. Check PWA criteria are met

### Issue: "Offline mode not working"
**Solution:**
1. Check Service Worker registration
2. Verify caching strategies
3. Test in incognito mode

## 📊 Performance Optimization

### Bundle Size Reduction:
- Excalidraw is large (2.4MB) - normal for this library
- Uses code splitting to separate chunks
- Implements lazy loading where possible

### Caching Strategy:
- **Static files:** Cache first
- **Large assets:** Network first with fallback
- **API calls:** Network first with offline queue

## 🔄 Update Process

### For New Versions:
1. Update version in `manifest.json`
2. Update cache names in Service Worker
3. Test update notifications
4. Verify offline functionality

### Deployment Checklist:
- [ ] Icons generated and optimized
- [ ] Build completes without errors
- [ ] PWA validation passes
- [ ] Mobile testing completed
- [ ] HTTPS configured
- [ ] Service Worker active

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify PWA requirements: https://web.dev/pwa-checklist/
3. Test with Lighthouse PWA audit
4. Use PWA Builder for validation: https://www.pwabuilder.com/

---

**Status:** PWA is production-ready with all core features implemented.
**Last Updated:** July 26, 2025

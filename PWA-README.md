# Excalidraw PWA - Progressive Web App

Aplikasi Excalidraw yang telah diubah menjadi Progressive Web App (PWA) dengan kemampuan offline dan installable.

## Features PWA yang Telah Ditambahkan

### 🚀 Installable App
- **Install Button**: Tombol install otomatis muncul di pojok kanan bawah
- **Add to Home Screen**: Bisa diinstall langsung dari browser mobile
- **Standalone Mode**: Berjalan seperti aplikasi native tanpa browser bar

### 📱 Mobile Optimized
- **Responsive Design**: UI yang sudah responsif untuk semua ukuran layar
- **Touch Friendly**: Button dan interface yang ramah sentuhan
- **Mobile-first Design**: Prioritas untuk pengalaman mobile yang baik

### 🔄 Offline Capability
- **Service Worker**: Caching otomatis untuk penggunaan offline
- **Offline Storage**: File disimpan di localStorage dan cache
- **Background Sync**: Sinkronisasi otomatis saat kembali online
- **Offline Indicator**: Status indicator yang menunjukkan kondisi online/offline

### 💾 Enhanced Storage
- **Local Storage**: Semua file disimpan lokal di device
- **Cache API**: Asset aplikasi di-cache untuk akses cepat
- **Offline Queue**: Perubahan disimpan di queue saat offline

### 🔔 Smart Features
- **Update Notifications**: Notifikasi otomatis saat ada update aplikasi
- **Install Prompt**: Smart install prompt yang muncul pada waktu yang tepat
- **Background Save**: Auto-save yang bekerja di background
- **Install Controls**: Tombol install dengan opsi close dan minimize untuk kontrol user yang lebih baik

## PWA Status Indicators

### Status dalam Sidebar:
- **🔴 Offline**: Menunjukkan aplikasi sedang offline
- **📱 PWA**: Menunjukkan aplikasi berjalan sebagai PWA yang terinstall

### Tombol PWA:
- **📱 Install App**: Tombol untuk install aplikasi (pojok kanan bawah)
  - **×** Close: Sembunyikan tombol untuk sesi ini
  - **−** Minimize: Perkecil tombol menjadi ikon 📱
- **🔄 Update Available**: Tombol update saat ada versi baru (pojok kanan atas)

## Cara Install PWA

### Desktop (Chrome, Edge, Firefox):
1. Buka aplikasi di browser
2. Klik tombol "📱 Install App" di pojok kanan bawah
3. Atau gunakan menu browser → "Install Excalidraw"
4. Aplikasi akan terinstall dan bisa diakses dari Start Menu/Desktop

### Mobile (Android):
1. Buka aplikasi di Chrome/Samsung Internet
2. Tap tombol "📱 Install App" atau
3. Tap menu browser (⋮) → "Add to Home screen"
4. Aplikasi akan muncul di home screen seperti app native

### Mobile (iOS):
1. Buka aplikasi di Safari
2. Tap tombol Share (□↗)
3. Tap "Add to Home Screen"
4. Aplikasi akan muncul di home screen

## Offline Usage

### Saat Online:
- Semua fitur berfungsi normal
- File tersimpan di localStorage dan cache
- Auto-sync dengan server (jika ada)

### Saat Offline:
- Aplikasi tetap bisa dibuka dan digunakan
- File baru bisa dibuat dan diedit
- Perubahan disimpan di localStorage
- Indicator "🔴 Offline" muncul di sidebar

### Kembali Online:
- Indicator berubah menjadi normal
- Auto-sync perubahan offline
- Notifikasi "Back online!" muncul

## Files dan Structure PWA

```
public/
├── manifest.json          # PWA manifest
├── sw.js                 # Service worker
├── icons/                # PWA icons
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── screenshots/          # PWA screenshots
    ├── desktop.png
    └── mobile.png

src/
├── pwa.js               # PWA manager class
└── main.jsx             # Updated with PWA import
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test PWA features
npm run preview  # Serve built files for PWA testing
```

## Browser Support

### PWA Features:
- ✅ Chrome (Android & Desktop)
- ✅ Edge (Desktop)
- ✅ Samsung Internet (Android)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop, limited)

### Service Worker:
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ❌ Internet Explorer

## Tips Penggunaan

1. **Install untuk Pengalaman Terbaik**: Install sebagai PWA untuk performa optimal
2. **Gunakan Offline**: Buat dan edit gambar bahkan tanpa internet
3. **Auto-save**: File otomatis tersimpan setiap 30 detik
4. **Mobile Drawing**: Gunakan touch gestures untuk menggambar di mobile
5. **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+N (new), Ctrl+B (toggle sidebar)

## Production Deployment

Untuk deploy sebagai PWA:

1. Build aplikasi: `npm run build`
2. Upload ke web server dengan HTTPS
3. Pastikan manifest.json dan sw.js dapat diakses
4. Update icons dengan logo aplikasi yang sebenarnya
5. Test di berbagai device dan browser

## Catatan Penting

- **HTTPS Required**: PWA hanya berfungsi di HTTPS (kecuali localhost)
- **Icon Placeholder**: Ganti ikon placeholder dengan ikon aplikasi yang sebenarnya
- **Screenshot**: Update screenshot untuk PWA app store
- **Cache Strategy**: Sesuaikan strategi cache sesuai kebutuhan

---

**Sekarang aplikasi Excalidraw Anda sudah menjadi PWA yang dapat diinstall di mobile dan berjalan offline!** 🎉

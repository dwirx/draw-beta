# Excalidraw - Obsidian Like

Aplikasi Excalidraw dengan fitur save/load yang mirip dengan Obsidian. Aplikasi ini memungkinkan Anda untuk membuat, menyimpan, dan mengelola drawing dengan mudah.

## Fitur

### 🎨 Drawing
- Interface Excalidraw yang familiar dan mudah digunakan
- Semua fitur drawing standar Excalidraw tersedia
- Theme yang dapat disesuaikan

### 📁 File Management
- **Create**: Buat file baru dengan mudah
- **Save**: Auto-save setiap 30 detik + manual save
- **Load**: Buka file yang tersimpan dengan sekali klik
- **Delete**: Hapus file yang tidak diperlukan
- **Rename**: Ganti nama file dengan double-click
- **Duplicate**: Duplikasi file untuk variasi

### 💾 Storage
- Semua data tersimpan di localStorage browser
- Persistent storage - file tetap ada setelah refresh/restart
- Load otomatis file terakhir yang dibuka

### 📤 Export/Import
- **Export ke PNG**: Untuk sharing sebagai gambar
- **Export ke SVG**: Format vector yang scalable
- **Export ke .excalidraw**: Format native untuk backup
- **Import**: Import file .excalidraw dari komputer

### ⌨️ Keyboard Shortcuts
- `Ctrl + S`: Save file saat ini
- `Ctrl + N`: Buat file baru
- `Ctrl + O`: Focus ke file list

## Instalasi

1. Clone atau download project ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:3000`

## Cara Penggunaan

### Membuat File Baru
1. Ketik nama file di input box di sidebar kiri
2. Tekan Enter atau klik di luar input
3. File baru akan otomatis terbuka dan siap digunakan

### Menyimpan Drawing
- **Auto-save**: Aplikasi otomatis menyimpan setiap 30 detik
- **Manual save**: Klik tombol "💾 Save" atau tekan `Ctrl + S`

### Membuka File
- Klik nama file di sidebar kiri
- File akan langsung terbuka dengan semua drawing yang tersimpan

### Export Drawing
1. Klik tombol "📤 Export ▼"
2. Pilih format yang diinginkan:
   - PNG: Untuk sharing sebagai gambar
   - SVG: Format vector
   - .excalidraw: Format asli untuk backup

### Import File
1. Klik tombol "📂 Import"
2. Pilih file .excalidraw dari komputer
3. File akan otomatis ditambahkan ke daftar dan dibuka

## Tips Penggunaan

### Workflow seperti Obsidian
1. **Quick Note**: Buat file baru dengan `Ctrl + N` untuk ide cepat
2. **Organize**: Gunakan nama file yang deskriptif untuk mudah dicari
3. **Backup**: Export file penting ke .excalidraw untuk backup
4. **Duplicate**: Gunakan duplicate untuk membuat variasi dari design yang sudah ada

### Best Practices
- Gunakan nama file yang jelas dan deskriptif
- Export ke PNG/SVG untuk sharing dengan tim
- Backup file penting dengan export ke .excalidraw
- Manfaatkan auto-save, tidak perlu save manual terus-menerus

## Teknologi

- **React 18**: UI framework
- **Excalidraw**: Drawing engine
- **Vite**: Build tool dan development server
- **LocalStorage**: Data persistence

## Development

### Build untuk Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Troubleshooting

### File Hilang
- File tersimpan di localStorage browser
- Jika clear browser data, file akan hilang
- Solusi: Export file penting ke .excalidraw secara berkala

### Performance
- Jika aplikasi lambat dengan banyak file, coba refresh browser
- LocalStorage memiliki batas ~5-10MB
- Hapus file lama yang tidak diperlukan

### Export Tidak Berfungsi
- Pastikan browser mendukung HTML5 Canvas dan Blob API
- Coba browser lain jika masalah berlanjut

## Lisensi

MIT License - Silakan gunakan untuk project pribadi maupun komersial.

## Kontribusi

Pull request dan issue reports sangat diterima!

---

**Happy Drawing! 🎨**

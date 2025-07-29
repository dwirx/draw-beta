
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Increase file size limit to handle Excalidraw bundle
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            // Cache large assets with network first strategy
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Excalidraw - Obsidian Like',
        short_name: 'Excalidraw',
        description: 'A powerful offline drawing and diagramming tool with file management',
        theme_color: '#1e1e1e',
        background_color: '#1e1e1e',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['productivity', 'utilities'],
        lang: 'en',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'New Drawing',
            short_name: 'New',
            description: 'Create a new drawing',
            url: '/?new=true',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['vite.dwx.my.id'], // ✅ Izinkan host ini
  },
  define: {
    'process.env': {},
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React-DOM
          react: ['react', 'react-dom'],
          // Separate Excalidraw into its own chunk
          excalidraw: ['@excalidraw/excalidraw'],
          // Other vendor libraries
          vendor: []
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: false,
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // PWA Configuration
  publicDir: 'public',
  base: '/',
})

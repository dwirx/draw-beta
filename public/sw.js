const CACHE_NAME = 'excalidraw-pwa-v1';
const STATIC_CACHE = 'excalidraw-static-v1';
const DYNAMIC_CACHE = 'excalidraw-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/SimpleApp.jsx',
  '/src/components/FileManager.jsx',
  '/src/components/ToastContainer.jsx',
  '/src/components/Toolbar.jsx',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('Service Worker: Caching dynamic content', event.request.url);
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Service Worker: Error caching dynamic content', error);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Network request failed', error);
            
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other requests, you might want to return a default offline resource
            throw error;
          });
      })
  );
});

// Background sync for saving files when back online
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-save') {
    event.waitUntil(
      // Handle background save operations
      handleBackgroundSave()
    );
  }
});

// Push notification support (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('Service Worker: Push notification received', data);
    
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Excalidraw', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Handle background save operations
async function handleBackgroundSave() {
  try {
    // Get pending save operations from IndexedDB or localStorage
    const pendingSaves = await getPendingSaves();
    
    for (const save of pendingSaves) {
      try {
        // Process the save operation
        await processSave(save);
        // Remove from pending saves
        await removePendingSave(save.id);
      } catch (error) {
        console.error('Service Worker: Error processing background save', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error in background save handler', error);
  }
}

// Placeholder functions for save operations
async function getPendingSaves() {
  // Implementation would get pending saves from storage
  return [];
}

async function processSave(save) {
  // Implementation would process the save operation
  console.log('Service Worker: Processing save', save);
}

async function removePendingSave(id) {
  // Implementation would remove the save from pending list
  console.log('Service Worker: Removing pending save', id);
}

// Message handling from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
      default:
        console.log('Service Worker: Unknown message type', event.data.type);
    }
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('Service Worker: All caches cleared');
}

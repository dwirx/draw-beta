// Enhanced Storage Manager with LocalForage
// Provides high-capacity storage using IndexedDB/WebSQL with localStorage fallback

import localforage from 'localforage';

class StorageManager {
  constructor() {
    this.isInitialized = false;
    this.storageInstances = {};
    this.init();
  }

  async init() {
    try {
      // Configure localForage for different data types
      
      // Main app data storage (drawings, files)
      this.storageInstances.appData = localforage.createInstance({
        name: 'ExcalidrawApp',
        storeName: 'appData',
        description: 'Excalidraw application data and drawings'
      });

      // Cache storage for assets and resources
      this.storageInstances.cache = localforage.createInstance({
        name: 'ExcalidrawApp', 
        storeName: 'cache',
        description: 'Cached resources and assets'
      });

      // User preferences and settings
      this.storageInstances.settings = localforage.createInstance({
        name: 'ExcalidrawApp',
        storeName: 'settings', 
        description: 'User preferences and application settings'
      });

      // Offline queue for sync when back online
      this.storageInstances.offlineQueue = localforage.createInstance({
        name: 'ExcalidrawApp',
        storeName: 'offlineQueue',
        description: 'Offline operations queue'
      });

      await this.testStorage();
      this.isInitialized = true;
      console.log('StorageManager: Initialized with localForage');
      
      // Log storage info
      await this.logStorageInfo();
      
    } catch (error) {
      console.error('StorageManager: Initialization failed', error);
      this.fallbackToLocalStorage();
    }
  }

  async testStorage() {
    const testKey = '_storage_test';
    const testData = { test: true, timestamp: Date.now() };
    
    // Test each storage instance
    for (const [name, instance] of Object.entries(this.storageInstances)) {
      await instance.setItem(testKey, testData);
      const retrieved = await instance.getItem(testKey);
      
      if (!retrieved || retrieved.test !== true) {
        throw new Error(`Storage test failed for ${name}`);
      }
      
      await instance.removeItem(testKey);
      console.log(`StorageManager: ${name} storage test passed`);
    }
  }

  async logStorageInfo() {
    const driver = await this.storageInstances.appData.driver();
    const driverName = {
      'localStorageWrapper': 'localStorage',
      'indexedDBWrapper': 'IndexedDB', 
      'webSQLWrapper': 'WebSQL'
    }[driver] || driver;

    console.log(`StorageManager: Using ${driverName} as primary driver`);
    
    // Estimate storage usage
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
      const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
      
      console.log(`StorageManager: Storage usage: ${usedMB}MB / ${quotaMB}MB`);
    }
  }

  fallbackToLocalStorage() {
    console.warn('StorageManager: Falling back to localStorage');
    this.isInitialized = true;
    // Create simple localStorage wrappers
    this.storageInstances = {
      appData: this.createLocalStorageWrapper('excalidraw_app_'),
      cache: this.createLocalStorageWrapper('excalidraw_cache_'),
      settings: this.createLocalStorageWrapper('excalidraw_settings_'),
      offlineQueue: this.createLocalStorageWrapper('excalidraw_queue_')
    };
  }

  createLocalStorageWrapper(prefix) {
    return {
      async setItem(key, value) {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      },
      async getItem(key) {
        const item = localStorage.getItem(prefix + key);
        return item ? JSON.parse(item) : null;
      },
      async removeItem(key) {
        localStorage.removeItem(prefix + key);
      },
      async clear() {
        Object.keys(localStorage)
          .filter(key => key.startsWith(prefix))
          .forEach(key => localStorage.removeItem(key));
      },
      async keys() {
        return Object.keys(localStorage)
          .filter(key => key.startsWith(prefix))
          .map(key => key.replace(prefix, ''));
      }
    };
  }

  // Public API methods

  // App Data Methods (drawings, files)
  async saveDrawing(id, drawingData) {
    if (!this.isInitialized) await this.init();
    
    const data = {
      id,
      data: drawingData,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    await this.storageInstances.appData.setItem(`drawing_${id}`, data);
    console.log(`StorageManager: Drawing ${id} saved`);
    return data;
  }

  async getDrawing(id) {
    if (!this.isInitialized) await this.init();
    return await this.storageInstances.appData.getItem(`drawing_${id}`);
  }

  async getAllDrawings() {
    if (!this.isInitialized) await this.init();
    
    const keys = await this.storageInstances.appData.keys();
    const drawingKeys = keys.filter(key => key.startsWith('drawing_'));
    
    const drawings = [];
    for (const key of drawingKeys) {
      const drawing = await this.storageInstances.appData.getItem(key);
      if (drawing) {
        drawings.push(drawing);
      }
    }
    
    return drawings.sort((a, b) => b.timestamp - a.timestamp);
  }

  async deleteDrawing(id) {
    if (!this.isInitialized) await this.init();
    await this.storageInstances.appData.removeItem(`drawing_${id}`);
    console.log(`StorageManager: Drawing ${id} deleted`);
  }

  // File Management Methods
  async saveFile(fileName, fileData) {
    if (!this.isInitialized) await this.init();
    
    const data = {
      name: fileName,
      data: fileData,
      timestamp: Date.now(),
      size: JSON.stringify(fileData).length
    };
    
    await this.storageInstances.appData.setItem(`file_${fileName}`, data);
    console.log(`StorageManager: File ${fileName} saved (${(data.size / 1024).toFixed(2)}KB)`);
    return data;
  }

  async getFile(fileName) {
    if (!this.isInitialized) await this.init();
    return await this.storageInstances.appData.getItem(`file_${fileName}`);
  }

  async getAllFiles() {
    if (!this.isInitialized) await this.init();
    
    const keys = await this.storageInstances.appData.keys();
    const fileKeys = keys.filter(key => key.startsWith('file_'));
    
    const files = [];
    for (const key of fileKeys) {
      const file = await this.storageInstances.appData.getItem(key);
      if (file) {
        files.push(file);
      }
    }
    
    return files.sort((a, b) => b.timestamp - a.timestamp);
  }

  async deleteFile(fileName) {
    if (!this.isInitialized) await this.init();
    await this.storageInstances.appData.removeItem(`file_${fileName}`);
    console.log(`StorageManager: File ${fileName} deleted`);
  }

  // Settings Methods
  async saveSetting(key, value) {
    if (!this.isInitialized) await this.init();
    await this.storageInstances.settings.setItem(key, value);
  }

  async getSetting(key, defaultValue = null) {
    if (!this.isInitialized) await this.init();
    const value = await this.storageInstances.settings.getItem(key);
    return value !== null ? value : defaultValue;
  }

  // Cache Methods
  async cacheResource(url, data) {
    if (!this.isInitialized) await this.init();
    
    const cacheData = {
      url,
      data,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    await this.storageInstances.cache.setItem(`cache_${btoa(url)}`, cacheData);
  }

  async getCachedResource(url) {
    if (!this.isInitialized) await this.init();
    
    const cached = await this.storageInstances.cache.getItem(`cache_${btoa(url)}`);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      await this.storageInstances.cache.removeItem(`cache_${btoa(url)}`);
    }
    
    return null;
  }

  // Offline Queue Methods
  async addToOfflineQueue(operation) {
    if (!this.isInitialized) await this.init();
    
    const queueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      timestamp: Date.now(),
      retries: 0
    };
    
    await this.storageInstances.offlineQueue.setItem(queueItem.id, queueItem);
    console.log('StorageManager: Added to offline queue', queueItem.id);
    return queueItem;
  }

  async getOfflineQueue() {
    if (!this.isInitialized) await this.init();
    
    const keys = await this.storageInstances.offlineQueue.keys();
    const queueItems = [];
    
    for (const key of keys) {
      const item = await this.storageInstances.offlineQueue.getItem(key);
      if (item) {
        queueItems.push(item);
      }
    }
    
    return queueItems.sort((a, b) => a.timestamp - b.timestamp);
  }

  async removeFromOfflineQueue(id) {
    if (!this.isInitialized) await this.init();
    await this.storageInstances.offlineQueue.removeItem(id);
  }

  async clearOfflineQueue() {
    if (!this.isInitialized) await this.init();
    await this.storageInstances.offlineQueue.clear();
  }

  // Utility Methods
  async getStorageUsage() {
    if (!this.isInitialized) await this.init();
    
    const usage = {};
    
    for (const [name, instance] of Object.entries(this.storageInstances)) {
      const keys = await instance.keys();
      let totalSize = 0;
      
      for (const key of keys) {
        const item = await instance.getItem(key);
        if (item) {
          totalSize += JSON.stringify(item).length;
        }
      }
      
      usage[name] = {
        itemCount: keys.length,
        sizeBytes: totalSize,
        sizeMB: (totalSize / 1024 / 1024).toFixed(2)
      };
    }
    
    return usage;
  }

  async clearAllData() {
    if (!this.isInitialized) await this.init();
    
    for (const [name, instance] of Object.entries(this.storageInstances)) {
      await instance.clear();
      console.log(`StorageManager: Cleared ${name} storage`);
    }
  }

  async exportData() {
    if (!this.isInitialized) await this.init();
    
    const exportData = {
      timestamp: Date.now(),
      version: '1.0',
      data: {}
    };
    
    for (const [name, instance] of Object.entries(this.storageInstances)) {
      const keys = await instance.keys();
      exportData.data[name] = {};
      
      for (const key of keys) {
        exportData.data[name][key] = await instance.getItem(key);
      }
    }
    
    return exportData;
  }

  async importData(importData) {
    if (!this.isInitialized) await this.init();
    
    if (!importData.data) {
      throw new Error('Invalid import data format');
    }
    
    for (const [storageName, storageData] of Object.entries(importData.data)) {
      if (this.storageInstances[storageName]) {
        for (const [key, value] of Object.entries(storageData)) {
          await this.storageInstances[storageName].setItem(key, value);
        }
      }
    }
    
    console.log('StorageManager: Data imported successfully');
  }
}

// Create global storage manager instance
const storageManager = new StorageManager();

// Export for use in other modules
export default storageManager;

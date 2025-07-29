// Migration utility to transfer data from localStorage to localForage
import storageManager from './storageManager.js';

class StorageMigration {
  constructor() {
    this.migrationKey = 'storage_migrated_v1';
  }

  async checkAndMigrate() {
    // Check if migration has already been done
    const alreadyMigrated = await storageManager.getSetting(this.migrationKey, false);
    
    if (alreadyMigrated) {
      console.log('StorageMigration: Already migrated to enhanced storage');
      return;
    }

    console.log('StorageMigration: Starting migration from localStorage...');
    
    try {
      await this.migrateFiles();
      await this.migrateSettings();
      await this.migrateOfflineQueue();
      
      // Mark migration as complete
      await storageManager.saveSetting(this.migrationKey, true);
      
      console.log('StorageMigration: Migration completed successfully');
      
      // Show user notification
      if (window.showToast) {
        window.showToast('Storage upgraded to enhanced system with larger capacity!', 'success');
      }
      
    } catch (error) {
      console.error('StorageMigration: Migration failed', error);
      
      if (window.showToast) {
        window.showToast('Storage migration failed, using fallback mode', 'warning');
      }
    }
  }

  async migrateFiles() {
    const savedFiles = localStorage.getItem('excalidraw-files');
    
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        console.log(`StorageMigration: Migrating ${files.length} files...`);
        
        for (const file of files) {
          // Convert old format to new format if needed
          const fileData = {
            id: file.id,
            name: file.name,
            elements: file.elements || [],
            appState: file.appState || {},
            createdAt: file.createdAt || new Date().toISOString(),
            updatedAt: file.updatedAt || new Date().toISOString()
          };
          
          await storageManager.saveFile(file.name, fileData);
        }
        
        // Save files list for quick access
        await storageManager.saveSetting('filesList', files);
        
        console.log('StorageMigration: Files migrated successfully');
        
      } catch (error) {
        console.error('StorageMigration: Error migrating files', error);
      }
    }
  }

  async migrateSettings() {
    // Migrate last opened file
    const lastFile = localStorage.getItem('excalidraw-last-file');
    if (lastFile) {
      await storageManager.saveSetting('lastOpenedFile', lastFile);
    }

    // Migrate PWA install preferences
    const pwaInstallDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (pwaInstallDismissed) {
      await storageManager.saveSetting('pwaInstallDismissed', pwaInstallDismissed === 'true');
    }

    console.log('StorageMigration: Settings migrated successfully');
  }

  async migrateOfflineQueue() {
    const offlineChanges = localStorage.getItem('excalidraw-offline-changes');
    
    if (offlineChanges) {
      try {
        const changes = JSON.parse(offlineChanges);
        console.log(`StorageMigration: Migrating ${changes.length} offline operations...`);
        
        for (const change of changes) {
          await storageManager.addToOfflineQueue(change);
        }
        
        console.log('StorageMigration: Offline queue migrated successfully');
        
      } catch (error) {
        console.error('StorageMigration: Error migrating offline queue', error);
      }
    }
  }

  async cleanupOldData() {
    // Only cleanup after successful migration
    const migrated = await storageManager.getSetting(this.migrationKey, false);
    
    if (migrated) {
      console.log('StorageMigration: Cleaning up old localStorage data...');
      
      // Remove old data from localStorage
      localStorage.removeItem('excalidraw-files');
      localStorage.removeItem('excalidraw-last-file');
      localStorage.removeItem('excalidraw-offline-changes');
      
      console.log('StorageMigration: Cleanup completed');
    }
  }

  async getStorageStats() {
    // Get storage usage statistics
    const usage = await storageManager.getStorageUsage();
    
    const stats = {
      enhanced: usage,
      legacy: this.getLegacyStorageSize()
    };
    
    console.log('Storage Statistics:', stats);
    return stats;
  }

  getLegacyStorageSize() {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('excalidraw')) {
        totalSize += localStorage.getItem(key).length;
        itemCount++;
      }
    }
    
    return {
      itemCount,
      sizeBytes: totalSize,
      sizeMB: (totalSize / 1024 / 1024).toFixed(2)
    };
  }

  // Rollback function (for emergency use)
  async rollbackToLocalStorage() {
    console.log('StorageMigration: Rolling back to localStorage...');
    
    try {
      // Export all data from enhanced storage
      const exportData = await storageManager.exportData();
      
      // Convert back to localStorage format
      if (exportData.data.appData) {
        const files = [];
        
        for (const [key, value] of Object.entries(exportData.data.appData)) {
          if (key.startsWith('file_')) {
            files.push(value.data);
          }
        }
        
        localStorage.setItem('excalidraw-files', JSON.stringify(files));
      }
      
      // Reset migration flag
      await storageManager.saveSetting(this.migrationKey, false);
      
      console.log('StorageMigration: Rollback completed');
      
    } catch (error) {
      console.error('StorageMigration: Rollback failed', error);
    }
  }
}

// Create global migration instance
const storageMigration = new StorageMigration();

// Auto-run migration when module loads
storageMigration.checkAndMigrate();

export default storageMigration;

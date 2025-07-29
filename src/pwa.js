// PWA Service Worker Registration and Utilities

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.registration = null;
    this.init();
  }

  async init() {
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup install prompt handling
    this.setupInstallPrompt();
    
    // Setup online/offline detection
    this.setupNetworkDetection();
    
    // Setup update checking
    this.setupUpdateChecking();
    
    // Check if already installed
    this.checkInstallStatus();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('PWA: Service Worker registered successfully', this.registration);
        
        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          console.log('PWA: New service worker found');
          this.handleServiceWorkerUpdate();
        });
        
      } catch (error) {
        console.error('PWA: Service Worker registration failed', error);
      }
    } else {
      console.warn('PWA: Service Workers not supported');
    }
  }

  setupInstallPrompt() {
    // Listen for the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Show install button immediately when available
      setTimeout(() => {
        this.showInstallButton();
      }, 2000); // Show after 2 seconds
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast('App installed successfully! You can now use it offline.', 'success');
    });

    // Check periodically if install is available (for browsers that don't fire beforeinstallprompt immediately)
    setTimeout(() => {
      if (!this.isInstalled && !this.deferredPrompt && !sessionStorage.getItem('pwa-install-dismissed')) {
        // Show manual install instructions
        this.showManualInstallButton();
      }
    }, 10000); // After 10 seconds

    // Re-show minimized install prompt after some time
    setInterval(() => {
      const installContainer = document.getElementById('pwa-install-container');
      if (installContainer && installContainer.dataset.minimized === 'true') {
        // Check if it's been minimized for more than 2 minutes
        const minimizedTime = installContainer.dataset.minimizedTime;
        if (minimizedTime && Date.now() - parseInt(minimizedTime) > 120000) {
          this.showToast('💡 You can still install this app for better experience!', 'info');
        }
      }
    }, 60000); // Check every minute
  }

  setupNetworkDetection() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('PWA: Back online');
      this.isOnline = true;
      this.showToast('Back online! Your changes will be synced.', 'success');
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      console.log('PWA: Gone offline');
      this.isOnline = false;
      this.showToast('You are offline. Your work will be saved locally.', 'warning');
    });
  }

  setupUpdateChecking() {
    // Check for updates periodically
    setInterval(() => {
      if (this.registration) {
        this.registration.update();
      }
    }, 60000); // Check every minute
  }

  checkInstallStatus() {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://')) {
      this.isInstalled = true;
      console.log('PWA: Running as installed app');
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      this.showToast('Install not available. Try adding to home screen manually.', 'warning');
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user's response
      const result = await this.deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        this.showToast('Installing app...', 'info');
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      // Clear the prompt
      this.deferredPrompt = null;
      this.hideInstallButton();
      
    return result.outcome === 'accepted';
  } catch (error) {
    console.error('PWA: Error showing install prompt', error);
    return false;
  }
}

showManualInstallButton() {
  // Show manual install button for browsers that don't support beforeinstallprompt
  let installContainer = document.getElementById('pwa-install-container');
  
  if (!installContainer) {
    installContainer = document.createElement('div');
    installContainer.id = 'pwa-install-container';
    installContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    
    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'btn secondary pwa-install-btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.style.cssText = `
      background: linear-gradient(135deg, #0066cc, #0078ff);
      border: 1px solid #0066cc;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,102,204,0.3);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: none;
      outline: none;
      position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.id = 'pwa-install-close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Hide install prompt';
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      line-height: 1;
      padding: 0;
      margin: 0;
      outline: none;
    `;
    
    // Add event listeners
    installBtn.addEventListener('click', () => {
      this.showManualInstallInstructions();
    });
    
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideInstallButton();
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    });
    
    installContainer.appendChild(installBtn);
    installContainer.appendChild(closeBtn);
    document.body.appendChild(installContainer);
  }
  
  // Show the button
  installContainer.style.display = 'flex';
  setTimeout(() => {
    installContainer.style.opacity = '1';
    installContainer.style.transform = 'translateY(0)';
  }, 100);
}

showManualInstallInstructions() {
  // Create instruction modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: #2d2d2d;
    color: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    margin: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  `;
  
  content.innerHTML = `
    <h3 style="margin-top: 0; color: #0078ff;">📱 Install Excalidraw</h3>
    <p>To install this app:</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li><strong>Chrome/Edge:</strong> Click the 📱 icon in the address bar</li>
      <li><strong>Firefox:</strong> Look for "Install" option in the menu</li>
      <li><strong>Safari:</strong> Tap the Share button → "Add to Home Screen"</li>
      <li><strong>Mobile:</strong> Use browser menu → "Add to Home Screen"</li>
    </ul>
    <p style="font-size: 14px; color: #ccc;">Installing allows offline access and better performance!</p>
    <button id="close-modal" style="
      background: #0078ff;
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 16px;
    ">Got it!</button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close modal
  const closeBtn = content.querySelector('#close-modal');
  const closeModal = () => {
    document.body.removeChild(modal);
    this.hideInstallButton();
  };
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}  handleServiceWorkerUpdate() {
    if (this.registration && this.registration.waiting) {
      // New service worker available
      this.showUpdatePrompt();
    }
  }

  showInstallButton() {
    // Create or show install button container
    let installContainer = document.getElementById('pwa-install-container');
    
    if (!installContainer) {
      // Create container for install button with close functionality
      installContainer = document.createElement('div');
      installContainer.id = 'pwa-install-container';
      installContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      `;
      
      // Create main install button
      const installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.className = 'btn secondary pwa-install-btn';
      installBtn.innerHTML = '📱 Install App';
      installBtn.style.cssText = `
        background: linear-gradient(135deg, #0066cc, #0078ff);
        border: 1px solid #0066cc;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,102,204,0.3);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: none;
        outline: none;
        position: relative;
      `;
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.id = 'pwa-install-close';
      closeBtn.innerHTML = '×';
      closeBtn.title = 'Hide install prompt';
      closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        line-height: 1;
        padding: 0;
        margin: 0;
        outline: none;
      `;
      
      // Create minimize button
      const minimizeBtn = document.createElement('button');
      minimizeBtn.id = 'pwa-install-minimize';
      minimizeBtn.innerHTML = '−';
      minimizeBtn.title = 'Minimize install prompt';
      minimizeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        line-height: 1;
        padding: 0;
        margin: 0;
        outline: none;
      `;
      
      // Add hover effects for main button
      installBtn.addEventListener('mouseenter', () => {
        installBtn.style.transform = 'translateY(-2px)';
        installBtn.style.boxShadow = '0 6px 20px rgba(0,102,204,0.4)';
      });
      
      installBtn.addEventListener('mouseleave', () => {
        installBtn.style.transform = 'translateY(0)';
        installBtn.style.boxShadow = '0 4px 12px rgba(0,102,204,0.3)';
      });
      
      // Add hover effects for close button
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        closeBtn.style.transform = 'scale(1.1)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1)';
      });
      
      // Add hover effects for minimize button
      minimizeBtn.addEventListener('mouseenter', () => {
        minimizeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        minimizeBtn.style.transform = 'scale(1.1)';
      });
      
      minimizeBtn.addEventListener('mouseleave', () => {
        minimizeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        minimizeBtn.style.transform = 'scale(1)';
      });
      
      // Add click handlers
      installBtn.addEventListener('click', () => {
        this.promptInstall();
      });
      
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideInstallButton();
        // Store preference to not show again in this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
        this.showToast('Install prompt dismissed for this session', 'info');
      });
      
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeInstallButton();
      });
      
      // Assemble the container
      installContainer.appendChild(installBtn);
      installContainer.appendChild(minimizeBtn);
      installContainer.appendChild(closeBtn);
      
      document.body.appendChild(installContainer);
    }
    
    // Check if user has dismissed in this session
    if (sessionStorage.getItem('pwa-install-dismissed') === 'true') {
      return;
    }
    
    // Show with animation
    installContainer.style.display = 'flex';
    setTimeout(() => {
      installContainer.style.opacity = '1';
      installContainer.style.transform = 'translateY(0)';
    }, 100);
  }

  hideInstallButton() {
    const installContainer = document.getElementById('pwa-install-container');
    if (installContainer) {
      // Hide with animation
      installContainer.style.opacity = '0';
      installContainer.style.transform = 'translateY(20px)';
      setTimeout(() => {
        installContainer.style.display = 'none';
      }, 300);
    }
  }

  minimizeInstallButton() {
    const installContainer = document.getElementById('pwa-install-container');
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('pwa-install-close');
    const minimizeBtn = document.getElementById('pwa-install-minimize');
    
    if (!installContainer || !installBtn) return;
    
    const isMinimized = installContainer.dataset.minimized === 'true';
    
    if (!isMinimized) {
      // Minimize: hide main button and close button, show only minimize as expand
      installBtn.style.display = 'none';
      closeBtn.style.display = 'none';
      minimizeBtn.innerHTML = '📱';
      minimizeBtn.title = 'Show install prompt';
      minimizeBtn.style.width = '40px';
      minimizeBtn.style.height = '40px';
      minimizeBtn.style.fontSize = '18px';
      installContainer.dataset.minimized = 'true';
      installContainer.dataset.minimizedTime = Date.now().toString();
      this.showToast('Install prompt minimized. Click 📱 to restore.', 'info');
    } else {
      // Restore: show all buttons
      installBtn.style.display = 'block';
      closeBtn.style.display = 'flex';
      minimizeBtn.innerHTML = '−';
      minimizeBtn.title = 'Minimize install prompt';
      minimizeBtn.style.width = '24px';
      minimizeBtn.style.height = '24px';
      minimizeBtn.style.fontSize = '16px';
      installContainer.dataset.minimized = 'false';
      delete installContainer.dataset.minimizedTime;
    }
  }

  showUpdatePrompt() {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn secondary pwa-update-btn';
    updateBtn.innerHTML = '🔄 Update Available';
    updateBtn.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      border: 1px solid #ff6b6b;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255,107,107,0.3);
      animation: pulse 2s infinite;
    `;
    
    updateBtn.addEventListener('click', () => {
      this.applyUpdate();
      document.body.removeChild(updateBtn);
    });
    
    document.body.appendChild(updateBtn);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(updateBtn)) {
        document.body.removeChild(updateBtn);
      }
    }, 10000);
  }

  applyUpdate() {
    if (this.registration && this.registration.waiting) {
      // Tell the waiting service worker to become active
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to use the new service worker
      window.location.reload();
    }
  }

  async syncPendingChanges() {
    if (!this.isOnline) return;
    
    try {
      // Trigger background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-save');
        console.log('PWA: Background sync registered');
      }
    } catch (error) {
      console.error('PWA: Error registering background sync', error);
    }
  }

  showToast(message, type = 'info') {
    // Use existing toast system if available, otherwise create simple notification
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      console.log(`PWA ${type.toUpperCase()}: ${message}`);
    }
  }

  // Utility methods for other parts of the app
  isOnlineStatus() {
    return this.isOnline;
  }

  isInstalledStatus() {
    return this.isInstalled;
  }

  // Save data to cache for offline use
  async saveToCache(key, data) {
    try {
      if ('caches' in window) {
        const cache = await caches.open('excalidraw-data-v1');
        const response = new Response(JSON.stringify(data));
        await cache.put(key, response);
        console.log('PWA: Data cached successfully', key);
      }
    } catch (error) {
      console.error('PWA: Error caching data', error);
    }
  }

  // Load data from cache
  async loadFromCache(key) {
    try {
      if ('caches' in window) {
        const cache = await caches.open('excalidraw-data-v1');
        const response = await cache.match(key);
        if (response) {
          const data = await response.json();
          console.log('PWA: Data loaded from cache', key);
          return data;
        }
      }
    } catch (error) {
      console.error('PWA: Error loading data from cache', error);
    }
    return null;
  }
}

// Create global PWA manager instance
window.pwaManager = new PWAManager();

// Export for use in other modules
export default PWAManager;

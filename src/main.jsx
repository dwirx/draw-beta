import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './pwa.js'
import './storageManager.js'
import './storageMigration.js'

// Initialize PWA Manager after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Ensure PWA manager is properly initialized
  if (window.pwaManager) {
    console.log('PWA Manager initialized successfully');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

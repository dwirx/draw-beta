import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './pwa.js'
import './storageManager.js'
import './storageMigration.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

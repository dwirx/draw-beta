import React, { useState, useEffect } from 'react';
import storageManager from '../storageManager';

const StorageInfo = () => {
  const [storageStats, setStorageStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadStorageStats = async () => {
      try {
        const usage = await storageManager.getStorageUsage();
        
        // Get quota info if available
        let quotaInfo = null;
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          quotaInfo = {
            used: estimate.usage || 0,
            quota: estimate.quota || 0,
            usedMB: ((estimate.usage || 0) / 1024 / 1024).toFixed(2),
            quotaMB: ((estimate.quota || 0) / 1024 / 1024).toFixed(2),
            percentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota * 100).toFixed(1) : 0
          };
        }
        
        setStorageStats({
          usage,
          quota: quotaInfo
        });
      } catch (error) {
        console.error('Error loading storage stats:', error);
      }
    };

    loadStorageStats();
  }, []);

  const getTotalFiles = () => {
    if (!storageStats) return 0;
    return storageStats.usage.appData?.itemCount || 0;
  };

  const getTotalSize = () => {
    if (!storageStats) return '0';
    
    let totalBytes = 0;
    Object.values(storageStats.usage).forEach(storage => {
      totalBytes += storage.sizeBytes || 0;
    });
    
    return (totalBytes / 1024 / 1024).toFixed(2);
  };

  const getStorageType = () => {
    // Detect storage type based on available APIs
    if (window.indexedDB) return 'IndexedDB';
    if (window.openDatabase) return 'WebSQL';
    return 'localStorage';
  };

  if (!storageStats) {
    return (
      <div className="storage-info loading">
        <span>Loading storage info...</span>
      </div>
    );
  }

  return (
    <div className="storage-info">
      <button 
        className="storage-info-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Storage Information"
      >
        💾 Storage
      </button>
      
      {isVisible && (
        <div className="storage-info-panel">
          <div className="storage-header">
            <h4>📊 Storage Information</h4>
            <button 
              className="close-btn"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          
          <div className="storage-stats">
            <div className="stat-item">
              <span className="stat-label">Storage Type:</span>
              <span className="stat-value">{getStorageType()}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Total Files:</span>
              <span className="stat-value">{getTotalFiles()}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Used Space:</span>
              <span className="stat-value">{getTotalSize()} MB</span>
            </div>
            
            {storageStats.quota && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Available Space:</span>
                  <span className="stat-value">{storageStats.quota.quotaMB} MB</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Usage:</span>
                  <span className="stat-value">{storageStats.quota.percentage}%</span>
                </div>
                
                <div className="storage-bar">
                  <div 
                    className="storage-bar-fill"
                    style={{ width: `${storageStats.quota.percentage}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
          
          <div className="storage-breakdown">
            <h5>Storage Breakdown:</h5>
            {Object.entries(storageStats.usage).map(([key, value]) => (
              <div key={key} className="breakdown-item">
                <span className="breakdown-label">{key}:</span>
                <span className="breakdown-value">
                  {value.itemCount} items ({value.sizeMB} MB)
                </span>
              </div>
            ))}
          </div>
          
          <div className="storage-actions">
            <button 
              className="btn-secondary small"
              onClick={async () => {
                try {
                  const exportData = await storageManager.exportData();
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                    type: 'application/json'
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `excalidraw-backup-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Export failed:', error);
                }
              }}
            >
              📤 Export Data
            </button>
            
            <button 
              className="btn-danger small"
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear all storage? This cannot be undone.')) {
                  try {
                    await storageManager.clearAllData();
                    setIsVisible(false);
                    window.location.reload();
                  } catch (error) {
                    console.error('Clear failed:', error);
                  }
                }
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .storage-info {
          position: relative;
          z-index: 1000;
        }
        
        .storage-info-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .storage-info-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        
        .storage-info-panel {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 16px;
          min-width: 280px;
          backdrop-filter: blur(10px);
          color: white;
          font-size: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-top: 4px;
        }
        
        .storage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .storage-header h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        
        .stat-label {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .stat-value {
          font-weight: 600;
          color: #4caf50;
        }
        
        .storage-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin: 8px 0;
          overflow: hidden;
        }
        
        .storage-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #ffeb3b);
          transition: width 0.3s ease;
        }
        
        .storage-breakdown {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .storage-breakdown h5 {
          margin: 0 0 8px 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 10px;
        }
        
        .breakdown-label {
          color: rgba(255, 255, 255, 0.6);
          text-transform: capitalize;
        }
        
        .breakdown-value {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .storage-actions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 8px;
        }
        
        .btn-secondary, .btn-danger {
          padding: 4px 8px;
          border-radius: 4px;
          border: none;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary {
          background: rgba(33, 150, 243, 0.8);
          color: white;
        }
        
        .btn-secondary:hover {
          background: rgba(33, 150, 243, 1);
        }
        
        .btn-danger {
          background: rgba(244, 67, 54, 0.8);
          color: white;
        }
        
        .btn-danger:hover {
          background: rgba(244, 67, 54, 1);
        }
        
        .storage-info.loading {
          color: rgba(255, 255, 255, 0.6);
          font-size: 10px;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
};

export default StorageInfo;

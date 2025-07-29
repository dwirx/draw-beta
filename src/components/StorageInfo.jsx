import React, { useState, useEffect } from 'react';
import storageManager from '../storageManager';

const StorageInfo = () => {
  const [storageStats, setStorageStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadStorageStats = async () => {
      try {
        const usage = await storageManager.getStorageUsage();
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
        setStorageStats({ usage, quota: quotaInfo });
      } catch (error) {
        console.error('Error loading storage stats:', error);
      }
    };
    loadStorageStats();
  }, []);

  const getTotalFiles = () => {
    if (!storageStats) return 0;
    return storageStats.usage?.appData?.itemCount || 0;
  };

  const getTotalSize = () => {
    if (!storageStats) return '0';
    let totalBytes = 0;
    Object.values(storageStats.usage || {}).forEach(storage => {
      totalBytes += storage.sizeBytes || 0;
    });
    return (totalBytes / 1024 / 1024).toFixed(2);
  };

  const getStorageType = () => {
    if (window.indexedDB) return 'IndexedDB';
    if (window.openDatabase) return 'WebSQL';
    return 'localStorage';
  };

  if (!storageStats) {
    return (
      <div className="storage-info loading">
        <span style={{ color: '#999', fontSize: '12px' }}>Loading storage info...</span>
      </div>
    );
  }

  return (
    <div className="storage-info" style={{ position: 'relative', zIndex: 1000 }}>
      <button 
        className="storage-info-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Storage Information"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        💾 Storage
      </button>
      {isVisible && (
        <div className="storage-info-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#2d2d2d', border: '1px solid #555', borderRadius: 8, padding: 16, minWidth: 280, maxWidth: 350, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 1001, color: 'white' }}>
          <div className="storage-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #444' }}>
            <h4 style={{ margin: 0, fontSize: 14, color: '#0078ff' }}>📊 Storage Information</h4>
            <button className="close-btn" onClick={() => setIsVisible(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: 18, cursor: 'pointer', padding: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#999'}>×</button>
          </div>
          <div className="storage-stats" style={{ marginBottom: 16 }}>
            <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
              <span style={{ color: '#ccc' }}>Storage Type:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{getStorageType()}</span>
            </div>
            <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
              <span style={{ color: '#ccc' }}>Total Files:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{getTotalFiles()}</span>
            </div>
            <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
              <span style={{ color: '#ccc' }}>Used Space:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{getTotalSize()} MB</span>
            </div>
            {storageStats.quota && (
              <>
                <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: '#ccc' }}>Available Space:</span>
                  <span style={{ color: 'white', fontWeight: 500 }}>{storageStats.quota.quotaMB} MB</span>
                </div>
                <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: '#ccc' }}>Usage:</span>
                  <span style={{ color: 'white', fontWeight: 500 }}>{storageStats.quota.percentage}%</span>
                </div>
                <div className="storage-bar" style={{ width: '100%', height: 6, background: '#444', borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                  <div className="storage-bar-fill" style={{ height: '100%', background: 'linear-gradient(90deg, #0078ff, #00a6ff)', transition: 'width 0.3s ease', width: `${storageStats.quota.percentage}%` }}></div>
                </div>
              </>
            )}
          </div>
          <div className="storage-breakdown" style={{ marginBottom: 16 }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#ccc' }}>Storage Breakdown:</h5>
            {Object.entries(storageStats.usage || {}).map(([key, value]) => (
              <div key={key} className="breakdown-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', fontSize: 11 }}>
                <span style={{ color: '#aaa', textTransform: 'capitalize' }}>{key}:</span>
                <span style={{ color: 'white' }}>{value.itemCount} items ({value.sizeMB} MB)</span>
              </div>
            ))}
          </div>
          <div className="storage-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-secondary small" onClick={async () => {
              try {
                const exportData = await storageManager.exportData();
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `excalidraw-backup-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Export failed:', error);
              }
            }} style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', padding: '6px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}>📤 Export Data</button>
            <button className="btn-danger small" onClick={async () => {
              if (window.confirm('Are you sure you want to clear all storage? This cannot be undone.')) {
                try {
                  await storageManager.clearAllData();
                  setIsVisible(false);
                  window.location.reload();
                } catch (error) {
                  console.error('Clear failed:', error);
                }
              }
            }} style={{ background: 'rgba(220, 53, 69, 0.2)', border: '1px solid rgba(220, 53, 69, 0.4)', color: '#ff6b7d', padding: '6px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.target.style.background = 'rgba(220, 53, 69, 0.3)'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.background = 'rgba(220, 53, 69, 0.2)'; e.target.style.color = '#ff6b7d'; }}>🗑️ Clear All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageInfo;

import React, { useState, useEffect } from 'react';
import storageManager from '../storageManager';

const StorageInfo = () => {
  const [storageStats, setStorageStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        // Set default values even if error
        setStorageStats({ 
          usage: { appData: { itemCount: 0, sizeMB: 0, sizeBytes: 0 } }, 
          quota: null 
        });
      }
    };
    loadStorageStats();
  }, []);

  const getTotalFiles = () => {
    if (!storageStats?.usage) return 0;
    return storageStats.usage.appData?.itemCount || 0;
  };

  const getTotalSize = () => {
    if (!storageStats?.usage) return '0.00';
    let totalBytes = 0;
    Object.values(storageStats.usage).forEach(storage => {
      if (storage && typeof storage === 'object') {
        totalBytes += storage.sizeBytes || 0;
      }
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
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        borderRadius: '4px', 
        padding: '6px 10px',
        fontSize: '11px',
        color: '#999'
      }}>
        📊 Loading...
      </div>
    );
  }

  // Responsive panel positioning
  const panelStyle = {
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? '60px' : '100%',
    right: isMobile ? '10px' : '0',
    left: isMobile ? '10px' : 'auto',
    marginTop: isMobile ? '0' : '8px',
    background: '#2d2d2d',
    border: '1px solid #555',
    borderRadius: '8px',
    padding: '16px',
    minWidth: isMobile ? 'auto' : '280px',
    maxWidth: isMobile ? 'none' : '350px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
    zIndex: isMobile ? 9999 : 1001,
    color: 'white',
    maxHeight: isMobile ? '70vh' : 'auto',
    overflowY: 'auto'
  };

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        title="Storage Information"
        style={{
          background: isVisible ? 'rgba(0, 120, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '500'
        }}
        onMouseEnter={e => {
          if (!isVisible) {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }
        }}
        onMouseLeave={e => {
          if (!isVisible) {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }
        }}
      >
        📊 Storage ({getTotalFiles()})
      </button>
      
      {isVisible && (
        <>
          {/* Mobile overlay */}
          {isMobile && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 9998
              }}
              onClick={() => setIsVisible(false)}
            />
          )}
          
          <div style={panelStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #444'
            }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#0078ff' }}>
                📊 Storage Information
              </h4>
              <button 
                onClick={() => setIsVisible(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={e => {
                  e.target.style.color = 'white';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#999';
                  e.target.style.background = 'none';
                }}
              >
                ×
              </button>
            </div>
            
            {/* Storage Stats */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                fontSize: '12px'
              }}>
                <span style={{ color: '#ccc' }}>Storage Type:</span>
                <span style={{ color: 'white', fontWeight: '500' }}>{getStorageType()}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                fontSize: '12px'
              }}>
                <span style={{ color: '#ccc' }}>Total Files:</span>
                <span style={{ color: 'white', fontWeight: '500' }}>{getTotalFiles()}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                fontSize: '12px'
              }}>
                <span style={{ color: '#ccc' }}>Used Space:</span>
                <span style={{ color: 'white', fontWeight: '500' }}>{getTotalSize()} MB</span>
              </div>
              
              {storageStats.quota && (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#ccc' }}>Available Space:</span>
                    <span style={{ color: 'white', fontWeight: '500' }}>{storageStats.quota.quotaMB} MB</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#ccc' }}>Usage:</span>
                    <span style={{ color: 'white', fontWeight: '500' }}>{storageStats.quota.percentage}%</span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#444',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #0078ff, #00a6ff)',
                      transition: 'width 0.3s ease',
                      width: `${storageStats.quota.percentage}%`
                    }} />
                  </div>
                </>
              )}
            </div>
            
            {/* Storage Breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>
                Storage Breakdown:
              </h5>
              {Object.entries(storageStats.usage || {}).map(([key, value]) => (
                <div 
                  key={key} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 0',
                    fontSize: '11px'
                  }}
                >
                  <span style={{ color: '#aaa', textTransform: 'capitalize' }}>{key}:</span>
                  <span style={{ color: 'white' }}>
                    {value?.itemCount || 0} items ({(value?.sizeBytes / 1024 / 1024).toFixed(2) || '0.00'} MB)
                  </span>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={async () => {
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
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                📤 Export Data
              </button>
              
              <button 
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
                style={{
                  background: 'rgba(220, 53, 69, 0.2)',
                  border: '1px solid rgba(220, 53, 69, 0.4)',
                  color: '#ff6b7d',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                  e.target.style.color = '#ff6b7d';
                }}
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageInfo;

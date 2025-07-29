import React, { useRef, useState } from 'react';

const Toolbar = ({ currentFile, saveStatus, onSave, onExport, onImport }) => {
  const fileInputRef = useRef(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <span className="saving-spinner">⟳</span> Saving...
          </>
        );
      case 'unsaved':
        return '💾 Save *';
      default:
        return '💾 Save';
    }
  };

  const getSaveButtonStyle = () => {
    const baseStyle = "btn primary";
    switch (saveStatus) {
      case 'saving':
        return baseStyle + " saving";
      case 'unsaved':
        return baseStyle + " unsaved";
      default:
        return baseStyle;
    }
  };

  return (
    <div className="toolbar">
      <div className="current-file">
        {currentFile ? (
          <>
            {currentFile.name}
            {saveStatus === 'unsaved' && <span style={{ color: '#ff6b6b', marginLeft: '8px' }}>●</span>}
            {saveStatus === 'saving' && <span style={{ color: '#4CAF50', marginLeft: '8px' }}>...</span>}
          </>
        ) : (
          'Tidak ada file terbuka'
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn"
          onClick={() => {
            const fileName = prompt('Nama file baru:');
            if (fileName && fileName.trim()) {
              // We need to pass this up to parent
              window.dispatchEvent(new CustomEvent('createNewFile', { 
                detail: { name: fileName.trim() } 
              }));
            }
          }}
          title="New File (Ctrl+N)"
        >
          ➕ New
        </button>

        <button
          className={getSaveButtonStyle()}
          onClick={onSave}
          disabled={!currentFile || saveStatus === 'saving'}
          title="Save (Ctrl+S)"
        >
          {getSaveButtonText()}
        </button>

        <button
          className="btn"
          onClick={handleImportClick}
          title="Import Excalidraw file"
        >
          📂 Import
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="btn"
            disabled={!currentFile}
            title="Export options"
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            onBlur={() => setTimeout(() => setShowExportDropdown(false), 200)}
          >
            📤 Export ▼
          </button>
          
          {currentFile && showExportDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#2d2d2d',
                border: '1px solid #404040',
                borderRadius: '4px',
                marginTop: '4px',
                minWidth: '150px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <button
                onClick={() => {
                  onExport('png');
                  setShowExportDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#404040';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                🖼️ Export as PNG
              </button>
              <button
                onClick={() => {
                  onExport('svg');
                  setShowExportDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#404040';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                📐 Export as SVG
              </button>
              <button
                onClick={() => {
                  onExport('excalidraw');
                  setShowExportDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#404040';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                📋 Export as .excalidraw
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".excalidraw"
          style={{ display: 'none' }}
          onChange={onImport}
        />
      </div>
    </div>
  );
};

export default Toolbar;

import React, { useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

const SimpleApp = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const handleChange = useCallback((elements, appState) => {
    // Just log changes, don't cause re-renders
    console.log('Elements changed:', elements?.length || 0);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        theme="light"
      />
    </div>
  );
};

export default SimpleApp;

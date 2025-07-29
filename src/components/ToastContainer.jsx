import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196F3';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getBackgroundColor(),
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '200px',
        maxWidth: '400px'
      }}
    >
      <span>{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '16px',
          marginLeft: 'auto',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type, duration } = event.detail;
      const id = Date.now();
      
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export const showToast = (message, type = 'info', duration = 3000) => {
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { message, type, duration }
  }));
};

export default ToastContainer;

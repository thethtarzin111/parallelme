import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' 
    ? 'bg-green-500/70' 
    : type === 'error' 
    ? 'bg-red-500/70' 
    : 'bg-blue-500';

  const icon = type === 'success' 
    ? '✓' 
    : type === 'error' 
    ? '✕' 
    : 'ℹ';

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span className="text-2xl">{icon}</span>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
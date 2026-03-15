import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="toast fade-up" onClick={onDismiss}>
      <span>{message}</span>
    </div>
  );
}

import { useEffect } from 'react';
import styles from './Toast.module.scss';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 4000 
}: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
        ×
      </button>
    </div>
  );
};
'use client';

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
  type = 'success',
  isVisible,
  onClose,
  duration = 3000
}: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.show : ''}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button
          onClick={onClose}
          className={styles.close}
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
};

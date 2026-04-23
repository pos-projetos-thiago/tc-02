'use client';

import { useState, useEffect } from 'react';
import styles from './StorageWarning.module.scss';

export const StorageWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        setShowWarning(false);
      } catch {
        setShowWarning(true);
      }
    };

    checkLocalStorage();
  }, []);

  if (!showWarning) return null;

  return (
    <div className={styles.warning}>
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <div className={styles.text}>
          <strong>Modo Privado/Incógnito Detectado</strong>
          <p>
            Os dados do saldo podem não ser salvos permanentemente. 
            Para melhor experiência, use o navegador em modo normal.
          </p>
        </div>
        <button 
          className={styles.closeButton} 
          onClick={() => setShowWarning(false)}
          aria-label="Fechar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
'use client';

import { useEffect, useState } from 'react';
import styles from './StorageWarning.module.scss';

export const StorageWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Test localStorage availability
    let available = false;
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      available = true;
    } catch {
      available = false;
    }
    setShowWarning(!available);
  }, []);

  if (!showWarning) return null;

  return (
    <div className={styles.warning}>
      <div className={styles.container}>
        <div className={styles.icon}>⚠️</div>
        <div className={styles.content}>
          <h3>Modo incógnito detectado</h3>
          <p>
            Para uma melhor experiência, recomendamos usar o navegador no modo normal.
            Alguns recursos podem não funcionar corretamente no modo incógnito.
          </p>
        </div>
        <button 
          className={styles.close}
          onClick={() => setShowWarning(false)}
          aria-label="Fechar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
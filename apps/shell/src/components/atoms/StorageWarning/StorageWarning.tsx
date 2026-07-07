'use client';

import { useState } from 'react';
import styles from './StorageWarning.module.scss';

function checkLocalStorageAvailable(): boolean {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export const StorageWarning = () => {
  const [showWarning, setShowWarning] = useState(() => !checkLocalStorageAvailable());

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
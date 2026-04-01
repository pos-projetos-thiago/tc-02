'use client';

import styles from './Loading.module.scss';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Loading = ({ 
  variant = 'spinner', 
  size = 'medium',
  text 
}: LoadingProps) => {
  
  const renderSpinner = () => (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles['spinner-circle']}></div>
    </div>
  );

  const renderDots = () => (
    <div className={`${styles.dots} ${styles[size]}`}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${styles.pulse} ${styles[size]}`}>
      <div className={styles['pulse-ring']}></div>
      <div className={styles['pulse-ring']}></div>
      <div className={styles['pulse-ring']}></div>
    </div>
  );

  const renderWave = () => (
    <div className={`${styles.wave} ${styles[size]}`}>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      case 'wave': return renderWave();
      default: return renderSpinner();
    }
  };

  return (
    <div className={styles.container}>
      {renderLoader()}
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
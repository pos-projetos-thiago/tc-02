'use client';

import Image from 'next/image';
import styles from './Loading.module.scss';

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Loading = ({ 
  size = 'medium',
  text 
}: LoadingProps) => {
  const sizeMap = {
    small: 24,
    medium: 40, 
    large: 60
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.gifLoader} ${styles[size]}`}>
        <Image 
          src="/assets/spinner.gif" 
          alt="Carregando..." 
          width={sizeMap[size]}
          height={sizeMap[size]}
          className={styles.gif}
          unoptimized
        />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
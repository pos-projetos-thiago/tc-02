'use client';

import { Loading, type LoadingProps } from './Loading';
import styles from './Loading.module.scss';

export interface LoadingScreenProps extends LoadingProps {
  isVisible: boolean;
}

export const LoadingScreen = ({ 
  isVisible, 
  variant = 'pulse',
  size = 'large',
  text = 'Carregando...'
}: LoadingScreenProps) => {
  
  if (!isVisible) return null;

  return (
    <div className={styles['full-screen']}>
      <Loading 
        variant={variant} 
        size={size} 
        text={text}
      />
    </div>
  );
};
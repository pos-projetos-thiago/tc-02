import styles from './LoadingScreen.module.scss';

interface LoadingScreenProps {
  isVisible: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingScreen = ({ isVisible, size = 'medium', text = 'Carregando...' }: LoadingScreenProps) => {
  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.dot1}></div>
        <div className={styles.dot2}></div>
        <div className={styles.dot3}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
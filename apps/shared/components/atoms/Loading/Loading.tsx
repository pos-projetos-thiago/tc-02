import styles from './Loading.module.scss';

export interface LoadingProps {
  isVisible?: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Loading = ({ 
  isVisible = true, 
  size = 'medium', 
  text = 'Carregando...' 
}: LoadingProps) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.loading} ${styles[size]}`}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
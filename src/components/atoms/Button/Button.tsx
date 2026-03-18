import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'primaryMobile' | 'secondaryMobile';
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, variant = 'primary', onClick, className }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

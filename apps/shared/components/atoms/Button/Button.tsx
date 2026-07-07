import Link from 'next/link';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'primary-mobile' | 'secondary-mobile';
  size?: 'normal' | 'small';
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({ children, variant = 'primary', size = 'normal', onClick, className, href, type = 'button', disabled = false }: ButtonProps) => {
  const classNames = `${styles.button} ${styles[variant]} ${size === 'small' ? styles.small : ''} ${className || ''}`.trim();

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
import Link from 'next/link';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'primaryMobile' | 'secondaryMobile';
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ children, variant = 'primary', onClick, className, href, type = 'button' }: ButtonProps) => {
  const classNames = `${styles.button} ${styles[variant]} ${className || ''}`.trim();

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

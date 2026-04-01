'use client';

import { ButtonHTMLAttributes } from 'react';
import styles from './TransactionButton.module.scss';

export interface TransactionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const TransactionButton = ({
  children,
  className = '',
  ...props
}: TransactionButtonProps) => {
  return (
    <button 
      className={`${styles.button} ${className}`}
      data-component="transaction-button"
      {...props}
    >
      {children}
    </button>
  );
};
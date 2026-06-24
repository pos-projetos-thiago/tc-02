'use client';

import { ChangeEvent } from 'react';
import styles from './CurrencyInput.module.scss';

export interface CurrencyInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const CurrencyInput = ({
  value = '',
  placeholder = '0,00',
  onChange,
  className = ''
}: CurrencyInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');

    if (inputValue === '') {
      onChange?.('');
      return;
    }

    const numericValue = Number(inputValue) / 100;
    const formattedValue = numericValue.toFixed(2).replace('.', ',');

    onChange?.(formattedValue);
  };

  return (
    <div className={`${styles['input-wrapper']} ${className}`}>
      <span className={styles['currency-symbol']}>R$</span>
      <input
        type="text"
        inputMode="decimal"
        className={styles['input']}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        aria-label="Valor em reais"
      />
    </div>
  );
};

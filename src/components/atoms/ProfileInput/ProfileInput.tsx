'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import styles from './ProfileInput.module.scss';

export interface ProfileInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  className?: string;
  id?: string;
  name?: string;
}

export const ProfileInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  id,
  name
}: ProfileInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Gerar ID único se não fornecido
  const inputId = id || `profile-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const inputName = name || label.toLowerCase().replace(/\s+/g, '_');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`${styles['input-group']} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>{label}</label>
      <div className={styles['input-wrapper']}>
        <input
          id={inputId}
          name={inputName}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={styles.input}
          autoComplete={type === 'email' ? 'email' : type === 'password' ? 'new-password' : 'name'}
          aria-describedby={`${inputId}-hint`}
          aria-invalid={false}
        />
        {!isFocused && (
          <div className={styles['icon-wrapper']}>
            <Image
              src="/Services/edit.svg"
              alt="Editar"
              width={16}
              height={16}
              className={styles.icon}
            />
          </div>
        )}
      </div>
    </div>
  );
};
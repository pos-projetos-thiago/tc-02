'use client';

import styles from './ButtonGroup.module.scss';

export interface ButtonOption {
  value: string;
  label: string;
  color?: string;
}

export interface ButtonGroupProps {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ButtonGroup = ({ options, value, onChange, className }: ButtonGroupProps) => {
  return (
    <div className={`${styles['button-group']} ${className || ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.button} ${
            value === option.value ? styles.active : ''
          }`}
          onClick={() => onChange(option.value)}
          style={
            option.color && value === option.value
              ? { backgroundColor: option.color, borderColor: option.color }
              : {}
          }
          aria-pressed={value === option.value}
          aria-label={option.label}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
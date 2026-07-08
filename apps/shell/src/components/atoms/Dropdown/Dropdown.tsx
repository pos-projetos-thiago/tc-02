'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Dropdown = ({
  options,
  placeholder = 'Selecione uma opção',
  value,
  onChange,
  className = ''
}: DropdownProps) => {
  const [selectedValue, setSelectedValue] = useState('');
  const currentValue = value !== undefined ? value : selectedValue;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue: string) => {
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    setIsOpen(false);
    onChange?.(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(prev => !prev);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!currentValue) return placeholder;
    const option = options.find(opt => opt.value === currentValue);
    return option?.label || placeholder;
  };

  const isPlaceholder = !currentValue;

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`${styles.text} ${isPlaceholder ? styles.placeholder : ''}`}>
          {getDisplayText()}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          <button
            type="button"
            className={`${styles.option} ${currentValue === '' ? styles.selected : ''}`}
            onClick={() => handleSelect('')}
            role="option"
            aria-selected={currentValue === ''}
          >
            {placeholder}
          </button>

          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`${styles.option} ${currentValue === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={currentValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  onChange?: (value: string) => void;
  className?: string;
}

export const Dropdown = ({
  options,
  placeholder = 'Selecione uma opção',
  onChange,
  className = ''
}: DropdownProps) => {
  const [selectedValue, setSelectedValue] = useState('');
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

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
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
    if (!selectedValue) return placeholder;
    const option = options.find(opt => opt.value === selectedValue);
    return option?.label || placeholder;
  };

  const isPlaceholder = !selectedValue;

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
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
          <div
            className={`${styles.option} ${selectedValue === '' ? styles.selected : ''}`}
            onClick={() => handleSelect('')}
            role="option"
            aria-selected={selectedValue === ''}
          >
            {placeholder}
          </div>
          
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${selectedValue === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

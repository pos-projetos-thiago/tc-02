'use client';

import { useState } from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
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

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <FormControl className={`${styles.dropdown} ${className}`}>
      <Select
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value as string)}
        displayEmpty
        IconComponent={KeyboardArrowDown}
        className={styles.select}
        MenuProps={{
          PaperProps: {
            className: styles.menu
          }
        }}
      >
        <MenuItem value="" disabled className={styles.placeholder}>
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            className={styles.option}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

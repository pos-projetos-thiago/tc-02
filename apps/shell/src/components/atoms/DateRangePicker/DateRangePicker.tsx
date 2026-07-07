'use client';

import React from 'react';
import styles from './DateRangePicker.module.scss';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onQuickSelect: (days: number) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
  className = '',
}) => {
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onStartDateChange(value ? new Date(value) : null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEndDateChange(value ? new Date(value) : null);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onStartDateChange(start);
    onEndDateChange(end);
    onQuickSelect(days);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.quickFilters}>
        <button type="button" onClick={() => handleQuickSelect(7)} className={styles.quickButton}>
          Últimos 7 dias
        </button>
        <button type="button" onClick={() => handleQuickSelect(30)} className={styles.quickButton}>
          Últimos 30 dias
        </button>
        <button type="button" onClick={() => handleQuickSelect(90)} className={styles.quickButton}>
          Últimos 3 meses
        </button>
      </div>

      <div className={styles.dateInputs}>
        <div className={styles.inputGroup}>
          <label htmlFor="startDate" className={styles.label}>Data inicial</label>
          <input
            type="date"
            id="startDate"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            className={styles.input}
            max={formatDateForInput(endDate || new Date())}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="endDate" className={styles.label}>Data final</label>
          <input
            type="date"
            id="endDate"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            className={styles.input}
            min={formatDateForInput(startDate)}
            max={formatDateForInput(new Date())}
          />
        </div>
      </div>
    </div>
  );
};

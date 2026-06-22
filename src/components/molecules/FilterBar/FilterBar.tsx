'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { DateRangePicker } from '@/components/atoms/DateRangePicker';
import { useFilterContext } from '@/contexts/FilterContext';
import styles from './FilterBar.module.scss';

interface FilterBarProps {
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ className = '' }) => {
  const { filters, updateFilter, resetFilters } = useFilterContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const transactionTypes = [
    { value: 'deposit', label: 'Depósito' },
    { value: 'withdrawal', label: 'Saque' },
    { value: 'transfer', label: 'Transferência' },
    { value: 'investment', label: 'Investimentos' },
  ];

  const investmentTypes = [
    { value: 'fundos', label: 'Fundos' },
    { value: 'tesouro', label: 'Tesouro' },
    { value: 'previdencia', label: 'Previdência' },
    { value: 'bolsa', label: 'Bolsa' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.type, type]
      : filters.type.filter(t => t !== type);
    updateFilter('type', newTypes);
  };

  const handleInvestmentTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.investmentTypes, type]
      : filters.investmentTypes.filter(t => t !== type);
    updateFilter('investmentTypes', newTypes);
  };

  const handleAmountRangeChange = (field: 'min' | 'max', value: string) => {
    const numericValue = value === '' ? null : Number(value);
    updateFilter('amountRange', {
      ...filters.amountRange,
      [field]: numericValue,
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    updateFilter('dateRange', { start, end });
  };

  const hasActiveFilters = 
    filters.search.trim() ||
    filters.type.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.amountRange.min !== null ||
    filters.amountRange.max !== null ||
    filters.investmentTypes.length > 0;

  return (
    <div ref={containerRef} className={`${styles.container} ${className} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Buscar transações..."
            value={filters.search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Ocultar' : 'Filtros'}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="small"
              onClick={resetFilters}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedFilters}>
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Tipo de Transação</h4>
            <div className={styles.checkboxGrid}>
              {transactionTypes.map(type => (
                <label key={type.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type.value)}
                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {filters.type.includes('investment') && (
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Tipos de Investimento</h4>
              <div className={styles.checkboxGrid}>
                {investmentTypes.map(type => (
                  <label key={type.value} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.investmentTypes.includes(type.value)}
                      onChange={(e) => handleInvestmentTypeChange(type.value, e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Período</h4>
            <DateRangePicker
              startDate={filters.dateRange.start}
              endDate={filters.dateRange.end}
              onStartDateChange={(date) => handleDateRangeChange(date, filters.dateRange.end)}
              onEndDateChange={(date) => handleDateRangeChange(filters.dateRange.start, date)}
              onQuickSelect={(days) => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - days);
                handleDateRangeChange(start, end);
              }}
            />
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Faixa de Valor (R$)</h4>
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="minAmount" className={styles.label}>
                  Valor mínimo
                </label>
                <input
                  type="number"
                  id="minAmount"
                  placeholder="0,00"
                  value={filters.amountRange.min || ''}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="maxAmount" className={styles.label}>
                  Valor máximo
                </label>
                <input
                  type="number"
                  id="maxAmount"
                  placeholder="0,00"
                  value={filters.amountRange.max || ''}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
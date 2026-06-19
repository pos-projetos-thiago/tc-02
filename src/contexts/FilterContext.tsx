'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FilterContextValue, TransactionFilters, PaginationState, defaultFilters, defaultPagination } from '@/types/filters';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);

  const updateFilter = useCallback(<K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset para primeira página quando filtros mudarem
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  const updatePagination = useCallback((update: Partial<PaginationState>) => {
    setPagination(prev => ({
      ...prev,
      ...update
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination(defaultPagination);
  }, []);

  const value: FilterContextValue = {
    filters,
    pagination,
    updateFilter,
    updatePagination,
    resetFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextValue => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
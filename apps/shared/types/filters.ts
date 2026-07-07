// src/types/filters.ts
export interface TransactionFilters {
  search: string;
  type: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  amountRange: {
    min: number | null;
    max: number | null;
  };
  investmentTypes: string[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterContextValue {
  filters: TransactionFilters;
  pagination: PaginationState;
  updateFilter: <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => void;
  updatePagination: (update: Partial<PaginationState>) => void;
  resetFilters: () => void;
}

export const defaultFilters: TransactionFilters = {
  search: '',
  type: [],
  dateRange: {
    start: null,
    end: null,
  },
  amountRange: {
    min: null,
    max: null,
  },
  investmentTypes: [],
};

export const defaultPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
};
export interface FilterOption {
  value: string;
  label: string;
}

export const TRANSACTION_TYPE_FILTER_OPTIONS: FilterOption[] = [
  { value: 'deposit', label: 'Depósito' },
  { value: 'withdrawal', label: 'Saque' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'investment', label: 'Investimentos' },
];

export const INVESTMENT_CATEGORY_FILTER_OPTIONS: FilterOption[] = [
  { value: 'tesouro-direto', label: 'Tesouro Direto' },
  { value: 'fundos', label: 'Fundos de Investimento' },
  { value: 'previdencia', label: 'Previdência Privada' },
  { value: 'bolsa', label: 'Bolsa de Valores' },
];

export function getCategoryFilterOptions(selectedTransactionTypes: string[]): FilterOption[] {
  if (!selectedTransactionTypes.includes('investment')) {
    return [];
  }

  return INVESTMENT_CATEGORY_FILTER_OPTIONS;
}

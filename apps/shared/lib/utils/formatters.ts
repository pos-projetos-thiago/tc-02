// Currency and number formatters  
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Math.abs(value));
};

export const formatCurrencyInput = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers === '') return '';

  const numericValue = parseInt(numbers) / 100;
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrencyInput = (value: string): number => {
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

// Format transaction type for display
export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'deposit': 'Depósito',
    'withdrawal': 'Saque', 
    'transfer': 'Transferência',
    'investment': 'Investimento',
    'investment-fundos': 'Fundos de Investimento',
    'investment-tesouro-direto': 'Tesouro Direto',
    'investment-previdencia': 'Previdência Privada',
    'investment-bolsa': 'Bolsa de Valores',
  };

  return typeMap[type] || type;
};
// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidAmount = (amount: string | number): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
};

export const validateTransactionForm = (data: {
  type: string;
  amount: string;
}): string[] => {
  const errors: string[] = [];

  if (!data.type) {
    errors.push('Tipo de transação é obrigatório');
  }

  if (!data.amount || !isValidAmount(data.amount)) {
    errors.push('Valor deve ser maior que zero');
  }

  return errors;
};
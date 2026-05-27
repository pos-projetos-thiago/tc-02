// API helper for transactions with JWT
const API_BASE_URL = 'http://localhost:4000';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'Credit' | 'Debit';
  value: number;
  date: string;
  from?: string;
  to?: string;
  anexo?: string;
}

export interface Account {
  id: string;
  type: string;
  userId: string;
}

export interface Card {
  id: string;
  accountId: string;
  type: string;
  is_blocked: boolean;
  number: string;
  dueDate: string;
  functions: string;
  cvc: string;
  paymentDate: string | null;
  name: string;
}

// Helper to make authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
      return;
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Get account with transactions and cards
export const getAccount = async () => {
  const response = await apiCall('/account');
  return {
    account: response.result.account[0] as Account,
    transactions: response.result.transactions as Transaction[],
    cards: response.result.cards as Card[],
  };
};

// Create new transaction
export const createTransaction = async (transactionData: {
  accountId: string;
  type: 'Credit' | 'Debit';
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
}) => {
  const response = await apiCall('/account/transaction', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
  return response as Transaction;
};

// Get statement for specific account
export const getStatement = async (accountId: string) => {
  const response = await apiCall(`/account/${accountId}/statement`);
  return response.result.transactions as Transaction[];
};

// Utility to calculate balance from transactions
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    return balance + transaction.value;
  }, 0);
};
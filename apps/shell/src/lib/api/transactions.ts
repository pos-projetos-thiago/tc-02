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
      // Token expired or invalid - handle gracefully
      console.warn('API: Token inválido (401), dados podem estar desatualizados');
      
      // Only clear auth if we're absolutely sure the token is invalid
      // For now, just throw the error and let components handle it
      throw new Error('Token de autenticação inválido');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  // Check if response has content (avoid parsing empty responses)
  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type');
  
  if (response.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
    // No content response (like DELETE operations)
    return null;
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

// Update existing transaction
export const updateTransaction = async (id: string, transactionData: Partial<{
  type: 'Credit' | 'Debit';
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
}>): Promise<Transaction | null> => {
  const response = await apiCall(`/account/transaction/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
  return response as Transaction | null;
};

// Delete transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  await apiCall(`/account/transaction/${id}`, {
    method: 'DELETE',
  });
  // DELETE operations typically return 204 No Content, so no return value needed
};

// Update user profile
export const updateUserProfile = async (userData: {
  username?: string;
  email?: string;
  password?: string;
}): Promise<unknown> => {
  const response = await apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  return response;
};

// Utility to calculate balance from transactions
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    return balance + transaction.value;
  }, 0);
};
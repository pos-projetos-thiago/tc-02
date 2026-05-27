'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useJWTAuth';
import { 
  getAccount, 
  createTransaction as createTransactionAPI,
  calculateBalance,
  type Transaction as APITransaction,
  type Account
} from '@/lib/api/transactions';

type DashboardSection = 'services' | 'transfers' | 'investments' | 'others' | 'cards';

// Adapter: Convert API Transaction to our UI Transaction format
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment';
  subtype?: 'renda-fixa' | 'renda-variavel';
  investmentType?: 'fundos' | 'tesouro-direto' | 'previdencia' | 'bolsa';
  amount: number;
  description: string;
  date: string;
}

interface DashboardContextType {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  balance: number;
  transactions: Transaction[];
  addTransaction: (type: string, amount: number) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => void;
  resetData: () => void;
  isLoading: boolean;
  account: Account | null;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// Convert API transaction to UI format
const convertAPITransactionToUI = (apiTransaction: APITransaction): Transaction => {
  return {
    id: apiTransaction.id,
    type: apiTransaction.type === 'Credit' ? 'deposit' : 'withdrawal',
    amount: Math.abs(apiTransaction.value), // Always positive for UI
    description: apiTransaction.from || apiTransaction.to || `${apiTransaction.type} transaction`,
    date: apiTransaction.date,
  };
};

// Convert UI transaction type to API format
const convertUITypeToAPI = (uiType: string): { type: 'Credit' | 'Debit', description: string } => {
  switch (uiType) {
    case 'deposit':
      return { type: 'Credit', description: 'Depósito' };
    case 'withdrawal':
      return { type: 'Debit', description: 'Saque' };
    case 'transfer':
      return { type: 'Debit', description: 'Transferência' };
    case 'investment':
      return { type: 'Debit', description: 'Investimento' };
    default:
      return { type: 'Credit', description: 'Transação' };
  }
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('services');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate balance from transactions
  const balance = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit') {
        return acc + transaction.amount;
      } else {
        return acc - transaction.amount;
      }
    }, 0);
  }, [transactions]);

  // Load account data when user is authenticated
  const loadAccountData = useCallback(async () => {
    if (!user || !token) return;

    try {
      setIsLoading(true);
      const accountData = await getAccount();
      
      setAccount(accountData.account);
      
      // Convert API transactions to UI format
      const uiTransactions = accountData.transactions.map(convertAPITransactionToUI);
      setTransactions(uiTransactions);
      
    } catch (error) {
      console.error('Error loading account data:', error);
      // Keep empty state on error
      setTransactions([]);
      setAccount(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadAccountData();
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setAccount(null);
    }
  }, [user, loadAccountData]);

  // Add new transaction
  const addTransaction = useCallback(async (type: string, amount: number) => {
    if (!account) throw new Error('No account loaded');

    try {
      setIsLoading(true);
      const { type: apiType, description } = convertUITypeToAPI(type);
      
      await createTransactionAPI({
        accountId: account.id,
        type: apiType,
        value: apiType === 'Credit' ? amount : -amount,
        from: description,
      });

      // Reload data to get updated transactions
      await loadAccountData();
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [account, loadAccountData]);

  // Edit transaction (Note: API doesn't seem to have update endpoint, so we'll simulate)
  const editTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    // Since API doesn't have update endpoint, we'll update locally
    // In a real app, you'd call an API endpoint here
    setTransactions(current =>
      current.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  }, []);

  // Delete transaction (Note: API doesn't seem to have delete endpoint, so we'll simulate)
  const deleteTransaction = useCallback((id: string) => {
    // Since API doesn't have delete endpoint, we'll delete locally
    // In a real app, you'd call an API endpoint here
    setTransactions(current => current.filter(transaction => transaction.id !== id));
  }, []);

  // Reset data
  const resetData = useCallback(() => {
    setTransactions([]);
    setAccount(null);
  }, []);

  const contextValue = useMemo<DashboardContextType>(() => ({
    activeSection,
    setActiveSection,
    balance,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    resetData,
    isLoading,
    account,
  }), [
    activeSection,
    balance,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    resetData,
    isLoading,
    account,
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
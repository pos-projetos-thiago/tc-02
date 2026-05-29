'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useJWTAuth';
import { 
  getAccount, 
  createTransaction as createTransactionAPI,
  updateTransaction as updateTransactionAPI,
  deleteTransaction as deleteTransactionAPI,
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
  deleteTransaction: (id: string) => Promise<void>;
  resetData: () => void;
  isLoading: boolean;
  account: Account | null;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const convertAPITransactionToUI = (apiTransaction: APITransaction): Transaction => {
  const description = apiTransaction.from || apiTransaction.to || '';
  
  let type: Transaction['type'] = 'deposit';
  let subtype: Transaction['subtype'] | undefined;
  let investmentType: Transaction['investmentType'] | undefined;
  
  if (apiTransaction.type === 'Credit') {
    type = 'deposit';
  } else {
    if (description === 'Investimento' || description.includes('Investimento')) {
      type = 'investment';
      if (description.includes(':')) {
        const [, investType] = description.split(':');
        switch (investType) {
          case 'Fundos':
            subtype = 'renda-variavel';
            investmentType = 'fundos';
            break;
          case 'Tesouro':
            subtype = 'renda-fixa';
            investmentType = 'tesouro-direto';
            break;
          case 'Previdencia':
            subtype = 'renda-fixa';
            investmentType = 'previdencia';
            break;
          case 'Bolsa':
            subtype = 'renda-variavel';
            investmentType = 'bolsa';
            break;
          default:
            subtype = 'renda-variavel';
            investmentType = 'fundos';
        }
      } else {
        subtype = 'renda-variavel';
        investmentType = 'fundos';
      }
    } else if (description === 'Transferência' || description.includes('transferência')) {
      type = 'transfer';
    } else {
      type = 'withdrawal';
    }
  }
  
  const result = {
    id: apiTransaction.id,
    type,
    subtype,
    investmentType,
    amount: Math.abs(apiTransaction.value),
    description: description || `${apiTransaction.type} transaction`,
    date: apiTransaction.date,
  };
  
  return result;
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
    // Tipos específicos de investimento - salvar tipo específico na descrição
    case 'investment-fundos':
      return { type: 'Debit', description: 'Investimento:Fundos' };
    case 'investment-tesouro-direto':
      return { type: 'Debit', description: 'Investimento:Tesouro' };
    case 'investment-previdencia':
      return { type: 'Debit', description: 'Investimento:Previdencia' };
    case 'investment-bolsa':
      return { type: 'Debit', description: 'Investimento:Bolsa' };
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

  // Calculate balance from transactions (starting with R$ 2.000 for new users)
  const balance = useMemo(() => {
    const INITIAL_BALANCE = 2000; // R$ 2.000 saldo inicial
    
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit') {
        return acc + transaction.amount;
      } else {
        return acc - transaction.amount;
      }
    }, INITIAL_BALANCE);
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

    // Validação de saldo para transações de débito
    const { type: apiType, description } = convertUITypeToAPI(type);
    if (apiType === 'Debit' && amount > balance) {
      throw new Error(`Saldo insuficiente. Saldo atual: R$ ${balance.toFixed(2)}`);
    }

    try {
      setIsLoading(true);
      
      await createTransactionAPI({
        accountId: account.id,
        type: apiType,
        value: apiType === 'Credit' ? amount : -amount,
        from: description,
      });

      await loadAccountData();
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [account, loadAccountData, balance]);

  // Edit transaction - calls API to update
  const editTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!account) throw new Error('No account loaded');
    
    try {
      setIsLoading(true);
      
      // Convert UI updates to API format
      const apiUpdates: any = {};
      if (updates.amount !== undefined) {
        // Determine if it should be positive or negative based on transaction type
        const transaction = transactions.find(t => t.id === id);
        if (transaction?.type === 'deposit') {
          apiUpdates.value = updates.amount;
        } else {
          apiUpdates.value = -Math.abs(updates.amount);
        }
      }
      if (updates.description !== undefined) {
        apiUpdates.from = updates.description;
      }
      
      // Call API to update
      await updateTransactionAPI(id, apiUpdates);
      
      // Reload account data to get updated transactions
      await loadAccountData();
      
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [account, loadAccountData, transactions]);

  // Delete transaction - calls API to delete
  const deleteTransaction = useCallback(async (id: string) => {
    if (!account) throw new Error('No account loaded');
    
    try {
      setIsLoading(true);
      
      // Call API to delete
      await deleteTransactionAPI(id);
      
      // Reload account data to get updated transactions
      await loadAccountData();
      
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [account, loadAccountData]);

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
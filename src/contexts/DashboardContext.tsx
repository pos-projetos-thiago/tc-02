'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

type DashboardSection = 'services' | 'transfers' | 'investments' | 'others' | 'cards';

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
  addTransaction: (type: string, amount: number) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  resetData: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const STORAGE_KEYS = {
  balance: 'dashboard-balance',
  transactions: 'dashboard-transactions'
};

type StorageValue = string | number | Transaction[] | boolean;

const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const getStorageItem = <T extends StorageValue>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) return defaultValue;
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    return key.includes('balance') 
      ? parseFloat(stored) as T
      : JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Erro ao ler ${key} do localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = (key: string, value: StorageValue): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.warn(`Erro ao salvar ${key} no localStorage:`, error);
  }
};

const getStoredBalance = (): number => {
  return getStorageItem(STORAGE_KEYS.balance, 2000.00);
};

const getStoredTransactions = (): Transaction[] => {
  return getStorageItem(STORAGE_KEYS.transactions, []);
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('services');
  const [balance, setBalance] = useState(() => getStoredBalance());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStoredTransactions());

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.balance, balance.toString());
  }, [balance]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  const addTransaction = useCallback((type: string, amount: number) => {
    const transactionTypes: { [key: string]: Transaction['type'] } = {
      deposit: 'deposit',
      withdrawal: 'withdrawal',
      'investment-renda-fixa': 'investment',
      'investment-renda-variavel': 'investment',
      'investment-fundos': 'investment',
      'investment-tesouro-direto': 'investment',
      'investment-previdencia': 'investment',
      'investment-bolsa': 'investment'
    };

    const transactionLabels: { [key: string]: string } = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      'investment-renda-fixa': 'Investimento - Renda Fixa',
      'investment-renda-variavel': 'Investimento - Renda Variável',
      'investment-fundos': 'Fundos de investimento',
      'investment-tesouro-direto': 'Tesouro Direto',
      'investment-previdencia': 'Previdência Privada',
      'investment-bolsa': 'Bolsa de Valores'
    };

    const subtypeMap: { [key: string]: Transaction['subtype'] } = {
      'investment-renda-fixa': 'renda-fixa',
      'investment-renda-variavel': 'renda-variavel',
      'investment-fundos': 'renda-variavel',
      'investment-tesouro-direto': 'renda-fixa',
      'investment-previdencia': 'renda-fixa',
      'investment-bolsa': 'renda-variavel'
    };

    const investmentTypeMap: { [key: string]: Transaction['investmentType'] } = {
      'investment-fundos': 'fundos',
      'investment-tesouro-direto': 'tesouro-direto',
      'investment-previdencia': 'previdencia',
      'investment-bolsa': 'bolsa'
    };

    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: transactionTypes[type] || 'transfer',
      subtype: subtypeMap[type],
      investmentType: investmentTypeMap[type],
      amount: amount,
      description: transactionLabels[type] || 'Transação',
      date: new Date().toISOString().split('T')[0]
    };

    if (type === 'deposit') {
      setBalance(prev => prev + amount);
    } else {
      setBalance(prev => prev - amount);
    }

    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    const originalTransaction = transactions.find(t => t.id === id);
    if (!originalTransaction) return;

    const oldAmount = originalTransaction.amount;
    const oldType = originalTransaction.type;
    const newAmount = updates.amount !== undefined ? updates.amount : oldAmount;
    const newType = updates.type !== undefined ? updates.type : oldType;

    if (newAmount !== oldAmount || newType !== oldType) {
      setBalance(currentBalance => {
        let adjustedBalance = currentBalance;

        if (oldType === 'deposit') {
          adjustedBalance -= oldAmount;
        } else {
          adjustedBalance += oldAmount;
        }

        if (newType === 'deposit') {
          adjustedBalance += newAmount;
        } else {
          adjustedBalance -= newAmount;
        }

        return adjustedBalance;
      });
    }

    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  }, [transactions]);

  const deleteTransaction = useCallback((id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;

    setBalance(currentBalance => {
      if (transactionToDelete.type === 'deposit') {
        return currentBalance - transactionToDelete.amount;
      } else {
        return currentBalance + transactionToDelete.amount;
      }
    });

    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [transactions]);

  const resetData = useCallback(() => {
    setBalance(2000.00);
    setTransactions([]);

    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEYS.balance);
        localStorage.removeItem(STORAGE_KEYS.transactions);
      } catch (error) {
        console.warn('Erro ao limpar localStorage:', error);
      }
    }
  }, []);

  const contextValue = useMemo(() => ({
    activeSection,
    setActiveSection,
    balance,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    resetData
  }), [activeSection, balance, transactions, addTransaction, editTransaction, deleteTransaction, resetData]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de DashboardProvider');
  }
  return context;
}

export type { DashboardSection };
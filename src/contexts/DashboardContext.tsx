'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type DashboardSection = 'services' | 'transfers' | 'investments' | 'others';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment';
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
  resetData: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const STORAGE_KEYS = {
  balance: 'dashboard-balance',
  transactions: 'dashboard-transactions'
};

const getStoredBalance = (): number => {
  if (typeof window === 'undefined') return 2000.00;
  const stored = localStorage.getItem(STORAGE_KEYS.balance);
  return stored ? parseFloat(stored) : 2000.00;
};

const getStoredTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.transactions);
  return stored ? JSON.parse(stored) : [];
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('services');
  const [balance, setBalance] = useState(() => getStoredBalance());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStoredTransactions());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.balance, balance.toString());
    }
  }, [balance]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (type: string, amount: number) => {
    const transactionTypes: { [key: string]: Transaction['type'] } = {
      deposit: 'deposit',
      withdrawal: 'withdrawal', 
      investment: 'investment'
    };

    const transactionLabels: { [key: string]: string } = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      investment: 'Investimento'
    };

    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: transactionTypes[type] || 'transfer',
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
  };

  const resetData = () => {
    setBalance(2000.00);
    setTransactions([]);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.balance);
      localStorage.removeItem(STORAGE_KEYS.transactions);
    }
  };

  return (
    <DashboardContext.Provider value={{ 
      activeSection, 
      setActiveSection, 
      balance, 
      transactions, 
      addTransaction,
      resetData
    }}>
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
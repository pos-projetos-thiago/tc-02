'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { 
  getUserBalance, 
  updateUserBalance, 
  getUserTransactions, 
  addTransaction as addTransactionDB,
  updateTransaction as updateTransactionDB,
  deleteTransaction as deleteTransactionDB,
  SupabaseTransaction 
} from '@/lib/supabase/database';

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


const setStorageItem = (key: string, value: StorageValue): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.warn(`Erro ao salvar ${key} no localStorage:`, error);
  }
};


export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('services');
  const [balance, setBalance] = useState(2000.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, isAuthenticated } = useSupabaseAuth();

  // Função para converter transação do Supabase para formato local
  const convertFromSupabase = useCallback((supabaseTransaction: SupabaseTransaction): Transaction => ({
    id: supabaseTransaction.id,
    type: supabaseTransaction.type,
    subtype: supabaseTransaction.subtype,
    investmentType: supabaseTransaction.investment_type,
    amount: supabaseTransaction.amount,
    description: supabaseTransaction.description,
    date: supabaseTransaction.date
  }), []);


  // Carregar dados quando usuário muda
  useEffect(() => {
    const load = async () => {
      if (!user?.id || !isAuthenticated) {
        setBalance(2000.00);
        setTransactions([]);
        return;
      }

      try {
        // Carregar saldo
        const userBalance = await getUserBalance(user.id);
        setBalance(userBalance);

        // Carregar transações
        const userTransactions = await getUserTransactions(user.id);
        const convertedTransactions = userTransactions.map(convertFromSupabase);
        setTransactions(convertedTransactions);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    load();
  }, [user?.id, isAuthenticated, convertFromSupabase]);

  // Manter localStorage como fallback
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.balance, balance.toString());
  }, [balance]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  const addTransaction = useCallback(async (type: string, amount: number) => {
    if (!user?.id || !isAuthenticated) {
      console.warn('Usuário não autenticado');
      return;
    }
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

    const transactionData = {
      type: transactionTypes[type] || 'transfer',
      subtype: subtypeMap[type],
      investment_type: investmentTypeMap[type],
      amount: amount,
      description: transactionLabels[type] || 'Transação',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // Salvar transação no Supabase
      const savedTransaction = await addTransactionDB(user.id, transactionData);
      
      if (!savedTransaction) {
        console.error('Falha ao salvar transação no Supabase');
        return;
      }

      // Atualizar saldo
      const newBalance = type === 'deposit' ? balance + amount : balance - amount;
      const balanceUpdated = await updateUserBalance(user.id, newBalance);
      
      if (!balanceUpdated) {
        console.error('Falha ao atualizar saldo no Supabase');
        return;
      }

      // Atualizar estado local
      setBalance(newBalance);
      const convertedTransaction = convertFromSupabase(savedTransaction);
      setTransactions(prev => [convertedTransaction, ...prev]);
      
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  }, [user, isAuthenticated, balance, convertFromSupabase]);

  const editTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!user?.id || !isAuthenticated) {
      console.warn('Usuário não autenticado');
      return;
    }

    const originalTransaction = transactions.find(t => t.id === id);
    if (!originalTransaction) return;

    const oldAmount = originalTransaction.amount;
    const oldType = originalTransaction.type;
    const newAmount = updates.amount !== undefined ? updates.amount : oldAmount;
    const newType = updates.type !== undefined ? updates.type : oldType;

    try {
      // Converter para formato Supabase
      const supabaseUpdates: Partial<SupabaseTransaction> = {};
      if (updates.type) supabaseUpdates.type = updates.type;
      if (updates.subtype) supabaseUpdates.subtype = updates.subtype;
      if (updates.investmentType) supabaseUpdates.investment_type = updates.investmentType;
      if (updates.amount !== undefined) supabaseUpdates.amount = updates.amount;
      if (updates.description) supabaseUpdates.description = updates.description;
      if (updates.date) supabaseUpdates.date = updates.date;

      // Atualizar no Supabase
      const updatedTransaction = await updateTransactionDB(id, supabaseUpdates);
      
      if (!updatedTransaction) {
        console.error('Falha ao atualizar transação no Supabase');
        return;
      }

      // Atualizar saldo se necessário
      if (newAmount !== oldAmount || newType !== oldType) {
        let adjustedBalance = balance;

        // Reverter efeito da transação original
        if (oldType === 'deposit') {
          adjustedBalance -= oldAmount;
        } else {
          adjustedBalance += oldAmount;
        }

        // Aplicar efeito da transação atualizada
        if (newType === 'deposit') {
          adjustedBalance += newAmount;
        } else {
          adjustedBalance -= newAmount;
        }

        const balanceUpdated = await updateUserBalance(user.id, adjustedBalance);
        
        if (!balanceUpdated) {
          console.error('Falha ao atualizar saldo no Supabase');
          return;
        }

        setBalance(adjustedBalance);
      }

      // Atualizar estado local
      const convertedTransaction = convertFromSupabase(updatedTransaction);
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? convertedTransaction : transaction
        )
      );
      
    } catch (error) {
      console.error('Erro ao editar transação:', error);
    }
  }, [user, isAuthenticated, transactions, balance, convertFromSupabase]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user?.id || !isAuthenticated) {
      console.warn('Usuário não autenticado');
      return;
    }

    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;

    try {
      // Deletar no Supabase
      const deleted = await deleteTransactionDB(id);
      
      if (!deleted) {
        console.error('Falha ao deletar transação no Supabase');
        return;
      }

      // Atualizar saldo
      let newBalance = balance;
      if (transactionToDelete.type === 'deposit') {
        newBalance = balance - transactionToDelete.amount;
      } else {
        newBalance = balance + transactionToDelete.amount;
      }

      const balanceUpdated = await updateUserBalance(user.id, newBalance);
      
      if (!balanceUpdated) {
        console.error('Falha ao atualizar saldo no Supabase');
        return;
      }

      // Atualizar estado local
      setBalance(newBalance);
      setTransactions(prev => prev.filter(t => t.id !== id));
      
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  }, [user, isAuthenticated, transactions, balance]);

  const resetData = useCallback(async () => {
    // Limpar localStorage
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEYS.balance);
        localStorage.removeItem(STORAGE_KEYS.transactions);
      } catch (error) {
        console.warn('Erro ao limpar localStorage:', error);
      }
    }
    
    // Recarregar dados do Supabase
    if (!user?.id || !isAuthenticated) {
      setBalance(2000.00);
      setTransactions([]);
      return;
    }

    try {
      const userBalance = await getUserBalance(user.id);
      setBalance(userBalance);

      const userTransactions = await getUserTransactions(user.id);
      const convertedTransactions = userTransactions.map(convertFromSupabase);
      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }, [user, isAuthenticated, convertFromSupabase]);

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
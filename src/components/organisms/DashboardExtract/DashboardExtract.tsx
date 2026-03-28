'use client';

import { useState, useEffect } from 'react';
import styles from './DashboardExtract.module.scss';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: string;
}

export interface DashboardExtractProps {
  transactions?: Transaction[];
  maxItems?: number;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1500.00,
    description: 'Depósito em conta',
    date: '2026-03-25'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: -250.50,
    description: 'Compra no supermercado',
    date: '2026-03-24'
  },
  {
    id: '3',
    type: 'transfer',
    amount: -100.00,
    description: 'Transferência PIX',
    date: '2026-03-23'
  }
];

export const DashboardExtract = ({ 
  transactions = mockTransactions, 
  maxItems = 5 
}: DashboardExtractProps) => {
  const [isHydrated, setIsHydrated] = useState(() => false);

  useEffect(() => {
    // Usando timeout para evitar cascading renders
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'long'
    });
  };

  const limitedTransactions = transactions.slice(0, maxItems);

  return (
    <aside className={styles.extract}>
      <h2 className={styles.title}>Extrato</h2>

      <div className={styles['transaction-list']}>
        {limitedTransactions.map((transaction) => (
          <div key={transaction.id} className={styles['transaction-item']}>
            <div className={styles['month-name']}>
              {isHydrated ? getMonthName(transaction.date) : ''}
            </div>
            <div className={styles['description-row']}>
              <div className={styles['transaction-description']}>
                Depósito
              </div>
              <div className={styles['transaction-date']}>
                {isHydrated ? formatDate(transaction.date) : ''}
              </div>
            </div>
            <div className={styles['transaction-amount']}>
              {formatCurrency(transaction.amount)}
            </div>
            <div className={styles['transaction-divider']}></div>
          </div>
        ))}

        {limitedTransactions.length === 0 && (
          <div className={styles['empty-state']}>
            <p>Nenhuma transação recente</p>
          </div>
        )}
      </div>
    </aside>
  );
};
'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/contexts/DashboardContextJWT';
import styles from './TransactionItem.module.scss';

export interface TransactionItemProps {
  transaction: Transaction;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(value));

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const getMonthName = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', { month: 'long' });

  const getTypeLabel = (
    type: Transaction['type'],
    subtype?: Transaction['subtype'],
    investmentType?: Transaction['investmentType']
  ) => {
    if (type === 'investment') {
      if (investmentType) {
        const labels = {
          fundos: 'Fundos de investimento',
          'tesouro-direto': 'Tesouro Direto',
          previdencia: 'Previdência Privada',
          bolsa: 'Bolsa de Valores',
        };
        return labels[investmentType];
      }
      if (subtype)
        return subtype === 'renda-fixa' ? 'Investimento - Renda Fixa' : 'Investimento - Renda Variável';
    }
    const labels = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      transfer: 'Transferência',
      investment: 'Investimento',
    };
    return labels[type] || 'Transação';
  };

  return (
    <div className={styles['transaction-item']}>
      <div className={styles['month-name']}>
        {isHydrated ? getMonthName(transaction.date) : ''}
      </div>
      <div className={styles['description-row']}>
        <div className={styles['transaction-description']}>
          {getTypeLabel(transaction.type, transaction.subtype, transaction.investmentType)}
        </div>
        <div className={styles['transaction-date']}>
          {isHydrated ? formatDate(transaction.date) : ''}
        </div>
      </div>
      <div className={styles['transaction-amount']}>{formatCurrency(transaction.amount)}</div>
      <div className={styles['transaction-divider']} />
    </div>
  );
};

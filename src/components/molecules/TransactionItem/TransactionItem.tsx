'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { Transaction } from '@/contexts/DashboardContext';
import styles from './TransactionItem.module.scss';

export interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

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

  const getTypeLabel = (type: Transaction['type'], subtype?: Transaction['subtype'], investmentType?: Transaction['investmentType']) => {
    if (type === 'investment') {
      if (investmentType) {
        const specificLabels = {
          fundos: 'Fundos de investimento',
          'tesouro-direto': 'Tesouro Direto',
          previdencia: 'Previdência Privada',
          bolsa: 'Bolsa de Valores'
        };
        return specificLabels[investmentType];
      }
      
      if (subtype) {
        return subtype === 'renda-fixa' ? 'Investimento - Renda Fixa' : 'Investimento - Renda Variável';
      }
    }
    
    const typeLabels = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      transfer: 'Transferência',
      investment: 'Investimento'
    };
    return typeLabels[type] || 'Transação';
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
      <div className={styles['transaction-amount']}>
        {formatCurrency(transaction.amount)}
      </div>
      <div className={styles['transaction-divider']}></div>
    </div>
  );
};
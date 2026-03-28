'use client';

import { TransactionItem, type Transaction } from '@/components/molecules/TransactionItem';
import styles from './DashboardExtract.module.scss';

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

  const limitedTransactions = transactions.slice(0, maxItems);

  return (
    <aside className={styles.extract}>
      <h2 className={styles.title}>Extrato</h2>

      <div className={styles['transaction-list']}>
        {limitedTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
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
'use client';

import { TransactionItem, type Transaction } from '@/components/molecules/TransactionItem';
import styles from './DashboardExtract.module.scss';

export type { Transaction };

export interface DashboardExtractProps {
  transactions?: Transaction[];
  maxItems?: number;
}

export const DashboardExtract = ({ 
  transactions = [], 
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
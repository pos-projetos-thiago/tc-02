'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TransactionItem } from '@/components/molecules/TransactionItem';
import type { Transaction } from '@/contexts/DashboardContextJWT';
import styles from './DashboardExtract.module.scss';

export interface DashboardExtractProps {
  transactions?: Transaction[];
  maxItems?: number;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export const DashboardExtract = ({ 
  transactions = [], 
  maxItems = 4,
  onEditClick,
  onDeleteClick
}: DashboardExtractProps) => {
  const router = useRouter();
  const limitedTransactions = transactions.slice(0, maxItems);
  const hasMoreTransactions = transactions.length > maxItems;

  const handleViewMore = () => {
    router.push('/dashboard/transacoes');
  };

  return (
    <aside className={styles.extract}>
      <div className={styles.header}>
        <h2 className={styles.title}>Extrato</h2>
        
        <div className={styles.actions}>
          <button 
            className={styles['action-button']}
            onClick={onEditClick}
            title="Editar transações"
            type="button"
          >
            <Image 
              src="/Extract/edit.svg" 
              alt="Editar"
              width={21}
              height={21}
            />
          </button>
          
          <button 
            className={styles['action-button']}
            onClick={onDeleteClick}
            title="Deletar transações"
            type="button"
          >
            <Image 
              src="/Extract/delete.svg" 
              alt="Deletar"
              width={19}
              height={22}
            />
          </button>
        </div>
      </div>

      <div className={styles['transaction-list']}>
        {limitedTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}

        {limitedTransactions.length === 0 && (
          <div className={styles['empty-state']}>
            <p>Nenhuma transação recente</p>
          </div>
        )}

        {hasMoreTransactions && (
          <button 
            className={styles['view-more-button']}
            onClick={handleViewMore}
            type="button"
          >
            Ver mais
          </button>
        )}
      </div>
    </aside>
  );
};
'use client';

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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return '↗️';
      case 'withdrawal': return '↙️';
      case 'transfer': return '↔️';
      default: return '💰';
    }
  };

  const limitedTransactions = transactions.slice(0, maxItems);

  return (
    <aside className={styles.extract}>
      <header className={styles.header}>
        <h2 className={styles.title}>Extrato</h2>
        <button className={styles['view-all-btn']} type="button">Ver tudo</button>
      </header>
      
      <ul className={styles['transaction-list']}>
        {limitedTransactions.map((transaction) => (
          <li key={transaction.id}>
            <article className={styles['transaction-item']}>
              <div className={styles['transaction-icon']} aria-hidden="true">
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div className={styles['transaction-info']}>
                <h3 className={styles['transaction-description']}>
                  {transaction.description}
                </h3>
                <time 
                  className={styles['transaction-date']}
                  dateTime={transaction.date}
                >
                  {formatDate(transaction.date)}
                </time>
              </div>
              
              <div className={`${styles['transaction-amount']} ${
                transaction.amount > 0 ? styles.positive : styles.negative
              }`}>
                {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </article>
          </li>
        ))}
        
        {limitedTransactions.length === 0 && (
          <div className={styles['empty-state']}>
            <p>Nenhuma transação recente</p>
          </div>
        )}
      </ul>
    </aside>
  );
};
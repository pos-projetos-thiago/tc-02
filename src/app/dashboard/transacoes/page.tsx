'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useDashboard } from '@/contexts/DashboardContext';
import { UserProfileSupabase } from '@/components/molecules/UserProfile/UserProfileSupabase';
import type { Transaction } from '@/components/molecules/TransactionItem';
import { Button } from '@/components/atoms/Button/Button';
import { Loading } from '@/components/atoms/Loading';
import styles from './transacoes.module.scss';

export default function TransacoesPage() {
  const { user, isLoading } = useSupabaseAuth();
  const { transactions, deleteTransaction } = useDashboard();
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading 
          variant="pulse" 
          size="large" 
          text="Carregando extrato..." 
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário';

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transactionId: string) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      deleteTransaction(transactionId);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <>
      <UserProfileSupabase userName={userName} />
      <main className={styles.main}>
        <div className={styles['dashboard-container']}>
          <div className={styles['page-header']}>
            <div className={styles['header-content']}>
              <h1 className={styles['page-title']}>Extrato</h1>
              <p className={styles.subtitle}>Gerencie suas movimentações financeiras</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className={styles['back-button']}
            >
              Voltar ao Dashboard
            </Button>
          </div>

          <div className={styles['transactions-card']}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']}>Histórico de Transações</h2>
              <span className={styles.counter}>
                {transactions.length} {transactions.length === 1 ? 'transação' : 'transações'}
              </span>
            </div>

            <div className={styles['card-content']}>
              {transactions.length === 0 ? (
                <div className={styles['empty-state']}>
                  <h3 className={styles['empty-title']}>Nenhuma transação encontrada</h3>
                  <p className={styles['empty-description']}>
                    Suas transações aparecerão aqui após você fazer movimentações
                  </p>
                </div>
              ) : (
                <div className={styles['transaction-list']}>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className={styles['transaction-row']}>
                      <div className={styles['transaction-info']}>
                        <div className={styles['transaction-month']}>
                          {new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'long' })}
                        </div>
                        <div className={styles['transaction-main']}>
                          <div className={styles['transaction-details']}>
                            <div className={styles['transaction-type']}>
                              {transaction.type === 'deposit' && 'Depósito'}
                              {transaction.type === 'withdrawal' && 'Saque'}
                              {transaction.type === 'transfer' && 'Transferência'}
                              {transaction.type === 'investment' && 'Investimento'}
                            </div>
                            <div className={styles['transaction-date']}>
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className={styles['transaction-amount']}>
                            R$ {transaction.amount.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>
                      <div className={styles['transaction-actions']}>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleEdit(transaction)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {editingTransaction && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <h2 className={styles['modal-title']}>Editar Transação</h2>
            <p className={styles['modal-text']}>Funcionalidade em desenvolvimento</p>
            <Button onClick={handleCancelEdit}>Fechar</Button>
          </div>
        </div>
      )}
    </>
  );
}
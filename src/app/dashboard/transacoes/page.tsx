'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useDashboard } from '@/contexts/DashboardContext';
import { UserProfileSupabase } from '@/components/molecules/UserProfile/UserProfileSupabase';
import type { Transaction } from '@/contexts/DashboardContext';
import { Button } from '@/components/atoms/Button/Button';
import { LoadingScreen } from '@/components/atoms/Loading';
import styles from './transacoes.module.scss';

export default function TransacoesPage() {
  const { user, isLoading } = useSupabaseAuth();
  const { transactions, deleteTransaction, editTransaction } = useDashboard();
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    amount: ''
  });

  const formatCurrency = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers === '') return '';
    
    const numericValue = parseInt(numbers) / 100;
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    
    let editType = transaction.type;
    if (transaction.type === 'investment' && transaction.subtype) {
      editType = `investment-${transaction.subtype}` as Transaction['type'];
    }
    
    setFormData({
      type: editType,
      amount: transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    });
  }, []);

  const handleDelete = useCallback(async (transactionId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;
    
    try {
      setDeletingId(transactionId);
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteTransaction(transactionId);
    } catch {
      alert('Erro ao deletar transação. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  }, [deleteTransaction]);

  const handleCancelEdit = useCallback(() => {
    setEditingTransaction(null);
    setFormData({ type: '', amount: '' });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingTransaction || !formData.amount.trim() || !formData.type) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const cleanValue = formData.amount.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleanValue);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    const updates: Partial<Transaction> = {
      amount: amount
    };

    if (formData.type.startsWith('investment-')) {
      updates.type = 'investment';
      updates.subtype = formData.type === 'investment-renda-fixa' ? 'renda-fixa' : 'renda-variavel';
    } else {
      updates.type = formData.type as Transaction['type'];
      updates.subtype = undefined;
    }

    editTransaction(editingTransaction.id, updates);

    handleCancelEdit();
  }, [editingTransaction, formData, editTransaction, handleCancelEdit]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentValue = formData.amount;
    
    if (value === '' || value.length < currentValue.length) {
      setFormData(prev => ({ ...prev, amount: value }));
      return;
    }
    
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({ ...prev, amount: formattedValue }));
  }, [formData.amount, formatCurrency]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAmountBlur = useCallback(() => {
    if (formData.amount) {
      const formattedValue = formatCurrency(formData.amount);
      setFormData(prev => ({ ...prev, amount: formattedValue }));
    }
  }, [formData.amount, formatCurrency]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <LoadingScreen 
        isVisible={true}
        size="large" 
        text="Carregando extrato..." 
      />
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário';

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
                              {transaction.type === 'investment' && transaction.subtype === 'renda-fixa' && 'Investimento - Renda Fixa'}
                              {transaction.type === 'investment' && transaction.subtype === 'renda-variavel' && 'Investimento - Renda Variável'}
                              {transaction.type === 'investment' && !transaction.subtype && 'Investimento'}
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
                          disabled={deletingId === transaction.id}
                        >
                          {deletingId === transaction.id ? 'Deletando...' : 'Deletar'}
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
            
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className={styles['form-group']}>
                <label htmlFor="type" className={styles.label}>Tipo de Transação</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Saque</option>
                  <option value="transfer">Transferência</option>
                  <option value="investment-renda-fixa">Investimento - Renda Fixa</option>
                  <option value="investment-renda-variavel">Investimento - Renda Variável</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="amount" className={styles.label}>Valor (R$)</label>
                <input
                  type="text"
                  id="amount"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  placeholder="0,00"
                  maxLength={15}
                  className={styles.input}
                />
              </div>

              <div className={styles['modal-actions']}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
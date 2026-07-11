/**
 * Página de transações com OCR integrado
 * Permite criar transações através de upload de comprovantes
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useJWTAuth';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { UserProfileJWT } from '@/components/molecules/UserProfile/UserProfileJWT';
import { TransactionOCR } from '@/components/molecules/TransactionOCR';
import { Button } from '@/components/atoms/Button/Button';
import { LoadingScreen } from '@/components/atoms/Loading';
import type { Transaction } from '@/contexts/DashboardContextJWT';
import styles from './ocr-transacoes.module.scss';

interface TransactionFormData {
  type: Transaction['type'];
  amount: number;
  description?: string;
  date?: string;
  /** Tipo composto para investimentos, ex: "investment-fundos" */
  _compositeType?: string;
}

export default function OCRTransacoesPage() {
  const { user, isLoading } = useAuth();
  const { addTransaction, transactions } = useDashboard();
  const router = useRouter();

  const [detectedTransaction, setDetectedTransaction] = useState<TransactionFormData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Manipula transação detectada pelo OCR
  const handleTransactionDetected = useCallback((transactionData: unknown) => {
    setError(null);
    
    // Mapeia os dados do OCR para o formato esperado
    const data = transactionData as {
      type?: string;
      amount?: number;
      description?: string;
      merchant?: string;
      date?: string;
      investmentType?: string;
      category?: string;
    };

    // Converte o tipo vindo do OCR/document-processor para o formato do contexto.
    // O document-processor usa 'income' | 'expense' | 'transfer';
    // o contexto usa 'deposit' | 'withdrawal' | 'transfer' | 'investment'.
    const mapType = (raw?: string): 'deposit' | 'withdrawal' | 'transfer' | 'investment' => {
      if (!raw) return 'transfer';
      if (raw === 'income') return 'deposit';
      if (raw === 'expense') {
        // Se a categoria ou investmentType indicar investimento, mapear corretamente
        if (data.category === 'investment' || data.investmentType) return 'investment';
        return 'withdrawal';
      }
      if (['deposit', 'withdrawal', 'transfer', 'investment'].includes(raw)) {
        return raw as 'deposit' | 'withdrawal' | 'transfer' | 'investment';
      }
      return 'transfer';
    };

    // Para investimentos, montar o tipo composto (ex: "investment-fundos") que
    // o addTransaction do contexto sabe decodificar.
    const resolvedType = mapType(data.type);
    let finalType: string = resolvedType;
    if (resolvedType === 'investment' && data.investmentType) {
      // Normalizar para os valores aceitos pelo contexto
      const investMap: Record<string, string> = {
        'Fundos': 'investment-fundos',
        'Tesouro': 'investment-tesouro-direto',
        'Tesouro Direto': 'investment-tesouro-direto',
        'Previdencia': 'investment-previdencia',
        'Previdência Privada': 'investment-previdencia',
        'Previdência': 'investment-previdencia',
        'Bolsa': 'investment-bolsa',
        'Renda Fixa': 'investment-tesouro-direto',
      };
      finalType = investMap[data.investmentType] ?? 'investment-fundos';
    }

    const formattedTransaction: TransactionFormData = {
      type: resolvedType,
      amount: data.amount || 0,
      description: data.description || data.merchant || 'Transação via OCR',
      date: data.date,
      // Guarda o tipo composto para uso em createTransaction
      _compositeType: finalType !== resolvedType ? finalType : undefined,
    } as TransactionFormData & { _compositeType?: string };

    setDetectedTransaction(formattedTransaction);
  }, []);

  // Manipula erros do OCR
  const handleOCRError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  }, []);

  // Cria a transação baseada nos dados detectados
  const createTransaction = useCallback(async () => {
    if (!detectedTransaction || !detectedTransaction.amount) {
      setError('Dados da transação incompletos');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Usa o tipo composto quando disponível (ex: "investment-fundos"),
      // caso contrário usa o tipo simples.
      const typeToSubmit = detectedTransaction._compositeType ?? detectedTransaction.type;
      await addTransaction(typeToSubmit, detectedTransaction.amount);
      
      setSuccess('Transação criada com sucesso!');
      setDetectedTransaction(null);

      // Atualiza a lista de transações recentes
      if (transactions) {
        setRecentTransactions(transactions.slice(0, 5));
      }

      // Remove mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(null), 5000);

    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setError('Erro ao criar transação. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  }, [detectedTransaction, addTransaction, transactions]);

  // Cancela a transação detectada
  const cancelTransaction = useCallback(() => {
    setDetectedTransaction(null);
    setError(null);
  }, []);

  // Atualiza transações recentes quando transactions muda
  useEffect(() => {
    const updateRecentTransactions = () => {
      if (transactions && transactions.length > 0) {
        setRecentTransactions(transactions.slice(0, 5));
      }
    };

    updateRecentTransactions();
  }, [transactions]);

  // Redireciona se não autenticado
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
        text="Carregando..."
      />
    );
  }

  if (!user) {
    return null;
  }

  const userName = user?.username || user?.email?.split('@')[0] || 'Usuário';

  return (
    <>
      <UserProfileJWT userName={userName} />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1>💰 Transações por OCR</h1>
              <p>Crie transações automaticamente através de comprovantes</p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/dashboard/transacoes')}
              >
                Ver Extrato
              </Button>
            </div>
          </div>

          {/* Alertas */}
          {error && (
            <div className={styles.alert + ' ' + styles.error}>
              <span className={styles.alertIcon}>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.alert + ' ' + styles.success}>
              <span className={styles.alertIcon}>✅</span>
              {success}
            </div>
          )}

          {/* Grid Principal */}
          <div className={styles.grid}>
            {/* OCR Upload */}
            <div className={styles.ocrSection}>
              <TransactionOCR
                onTransactionDetected={handleTransactionDetected}
                onError={handleOCRError}
                className={styles.ocrUploader}
              />
            </div>

            {/* Transação Detectada */}
            {detectedTransaction && (
              <div className={styles.detectedSection}>
                <div className={styles.sectionHeader}>
                  <h3>🎯 Transação Detectada</h3>
                  <p>Confirme os dados antes de criar a transação</p>
                </div>

                <div className={styles.transactionPreview}>
                  <div className={styles.previewItem}>
                    <label>Tipo:</label>
                    <span className={styles.transactionType}>
                      {detectedTransaction.type === 'deposit' ? '💰 Depósito' : 
                       detectedTransaction.type === 'withdrawal' ? '💸 Saque' :
                       detectedTransaction.type === 'transfer' ? '🔄 Transferência' :
                       detectedTransaction.type === 'investment' ? '📈 Investimento' : '💸 Saída'}
                    </span>
                  </div>

                  <div className={styles.previewItem}>
                    <label>Valor:</label>
                    <span className={styles.amount}>
                      R$ {detectedTransaction.amount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  {detectedTransaction.description && (
                    <div className={styles.previewItem}>
                      <label>Descrição:</label>
                      <span>{detectedTransaction.description}</span>
                    </div>
                  )}

                  {detectedTransaction.date && (
                    <div className={styles.previewItem}>
                      <label>Data:</label>
                      <span>{detectedTransaction.date}</span>
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    onClick={cancelTransaction}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={createTransaction}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Criando...' : 'Criar Transação'}
                  </Button>
                </div>
              </div>
            )}

            {/* Transações Recentes */}
            {recentTransactions.length > 0 && (
              <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                  <h3>📋 Transações Recentes</h3>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => router.push('/dashboard/transacoes')}
                  >
                    Ver Todas
                  </Button>
                </div>

                <div className={styles.transactionsList}>
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className={styles.transactionItem}>
                      <div className={styles.transactionInfo}>
                        <div className={styles.transactionType}>
                          {transaction.type === 'deposit' && '💰 Depósito'}
                          {transaction.type === 'withdrawal' && '💸 Saque'}
                          {transaction.type === 'transfer' && '🔄 Transferência'}
                          {transaction.type === 'investment' && '📈 Investimento'}
                        </div>
                        <div className={styles.transactionDate}>
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className={styles.transactionAmount}>
                        R$ {transaction.amount.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tutorial */}
          <div className={styles.tutorial}>
            <div className={styles.tutorialHeader}>
              <h3>📚 Como usar</h3>
            </div>
            <div className={styles.tutorialSteps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <div className={styles.stepContent}>
                  <h4>Upload do Comprovante</h4>
                  <p>Arraste ou selecione uma imagem do seu comprovante bancário</p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <div className={styles.stepContent}>
                  <h4>Dados Extraídos</h4>
                  <p>O sistema analisará a imagem e extrairá os dados da transação</p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <div className={styles.stepContent}>
                  <h4>Confirmar e Criar</h4>
                  <p>Revise os dados detectados e confirme para criar a transação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useJWTAuth';
import { useDashboard } from '../../../contexts/DashboardContextJWT';
import { UserProfileJWT } from '../../../components/molecules/UserProfile/UserProfileJWT';
import { IntelligentDocumentUploader } from '../../../components/organisms/IntelligentDocumentUploader';
import { Button } from '../../../components/atoms/Button/Button';
import { LoadingScreen } from '../../../components/atoms/Loading';
import { DocumentAnalysisResult } from '../../../lib/ai/document-processor';
import styles from './ai-documents.module.scss';

export default function ControleFinanceiroPage() {
  const { user, isLoading } = useAuth();
  const { addTransaction } = useDashboard();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [processedDocuments, setProcessedDocuments] = useState<DocumentAnalysisResult[]>([]);
  const [isCreatingTransactions, setIsCreatingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocumentProcessed = useCallback((result: DocumentAnalysisResult) => {
    setError(null);
    setProcessedDocuments(prev => [result, ...prev]);
    
    // Toast é exibido pelo componente IntelligentDocumentUploader
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Cria transações no sistema
  const handleTransactionCreated = useCallback(async (systemTransactions: unknown[]) => {
    console.log('Página: handleTransactionCreated chamado com:', systemTransactions);
    
    if (systemTransactions.length === 0) {
      console.error('❌ Nenhuma transação para criar');
      setError('Nenhuma transação para criar');
      return;
    }

    console.log('Iniciando criação de', systemTransactions.length, 'transações...');
    setIsCreatingTransactions(true);
    setError(null);

    try {
      let createdCount = 0;

      for (const transactionData of systemTransactions) {
        try {
          console.log('Criando transação:', transactionData);
          
          // Cast para o tipo esperado
          const data = transactionData as { type: string; amount: number };
          
          // A função addTransaction espera (type: string, amount: number)
          await addTransaction(data.type, data.amount);
          
          createdCount++;
          console.log('Transação criada com sucesso!');
        } catch (error) {
          console.error('💥 Erro ao criar transação individual:', error);
        }
      }

      console.log(`Total criado: ${createdCount}/${systemTransactions.length}`);

      if (createdCount > 0) {
        const message = `${createdCount} transações criadas com sucesso!`;
        console.log(message);
        // Toast é exibido pelo componente IntelligentDocumentUploader
      } else {
        setError('Nenhuma transação pôde ser criada');
      }

    } catch (error) {
      console.error('💥 Erro geral ao criar transações:', error);
      setError('Erro ao criar transações no sistema');
    } finally {
      setIsCreatingTransactions(false);
    }
  }, [addTransaction]);

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
              <h1>Controle Financeiro</h1>
              <p>Importe seus documentos financeiros</p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="primary"
                onClick={() => router.push('/dashboard/transacoes')}
              >
                Extrato
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            </div>
          </div>

          {/* Alertas */}
          {error && (
            <div className={styles.alert + ' ' + styles.error}>
              {error}
            </div>
          )}

          {isCreatingTransactions && (
            <div className={styles.alert + ' ' + styles.info}>
              Criando transações no sistema...
            </div>
          )}

          {/* Upload Inteligente */}
          <div className={styles.uploaderSection}>
            <IntelligentDocumentUploader
              onDocumentProcessed={handleDocumentProcessed}
              onError={handleError}
              onTransactionCreated={handleTransactionCreated}
              userName={userName}
              multiple={true}
              className={styles.uploader}
            />
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Página de Processamento Inteligente de Documentos
 * Sistema completo com IA para análise automática
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useJWTAuth';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { UserProfileJWT } from '@/components/molecules/UserProfile/UserProfileJWT';
import { IntelligentDocumentUploader } from '@/components/organisms/IntelligentDocumentUploader';
import { Button } from '@/components/atoms/Button/Button';
import { LoadingScreen } from '@/components/atoms/Loading';
import { DocumentAnalysisResult } from '@/lib/ai/document-processor';
// import type { Transaction } from '@/contexts/DashboardContextJWT';
import styles from './ai-documents.module.scss';

export default function AIDocumentsPage() {
  const { user, isLoading } = useAuth();
  const { addTransaction } = useDashboard();
  const router = useRouter();

  const [processedDocuments, setProcessedDocuments] = useState<DocumentAnalysisResult[]>([]);
  const [isCreatingTransactions, setIsCreatingTransactions] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Manipula documento processado
  const handleDocumentProcessed = useCallback((result: DocumentAnalysisResult) => {
    setError(null);
    setProcessedDocuments(prev => [result, ...prev]);
    
    if (result.success) {
      setSuccess(
        `✅ Documento processado! ${result.transactions.length} transações encontradas.`
      );
    }

    // Remove mensagem de sucesso após 5 segundos
    setTimeout(() => setSuccess(null), 5000);
  }, []);

  // Manipula erros
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  }, []);

  // Cria transações no sistema
  const handleTransactionCreated = useCallback(async (systemTransactions: any[]) => {
    console.log('🏦 Página: handleTransactionCreated chamado com:', systemTransactions);
    
    if (systemTransactions.length === 0) {
      console.error('❌ Nenhuma transação para criar');
      setError('Nenhuma transação para criar');
      return;
    }

    console.log('⏳ Iniciando criação de', systemTransactions.length, 'transações...');
    setIsCreatingTransactions(true);
    setError(null);

    try {
      let createdCount = 0;

      for (const transactionData of systemTransactions) {
        try {
          console.log('💾 Criando transação:', transactionData);
          
          // A função addTransaction espera (type: string, amount: number)
          await addTransaction(transactionData.type, transactionData.amount);
          
          createdCount++;
          console.log('✅ Transação criada com sucesso!');
        } catch (error) {
          console.error('💥 Erro ao criar transação individual:', error);
        }
      }

      console.log(`📊 Total criado: ${createdCount}/${systemTransactions.length}`);

      if (createdCount > 0) {
        const message = `🎉 ${createdCount} transações criadas com sucesso!`;
        console.log(message);
        setSuccess(message);
        
        // Remove mensagem após 5 segundos
        setTimeout(() => setSuccess(null), 5000);
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
              <h1>🤖 Documentos Inteligentes</h1>
              <p>Processamento automático de documentos financeiros com IA</p>
              <div className={styles.capabilities}>
                <span>📄 PDF</span>
                <span>📊 Excel</span>
                <span>📝 TXT</span>
                <span>📋 CSV</span>
                <span>🤖 IA</span>
              </div>
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

          {/* Loading de criação de transações */}
          {isCreatingTransactions && (
            <div className={styles.alert + ' ' + styles.info}>
              <span className={styles.alertIcon}>⏳</span>
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

          {/* Estatísticas */}
          {processedDocuments.length > 0 && (
            <div className={styles.stats}>
              <div className={styles.statsHeader}>
                <h3>📊 Estatísticas da Sessão</h3>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {processedDocuments.length}
                  </div>
                  <div className={styles.statLabel}>Documentos Processados</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {processedDocuments.reduce((sum, doc) => sum + doc.summary.totalTransactions, 0)}
                  </div>
                  <div className={styles.statLabel}>Transações Encontradas</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {Math.round(
                      processedDocuments
                        .filter(doc => doc.success)
                        .reduce((sum, doc) => sum + doc.confidence, 0) / 
                      Math.max(processedDocuments.filter(doc => doc.success).length, 1)
                    )}%
                  </div>
                  <div className={styles.statLabel}>Confiança Média</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    R$ {processedDocuments
                      .reduce((sum, doc) => sum + doc.summary.totalIncome + doc.summary.totalExpenses, 0)
                      .toFixed(2)
                      .replace('.', ',')}
                  </div>
                  <div className={styles.statLabel}>Volume Total</div>
                </div>
              </div>
            </div>
          )}

          {/* Tutorial e Informações */}
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🚀</div>
                <h4>Como Usar</h4>
                <ol>
                  <li>Arraste ou selecione seus documentos</li>
                  <li>IA analisa automaticamente o conteúdo</li>
                  <li>Revise as transações detectadas</li>
                  <li>Crie transações ou baixe extrato</li>
                </ol>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📄</div>
                <h4>Tipos Suportados</h4>
                <ul>
                  <li>📄 <strong>PDF:</strong> Extratos, comprovantes</li>
                  <li>📊 <strong>Excel:</strong> Planilhas de controle</li>
                  <li>📝 <strong>TXT:</strong> Arquivos de texto</li>
                  <li>📋 <strong>CSV:</strong> Dados exportados</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🤖</div>
                <h4>Tecnologia IA</h4>
                <ul>
                  <li>🧠 <strong>GPT-4o Mini:</strong> Análise inteligente</li>
                  <li>🔍 <strong>OCR:</strong> Extração de texto</li>
                  <li>📊 <strong>Classificação:</strong> Categorias automáticas</li>
                  <li>📈 <strong>Análise:</strong> Padrões financeiros</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>⚡</div>
                <h4>Recursos Avançados</h4>
                <ul>
                  <li>📱 <strong>Múltiplos Arquivos:</strong> Processamento em lote</li>
                  <li>🎯 <strong>Alta Precisão:</strong> IA treinada</li>
                  <li>📄 <strong>PDF Geração:</strong> Extratos profissionais</li>
                  <li>🔒 <strong>Seguro:</strong> Dados protegidos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
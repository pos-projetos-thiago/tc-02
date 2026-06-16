/**
 * Componente Inteligente de Upload de Documentos
 * Aceita PDF, Excel, TXT e outros formatos
 * Usa IA para análise automática
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useIntelligentDocumentProcessor } from '@/hooks/useIntelligentDocumentProcessor';
import { DocumentAnalysisResult } from '@/lib/ai/document-processor';
import styles from './IntelligentDocumentUploader.module.scss';

interface IntelligentDocumentUploaderProps {
  onDocumentProcessed?: (result: DocumentAnalysisResult) => void;
  onError?: (error: string) => void;
  onTransactionCreated?: (transactions: any[]) => void;
  multiple?: boolean;
  userName?: string;
  className?: string;
}

export function IntelligentDocumentUploader({
  onDocumentProcessed,
  onError,
  onTransactionCreated,
  multiple = false,
  userName = 'Usuário',
  className = ''
}: IntelligentDocumentUploaderProps) {
  const {
    processingState,
    results,
    error,
    processDocument,
    processMultipleDocuments,
    downloadExtract,
    previewExtract,
    clearResults,
    reset
  } = useIntelligentDocumentProcessor();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manipula o drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Manipula o drop de arquivos
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  // Manipula seleção de arquivos via input
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.log('📁 Arquivos selecionados via input:', files.map(f => f.name));
      handleFiles(files);
      
      // Limpar o input para permitir seleção do mesmo arquivo novamente
      e.target.value = '';
    }
  }, [handleFiles]);

  // Processa os arquivos selecionados
  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    console.log('🔧 Iniciando processamento de', files.length, 'arquivo(s)');

    try {
      if (multiple && files.length > 1) {
        console.log('📁 Processamento múltiplo');
        const results = await processMultipleDocuments(files);
        
        results.forEach((result, index) => {
          console.log(`📄 Resultado ${index + 1}:`, result);
          if (result.success && onDocumentProcessed) {
            onDocumentProcessed(result);
          } else if (!result.success && onError) {
            onError(result.error || 'Erro ao processar documento');
          }
        });

      } else {
        console.log('📄 Processamento único:', files[0].name);
        const file = files[0];
        const result = await processDocument(file);
        
        console.log('✅ Resultado:', result);
        
        if (result.success && onDocumentProcessed) {
          onDocumentProcessed(result);
        } else if (!result.success && onError) {
          onError(result.error || 'Erro ao processar documento');
        }
      }

    } catch (error) {
      console.error('💥 Erro no processamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [multiple, processDocument, processMultipleDocuments, onDocumentProcessed, onError]);

  // Abre o seletor de arquivos
  const openFileSelector = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (processingState.isProcessing) {
      return; // Não abrir se estiver processando
    }
    
    // Reset do input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [processingState.isProcessing]);

  // Cria transações a partir do resultado
  const createTransactions = useCallback(async (result: DocumentAnalysisResult) => {
    console.log('💰 Iniciando criação de transações:', result);
    
    if (!result.success || result.transactions.length === 0) {
      console.error('❌ Nenhuma transação válida para criar');
      if (onError) onError('Nenhuma transação encontrada para criar');
      return;
    }

    try {
      // Converter transações para o formato do sistema
      const systemTransactions = result.transactions.map(t => {
        console.log('🔄 Convertendo transação:', t);
        
        // Converter data
        let transactionDate = new Date();
        try {
          // Se a data está em formato dd/mm/yyyy
          if (t.date.includes('/')) {
            const [day, month, year] = t.date.split('/');
            transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          }
        } catch (error) {
          console.log('⚠️ Erro na conversão de data, usando hoje:', error);
          transactionDate = new Date();
        }

        return {
          type: t.type === 'income' ? 'deposit' : 
                t.type === 'expense' ? 'withdrawal' : 'transfer',
          amount: t.amount,
          description: t.description,
          date: transactionDate,
          category: t.category || 'outros'
        };
      });

      console.log('📊 Transações convertidas:', systemTransactions);

      if (onTransactionCreated) {
        console.log('🚀 Chamando onTransactionCreated...');
        onTransactionCreated(systemTransactions);
      } else {
        console.error('❌ onTransactionCreated não está definido');
        if (onError) onError('Erro: callback não configurado');
      }
    } catch (error) {
      console.error('💥 Erro ao criar transações:', error);
      if (onError) onError('Erro ao criar transações no sistema');
    }
  }, [onTransactionCreated, onError]);

  // Render das diferentes etapas de processamento
  const renderProcessingState = () => {
    if (!processingState.isProcessing) return null;

    const getStageText = (stage: string) => {
      switch (stage) {
        case 'uploading': return '📤 Carregando arquivo...';
        case 'extracting': return '📄 Extraindo conteúdo...';
        case 'analyzing': return '🤖 Analisando com IA...';
        case 'complete': return '✅ Processamento concluído!';
        default: return '⏳ Processando...';
      }
    };

    return (
      <div className={styles.processingState}>
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar}
            style={{ width: `${processingState.progress}%` }}
          ></div>
        </div>
        <p className={styles.stageText}>{getStageText(processingState.stage)}</p>
        {processingState.currentFile && (
          <p className={styles.currentFile}>Arquivo: {processingState.currentFile}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.intelligentUploader} ${className}`}>
      {/* Área de Drop */}
      <div
        className={`${styles.dropZone} ${dragActive ? styles.active : ''} ${processingState.isProcessing ? styles.processing : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          multiple={multiple}
          accept=".pdf,.txt,.csv,.xlsx,.xls"
          onChange={handleChange}
        />

        {processingState.isProcessing ? (
          renderProcessingState()
        ) : (
          <div className={styles.uploadState}>
            <div className={styles.uploadIcon}>🤖</div>
            <h3>
              {multiple 
                ? 'Arraste documentos aqui ou clique para selecionar'
                : 'Arraste um documento aqui ou clique para selecionar'
              }
            </h3>
            <p className={styles.hint}>
              📄 PDF • 📊 Excel • 📝 TXT • 📋 CSV
            </p>
            <p className={styles.aiHint}>
              ✨ IA analisa automaticamente e extrai dados financeiros
            </p>
            <div className={styles.features}>
              <span>🔍 Detecção automática</span>
              <span>💰 Extração de transações</span>
              <span>📊 Geração de extrato</span>
            </div>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h4>🎯 Documentos Processados</h4>
            <button onClick={clearResults} className={styles.clearButton}>
              Limpar
            </button>
          </div>

          {results.map((result, index) => (
            <div
              key={index}
              className={`${styles.resultItem} ${result.success ? styles.success : styles.error}`}
            >
              {result.success ? (
                <>
                  <div className={styles.resultHeader}>
                    <div className={styles.documentInfo}>
                      <span className={styles.documentType}>
                        {getDocumentTypeIcon(result.documentType)} {getDocumentTypeText(result.documentType)}
                      </span>
                      <span className={styles.confidence}>
                        Confiança: {result.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className={styles.summary}>
                    <div className={styles.summaryStats}>
                      <div className={styles.stat}>
                        <span className={styles.label}>Transações:</span>
                        <span className={styles.value}>{result.summary.totalTransactions}</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.label}>Entradas:</span>
                        <span className={styles.value + ' ' + styles.income}>
                          R$ {result.summary.totalIncome.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.label}>Saídas:</span>
                        <span className={styles.value + ' ' + styles.expense}>
                          R$ {result.summary.totalExpenses.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {result.summary.mainCategories.length > 0 && (
                      <div className={styles.categories}>
                        <span className={styles.label}>Categorias:</span>
                        <div className={styles.categoryTags}>
                          {result.summary.mainCategories.slice(0, 3).map((category, i) => (
                            <span key={i} className={styles.categoryTag}>
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <button
                      onClick={() => createTransactions(result)}
                      className={styles.actionButton + ' ' + styles.primary}
                      disabled={result.transactions.length === 0}
                    >
                      💰 Criar {result.transactions.length} Transações
                    </button>
                    <button
                      onClick={() => previewExtract(result, userName)}
                      className={styles.actionButton + ' ' + styles.secondary}
                    >
                      👁️ Preview PDF
                    </button>
                    <button
                      onClick={() => downloadExtract(result, userName)}
                      className={styles.actionButton + ' ' + styles.secondary}
                    >
                      📥 Baixar Extrato
                    </button>
                  </div>

                  {/* Lista de transações (resumida) */}
                  {result.transactions.length > 0 && (
                    <details className={styles.transactionsList}>
                      <summary>Ver {result.transactions.length} transações encontradas</summary>
                      <div className={styles.transactions}>
                        {result.transactions.slice(0, 5).map((transaction, i) => (
                          <div key={i} className={styles.transaction}>
                            <span className={styles.transactionDate}>{transaction.date}</span>
                            <span className={styles.transactionDesc}>{transaction.description}</span>
                            <span className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                              {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                        {result.transactions.length > 5 && (
                          <div className={styles.moreTransactions}>
                            +{result.transactions.length - 5} transações...
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </>
              ) : (
                <div className={styles.errorResult}>
                  <span className={styles.errorIcon}>❌</span>
                  <span className={styles.errorMessage}>{result.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Funções auxiliares
function getDocumentTypeIcon(type: string): string {
  switch (type) {
    case 'extract': return '🏦';
    case 'receipt': return '🧾';
    case 'invoice': return '📄';
    case 'statement': return '📊';
    case 'spreadsheet': return '📋';
    default: return '📄';
  }
}

function getDocumentTypeText(type: string): string {
  switch (type) {
    case 'extract': return 'Extrato Bancário';
    case 'receipt': return 'Recibo/Comprovante';
    case 'invoice': return 'Fatura';
    case 'statement': return 'Demonstrativo';
    case 'spreadsheet': return 'Planilha';
    default: return 'Documento';
  }
}

export default IntelligentDocumentUploader;
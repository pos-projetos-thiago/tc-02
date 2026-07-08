'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useIntelligentDocumentProcessor } from '../../../hooks/useIntelligentDocumentProcessor';
import { useToast } from '../../../hooks/useToast';
import { Toast } from '../../atoms/Toast';
import { Button } from '../../atoms/Button';
import { DocumentAnalysisResult } from '../../../lib/ai/document-processor';
import { useDashboard } from '../../../contexts/DashboardContextJWT';
import styles from './IntelligentDocumentUploader.module.scss';

interface IntelligentDocumentUploaderProps {
  onDocumentProcessed?: (result: DocumentAnalysisResult) => void;
  onError?: (error: string) => void;
  onTransactionCreated?: (transactions: unknown[]) => void;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
    processDocument,
    processMultipleDocuments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    downloadExtract,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previewExtract,
    clearResults,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset
  } = useIntelligentDocumentProcessor();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { balance } = useDashboard(); // Obter saldo atual

  // Processa os arquivos selecionados
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    console.log('Iniciando processamento de', files.length, 'arquivo(s)');

    try {
      if (multiple && files.length > 1) {
        console.log('Processamento múltiplo');
        const results = await processMultipleDocuments(files);
        
        results.forEach((result, index) => {
          console.log(`Resultado ${index + 1}:`, result);
          if (result.success && onDocumentProcessed) {
            onDocumentProcessed(result);
            showSuccess(`Documento processado! ${result.transactions.length} transações encontradas.`);
          } else if (!result.success) {
            const errorMsg = result.error || 'Erro ao processar documento';
            showError(errorMsg);
            if (onError) onError(errorMsg);
          }
        });

      } else {
        console.log('Processamento único:', files[0].name);
        const file = files[0];
        const result = await processDocument(file);
        
        console.log('Resultado:', result);
        
        if (result.success && onDocumentProcessed) {
          onDocumentProcessed(result);
          showSuccess(`Documento processado! ${result.transactions.length} transações encontradas.`);
        } else if (!result.success) {
          const errorMsg = result.error || 'Erro ao processar documento';
          showError(errorMsg);
          if (onError) onError(errorMsg);
        }
      }

    } catch (error) {
      console.error('Erro no processamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [multiple, processDocument, processMultipleDocuments, onDocumentProcessed, onError, showError, showSuccess]);

  // Manipula o drag over/leave
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
      processFiles(files);
    }
  }, [processFiles]);

  // Manipula seleção de arquivos via input
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.log('Arquivos selecionados via input:', files.map(f => f.name));
      processFiles(files);
      
      // Limpar o input para permitir seleção do mesmo arquivo novamente
      e.target.value = '';
    }
  }, [processFiles]);

  // Abre o seletor de arquivos
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openFileSelector = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (processingState.isProcessing) {
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [processingState.isProcessing]);

  // Cria transações a partir do resultado
  const createTransactions = useCallback(async (result: DocumentAnalysisResult) => {
    console.log('Iniciando criação de transações:', result);
    
    if (!result.success || result.transactions.length === 0) {
      console.error('Nenhuma transação válida para criar');
      showError('Nenhuma transação encontrada para criar');
      if (onError) onError('Nenhuma transação encontrada para criar');
      return;
    }

    try {
      // Converter transações para o formato do sistema
      const systemTransactions = result.transactions.map(t => {
        console.log('Convertendo transação:', t);
        
        // Converter data
        let transactionDate = new Date();
        try {
          if (t.date.includes('/')) {
            const [day, month, year] = t.date.split('/');
            transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          }
        } catch (error) {
          console.log('Erro na conversão de data, usando hoje:', error);
          transactionDate = new Date();
        }

        let mappedType = 'transfer';
        
        if (t.category === 'investment') {
          const investmentType = (t as { investmentType?: string }).investmentType;
          if (investmentType === 'Bolsa') mappedType = 'investment-bolsa';
          else if (investmentType === 'Renda Fixa' || investmentType === 'Tesouro') mappedType = 'investment-tesouro-direto';
          else if (investmentType === 'Fundos') mappedType = 'investment-fundos';
          else if (investmentType === 'Previdencia' || investmentType === 'Previdência') mappedType = 'investment-previdencia';
          else mappedType = 'investment';
        } else if (t.type === 'income') {
          mappedType = 'deposit';
        } else if (t.type === 'expense') {
          mappedType = 'withdrawal';
        }

        return {
          type: mappedType,
          amount: t.amount,
          description: t.description,
          date: transactionDate,
          category: t.category || 'outros'
        };
      });

      console.log('Transações convertidas:', systemTransactions);

      if (onTransactionCreated) {
        console.log('Chamando onTransactionCreated...');
        onTransactionCreated(systemTransactions);
        showSuccess(`${systemTransactions.length} transações criadas com sucesso!`);
      } else {
        console.error('onTransactionCreated não está definido');
        const errorMsg = 'Erro: callback não configurado';
        showError(errorMsg);
        if (onError) onError(errorMsg);
      }
    } catch (error) {
      console.error('Erro ao criar transações:', error);
      const errorMsg = 'Erro ao criar transações no sistema';
      showError(errorMsg);
      if (onError) onError(errorMsg);
    }
  }, [onTransactionCreated, onError, showError, showSuccess]);

  // Função para baixar PDF com saldo atual
  const downloadExtractWithBalance = useCallback(async (result: DocumentAnalysisResult) => {
    try {
      console.log('Saldo atual do usuário:', balance);
      
      const { generateExtractPDF, downloadPDF } = await import('../../../lib/pdf/extract-generator');
      
      const pdfOptions = {
        userName,
        currentBalance: balance,
        period: {
          start: result.summary.dateRange.start || new Date().toLocaleDateString('pt-BR'),
          end: result.summary.dateRange.end || new Date().toLocaleDateString('pt-BR')
        },
        transactions: result.transactions,
        summary: result.summary,
        includeLogo: true,
        theme: 'light' as const
      };
      
      console.log('Opções do PDF:', pdfOptions);

      const pdfBlob = await generateExtractPDF(pdfOptions);
      const fileName = `extrato-bytebank-${Date.now()}.pdf`;
      downloadPDF(pdfBlob, fileName);
      
      showSuccess('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showError('Erro ao gerar PDF');
    }
  }, [userName, balance, showSuccess, showError]);

  // Render das diferentes etapas de processamento
  const renderProcessingState = () => {
    if (!processingState.isProcessing) return null;

    const getStageText = (stage: string) => {
      switch (stage) {
        case 'uploading': return 'Carregando arquivo...';
        case 'extracting': return 'Extraindo conteúdo...';
        case 'analyzing': return 'Analisando com IA...';
        case 'complete': return 'Processamento concluído!';
        default: return 'Processando...';
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
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          multiple={multiple}
          accept=".pdf,.txt,.csv,.xlsx,.xls"
          onChange={handleChange}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />

        {processingState.isProcessing ? (
          renderProcessingState()
        ) : (
          <div className={styles.uploadState}>
            <div className={styles.uploadIcon}></div>
            <h3>
              {multiple 
                ? 'Arraste documentos aqui ou clique para selecionar'
                : 'Arraste um documento aqui ou clique para selecionar'
              }
            </h3>
            <p className={styles.hint}>
              PDF • Excel • TXT • CSV
            </p>
            <p className={styles.aiHint}>
              Análise automática e extração de dados financeiros
            </p>
          </div>
        )}
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h4>Documentos Processados</h4>
            <button onClick={clearResults} className={styles.clearButton}>
              Limpar
            </button>
          </div>

          {results.map((result, index) => (
            <div key={index} className={styles.resultItem}>
              {result.success ? (
                <div className={styles.resultContent}>
                  <div className={styles.resultInfo}>
                    <span className={styles.documentType}>
                      {getDocumentTypeText(result.documentType)} - {result.summary.totalTransactions} transações
                    </span>
                  </div>
                  
                  <div className={styles.actions}>
                    <Button
                      onClick={() => createTransactions(result)}
                      variant="primary"
                      disabled={result.transactions.length === 0}
                    >
                      Criar Transações
                    </Button>
                    <Button
                      onClick={() => downloadExtractWithBalance(result)}
                      variant="secondary"
                    >
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.errorResult}>
                  Erro: {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

// Funções auxiliares
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

/**
 * Hook React para Processamento Inteligente de Documentos
 * Combina upload, análise IA e geração de PDF
 */

import { useState, useCallback } from 'react';
import { 
  processFinancialDocument, 
  isDocumentSupported,
  DocumentAnalysisResult 
} from '@/lib/ai/document-processor';
import { 
  generateExtractPDF, 
  downloadPDF, 
  previewPDF,
  ExtractPDFOptions 
} from '@/lib/pdf/extract-generator';

interface ProcessingState {
  isProcessing: boolean;
  stage: 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'complete' | 'error';
  progress: number;
  currentFile?: string;
}

interface UseIntelligentDocumentProcessorReturn {
  // Estado
  processingState: ProcessingState;
  results: DocumentAnalysisResult[];
  error: string | null;
  
  // Ações
  processDocument: (file: File) => Promise<DocumentAnalysisResult>;
  processMultipleDocuments: (files: File[]) => Promise<DocumentAnalysisResult[]>;
  generatePDF: (result: DocumentAnalysisResult, userName: string) => Promise<void>;
  downloadExtract: (result: DocumentAnalysisResult, userName: string) => Promise<void>;
  previewExtract: (result: DocumentAnalysisResult, userName: string) => Promise<void>;
  clearResults: () => void;
  reset: () => void;
}

export function useIntelligentDocumentProcessor(): UseIntelligentDocumentProcessorReturn {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    progress: 0
  });

  const [results, setResults] = useState<DocumentAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Processa um único documento
   */
  const processDocument = useCallback(async (file: File): Promise<DocumentAnalysisResult> => {
    console.log('🚀 Hook: Iniciando processamento do arquivo:', file.name);
    
    setError(null);
    setProcessingState({
      isProcessing: true,
      stage: 'uploading',
      progress: 10,
      currentFile: file.name
    });

    try {
      // Validar arquivo
      console.log('🔍 Hook: Validando arquivo...');
      const validation = isDocumentSupported(file);
      if (!validation.supported) {
        throw new Error(validation.reason || 'Arquivo não suportado');
      }
      console.log('✅ Hook: Arquivo válido');

      // Extração de texto
      setProcessingState(prev => ({
        ...prev,
        stage: 'extracting',
        progress: 30
      }));

      // Análise com IA
      console.log('🤖 Hook: Chamando processFinancialDocument...');
      setProcessingState(prev => ({
        ...prev,
        stage: 'analyzing',
        progress: 60
      }));

      const result = await processFinancialDocument(file);
      console.log('📊 Hook: Resultado recebido:', result);

      // Completado
      setProcessingState(prev => ({
        ...prev,
        stage: 'complete',
        progress: 100
      }));

      // Adicionar aos resultados
      setResults(prev => [result, ...prev]);

      // Resetar estado após um tempo
      setTimeout(() => {
        setProcessingState({
          isProcessing: false,
          stage: 'idle',
          progress: 0
        });
      }, 2000);

      return result;

    } catch (err) {
      console.error('💥 Hook: Erro durante processamento:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      setProcessingState({
        isProcessing: false,
        stage: 'error',
        progress: 0
      });

      const errorResult: DocumentAnalysisResult = {
        success: false,
        documentType: 'unknown',
        confidence: 0,
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalIncome: 0,
          totalExpenses: 0,
          dateRange: {},
          mainCategories: []
        },
        error: errorMessage
      };

      return errorResult;
    }
  }, []);

  /**
   * Processa múltiplos documentos
   */
  const processMultipleDocuments = useCallback(async (files: File[]): Promise<DocumentAnalysisResult[]> => {
    const results: DocumentAnalysisResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      setProcessingState({
        isProcessing: true,
        stage: 'analyzing',
        progress: Math.round((i / files.length) * 100),
        currentFile: file.name
      });

      const result = await processDocument(file);
      results.push(result);
    }

    setProcessingState({
      isProcessing: false,
      stage: 'complete',
      progress: 100
    });

    return results;
  }, [processDocument]);

  /**
   * Gera PDF do extrato
   */
  const generatePDF = useCallback(async (
    result: DocumentAnalysisResult, 
    userName: string
  ): Promise<Blob> => {
    if (!result.success || result.transactions.length === 0) {
      throw new Error('Não há dados suficientes para gerar o PDF');
    }

    const dateRange = result.summary.dateRange;
    const startDate = dateRange.start || new Date().toLocaleDateString('pt-BR');
    const endDate = dateRange.end || startDate;

    const pdfOptions: ExtractPDFOptions = {
      userName,
      period: {
        start: startDate,
        end: endDate
      },
      transactions: result.transactions,
      summary: result.summary,
      includeLogo: true,
      theme: 'light'
    };

    return await generateExtractPDF(pdfOptions);
  }, []);

  /**
   * Baixa o PDF do extrato
   */
  const downloadExtract = useCallback(async (
    result: DocumentAnalysisResult, 
    userName: string
  ): Promise<void> => {
    try {
      const pdfBlob = await generatePDF(result, userName);
      const fileName = `extrato-bytebank-${Date.now()}.pdf`;
      downloadPDF(pdfBlob, fileName);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      throw error;
    }
  }, [generatePDF]);

  /**
   * Abre preview do PDF
   */
  const previewExtract = useCallback(async (
    result: DocumentAnalysisResult, 
    userName: string
  ): Promise<void> => {
    try {
      const pdfBlob = await generatePDF(result, userName);
      previewPDF(pdfBlob);
    } catch (error) {
      console.error('Erro ao abrir preview:', error);
      throw error;
    }
  }, [generatePDF]);

  /**
   * Limpa apenas os resultados
   */
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  /**
   * Reset completo
   */
  const reset = useCallback(() => {
    setProcessingState({
      isProcessing: false,
      stage: 'idle',
      progress: 0
    });
    setResults([]);
    setError(null);
  }, []);

  return {
    processingState,
    results,
    error,
    processDocument,
    processMultipleDocuments,
    generatePDF,
    downloadExtract,
    previewExtract,
    clearResults,
    reset
  };
}

/**
 * Hook simplificado para uso básico
 */
export function useDocumentProcessor() {
  const { 
    processDocument, 
    processingState, 
    error 
  } = useIntelligentDocumentProcessor();

  const processFile = useCallback(async (file: File) => {
    const result = await processDocument(file);
    return result.success ? result.transactions : null;
  }, [processDocument]);

  return {
    processFile,
    isProcessing: processingState.isProcessing,
    stage: processingState.stage,
    error
  };
}
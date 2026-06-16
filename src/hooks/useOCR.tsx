/**
 * Hook React para OCR com Hugging Face
 * Facilita o uso da funcionalidade de OCR nos componentes
 */

import { useState, useCallback } from 'react';

interface OCRResult {
  success: boolean;
  text: string;
  error?: string;
}

interface UseOCRState {
  isProcessing: boolean;
  result: OCRResult | null;
  error: string | null;
}

interface UseOCRReturn extends UseOCRState {
  extractText: (file: File, isDocument?: boolean) => Promise<OCRResult>;
  extractTextFromMultiple: (files: File[]) => Promise<OCRResult[]>;
  clearResult: () => void;
  reset: () => void;
}

/**
 * Hook para funcionalidade de OCR
 */
export function useOCR(): UseOCRReturn {
  const [state, setState] = useState<UseOCRState>({
    isProcessing: false,
    result: null,
    error: null,
  });

  /**
   * Extrai texto de uma única imagem
   */
  const extractText = useCallback(async (file: File, isDocument: boolean = false): Promise<OCRResult> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      result: null
    }));

    try {
      // Chama a API route para OCR
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isDocument', isDocument.toString());

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result: OCRResult = await response.json();
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        result,
        error: result.success ? null : result.error || 'Erro no OCR'
      }));

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
        result: {
          success: false,
          text: '',
          error: errorMessage
        }
      }));

      return {
        success: false,
        text: '',
        error: errorMessage
      };
    }
  }, []);

  /**
   * Extrai texto de múltiplas imagens
   */
  const extractTextFromMultiple = useCallback(async (files: File[]): Promise<OCRResult[]> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      result: null
    }));

    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      formData.append('fileCount', files.length.toString());

      const response = await fetch('/api/ocr/multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const results: OCRResult[] = await response.json();
      
      // Se houver algum erro, marca como erro geral
      const hasError = results.some(r => !r.success);
      const firstError = results.find(r => !r.success)?.error;
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: hasError ? firstError || 'Erro em uma das imagens' : null,
        result: null // Para múltiplos arquivos, não definimos um resultado único
      }));

      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
        result: null
      }));

      return [{
        success: false,
        text: '',
        error: errorMessage
      }];
    }
  }, []);

  /**
   * Limpa apenas o resultado, mantendo o estado de carregamento
   */
  const clearResult = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null
    }));
  }, []);

  /**
   * Reseta completamente o estado
   */
  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    extractText,
    extractTextFromMultiple,
    clearResult,
    reset,
  };
}

/**
 * Hook simplificado para uso básico de OCR
 */
export function useSimpleOCR() {
  const { extractText, isProcessing } = useOCR();

  const processImage = useCallback(async (file: File): Promise<string | null> => {
    const result = await extractText(file);
    return result.success ? result.text : null;
  }, [extractText]);

  return {
    processImage,
    isProcessing
  };
}

export type { OCRResult, UseOCRReturn, UseOCRState };
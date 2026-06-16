/**
 * Componente para upload e OCR de imagens
 * Permite arrastar arquivos, fazer upload e extrair texto
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useOCR } from '@/hooks/useOCR';
import styles from './OCRUploader.module.scss';

interface OCRUploaderProps {
  onTextExtracted?: (text: string, filename: string) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  acceptDocuments?: boolean;
  className?: string;
}

interface ProcessedFile {
  file: File;
  text: string;
  success: boolean;
  error?: string;
}

export function OCRUploader({
  onTextExtracted,
  onError,
  multiple = false,
  acceptDocuments = false,
  className = ''
}: OCRUploaderProps) {
  const { extractText, extractTextFromMultiple, isProcessing, reset } = useOCR();
  const [dragActive, setDragActive] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
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
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  // Processa os arquivos selecionados
  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Limpa resultados anteriores
    setProcessedFiles([]);
    reset();

    try {
      if (multiple && files.length > 1) {
        // Processa múltiplos arquivos
        const results = await extractTextFromMultiple(files);
        
        const processed: ProcessedFile[] = files.map((file, index) => ({
          file,
          text: results[index]?.text || '',
          success: results[index]?.success || false,
          error: results[index]?.error
        }));

        setProcessedFiles(processed);

        // Chama callbacks para cada arquivo processado
        processed.forEach((item) => {
          if (item.success && onTextExtracted) {
            onTextExtracted(item.text, item.file.name);
          } else if (!item.success && onError) {
            onError(item.error || 'Erro ao processar arquivo');
          }
        });

      } else {
        // Processa arquivo único
        const file = files[0];
        const result = await extractText(file, acceptDocuments);
        
        const processed: ProcessedFile = {
          file,
          text: result.text,
          success: result.success,
          error: result.error
        };

        setProcessedFiles([processed]);

        if (result.success && onTextExtracted) {
          onTextExtracted(result.text, file.name);
        } else if (!result.success && onError) {
          onError(result.error || 'Erro ao processar arquivo');
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [multiple, acceptDocuments, extractText, extractTextFromMultiple, onTextExtracted, onError, reset]);

  // Abre o seletor de arquivos
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Limpa os resultados
  const clearResults = () => {
    setProcessedFiles([]);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.ocrUploader} ${className}`}>
      {/* Área de Drop */}
      <div
        className={`${styles.dropZone} ${dragActive ? styles.active : ''} ${isProcessing ? styles.processing : ''}`}
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
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
        />

        {isProcessing ? (
          <div className={styles.processingState}>
            <div className={styles.spinner}></div>
            <p>🤖 Analisando imagem{multiple ? 's' : ''} com IA...</p>
            <p className={styles.hint}>Primeira vez pode levar até 60 segundos</p>
            <p className={styles.subHint}>Modelo carregando na nuvem...</p>
          </div>
        ) : (
          <div className={styles.uploadState}>
            <div className={styles.uploadIcon}>📄</div>
            <h3>
              {multiple 
                ? 'Arraste imagens aqui ou clique para selecionar'
                : 'Arraste uma imagem aqui ou clique para selecionar'
              }
            </h3>
            <p className={styles.hint}>
              Formatos suportados: JPEG, PNG, WebP (máx. 10MB)
            </p>
            {acceptDocuments && (
              <p className={styles.documentHint}>
                ✨ Modo documento ativo - melhor para textos impressos
              </p>
            )}
          </div>
        )}
      </div>

      {/* Resultados */}
      {processedFiles.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h4>Resultados do OCR</h4>
            <button onClick={clearResults} className={styles.clearButton}>
              Limpar
            </button>
          </div>

          {processedFiles.map((item, index) => (
            <div
              key={index}
              className={`${styles.resultItem} ${item.success ? styles.success : styles.error}`}
            >
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{item.file.name}</span>
                <span className={styles.fileSize}>
                  ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>

              {item.success ? (
                <div className={styles.textResult}>
                  <label>Texto extraído:</label>
                  <textarea
                    value={item.text}
                    readOnly
                    className={styles.textArea}
                    placeholder="Nenhum texto encontrado na imagem"
                  />
                  <div className={styles.textStats}>
                    {item.text.length} caracteres
                  </div>
                </div>
              ) : (
                <div className={styles.errorResult}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span className={styles.errorMessage}>{item.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OCRUploader;
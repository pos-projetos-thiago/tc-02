/**
 * Página de demonstração do OCR
 * Permite testar a funcionalidade de extração de texto de imagens
 */

'use client';

import React, { useState } from 'react';
import { OCRUploader } from '@/components/organisms/OCRUploader';
import styles from './ocr.module.scss';

export default function OCRPage() {
  const [extractedTexts, setExtractedTexts] = useState<Array<{ text: string; filename: string; timestamp: Date }>>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleTextExtracted = (text: string, filename: string) => {
    setExtractedTexts(prev => [
      ...prev,
      { text, filename, timestamp: new Date() }
    ]);
  };

  const handleError = (error: string) => {
    setErrors(prev => [...prev, error]);
    // Remove erro após 5 segundos
    setTimeout(() => {
      setErrors(prev => prev.slice(1));
    }, 5000);
  };

  const clearHistory = () => {
    setExtractedTexts([]);
    setErrors([]);
  };

  return (
    <div className={styles.ocrPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>ByteBank OCR</h1>
          <p>Extraia texto de documentos e imagens usando Inteligência Artificial</p>
        </header>

        {/* Errors */}
        {errors.length > 0 && (
          <div className={styles.errors}>
            {errors.map((error, index) => (
              <div key={index} className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            ))}
          </div>
        )}

        {/* OCR Uploaders */}
        <div className={styles.uploaders}>
          <section className={styles.uploaderSection}>
            <h2>📄 OCR Básico</h2>
            <p>Para imagens e fotos com texto</p>
            <OCRUploader
              onTextExtracted={handleTextExtracted}
              onError={handleError}
              className={styles.uploader}
            />
          </section>

          <section className={styles.uploaderSection}>
            <h2>📋 OCR para Documentos</h2>
            <p>Otimizado para documentos impressos e formulários</p>
            <OCRUploader
              onTextExtracted={handleTextExtracted}
              onError={handleError}
              acceptDocuments={true}
              className={styles.uploader}
            />
          </section>

          <section className={styles.uploaderSection}>
            <h2>📁 OCR Múltiplos Arquivos</h2>
            <p>Processe várias imagens de uma só vez</p>
            <OCRUploader
              onTextExtracted={handleTextExtracted}
              onError={handleError}
              multiple={true}
              className={styles.uploader}
            />
          </section>
        </div>

        {/* History */}
        {extractedTexts.length > 0 && (
          <section className={styles.history}>
            <div className={styles.historyHeader}>
              <h2>📝 Histórico de Extrações</h2>
              <button onClick={clearHistory} className={styles.clearHistoryButton}>
                Limpar Histórico
              </button>
            </div>

            <div className={styles.historyList}>
              {extractedTexts.map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.filename}>{item.filename}</span>
                    <span className={styles.timestamp}>
                      {item.timestamp.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className={styles.textContent}>
                    <textarea
                      value={item.text}
                      readOnly
                      className={styles.textArea}
                      placeholder="Nenhum texto foi extraído desta imagem"
                    />
                    <div className={styles.textStats}>
                      {item.text.length} caracteres • {item.text.split(/\s+/).filter(Boolean).length} palavras
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info */}
        <footer className={styles.info}>
          <div className={styles.infoCard}>
            <h3>Como usar</h3>
            <ul>
              <li>Arraste imagens para a área de upload ou clique para selecionar</li>
              <li>Formatos suportados: JPEG, PNG, WebP</li>
              <li>Tamanho máximo: 10MB por arquivo</li>
              <li>Para documentos, use o modo &quot;OCR para Documentos&quot;</li>
            </ul>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Tecnologia</h3>
            <ul>
              <li>🤖 Hugging Face API</li>
              <li>📋 Microsoft TrOCR</li>
              <li>⚡ Processamento em nuvem</li>
              <li>🔒 Dados seguros</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
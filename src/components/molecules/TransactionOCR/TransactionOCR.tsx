/**
 * Componente para OCR de comprovantes de transação
 * Integra o OCR com o sistema de transações do ByteBank
 */

'use client';

import React, { useState } from 'react';
import { OCRUploader } from '@/components/organisms/OCRUploader';
import { useSimpleOCR } from '@/hooks/useOCR';
import styles from './TransactionOCR.module.scss';

interface TransactionData {
  amount?: number;
  description?: string;
  date?: string;
  type?: 'income' | 'expense';
  merchant?: string;
}

interface TransactionOCRProps {
  onTransactionDetected?: (transaction: TransactionData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function TransactionOCR({
  onTransactionDetected,
  onError,
  className = ''
}: TransactionOCRProps) {
  const [detectedTransaction, setDetectedTransaction] = useState<TransactionData | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const { processImage } = useSimpleOCR();

  /**
   * Extrai dados da transação do texto OCR
   */
  const parseTransactionFromText = (text: string): TransactionData => {
    const transaction: TransactionData = {};

    // Regex patterns melhorados para extrair informações
    const patterns = {
      // Valores monetários mais precisos
      amount: /(?:R\$\s?|RS\s?)?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2}|\d+[.,]\d{2})/g,
      
      // Datas mais abrangentes
      date: /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})/g,
      
      // Tipos de transação mais específicos
      transactionType: /(pix|ted|doc|transferencia|compra|pagamento|debito|credito|deposito|saque|boleto|cartao)/gi,
      
      // Estabelecimentos expandidos
      merchant: /(mercado|farmacia|posto|gas|restaurante|loja|magazine|supermercado|shopping|bank|atm|ifood|uber|99|drogaria|padaria|acougue)/gi
    };

    // Extrai valor
    const amountMatches = text.match(patterns.amount);
    if (amountMatches) {
      // Pega o maior valor encontrado (provavelmente o valor principal)
      const amounts = amountMatches
        .map(amount => parseFloat(amount.replace(/[^\d,.-]/g, '').replace(',', '.')))
        .filter(num => !isNaN(num))
        .sort((a, b) => b - a);
      
      if (amounts.length > 0) {
        transaction.amount = amounts[0];
      }
    }

    // Extrai data
    const dateMatches = text.match(patterns.date);
    if (dateMatches) {
      transaction.date = dateMatches[0];
    }

    // Extrai tipo de transação
    const typeMatches = text.match(patterns.transactionType);
    if (typeMatches) {
      const type = typeMatches[0].toLowerCase();
      // Classifica como entrada ou saída baseado em palavras-chave
      if (['deposito', 'credito', 'transferencia recebida'].includes(type)) {
        transaction.type = 'income';
      } else {
        transaction.type = 'expense';
      }
    }

    // Extrai estabelecimento/descrição
    const merchantMatches = text.match(patterns.merchant);
    if (merchantMatches) {
      transaction.merchant = merchantMatches[0];
    }

    // Usa as primeiras palavras como descrição se não houver merchant
    if (!transaction.merchant) {
      const words = text.split(/\s+/).slice(0, 5).join(' ');
      transaction.description = words.length > 10 ? words : 'Transação via OCR';
    } else {
      transaction.description = `Compra - ${transaction.merchant}`;
    }

    return transaction;
  };

  const handleTextExtracted = (text: string) => {
    setRawText(text);
    
    if (!text.trim()) {
      if (onError) {
        onError('Nenhum texto foi encontrado no comprovante');
      }
      return;
    }

    try {
      const parsedTransaction = parseTransactionFromText(text);
      setDetectedTransaction(parsedTransaction);
      
      if (onTransactionDetected) {
        onTransactionDetected(parsedTransaction);
      }
    } catch (error) {
      console.error('Erro ao processar transação:', error);
      if (onError) {
        onError('Erro ao processar os dados da transação');
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageUpload = async (file: File) => {
    const text = await processImage(file);
    if (text) {
      handleTextExtracted(text);
    } else {
      if (onError) {
        onError('Não foi possível extrair texto do comprovante');
      }
    }
  };

  const clearTransaction = () => {
    setDetectedTransaction(null);
    setRawText('');
  };

  return (
    <div className={`${styles.transactionOCR} ${className}`}>
      <div className={styles.header}>
        <h3>📄 Upload de Comprovante</h3>
        <p>Escaneie automaticamente dados de comprovantes bancários</p>
      </div>

      <OCRUploader
        onTextExtracted={handleTextExtracted}
        onError={onError}
        acceptDocuments={true}
        className={styles.uploader}
      />

      {detectedTransaction && (
        <div className={styles.detectedTransaction}>
          <div className={styles.transactionHeader}>
            <h4>✨ Dados Detectados</h4>
            <button type="button" onClick={clearTransaction} className={styles.clearButton}>
              Limpar
            </button>
          </div>

          <div className={styles.transactionData}>
            {detectedTransaction.amount && (
              <div className={styles.dataItem}>
                <label>Valor:</label>
                <span className={styles.amount}>
                  R$ {detectedTransaction.amount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            )}

            {detectedTransaction.date && (
              <div className={styles.dataItem}>
                <label>Data:</label>
                <span>{detectedTransaction.date}</span>
              </div>
            )}

            {detectedTransaction.type && (
              <div className={styles.dataItem}>
                <label>Tipo:</label>
                <span className={`${styles.type} ${styles[detectedTransaction.type]}`}>
                  {detectedTransaction.type === 'income' ? 'Entrada' : 'Saída'}
                </span>
              </div>
            )}

            {detectedTransaction.description && (
              <div className={styles.dataItem}>
                <label>Descrição:</label>
                <span>{detectedTransaction.description}</span>
              </div>
            )}
          </div>

          {rawText && (
            <details className={styles.rawTextDetails}>
              <summary>Ver texto completo extraído</summary>
              <div className={styles.rawText}>
                <textarea
                  value={rawText}
                  readOnly
                  className={styles.rawTextArea}
                />
              </div>
            </details>
          )}
        </div>
      )}

      <div className={styles.tips}>
        <h5>💡 Dicas para melhores resultados:</h5>
        <ul>
          <li>Use imagens bem iluminadas e nítidas</li>
          <li>Certifique-se que o texto esteja legível</li>
          <li>Prefira comprovantes em formato PDF ou imagem escaneada</li>
          <li>Mantenha o documento na horizontal</li>
        </ul>
      </div>
    </div>
  );
}

export default TransactionOCR;
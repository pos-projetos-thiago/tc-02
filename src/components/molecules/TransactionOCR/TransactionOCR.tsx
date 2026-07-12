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
  type?: 'income' | 'expense' | 'transfer';
  merchant?: string;
  investmentType?: string;
  category?: string;
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
   * Extrai dados de transação de uma linha de texto.
   * Processa cada linha individualmente para suportar múltiplas transações
   * separadas por ";" ou quebra de linha.
   */
  const parseTransactionFromText = (text: string): TransactionData => {
    const today = new Date().toLocaleDateString('pt-BR');

    // Normaliza separadores e quebra em linhas individuais
    const lines = text
      .replace(/;/g, '\n')
      .replace(/\.\s+(?=[A-Z])/g, '\n')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Processa a primeira linha com valor monetário encontrada
    for (const line of lines) {
      const lower = line.toLowerCase();

      // Extrai valor monetário
      const amountMatch = line.match(/r?\$?\s*(\d{1,3}(?:[.,]\d{3})*[.,]\d{2}|\d+[.,]\d{2})/i);
      if (!amountMatch) continue;
      const amount = parseFloat(amountMatch[1].replace(/\./g, '').replace(',', '.'));
      if (isNaN(amount) || amount <= 0) continue;

      // Extrai data se houver
      const dateMatch = line.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
      const date = dateMatch ? dateMatch[1] : today;

      // Detecta investimento
      const isInvestment =
        lower.includes('invest') ||
        lower.includes('aplic') ||
        lower.includes('tesouro') ||
        lower.includes('previdência') ||
        lower.includes('previdencia') ||
        lower.includes('fundo') ||
        lower.includes('bolsa');

      if (isInvestment) {
        let investmentType = 'investment-bolsa';
        let description = 'Investimento';

        if (lower.includes('tesouro')) {
          investmentType = 'investment-tesouro-direto';
          description = 'Tesouro Direto';
        } else if (lower.includes('previdência') || lower.includes('previdencia')) {
          investmentType = 'investment-previdencia';
          description = 'Previdência Privada';
        } else if (lower.includes('fundo')) {
          investmentType = 'investment-fundos';
          description = 'Fundos de Investimento';
        } else if (lower.includes('bolsa')) {
          investmentType = 'investment-bolsa';
          description = 'Bolsa de Valores';
        }

        return { amount, date, type: 'expense', description, investmentType, category: 'investment' };
      }

      // Detecta depósito / saque / transferência
      if (lower.includes('deposit') || lower.includes('receb') || lower.includes('entrada')) {
        return { amount, date, type: 'income', description: 'Depósito' };
      }
      if (lower.includes('sac') || lower.includes('retir')) {
        return { amount, date, type: 'expense', description: 'Saque' };
      }
      if (lower.includes('transfer') || lower.includes('pix') || lower.includes('ted')) {
        return { amount, date, type: 'transfer', description: 'Transferência' };
      }
      if (lower.includes('pag') || lower.includes('compra') || lower.includes('débito')) {
        return { amount, date, type: 'expense', description: 'Pagamento' };
      }

      // Genérico
      return { amount, date, type: 'expense', description: line.slice(0, 50) };
    }

    return {};
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
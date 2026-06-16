/**
 * Gerador de PDF de Extrato Bancário
 * Cria PDFs profissionais a partir dos dados extraídos
 */

import jsPDF from 'jspdf';
import { FinancialTransaction, DocumentSummary } from '../ai/document-processor';

export interface ExtractPDFOptions {
  userName: string;
  accountNumber?: string;
  period: {
    start: string;
    end: string;
  };
  transactions: FinancialTransaction[];
  summary: DocumentSummary;
  includeLogo?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Gera PDF do extrato bancário
 */
export async function generateExtractPDF(
  options: ExtractPDFOptions
): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const usableWidth = pageWidth - (margin * 2);
  
  let currentY = margin;

  // Cores do tema ByteBank
  const colors = {
    primary: '#004D61',
    secondary: '#FF5031',
    text: '#333333',
    lightGray: '#F5F5F5',
    darkGray: '#666666'
  };

  try {
    // Configurar fonte
    pdf.setFont('helvetica');

    // CABEÇALHO
    currentY = addHeader(pdf, currentY, colors, options.userName, options.accountNumber);
    
    // PERÍODO
    currentY = addPeriod(pdf, currentY, colors, options.period);
    
    // RESUMO FINANCEIRO
    currentY = addSummary(pdf, currentY, colors, options.summary, usableWidth, margin);
    
    // LISTA DE TRANSAÇÕES
    currentY = addTransactionsList(pdf, currentY, colors, options.transactions, usableWidth, margin, pageHeight);
    
    // RODAPÉ
    addFooter(pdf, colors, pageHeight);

    // Retornar como Blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha na geração do PDF do extrato');
  }
}

/**
 * Adiciona cabeçalho profissional estilo banco
 */
function addHeader(
  pdf: jsPDF, 
  y: number, 
  colors: any, 
  userName: string, 
  accountNumber?: string
): number {
  const pageWidth = 210;
  
  // Background do cabeçalho
  pdf.setFillColor(0, 77, 97); // #004D61
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Logo ByteBank (estilo banco)
  pdf.setFontSize(32);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ByteBank', 20, y + 20);
  
  // Subtítulo moderno
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('EXTRATO BANCÁRIO', 20, y + 30);
  
  // Data/hora no canto direito
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  pdf.setFontSize(10);
  pdf.text(`${dateStr} às ${timeStr}`, 150, y + 15);
  pdf.text('Documento gerado digitalmente', 150, y + 25);
  
  y += 60;
  
  // Informações da conta (caixa cinza)
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, y, 170, 25, 'F');
  pdf.setDrawColor(226, 232, 240);
  pdf.rect(20, y, 170, 25, 'S');
  
  // Dados do cliente
  pdf.setFontSize(12);
  pdf.setTextColor(colors.text);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TITULAR DA CONTA', 25, y + 8);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(userName.toUpperCase(), 25, y + 15);
  
  // Número da conta
  const accountNum = accountNumber || `${Math.random().toString().slice(2,8)}-${Math.floor(Math.random() * 9)}`;
  pdf.text('CONTA CORRENTE', 120, y + 8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${accountNum.slice(0,4)}-${accountNum.slice(4)}`, 120, y + 15);
  
  // Agência
  pdf.setFont('helvetica', 'normal');
  pdf.text('AGÊNCIA 0001', 25, y + 20);
  
  return y + 35;
}

/**
 * Adiciona período do extrato
 */
function addPeriod(
  pdf: jsPDF, 
  y: number, 
  colors: any, 
  period: { start: string; end: string }
): number {
  pdf.setFontSize(12);
  pdf.setTextColor(colors.text);
  pdf.setFont('helvetica', 'bold');
  
  const periodText = `Período: ${period.start} a ${period.end}`;
  pdf.text(periodText, 20, y);
  
  // Linha separadora
  pdf.setDrawColor(colors.lightGray);
  pdf.setLineWidth(0.5);
  pdf.line(20, y + 5, 190, y + 5);
  
  return y + 15;
}

/**
 * Adiciona resumo financeiro estilo banco
 */
function addSummary(
  pdf: jsPDF, 
  y: number, 
  colors: any, 
  summary: DocumentSummary,
  usableWidth: number,
  margin: number
): number {
  // Título da seção
  pdf.setFontSize(14);
  pdf.setTextColor(colors.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMO DO PERÍODO', margin, y);
  
  y += 15;
  
  // Cards de resumo estilo dashboard
  const cardWidth = (usableWidth - 10) / 3;
  
  // Card 1: Entradas
  pdf.setFillColor(220, 252, 231); // Verde claro
  pdf.rect(margin, y, cardWidth, 25, 'F');
  pdf.setDrawColor(34, 197, 94); // Verde
  pdf.rect(margin, y, cardWidth, 25, 'S');
  
  pdf.setFontSize(10);
  pdf.setTextColor(21, 128, 61);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CRÉDITOS', margin + 5, y + 8);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`R$ ${summary.totalIncome.toFixed(2).replace('.', ',')}`, margin + 5, y + 18);
  
  // Card 2: Saídas
  const card2X = margin + cardWidth + 5;
  pdf.setFillColor(254, 242, 242); // Vermelho claro
  pdf.rect(card2X, y, cardWidth, 25, 'F');
  pdf.setDrawColor(239, 68, 68); // Vermelho
  pdf.rect(card2X, y, cardWidth, 25, 'S');
  
  pdf.setFontSize(10);
  pdf.setTextColor(153, 27, 27);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DÉBITOS', card2X + 5, y + 8);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`R$ ${summary.totalExpenses.toFixed(2).replace('.', ',')}`, card2X + 5, y + 18);
  
  // Card 3: Saldo
  const card3X = margin + (cardWidth + 5) * 2;
  const saldo = summary.totalIncome - summary.totalExpenses;
  const saldoPositivo = saldo >= 0;
  
  // Cores do card baseado no saldo
  if (saldoPositivo) {
    pdf.setFillColor(239, 246, 255); // Azul claro
    pdf.rect(card3X, y, cardWidth, 25, 'F');
    pdf.setDrawColor(59, 130, 246); // Azul
    pdf.rect(card3X, y, cardWidth, 25, 'S');
  } else {
    pdf.setFillColor(254, 242, 242); // Vermelho claro
    pdf.rect(card3X, y, cardWidth, 25, 'F');
    pdf.setDrawColor(239, 68, 68); // Vermelho
    pdf.rect(card3X, y, cardWidth, 25, 'S');
  }
  
  pdf.setFontSize(10);
  pdf.setTextColor(saldoPositivo ? 30 : 153, saldoPositivo ? 64 : 27, saldoPositivo ? 175 : 27);
  pdf.setFont('helvetica', 'normal');
  pdf.text('SALDO LÍQUIDO', card3X + 5, y + 8);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`R$ ${Math.abs(saldo).toFixed(2).replace('.', ',')}`, card3X + 5, y + 18);
  
  if (saldo < 0) {
    pdf.setFontSize(8);
    pdf.text('(NEGATIVO)', card3X + 5, y + 22);
  }
  
  // Info adicional
  y += 35;
  pdf.setFontSize(10);
  pdf.setTextColor(colors.darkGray);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${summary.totalTransactions} transações realizadas no período`, margin, y);
  
  return y + 15;
}

/**
 * Adiciona lista de transações estilo extrato bancário
 */
function addTransactionsList(
  pdf: jsPDF, 
  y: number, 
  colors: any, 
  transactions: FinancialTransaction[],
  usableWidth: number,
  margin: number,
  pageHeight: number
): number {
  // Título da seção
  pdf.setFontSize(14);
  pdf.setTextColor(colors.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXTRATO DE MOVIMENTAÇÃO', margin, y);
  
  y += 15;
  
  // Cabeçalho da tabela estilo banco
  pdf.setFillColor(248, 249, 250);
  pdf.rect(margin, y - 3, usableWidth, 12, 'F');
  pdf.setDrawColor(226, 232, 240);
  pdf.rect(margin, y - 3, usableWidth, 12, 'S');
  
  pdf.setFontSize(9);
  pdf.setTextColor(75, 85, 99);
  pdf.setFont('helvetica', 'bold');
  
  // Colunas otimizadas para extrato bancário
  pdf.text('DATA', margin + 5, y + 3);
  pdf.text('DESCRIÇÃO', margin + 35, y + 3);
  pdf.text('TIPO', margin + 110, y + 3);
  pdf.text('VALOR (R$)', margin + 135, y + 3);
  pdf.text('SALDO (R$)', margin + 165, y + 3);
  
  y += 12;
  
  // Calcular saldo acumulado
  let saldoAcumulado = 0;
  
  // Transações com estilo banco
  pdf.setFont('helvetica', 'normal');
  
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    
    // Verificar se precisa de nova página
    if (y > pageHeight - 50) {
      pdf.addPage();
      y = 30;
      
      // Recriar cabeçalho na nova página
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin, y - 3, usableWidth, 12, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(margin, y - 3, usableWidth, 12, 'S');
      
      pdf.setFontSize(9);
      pdf.setTextColor(75, 85, 99);
      pdf.setFont('helvetica', 'bold');
      
      pdf.text('DATA', margin + 5, y + 3);
      pdf.text('DESCRIÇÃO', margin + 35, y + 3);
      pdf.text('TIPO', margin + 110, y + 3);
      pdf.text('VALOR (R$)', margin + 135, y + 3);
      pdf.text('SALDO (R$)', margin + 165, y + 3);
      
      y += 12;
      pdf.setFont('helvetica', 'normal');
    }
    
    // Linha separadora sutil
    if (i > 0) {
      pdf.setDrawColor(240, 240, 240);
      pdf.line(margin, y - 2, margin + usableWidth, y - 2);
    }
    
    // Atualizar saldo
    if (transaction.type === 'income') {
      saldoAcumulado += transaction.amount;
    } else {
      saldoAcumulado -= transaction.amount;
    }
    
    pdf.setFontSize(9);
    pdf.setTextColor(51, 51, 51);
    
    // Data
    pdf.text(transaction.date, margin + 5, y + 5);
    
    // Descrição (formatada para extrato)
    let description = transaction.description.toUpperCase();
    if (description.length > 28) {
      description = description.substring(0, 25) + '...';
    }
    pdf.text(description, margin + 35, y + 5);
    
    // Tipo de operação
    let tipoOperacao = '';
    if (transaction.type === 'income') {
      tipoOperacao = 'CRÉD';
      pdf.setTextColor(21, 128, 61);
    } else {
      tipoOperacao = 'DÉB';
      pdf.setTextColor(153, 27, 27);
    }
    pdf.text(tipoOperacao, margin + 110, y + 5);
    
    // Valor
    const valorFormatado = transaction.amount.toFixed(2).replace('.', ',');
    pdf.text(valorFormatado, margin + 140, y + 5);
    
    // Saldo acumulado
    pdf.setTextColor(saldoAcumulado >= 0 ? 21 : 153, saldoAcumulado >= 0 ? 128 : 27, saldoAcumulado >= 0 ? 61 : 27);
    pdf.setFont('helvetica', 'bold');
    pdf.text(Math.abs(saldoAcumulado).toFixed(2).replace('.', ','), margin + 165, y + 5);
    
    // Indicador de saldo negativo
    if (saldoAcumulado < 0) {
      pdf.setFontSize(7);
      pdf.text('(-)' , margin + 160, y + 5);
    }
    
    // Reset cor e fonte
    pdf.setTextColor(51, 51, 51);
    pdf.setFont('helvetica', 'normal');
    
    y += 14; // Mais espaçamento entre linhas
  }
  
  // Se não há transações
  if (transactions.length === 0) {
    pdf.setFillColor(248, 249, 250);
    pdf.rect(margin, y, usableWidth, 20, 'F');
    
    pdf.setTextColor(colors.darkGray);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(11);
    pdf.text('Nenhuma movimentação encontrada no período selecionado.', margin + 10, y + 12);
    
    y += 25;
  }
  
  return y + 15;
}

/**
 * Adiciona rodapé profissional estilo banco
 */
function addFooter(pdf: jsPDF, colors: any, pageHeight: number): void {
  const pageCount = pdf.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const footerY = pageHeight - 25;
    
    // Background do rodapé
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, footerY - 5, 210, 25, 'F');
    
    // Linha superior
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(20, footerY - 5, 190, footerY - 5);
    
    // Informações do banco (esquerda)
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ByteBank S.A.', 20, footerY + 2);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('CNPJ: 12.345.678/0001-90 | SAC: 4004-0001', 20, footerY + 8);
    pdf.text('Av. Paulista, 1000 - São Paulo/SP | www.bytebank.com.br', 20, footerY + 14);
    
    // Data e hora de geração (centro)
    const now = new Date();
    const geracaoText = `Documento gerado em ${now.toLocaleString('pt-BR')}`;
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(geracaoText, 105 - (geracaoText.length * 1.2), footerY + 8);
    
    // Número da página (direita)
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Página ${i} de ${pageCount}`, 170, footerY + 2);
    
    // Código de autenticidade (simulado)
    const authCode = `DOC-${Date.now().toString().slice(-8)}`;
    pdf.setFontSize(7);
    pdf.text(`Código: ${authCode}`, 170, footerY + 8);
    
    // Selo de verificação digital
    pdf.setFontSize(6);
    pdf.setTextColor(21, 128, 61);
    pdf.text('✓ DOCUMENTO DIGITAL VÁLIDO', 170, footerY + 14);
  }
}

/**
 * Função utilitária para download do PDF
 */
export function downloadPDF(blob: Blob, fileName: string = 'extrato-bytebank.pdf'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Preview do PDF em nova aba
 */
export function previewPDF(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
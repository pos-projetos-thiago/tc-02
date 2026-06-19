/**
 * Gerador de PDF de Extrato Bancário
 * Cria PDFs profissionais a partir dos dados extraídos
 */

import jsPDF from 'jspdf';
import { FinancialTransaction, DocumentSummary } from '../ai/document-processor';

export interface ExtractPDFOptions {
  userName: string;
  accountNumber?: string;
  currentBalance?: number; // Saldo atual da conta (opcional)
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

  // Cores do tema ByteBank - versão profissional
  const colors = {
    primary: '#004D61',      // Azul principal
    text: '#000000',         // Preto para texto
    lightGray: '#F8F9FA',    // Cinza muito claro
    darkGray: '#6C757D',     // Cinza escuro
    success: '#28A745',      // Verde para valores positivos
    danger: '#DC3545'        // Vermelho para valores negativos
  };

  try {
    // Configurar fonte
    pdf.setFont('helvetica');

    // CABEÇALHO
    currentY = addHeader(pdf, currentY, colors, options.userName, options.accountNumber);
    
    // PERÍODO
    currentY = addPeriod(pdf, currentY, colors, options.period);
    
    // RESUMO FINANCEIRO
    currentY = addSummary(pdf, currentY, colors, options.summary, usableWidth, margin, options.currentBalance);
    
    // LISTA DE TRANSAÇÕES
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  colors: { primary: number[]; secondary: number[]; text: number[]; white: number[]; success: number[]; danger: number[] }, 
  userName: string, 
  accountNumber?: string
): number {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageWidth = 210;
  
  // Cabeçalho mais compacto e minimalista
  // Logo ByteBank
  pdf.setFontSize(28);
  pdf.setTextColor(0, 77, 97); // Azul ByteBank
  pdf.setFont('helvetica', 'bold');
  pdf.text('ByteBank', 20, y + 8);
  
  // Subtítulo
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0); // Preto
  pdf.text('EXTRATO BANCÁRIO', 20, y + 18);
  
  // Data/hora no canto direito - mais compacto
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  pdf.setFontSize(9);
  pdf.setTextColor(108, 117, 125); // Cinza escuro
  pdf.text(`${dateStr} às ${timeStr}`, 140, y + 8);
  pdf.text('Documento gerado digitalmente', 140, y + 16);
  
  y += 25; // Espaço reduzido
  
  // Linha separadora minimalista
  pdf.setDrawColor(0, 77, 97);
  pdf.setLineWidth(0.5);
  pdf.line(20, y, 190, y);
  
  y += 10;
  
  // Dados do cliente - layout horizontal minimalista
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Titular:', 20, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(userName.toUpperCase(), 45, y);
  
  // Número da conta - mais simples para projeto acadêmico
  const accountNum = accountNumber || 'CC-001';
  pdf.setFont('helvetica', 'bold');
  pdf.text('Conta:', 120, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(accountNum, 140, y);
  
  // Agência simplificada
  pdf.setFont('helvetica', 'bold');
  pdf.text('Agência:', 20, y + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ByteBank Digital', 52, y + 10);
  
  return y + 25;
}

/**
 * Adiciona período do extrato
 */
function addPeriod(
  pdf: jsPDF, 
  y: number, 
  colors: { primary: number[]; secondary: number[]; text: number[]; white: number[]; success: number[]; danger: number[] }, 
  period: { start: string; end: string }
): number {
  pdf.setFontSize(12);
  pdf.setTextColor(colors.text);
  pdf.setFont('helvetica', 'bold');
  
  // Garantir que as datas estejam ordenadas (início antes do fim)
  const startDate = new Date(period.start.split('/').reverse().join('-'));
  const endDate = new Date(period.end.split('/').reverse().join('-'));
  
  const earliestDate = startDate <= endDate ? period.start : period.end;
  const latestDate = startDate <= endDate ? period.end : period.start;
  
  const periodText = `Período: ${earliestDate} a ${latestDate}`;
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
  colors: { primary: number[]; secondary: number[]; text: number[]; white: number[]; success: number[]; danger: number[] }, 
  summary: DocumentSummary,
  usableWidth: number,
  margin: number,
  currentBalance?: number
): number {
  // Título da seção com melhor hierarquia
  pdf.setFontSize(13);
  pdf.setTextColor(0, 77, 97); // Azul ByteBank
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMO DO PERÍODO', margin, y);
  
  y += 18; // Mais espaço após título
  
  // Layout vertical mais legível
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Créditos
  pdf.setTextColor(0, 0, 0); // Preto
  pdf.text('Créditos:', margin, y);
  pdf.setTextColor(40, 167, 69); // Verde
  pdf.setFont('helvetica', 'bold');
  pdf.text(`R$ ${summary.totalIncome.toFixed(2).replace('.', ',')}`, margin + 55, y);
  
  y += 12; // Espaço entre linhas
  
  // Débitos
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Débitos:', margin, y);
  pdf.setTextColor(220, 53, 69); // Vermelho
  pdf.setFont('helvetica', 'bold');
  pdf.text(`R$ ${summary.totalExpenses.toFixed(2).replace('.', ',')}`, margin + 55, y);
  
  y += 12;
  
  // Linha separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y, margin + 100, y);
  
  y += 8;
  
  // Saldo do Período (baseado apenas nas transações deste extrato)
  const saldoPeriodo = summary.totalIncome - summary.totalExpenses;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Saldo do Período:', margin, y);
  
  pdf.setTextColor(saldoPeriodo >= 0 ? 40 : 220, saldoPeriodo >= 0 ? 167 : 53, saldoPeriodo >= 0 ? 69 : 69);
  pdf.text(`R$ ${Math.abs(saldoPeriodo).toFixed(2).replace('.', ',')}${saldoPeriodo < 0 ? ' (negativo)' : ''}`, margin + 85, y);
  
  // Saldo Atual da Conta - SEMPRE mostrar para debug
  console.log('currentBalance recebido na função addSummary:', currentBalance); // Debug
  
  y += 15;
  
  // Linha separadora mais destacada
  pdf.setDrawColor(0, 77, 97);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, margin + 120, y);
  
  y += 12;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(0, 77, 97); // Azul ByteBank
  pdf.text('Saldo Atual da Conta:', margin, y);
  
  // Se não tiver saldo, mostrar um valor padrão para debug
  const saldoParaMostrar = currentBalance !== undefined && currentBalance !== null ? currentBalance : 1948.50;
  
  pdf.setTextColor(saldoParaMostrar >= 0 ? 40 : 220, saldoParaMostrar >= 0 ? 167 : 53, saldoParaMostrar >= 0 ? 69 : 69);
  pdf.text(`R$ ${Math.abs(saldoParaMostrar).toFixed(2).replace('.', ',')}${saldoParaMostrar < 0 ? ' (negativo)' : ''}`, margin + 105, y);
  
  // Nota explicativa
  y += 12;
  pdf.setFontSize(8);
  pdf.setTextColor(108, 117, 125);
  pdf.setFont('helvetica', 'italic');
  pdf.text('* Saldo do período calculado apenas para as transações neste extrato', margin, y);
  
  y += 15;
  
  // Info adicional
  pdf.setFontSize(9);
  pdf.setTextColor(108, 117, 125); // Cinza
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${summary.totalTransactions} transações realizadas no período`, margin, y);
  
  return y + 20;
}

/**
 * Adiciona lista de transações estilo extrato bancário
 */
function addTransactionsList(
  pdf: jsPDF, 
  y: number, 
  colors: { primary: number[]; secondary: number[]; text: number[]; white: number[]; success: number[]; danger: number[] }, 
  transactions: FinancialTransaction[],
  usableWidth: number,
  margin: number,
  pageHeight: number
): number {
  // Título da seção com melhor hierarquia
  pdf.setFontSize(13);
  pdf.setTextColor(0, 77, 97); // Azul ByteBank
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXTRATO DE MOVIMENTAÇÃO', margin, y);
  
  y += 18; // Mais espaço após título
  
  // Cabeçalho da tabela com fundo sutil
  pdf.setFillColor(248, 249, 250);
  pdf.rect(margin, y - 2, usableWidth, 12, 'F');
  
  pdf.setDrawColor(0, 77, 97);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y + 10, margin + usableWidth, y + 10);
  
  y += 6;
  
  pdf.setFontSize(10); // Texto maior para melhor legibilidade
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  
  // Colunas ajustadas para caber na página
  pdf.text('DATA', margin + 2, y);
  pdf.text('DESCRIÇÃO', margin + 28, y);
  pdf.text('TIPO', margin + 85, y);
  pdf.text('VALOR (R$)', margin + 110, y);
  pdf.text('SALDO (R$)', margin + 140, y);
  
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
      pdf.rect(margin, y - 2, usableWidth, 12, 'F');
      
      pdf.setDrawColor(0, 77, 97);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y + 10, margin + usableWidth, y + 10);
      
      y += 6;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      
      pdf.text('DATA', margin + 2, y);
      pdf.text('DESCRIÇÃO', margin + 28, y);
      pdf.text('TIPO', margin + 85, y);
      pdf.text('VALOR (R$)', margin + 110, y);
      pdf.text('SALDO (R$)', margin + 140, y);
      
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
    
    pdf.setFontSize(10); // Fonte maior para melhor legibilidade
    pdf.setTextColor(0, 0, 0); // Preto puro
    
    // Data - com melhor posicionamento
    pdf.text(transaction.date, margin + 3, y + 7);
    
    // Descrição (formatada para extrato)
    let description = transaction.description.toUpperCase();
    if (description.length > 20) {
      description = description.substring(0, 17) + '...';
    }
    pdf.text(description, margin + 28, y + 7);
    
    // Tipo de operação
    let tipoOperacao = '';
    if (transaction.type === 'income') {
      tipoOperacao = 'CRÉD';
      pdf.setTextColor(40, 167, 69); // Verde discreto
    } else {
      tipoOperacao = 'DÉB';
      pdf.setTextColor(220, 53, 69); // Vermelho discreto
    }
    pdf.text(tipoOperacao, margin + 85, y + 7);
    
    // Valor
    const valorFormatado = transaction.amount.toFixed(2).replace('.', ',');
    pdf.setTextColor(0, 0, 0); // Preto
    pdf.text(valorFormatado, margin + 112, y + 7);
    
    // Saldo acumulado - melhor posicionado
    pdf.setTextColor(saldoAcumulado >= 0 ? 40 : 220, saldoAcumulado >= 0 ? 167 : 53, saldoAcumulado >= 0 ? 69 : 69);
    pdf.setFont('helvetica', 'bold');
    
    // Formatar saldo com indicador mais limpo
    const saldoFormatado = Math.abs(saldoAcumulado).toFixed(2).replace('.', ',');
    const saldoTexto = saldoAcumulado < 0 ? `(-) ${saldoFormatado}` : saldoFormatado;
    pdf.text(saldoTexto, margin + 142, y + 7);
    
    // Reset cor e fonte
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    y += 16; // Maior espaçamento entre linhas para melhor legibilidade
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
function addFooter(pdf: jsPDF, colors: { primary: number[]; secondary: number[]; text: number[]; white: number[]; success: number[]; danger: number[] }, pageHeight: number): void {
  const pageCount = pdf.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const footerY = pageHeight - 20;
    
    // Linha separadora minimalista
    pdf.setDrawColor(0, 77, 97);
    pdf.setLineWidth(0.5);
    pdf.line(20, footerY - 5, 190, footerY - 5);
    
    // Informações simplificadas para projeto acadêmico
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ByteBank - Projeto Acadêmico', 20, footerY);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(108, 117, 125); // Cinza
    pdf.text('Sistema de Gestão Financeira Pessoal', 20, footerY + 8);
    
    // Data e hora de geração (centralizada)
    const now = new Date();
    const geracaoText = `Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    pdf.setFontSize(7);
    pdf.setTextColor(108, 117, 125);
    const textWidth = pdf.getTextWidth(geracaoText);
    pdf.text(geracaoText, (210 - textWidth) / 2, footerY + 4);
    
    // Informações da página (direita) - simplificadas
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Página ${i} de ${pageCount}`, 160, footerY);
    
    // Identificação simples
    pdf.setFontSize(7);
    pdf.setTextColor(0, 77, 97); // Azul ByteBank
    pdf.text('EXTRATO DIGITAL', 160, footerY + 8);
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
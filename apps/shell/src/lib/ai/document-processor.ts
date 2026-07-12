/**
 * Sistema Inteligente de Processamento de Documentos Financeiros
 * Usa Vercel AI SDK para analisar automaticamente qualquer tipo de documento
 */

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import * as XLSX from 'xlsx';

// OpenRouter client — compatible with the OpenAI SDK, gives access to many models
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  headers: {
    'HTTP-Referer': 'https://bytebank.app',
    'X-Title': 'ByteBank',
  },
});

// Tipos para o sistema
export interface DocumentAnalysisResult {
  success: boolean;
  documentType: 'extract' | 'receipt' | 'invoice' | 'statement' | 'spreadsheet' | 'unknown';
  confidence: number;
  transactions: FinancialTransaction[];
  summary: DocumentSummary;
  rawText?: string;
  error?: string;
}

export interface FinancialTransaction {
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  category?: string;
  merchant?: string;
  investmentType?: string;
  confidence: number;
}

export interface DocumentSummary {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  dateRange: {
    start?: string;
    end?: string;
  };
  mainCategories: string[];
}

// Configuração da IA — Gemini como fallback via google SDK
const AI_PROVIDERS = {
  gemini: {
    model: google('gemini-1.5-flash'),
    name: 'Google Gemini Flash'
  },
};

/**
 * Processa qualquer tipo de documento financeiro
 */
export async function processFinancialDocument(
  file: File
): Promise<DocumentAnalysisResult> {
  try {
    console.log(`Processando documento: ${file.name} (${file.type})`);

    const extractedText = await extractTextFromFile(file);

    if (!extractedText || extractedText.length < 10) {
      return {
        success: false,
        documentType: 'unknown',
        confidence: 0,
        transactions: [],
        summary: createEmptySummary(),
        error: 'Não foi possível extrair texto significativo do documento'
      };
    }

    const analysis = await analyzeDocumentWithAI(extractedText, file.name);

    return {
      ...analysis,
      rawText: extractedText.substring(0, 1000)
    };

  } catch (error) {
    console.error('Erro ao processar documento:', error);
    return {
      success: false,
      documentType: 'unknown',
      confidence: 0,
      transactions: [],
      summary: createEmptySummary(),
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractFromPDF(file);
    }
    if (fileType.includes('spreadsheet') || fileType.includes('excel') ||
        fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      return await extractFromSpreadsheet(file);
    }
    return await extractFromText(file);
  } catch (error) {
    console.error('Erro na extração de texto:', error);
    throw new Error('Formato de arquivo não suportado ou corrompido');
  }
}

async function extractFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const pdfParseModule = await import('pdf-parse');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfParse = (pdfParseModule as any).default || pdfParseModule;
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractFromSpreadsheet(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  let extractedText = '';
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const csvText = XLSX.utils.sheet_to_csv(worksheet);
    extractedText += `\n=== ${sheetName} ===\n${csvText}\n`;
  });
  return extractedText;
}

async function extractFromText(file: File): Promise<string> {
  return await file.text();
}

/**
 * Analisa o documento usando IA (OpenRouter → Gemini → regex como último recurso)
 */
async function analyzeDocumentWithAI(
  text: string,
  fileName: string
): Promise<Omit<DocumentAnalysisResult, 'rawText'>> {

  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log('🤖 Tentando OpenRouter...');
      return await analyzeWithOpenRouter(text, fileName);
    } catch (error) {
      console.log('❌ OpenRouter falhou:', error instanceof Error ? error.message : String(error));
    }
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
      process.env.GOOGLE_GENERATIVE_AI_API_KEY !== 'coloque_sua_chave_gemini_aqui') {
    try {
      console.log('🤖 Tentando Google Gemini...');
      return await analyzeWithGemini(text, fileName);
    } catch (error) {
      console.log('❌ Gemini falhou:', error instanceof Error ? error.message : String(error));
    }
  }

  console.log('⚠️ Usando análise local (sem IA externa)');
  return await analyzeWithSimpleRegex(text, fileName);
}

async function analyzeWithOpenRouter(text: string, fileName: string) {
  const today = new Date().toLocaleDateString('pt-BR');
  const prompt = `Você é um assistente financeiro do ByteBank. Analise o texto abaixo e extraia transações financeiras.

TEXTO:
${text}

REGRAS OBRIGATÓRIAS:
1. Retorne APENAS JSON válido, sem texto extra, sem markdown, sem blocos de código.
2. Para o campo "type" use EXATAMENTE um destes valores:
   - "deposit"    → depósito, entrada de dinheiro, recebimento
   - "withdrawal" → saque, retirada, pagamento de conta
   - "transfer"   → transferência, PIX, TED, DOC
   - "investment" → qualquer tipo de investimento
3. Para o campo "investmentType" (obrigatório quando type=investment), use EXATAMENTE um destes valores:
   - "investment-tesouro-direto"  → Tesouro Direto, tesouro, renda fixa
   - "investment-previdencia"     → Previdência Privada, previdência, PGBL, VGBL
   - "investment-fundos"          → Fundos de Investimento, fundos, fundo
   - "investment-bolsa"           → Bolsa de Valores, ações, bolsa, renda variável
4. O campo "amount" deve ser sempre positivo.
5. Se não houver data explícita, use a data de hoje: ${today}.

FORMATO DE RESPOSTA:
{"transactions":[{"amount":50.00,"type":"investment","investmentType":"investment-tesouro-direto","description":"Investimento no Tesouro Direto","date":"${today}","confidence":95}]}`;

  const { text: aiResponse } = await generateText({
    model: openrouter('google/gemini-flash-1.5'),
    prompt,
    temperature: 0.1,
  });

  const clean = aiResponse.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const jsonStart = clean.indexOf('{');
  const jsonEnd = clean.lastIndexOf('}') + 1;
  if (jsonStart === -1 || jsonEnd === 0) throw new Error('Resposta não contém JSON válido');

  const parsed = JSON.parse(clean.substring(jsonStart, jsonEnd));
  const transactions: FinancialTransaction[] = (parsed.transactions ?? []).map(
    (t: { amount?: number; type?: string; investmentType?: string; description?: string; date?: string; confidence?: number }) => ({
      date: t.date ?? today,
      amount: Math.abs(t.amount ?? 0),
      type: (t.type === 'deposit' ? 'income' : t.type === 'investment' || t.type === 'withdrawal' ? 'expense' : 'transfer') as 'income' | 'expense' | 'transfer',
      description: t.description ?? 'Transação detectada pela IA',
      category: t.type === 'investment' ? 'investment' : t.type,
      investmentType: t.investmentType,
      confidence: t.confidence ?? 90,
    })
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return {
    success: transactions.length > 0,
    documentType: detectDocumentType(text, fileName),
    confidence: transactions.length > 0 ? 92 : 20,
    transactions,
    summary: {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpenses,
      dateRange: { start: today, end: today },
      mainCategories: [...new Set(transactions.map(t => t.category).filter(Boolean))] as string[],
    },
    error: transactions.length === 0 ? 'Nenhuma transação encontrada no texto' : undefined,
  };
}

async function analyzeWithGemini(text: string, fileName: string) {
  const prompt = `Analise este documento financeiro e extraia dados estruturados.
ARQUIVO: ${fileName}
TEXTO: ${text}
Retorne APENAS JSON válido com as transações encontradas.`;

  const result = await generateText({ model: AI_PROVIDERS.gemini.model, prompt, temperature: 0.1 });
  const cleanResponse = result.text.trim();
  const jsonStart = cleanResponse.indexOf('{');
  const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
  if (jsonStart === -1 || jsonEnd === 0) throw new Error('Resposta não contém JSON válido');

  const analysis = JSON.parse(cleanResponse.substring(jsonStart, jsonEnd));
  if (!analysis.transactions) analysis.transactions = [];
  if (!analysis.summary) analysis.summary = createEmptySummary();
  return analysis;
}

/**
 * Análise simples com regex — fallback quando não há chave de IA.
 * Processa cada linha individualmente.
 */
async function analyzeWithSimpleRegex(
  text: string,
  fileName: string
): Promise<Omit<DocumentAnalysisResult, 'rawText'>> {

  const transactions: FinancialTransaction[] = [];
  const today = new Date().toLocaleDateString('pt-BR');

  const lines = text
    .replace(/;/g, '\n')
    .replace(/\.\s+/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  for (const line of lines) {
    const lower = line.toLowerCase();

    const amountMatch = line.match(/r?\$?\s*(\d{1,3}(?:[.,]\d{3})*[.,]\d{2}|\d+[.,]\d{2})/i);
    if (!amountMatch) continue;
    const amount = parseFloat(amountMatch[1].replace(/\./g, '').replace(',', '.'));
    if (isNaN(amount) || amount <= 0) continue;

    const isInvestment =
      lower.includes('invest') || lower.includes('aplic') ||
      lower.includes('tesouro') || lower.includes('previdência') ||
      lower.includes('previdencia') || lower.includes('fundo') || lower.includes('bolsa');

    if (isInvestment) {
      let investmentType = 'investment-bolsa';
      if (lower.includes('tesouro')) investmentType = 'investment-tesouro-direto';
      else if (lower.includes('previdência') || lower.includes('previdencia')) investmentType = 'investment-previdencia';
      else if (lower.includes('fundo')) investmentType = 'investment-fundos';

      transactions.push({
        date: today, amount, type: 'expense',
        description: `Investimento - ${investmentType}`,
        category: 'investment', investmentType, confidence: 88,
      });
      continue;
    }

    let type: 'income' | 'expense' | 'transfer' = 'transfer';
    let description = line;

    if (lower.includes('deposit') || lower.includes('receb') || lower.includes('entrada')) {
      type = 'income'; description = `Depósito de R$ ${amount.toFixed(2).replace('.', ',')}`;
    } else if (lower.includes('sac') || lower.includes('pag') || lower.includes('compra') || lower.includes('débito') || lower.includes('debito')) {
      type = 'expense'; description = `Saque/Pagamento de R$ ${amount.toFixed(2).replace('.', ',')}`;
    } else if (lower.includes('transfer') || lower.includes('pix') || lower.includes('ted')) {
      type = 'transfer'; description = `Transferência de R$ ${amount.toFixed(2).replace('.', ',')}`;
    }

    transactions.push({
      date: today, amount, type, description,
      category: type === 'income' ? 'deposito' : type === 'expense' ? 'saque' : 'transferencia',
      confidence: 80,
    });
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))] as string[];

  return {
    success: transactions.length > 0,
    documentType: detectDocumentType(text, fileName),
    confidence: transactions.length > 0 ? 80 : 20,
    transactions,
    summary: {
      totalTransactions: transactions.length,
      totalIncome, totalExpenses,
      dateRange: { start: today, end: today },
      mainCategories: categories,
    },
    error: transactions.length === 0 ? 'Nenhuma transação financeira encontrada no documento' : undefined,
  };
}

function detectDocumentType(text: string, fileName: string): DocumentAnalysisResult['documentType'] {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  if (lowerText.includes('extrato') || lowerText.includes('statement')) return 'extract';
  if (lowerText.includes('recibo') || lowerText.includes('comprovante')) return 'receipt';
  if (lowerText.includes('fatura') || lowerText.includes('invoice')) return 'invoice';
  if (lowerFileName.includes('.xlsx') || lowerFileName.includes('.csv')) return 'spreadsheet';
  return 'unknown';
}

function createEmptySummary(): DocumentSummary {
  return { totalTransactions: 0, totalIncome: 0, totalExpenses: 0, dateRange: {}, mainCategories: [] };
}

export function isDocumentSupported(file: File): { supported: boolean; reason?: string } {
  const maxSize = 50 * 1024 * 1024;
  const supportedExtensions = ['.pdf', '.txt', '.csv', '.xlsx', '.xls'];
  const supportedTypes = [
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv'
  ];

  if (file.size > maxSize) return { supported: false, reason: 'Arquivo muito grande (máx. 50MB)' };

  const fileName = file.name.toLowerCase();
  const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidType = supportedTypes.includes(file.type);

  if (!hasValidExtension && !hasValidType) {
    return { supported: false, reason: 'Formato não suportado. Use: PDF, TXT, CSV, Excel' };
  }

  return { supported: true };
}

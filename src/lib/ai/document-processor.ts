/**
 * Sistema Inteligente de Processamento de Documentos Financeiros
 * Usa Vercel AI SDK para analisar automaticamente qualquer tipo de documento
 */

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
// import pdfParse from 'pdf-parse'; // Removed due to export issues
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
    
    // 1. Extrair texto do documento
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

    console.log(`Texto extraído: ${extractedText.length} caracteres`);

    // 2. Usar IA para analisar o documento
    const analysis = await analyzeDocumentWithAI(extractedText, file.name);
    
    return {
      ...analysis,
      rawText: extractedText.substring(0, 1000) // Primeiro 1000 chars para debug
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

/**
 * Extrai texto de diferentes tipos de arquivo
 */
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractFromPDF(file);
    }
    
    if (fileType.includes('spreadsheet') || 
        fileType.includes('excel') || 
        fileName.endsWith('.xlsx') || 
        fileName.endsWith('.xls') ||
        fileName.endsWith('.csv')) {
      return await extractFromSpreadsheet(file);
    }
    
    if (fileType.includes('text') || 
        fileName.endsWith('.txt') ||
        fileName.endsWith('.csv')) {
      return await extractFromText(file);
    }
    
    // Tentar como texto simples
    return await extractFromText(file);
    
  } catch (error) {
    console.error('Erro na extração de texto:', error);
    throw new Error('Formato de arquivo não suportado ou corrompido');
  }
}

/**
 * Extrai texto de PDF
 */
async function extractFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Dynamic import to resolve module export issues
  const pdfParseModule = await import('pdf-parse');
  // Handle both CommonJS and ESM exports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfParse = (pdfParseModule as any).default || pdfParseModule;
  
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Extrai dados de planilhas (Excel/CSV)
 */
async function extractFromSpreadsheet(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let extractedText = '';
  
  // Processa todas as abas
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const csvText = XLSX.utils.sheet_to_csv(worksheet);
    extractedText += `\\n=== ${sheetName} ===\\n${csvText}\\n`;
  });
  
  return extractedText;
}

/**
 * Extrai texto de arquivos de texto
 */
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
  
  // Primeira tentativa: OpenRouter (usa a chave configurada no .env.local)
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log('🤖 Tentando OpenRouter...');
      return await analyzeWithOpenRouter(text, fileName);
    } catch (error) {
      console.log('❌ OpenRouter falhou:', error instanceof Error ? error.message : String(error));
    }
  } else {
    console.log('⚠️ Chave do OpenRouter não configurada (OPENROUTER_API_KEY)');
  }

  // Segunda tentativa: Google Gemini (gratuito - 15 req/min)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && 
      process.env.GOOGLE_GENERATIVE_AI_API_KEY !== 'coloque_sua_chave_gemini_aqui') {
    try {
      console.log('🤖 Tentando Google Gemini (gratuito)...');
      return await analyzeWithGemini(text, fileName);
    } catch (error) {
      console.log('❌ Gemini falhou:', error instanceof Error ? error.message : String(error));
    }
  }

  // Último recurso: análise local por regex
  console.log('⚠️ Usando análise local (sem IA externa) — configure OPENROUTER_API_KEY no .env.local');
  return await analyzeWithSimpleRegex(text, fileName);
}

/**
 * Análise com OpenRouter
 * Modelo padrão: google/gemini-flash-1.5 (gratuito no OpenRouter)
 * Outros bons modelos gratuitos: meta-llama/llama-3.1-8b-instruct, mistralai/mistral-7b-instruct
 */
async function analyzeWithOpenRouter(text: string, fileName: string) {
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
5. Se não houver data explícita, use a data de hoje: ${new Date().toLocaleDateString('pt-BR')}.

FORMATO DE RESPOSTA:
{
  "transactions": [
    {
      "amount": 50.00,
      "type": "investment",
      "investmentType": "investment-tesouro-direto",
      "description": "Investimento no Tesouro Direto",
      "date": "${new Date().toLocaleDateString('pt-BR')}",
      "confidence": 95
    }
  ]
}`;

  const { text: aiResponse } = await generateText({
    model: openrouter('google/gemini-flash-1.5'),
    prompt,
    temperature: 0.1,
  });

  console.log('🤖 OpenRouter response:', aiResponse.substring(0, 300));

  // Extrair JSON da resposta (remove possível markdown residual)
  const clean = aiResponse.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const jsonStart = clean.indexOf('{');
  const jsonEnd = clean.lastIndexOf('}') + 1;

  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('Resposta não contém JSON válido');
  }

  const parsed = JSON.parse(clean.substring(jsonStart, jsonEnd));
  const transactions: FinancialTransaction[] = (parsed.transactions ?? []).map(
    (t: {
      amount?: number;
      type?: string;
      investmentType?: string;
      description?: string;
      date?: string;
      confidence?: number;
    }) => ({
      date: t.date ?? new Date().toLocaleDateString('pt-BR'),
      amount: Math.abs(t.amount ?? 0),
      // O campo type vem como deposit/withdrawal/transfer/investment — mapear para income/expense/transfer
      type: (t.type === 'deposit' ? 'income' : t.type === 'investment' || t.type === 'withdrawal' ? 'expense' : 'transfer') as 'income' | 'expense' | 'transfer',
      description: t.description ?? 'Transação detectada pela IA',
      category: t.type === 'investment' ? 'investment' : t.type,
      investmentType: t.investmentType,
      confidence: t.confidence ?? 90,
    })
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const today = new Date().toLocaleDateString('pt-BR');

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

/**
 * Análise com Google Gemini (GRATUITO!)
 */
async function analyzeWithGemini(text: string, fileName: string) {
  const prompt = `
Analise este documento financeiro e extraia dados estruturados.

ARQUIVO: ${fileName}
TEXTO:
${text}

Encontre TODAS as transações financeiras e retorne APENAS JSON válido:

{
  "success": true,
  "documentType": "extract|receipt|invoice|statement|spreadsheet|unknown",
  "confidence": 90,
  "transactions": [
    {
      "date": "16/06/2026",
      "amount": 10.50,
      "type": "expense",
      "description": "Descrição da transação",
      "category": "categoria",
      "confidence": 85
    }
  ],
  "summary": {
    "totalTransactions": 1,
    "totalIncome": 0.00,
    "totalExpenses": 10.50,
    "dateRange": { "start": "16/06/2026", "end": "16/06/2026" },
    "mainCategories": ["categoria"]
  }
}

IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional.
`;

  const result = await generateText({
    model: AI_PROVIDERS.gemini.model,
    prompt,
    temperature: 0.1,
  });

  console.log('🤖 Gemini response:', result.text.substring(0, 200));

  // Parse JSON da resposta
  const cleanResponse = result.text.trim();
  const jsonStart = cleanResponse.indexOf('{');
  const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
  
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('Resposta não contém JSON válido');
  }

  const jsonResponse = cleanResponse.substring(jsonStart, jsonEnd);
  const analysis = JSON.parse(jsonResponse);

  // Validações
  if (!analysis.transactions) analysis.transactions = [];
  if (!analysis.summary) analysis.summary = createEmptySummary();

  return analysis;
}

/**
 * Análise simples com regex (sempre funciona)
 */
async function analyzeWithSimpleRegex(
  text: string, 
  fileName: string
): Promise<Omit<DocumentAnalysisResult, 'rawText'>> {
  
  const transactions: FinancialTransaction[] = [];
  const today = new Date().toLocaleDateString('pt-BR');

  // Patterns melhorados
  const patterns = {
    // Investimentos: múltiplos padrões
    investments: [
      // Padrão 1: "investir R$10" ou "aplicar R$20" (tipo pode vir antes ou depois do valor)
      /(investir|aplicar|invista)\s+r?\$?\s*(\d+(?:[.,]\d{2})?)/gi,
      // Padrão 2: "colocar R$10 para investir na bolsa"
      /colocar\s+r?\$?\s*(\d+(?:[.,]\d{2})?)\s+para\s+(investir|aplicar).*(bolsa|renda|fundo|tesouro|poupança|investimento)/gi,
      // Padrão 3: "investir na bolsa R$10"
      /(investir|aplicar|invista).*(bolsa|renda|fundo|tesouro|poupança|investimento)\s+r?\$?\s*(\d+(?:[.,]\d{2})?)/gi,
    ],
    
    // Transações normais: Depositar R$10,00 | Sacar R$2,00 | Pagar R$100 | etc
    transactions: /(depositar|sacar|pagar|comprar|transferir|receber)\s+r?\$?\s*(\d+(?:[.,]\d{2})?)/gi,
    
    // Valores soltos: R$ 123,45 ou 123.50
    amounts: /r?\$?\s*(\d+(?:[.,]\d{2})?)/gi,
    
    // Datas
    dates: /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/gi,
  };

  // Primeiro: Extrair investimentos (prioridade)
  console.log('Analisando texto para investimentos:', text);
  let match;
  
  // Testar cada padrão de investimento
  for (const pattern of patterns.investments) {
    pattern.lastIndex = 0; // Reset do regex global
    while ((match = pattern.exec(text)) !== null) {
      let amount = 0;
      let action = '';
      const fullMatch = match[0];
      
      console.log('INVESTIMENTO DETECTADO!');
      console.log('- Match completo:', fullMatch);
      console.log('- Grupos capturados:', match);
      
      // Padrão 1: investir R$10
      if (match[1] && match[2] && !match[3]) {
        action = match[1].toLowerCase();
        amount = parseFloat(match[2].replace(',', '.'));
      }
      // Padrão 2: colocar R$10 para investir na bolsa
      else if (match[1] && match[2] && match[3]) {
        action = `${match[2]} na ${match[3]}`.toLowerCase();
        amount = parseFloat(match[1].replace(',', '.'));
      }
      // Padrão 3: investir na bolsa R$10
      else if (match[1] && match[2] && match[3]) {
        action = `${match[1]} na ${match[2]}`.toLowerCase();
        amount = parseFloat(match[3].replace(',', '.'));
      }
      
      console.log('- Ação:', action);
      console.log('- Valor numérico:', amount);
      
      if (!isNaN(amount) && amount > 0) {
        // Usar a linha inteira para detectar o destino (o padrão 1 captura só "investir 10")
        const lineStart = match.index <= 0 ? 0 : text.lastIndexOf('\n', match.index - 1) + 1;
        const lineEnd = text.indexOf('\n', match.index);
        const lineContext = text
          .substring(lineStart, lineEnd === -1 ? text.length : lineEnd)
          .toLowerCase();

        let investmentType = 'Bolsa';

        // Detectar tipo de investimento a partir da linha completa.
        // A ordem importa: termos mais específicos primeiro.
        const searchIn = (lineContext + ' ' + fullMatch).toLowerCase();
        if (searchIn.includes('tesouro')) investmentType = 'Tesouro';
        else if (searchIn.includes('previdencia') || searchIn.includes('previdência')) investmentType = 'Previdencia';
        else if (searchIn.includes('fundo')) investmentType = 'Fundos';
        else if (searchIn.includes('bolsa')) investmentType = 'Bolsa';
        else if (searchIn.includes('renda')) investmentType = 'Renda Fixa';
        else if (searchIn.includes('poupança')) investmentType = 'Poupança';
        
        console.log('- Tipo de investimento:', investmentType);
        
        const investment: FinancialTransaction = {
          date: today,
          amount,
          type: 'expense' as const, // Investimento é saída de dinheiro
          description: `Investimento - ${investmentType}`,
          category: 'investment',
          investmentType,
          confidence: 90
        };
        
      console.log('- Transação de investimento criada:', investment);
      console.log('✅ INVESTIMENTO DETECTADO E PROCESSADO COM SUCESSO!');
      
      transactions.push(investment);
      }
    }
  }
  
  // Segundo: Extrair transações normais
  while ((match = patterns.transactions.exec(text)) !== null) {
    const action = match[1].toLowerCase();
    const amountStr = match[2].replace(',', '.');
    const amount = parseFloat(amountStr);
    
    if (!isNaN(amount) && amount > 0) {
      let type: 'income' | 'expense' | 'transfer' = 'transfer';
      let description = `${match[1]} R$ ${amount.toFixed(2).replace('.', ',')}`;
      
      // Classificar por ação
      if (action.includes('depositar') || action.includes('receber')) {
        type = 'income';
        description = `Depósito de R$ ${amount.toFixed(2).replace('.', ',')}`;
      } else if (action.includes('sacar') || action.includes('pagar') || action.includes('comprar')) {
        type = 'expense';
        description = `${action.charAt(0).toUpperCase() + action.slice(1)} de R$ ${amount.toFixed(2).replace('.', ',')}`;
      }

      transactions.push({
        date: today,
        amount,
        type,
        description,
        category: getCategory(action),
        confidence: 85
      });
    }
  }

  // Se não encontrou transações específicas, buscar valores soltos
  if (transactions.length === 0) {
    const amounts = [...text.matchAll(patterns.amounts)];
    amounts.forEach((match) => {
      const amountStr = match[1].replace(',', '.');
      const amount = parseFloat(amountStr);
      
      if (!isNaN(amount) && amount > 0) {
        transactions.push({
          date: today,
          amount,
          type: 'transfer',
          description: `Transação de R$ ${amount.toFixed(2).replace('.', ',')}`,
          category: 'outros',
          confidence: 70
        });
      }
    });
  }

  // Calcular resumo
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = [...new Set(transactions.map(t => t.category).filter((cat): cat is string => Boolean(cat)))];

  const summary: DocumentSummary = {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpenses,
    dateRange: {
      start: today,
      end: today
    },
    mainCategories: categories
  };

  return {
    success: transactions.length > 0,
    documentType: detectDocumentType(text, fileName),
    confidence: transactions.length > 0 ? 80 : 20,
    transactions,
    summary,
    error: transactions.length === 0 ? 'Nenhuma transação financeira encontrada no documento' : undefined
  };
}

/**
 * Detecta tipo de documento
 */
function detectDocumentType(text: string, fileName: string): DocumentAnalysisResult['documentType'] {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerText.includes('extrato') || lowerText.includes('statement')) return 'extract';
  if (lowerText.includes('recibo') || lowerText.includes('comprovante')) return 'receipt';
  if (lowerText.includes('fatura') || lowerText.includes('invoice')) return 'invoice';
  if (lowerFileName.includes('.xlsx') || lowerFileName.includes('.csv')) return 'spreadsheet';
  
  return 'unknown';
}

/**
 * Categoriza baseado na ação
 */
function getCategory(action: string): string {
  const lowerAction = action.toLowerCase();
  
  if (lowerAction.includes('comprar') || lowerAction.includes('pagar')) return 'compras';
  if (lowerAction.includes('sacar')) return 'saque';
  if (lowerAction.includes('depositar') || lowerAction.includes('receber')) return 'deposito';
  if (lowerAction.includes('transferir')) return 'transferencia';
  
  return 'outros';
}

/**
 * Cria um resumo vazio padrão
 */
function createEmptySummary(): DocumentSummary {
  return {
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    dateRange: {},
    mainCategories: []
  };
}

/**
 * Valida se um arquivo é suportado
 */
export function isDocumentSupported(file: File): { supported: boolean; reason?: string } {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const supportedTypes = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv'
  ];
  
  const supportedExtensions = ['.pdf', '.txt', '.csv', '.xlsx', '.xls'];
  
  if (file.size > maxSize) {
    return { supported: false, reason: 'Arquivo muito grande (máx. 50MB)' };
  }
  
  const fileName = file.name.toLowerCase();
  const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidType = supportedTypes.includes(file.type);
  
  if (!hasValidExtension && !hasValidType) {
    return { 
      supported: false, 
      reason: 'Formato não suportado. Use: PDF, TXT, CSV, Excel' 
    };
  }
  
  return { supported: true };
}
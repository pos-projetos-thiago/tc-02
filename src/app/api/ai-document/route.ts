/**
 * API Route para Processamento Inteligente de Documentos
 * POST /api/ai-document
 */

import { NextRequest, NextResponse } from 'next/server';
import { processFinancialDocument, isDocumentSupported } from '@/lib/ai/document-processor';

export async function POST(request: NextRequest) {
  try {
    // Não é mais obrigatório ter chaves de IA - temos fallback
    console.log('🤖 Processamento de documento iniciado...');
    console.log('OpenAI disponível:', !!process.env.OPENAI_API_KEY);
    console.log('Hugging Face disponível:', !!process.env.HUGGINGFACE_API_TOKEN);

    // Parse do FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const analysisMode = formData.get('analysisMode') as string || 'intelligent';

    // Validações básicas
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nenhum arquivo enviado'
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Arquivo inválido'
        },
        { status: 400 }
      );
    }

    // Validar suporte ao arquivo
    const validation = isDocumentSupported(file);
    if (!validation.supported) {
      return NextResponse.json(
        {
          success: false,
          error: validation.reason || 'Formato de arquivo não suportado'
        },
        { status: 400 }
      );
    }

    // Log para debugging
    console.log(`📄 Processando documento: ${file.name} (${file.size} bytes, ${file.type})`);

    // Processar documento com IA
    const result = await processFinancialDocument(file);

    // Log do resultado
    if (result.success) {
      console.log(`✅ Documento processado: ${result.transactions.length} transações encontradas`);
      console.log(`📊 Tipo: ${result.documentType}, Confiança: ${result.confidence}%`);
    } else {
      console.error(`❌ Falha no processamento: ${result.error}`);
    }

    // Retorna o resultado
    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });

  } catch (error) {
    console.error('Erro na API de processamento inteligente:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'API de Processamento Inteligente de Documentos',
      version: '2.0.0',
      capabilities: {
        supportedFormats: ['PDF', 'Excel', 'CSV', 'TXT'],
        maxFileSize: '50MB',
        aiModels: ['GPT-4o-mini', 'Hugging Face TrOCR'],
        features: [
          'Extração automática de texto',
          'Análise inteligente com IA',
          'Detecção de transações financeiras',
          'Classificação automática',
          'Geração de resumos',
          'Export para PDF'
        ]
      },
      endpoints: {
        '/api/ai-document': 'POST - Processa documento com IA',
        '/api/ai-document/batch': 'POST - Processa múltiplos documentos',
      }
    },
    { status: 200 }
  );
}
/**
 * API Route para OCR de imagem única
 * POST /api/ocr
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromImage, extractTextFromDocument } from '@/lib/huggingface/ocr';

export async function POST(request: NextRequest) {
  try {
    // Verifica se o token está configurado
    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          text: '',
          error: 'Configuração do OCR não encontrada'
        },
        { status: 500 }
      );
    }

    // Parse do FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isDocument = formData.get('isDocument') === 'true';

    // Validações básicas
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          text: '',
          error: 'Nenhum arquivo enviado'
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          text: '',
          error: 'Arquivo inválido'
        },
        { status: 400 }
      );
    }

    // Log para debugging (sem expor dados sensíveis)
    console.log(`OCR: Processando ${file.name} (${file.size} bytes, ${file.type})`);

    // Processa o OCR
    let result;
    if (isDocument) {
      result = await extractTextFromDocument(file);
    } else {
      result = await extractTextFromImage(file);
    }

    // Log do resultado
    if (result.success) {
      console.log(`OCR: Texto extraído (${result.text.length} caracteres)`);
    } else {
      console.error(`OCR: Erro - ${result.error}`);
    }

    // Retorna o resultado
    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });

  } catch (error) {
    console.error('Erro na API de OCR:', error);
    
    return NextResponse.json(
      {
        success: false,
        text: '',
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'API de OCR ativa',
      endpoints: {
        '/api/ocr': 'POST - Processa uma imagem para OCR',
        '/api/ocr/multiple': 'POST - Processa múltiplas imagens para OCR'
      }
    },
    { status: 200 }
  );
}
/**
 * API Route para OCR de múltiplas imagens
 * POST /api/ocr/multiple
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromMultipleImages } from '@/lib/huggingface/ocr';

export async function POST(request: NextRequest) {
  try {
    // Verifica se o token está configurado
    if (!process.env.HUGGINGFACE_API_TOKEN) {
      return NextResponse.json(
        {
          error: 'Configuração do OCR não encontrada'
        },
        { status: 500 }
      );
    }

    // Parse do FormData
    const formData = await request.formData();
    const fileCountStr = formData.get('fileCount') as string;
    
    if (!fileCountStr) {
      return NextResponse.json(
        {
          error: 'Número de arquivos não especificado'
        },
        { status: 400 }
      );
    }

    const fileCount = parseInt(fileCountStr);
    
    if (isNaN(fileCount) || fileCount <= 0) {
      return NextResponse.json(
        {
          error: 'Número de arquivos inválido'
        },
        { status: 400 }
      );
    }

    // Limita o número de arquivos para evitar sobrecarga
    if (fileCount > 10) {
      return NextResponse.json(
        {
          error: 'Máximo de 10 arquivos por vez'
        },
        { status: 400 }
      );
    }

    // Coleta todos os arquivos
    const files: File[] = [];
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file && file instanceof File) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          error: 'Nenhum arquivo válido encontrado'
        },
        { status: 400 }
      );
    }

    // Log para debugging
    console.log(`OCR Multiple: Processando ${files.length} arquivos`);
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
    });

    // Processa todos os arquivos
    const results = await extractTextFromMultipleImages(files);

    // Log dos resultados
    const successCount = results.filter(r => r.success).length;
    console.log(`OCR Multiple: ${successCount}/${results.length} processados com sucesso`);

    // Retorna os resultados
    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('Erro na API de OCR múltiplo:', error);
    
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'API de OCR múltiplo ativa',
      limits: {
        maxFiles: 10,
        maxFileSize: '10MB per file',
        supportedFormats: ['JPEG', 'PNG', 'WebP']
      },
      usage: {
        method: 'POST',
        body: 'FormData with file_0, file_1, ..., file_N and fileCount'
      }
    },
    { status: 200 }
  );
}
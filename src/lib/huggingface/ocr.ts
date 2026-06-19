/**
 * Integração com Hugging Face API para OCR
 * Extrai texto de imagens usando modelos de OCR
 */

// Tipos para a resposta da API
interface HuggingFaceOCRResponse {
  generated_text?: string;
  text?: string;
  error?: string;
}

interface HuggingFaceError {
  error: string;
  estimated_time?: number;
}

interface OCRResult {
  success: boolean;
  text: string;
  error?: string;
}

/**
 * Configuração da API do Hugging Face
 */
const HUGGINGFACE_CONFIG = {
  baseUrl: 'https://api-inference.huggingface.co/models',
  // Modelo recomendado para OCR geral
  defaultModel: 'microsoft/trocr-base-printed',
  // Modelo alternativo para documentos
  documentModel: 'microsoft/trocr-large-printed',
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
} as const;

/**
 * Converte arquivo para base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove o prefixo data:image/...;base64,
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Valida se o arquivo é uma imagem suportada
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const minSize = 1024; // 1KB mínimo
  
  if (!file) {
    return {
      valid: false,
      error: 'Nenhum arquivo selecionado.'
    };
  }
  
  if (!supportedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 10MB.'
    };
  }

  if (file.size < minSize) {
    return {
      valid: false,
      error: 'Arquivo muito pequeno. Tamanho mínimo: 1KB.'
    };
  }
  
  return { valid: true };
}

/**
 * Chama a API do Hugging Face para OCR
 */
async function callHuggingFaceOCR(
  imageData: string,
  model: string = HUGGINGFACE_CONFIG.defaultModel,
  retries: number = 3
): Promise<OCRResult> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Verifica se o token existe
      if (!process.env.HUGGINGFACE_API_TOKEN) {
        throw new Error('Token do Hugging Face não configurado');
      }

      const response = await fetch(`${HUGGINGFACE_CONFIG.baseUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: imageData,
        options: {
          wait_for_model: true,
          use_cache: false,
        },
        parameters: {
          max_new_tokens: 1000
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API (${response.status}): ${errorText}`);
    }

    const result: HuggingFaceOCRResponse | HuggingFaceOCRResponse[] | HuggingFaceError = await response.json();
    
    // A resposta pode ser um array ou objeto único
    const data = Array.isArray(result) ? result[0] : result;
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Extrai o texto da resposta (diferentes modelos podem ter campos diferentes)
    const extractedText = (data as HuggingFaceOCRResponse).generated_text || (data as HuggingFaceOCRResponse).text || '';
    
    if (!extractedText.trim()) {
      return {
        success: false,
        text: '',
        error: 'Nenhum texto foi encontrado na imagem'
      };
    }

    return {
      success: true,
      text: extractedText.trim()
    };

    } catch (error) {
      console.error(`Erro no OCR (tentativa ${attempt}/${retries}):`, error);
      
      if (attempt === retries) {
        return {
          success: false,
          text: '',
          error: error instanceof Error ? error.message : 'Erro desconhecido no OCR'
        };
      }
      
      // Aguarda antes de tentar novamente (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }

  return {
    success: false,
    text: '',
    error: 'Falha após todas as tentativas'
  };
}

/**
 * Função principal para extrair texto de imagem
 */
export async function extractTextFromImage(file: File): Promise<OCRResult> {
  // Valida o arquivo
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return {
      success: false,
      text: '',
      error: validation.error
    };
  }

  try {
    // Converte para base64
    const base64Data = await fileToBase64(file);
    
    // Chama a API do Hugging Face
    const result = await callHuggingFaceOCR(base64Data);
    
    return result;
    
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Erro ao processar imagem'
    };
  }
}

/**
 * Função para OCR de documentos (usa modelo otimizado)
 */
export async function extractTextFromDocument(file: File): Promise<OCRResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return {
      success: false,
      text: '',
      error: validation.error
    };
  }

  try {
    const base64Data = await fileToBase64(file);
    // Usa modelo específico para documentos
    const result = await callHuggingFaceOCR(base64Data, HUGGINGFACE_CONFIG.documentModel);
    
    return result;
    
  } catch (error) {
    console.error('Erro ao processar documento:', error);
    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Erro ao processar documento'
    };
  }
}

/**
 * Função para processar múltiplas imagens
 */
export async function extractTextFromMultipleImages(files: File[]): Promise<OCRResult[]> {
  if (files.length === 0) {
    return [{
      success: false,
      text: '',
      error: 'Nenhum arquivo fornecido'
    }];
  }

  // Processa todas as imagens em paralelo
  const promises = files.map(file => extractTextFromImage(file));
  
  return await Promise.all(promises);
}
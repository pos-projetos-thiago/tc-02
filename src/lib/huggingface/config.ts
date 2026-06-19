/**
 * Configuração centralizada do OCR
 */

export const OCR_CONFIG = {
  // Modelos disponíveis
  models: {
    basic: 'microsoft/trocr-base-printed',
    document: 'microsoft/trocr-large-printed',
    handwritten: 'microsoft/trocr-base-handwritten',
  },
  
  // Limites de arquivo
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    minFileSize: 1024, // 1KB
    maxFiles: 10, // Máximo de arquivos simultâneos
    timeout: 60000, // 60 segundos timeout
  },
  
  // Formatos suportados
  supportedFormats: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  
  // Configuração de retry
  retry: {
    maxAttempts: 3,
    baseDelay: 2000, // ms
    maxDelay: 30000, // ms
  },
  
  // Parâmetros da API
  apiParams: {
    wait_for_model: true,
    use_cache: false,
    max_new_tokens: 1000,
  },
  
  // Padrões de detecção de transação
  patterns: {
    amount: /(?:R\$\s?|RS\s?)?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2}|\d+[.,]\d{2})/g,
    date: /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})/g,
    transactionType: /(pix|ted|doc|transferencia|compra|pagamento|debito|credito|deposito|saque|boleto|cartao)/gi,
    merchant: /(mercado|farmacia|posto|gas|restaurante|loja|magazine|supermercado|shopping|bank|atm|ifood|uber|99|drogaria|padaria|acougue)/gi,
  }
} as const;

export const HUGGING_FACE_CONFIG = {
  baseUrl: 'https://api-inference.huggingface.co/models',
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
} as const;
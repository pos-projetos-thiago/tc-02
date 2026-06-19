# 🤖 OCR (Reconhecimento Óptico de Caracteres) - ByteBank

Este documento explica como usar e configurar a funcionalidade de OCR no sistema ByteBank.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Componentes](#componentes)
- [API Endpoints](#api-endpoints)
- [Limitações](#limitações)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de OCR permite extrair automaticamente dados de comprovantes bancários e criar transações de forma automatizada. Utiliza a API do Hugging Face com modelos Microsoft TrOCR para reconhecimento de texto em imagens.

### Funcionalidades:

- ✅ Upload de imagens (JPEG, PNG, WebP)
- ✅ Extração automática de texto
- ✅ Detecção inteligente de dados de transação
- ✅ Criação automática de transações
- ✅ Processamento de múltiplas imagens
- ✅ Modo documento otimizado

## ⚙️ Configuração

### 1. Token do Hugging Face

1. Crie uma conta em [huggingface.co](https://huggingface.co)
2. Acesse Settings → Access Tokens
3. Crie um novo token com permissão READ
4. Adicione o token no arquivo `.env.local`:

```env
HUGGINGFACE_API_TOKEN=hf_seu_token_aqui
```

### 2. Verificação da Instalação

Execute o projeto e acesse:
- **OCR Standalone**: `/ocr`
- **OCR Integrado**: `/dashboard/ocr-transacoes`

## 📱 Como Usar

### 1. Acesso pela Dashboard

1. Faça login no ByteBank
2. No dashboard, clique em "OCR Transações"
3. Ou acesse diretamente `/dashboard/ocr-transacoes`

### 2. Upload de Comprovante

1. Arraste uma imagem para a área de upload, ou
2. Clique na área para selecionar um arquivo
3. Aguarde o processamento (alguns segundos)

### 3. Revisar Dados Detectados

O sistema tentará extrair:
- **Valor** da transação
- **Data** da operação  
- **Tipo** (entrada/saída)
- **Descrição/Estabelecimento**

### 4. Criar Transação

1. Revise os dados detectados
2. Clique em "Criar Transação"
3. A transação aparecerá no seu extrato

## 🧱 Componentes

### `OCRUploader`
Componente principal para upload e processamento de imagens.

```tsx
import { OCRUploader } from '@/components/organisms/OCRUploader';

<OCRUploader
  onTextExtracted={(text, filename) => console.log(text)}
  onError={(error) => console.error(error)}
  multiple={false}
  acceptDocuments={true}
/>
```

### `TransactionOCR`
Componente especializado para criar transações via OCR.

```tsx
import { TransactionOCR } from '@/components/molecules/TransactionOCR';

<TransactionOCR
  onTransactionDetected={(data) => console.log(data)}
  onError={(error) => console.error(error)}
/>
```

### Hook `useOCR`
Hook React para funcionalidade de OCR.

```tsx
const { extractText, isProcessing, result } = useOCR();

const handleUpload = async (file: File) => {
  const result = await extractText(file);
  if (result.success) {
    console.log('Texto:', result.text);
  }
};
```

## 🔌 API Endpoints

### `POST /api/ocr`
Processa uma única imagem.

**Body**: FormData
- `file`: Arquivo de imagem
- `isDocument`: Boolean (opcional)

**Response**:
```json
{
  "success": true,
  "text": "Texto extraído da imagem",
  "error": null
}
```

### `POST /api/ocr/multiple`
Processa múltiplas imagens.

**Body**: FormData
- `file_0`, `file_1`, ...: Arquivos de imagem
- `fileCount`: Número de arquivos

**Response**:
```json
[
  {
    "success": true,
    "text": "Texto da primeira imagem",
    "error": null
  },
  ...
]
```

## ⚠️ Limitações

### Formatos Suportados
- ✅ JPEG/JPG
- ✅ PNG  
- ✅ WebP
- ❌ PDF (use conversão para imagem)
- ❌ TIFF, BMP

### Tamanhos
- **Máximo**: 10MB por arquivo
- **Múltiplos**: Máximo 10 arquivos simultâneos
- **Recomendado**: Imagens até 5MB para melhor performance

### Qualidade
- ✅ Documentos escaneados
- ✅ Fotos nítidas com boa iluminação
- ⚠️ Fotos com sombras ou desfoque
- ❌ Texto manuscrito
- ❌ Imagens muito pixelizadas

## 🐛 Troubleshooting

### Erro "Token não configurado"
**Problema**: `HUGGINGFACE_API_TOKEN` não encontrado

**Solução**:
1. Verifique o arquivo `.env.local`
2. Reinicie o servidor (`npm run dev`)
3. Confirme que o token está correto

### Erro "Nenhum texto encontrado"
**Problema**: OCR não detectou texto na imagem

**Soluções**:
1. Use imagem com melhor qualidade
2. Certifique-se que o texto está legível
3. Tente o modo "documento" para textos impressos
4. Evite imagens com muito ruído ou sombras

### Erro "Modelo carregando"
**Problema**: Modelo do Hugging Face ainda está inicializando

**Solução**:
1. Aguarde alguns minutos
2. Tente novamente
3. Primeira execução pode demorar mais

### Performance lenta
**Problema**: OCR demora muito para processar

**Soluções**:
1. Reduza o tamanho da imagem
2. Use formato JPEG em vez de PNG
3. Processe uma imagem por vez
4. Considere usar modo batch apenas quando necessário

## 💡 Dicas de Uso

### Melhores Práticas

1. **Qualidade da Imagem**:
   - Use boa iluminação
   - Evite sombras e reflexos
   - Mantenha o documento plano
   - Prefira documentos escaneados

2. **Tipos de Documento**:
   - ✅ Comprovantes de transferência
   - ✅ Extratos bancários
   - ✅ Recibos de pagamento
   - ✅ Faturas com valores

3. **Processamento**:
   - Use modo "documento" para textos impressos
   - Processe imagens individualmente para maior precisão
   - Revise sempre os dados antes de criar transações

### Formatos Recomendados

```
Resolução: 1000x1000px ou maior
Formato: JPEG (melhor compressão)
Qualidade: 80% ou superior
Tamanho: 2-5MB (ideal)
```

## 🔄 Atualizações e Manutenção

### Modelos Disponíveis

O sistema usa os modelos:
- **microsoft/trocr-base-printed**: OCR geral
- **microsoft/trocr-large-printed**: Documentos (melhor precisão)

### Monitoramento

Verifique os logs do servidor para:
- Tempo de processamento
- Taxa de sucesso
- Erros comuns

### Backup

Os dados de OCR não são armazenados permanentemente. Apenas o texto extraído é usado para criar transações.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique este README
2. Consulte os logs do navegador (F12)
3. Teste com diferentes tipos de imagem
4. Verifique a configuração do token

**Desenvolvido para o ByteBank** | Última atualização: Junho 2026
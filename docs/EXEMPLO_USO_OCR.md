# 🧪 Exemplo de Uso - OCR ByteBank

Este documento mostra como testar e usar a funcionalidade de OCR no ByteBank.

## ✅ Pré-requisitos

1. **Token configurado** no `.env.local`:
   ```env
   HUGGINGFACE_API_TOKEN=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
   ```

2. **Servidor rodando**:
   ```bash
   npm run dev
   # Acesse: http://localhost:3000
   ```

## 🎯 Testando a Funcionalidade

### 1. Acesso Direto ao OCR
Acesse: http://localhost:3000/ocr

**Funcionalidades disponíveis**:
- 📄 OCR Básico
- 📋 OCR para Documentos  
- 📁 OCR Múltiplos Arquivos

### 2. OCR Integrado com Transações
Acesse: http://localhost:3000/dashboard/ocr-transacoes

**Fluxo completo**:
1. Login no sistema
2. Upload de comprovante
3. Dados extraídos automaticamente
4. Criação de transação

### 3. Via Dashboard Principal
1. Acesse: http://localhost:3000/dashboard
2. Clique em "OCR Transações"
3. Upload e crie transações

## 🧪 Casos de Teste

### Teste 1: Comprovante de Transferência
**Imagem ideal**: Screenshot de um comprovante PIX ou TED
**Dados esperados**:
- Valor: R$ 150,00
- Tipo: Saída/Transferência  
- Data: 15/06/2026
- Descrição: Transferência PIX

### Teste 2: Extrato Bancário
**Imagem ideal**: Print de extrato com transações
**Dados esperados**:
- Múltiplos valores
- Datas das operações
- Tipos de transação

### Teste 3: Recibo/Nota Fiscal
**Imagem ideal**: Foto de recibo de compra
**Dados esperados**:
- Valor total
- Nome do estabelecimento
- Data da compra

## 📋 Checklist de Funcionamento

### ✅ API Endpoints
- [ ] `GET /api/ocr` - Status da API
- [ ] `POST /api/ocr` - Upload único
- [ ] `POST /api/ocr/multiple` - Upload múltiplo

### ✅ Componentes React  
- [ ] `OCRUploader` - Upload e preview
- [ ] `TransactionOCR` - Detecção de dados
- [ ] `useOCR` hook - Lógica de processamento

### ✅ Páginas
- [ ] `/ocr` - Demo standalone
- [ ] `/dashboard/ocr-transacoes` - Integrado
- [ ] Dashboard principal - Link funcionando

### ✅ Integrações
- [ ] Hugging Face API conectada
- [ ] Token configurado corretamente
- [ ] Modelos carregando/funcionando
- [ ] Transações sendo criadas

## 🐛 Possíveis Problemas

### Problema: "Token não configurado"
```typescript
// Erro comum
{
  "success": false,
  "error": "Configuração do OCR não encontrada"
}

// Solução
// Verifique o .env.local e reinicie o servidor
```

### Problema: "Modelo carregando"  
```typescript  
// Primeira chamada pode demorar
// Aguarde alguns minutos e tente novamente
```

### Problema: "Texto não encontrado"
```typescript
// Use imagens com:
// - Boa iluminação
// - Texto legível  
// - Formato JPEG/PNG
// - Tamanho até 10MB
```

## 🔧 Debug e Logs

### Browser DevTools
1. F12 → Console
2. Aba Network - verificar requests
3. Erros JavaScript aparecerão aqui

### Server Logs
```bash
# Terminal onde roda npm run dev
# Logs das chamadas da API aparecem aqui
```

### Exemplo de Chamada Bem-Sucedida
```javascript
// Console do navegador
console.log("OCR Result:", {
  success: true,
  text: "COMPROVANTE PIX R$ 150,00 15/06/2026 João Silva",
  extractedData: {
    amount: 150.00,
    type: "expense", 
    date: "15/06/2026",
    description: "Transferência PIX"
  }
});
```

## ⚡ Performance

### Tempos Esperados
- **Primeira chamada**: 30-60s (modelo carregando)
- **Chamadas seguintes**: 3-10s
- **Imagens pequenas**: 2-5s
- **Imagens grandes**: 5-15s

### Otimizações
- Use JPEG em vez de PNG
- Redimensione imagens grandes
- Processe uma por vez para melhor precisão

---

**Pronto para usar!** 🎉 

A funcionalidade de OCR está totalmente integrada ao ByteBank e pronta para extrair dados de comprovantes bancários automaticamente.
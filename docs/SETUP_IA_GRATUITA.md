# 🆓 Configuração de IA Gratuita para ByteBank

## Opções 100% Gratuitas (em ordem de preferência)

### 🥇 **1. Google Gemini (Recomendado)**
- ✅ **Totalmente gratuito**
- ✅ **15 requests/min, 1500/dia**
- ✅ **Qualidade excelente**

**Como configurar:**
1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com conta Google
3. Clique "Create API Key"
4. Cole no `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=sua_chave_aqui
```

### 🥈 **2. Hugging Face (Você já tem)**
- ✅ **Token já configurado**
- ✅ **Funciona para OCR**
- ✅ **Modelos gratuitos disponíveis**

### 🥉 **3. Ollama (100% Local)**
- ✅ **Roda no seu computador**
- ✅ **Sem limites de requests**
- ✅ **Zero custos**

**Como instalar Ollama:**
1. Download: https://ollama.ai/download
2. Instalar no Windows
3. Rodar: `ollama pull llama3.2`
4. Sistema detecta automaticamente

### 🏅 **4. Análise Local (Fallback)**
- ✅ **Sempre funciona**
- ✅ **Sem dependências externas**
- ✅ **Regex inteligente**

## Status Atual

**Funcionando agora:** ✅ Análise Local (regex)
- Detecta: "Depositar R$10,00", "Sacar R$2,00", etc.
- Classifica automaticamente tipo de transação
- Calcula resumos financeiros

## Para melhorar a precisão:

1. **Configure Google Gemini** (5 minutos)
2. **Ou instale Ollama** (10 minutos) 
3. **Ou continue usando análise local** (já funciona!)

## Testando

Vá para: `http://localhost:3000/test-ai`
- Clique no botão de teste
- Veja os logs no console (F12)
- Sistema tenta IA → fallback → análise local

**Resultado esperado:**
```json
{
  "success": true,
  "documentType": "unknown",
  "confidence": 80,
  "transactions": [
    {
      "date": "16/06/2026",
      "amount": 10,
      "type": "income",
      "description": "Depósito de R$ 10,00"
    },
    {
      "date": "16/06/2026", 
      "amount": 2,
      "type": "expense",
      "description": "Sacar de R$ 2,00"
    }
  ]
}
```
# Configurações Supabase

Documentação para configuração do Supabase no projeto Bytebank.

## Email Templates

### Reset Password (`email-reset-password.html`)

Template customizado para email de recuperação de senha.

**Como aplicar no Supabase:**

1. **Authentication** → **Email Templates**
2. **Reset Password** → **Edit**
3. **Subject:** `Bytebank - Recuperar sua senha`
4. **Body:** Copiar conteúdo do arquivo `email-reset-password.html`
5. **Save template**

### Configurações necessárias

- **URL Configuration:** `http://localhost:3000/reset-password`
- **Email confirmations:** Desabilitado (para desenvolvimento)

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```
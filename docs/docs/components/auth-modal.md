# AuthModal e AuthModalSupabase

- `src/components/organisms/AuthModal/AuthModal.tsx` - fluxo com **`useAuth`** (`AuthContext`), adequado ao protótipo/mock.
- `src/components/organisms/AuthModal/AuthModalSupabase.tsx` - **cadastro e login** com `signUpUser`, `signInUser`, `resetPassword` de `@/lib/auth/supabase-client-actions`. Props extras para mensagem de erro.

Ambos usam o [Modal](./modal), `Button`, ícones MUI de visibilidade de senha e o mesmo `AuthModal.module.scss`.

## Variantes

`signup` | `login` - define campos, textos e imagem lateral (`AUTH_CONFIG` no arquivo).

## Props

### AuthModal

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isOpen` | `boolean` | - |
| `onClose` | `() => void` | - |
| `variant` | `'signup' \| 'login'` | - |

### AuthModalSupabase

As mesmas acima, mais:

| Prop | Tipo | Descrição |
|------|------|-----------|
| `errorMessage` | `string \| null \| undefined` | Mensagem de erro externa |

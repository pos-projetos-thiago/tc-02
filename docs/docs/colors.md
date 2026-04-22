# Cores

O sistema de cores do Bytebank transmite confiança e leitura clara em textos e estados (ação, destaque, erro).

## Cores principais

### Primary (identidade)
- **Variável:** `$color-primary`
- **Hex:** `#004D61`
- **Uso:** base da marca, blocos e elementos principais

### Accent (chamada e destaque)
- **Variável:** `$color-accent`
- **Hex:** `#FF5031`
- **Uso:** CTAs fortes, alertas visíveis, foco

### Error
- **Variável:** `$color-error`
- **Hex:** `#BF1313`
- **Uso:** validação, mensagens de falha

## Neutros

- `$color-white` — `#FFFFFF`
- `$color-black` — `#000000`
- Escala de cinza em `gray-50` … `gray-500` (fundos, bordas, texto secundário)

Tabela de referência rápida (detalhe no repositório em `src/styles/_colors.scss`):

| Variável        | Uso comum        |
|-----------------|------------------|
| `gray-50`       | Fundo claro      |
| `gray-200`      | Bordas, divisórias |
| `gray-400/500`  | Texto secundário, desativado |

## Cores de apoio (destaques)

Uso moderado, para gráficos e cartões: blue, purple, orange, pink, green (definidas no mesmo arquivo de tokens).

## Gradientes

- **Primary:** ex.: hero — combinação documentada no código com fundo claro/escuro conforme o bloco

## Uso no SCSS

```scss
@import '@/styles/colors';

.card {
  background: $color-white;
  color: $color-primary;
  border: 1px solid $color-gray-200;
}
```

## Acessibilidade

Combinações comuns (texto sobre fundo) foram consideradas no projeto para contraste legível. Ao criar pares novos, valide com ferramenta de contraste (WCAG).

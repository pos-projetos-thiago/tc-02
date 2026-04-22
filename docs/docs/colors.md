# Cores

**Fonte única:** `src/styles/_colors.scss`. O que segue é o que existe no arquivo; o uso em cada tela depende do componente (importe a variável e veja o SCSS do componente).

## Variáveis (como no código)

### Principais e estado

| Variável | Valor |
|----------|--------|
| `$color-primary` | `#004D61` |
| `$color-accent` | `#FF5031` |
| `$color-error` | `#BF1313` |

### Destaque (paleta auxiliar)

| Variável | Valor |
|----------|--------|
| `$color-blue` | `#2567F9` |
| `$color-purple` | `#8F3CFF` |
| `$color-orange` | `#F1823D` |
| `$color-pink` | `#FF3C82` |
| `$color-green` | `#47A138` |

### Neutros e texto

| Variável | Valor |
|----------|--------|
| `$color-white` | `#FFFFFF` |
| `$color-black` | `#000000` |
| `$color-gray-50` | `#F8F8F8` |
| `$color-gray-200` | `#DEE9EA` |
| `$color-gray-300` | `#CBCBCB` |
| `$color-gray-400` | `#767676` |
| `$color-gray-500` | `#8B8B8B` |
| `$color-mint-bg` | `#E4EDE3` |
| `$color-text-secondary` | `#444444` |

### Gradiente

| Variável | Valor |
|----------|--------|
| `$gradient-primary` | `linear-gradient(180deg, $color-primary 0%, $color-white 100%)` |

## Uso global (`globals.scss`)

No `body`, o texto padrão usa `color: $color-primary` e o fundo `background-color: $color-black`. Isso não significa que todo título no app seja sempre “identidade primary” em todos os blocos; muitos componentes sobrescrevem cor (por exemplo texto preto em cartões brancos).

## Onde entra cada cor (exemplos reais, não regra fixa)

- **`$color-green`:** muito usada para ações positivas, bordas de foco e botões “primários” no estilo do `Button` (ver `Button.module.scss`).
- **`$color-primary`:** marca, destaques, bordas de outline em alguns componentes.
- **`$color-accent`:** variante `accent` do `Button` e destaques pontuais.
- **`$color-error`:** validação e erros (ex.: `AuthModal`).
- **Grises e `$color-text-secondary`:** bordas, texto secundário, estados desativados.

Para um mapeamento exato “tela a tela”, abra o `*.module.scss` do componente.

## Import

```scss
@import '@/styles/colors';
```

(Conforme o alias do projeto; em muitos arquivos o padrão é `@/styles/...`.)

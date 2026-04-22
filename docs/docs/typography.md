# Tipografia

**Fonte única:** `src/styles/_typography.scss`. A família **Inter** é referenciada em `$font-family-base` e carregada no app (veja o `layout` do Next.js).

A base de **rem** vem do `html { font-size: 62.5% }` em `globals.scss` (1 rem ≈ 10 px no cálculo mental do time).

## Variáveis de tamanho (`$font-size-*`)

| Variável | Valor em SCSS | Equiv. aprox. (com base 10) |
|----------|----------------|-------------------------------|
| `$font-size-xs` | `1.3rem` | 13 px |
| `$font-size-sm` | `1.4rem` | 14 px |
| `$font-size-base` | `1.6rem` | 16 px |
| `$font-size-md` | `1.8rem` | 18 px |
| `$font-size-lg` | `2.0rem` | 20 px |
| `$font-size-xl` | `2.5rem` | 25 px |
| `$font-size-2xl` | `3.0rem` | 30 px |
| `$font-size-3xl` | `3.6rem` | 36 px |
| `$font-size-4xl` | `4.8rem` | 48 px |

## Peso (`$font-weight-*`)

| Variável | Valor |
|----------|--------|
| `$font-weight-light` | 300 |
| `$font-weight-regular` | 400 |
| `$font-weight-medium` | 500 |
| `$font-weight-semibold` | 600 |
| `$font-weight-bold` | 700 |

## Altura de linha (`$line-height-*`)

| Variável | Valor |
|----------|--------|
| `$line-height-tight` | 1.2 |
| `$line-height-base` | 1.5 |
| `$line-height-relaxed` | 1.75 |

## Função `rem()` em `src/styles/_functions.scss`

Conversão de px para rem: `rem(24)` gera o `calc` equivalente. Útil quando o valor ainda está pensado em pixels.

## Import

```scss
@import '@/styles/typography';
```

## Boas práticas

1. Use as variáveis do arquivo em vez de números soltos, para mudar tudo de um lugar só
2. Prefira `rem` (ou a função `rem()`) no que for tamanho tipográfico ou layout sensível a zoom
3. Quem manda no “tamanho de título” em cada tela é o SCSS do componente, não esta página - confira o `*.module.scss` correspondente

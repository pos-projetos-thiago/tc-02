# Tipografia

O Bytebank utiliza a fonte **Inter** do Google Fonts, com um sistema REM baseado em múltiplos de 10 para facilitar cálculos.

## Fonte

- **Font Family**: `'Inter', sans-serif`
- **Carregamento**: Google Fonts via Next.js
- **Fallback**: sans-serif

## Sistema REM (Base 10)

O projeto usa `font-size: 62.5%` no elemento `<html>`, fazendo com que:
- **1rem = 10px**
- **1.6rem = 16px**
- **2.4rem = 24px**

Isso facilita muito a conversão mental de pixels para rem!

## Escala Tipográfica

| Variável | Valor | Pixels | Uso |
|----------|-------|--------|-----|
| `$font-size-xs` | 1.3rem | 13px | Textos auxiliares muito pequenos |
| `$font-size-sm` | 1.4rem | 14px | Textos auxiliares, legendas |
| `$font-size-base` | 1.6rem | 16px | **Texto padrão do body** |
| `$font-size-md` | 1.8rem | 18px | Textos de destaque, subtítulos |
| `$font-size-lg` | 2.0rem | 20px | Subtítulos |
| `$font-size-xl` | 2.5rem | 25px | Títulos H2 |
| `$font-size-2xl` | 3.0rem | 30px | **Títulos H1** |
| `$font-size-3xl` | 3.6rem | 36px | Títulos principais (Hero) |
| `$font-size-4xl` | 4.8rem | 48px | Display, títulos gigantes |

## Font Weights

| Variável | Valor | Uso |
|----------|-------|-----|
| `$font-weight-regular` | 400 | Texto corpo |
| `$font-weight-medium` | 500 | Leve ênfase |
| `$font-weight-semibold` | 600 | Subtítulos, destaques |
| `$font-weight-bold` | 700 | **Títulos, botões** |

## Line Heights

| Variável | Valor | Uso |
|----------|-------|-----|
| `$line-height-tight` | 1.2 | Títulos |
| `$line-height-base` | 1.5 | **Textos padrão** |
| `$line-height-relaxed` | 1.75 | Parágrafos longos |

## Exemplos de Uso

### Em SCSS

```scss
@import '@/styles/typography';

h1 {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}

p {
  font-size: $font-size-base;
  line-height: $line-height-base;
}

.small-text {
  font-size: $font-size-sm;
  color: $color-gray-400;
}
```

### Conversão Rápida

Para converter pixels em rem:
- 16px → 1.6rem
- 24px → 2.4rem
- 32px → 3.2rem
- 48px → 4.8rem

Basta dividir por 10! 🎯

## Boas Práticas

1. **Use sempre variáveis** ao invés de valores fixos
2. **Prefira rem** ao invés de px para acessibilidade
3. **Mantenha a hierarquia**: H1 > H2 > H3 > body
4. **Line-height adequado**: Tight para títulos, Base para textos

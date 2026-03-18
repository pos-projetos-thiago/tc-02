# Design System - Sistema de Estilos

## 📐 Estrutura de Arquivos

```
src/styles/
├── _colors.scss       → Cores e gradientes
├── _functions.scss    → Funções utilitárias (conversão px → rem)
├── _typography.scss   → Tamanhos de fonte, pesos e line-heights
├── _breakpoints.scss  → Media queries e responsividade
└── globals.scss       → Estilos globais e reset
```

## 🎨 Como Usar

### 0. Fonte Inter

A fonte **Inter** está configurada no projeto com fallback para `sans-serif`:

```scss
$font-family-base: 'Inter', sans-serif;
```

A fonte é carregada automaticamente pelo Next.js através do `layout.tsx`.

### 1. Sistema REM (Base 10)

O projeto usa `font-size: 62.5%` no `html`, fazendo **1rem = 10px** para facilitar cálculos mentais.

#### Conversão para REM

```scss
// Antes (px)
.elemento {
  font-size: 18px;
  padding: 24px;
  margin: 32px 16px;
}

// Depois (rem direto - 10px = 1rem)
.elemento {
  font-size: 1.8rem;      // 18px
  padding: 2.4rem;        // 24px
  margin: 3.2rem 1.6rem;  // 32px 16px
}

// Use a função rem() se preferir
.elemento {
  padding: rem(24);  // também funciona
}
```

### 2. Variáveis de Tipografia

Use sempre as variáveis de `_typography.scss` ao invés de valores fixos:

```scss
@import '../../../styles/typography';

h1 {
  font-size: $font-size-2xl;      // 3.0rem = 30px
  font-weight: $font-weight-bold; // 700
  line-height: $line-height-tight; // 1.2
}

p {
  font-size: $font-size-base;      // 1.6rem = 16px
  line-height: $line-height-base;  // 1.5
}
```

#### Escala de Font Sizes Disponíveis

| Variável          | Valor    | Equivalente em px |
|-------------------|----------|-------------------|
| `$font-size-xs`   | 1.3rem   | 13px              |
| `$font-size-sm`   | 1.4rem   | 14px              |
| `$font-size-base` | 1.6rem   | 16px              |
| `$font-size-md`   | 1.8rem   | 18px              |
| `$font-size-lg`   | 2.0rem   | 20px              |
| `$font-size-xl`   | 2.5rem   | 25px              |
| `$font-size-2xl`  | 3.0rem   | 30px              |
| `$font-size-3xl`  | 3.6rem   | 36px              |
| `$font-size-4xl`  | 4.8rem   | 48px              |

**Nota:** As variáveis de tipografia já estão em `rem`. Use a função `rem()` apenas para espaçamentos, tamanhos de elementos, etc.

### 3. Container Responsivo

Use o mixin `container-padding` para aplicar padding lateral e max-width automaticamente:

```scss
@import '../../../styles/breakpoints';

.container {
  @include container-padding;
  // Adiciona:
  // - max-width: 192rem (1920px)
  // - padding: 0 36rem (360px) no desktop
  // - padding: 0 6rem (60px) no tablet
  // - padding: 0 2.4rem (24px) no mobile
  // - margin: 0 auto (centraliza)
}
```

### 4. Breakpoints

```scss
@import '../../../styles/breakpoints';

.elemento {
  // Desktop first (1920px+)
  width: 100%;
  
  @include tablet {
    // Tablet (720px - 1919px)
    width: 80%;
  }
  
  @include mobile {
    // Mobile (até 719px)
    width: 100%;
  }
}
```

### 5. Cores

```scss
@import '../../../styles/colors';

.botao {
  background-color: $color-primary-base;
  color: $color-white;
  
  &:hover {
    background-color: $color-accent;
  }
}
```

## ✅ Checklist de Boas Práticas

- [ ] Use `rem` ao invés de `px` em todos os componentes (ex: `2.4rem` ao invés de `24px`)
- [ ] Use variáveis de tipografia (`$font-size-*`, `$font-weight-*`)
- [ ] Use variáveis de cores (`$color-*`)
- [ ] Use `@include container-padding` nos containers principais
- [ ] Use mixins de breakpoint (`@include mobile`, `@include tablet`)
- [ ] Importe os arquivos na ordem correta:
  ```scss
  @import '../../../styles/colors';
  @import '../../../styles/functions';
  @import '../../../styles/typography';
  @import '../../../styles/breakpoints';
  ```

## 🎯 Benefícios

1. **Consistência**: Todos os tamanhos seguem o Design System
2. **Acessibilidade**: Usuários podem ajustar o tamanho da fonte no browser
3. **Responsividade**: Container com max-width evita problemas em telas ultra wide
4. **Manutenibilidade**: Mudanças centralizadas em variáveis
5. **Cálculos Fáceis**: Base 10 facilita conversões mentais (16px = 1.6rem)

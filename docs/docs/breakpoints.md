# Breakpoints

O layout usa variáveis e mixins em `src/styles/_breakpoints.scss` para alinhar media queries a um único critério.

## Faixas

| Nome     | Regra (largura)        | Uso sugerido        |
|----------|------------------------|----------------------|
| Mobile   | `max-width: 719px`     | Telefones, telas estreitas |
| Tablet   | `720px` a `1023px`     | tablets, notebooks menores |
| Desktop  | `min-width: 1024px`     | largura de trabalho padrão |
| Container amplo | `min-width: 1920px` | telas muito largas, padding do container |

## Mixins

Use os mixins para manter a mesma lógica em todos os módulos SCSS:

```scss
@include mobile { /* ... */ }
@include tablet { /* ... */ }
@include desktop { /* ... */ }
```

## Espaçamento do container

O mixin `container-padding` aplica `max-width`, centralização e `padding` horizontal com:

- **Desktop padrão:** `36rem` (laterais)
- **Tablet (720px–1919px):** `6rem`
- **Mobile (até 719px):** `2.4rem`

A largura máxima do conteúdo é `192rem` (equivalente a 1920px com base 10 no `rem` do projeto).

## Variáveis principais

```scss
$bp-mobile-max: 719px;
$bp-tablet-min: 720px;
$bp-tablet-max: 1023px;
$bp-desktop-min: 1024px;
$bp-container-wide-min: 1920px;
```

Mantenha estes números como fonte única da verdade: ao ajustar um intervalo, atualize o arquivo e, se necessário, esta documentação.

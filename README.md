# Gerenciamento Financeiro

Aplicação de gerenciamento financeiro com Next.js, TypeScript e SCSS.

## Rodar o projeto

```bash
yarn install
yarn dev
```

Abre em http://localhost:3000

## Storybook

```bash
yarn storybook
```

Abre em http://localhost:6006

## Tecnologias

- Next.js 16
- TypeScript
- SCSS Modules
- Storybook
- Atomic Design

## Estrutura de Componentes

Seguindo Atomic Design:

```
src/components/
├── atoms/          # Componentes básicos (Button, Input, etc)
├── molecules/      # Combinação de atoms (FormField, Card, etc)
├── organisms/      # Seções complexas (Header, TransactionList, etc)
└── templates/      # Layouts de páginas
```

## Breakpoints

- Mobile: até 719px
- Tablet: 720px - 1919px
- Desktop: 1920px+

Usar nos estilos:

```scss
@import '@/styles/breakpoints';

.exemplo {
  // mobile por padrão
  padding: 16px;
  
  @include tablet {
    padding: 24px;
  }
  
  @include desktop {
    padding: 32px;
  }
}
```

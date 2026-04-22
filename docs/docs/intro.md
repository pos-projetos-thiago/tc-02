# Bytebank Design System

Bem-vindo à documentação do design system do **Bytebank**: a aplicação de gestão financeira (Next.js, TypeScript e SCSS) compartilha estes fundamento visuais e de componentes.

## Objetivo

Manter consistência entre telas, reduzir decisões ad hoc e documentar o que o time e a disciplina Pós-Tech possam reutilizar com clareza.

## Organização (Atomic Design)

- **Átomos:** partes básicas (ex.: `Button`, `MenuButton`)
- **Moléculas:** blocos compostos (ex.: cartões, campos)
- **Organismos:** seções completas (ex.: hero, modais, navegação)
- **Templates (evolução):** layouts de página, quando a fase do produto exigir

## No que esta documentação ajuda

- **Design tokens** — paleta, tipografia e regras de [breakpoint](./breakpoints)
- **Componentes** — variantes, props e exemplos (ex.: [Button](./components/button))

## Tecnologias do app

- Next.js 16, React, TypeScript
- SCSS modules, escopo local
- MUI (ícones e parte da UI), Supabase (auth e dados) quando aplicável

## Como importar

Os componentes vivem em `src/components/`. Ajuste o alias do seu `tsconfig` (ex.: `@/components/...`):

```tsx
import { Button } from '@/components/atoms/Button';

export default function Example() {
  return <Button variant="primary">Abrir conta</Button>;
}
```

## Navegação

Use a barra lateral: comece por **Cores** e **Tipografia**, depois **Button** e demais páginas que forem adicionadas ao projeto.

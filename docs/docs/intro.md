# Bytebank Design System

Bem-vindo à documentação do design system do **Bytebank**. A aplicação de gestão financeira (Next.js, TypeScript e SCSS) reutiliza os mesmos **fundamentos visuais** e a mesma organização de **componentes** em todo o app.

## Objetivo

Manter consistência entre telas, reduzir decisões ad hoc e documentar o que o time e a disciplina Pós-Tech possam reutilizar com clareza.

## Organização (Atomic Design)

- **Átomos:** partes básicas (ex.: `Button`, `MenuButton`)
- **Moléculas:** blocos compostos (ex.: cartões, campos)
- **Organismos:** seções completas (ex.: hero, modais, navegação)
- **Templates (evolução):** layouts de página, quando a fase do produto exigir

## O que você encontra aqui

- **Design tokens** - paleta (`_colors.scss`), tipografia e [breakpoints](./breakpoints), alinhados a `src/styles/`
- **Componentes** - [visão geral](./components/catalog) e uma página por componente (menu **Átomos** / **Moléculas** / **Organismos** / **Templates**). O [Button](./components/button) tem o texto mais completo; as outras trazem caminho, papel e props

## Tecnologias do app

- **Front:** Next.js 16, React, TypeScript
- **Estilo:** SCSS modules (estilos com escopo por componente)
- **Outros:** MUI (ícones e parte da interface) e Supabase (login e dados), quando a tela depender deles

## Como importar

Os componentes ficam em `src/components/`. O projeto costuma usar um **alias** no `tsconfig` (por exemplo `@/components/...`) para encurtar os imports:

```tsx
import { Button } from '@/components/atoms/Button';

export default function Example() {
  return <Button variant="primary">Abrir conta</Button>;
}
```

## Navegação

Pelo **menu à esquerda** (ou sanduíche no celular): **Cores**, **Tipografia**, **Breakpoints**, depois **Componentes** (catálogo + grupos com cada peça). **Button** concentra o exemplo mais longo; o restante está no mesmo padrão com props e descrição curta.

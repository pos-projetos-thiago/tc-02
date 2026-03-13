# Bytebank Design System

Bem-vindo à documentação do **Design System do Bytebank**, uma aplicação de gerenciamento financeiro desenvolvida com Next.js, TypeScript e SCSS.

## 🎯 Objetivo

Este Design System foi criado para garantir consistência visual e reutilização de componentes em toda a aplicação, seguindo os princípios de **Atomic Design**.

## 🏗️ Estrutura

O projeto está organizado em:

- **Atoms**: Componentes básicos e indivisíveis (Button, Input, etc)
- **Molecules**: Combinação de átomos (FormField, Card, etc)
- **Organisms**: Componentes complexos (Header, Footer, Hero, etc)
- **Templates**: Layouts de páginas

## 🎨 Fundamentos

### Sistema de Cores

O Bytebank utiliza uma paleta cuidadosamente selecionada que inclui:
- Cor primária: `#004D61` (verde-azulado)
- Cor de destaque: `#FF5031` (laranja)
- Cores neutras em escala (gray-50 a gray-500)
- Cores auxiliares (blue, purple, orange, pink, green)

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Sistema REM**: Base 10 (1rem = 10px)
- **Escala tipográfica**: De 1.3rem (13px) até 4.8rem (48px)

### Responsividade

- **Mobile**: até 719px
- **Tablet**: 720px - 1919px
- **Desktop**: 1920px+

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **SCSS Modules** - Estilização com escopo local
- **Material-UI** - Componentes e ícones
- **React Hook Form + Zod** - Formulários e validação

## 📦 Como usar

Todos os componentes estão disponíveis em `src/components/` e podem ser importados diretamente:

```tsx
import { Button } from '@/components/atoms/Button';
import { Hero } from '@/components/organisms/Hero';

export default function Page() {
  return (
    <>
      <Hero />
      <Button variant="primary">Abrir conta</Button>
    </>
  );
}
```

## 📚 Navegação

Explore a documentação através do menu lateral para conhecer:
- **Design Tokens**: Cores, tipografia e espaçamentos
- **Componentes**: Documentação completa de cada componente
- **Guidelines**: Boas práticas e padrões de uso

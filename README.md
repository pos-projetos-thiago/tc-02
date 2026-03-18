# Bytebank - Gerenciamento Financeiro

[![CI](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml/badge.svg)](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml)

Aplicação de gerenciamento financeiro com Next.js 16, TypeScript, SCSS e Material-UI.

**Tech Challenge - Fase 1 | FIAP Pós-Tech**  
Desenvolvido por: **Thiago Soares**

## 🚀 Rodar o Projeto

### Aplicação Principal

```bash
yarn install
yarn dev
```

Abre em http://localhost:3000

### Documentação do Design System (Docusaurus)

```bash
yarn docs
```

Abre em http://localhost:4000

📚 **A documentação completa está disponível em:** `/docs`

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **SCSS Modules** - Estilização com escopo local
- **Material-UI** - Componentes e ícones
- **Docusaurus** - Documentação do Design System
- **Atomic Design** - Metodologia de organização

## Estrutura de Componentes

Seguindo Atomic Design:

```
src/components/
├── atoms/          # Componentes básicos (Button, Input, etc)
├── molecules/      # Combinação de atoms (FormField, Card, etc)
├── organisms/      # Seções complexas (Header, TransactionList, etc)
└── templates/      # Layouts de páginas
```

## 🎨 Design System

### Sistema de Cores
- **Primary**: `#004D61` (verde-azulado)
- **Accent**: `#FF5031` (laranja)
- **Neutros**: Escala de gray (50-500)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Sistema REM**: Base 10 (1rem = 10px)
- **Escala**: 1.3rem (13px) até 4.8rem (48px)

### Breakpoints
- **Mobile**: até 719px
- **Tablet**: 720px - 1919px
- **Desktop**: 1920px+

📖 **Documentação completa**: Execute `yarn docs` para acessar a documentação interativa do Design System.

## 📁 Estrutura do Projeto

```
tc-01/
├── docs/                 # Documentação Docusaurus
├── public/              # Assets estáticos
├── src/
│   ├── app/            # Pages Next.js
│   ├── components/     # Atomic Design
│   │   ├── atoms/     
│   │   ├── molecules/ 
│   │   └── organisms/  
│   └── styles/         # Design System (SCSS)
│       ├── _colors.scss
│       ├── _typography.scss
│       ├── _breakpoints.scss
│       └── globals.scss
└── README.md
```

## 🔗 Links

- **Repositório**: https://github.com/pos-projetos-thiago/tc-01
- **Deploy**: (em breve)
- **Design**: [Figma](link-do-figma)

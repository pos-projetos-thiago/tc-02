# Bytebank - Gerenciamento Financeiro

[![CI](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml/badge.svg)](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml)

Aplicação de gerenciamento financeiro com Next.js 16, TypeScript, SCSS e Material-UI.

**Tech Challenge - Fase 1 | FIAP Pós-Tech**  
Desenvolvido por: **Thiago Soares**

## 🤘 Rodar o projeto

### Aplicação Principal

```bash
yarn install
yarn dev
```

Abre em http://localhost:3000

### Autenticação (mock, sem backend)

- **Conta de demonstração:** `demo@bytebank.com` / `123456` (não grava cadastro; só entra).
- **Cadastro pelo app:** os dados vão para o **localStorage** do navegador, chave **`bytebank-users`** (array JSON com `name`, `email`, `password`). Para ver quem se cadastrou: DevTools → **Aplicativo** / **Application** → **Armazenamento local** → seu origin → inspecione `bytebank-users`.
- **Sessão logada:** chave **`bytebank-session`** (objeto com `name` e `email`). **Sair** remove só a sessão; os cadastros em `bytebank-users` continuam até você limpar o armazenamento ou apagar a chave manualmente.

Código: `src/lib/auth/mock-storage.ts`, `src/lib/auth/auth-store.ts`, `src/contexts/AuthContext.tsx`.

### Documentação do Design System (Docusaurus)

```bash
yarn docs
```

Abre em http://localhost:4000. A documentação do design system fica na pasta `/docs` do repositório.

## Tecnologias

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
├── atoms/          # Componentes básicos (Button, MenuButton, etc)
├── molecules/      # (será usado em fases futuras - FormField, Card, etc)
├── organisms/      # Seções complexas (Navbar, Hero, Footer, NotFound, etc)
└── templates/      # (será usado em fases futuras - layouts de páginas)
```

## Design system

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

Execute `yarn docs` para abrir a documentação interativa do design system.

## Estrutura do projeto

```
tc-01/
├── docs/               # Documentação Docusaurus
├── public/             # Assets estáticos
├── src/
│   ├── app/            # Pages Next.js (/, /dashboard)
│   ├── contexts/       # AuthProvider (sessão mock)
│   ├── lib/auth/       # Mock de usuários e sessão (localStorage)
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

## Links

- **Repositório**: https://github.com/pos-projetos-thiago/tc-01
- **Deploy**: (em breve)

# Bytebank - Gerenciamento Financeiro

[![CI](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml/badge.svg)](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml)

Aplicação de gerenciamento financeiro com Next.js 16, TypeScript, SCSS e autenticação real via Supabase.

**Tech Challenge - Fase 1 | FIAP Pós-Tech**  
Desenvolvido por: **Thiago Soares**

## 🤘 Rodar o projeto

### Aplicação Principal

```bash
yarn install
yarn dev
```

Abre em http://localhost:3000

### Autenticação (Supabase)

- **Banco real:** PostgreSQL via Supabase
- **Persistência:** Funciona entre navegadores e dispositivos
- **Segurança:** JWT tokens, Row Level Security (RLS)
- **Cadastro:** Crie sua conta pelo app
- **Login:** Use email/senha criados

**Configuração:**
1. Configure as variáveis em `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

Código: `src/lib/supabase/`, `src/lib/auth/supabase-client-actions.ts`, `src/hooks/useSupabaseAuth.ts`.

### Documentação do Design System (Docusaurus)

```bash
yarn docs
```

Abre em http://localhost:4000. A documentação do design system fica na pasta `/docs` do repositório.

## Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **SCSS Modules** - Estilização com escopo local
- **Supabase** - Banco PostgreSQL e autenticação
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
│   ├── contexts/       # DashboardContext (state management)
│   ├── hooks/          # useSupabaseAuth (autenticação)
│   ├── lib/
│   │   ├── auth/       # Supabase authentication actions
│   │   └── supabase/   # Supabase client configuration
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

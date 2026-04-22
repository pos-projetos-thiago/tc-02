# Bytebank

<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pos-projetos-thiago/tc-01/ci.yml?style=for-the-badge&label=CI&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui)
![Sass](https://img.shields.io/badge/Sass-Modules-CC6699?style=for-the-badge&logo=sass)
![Docusaurus](https://img.shields.io/badge/Docusaurus-Design%20System-3ECC5F?style=for-the-badge&logo=docusaurus&logoColor=white)

</div>

Aplicação completa de **gerenciamento financeiro** desenvolvida com Next.js 16, TypeScript e design system próprio. Inclui autenticação real com **Supabase**, dashboard responsivo e documentação técnica completa.

> *FIAP Pós-Tech · Tech Challenge - Fase 1*  
> **Thiago Soares · RM 373636**

<!-- Vídeo -->

## Principais funcionalidades

- **Autenticação completa** com Supabase (registro, login, sessão persistente)
- **Dashboard financeiro** com saldo em tempo real e extrato
- **Gestão de transações** (adicionar, editar, excluir)
- **Múltiplos tipos** de transação (depósito, saque, transferência, investimentos)
- **100% responsivo** (mobile-first design)
- **Design system** documentado com 25+ componentes
- **Performance otimizada** com SCSS Modules e Next.js 16

---

## 🤘 Rodar o projeto

### Aplicação (Next.js)

```bash
yarn install
yarn dev
```

Abre em [http://localhost:3000](http://localhost:3000)

### Autenticação (Supabase)

- **Banco:** PostgreSQL (Supabase)
- **Sessão:** portável entre navegadores e aparelhos, com JWT e **Row Level Security (RLS)**
- **Conta:** cadastro e login com e-mail e senha no próprio app

**Variáveis (`.env.local`):**

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

Código de referência: `src/lib/supabase/`, `src/lib/auth/supabase-client-actions.ts`, `src/hooks/useSupabaseAuth.ts`.

### Documentação do design system (Docusaurus)

```bash
yarn docs
```

Abre em [http://localhost:4000](http://localhost:4000). O site fica no diretório `docs/` do repositório (tokens, componentes, guias).

---

## Stack tecnológica

| **Área**             | **Tecnologia**                    | **Finalidade**                  |
| -------------------- | ---------------------------------- | ------------------------------- |
| **Framework**        | Next.js 16, App Router            | Base da aplicação               |
| **Linguagem**        | TypeScript 5                      | Tipagem e desenvolvimento       |
| **Styling**          | SCSS Modules                       | Estilos componentizados         |
| **Interface**        | Material UI + Atomic Design        | Componentes e ícones            |
| **Backend**          | Supabase (PostgreSQL + Auth)      | Banco de dados e autenticação   |
| **Formulários**      | React Hook Form + Zod              | Validação e controle de estado  |
| **Documentação**     | Docusaurus 3                      | Design system e guias técnicos  |
| **Testes**           | Jest + React Testing Library       | Testes unitários e integração   |

---

## Design system

### Cores principais
- **Primary:** `#004D61` (azul Bytebank)
- **Accent:** `#FF5031` (laranja destaque)  
- **Neutros:** escala de cinza (50–500)

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Sistema:** escala em `rem` com base 10
- **Pesos:** 300, 400, 500, 600, 700

### Responsividade
- **Mobile:** até `719px`
- **Tablet:** `720px` – `1023px`  
- **Desktop:** `1024px` em diante
- **Large:** `1920px` + (container ajustado)

> **Documentação completa:** Execute `yarn docs` ou acesse `docs/docs/`

---

## Estrutura do projeto

```
tc-01/
├── docs/                    # Site Docusaurus (design system)  
├── public/                  # Assets estáticos
├── src/
│   ├── app/                 # Pages & API routes (App Router)
│   ├── components/          # Atomic Design (atoms → organisms)
│   ├── hooks/               # Custom React hooks  
│   ├── lib/                 # Utilitários (Supabase, validações)
│   └── styles/              # SCSS globals e tokens
├── __tests__/               # Testes (Jest + RTL)
└── README.md
```

---

## Links importantes

| **Recurso**        | **URL**                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| **Repositório**     | [github.com/pos-projetos-thiago/tc-01](https://github.com/pos-projetos-thiago/tc-01) |
| **Documentação**    | `yarn docs` → [localhost:4000](http://localhost:4000)                  |
| **Deploy**          | *Em breve*                                                           |

---

<div align="center">

**Desenvolvido com ❤️ e 🤘 para o Tech Challenge**

</div>

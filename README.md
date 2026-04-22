# Bytebank

<div align="center">

<a href="https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml"><img src="https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-1a1a1a?style=flat-square&logo=next.js&logoColor=white&labelColor=004D61" alt="Next.js 16"></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=004D61" alt="TypeScript 5"></a>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB&labelColor=004D61" alt="React 19"></a>
<br>
<a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=1a1a1a&labelColor=004D61" alt="Supabase"></a>
<a href="https://mui.com/"><img src="https://img.shields.io/badge/MUI-7-007FFF?style=flat-square&logo=mui&logoColor=white&labelColor=004D61" alt="MUI 7"></a>
<a href="https://sass-lang.com/"><img src="https://img.shields.io/badge/Sass-modules-CC6699?style=flat-square&logo=sass&logoColor=white&labelColor=004D61" alt="Sass"></a>
<a href="https://docusaurus.io/"><img src="https://img.shields.io/badge/Docusaurus-docs-3ECC5F?style=flat-square&logo=docusaurus&logoColor=1a1a1a&labelColor=004D61" alt="Docusaurus"></a>

</div>

Aplicação de **gerenciamento financeiro** com Next.js 16, TypeScript, SCSS e autenticação com **Supabase** (Postgres e sessão real entre dispositivos).

**FIAP Pós-Tech** · Tech Challenge - Fase 1  
**Thiago Soares** · RM 373636

<!-- Vídeo -->

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

## Stack (resumo)

| Área        | Escolha                            |
| ----------- | ---------------------------------- |
| Framework   | Next.js 16, App Router             |
| Linguagem   | TypeScript                         |
| Estilo      | SCSS Modules                       |
| UI          | Material UI (ícones e componentes) |
| Dados/Auth  | Supabase                           |
| Formulários | React Hook Form + Zod              |
| Docs        | Docusaurus (design system)         |
| Arquitetura | Atomic Design em `src/components/` |

---

## Design system (visão rápida)

- **Primary:** `#004D61` · **Accent:** `#FF5031` · **Neutros:** escala de cinza (50–500)
- **Tipografia:** Inter (Google Fonts), escala em `rem` com base 10
- **Breakpoints:** mobile até `719px` · tablet `720px`–`1023px` · desktop a partir de `1024px` · ajuste de container em telas muito largas a partir de `1920px`

Detalhes e exemplos: `yarn docs` ou a pasta `docs/docs/`.

---

## Estrutura de pastas (trecho)

```
tc-01/
├── docs/                 # Site Docusaurus (design system)
├── public/
├── src/
│   ├── app/              # Rotas (/, /dashboard, …)
│   ├── components/       # Atomic Design: atoms, molecules, organisms
│   ├── hooks/
│   ├── lib/              # Supabase, auth
│   └── styles/           # _colors, _typography, _breakpoints, globals
└── README.md
```

---

## Links

- **Repositório:** [github.com/pos-projetos-thiago/tc-01](https://github.com/pos-projetos-thiago/tc-01)
- **Deploy:** a definir

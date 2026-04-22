# Bytebank — gestão financeira

<div align="center">

[![CI](https://img.shields.io/github/actions/workflow/status/pos-projetos-thiago/tc-01/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI&labelColor=0c252c)](https://github.com/pos-projetos-thiago/tc-01/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)

[![Supabase](https://img.shields.io/badge/Supabase-auth_%2B_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=1a1a1a)](https://supabase.com/)
[![MUI](https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Sass](https://img.shields.io/badge/Sass-modules-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-docs-3ECC5F?style=for-the-badge&logo=docusaurus&logoColor=1a1a1a)](https://docusaurus.io/)

</div>

Aplicação de **gerenciamento financeiro** com Next.js 16, TypeScript, SCSS e autenticação com **Supabase** (Postgres e sessão real entre dispositivos).

**Tech Challenge — Fase 1 · FIAP Pós-Tech**  
**Autor:** Thiago Soares

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

| Área        | Escolha                          |
|------------|-----------------------------------|
| Framework  | Next.js 16, App Router            |
| Linguagem  | TypeScript                        |
| Estilo     | SCSS Modules                      |
| UI         | Material UI (ícones e componentes) |
| Dados/Auth | Supabase                          |
| Formulários| React Hook Form + Zod            |
| Docs       | Docusaurus (design system)        |
| Arquitetura| Atomic Design em `src/components/`|

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

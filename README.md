# Bytebank - Microfrontends

<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pos-projetos-thiago/tc-02/ci.yml?style=for-the-badge&label=CI&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Module Federation](https://img.shields.io/badge/Module%20Federation-Microfrontends-FF6B6B?style=for-the-badge&logo=webpack&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui)
![Sass](https://img.shields.io/badge/Sass-Modules-CC6699?style=for-the-badge&logo=sass)
![Docusaurus](https://img.shields.io/badge/Docusaurus-Design%20System-3ECC5F?style=for-the-badge&logo=docusaurus&logoColor=white)

</div>

**Aplicação avançada de gerenciamento financeiro** desenvolvida com arquitetura de **microfrontends**, containerizada com Docker e otimizada para ambientes cloud. Inclui filtros avançados, upload de anexos e performance otimizada.

> *FIAP Pós-Tech · Tech Challenge - Fase 2*  
> **Thiago Soares · RM 373636**

<img width="1918" height="916" alt="Image" src="https://github.com/user-attachments/assets/0296dcf3-4f31-4b17-9293-b774391d0887" />

## ✨ Principais funcionalidades

### **🏗️ Arquitetura Avançada**
- **Microfrontends** com Module Federation (apps independentes)
- **Containerização** completa com Docker + Docker Compose
- **Deploy otimizado** para ambientes cloud (Vercel)

### **💰 Funcionalidades Financeiras**
- **Dashboard financeiro** com gráficos avançados e análises
- **Gestão completa de transações** (CRUD + filtros avançados)
- **Upload de anexos** para comprovantes e documentos
- **Busca inteligente** e paginação otimizada

### **🎨 Experience & Design**
- **100% acessível** (WCAG 2.1, navegação teclado, screen readers)
- **Totalmente responsivo** (mobile-first design)
- **Design system** documentado com 25+ componentes
- **Validação avançada** com sugestões automáticas

### **⚡ Performance & Qualidade**
- **SSR/SSG** otimizado com Next.js 16
- **Testes automatizados** (Jest + React Testing Library)
- **CI/CD** com GitHub Actions + Docker
- **TypeScript** com tipagem estática completa

---

## 🤘 Rodar o projeto

### **🐳 Docker (Recomendado)**

```bash
# Rodar toda a arquitetura de microfrontends
docker-compose up -d

# Verificar se todos os serviços estão rodando
docker ps
```

**Serviços disponíveis:**
- 🏠 **Shell App** (host): [http://localhost:3000](http://localhost:3000)
- 📊 **Dashboard**: [http://localhost:3001](http://localhost:3001) 
- 💰 **Transactions**: [http://localhost:3002](http://localhost:3002)
- 📈 **Analytics**: [http://localhost:3003](http://localhost:3003)

### **⚙️ Desenvolvimento Local**

```bash
# Instalar dependências
yarn install

# Rodar shell app (orquestrador)
yarn dev

# Rodar microfrontends individualmente
yarn dev:dashboard     # Dashboard + gráficos
yarn dev:transactions  # CRUD transações  
yarn dev:analytics     # Relatórios + filtros
```

### **🧪 Testes**

```bash
# Rodar todos os testes
yarn test

# Testes em watch mode
yarn test:watch

# Coverage completo
yarn test:coverage
```

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

## 🏗️ Arquitetura de Microfrontends

### **📦 Estrutura Modular**

```
tc-02/
├── apps/                           # Microfrontends independentes
│   ├── shell/                      # 🏠 App principal (host)
│   │   ├── src/app/               # Next.js App Router
│   │   ├── webpack.config.js      # Module Federation
│   │   └── Dockerfile
│   ├── dashboard/                  # 📊 Dashboard + Analytics  
│   │   ├── src/components/        # Gráficos + Cards
│   │   ├── webpack.config.js      # Module Federation
│   │   └── Dockerfile
│   ├── transactions/               # 💰 Gestão de Transações
│   │   ├── src/features/          # CRUD + Filtros + Upload
│   │   ├── webpack.config.js      # Module Federation  
│   │   └── Dockerfile
│   └── analytics/                  # 📈 Relatórios Avançados
│       ├── src/reports/           # Charts + Filters + Export
│       ├── webpack.config.js      # Module Federation
│       └── Dockerfile
├── shared/                         # 📚 Bibliotecas compartilhadas
│   ├── components/                 # Design System (atoms → organisms)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utils + API + Auth
│   └── styles/                     # SCSS globals + tokens
├── docs/                           # 📖 Site Docusaurus (design system)
├── docker-compose.yml              # 🐳 Orquestração completa
└── README.md
```

### **🔗 Comunicação Entre Microfrontends**

- **Module Federation** - Compartilhamento de componentes
- **Shared Context** - Estado global (usuário, auth, tema)
- **Event Bus** - Comunicação assíncrona entre apps
- **Shared Routing** - Navegação unificada

---

## Links importantes

| **Recurso**      | **URL**                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| **Repositório**  | [github.com/pos-projetos-thiago/tc-02](https://github.com/pos-projetos-thiago/tc-02) |
| **Documentação** | `yarn docs` → [localhost:4000](http://localhost:4000)                  |
| **Deploy**       | [Em breve - Microfrontends + Docker](https://tc-02-thiago.vercel.app) |

---

<div align="center">

**Desenvolvido com ❤️ e 🤘 para o Tech Challenge**

</div>

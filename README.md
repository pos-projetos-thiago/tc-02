# Bytebank

<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pos-projetos-thiago/tc-02/ci.yml?style=for-the-badge&label=CI&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Single SPA](https://img.shields.io/badge/Single--SPA-Microfrontends-FF6B6B?style=for-the-badge)
![Material UI](https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui)
![Sass](https://img.shields.io/badge/Sass-Modules-CC6699?style=for-the-badge&logo=sass)
![Chart.js](https://img.shields.io/badge/Chart.js-Gráficos-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testes-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Autenticação-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docusaurus](https://img.shields.io/badge/Docusaurus-Design%20System-3ECC5F?style=for-the-badge&logo=docusaurus&logoColor=white)

</div>

Aplicação de gerenciamento financeiro pessoal desenvolvida para o **Tech Challenge Fase 2** da FIAP Pós-Tech. Evolução arquitetural utilizando Single SPA para separação modular da aplicação, com dashboard completo, gráficos, filtros avançados, CRUD de transações e integração com API REST autenticada via JWT.

> **FIAP Pós-Tech · Front-End Engineering · Tech Challenge — Fase 2**
> Thiago Soares · RM 373636

---

## Visão geral

Bytebank é uma aplicação bancária digital que permite gerenciar movimentações financeiras, visualizar saldo, investimentos e extrato detalhado com filtros avançados.

O projeto foi estruturado seguindo a proposta do Tech Challenge Fase 2, evoluindo a arquitetura para suportar separação modular:

- **Aplicação principal (`src/`)** — implementação completa em Next.js rodando em `localhost:3000`
- **Shell Single SPA (`apps/shell/`)** — abordagem arquitetural adotada para a Fase 2, rodando em `localhost:3010`, demonstrando a separação modular da aplicação
- **Componentes compartilhados (`apps/shared/`)** — biblioteca de componentes, hooks e utilitários reutilizáveis entre módulos

Ambas as versões se conectam à mesma API backend e compartilham a mesma base de componentes.

---

## Funcionalidades

**Autenticação**
- Cadastro e login com e-mail e senha via JWT
- Persistência de sessão em localStorage
- Logout com limpeza completa da sessão
- Modo de demonstração automático quando o backend não está disponível

**Dashboard financeiro**
- Saldo em conta com toggle de visibilidade
- Navegação por seções: Serviços, Transferências, Investimentos, Cartões, Minha Conta
- Gráfico de investimentos por categoria (Donut Chart com Chart.js)
- Serviços bancários (Pix, Empréstimo, Cartões, Seguro, Doações, Celular)
- Atualização de perfil do usuário (nome, e-mail, senha)

**Extrato e transações**
- Listagem completa de transações com data, tipo e valor
- Filtros avançados: tipo de transação, tipo de investimento, faixa de valor, período com DateRangePicker
- Busca textual em tempo real
- Paginação com controle de itens por página (5, 10, 20, 50)
- Criação de transações (Depósito, Saque, Transferência, Investimentos)
- Edição e exclusão de transações com confirmação
- Geração de extrato em PDF com resumo financeiro

**Upload e processamento**
- Upload de comprovantes com OCR via Hugging Face (extração de texto de imagens)
- Processamento inteligente de documentos financeiros com IA (análise de recibos)
- Suporte a drag and drop de arquivos

**Interface**
- Layout responsivo: mobile, tablet, desktop
- Design system com Atomic Design (atoms, molecules, organisms)
- SCSS Modules com tokens de cor, tipografia e breakpoints

---

## Arquitetura

O projeto adota uma arquitetura modular utilizando Single SPA como abordagem para separação de responsabilidades:

```
tc-02/
├── src/                          # Aplicação principal Next.js (porta 3000)
│   ├── app/                      # App Router
│   │   ├── dashboard/            # Dashboard + Transações + AI + OCR
│   │   └── api/                  # API Routes
│   ├── components/               # Atomic Design
│   │   ├── atoms/                # Button, Input, Toast, Loading...
│   │   ├── molecules/            # FilterBar, InvestmentChart...
│   │   ├── organisms/            # DashboardHero, DashboardExtract...
│   │   └── templates/            # NotFoundTemplate
│   ├── contexts/                 # DashboardContextJWT, FilterContext
│   ├── hooks/                    # useJWTAuth, useFilters, useOCR...
│   └── lib/                      # api/, ai/, pdf/, utils/
│
├── apps/
│   ├── shell/                    # Shell Single SPA (porta 3010)
│   │   └── src/
│   │       ├── app/              # Rotas: /, /dashboard, /transactions
│   │       ├── components/       # Componentes do shell
│   │       ├── contexts/         # Contextos compartilhados
│   │       ├── hooks/            # Hooks customizados
│   │       └── lib/              # Bibliotecas e utilitários
│   │
│   └── shared/                   # Biblioteca compartilhada
│       ├── components/           # Componentes reutilizáveis
│       ├── lib/                  # API client, utilitários
│       ├── styles/               # Tokens SCSS
│       └── types/                # Tipos TypeScript
│
└── .github/workflows/ci.yml     # CI/CD
```

### Evolução arquitetural

A estrutura do projeto demonstra a transição de uma arquitetura monolítica para uma abordagem modular:

- **Aplicação principal** (`src/`) contém todas as funcionalidades validadas
- **Shell Single SPA** (`apps/shell/`) representa a evolução arquitetural proposta no Tech Challenge Fase 2
- **Biblioteca compartilhada** (`apps/shared/`) centraliza componentes e lógica reutilizável

---

## Pré-requisitos

| Ferramenta | Versão |
|------------|--------|
| Node.js | 18 ou 20 LTS |
| Yarn | 1.x ou superior |
| Git | Qualquer versão recente |

---

## Clonando os repositórios

```bash
# Frontend
git clone https://github.com/pos-projetos-thiago/tc-02

# Backend
git clone https://github.com/pos-projetos-thiago/tc02-bytebank-api
```

---

## Como executar

O projeto pode ser executado de duas formas, representando as diferentes abordagens arquiteturais.

### Opção 1: Aplicação principal (recomendado para avaliação completa)

Você precisa de **dois terminais abertos**.

**Terminal 1 — Backend:**
```bash
cd tc02-bytebank-api
npm install
npm run dev
```
> Backend rodando em **http://localhost:4000**

**Terminal 2 — Frontend:**
```bash
cd tc-02
yarn install
yarn dev
```
> Aplicação rodando em **http://localhost:3000**

> **Arquitetura modular disponível:** O projeto também pode ser executado através do Shell Single SPA na porta **3010**, demonstrando a evolução arquitetural proposta no Tech Challenge Fase 2. Veja instruções na Opção 2 abaixo.

---

### Opção 2: Shell Single SPA (demonstração da evolução arquitetural)

Esta opção demonstra a abordagem modular com **Single SPA** adotada para o Tech Challenge Fase 2, conforme requisito de arquitetura de microfrontends.

> **Pré-requisito:** O backend precisa estar rodando (Terminal 1 acima)

**Terminal 3 — Shell:**
```bash
cd tc-02/apps/shell
yarn install
yarn dev
```
> Shell rodando em **http://localhost:3010**

> **Modo demonstração:** Se o backend não estiver disponível, o shell entra automaticamente em modo de demonstração, permitindo explorar a interface com dados simulados.

---

## Docker

O projeto está containerizado com Docker, permitindo executar frontend e backend de forma isolada. Todos os arquivos Docker ficam na **raiz do repositório**.

### Estrutura

```
tc-02/
├── Dockerfile                          # Imagem do frontend principal (porta 3000)
├── docker-compose.yml                  # Frontend principal + backend + nginx
└── apps/
    ├── shell/Dockerfile
    ├── dashboard/Dockerfile
    ├── transactions/Dockerfile
    └── analytics/Dockerfile
```

> ⚠️ **Pré-requisitos:**
> - O **Docker Desktop** deve estar aberto e rodando
> - O repositório do backend deve estar clonado na **mesma pasta pai** que `tc-02`:
> ```
> pasta-pai/
> ├── tc-02/               ← este repositório
> └── tc02-bytebank-api/   ← backend (deve existir)
> ```
> ```bash
> git clone https://github.com/pos-projetos-thiago/tc02-bytebank-api
> ```

> ⚠️ Os comandos devem ser executados sempre a partir da **raiz do projeto** (`tc-02/`).

```bash
# Subir frontend + backend
docker-compose up -d

# Acompanhar logs
docker-compose logs -f

# Parar
docker-compose down
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |

---

## Scripts disponíveis

### Aplicação principal

```bash
# Desenvolvimento
yarn dev               # Iniciar aplicação (porta 3000)
yarn build             # Build de produção
yarn start             # Executar build
yarn lint              # Verificar código
yarn test              # Executar testes
yarn test:watch        # Testes em watch mode
```

### Shell Single SPA

```bash
# Executar a partir da pasta apps/shell
yarn dev               # Iniciar shell (porta 3010)
yarn build             # Build do shell
yarn lint              # Verificar código
```

---

## Endpoints da API

Backend rodando em **http://localhost:4000**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/user` | Cadastrar usuário |
| POST | `/user/auth` | Login (retorna JWT) |
| PUT | `/user/profile` | Atualizar perfil |
| GET | `/account` | Buscar conta e transações |
| POST | `/account/transaction` | Criar transação |
| PUT | `/account/transaction/:id` | Editar transação |
| DELETE | `/account/transaction/:id` | Deletar transação |
| GET | `/health` | Health check |

> O backend usa MongoDB em memória. Os dados persistem durante a execução e são perdidos ao reiniciar.

---

## Stack tecnológica

| Área | Tecnologia |
|------|------------|
| Framework | Next.js 16 App Router |
| Linguagem | TypeScript 5 |
| UI Library | React 19 |
| Arquitetura | Single SPA (evolução modular) |
| Estilização | SCSS Modules |
| Componentes | Material UI 7 |
| Gráficos | Chart.js 4 + react-chartjs-2 |
| Formulários | React Hook Form + Zod |
| Autenticação | JWT + localStorage |
| IA / OCR | Hugging Face API, @ai-sdk/google, @ai-sdk/openai |
| PDF | jsPDF + html2canvas |
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose |
| Testes | Jest + React Testing Library |

---

## Design System

**Cores**

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | #004D61 | Ações, botões, links |
| Accent | #FF5031 | Destaques, alertas |
| Surface | #FFFFFF | Fundos de cards |
| Background | #F5F5F5 | Fundo da página |

**Tipografia**
- Fonte: Inter (Google Fonts)
- Pesos: 300, 400, 500, 600, 700

**Breakpoints**

| Nome | Faixa |
|------|-------|
| Mobile | até 719px |
| Tablet | 720px – 1023px |
| Desktop | 1024px+ |

---

## Testes

```bash
yarn test           # Executar testes
yarn test:watch     # Executar em watch mode
```

**Cobertura:**
- Componentes do dashboard
- Fluxo de autenticação
- Interações com UI

---

## Solução de problemas

**Módulo não encontrado na aplicação principal**
```bash
cd tc-02
yarn install
```

**Módulo não encontrado no shell**
```bash
cd tc-02/apps/shell
yarn install
```

**Erro 401 na API**

Faça logout e login novamente.

**Backend não responde**

Verifique se está rodando em **http://localhost:4000/health**

O shell entra automaticamente em modo demonstração quando o backend não está disponível.

**Porta em uso (Windows)**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Links

| Recurso | URL |
|---------|-----|
| Repositório frontend | https://github.com/pos-projetos-thiago/tc-02 |
| Repositório backend | https://github.com/pos-projetos-thiago/tc02-bytebank-api |

---

<div align="center">

**Desenvolvido com ❤️ e 🤘 para o Tech Challenge**

</div>

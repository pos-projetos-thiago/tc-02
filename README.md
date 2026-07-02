# Bytebank — Microfrontends

<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pos-projetos-thiago/tc-02/ci.yml?style=for-the-badge&label=CI&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Module Federation](https://img.shields.io/badge/Module%20Federation-Webpack-FF6B6B?style=for-the-badge&logo=webpack&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui)
![Sass](https://img.shields.io/badge/Sass-Modules-CC6699?style=for-the-badge&logo=sass)
![Jest](https://img.shields.io/badge/Jest-Testes-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-Gráficos-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Autenticação-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)

</div>

Aplicação de gerenciamento financeiro pessoal desenvolvida para o **Tech Challenge Fase 2** da FIAP Pós-Tech. O projeto evolui a arquitetura monolítica da Fase 1 em direção a uma arquitetura de microfrontends com Module Federation, containerização Docker e integração com API REST autenticada via JWT.

> **FIAP Pós-Tech · Front-End Engineering · Tech Challenge — Fase 2**
> Thiago Soares · RM 373636

---

## Visão geral

O Bytebank é uma aplicação bancária digital que permite ao usuário gerenciar suas movimentações financeiras, visualizar saldo, investimentos e extrato detalhado. O projeto foi estruturado em dois layers:

- **Monólito (`src/`)** — fonte da verdade, contém todas as funcionalidades implementadas e validadas, rodando em `localhost:3000`.
- **Shell Microfrontend (`apps/shell/`)** — aplicação host da arquitetura de microfrontends, com dashboard e transações migrados, rodando em `localhost:3010`.

Os demais microfrontends (`dashboard`, `transactions`, `analytics`) têm estrutura e configuração de Module Federation definidas e estão em evolução — seus componentes centrais existem no shell e no monólito, e a migração é incremental.

---

## Funcionalidades implementadas

**Autenticação**
- Cadastro e login com e-mail e senha via JWT
- Persistência de sessão em `localStorage`
- Logout com limpeza completa da sessão
- Modo de demonstração automático quando o backend não está disponível

**Dashboard financeiro**
- Saldo em conta com toggle de visibilidade
- Navegação por seções: Serviços, Transferências, Investimentos, Cartões, Minha Conta
- Gráfico de investimentos por categoria (Donut chart — Chart.js)
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
- Componentes: Button, Input, Toast, Loading, FilterBar, Pagination, Modal, DateRangePicker

---

## Arquitetura do projeto

```
tc-02/
├── src/                          # Monólito Next.js — porta 3000
│   ├── app/                      # App Router (rotas, layouts, API routes)
│   │   ├── dashboard/            # Dashboard + Transações + AI Documents + OCR
│   │   └── api/                  # Routes: /api/ocr, /api/ai-document
│   ├── components/               # Atomic Design
│   │   ├── atoms/                # Button, Input, Toast, Loading, Pagination...
│   │   ├── molecules/            # FilterBar, InvestmentChart, TransactionOCR...
│   │   ├── organisms/            # DashboardHero, DashboardExtract, AuthModal...
│   │   └── templates/            # NotFoundTemplate
│   ├── contexts/                 # DashboardContextJWT, FilterContext
│   ├── hooks/                    # useJWTAuth, useFilters, useOCR, useToast
│   └── lib/                      # api/, ai/, pdf/, huggingface/, utils/
│
├── apps/
│   ├── shell/                    # Shell MF — porta 3010 (host funcional)
│   │   └── src/
│   │       ├── app/              # Rotas: /, /dashboard, /transactions
│   │       ├── components/       # Componentes migrados do monólito
│   │       ├── contexts/         # DashboardContextJWT
│   │       └── hooks/            # useJWTAuth
│   │
│   ├── dashboard/                # Remote MF — porta 3001
│   │   └── src/components/       # Dashboard, DashboardHero, DashboardNav
│   │                             # (Module Federation configurado, em evolução)
│   ├── transactions/             # Remote MF — porta 3002
│   │                             # (Module Federation configurado, sem src ainda)
│   ├── analytics/                # Remote MF — porta 3003
│   │                             # (Module Federation configurado, sem src ainda)
│   └── shared/                   # Biblioteca interna @bytebank/shared
│       ├── components/           # Atoms e molecules reutilizáveis
│       ├── lib/api/              # auth.ts, transactions.ts
│       ├── styles/               # Tokens SCSS globais
│       └── types/                # Tipos TypeScript compartilhados
│
├── docker-compose.yml            # Frontend monólito
├── docker-compose.microfrontends.yml  # Todos os apps + nginx + backend + mongo
└── .github/workflows/ci.yml     # Lint + Build via GitHub Actions
```

### Microfrontends — Module Federation

Cada remote está configurado para expor seus componentes via `remoteEntry.js`:

| App | Porta | Componentes expostos | Status |
|-----|-------|---------------------|--------|
| shell | 3010 | Host (consome remotes) | Funcional |
| dashboard | 3001 | Dashboard, DashboardHero, DashboardNav, BalanceCard, InvestmentChart, DashboardServices | Configurado — src parcial |
| transactions | 3002 | Transactions, FilterBar, Pagination, TransactionItem, TransactionOCR, DashboardExtract | Configurado — src em migração |
| analytics | 3003 | Analytics, DocumentUploader, PDFGenerator, AdvancedCharts, Reports | Configurado — src planejado |
| shared | — | Design system e API client | Funcional |

Os componentes centrais de cada domínio existem no monólito (`src/`) e no shell (`apps/shell/src/`). A migração incremental para cada remote está em andamento.

---

## Pré-requisitos

| Ferramenta | Versão recomendada |
|------------|--------------------|
| Node.js | 18 ou 20 LTS |
| Yarn | 1.x ou Berry |
| Git | qualquer versão recente |
| Docker | opcional, para rodar com compose |

```bash
node -v
yarn -v
git --version
```

---

## Clonando os repositórios

O projeto é composto por dois repositórios. Clone ambos dentro da mesma pasta raiz:

```bash
mkdir fase2
cd fase2

# Frontend (este repositório)
git clone https://github.com/pos-projetos-thiago/tc-02

# Backend
git clone https://github.com/pos-projetos-thiago/tc02-bytebank-api
```

Estrutura esperada:

```
fase2/
├── tc-02/
└── tc02-bytebank-api/
```

---

## 🚀 Como executar

Existem três formas de rodar o projeto. Escolha a que faz mais sentido pra você:

---

### Opção 1 — Monólito recomendado para avaliação rápida

Essa é a forma mais simples. Sobe o frontend completo com todas as funcionalidades funcionando.

Você vai precisar de **dois terminais abertos**.

**Terminal 1 — Backend:**
```bash
cd tc02-bytebank-api
npm install
npm run dev
```
> A API vai estar em: http://localhost:4000

**Terminal 2 — Frontend:**
```bash
cd tc-02
yarn install
yarn dev
```
> A aplicação vai estar em: http://localhost:3000

---

### Opção 2 — Shell Microfrontend

Roda o host da arquitetura de microfrontends com dashboard e transações migrados.

> Antes de começar, certifique-se que o backend do **Terminal 1** acima está rodando em `localhost:4000`.

```bash
cd tc-02/apps/shell
yarn install
yarn dev
```
> O shell fica disponível em: http://localhost:3010

> **Sem backend?** Sem problema. O shell detecta automaticamente e entra em modo de demonstração — o login aceita qualquer e-mail válido para você explorar a interface.

---

### Opção 3 — Docker Compose arquitetura completa

Sobe tudo de uma vez: shell, dashboard, transactions, analytics, backend, MongoDB e Nginx.

> **Pré-requisito:** o repositório `tc02-bytebank-api/` precisa estar na pasta `../api-backend` em relação ao `tc-02/`. Se você clonou os dois dentro de `fase2/`, renomeie a pasta do backend para `api-backend` ou ajuste o compose.

```bash
cd tc-02
docker-compose -f docker-compose.microfrontends.yml up -d
```

Verifique se todos os containers subiram:
```bash
docker ps
```

Para acompanhar os logs em tempo real:
```bash
yarn mf:logs
```

Para derrubar tudo:
```bash
yarn mf:down
```

**O que sobe com o Docker:**

| Serviço | URL |
|---------|-----|
| Shell (host MF) | http://localhost:3010 |
| Dashboard MF | http://localhost:3001 |
| Transactions MF | http://localhost:3002 |
| Analytics MF | http://localhost:3003 |
| Backend API | http://localhost:4000 |

---

## Scripts disponíveis

```bash
# Desenvolvimento
yarn dev               # Monólito — porta 3000
yarn mf:shell          # Shell MF — porta 3010
yarn mf:dashboard      # Dashboard MF — porta 3001
yarn mf:transactions   # Transactions MF — porta 3002
yarn mf:analytics      # Analytics MF — porta 3003

# Build e qualidade
yarn build             # Build de produção (monólito)
yarn lint              # ESLint
yarn test              # Testes com Jest (run único)
yarn test:watch        # Testes em modo watch

# Docker
yarn docker:up         # Sobe monólito containerizado
yarn mf:dev            # Sobe arquitetura completa de MFs
yarn mf:rebuild        # Rebuild completo dos containers
yarn mf:logs           # Acompanha logs dos containers
yarn mf:down           # Derruba containers
```

---

## Endpoints da API

A aplicação se conecta ao backend em `http://localhost:4000`.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/user` | Cadastrar usuário |
| POST | `/user/auth` | Login (retorna JWT) |
| PUT | `/user/profile` | Atualizar perfil |
| GET | `/account` | Buscar conta, transações e cartões |
| POST | `/account/transaction` | Criar transação |
| PUT | `/account/transaction/:id` | Editar transação |
| DELETE | `/account/transaction/:id` | Deletar transação |
| GET | `/health` | Health check |

> O backend usa MongoDB em memória. Os dados são mantidos durante a execução e perdidos ao reiniciar.

---

## Stack tecnológica

| Área | Tecnologia |
|------|------------|
| Framework | Next.js 16, App Router |
| Linguagem | TypeScript 5 |
| Estilização | SCSS Modules + tokens de design |
| Componentes | Material UI 7 + Atomic Design |
| Gráficos | Chart.js 4 + react-chartjs-2 |
| Formulários | React Hook Form + Zod |
| Microfrontends | Module Federation (`@module-federation/nextjs-mf`) |
| Autenticação | JWT com localStorage |
| IA / OCR | Hugging Face API + @ai-sdk/google + @ai-sdk/openai |
| PDF | jsPDF + html2canvas |
| Containerização | Docker + Docker Compose + Nginx |
| CI/CD | GitHub Actions |
| Testes | Jest + React Testing Library |

---

## Design system

**Cores principais**

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#004D61` | Ações, botões, links |
| Accent | `#FF5031` | Destaques, alertas |
| Surface | `#FFFFFF` | Fundos de cards |
| Background | `#F5F5F5` | Fundo da página |

**Tipografia**
- Fonte: Inter (Google Fonts)
- Escala em `rem` com base 10
- Pesos: 300, 400, 500, 600, 700

**Responsividade**

| Breakpoint | Faixa |
|------------|-------|
| Mobile | até 719px |
| Tablet | 720px – 1023px |
| Desktop | 1024px em diante |
| Large | 1920px+ |

---

## Testes

O projeto possui testes unitários com Jest e React Testing Library cobrindo os componentes principais do dashboard:

```bash
yarn test
```

**Cobertura atual:**
- `DashboardServices` — renderização e navegação por seções
- `AuthModal` — fluxo de login e cadastro (estrutura)
- Testes funcionais de interação com cartões e botões

Os testes estão configurados para o monólito (`src/`). Configuração de testes para os apps de microfrontends está prevista.

---

## Limitações conhecidas e próximos passos

Esta seção documenta de forma transparente o estado atual da arquitetura para fins de evolução do projeto.

**Limitações atuais**

| Item | Situação |
|------|----------|
| Remotes `transactions` e `analytics` | Module Federation configurado, `src/` com código ainda não migrado do monólito |
| Remote `dashboard` | `src/` parcialmente criada — componentes principais existem, migração em andamento |
| Workspaces Yarn | Campo `workspaces` não declarado no `package.json` raiz — dependências não resolvidas de forma isolada |
| Estado compartilhado entre MFs | Gerenciado via React Context no shell; comunicação por `CustomEvents` planejada |
| JWT em localStorage | Funcional para o contexto acadêmico; em produção seria migrado para `httpOnly cookie` |
| Autenticação nos remotes | Token lido diretamente do `localStorage` — funciona no mesmo domínio |
| CI/CD | Pipeline único para o monólito; builds independentes por MF planejados |
| Cobertura de testes | Testes existentes cobrem componentes do monólito; cobertura dos apps MF planejada |

**Próximos passos**

1. Migrar `src/` de `transactions` e `analytics` para os respectivos apps remotos
2. Declarar `workspaces` no `package.json` raiz para isolamento real de dependências
3. Implementar comunicação entre MFs via `CustomEvents`
4. Separar jobs de CI por app (`build-shell`, `build-dashboard`, etc.)
5. Ampliar cobertura de testes para o shell e os remotes

---

## Solução de problemas

**Módulo não encontrado no shell**

```bash
cd apps/shell
yarn install
```

**Erro 401 na API (token expirado)**

Faça logout e login novamente. O frontend limpa o token automaticamente em respostas 401.

**Backend não responde**

O shell entra em modo de demonstração automaticamente. Verifique se o backend está em `http://localhost:4000/health`.

**Porta em uso (Windows)**

```bash
# Verificar processo na porta
netstat -ano | findstr :3000

# Encerrar pelo PID
taskkill /PID <PID> /F
```

---

## Links

| Recurso | URL |
|---------|-----|
| Repositório frontend | https://github.com/pos-projetos-thiago/tc-02 |
| Repositório backend | https://github.com/pos-projetos-thiago/tc02-bytebank-api |
| Branch de microfrontends | `feat/microfrontends` |

---

<div align="center">

**Desenvolvido com ❤️ e 🤘 para o Tech Challenge**

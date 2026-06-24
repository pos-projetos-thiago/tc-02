# Bytebank - Microfrontends

Aplicação de gerenciamento financeiro pessoal desenvolvida com arquitetura de microfrontends para o Tech Challenge Fase 2 da FIAP Pós-Tech.

> **FIAP Pós-Tech · Front-End Engineering · Tech Challenge - Fase 2**  
> Thiago Soares · RM 373636

---

## Visão geral do projeto

O Bytebank é uma aplicação bancária digital que permite ao usuário gerenciar transações financeiras, visualizar saldo, investimentos e extrato. A aplicação foi migrada de uma arquitetura monolítica (Next.js) para uma arquitetura de microfrontends utilizando Module Federation.

**Funcionalidades implementadas:**

- Autenticação com JWT (login, cadastro, logout)
- Dashboard financeiro com saldo, transações, investimentos e cartões
- Extrato completo com filtros avançados e paginação
- Criação, edição e exclusão de transações
- Gráfico de investimentos (Renda Fixa / Renda Variável)
- Atualização de perfil do usuário
- Interface responsiva (mobile, tablet, desktop)

**Separação da aplicação:**

- **Frontend principal (`tc-02/`)** — monólito Next.js original, fonte da verdade para componentes e lógica. Roda na porta `3000`.
- **Shell Microfrontend (`tc-02/apps/shell/`)** — aplicação Next.js que serve como host da arquitetura de microfrontends. Roda na porta `3010`.
- **Backend API (`tc02-bytebank-api/`)** — API REST com Node.js, autenticação JWT e MongoDB em memória. Roda na porta `4000`.

---

## Arquitetura do projeto

```
Fase1/
├── tc-02/                        # Repositório do frontend
│   ├── src/                      # Frontend principal (monólito) — porta 3000
│   │   ├── app/                  # Next.js App Router (rotas, layouts)
│   │   ├── components/           # Componentes (atoms, molecules, organisms)
│   │   ├── contexts/             # Estado global (DashboardContext, FilterContext)
│   │   ├── hooks/                # Custom hooks (useJWTAuth, useFilters)
│   │   └── lib/                  # API, utilitários, PDF, OCR, IA
│   │
│   └── apps/
│       ├── shell/                # Shell microfrontend — porta 3010
│       │   └── src/
│       │       ├── app/          # Rotas do shell (/, /dashboard, /dashboard/transacoes)
│       │       ├── components/   # Componentes migrados do monólito
│       │       ├── contexts/     # DashboardContextJWT
│       │       ├── hooks/        # useJWTAuth
│       │       └── lib/          # API client
│       ├── dashboard/            # MF Dashboard — porta 3001 (em desenvolvimento)
│       ├── transactions/         # MF Transactions — porta 3002 (em desenvolvimento)
│       ├── analytics/            # MF Analytics — porta 3003 (em desenvolvimento)
│       └── shared/               # Design system compartilhado (@bytebank/shared)
│
└── tc02-bytebank-api/            # Repositório do backend — porta 4000
    ├── src/
    │   ├── routes/               # Endpoints REST
    │   ├── controllers/          # Lógica de negócio
    │   └── models/               # Modelos de dados
    └── package.json
```

**Responsabilidades:**

| Parte | Responsabilidade |
|-------|-----------------|
| `src/` (monólito) | Fonte da verdade. Contém todas as funcionalidades implementadas e validadas. |
| `apps/shell/` | Aplicação host da arquitetura de microfrontends. Dashboard e transações migrados do monólito. |
| `apps/dashboard/` | Microfrontend de dashboard — expõe componentes via Module Federation (em desenvolvimento). |
| `apps/transactions/` | Microfrontend de transações — expõe extrato via Module Federation (em desenvolvimento). |
| `apps/analytics/` | Microfrontend de relatórios e IA (em desenvolvimento). |
| `apps/shared/` | Design system: atoms, molecules, utilitários e tipos TypeScript compartilhados. |
| `tc02-bytebank-api/` | Backend REST com JWT, MongoDB em memória e backup em JSON. |

---

## Pré-requisitos

| Ferramenta | Versão recomendada |
|------------|--------------------|
| Node.js | 18 ou 20 LTS |
| npm | 9+ (incluso com Node.js) |
| Git | qualquer versão recente |

Para verificar suas versões:

```bash
node -v
npm -v
git --version
```

> O projeto usa `yarn` nos scripts internos, mas pode ser executado com `npm` normalmente.

---

## Clonando os projetos

São necessários dois repositórios separados. Clone ambos dentro da mesma pasta `Fase1/`:

```bash
# Crie a pasta raiz
mkdir Fase1
cd Fase1

# Clone o frontend
git clone https://github.com/pos-projetos-thiago/tc-02

# Clone o backend
git clone https://github.com/pos-projetos-thiago/tc02-bytebank-api
```

Estrutura esperada após clonar:

```
Fase1/
├── tc-02/
└── tc02-bytebank-api/
```

---

## Executando o ambiente completo

### 1. Backend API

Diretório: `Fase1/tc02-bytebank-api/`

```bash
cd tc02-bytebank-api
npm install
npm run dev
```

A API ficará disponível em: `http://localhost:4000`

Endpoints principais:

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

> O backend usa MongoDB em memória. Os dados são preservados durante a execução mas perdidos ao reiniciar o servidor.

---

### 2. Frontend principal

Diretório: `Fase1/tc-02/`

```bash
cd tc-02
npm install
npm run dev
```

A aplicação ficará disponível em: `http://localhost:3000`

Inclui todas as funcionalidades: dashboard, extrato, filtros, paginação, OCR, upload de documentos com IA e geração de PDF.

---

### 3. Shell Microfrontend

Diretório: `Fase1/tc-02/apps/shell/`

```bash
cd tc-02/apps/shell
npm install
npm run dev
```

A aplicação ficará disponível em: `http://localhost:3010`

Inclui: landing page, autenticação, dashboard financeiro completo e extrato de transações.

> O shell requer que o backend esteja rodando em `http://localhost:4000` para autenticação e dados. Sem o backend, a aplicação entra em modo de demonstração com login simulado.

---

## Portas utilizadas

| Serviço | Porta | URL |
|---------|-------|-----|
| Backend API | 4000 | http://localhost:4000 |
| Frontend principal | 3000 | http://localhost:3000 |
| Shell Microfrontend | 3010 | http://localhost:3010 |

> Os microfrontends remotos (dashboard :3001, transactions :3002, analytics :3003) estão em desenvolvimento e ainda não são consumidos pelo shell.

---

## Executando com Docker

O projeto inclui configuração Docker para o frontend principal:

```bash
# Na raiz de tc-02/
docker-compose up -d
```

Isso sobe o frontend na porta `3000` e configura o proxy para o backend.

Para a arquitetura de microfrontends (experimental):

```bash
docker-compose -f docker-compose.microfrontends.yml up -d
```

> O Docker Compose de microfrontends requer que `tc02-bytebank-api/` esteja em `../api-backend` relativo à pasta `tc-02/`.

---

## Desenvolvimento

### Comandos do frontend principal (`tc-02/`)

```bash
npm run dev          # Servidor de desenvolvimento na porta 3000
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Lint com ESLint
npm run test         # Testes com Jest
npm run test:watch   # Testes em modo watch
```

### Comandos do shell (`tc-02/apps/shell/`)

```bash
npm run dev          # Servidor de desenvolvimento na porta 3010
npm run build        # Build de produção
npm run lint         # Lint com ESLint
```

### Comandos do backend (`tc02-bytebank-api/`)

```bash
npm install          # Instalar dependências
npm run dev          # Servidor com hot reload na porta 4000
npm start            # Servidor de produção
```

---

## Stack tecnológica

| Área | Tecnologia |
|------|------------|
| Framework | Next.js 16, App Router |
| Linguagem | TypeScript 5 |
| Estilização | SCSS Modules |
| Componentes | Material UI (MUI) + Atomic Design |
| Gráficos | Chart.js + react-chartjs-2 |
| Formulários | React Hook Form + Zod |
| Autenticação | JWT (JSON Web Token) |
| Banco de dados | MongoDB (in-memory) |
| Containerização | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Solução de problemas

**Erro: `Module not found` nos componentes do shell**

Verifique se as dependências estão instaladas dentro de `apps/shell/`:

```bash
cd apps/shell
npm install
```

**Erro de autenticação (401 na API)**

O token JWT expirou ou é inválido. Faça logout e login novamente. O frontend limpa o token automaticamente em caso de 401.

**Backend não está respondendo**

Verifique se o backend está rodando em `http://localhost:4000/health`. Se não estiver, o shell entra em modo de demonstração automaticamente — o login aceita qualquer email válido.

**Erro de porta em uso**

Se as portas 3000, 3010 ou 4000 estiverem ocupadas:

```bash
# Windows: verificar processo na porta
netstat -ano | findstr :3000

# Encerrar processo pelo PID
taskkill /PID <PID> /F
```

**Problemas com node_modules**

```bash
# Remover e reinstalar
rm -rf node_modules
npm install
```

---

## Status dos microfrontends

| App | Porta | Status | Descrição |
|-----|-------|--------|-----------|
| shell | 3010 | Funcional | Host com dashboard e transações |
| dashboard | 3001 | Em desenvolvimento | Expõe componentes via Module Federation |
| transactions | 3002 | Em desenvolvimento | Expõe extrato via Module Federation |
| analytics | 3003 | Em desenvolvimento | Relatórios e IA |
| shared | — | Funcional | Design system compartilhado |

---

## Links

| Recurso | URL |
|---------|-----|
| Repositório frontend | https://github.com/pos-projetos-thiago/tc-02 |
| Repositório backend | https://github.com/pos-projetos-thiago/tc02-bytebank-api |

# Arquitetura de Microfrontends - Bytebank

Este documento descreve a migração do Bytebank de uma aplicação monolítica Next.js para uma arquitetura de microfrontends utilizando Module Federation.

## 📊 Diagnóstico de Conformidade

✅ **IMPLEMENTADO**: 90% dos requisitos do Tech Challenge  
🟡 **PARCIAL**: Microfrontends (implementado nesta migração)  
❌ **PENDENTE**: Apenas funcionalidades menores

Ver diagnóstico completo em: `.cursor/plans/diagnóstico_tech_challenge_*.plan.md`

## 🏗️ Arquitetura

### Estrutura Modular

```
apps/
├── shell/              # 🏠 Host App (Landing + Auth + Routing)
├── dashboard/          # 📊 Dashboard + Hero + Navigation  
├── transactions/       # 💰 Extrato + CRUD + Filtros
├── analytics/          # 📈 Relatórios + OCR + IA
└── shared/             # 📚 Design System + Utils + API
```

### Portas de Desenvolvimento

| Serviço | Porta | URL | Descrição |
|---------|-------|-----|-----------|
| **Shell** | 3000 | http://localhost:3000 | Landing page e orquestração |
| **Dashboard** | 3001 | http://localhost:3001 | Dashboard financeiro |
| **Transactions** | 3002 | http://localhost:3002 | Gestão de transações |
| **Analytics** | 3003 | http://localhost:3003 | Relatórios e análises |
| **Backend API** | 4000 | http://localhost:4000 | API Node.js + JWT |
| **Nginx** | 80/443 | http://localhost | Reverse proxy |

## 🚀 Como Rodar

### Opção 1: Setup Automatizado (Recomendado)

```bash
# 1. Setup inicial (uma única vez)
yarn mf:setup

# 2. Rodar todos os microfrontends
yarn mf:dev

# 3. Verificar logs
yarn mf:logs
```

### Opção 2: Desenvolvimento Individual

```bash
# Terminal 1: Backend
cd ../api-backend && npm start

# Terminal 2: Shell
yarn mf:shell

# Terminal 3: Dashboard  
yarn mf:dashboard

# Terminal 4: Transactions
yarn mf:transactions

# Terminal 5: Analytics
yarn mf:analytics
```

### Opção 3: Docker Compose

```bash
# Rodar tudo via Docker
docker-compose -f docker-compose.microfrontends.yml up -d

# Parar
docker-compose -f docker-compose.microfrontends.yml down
```

## 🔧 Comandos Disponíveis

### Gerenciamento de Microfrontends

```bash
yarn mf:setup       # Setup inicial (instalar deps)
yarn mf:dev         # Rodar todos os serviços  
yarn mf:down        # Parar todos os serviços
yarn mf:logs        # Ver logs de todos os serviços
yarn mf:rebuild     # Rebuild e restart completo
```

### Desenvolvimento Individual

```bash
yarn mf:shell       # Rodar apenas shell
yarn mf:dashboard   # Rodar apenas dashboard
yarn mf:transactions # Rodar apenas transactions  
yarn mf:analytics   # Rodar apenas analytics
```

## 🔗 Module Federation

### Configuração

Cada microfrontend expõe componentes específicos:

**Shell (Host)**
```javascript
remotes: {
  dashboard: 'dashboard@http://localhost:3001/remoteEntry.js',
  transactions: 'transactions@http://localhost:3002/remoteEntry.js',
  analytics: 'analytics@http://localhost:3003/remoteEntry.js'
}
```

**Dashboard**
```javascript
exposes: {
  './Dashboard': './src/components/Dashboard',
  './DashboardHero': './src/components/DashboardHero',
  './DashboardNav': './src/components/DashboardNav'
}
```

### Comunicação Entre Apps

- **Estado Compartilhado**: Contexts isolados por domínio
- **Event Bus**: Comunicação assíncrona (a implementar)
- **Shared Library**: Design system e utilitários comuns
- **API Unificada**: Backend centralizado

## 📚 Biblioteca Compartilhada

A pasta `apps/shared/` contém:

- **Componentes**: Atomic design (atoms → molecules)
- **Estilos**: SCSS globals, tokens, breakpoints
- **Utilitários**: Formatters, validators, date helpers
- **API**: Clients HTTP, auth, transactions
- **Tipos**: TypeScript interfaces e types

## 🔒 Segurança

Todas as regras de segurança do projeto original são mantidas:

- ✅ Validação de entrada avançada
- ✅ Consultas parametrizadas (SQL Injection)  
- ✅ Headers de segurança (XSS, CSRF)
- ✅ Autenticação JWT
- ✅ Rate limiting (Nginx)

## 📊 Performance

### Otimizações

- **Lazy Loading**: Componentes carregados sob demanda
- **Module Sharing**: Dependências compartilhadas (React, Next.js)
- **Cache Strategies**: Assets com cache otimizado
- **Gzip Compression**: Ativada no Nginx

### Métricas Esperadas

- **Tempo de Carregamento**: Redução de ~20% com lazy loading
- **Bundle Size**: Cada app ~50% menor que o monolito
- **Cache Hit Rate**: >90% em assets estáticos

## 🧪 Desenvolvimento e Debug

### Logs Estruturados

```bash
# Ver logs específicos
docker-compose -f docker-compose.microfrontends.yml logs shell
docker-compose -f docker-compose.microfrontends.yml logs dashboard
docker-compose -f docker-compose.microfrontends.yml logs backend
```

### Hot Reload

Todos os microfrontends suportam hot reload durante o desenvolvimento:

- Mudanças em `apps/shell/` → Reload automático em :3000
- Mudanças em `apps/shared/` → Rebuild necessário  
- Mudanças em `apps/dashboard/` → Reload automático em :3001

### Debug Module Federation

1. Verificar `remoteEntry.js` está disponível
2. Inspecionar Network tab para carregamento de módulos
3. Console logs para erros de Module Federation
4. Verificar versões compartilhadas de dependências

## 🚀 Deploy

### Produção

Cada microfrontend pode ser deployado independentemente:

```bash
# Build individual
cd apps/shell && yarn build
cd apps/dashboard && yarn build

# Deploy no Vercel (exemplo)
vercel --prod --cwd apps/shell
vercel --prod --cwd apps/dashboard
```

### Ambientes

- **Development**: Module Federation via localhost
- **Staging**: URLs de staging para remoteEntry.js  
- **Production**: URLs de produção otimizadas

## 📈 Benefícios Alcançados

### Técnicos
- ✅ **Deploys independentes** por microfrontend
- ✅ **Escalabilidade** horizontal
- ✅ **Tecnologias diversas** por app (futuro)
- ✅ **Desenvolvimento isolado** por equipe

### Organizacionais  
- ✅ **Separação clara** de responsabilidades
- ✅ **Teams menores** e focados
- ✅ **Ciclos de release** independentes

### Performance
- ✅ **Lazy loading** de funcionalidades
- ✅ **Cache independente** por app  
- ✅ **Otimização específica** por domínio

## 🎯 Próximos Passos

1. **Implementar Event Bus** para comunicação entre apps
2. **Adicionar Monitoring** (health checks, métricas)
3. **Otimizar Bundle Splitting** por funcionalidade
4. **Implementar Micro-backends** (opcional)
5. **CI/CD Pipeline** para deploys independentes

## 📞 Suporte

- **Documentação**: Este arquivo + comentários no código
- **Logs**: `yarn mf:logs` para troubleshooting  
- **Issues**: Problemas conhecidos estão documentados no código

---

**Desenvolvido para o Tech Challenge - FIAP Pós-Tech**  
**Arquitetura:** Monolito → Microfrontends com Module Federation  
**Stack:** Next.js 16 + TypeScript + Module Federation + Docker
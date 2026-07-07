# 🐳 Docker - Bytebank Financial App

> **Branch:** `feat/docker` - Containerização da aplicação Bytebank

## 📋 Pré-requisitos

### 1. Instalar Docker Desktop

**Windows:**
1. Baixe Docker Desktop: https://docs.docker.com/desktop/windows/install/
2. Execute o instalador
3. Reinicie o computador se solicitado
4. Abra Docker Desktop e aguarde inicializar

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

### 2. Iniciar Docker Desktop

1. **Abra Docker Desktop** no Windows
2. Aguarde aparecer "Docker Desktop is running" na bandeja
3. Teste: `docker ps` (deve funcionar sem erros)

## 🚀 Como usar

### Setup automático
```bash
npm run docker:setup
```

### Comandos Docker

```bash
# Build da imagem
npm run docker:build

# Subir toda a aplicação (Frontend + Backend + Nginx)
npm run docker:up

# Ver logs em tempo real
npm run docker:logs

# Parar tudo
npm run docker:down

# Rebuild completo
npm run docker:rebuild
```

## 🌐 URLs após rodar

- **Aplicação completa:** http://localhost (Nginx)
- **Frontend direto:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Health check:** http://localhost/health

## 📁 Estrutura Docker

```
tc-02/
├── Dockerfile              # Imagem do Frontend
├── docker-compose.yml      # Orquestração completa
├── docker/
│   └── nginx.conf          # Configuração do Load Balancer
└── .dockerignore           # Arquivos ignorados
```

## 🔧 Solução de Problemas

### Docker Desktop não está rodando
```
ERROR: error during connect: ... dockerDesktopLinuxEngine
```
**Solução:** Abrir Docker Desktop e aguardar inicialização

### Porta já está em uso
```
ERROR: Port 3000 is already in use
```
**Solução:** 
```bash
npm run docker:down
# ou parar o processo que usa a porta
```

### Backend não encontrado
```
ERROR: ../api-backend not found
```
**Solução:** Certifique-se que o backend está em `../api-backend/`

## 🎯 Arquitetura Docker

```
┌─────────────────────────────────┐
│          Nginx (Port 80)        │  ← Load Balancer
├─────────────────────────────────┤
│     Frontend (Port 3000)        │  ← Next.js App
├─────────────────────────────────┤
│      Backend (Port 4000)        │  ← JWT API
└─────────────────────────────────┘
```

## 📊 Status da Branch

### ✅ **Implementado:**
- **Dockerfile** otimizado para Next.js 16
- **Docker Compose** com Frontend + Backend + Nginx
- **Load Balancer** Nginx configurado
- **Scripts** automatizados no package.json
- **Health Checks** funcionando
- **Documentação** completa

### 🔄 **Próxima Branch (`feat/microfrontends`):**
1. **Module Federation** (Webpack 5)
2. **Divisão em apps** independentes (shell/dashboard/transactions/analytics)
3. **Comunicação** entre microfrontends
4. **Roteamento** unificado
5. **Build** e deploy separados

---

**Status:** ✅ Docker Production-Ready | 🚀 Ready for Microfrontends
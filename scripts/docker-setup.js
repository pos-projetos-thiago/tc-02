#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐳 Setup Docker para Bytebank');
console.log('=============================');

// Verificar se Docker está instalado
function checkDockerInstalled() {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    console.log('✅ Docker está instalado');
    return true;
  } catch {
    console.log('❌ Docker não está instalado');
    console.log('');
    console.log('💡 Para instalar Docker:');
    console.log('   Windows: https://docs.docker.com/desktop/windows/install/');
    console.log('   Mac: https://docs.docker.com/desktop/mac/install/');
    console.log('   Linux: https://docs.docker.com/engine/install/');
    return false;
  }
}

// Verificar se Docker Compose está instalado
function checkDockerComposeInstalled() {
  try {
    execSync('docker-compose --version', { stdio: 'pipe' });
    console.log('✅ Docker Compose está instalado');
    return true;
  } catch {
    console.log('❌ Docker Compose não está instalado');
    console.log('💡 Docker Compose vem incluído no Docker Desktop');
    return false;
  }
}

// Verificar se o arquivo .env.local existe
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env.local encontrado');
    return true;
  } else {
    console.log('⚠️  Arquivo .env.local não encontrado');
    console.log('💡 Crie um arquivo .env.local com suas configurações');
    return false;
  }
}

// Verificar se o diretório do backend existe
function checkBackendDirectory() {
  const backendPath = path.join(process.cwd(), '..', 'api-backend');
  if (fs.existsSync(backendPath)) {
    console.log('✅ Diretório do backend encontrado');
    return true;
  } else {
    console.log('⚠️  Diretório ../api-backend não encontrado');
    console.log('💡 Certifique-se de que o backend está no diretório correto');
    return false;
  }
}

// Função principal
function main() {
  console.log('🔍 Verificando pré-requisitos...');
  console.log('');

  const dockerOk = checkDockerInstalled();
  const composeOk = checkDockerComposeInstalled();
  const envOk = checkEnvFile();
  const backendOk = checkBackendDirectory();

  console.log('');
  console.log('📋 Resumo:');

  if (dockerOk && composeOk) {
    console.log('✅ Docker está pronto para uso');
  } else {
    console.log('❌ Instale Docker primeiro');
  }

  if (envOk) {
    console.log('✅ Configuração de ambiente OK');
  } else {
    console.log('⚠️  Configure suas variáveis de ambiente');
  }

  if (backendOk) {
    console.log('✅ Backend encontrado');
  } else {
    console.log('⚠️  Verifique o caminho do backend');
  }

  console.log('');

  if (dockerOk && composeOk) {
    console.log('🚀 Comandos disponíveis:');
    console.log('');
    console.log('   npm run docker:build    # Build da imagem');
    console.log('   npm run docker:up       # Subir todos os serviços');
    console.log('   npm run docker:down     # Parar todos os serviços');
    console.log('   npm run docker:logs     # Ver logs em tempo real');
    console.log('   npm run docker:rebuild  # Rebuild completo');
    console.log('');
    console.log('💡 Acesse: http://localhost (Nginx) ou http://localhost:3000 (direto)');
  }

  console.log('');
  console.log('🎉 Setup concluído!');
}

main();
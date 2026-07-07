#!/usr/bin/env node

/**
 * Script para verificar se o projeto compila sem erros
 * Roda lint + build antes de commit para evitar erros no CI
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Verificando lint...'));

try {
  // 1. Verificar lint
  execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 20', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.log(chalk.green('✅ Lint passou!'));
} catch {
  console.log(chalk.red('❌ Lint falhou!'));
  process.exit(1);
}

console.log(chalk.blue('🏗️  Verificando build...'));

try {
  // 2. Verificar build
  execSync('npx next build', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.log(chalk.green('✅ Build passou!'));
} catch {
  console.log(chalk.red('❌ Build falhou!'));
  process.exit(1);
}

console.log(chalk.green.bold('🎉 Tudo funcionando! Pronto para commit.'));
#!/usr/bin/env node

/**
 * Setup script for Microfrontends Architecture
 * Installs dependencies and prepares all microfrontends for development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const APPS = ['shell', 'dashboard', 'transactions', 'analytics', 'shared'];

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[level]}[${timestamp}] ${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  log(`Running: ${command} in ${cwd}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes timeout
    });
    return true;
  } catch (error) {
    log(`Error running command: ${error.message}`, 'error');
    return false;
  }
}

function checkPrerequisites() {
  log('Checking prerequisites...');
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    execSync('yarn --version', { stdio: 'pipe' });
    log('✓ Node.js and Yarn are installed', 'success');
  } catch (error) {
    log('✗ Node.js or Yarn not found. Please install them first.', 'error');
    process.exit(1);
  }

  // Check Docker
  try {
    execSync('docker --version', { stdio: 'pipe' });
    execSync('docker-compose --version', { stdio: 'pipe' });
    log('✓ Docker and Docker Compose are installed', 'success');
  } catch (error) {
    log('✗ Docker or Docker Compose not found. Please install them first.', 'error');
    process.exit(1);
  }
}

function setupApp(appName) {
  const appPath = path.join(process.cwd(), 'apps', appName);
  
  if (!fs.existsSync(appPath)) {
    log(`✗ App directory not found: ${appPath}`, 'error');
    return false;
  }

  log(`Setting up ${appName}...`);
  
  // Install dependencies
  if (!runCommand('yarn install --frozen-lockfile', appPath)) {
    log(`✗ Failed to install dependencies for ${appName}`, 'error');
    return false;
  }

  // Build shared library first (if it's shared)
  if (appName === 'shared') {
    log('Building shared library...');
    if (!runCommand('yarn build', appPath)) {
      log('✗ Failed to build shared library', 'error');
      return false;
    }
  }

  log(`✓ ${appName} setup completed`, 'success');
  return true;
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.microfrontends');
  const envTemplate = `# Microfrontends Environment Variables

# API Keys (optional)
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
OPENAI_API_KEY=your_openai_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/bytebank

# JWT
JWT_SECRET=your_jwt_secret_here

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Ports
SHELL_PORT=3000
DASHBOARD_PORT=3001
TRANSACTIONS_PORT=3002
ANALYTICS_PORT=3003
BACKEND_PORT=4000
`;

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    log(`✓ Created environment file: ${envPath}`, 'success');
    log('Please update the environment variables with your actual values', 'warn');
  } else {
    log('✓ Environment file already exists', 'info');
  }
}

async function main() {
  log('🚀 Starting Microfrontends Setup...', 'info');
  
  checkPrerequisites();
  createEnvFile();
  
  // Setup shared library first
  if (!setupApp('shared')) {
    log('✗ Failed to setup shared library', 'error');
    process.exit(1);
  }

  // Setup each microfrontend
  for (const app of APPS.filter(a => a !== 'shared')) {
    if (!setupApp(app)) {
      log(`✗ Failed to setup ${app}`, 'error');
      process.exit(1);
    }
  }

  log('🎉 Microfrontends setup completed successfully!', 'success');
  log('', 'info');
  log('Next steps:', 'info');
  log('1. Update .env.microfrontends with your API keys', 'info');
  log('2. Run: docker-compose -f docker-compose.microfrontends.yml up -d', 'info');
  log('3. Access the applications:', 'info');
  log('   - Shell (Host): http://localhost:3000', 'info');
  log('   - Dashboard: http://localhost:3001', 'info');
  log('   - Transactions: http://localhost:3002', 'info');
  log('   - Analytics: http://localhost:3003', 'info');
  log('   - Backend API: http://localhost:4000', 'info');
}

if (require.main === module) {
  main().catch(error => {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
  });
}
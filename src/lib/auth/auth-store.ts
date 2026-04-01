import {
  BYTEBANK_SESSION_KEY,
  BYTEBANK_USERS_KEY,
  findUserByCredentials,
  getStoredUsers,
  resolveDemoLogin,
  saveStoredUser,
  writeSession,
  type SessionUser,
} from '@/lib/auth/mock-storage';

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedSessionRaw: string | null | undefined = undefined;
let cachedSessionUser: SessionUser | null = null;
let isInitialized = false;

function emit() {
  listeners.forEach((l) => l());
}

function clearCache() {
  cachedSessionRaw = undefined;
  cachedSessionUser = null;
}

export function subscribeAuth(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(BYTEBANK_SESSION_KEY);
    
    if (raw === cachedSessionRaw && isInitialized) {
      return cachedSessionUser;
    }
    
    cachedSessionRaw = raw;
    isInitialized = true;
    
    if (!raw) {
      cachedSessionUser = null;
      return null;
    }
    
    cachedSessionUser = JSON.parse(raw) as SessionUser;
    return cachedSessionUser;
  } catch (error) {
    console.warn('Auth: Erro ao recuperar sessão do localStorage:', error);
    clearCache();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(BYTEBANK_SESSION_KEY);
    }
    return null;
  }
}

export function getServerAuthSnapshot(): SessionUser | null {
  return null;
}

export function setSessionUser(next: SessionUser | null) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Definindo sessão:', next);
      
      // Detectar origem do logout automático
      if (next === null) {
        console.log('🚨 LOGOUT DETECTADO! Stack trace:');
        console.trace('Origem do logout:');
      }
    }
    
    writeSession(next);
    clearCache();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Sessão definida com sucesso');
      console.log('🔑 Verificando imediatamente:', getAuthSnapshot());
    }
    
    emit();
  } catch (error) {
    console.error('Auth: Erro ao definir sessão:', error);
    throw error;
  }
}

export function loginWithCredentials(email: string, password: string) {
  try {
    if (!email.trim() || !password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Tentativa de login:', { email: email.trim(), password });
    }

    const demo = resolveDemoLogin(email, password);
    if (demo) {
      console.log('✅ Login demo realizado');
      setSessionUser(demo);
      return;
    }
    
    const found = findUserByCredentials(email, password);
    if (found) {
      console.log('✅ Usuário encontrado, fazendo login');
      setSessionUser({ name: found.name, email: found.email });
      return;
    }
    
    console.log('❌ Credenciais não encontradas');
    throw new Error('E-mail ou senha incorretos.');
  } catch (error) {
    console.error('Auth: Erro no login:', error);
    throw error;
  }
}

export function registerUser(name: string, email: string, password: string) {
  try {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error('Nome, e-mail e senha são obrigatórios.');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('E-mail inválido.');
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Registrando usuário:', userData);
    }

    saveStoredUser(userData);
    
    setSessionUser({ name: name.trim(), email: email.trim() });
  } catch (error) {
    console.error('Auth: Erro no registro:', error);
    throw error;
  }
}

export function clearAuthData() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(BYTEBANK_SESSION_KEY);
    localStorage.removeItem(BYTEBANK_USERS_KEY);
    clearCache();
    emit();
  } catch (error) {
    console.error('Auth: Erro ao limpar dados:', error);
  }
}

export function debugAuthState(): string | {
  hasSessionInStorage: boolean;
  hasUsersInStorage: boolean;
  cachedUser: SessionUser | null;
  isInitialized: boolean;
  userCount: number;
} {
  if (typeof window === 'undefined') return 'Server-side';
  
  return {
    hasSessionInStorage: !!localStorage.getItem(BYTEBANK_SESSION_KEY),
    hasUsersInStorage: !!localStorage.getItem(BYTEBANK_USERS_KEY),
    cachedUser: cachedSessionUser,
    isInitialized,
    userCount: getStoredUsers().length,
  };
}

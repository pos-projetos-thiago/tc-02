// Mock no navegador (Tech Challenge / pós — sem backend). Senha em texto plano só para demonstração; não usar esse padrão em app real.
export type StoredUser = {
  name: string;
  email: string;
  password: string;
};

export type SessionUser = {
  name: string;
  email: string;
};

export const BYTEBANK_USERS_KEY = 'bytebank-users';
export const BYTEBANK_SESSION_KEY = 'bytebank-session';

export const DEMO_EMAIL = 'demo@bytebank.com';
export const DEMO_PASSWORD = '123456';

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BYTEBANK_USERS_KEY);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📖 Lendo usuários do localStorage:', {
        chave: BYTEBANK_USERS_KEY,
        dadosRaw: raw,
        temDados: !!raw,
        localStorage_length: localStorage.length,
        todas_chaves: Object.keys(localStorage)
      });
    }
    
    if (!raw) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📖 ❌ Nenhum dado encontrado no localStorage para usuários!');
        console.log('📖 🔍 Verificando todas as chaves no localStorage:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          console.log(`  ${key}: ${localStorage.getItem(key)}`);
        }
      }
      return [];
    }
    
    const parsed = JSON.parse(raw) as unknown;
    const users = Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📖 ✅ Usuários recuperados:', users);
    }
    
    return users;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('📖 ❌ Erro ao ler usuários:', error);
    }
    return [];
  }
}

export function saveStoredUser(user: StoredUser): void {
  if (typeof window === 'undefined') {
    throw new Error('Não é possível criar conta no servidor.');
  }
  
  try {
    const users = getStoredUsers();
    const normalizedEmail = user.email.toLowerCase();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Salvando usuário:', user);
      console.log('💾 Usuários existentes antes:', users);
      console.log('💾 Chave do localStorage:', BYTEBANK_USERS_KEY);
    }
    
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('Já existe uma conta com este e-mail.');
    }
    
    users.push(user);
    localStorage.setItem(BYTEBANK_USERS_KEY, JSON.stringify(users));
    
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Usuário salvo com sucesso!');
      console.log('💾 Usuários após salvar:', getStoredUsers());
      console.log('💾 Dados no localStorage:', localStorage.getItem(BYTEBANK_USERS_KEY));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('existe uma conta')) {
      throw error;
    }
    console.error('Auth: Erro ao salvar usuário:', error);
    throw new Error('Não foi possível criar a conta. Verifique se o localStorage está disponível.');
  }
}

export function findUserByCredentials(email: string, password: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  const users = getStoredUsers();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Buscando credenciais:', {
      emailBuscado: normalized,
      senhaBuscada: password,
      usuariosEncontrados: users.length,
      usuarios: users.map(u => ({ 
        email: u.email, 
        emailLower: u.email.toLowerCase(),
        senha: u.password 
      }))
    });
  }
  
  const found = users.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password,
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Resultado da busca:', found ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
  }
  
  return found;
}

export function getSessionFromStorage(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(BYTEBANK_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem(BYTEBANK_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(BYTEBANK_SESSION_KEY);
    }
  } catch (error) {
    console.error('Auth: Erro ao escrever sessão:', error);
    throw new Error('Não foi possível salvar a sessão. Verifique se o localStorage está disponível.');
  }
}

export function resolveDemoLogin(email: string, password: string): SessionUser | null {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return { name: 'Usuário demo', email: DEMO_EMAIL };
  }
  return null;
}

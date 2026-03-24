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
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredUser(user: StoredUser): void {
  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error('Já existe uma conta com este e-mail.');
  }
  users.push(user);
  localStorage.setItem(BYTEBANK_USERS_KEY, JSON.stringify(users));
}

export function findUserByCredentials(email: string, password: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getStoredUsers().find(
    (u) => u.email.toLowerCase() === normalized && u.password === password,
  );
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
  if (user) localStorage.setItem(BYTEBANK_SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(BYTEBANK_SESSION_KEY);
}

export function resolveDemoLogin(email: string, password: string): SessionUser | null {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return { name: 'Usuário demo', email: DEMO_EMAIL };
  }
  return null;
}

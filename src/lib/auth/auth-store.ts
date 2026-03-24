import {
  BYTEBANK_SESSION_KEY,
  findUserByCredentials,
  resolveDemoLogin,
  saveStoredUser,
  writeSession,
  type SessionUser,
} from '@/lib/auth/mock-storage';

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedSessionRaw: string | null | undefined = undefined;
let cachedSessionUser: SessionUser | null = null;

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(BYTEBANK_SESSION_KEY);
  if (raw === cachedSessionRaw) {
    return cachedSessionUser;
  }
  cachedSessionRaw = raw;
  if (!raw) {
    cachedSessionUser = null;
    return null;
  }
  try {
    cachedSessionUser = JSON.parse(raw) as SessionUser;
    return cachedSessionUser;
  } catch {
    cachedSessionUser = null;
    return null;
  }
}

export function getServerAuthSnapshot(): SessionUser | null {
  return null;
}

export function setSessionUser(next: SessionUser | null) {
  writeSession(next);
  cachedSessionRaw = undefined;
  cachedSessionUser = null;
  emit();
}

export function loginWithCredentials(email: string, password: string) {
  const demo = resolveDemoLogin(email, password);
  if (demo) {
    setSessionUser(demo);
    return;
  }
  const found = findUserByCredentials(email, password);
  if (found) {
    setSessionUser({ name: found.name, email: found.email });
    return;
  }
  throw new Error('E-mail ou senha incorretos.');
}

export function registerUser(name: string, email: string, password: string) {
  saveStoredUser({
    name: name.trim(),
    email: email.trim(),
    password,
  });
  setSessionUser({ name: name.trim(), email: email.trim() });
}

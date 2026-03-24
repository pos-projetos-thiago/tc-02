'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  loginWithCredentials,
  registerUser,
  setSessionUser,
  subscribeAuth,
} from '@/lib/auth/auth-store';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/auth/mock-storage';
import type { SessionUser } from '@/lib/auth/mock-storage';

type AuthContextValue = {
  user: SessionUser | null;
  login: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  const login = useCallback((email: string, password: string) => {
    loginWithCredentials(email, password);
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    registerUser(name, email, password);
  }, []);

  const logout = useCallback(() => {
    setSessionUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, signUp, logout }),
    [user, login, signUp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}

export { DEMO_EMAIL, DEMO_PASSWORD };

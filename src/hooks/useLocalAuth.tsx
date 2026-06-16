'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  findUserByCredentials, 
  saveStoredUser, 
  getSessionFromStorage, 
  writeSession,
  resolveDemoLogin,
  type SessionUser, 
  type StoredUser 
} from '@/lib/auth/mock-storage';

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão do localStorage na inicialização
  useEffect(() => {
    const sessionUser = getSessionFromStorage();
    if (sessionUser) {
      console.log('📋 Sessão encontrada:', sessionUser);
      setUser(sessionUser);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('🔐 Tentando login com:', { email, senha: '***' });
      
      // Tentar demo login primeiro
      const demoUser = resolveDemoLogin(email, password);
      if (demoUser) {
        console.log('✅ Login demo bem-sucedido');
        setUser(demoUser);
        writeSession(demoUser);
        return;
      }
      
      // Tentar login com usuários cadastrados
      const found = findUserByCredentials(email, password);
      if (found) {
        console.log('✅ Usuário encontrado, fazendo login');
        const sessionUser = { name: found.name, email: found.email };
        setUser(sessionUser);
        writeSession(sessionUser);
        return;
      }
      
      console.log('❌ Credenciais não encontradas');
      throw new Error('E-mail ou senha incorretos.');
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('📝 Registrando usuário:', { name, email, senha: '***' });
      
      const newUser: StoredUser = { name, email, password };
      saveStoredUser(newUser);
      
      // Auto-login após registro
      const sessionUser = { name, email };
      setUser(sessionUser);
      writeSession(sessionUser);
      
      console.log('✅ Usuário registrado e logado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 Fazendo logout');
    setUser(null);
    writeSession(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
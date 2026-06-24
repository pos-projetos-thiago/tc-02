'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Types
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

// API Base URL
const API_BASE_URL = 'http://localhost:4000';

// Check if backend is available (will be checked on first API call)
let backendAvailable: boolean | null = null;

// Test backend connectivity
const testBackend = async (): Promise<boolean> => {
  if (backendAvailable !== null) return backendAvailable;
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    backendAvailable = response.ok;
  } catch {
    backendAvailable = false;
  }
  
  if (!backendAvailable) {
    console.warn('Backend não disponível em http://localhost:4000 - usando modo simulação');
  }
  
  return backendAvailable;
};

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT Auth Hook
export function useJWTAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount (EXATAMENTE como no monólito)
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch {
          // Invalid saved data, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // API helper with auth header (currently unused but kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Test backend availability first
      const isBackendAvailable = await testBackend();
      
      if (isBackendAvailable) {
        const response = await fetch(`${API_BASE_URL}/user/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao fazer login');
        }

        const data = await response.json();
        const authToken = data.result.token;

        // Decode JWT to get user info (simple decode, no verification needed on client)
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const userData = {
          id: payload.id,
          username: payload.username,
          email: payload.email,
        };

        // Save to state and localStorage
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        // Fallback: simulate backend for demo purposes
        
        // Simple validation for demo
        if (!email.includes('@')) {
          throw new Error('Email inválido');
        }
        
        // Create demo token (not real JWT, just for demo)
        const demoUser = {
          id: 'demo-' + Date.now(),
          username: email.split('@')[0],
          email: email,
        };
        
        const demoToken = 'demo-jwt-' + btoa(JSON.stringify(demoUser));
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('auth_token', demoToken);
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      // Test backend availability first
      const isBackendAvailable = await testBackend();
      
      if (isBackendAvailable) {
        // First create user
        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao criar conta');
        }

        // Then auto-login
        await login(email, password);
      } else {
        // Fallback: simulate backend for demo purposes
        
        // Basic validation
        if (!email.includes('@')) {
          throw new Error('Email inválido');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        if (!username.trim()) {
          throw new Error('Nome é obrigatório');
        }
        
        // Simulate user creation and login
        const demoUser = {
          id: 'demo-' + Date.now(),
          username: username.trim(),
          email: email,
        };
        
        const demoToken = 'demo-jwt-' + btoa(JSON.stringify(demoUser));
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('auth_token', demoToken);
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
      }

    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpar TODOS os dados de autenticação
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('temp_username');
    // Limpar possíveis dados do Supabase ainda em cache
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-auth-token');
    sessionStorage.clear();
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    token,
  };
}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useJWTAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
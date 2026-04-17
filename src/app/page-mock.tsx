'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Hero } from '@/components/organisms/Hero';
import { Footer } from '@/components/organisms/Footer';
import { AuthModal } from '@/components/organisms/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleAuthModalChange = useCallback((variant: 'signup' | 'login' | null) => {
    if (variant !== null) {
      setAuthModalKey((k) => k + 1);
    }
    setAuthModalVariant(variant);
  }, []);

  useEffect(() => {
    // Aguarda um microtask para garantir hydratação completa
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Home: Verificando usuário:', user, 'Hydrated:', isHydrated);
    
    // Só redireciona após a hidratação estar completa
    if (isHydrated && user) {
      console.log('Home: Usuário autenticado após hidratação, redirecionando para dashboard');
      router.replace('/dashboard');
    } else if (isHydrated) {
      console.log('Home: Usuário não autenticado após hidratação, permanecendo na home');
    }
  }, [user, router, isHydrated]);

  if (!isHydrated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#004D61'
      }}>
        Inicializando...
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#004D61'
      }}>
        Redirecionando...
      </div>
    );
  }

  return (
    <>
      <Navbar
        authModalVariant={authModalVariant}
        onAuthModalChange={handleAuthModalChange}
      />
      <Hero
        onOpenSignUp={() => handleAuthModalChange('signup')}
        onOpenLogin={() => handleAuthModalChange('login')}
      />
      <Footer />
      <AuthModal
        key={authModalKey}
        isOpen={authModalVariant !== null}
        onClose={() => handleAuthModalChange(null)}
        variant={authModalVariant ?? 'signup'}
      />
    </>
  );
}

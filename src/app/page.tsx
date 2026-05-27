'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Hero } from '@/components/organisms/Hero';
import { Footer } from '@/components/organisms/Footer';
import { AuthModalJWT } from '@/components/organisms/AuthModal/AuthModalJWT';
import { useAuth } from '@/hooks/useJWTAuth';

export default function Home() {
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleAuthModalChange = useCallback((variant: 'signup' | 'login' | null) => {
    if (variant !== null) {
      setAuthModalKey((k) => k + 1);
    }
    setAuthModalVariant(variant);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#004D61'
      }}>
        Verificando autenticação...
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
        Redirecionando para dashboard...
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
      <AuthModalJWT
        key={authModalKey}
        isOpen={authModalVariant !== null}
        onClose={() => handleAuthModalChange(null)}
        variant={authModalVariant ?? 'signup'}
      />
    </>
  );
}
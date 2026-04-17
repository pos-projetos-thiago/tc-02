'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Hero } from '@/components/organisms/Hero';
import { Footer } from '@/components/organisms/Footer';
import { AuthModalSupabase } from '@/components/organisms/AuthModal/AuthModalSupabase';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Home() {
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  const handleAuthModalChange = useCallback((variant: 'signup' | 'login' | null) => {
    if (variant !== null) {
      setAuthModalKey((k) => k + 1);
    }
    setAuthModalVariant(variant);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
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
      <AuthModalSupabase
        key={authModalKey}
        isOpen={authModalVariant !== null}
        onClose={() => handleAuthModalChange(null)}
        variant={authModalVariant ?? 'signup'}
      />
    </>
  );
}
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
  const { user } = useAuth();
  const router = useRouter();

  const handleAuthModalChange = useCallback((variant: 'signup' | 'login' | null) => {
    if (variant !== null) {
      setAuthModalKey((k) => k + 1);
    }
    setAuthModalVariant(variant);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
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

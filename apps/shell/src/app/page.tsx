'use client';

import { useCallback, useState } from 'react';
import { Hero } from '../components/Hero';
import { Navbar } from '../components/Navbar';
import { AuthModal } from '../components/AuthModal';

export default function HomePage() {
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);

  console.log('[LOG] 🏠 Shell Home RENDER');

  const handleAuthModalChange = useCallback((variant: 'signup' | 'login' | null) => {
    if (variant !== null) {
      setAuthModalKey((k) => k + 1);
    }
    setAuthModalVariant(variant);
  }, []);

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
      <AuthModal
        key={authModalKey}
        isOpen={authModalVariant !== null}
        onClose={() => handleAuthModalChange(null)}
        variant={authModalVariant ?? 'signup'}
      />
    </>
  );
}
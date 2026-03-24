'use client';

import { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Hero } from '@/components/organisms/Hero';
import { Footer } from '@/components/organisms/Footer';
import { AuthModal } from '@/components/organisms/AuthModal';

export default function Home() {
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null);

  return (
    <>
      <Navbar
        authModalVariant={authModalVariant}
        onAuthModalChange={setAuthModalVariant}
      />
      <Hero
        onOpenSignUp={() => setAuthModalVariant('signup')}
        onOpenLogin={() => setAuthModalVariant('login')}
      />
      <Footer />
      <AuthModal
        isOpen={authModalVariant !== null}
        onClose={() => setAuthModalVariant(null)}
        variant={authModalVariant ?? 'signup'}
      />
    </>
  );
}

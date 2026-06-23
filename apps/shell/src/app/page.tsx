'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '../components/Hero';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      // Redirect to dashboard if already logged in
      router.replace('/dashboard');
    }
  }, [router]);

  // Don't render anything while checking auth to avoid flash
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
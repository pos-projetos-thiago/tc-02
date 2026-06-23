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
    setIsAuthenticated(!!token);
  }, []);

  // Mostrar sempre a home page, não redirecionar automaticamente

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
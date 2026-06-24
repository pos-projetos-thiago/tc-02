'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useJWTAuth';
import { LoadingScreen } from '@/components/atoms/Loading';

export default function TransactionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard/transacoes');
    }
  }, [user, isLoading, router]);

  return (
    <LoadingScreen isVisible={true} size="large" text="Redirecionando..." />
  );
}

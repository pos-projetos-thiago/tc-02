'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './reset-password.module.scss';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Redirecionar para home - função não disponível no JWT
  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>Redirecionando...</h1>
        <p className={styles.message}>
          Funcionalidade de reset de senha não está disponível no momento.
        </p>
      </section>
    </main>
  );
}
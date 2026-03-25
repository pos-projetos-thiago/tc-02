'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNavbar } from '@/components/organisms/DashboardNavbar';
import { Button } from '@/components/atoms/Button';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className={styles.loading} aria-live="polite">
        Carregando…
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar
        userName={user.name}
      />
      <main className={styles.main}>
        <section className={styles.content}>
          <h1 className={styles.title}>Olá, {user.name}!</h1>
          <p className={styles.lead}>
            Você está autenticado. Em breve esta área exibirá saldo, extrato e transações conforme o Tech
            Challenge.
          </p>
          <p className={styles.email}>Conta: {user.email}</p>
          
          <div style={{ marginTop: '2.4rem' }}>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Sair (temporário)
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}

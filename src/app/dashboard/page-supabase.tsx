'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { UserProfileSupabase } from '@/components/molecules/UserProfile/UserProfileSupabase';
import { DashboardNav } from '@/components/molecules/DashboardNav';
import { DashboardHero } from '@/components/organisms/DashboardHero';
import { DashboardServices } from '@/components/organisms/DashboardServices';
import { DashboardExtract } from '@/components/organisms/DashboardExtract';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e não tem usuário, redireciona
    if (!isLoading && !user) {
      console.log('🏠 Dashboard: Usuário não autenticado, redirecionando para home');
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.loading} aria-live="polite">
        Inicializando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading} aria-live="polite">
        Carregando…
      </div>
    );
  }

  // Extrair nome do user metadata ou email
  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário';

  return (
    <DashboardProvider>
      <DashboardContent userName={userName} />
    </DashboardProvider>
  );
}

function DashboardContent({ userName }: { userName: string }) {
  const { balance, transactions } = useDashboard();
  
  return (
    <>
      <UserProfileSupabase userName={userName} />
      <main className={styles.main}>
        <div className={styles['dashboard-grid']}>
          <div className={styles['grid-sidebar']}>
            <DashboardNav />
          </div>

          <div className={styles['grid-header']}>
            <DashboardHero
              userName={userName}
              balance={balance}
            />
          </div>

          <div className={styles['grid-services']}>
            <DashboardServices />
          </div>

          <div className={styles['grid-extract']}>
            <DashboardExtract transactions={transactions} />
          </div>
        </div>
      </main>
    </>
  );
}
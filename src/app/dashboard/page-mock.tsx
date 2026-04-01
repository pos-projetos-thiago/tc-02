'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { UserProfile } from '@/components/molecules/UserProfile';
import { DashboardNav } from '@/components/molecules/DashboardNav';
import { DashboardHero } from '@/components/organisms/DashboardHero';
import { DashboardServices } from '@/components/organisms/DashboardServices';
import { DashboardExtract } from '@/components/organisms/DashboardExtract';
import { AuthDebug } from '@/components/atoms/AuthDebug';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Aguarda um microtask para garantir hydratação completa
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🏠 Dashboard: Verificando usuário:', user, 'Hydrated:', isHydrated);
    
    // Só redireciona após a hidratação estar completa
    if (isHydrated && !user) {
      console.log('🏠 Dashboard: Usuário não encontrado após hydratação, redirecionando para home');
      router.replace('/');
    } else if (user) {
      console.log('🏠 Dashboard: Usuário autenticado, permanecendo no dashboard');
    }
  }, [user, router, isHydrated]);

  if (!isHydrated) {
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

  return (
    <DashboardProvider>
      <DashboardContent userName={user.name} />
    </DashboardProvider>
  );
}

function DashboardContent({ userName }: { userName: string }) {
  const { balance, transactions } = useDashboard();
  
  return (
    <>
      <UserProfile userName={userName} />
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
      <AuthDebug />
    </>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useDashboard } from '@/contexts/DashboardContext';
import { UserProfileSupabase } from '@/components/molecules/UserProfile/UserProfileSupabase';
import { DashboardNav } from '@/components/molecules/DashboardNav';
import { DashboardHero } from '@/components/organisms/DashboardHero';
import { DashboardServices } from '@/components/organisms/DashboardServices';
import { DashboardExtract } from '@/components/organisms/DashboardExtract';
import { LoadingScreen } from '@/components/atoms/Loading';
import styles from './dashboard.module.scss';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Aguardar um tempo maior para evitar loop de redirecionamento
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100); // Pequeno delay para estabilizar

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  // Mostrar loading enquanto autentica
  if (isLoading) {
    return (
      <LoadingScreen 
        isVisible={true}
        size="large" 
        text="Verificando autenticação..." 
      />
    );
  }

  // Se não há usuário, mostrar loading durante redirecionamento
  if (!user) {
    return (
      <LoadingScreen 
        isVisible={true}
        size="large" 
        text="Redirecionando para login..." 
      />
    );
  }

  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário';

  return <DashboardContent userName={userName} />;
}

function DashboardContent({ userName }: { userName: string }) {
  const { balance, transactions } = useDashboard();
  const router = useRouter();

  const handleEditTransactions = () => {
    router.push('/dashboard/transacoes');
  };

  const handleDeleteTransactions = () => {
    router.push('/dashboard/transacoes');
  };
  
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
            <DashboardExtract 
              transactions={transactions}
              onEditClick={handleEditTransactions}
              onDeleteClick={handleDeleteTransactions}
            />
          </div>
        </div>
      </main>
    </>
  );
}
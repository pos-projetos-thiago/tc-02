'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useJWTAuth';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { UserProfileJWT } from '@/components/molecules/UserProfile/UserProfileJWT';
import { DashboardNav } from '@/components/molecules/DashboardNav';
import { DashboardHero } from '@/components/organisms/DashboardHero';
import { DashboardServices } from '@/components/organisms/DashboardServices';
import { DashboardExtract } from '@/components/organisms/DashboardExtract';
import { LoadingScreen } from '@/components/atoms/Loading';
import { StorageWarning } from '@/components/atoms/StorageWarning';
import styles from './dashboard.module.scss';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <LoadingScreen
        isVisible={true}
        size="large"
        text="Verificando autenticação..."
      />
    );
  }

  if (!user) {
    return (
      <LoadingScreen
        isVisible={true}
        size="large"
        text="Redirecionando para login..."
      />
    );
  }

  const userName = user?.username || user?.email?.split('@')[0] || 'Usuário';

  return <DashboardContent userName={userName} />;
}

function DashboardContent({ userName }: { userName: string }) {
  const { balance, transactions, activeSection } = useDashboard();
  const router = useRouter();

  const handleEditTransactions = () => {
    router.push('/dashboard/transacoes');
  };

  const handleDeleteTransactions = () => {
    router.push('/dashboard/transacoes');
  };

  return (
    <>
      <StorageWarning />
      <UserProfileJWT userName={userName} />
      <main className={styles.main}>
        <div className={`${styles['dashboard-grid']} ${activeSection === 'others' ? styles['others-layout'] : ''}`}>
          <div className={styles['grid-sidebar']}>
            <DashboardNav />
          </div>

          <div className={styles['grid-header']}>
            <DashboardHero
              userName={userName}
              balance={balance}
            />
          </div>

          {activeSection !== 'others' && (
            <>
              <div className={styles['grid-services']}>
                <DashboardServices userName={userName} />
              </div>

              <div className={styles['grid-extract']}>
                <DashboardExtract
                  transactions={transactions}
                  onEditClick={handleEditTransactions}
                  onDeleteClick={handleDeleteTransactions}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
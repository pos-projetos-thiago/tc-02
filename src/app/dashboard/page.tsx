'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNavbar } from '@/components/organisms/DashboardNavbar';
import { DashboardSidebar } from '@/components/organisms/DashboardSidebar';
import { DashboardHeader } from '@/components/organisms/DashboardHeader';
import { DashboardServices } from '@/components/organisms/DashboardServices';
import { DashboardExtract } from '@/components/organisms/DashboardExtract';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

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
      <DashboardNavbar userName={user.name} />
      <main className={styles.main}>
        <div className={styles.dashboardGrid}>
          <div className={styles.gridSidebar}>
            <DashboardSidebar />
          </div>

          <div className={styles.gridHeader}>
            <DashboardHeader
              userName={user.name}
              balance={2500.75}
              accountNumber="12345-6"
            />
          </div>

          <div className={styles.gridServices}>
            <DashboardServices />
          </div>

          <div className={styles.gridExtract}>
            <DashboardExtract />
          </div>
        </div>
      </main>
    </>
  );
}

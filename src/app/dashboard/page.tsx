'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/components/molecules/UserProfile';
import { DashboardNav } from '@/components/molecules/DashboardNav';
import { DashboardHero } from '@/components/organisms/DashboardHero';
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
      <UserProfile userName={user.name} />
      <main className={styles.main}>
        <div className={styles['dashboard-grid']}>
          <div className={styles['grid-sidebar']}>
            <DashboardNav />
          </div>

          <div className={styles['grid-header']}>
            <DashboardHero
              userName={user.name}
              balance={2500.75}
            />
          </div>

          <div className={styles['grid-services']}>
            <DashboardServices />
          </div>

          <div className={styles['grid-extract']}>
            <DashboardExtract />
          </div>
        </div>
      </main>
    </>
  );
}

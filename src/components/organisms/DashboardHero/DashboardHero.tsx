'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/components/molecules/BalanceCard';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
}

export const DashboardHero = ({
  balance = 0,
  userName = "Usuário"
}: DashboardHeroProps) => {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    setCurrentDate(dateString.charAt(0).toUpperCase() + dateString.slice(1));
  }, []);

  return (
    <section className={styles.header}>
      <div className={styles.content}>
        <div className={styles['account-info']}>
          <div className={styles['greeting-section']}>
            <h1 className={styles.greeting}>Olá, {userName} :&#41;</h1>
            <time className={styles.date}>{currentDate}</time>
          </div>

          <div className={styles['illustration']}>
            <Image
              src="/DashboardHero/ilustration.svg"
              alt="Ilustração do dashboard financeiro"
              width={690}
              height={400}
              loading="eager"
              priority
              className={styles['illustration-img']}
            />
          </div>
        </div>

        <div className={styles['balance-wrapper']}>
          <BalanceCard balance={balance} />
        </div>
      </div>
    </section>
  );
};
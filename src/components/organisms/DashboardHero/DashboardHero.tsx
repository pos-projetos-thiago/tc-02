'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/components/molecules/BalanceCard';
import { useDashboard } from '@/contexts/DashboardContext';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
}

export const DashboardHero = ({
  balance = 0,
  userName = "Usuário"
}: DashboardHeroProps) => {
  const { activeSection } = useDashboard();
  const currentDate = useMemo(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }, []);

  const isOthersSection = activeSection === 'others';

  return (
    <section className={`${styles.header} ${isOthersSection ? styles['others-mode'] : ''}`}>
      <div className={styles.content}>
        <div className={styles['account-info']}>
          <div className={styles['greeting-section']}>
            <h1 className={`${styles.greeting} ${isOthersSection ? styles['others-greeting'] : ''}`}>
              {isOthersSection ? 'Minha conta' : `Olá, ${userName} :)`}
            </h1>
            {!isOthersSection && <time className={styles.date}>{currentDate}</time>}
          </div>

          <div className={styles['illustration']}>
            <Image
              src={isOthersSection ? "/Services/account.svg" : "/DashboardHero/ilustration.svg"}
              alt={isOthersSection ? "Ícone da conta" : "Ilustração do dashboard financeiro"}
              width={690}
              height={400}
              loading="eager"
              priority
              className={styles['illustration-img']}
            />
          </div>
        </div>

        {!isOthersSection && (
          <div className={styles['balance-wrapper']}>
            <BalanceCard balance={balance} />
          </div>
        )}
      </div>
    </section>
  );
};
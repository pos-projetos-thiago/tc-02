'use client';

import styles from './DashboardHeader.module.scss';

export interface DashboardHeaderProps {
  balance?: number;
  userName?: string;
}

export const DashboardHeader = ({
  balance = 0,
  userName = "Usuário"
}: DashboardHeaderProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Capta a primeira letra da data
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  return (
    <section className={styles.header}>
      <div className={styles.content}>
        <div className={styles['account-info']}>
          <h1 className={styles.greeting}>Olá, {userName} :&#41;</h1>
          <time className={styles.date}>{getCurrentDate()}</time>
        </div>

        <div className={styles['balance-card']}>
          <span className={styles['balance-label']}>Saldo disponível</span>
          <span className={styles['balance-value']}>{formatCurrency(balance)}</span>
        </div>
      </div>
    </section>
  );
};
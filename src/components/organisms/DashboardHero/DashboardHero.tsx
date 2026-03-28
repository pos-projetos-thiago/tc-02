'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
}

export const DashboardHero = ({
  balance = 0,
  userName = "Usuário"
}: DashboardHeroProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsChanging(true);
    setTimeout(() => {
      setIsBalanceVisible(!isBalanceVisible);
      setTimeout(() => {
        setIsChanging(false);
      }, 50);
    }, 150);
  };

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
    
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  return (
    <section className={styles.header}>
      <div className={styles.content}>
        <div className={styles['account-info']}>
          <div className={styles['greeting-section']}>
            <h1 className={styles.greeting}>Olá, {userName} :&#41;</h1>
            <time className={styles.date}>{getCurrentDate()}</time>
          </div>

          <div className={styles['illustration']}>
            <Image
              src="/DashboardHero/ilustration.svg"
              alt="Ilustração do dashboard financeiro"
              width={690}
              height={400}
              className={styles['illustration-img']}
            />
          </div>
        </div>

        <div className={styles['balance-card']}>
          <div className={styles['balance-header']}>
            <span className={styles['balance-label']}>Saldo</span>
            <button
              className={styles['eye-button']}
              onClick={toggleBalanceVisibility}
              aria-label={isBalanceVisible ? "Esconder saldo" : "Mostrar saldo"}
            >
              <Image
                src={isBalanceVisible ? "/DashboardHero/eye.svg" : "/DashboardHero/eye-off.svg"}
                alt="Controle de visibilidade do saldo"
                width={19}
                height={13}
                className={styles['eye-icon']}
              />
            </button>
          </div>

          <div className={styles['balance-divider']}></div>

          <div className={styles['account-info-section']}>
            <p className={styles['account-type']}>Conta Corrente</p>
            <span className={`${styles['balance-value']} ${isChanging ? styles.changing : ''}`}>
              {isBalanceVisible ? formatCurrency(balance) : '••••••'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import styles from './BalanceCard.module.scss';

export interface BalanceCardProps {
  balance: number;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
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


  return (
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
  );
};
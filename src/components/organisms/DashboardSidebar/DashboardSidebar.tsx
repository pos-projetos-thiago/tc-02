'use client';

import Link from 'next/link';
import styles from './DashboardSidebar.module.scss';

export const DashboardSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navigation}>
        <div className={styles['menu-item']}>
          <Link href="/dashboard" className={styles['link-highlight']}>
            Início
          </Link>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button type="button" className={styles.link}>
            Transferências
          </button>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button type="button" className={styles.link}>
            Investimentos
          </button>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button type="button" className={styles.link}>
            Outros serviços
          </button>
        </div>
      </nav>
    </aside>
  );
};
'use client';

import Link from 'next/link';
import styles from './DashboardSidebar.module.scss';

export const DashboardSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navigation}>
        <div className={styles.menuItem}>
          <Link href="/dashboard" className={styles.linkHighlight}>
            Início
          </Link>
          <span className={styles.separatorHighlight} />
        </div>

        <div className={styles.menuItem}>
          <button type="button" className={styles.link}>
            Transferências
          </button>
          <span className={styles.separatorHighlight} />
        </div>

        <div className={styles.menuItem}>
          <button type="button" className={styles.link}>
            Investimentos
          </button>
          <span className={styles.separatorHighlight} />
        </div>

        <div className={styles.menuItem}>
          <button type="button" className={styles.link}>
            Outros serviços
          </button>
        </div>
      </nav>
    </aside>
  );
};
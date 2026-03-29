'use client';

import { useDashboard, type DashboardSection } from '@/contexts/DashboardContext';
import styles from './DashboardNav.module.scss';

export const DashboardNav = () => {
  const { activeSection, setActiveSection } = useDashboard();

  const handleSectionClick = (section: DashboardSection) => {
    setActiveSection(section);
  };
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navigation}>
        <div className={styles['menu-item']}>
          <button 
            type="button" 
            className={`${styles.link} ${activeSection === 'services' ? styles['link-active'] : ''}`}
            onClick={() => handleSectionClick('services')}
          >
            Início
          </button>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button 
            type="button" 
            className={`${styles.link} ${activeSection === 'transfers' ? styles['link-active'] : ''}`}
            onClick={() => handleSectionClick('transfers')}
          >
            Transferências
          </button>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button 
            type="button" 
            className={`${styles.link} ${activeSection === 'investments' ? styles['link-active'] : ''}`}
            onClick={() => handleSectionClick('investments')}
          >
            Investimentos
          </button>
          <span className={styles['separator-highlight']} />
        </div>

        <div className={styles['menu-item']}>
          <button 
            type="button" 
            className={`${styles.link} ${activeSection === 'others' ? styles['link-active'] : ''}`}
            onClick={() => handleSectionClick('others')}
          >
            Outros serviços
          </button>
        </div>
      </nav>
    </aside>
  );
};
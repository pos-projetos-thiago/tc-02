'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDashboard, type DashboardSection } from '@/contexts/DashboardContextJWT';
import styles from './DashboardNav.module.scss';

const TABS: { id: 'services' | 'transfers' | 'investments' | 'others'; label: string }[] = [
  { id: 'services', label: 'Início' },
  { id: 'transfers', label: 'Transferências' },
  { id: 'investments', label: 'Investimentos' },
  { id: 'others', label: 'Outros serviços' }
];


export const DashboardNav = () => {
  const { activeSection, setActiveSection } = useDashboard();

  const handleSectionClick = (section: DashboardSection) => {
    setActiveSection(section);
  };

  const tabValue: number | false =
    activeSection === 'services' ||
    activeSection === 'transfers' ||
    activeSection === 'investments' ||
    activeSection === 'others'
      ? TABS.findIndex((t) => t.id === activeSection)
      : false;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSection(TABS[newValue].id);
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${styles['only-desktop']}`} aria-label="Navegação do painel">
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

      <div className={styles['only-tablet']}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          className={styles.tabs}
          sx={{
            backgroundColor: 'transparent',
            minHeight: 48,
            boxShadow: 'none',
            '& .MuiTabs-scroller, & .MuiTabs-flexContainer': {
              backgroundColor: 'transparent'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#47A138',
              height: 3
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1.5rem',
              minHeight: 52,
              fontFamily: 'inherit',
              color: '#000000',
              fontWeight: 400
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#47A138',
              fontWeight: 700
            }
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.id} label={t.label} disableRipple />
          ))}
        </Tabs>
      </div>
    </>
  );
};

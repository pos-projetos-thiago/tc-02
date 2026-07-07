'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDashboard, type DashboardSection } from '@/contexts/DashboardContextJWT';
import styles from './DashboardNav.module.scss';

const TABS: { id: 'services' | 'transfers' | 'investments' | 'others'; label: string }[] = [
  { id: 'services', label: 'Início' },
  { id: 'transfers', label: 'Transferências' },
  { id: 'investments', label: 'Investimentos' },
  { id: 'others', label: 'Outros serviços' },
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
          {TABS.map((tab, index) => (
            <div key={tab.id} className={styles['menu-item']}>
              <button
                type="button"
                className={`${styles.link} ${activeSection === tab.id ? styles['link-active'] : ''}`}
                onClick={() => handleSectionClick(tab.id)}
              >
                {tab.label}
              </button>
              {index < TABS.length - 1 && <span className={styles['separator-highlight']} />}
            </div>
          ))}
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
            '& .MuiTabs-scroller, & .MuiTabs-flexContainer': { backgroundColor: 'transparent' },
            '& .MuiTabs-indicator': { backgroundColor: '#47A138', height: 3 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1.5rem',
              minHeight: 52,
              fontFamily: 'inherit',
              color: '#000000',
              fontWeight: 400,
            },
            '& .MuiTab-root.Mui-selected': { color: '#47A138', fontWeight: 700 },
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

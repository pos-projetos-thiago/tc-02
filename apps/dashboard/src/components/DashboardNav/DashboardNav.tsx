'use client';

import styles from './DashboardNav.module.scss';

export interface DashboardNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DashboardNav = ({ activeSection, onSectionChange }: DashboardNavProps) => {
  const sections = [
    { key: 'services', label: 'Início', icon: '🏠' },
    { key: 'transfers', label: 'Transferências', icon: '💱' },
    { key: 'investments', label: 'Investimentos', icon: '📈' },
    { key: 'cards', label: 'Cartões', icon: '💳' },
    { key: 'others', label: 'Outros', icon: '⚙️' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <h2>Bytebank</h2>
      </div>
      
      <ul className={styles.menu}>
        {sections.map(section => (
          <li key={section.key}>
            <button
              className={`${styles.menuItem} ${activeSection === section.key ? styles.active : ''}`}
              onClick={() => onSectionChange(section.key)}
            >
              <span className={styles.icon}>{section.icon}</span>
              <span className={styles.label}>{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
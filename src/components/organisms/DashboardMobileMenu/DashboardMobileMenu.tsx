'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { useDashboard, type DashboardSection } from '@/contexts/DashboardContextJWT';
import styles from '../MobileMenu/MobileMenu.module.scss';

export interface DashboardMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS: { id: DashboardSection; label: string }[] = [
  { id: 'services', label: 'Início' },
  { id: 'transfers', label: 'Transferências' },
  { id: 'investments', label: 'Investimentos' },
  { id: 'others', label: 'Outros serviços' },
];

export const DashboardMobileMenu = ({ isOpen, onClose }: DashboardMobileMenuProps) => {
  const { activeSection, setActiveSection } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const goToSection = (section: DashboardSection) => {
    setActiveSection(section);
    onClose();
    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu do painel"
      >
        <button
          type="button"
          className={styles['close-button']}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <CloseIcon sx={{ fontSize: 32 }} />
        </button>
        <nav className={styles.nav}>
          {SECTIONS.map((item, index) => (
            <div key={item.id} className={styles['menu-item']}>
              <button
                type="button"
                className={activeSection === item.id ? styles['link-highlight'] : styles.link}
                onClick={() => goToSection(item.id)}
              >
                {item.label}
              </button>
              {index < SECTIONS.length - 1 && <span className={styles['separator-highlight']} />}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

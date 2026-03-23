'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import styles from './MobileMenu.module.scss';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
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
        aria-label="Menu mobile"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <CloseIcon sx={{ fontSize: 32 }} />
        </button>
        <nav className={styles.nav}>
          <div className={styles.menuItem}>
            <Link href="/" className={styles.linkHighlight} onClick={onClose}>
              Início
            </Link>
            <span className={styles.separatorHighlight} />
          </div>
          <div className={styles.menuItem}>
            <Link href="#" className={styles.link} onClick={onClose}>
              Abrir conta
            </Link>
            <span className={styles.separatorHighlight} />
          </div>
          <div className={styles.menuItem}>
            <Link href="#" className={styles.link} onClick={onClose}>
              Já tenho conta
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

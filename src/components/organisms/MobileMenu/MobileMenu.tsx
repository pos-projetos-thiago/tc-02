'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import styles from './MobileMenu.module.scss';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp?: () => void;
  onOpenLogin?: () => void;
}

export const MobileMenu = ({ isOpen, onClose, onOpenSignUp, onOpenLogin }: MobileMenuProps) => {
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
          className={styles["close-button"]}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <CloseIcon sx={{ fontSize: 32 }} />
        </button>
        <nav className={styles.nav}>
          <div className={styles["menu-item"]}>
            <Link href="/" className={styles["link-highlight"]} onClick={onClose}>
              Início
            </Link>
            <span className={styles["separator-highlight"]} />
          </div>
          <div className={styles["menu-item"]}>
            <button
              type="button"
              className={styles.link}
              onClick={() => { onClose(); onOpenSignUp?.(); }}
            >
              Abrir conta
            </button>
            <span className={styles["separator-highlight"]} />
          </div>
          <div className={styles["menu-item"]}>
            <button
              type="button"
              className={styles.link}
              onClick={() => { onClose(); onOpenLogin?.(); }}
            >
              Já tenho conta
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

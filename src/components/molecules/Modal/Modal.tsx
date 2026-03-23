'use client';

import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
  ariaLabel: string;
  fullHeight?: boolean;
}

export const Modal = ({ isOpen, onClose, children, contentClassName, ariaLabel, fullHeight }: ModalProps) => {
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
      <div
        className={`${styles.overlay} ${fullHeight ? styles.overlayFullHeight : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className={`${styles.content} ${fullHeight ? styles.contentFullHeight : ''} ${contentClassName || ''}`.trim()}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

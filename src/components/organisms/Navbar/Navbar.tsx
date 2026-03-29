'use client';

import { useState } from 'react';
import styles from './Navbar.module.scss';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { MenuButton } from '@/components/atoms/MenuButton';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { AuthModal } from '@/components/organisms/AuthModal';

export interface NavbarProps {
  authModalVariant?: 'signup' | 'login' | null;
  onAuthModalChange?: (variant: 'signup' | 'login' | null) => void;
}

export const Navbar = ({ authModalVariant: authModalVariantProp, onAuthModalChange }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalVariantInternal, setAuthModalVariantInternal] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);

  const isControlled = onAuthModalChange !== undefined;
  const authModalVariant = isControlled ? authModalVariantProp ?? null : authModalVariantInternal;

  const openSignUp = () => {
    if (isControlled) onAuthModalChange!('signup');
    else {
      setAuthModalKey((k) => k + 1);
      setAuthModalVariantInternal('signup');
    }
  };
  const openLogin = () => {
    if (isControlled) onAuthModalChange!('login');
    else {
      setAuthModalKey((k) => k + 1);
      setAuthModalVariantInternal('login');
    }
  };
  const closeAuthModal = () => (isControlled ? onAuthModalChange!(null) : setAuthModalVariantInternal(null));

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles['menu-button-wrapper']}>
            <MenuButton onClick={() => setMobileMenuOpen(true)} />
          </div>

        <div className={styles['logo-full']}>
          <Image src="/Navbar/logo.svg" alt="Logo Bytebank" width={146} height={32} priority />
        </div>

        <div className={styles['logo-small']}>
          <Image src="/Navbar/logo-small.svg" alt="Logo Bytebank" width={26} height={26} priority />
        </div>

        <div className={styles.links}>
          <ul>
            <li>
              <a href="#">Sobre</a>
            </li>
            <li>
              <a href="#">Serviços</a>
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <span className={styles['abrir-conta']}>
            <Button variant="primary" onClick={openSignUp}>Abrir minha conta</Button>
          </span>
          <span className={styles['abrir-conta-tablet']}>
            <Button variant="primary" onClick={openSignUp}>Abrir conta</Button>
          </span>
          <Button variant="secondary" onClick={openLogin}>Já tenho conta</Button>
        </div>
      </div>
    </nav>
    <MobileMenu
      isOpen={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpenSignUp={() => { setMobileMenuOpen(false); openSignUp(); }}
      onOpenLogin={() => { setMobileMenuOpen(false); openLogin(); }}
    />
    {!isControlled && (
      <AuthModal
        key={authModalKey}
        isOpen={authModalVariant !== null}
        onClose={closeAuthModal}
        variant={authModalVariant ?? 'signup'}
      />
    )}
    </>
  );
};

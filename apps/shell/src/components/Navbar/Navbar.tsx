'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './Navbar.module.scss';
import Image from 'next/image';
import { Button } from '../atoms/Button';
import { useAuth } from '../../hooks/useJWTAuth';

export interface NavbarProps {
  authModalVariant?: 'signup' | 'login' | null;
  onAuthModalChange?: (variant: 'signup' | 'login' | null) => void;
}

export const Navbar = ({ 
  authModalVariant: authModalVariantProp, 
  onAuthModalChange 
}: NavbarProps) => {
  const [authModalVariantInternal, setAuthModalVariantInternal] = useState<'signup' | 'login' | null>(null);
  const [authModalKey, setAuthModalKey] = useState(0);
  const { user, logout } = useAuth();

  // Determine se está sendo controlado externamente
  const isControlled = onAuthModalChange !== undefined;
  const authModalVariant = isControlled ? authModalVariantProp ?? null : authModalVariantInternal;

  const openSignUp = useCallback(() => {
    if (isControlled) {
      onAuthModalChange!('signup');
    } else {
      setAuthModalKey((k) => k + 1);
      setAuthModalVariantInternal('signup');
    }
  }, [isControlled, onAuthModalChange]);

  const openLogin = useCallback(() => {
    if (isControlled) {
      onAuthModalChange!('login');
    } else {
      setAuthModalKey((k) => k + 1);
      setAuthModalVariantInternal('login');
    }
  }, [isControlled, onAuthModalChange]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
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
          <Button variant="primary" onClick={openSignUp}>
            Abrir minha conta
          </Button>
          <Button variant="secondary" onClick={openLogin}>
            Já tenho conta
          </Button>
        </div>
      </div>
    </nav>
  );
};
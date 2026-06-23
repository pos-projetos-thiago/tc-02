'use client';

import { useState } from 'react';
import styles from './Navbar.module.scss';
import Image from 'next/image';
import { Button } from '../atoms/Button';

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    // Simula login para demonstração
    localStorage.setItem('auth_token', 'demo-token-microfrontend');
    window.location.reload();
  };

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
          <Button variant="primary" onClick={handleLogin}>
            Abrir minha conta
          </Button>
          <Button variant="secondary" onClick={handleLogin}>
            Já tenho conta
          </Button>
        </div>
      </div>
    </nav>
  );
};
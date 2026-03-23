'use client'

import { useState } from 'react'
import styles from './Navbar.module.scss'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { MenuButton } from '@/components/atoms/MenuButton'
import { MobileMenu } from '@/components/organisms/MobileMenu'
import { AuthModal } from '@/components/organisms/AuthModal'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalVariant, setAuthModalVariant] = useState<'signup' | 'login' | null>(null)

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
            <Button variant="primary" onClick={() => setAuthModalVariant('signup')}>Abrir minha conta</Button>
          </span>
          <span className={styles['abrir-conta-tablet']}>
            <Button variant="primary" onClick={() => setAuthModalVariant('signup')}>Abrir conta</Button>
          </span>
          <Button variant="secondary" onClick={() => setAuthModalVariant('login')}>Já tenho conta</Button>
        </div>
      </div>
    </nav>
    <MobileMenu
      isOpen={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpenSignUp={() => { setMobileMenuOpen(false); setAuthModalVariant('signup'); }}
      onOpenLogin={() => { setMobileMenuOpen(false); setAuthModalVariant('login'); }}
    />
    <AuthModal
      isOpen={authModalVariant !== null}
      onClose={() => setAuthModalVariant(null)}
      variant={authModalVariant ?? 'signup'}
    />
    </>
  )
}

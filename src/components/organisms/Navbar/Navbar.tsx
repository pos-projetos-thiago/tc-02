'use client'

import styles from './Navbar.module.scss'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { MenuButton } from '@/components/atoms/MenuButton'
import { useState } from 'react'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles['menu-button-wrapper']}>
          <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
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
          <Button variant="primary" className={styles['abrir-conta']}>Abrir minha conta</Button>
          <Button variant="primary" className={styles['abrir-conta-tablet']}>Abrir conta</Button>
          <Button variant="secondary">Já tenho conta</Button>
        </div>
      </div>
    </nav>
  )
}

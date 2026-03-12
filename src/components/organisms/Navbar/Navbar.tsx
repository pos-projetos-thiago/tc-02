import styles from './Navbar.module.scss'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Image src="/Navbar/logo.svg" alt="Logo Bytebank" width={146} height={32} priority />
          <ul>
            <li>
              <a href="#">Sobre</a>
            </li>
            <li>
              <a href="#">Sobre</a>
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Button variant="primary">Abrir minha conta</Button>
          <Button variant="secondary">Já tenho conta</Button>
        </div>
      </div>
    </nav>
  )
}

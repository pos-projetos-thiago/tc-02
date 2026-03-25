'use client';

import Image from 'next/image';
import styles from './DashboardNavbar.module.scss';

export interface DashboardNavbarProps {
  userName: string;
  avatarSrc?: string;
}

export const DashboardNavbar = ({
  userName,
  avatarSrc = '/DashboardNavbar/avatar.svg'
}: DashboardNavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
          </div>

          <div className={styles.avatar}>
            <Image
              src={avatarSrc}
              alt={`Avatar de ${userName}`}
              width={40}
              height={40}
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
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
        <div className={styles['user-section']}>
          <div className={styles['user-info']}>
            <span className={styles['user-name']}>{userName}</span>
          </div>
          
          <div className={styles.avatar}>
            <Image 
              src={avatarSrc} 
              alt={`Avatar de ${userName}`}
              width={40}
              height={40}
              className={styles['avatar-image']}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
'use client';

import Image from 'next/image';
import styles from './UserProfile.module.scss';

export interface UserProfileProps {
  userName: string;
  avatarSrc?: string;
}

export const UserProfile = ({
  userName,
  avatarSrc = '/UserProfile/avatar.svg'
}: UserProfileProps) => {
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
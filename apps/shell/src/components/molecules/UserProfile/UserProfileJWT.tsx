'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MenuButton } from '@/components/atoms/MenuButton/MenuButton';
import { DashboardMobileMenu } from '@/components/organisms/DashboardMobileMenu/DashboardMobileMenu';
import { useAuth } from '@/hooks/useJWTAuth';
import styles from './UserProfile.module.scss';

export interface UserProfileProps {
  userName: string;
  avatarSrc?: string;
}

export const UserProfileJWT = ({
  userName,
  avatarSrc = '/UserProfile/avatar.svg',
}: UserProfileProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles['menu-button-wrapper']}>
            <MenuButton tone="accent" onClick={() => setMobileMenuOpen(true)} />
          </div>

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

            <button
              onClick={handleLogout}
              className={styles['logout-button']}
              title="Sair"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <DashboardMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

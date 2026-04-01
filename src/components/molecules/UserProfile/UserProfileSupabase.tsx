'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/auth/supabase-client-actions';
import styles from './UserProfile.module.scss';

export interface UserProfileProps {
  userName: string;
  avatarSrc?: string;
}

export const UserProfileSupabase = ({
  userName,
  avatarSrc = '/UserProfile/avatar.svg'
}: UserProfileProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
      router.push('/');
    }
  };

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
          
          <button 
            onClick={handleLogout}
            className={styles["logout-button"]}
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useJWTAuth';
import styles from './UserProfile.module.scss';

interface UserProfileJWTProps {
  userName?: string;
}

export function UserProfileJWT({ userName }: UserProfileJWTProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayName = userName || user?.username || user?.email?.split('@')[0] || 'Usuário';

  const handleLogout = useCallback(() => {
    logout();
    setIsDropdownOpen(false);
  }, [logout]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  if (!user) return null;

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileInfo} onClick={toggleDropdown}>
        <div className={styles.avatar}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userDetails}>
          <span className={styles.userName}>{displayName}</span>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
        <div className={styles.dropdownArrow}>
          {isDropdownOpen ? '▲' : '▼'}
        </div>
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownItem}
            onClick={handleLogout}
          >
            🚪 Sair
          </button>
        </div>
      )}
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/components/BalanceCard';
import { ProfileForm } from '../ProfileForm';
import { Toast } from '@/components/atoms/Toast';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { useAuth } from '@/hooks/useJWTAuth';
import { updateUserProfile } from '@/lib/api/transactions';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
}

export const DashboardHero = ({
  balance = 0,
  userName = 'Usuário',
}: DashboardHeroProps) => {
  const { activeSection } = useDashboard();
  const { user } = useAuth();
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'info' | 'error',
  });

  const currentDate = useMemo(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }, []);

  const isOthersSection = activeSection === 'others';

  const handleProfileSave = async (data: { name: string; email: string; password: string }) => {
    try {
      const updateData: Record<string, unknown> = {};
      let passwordChanged = false;

      if (data.name && data.name !== userName) updateData.username = data.name;
      if (data.email && data.email !== user?.email) updateData.email = data.email;
      if (data.password) {
        updateData.password = data.password;
        passwordChanged = true;
      }

      if (Object.keys(updateData).length === 0) {
        setToast({ isVisible: true, message: 'Nenhuma alteração detectada.', type: 'info' });
        return;
      }

      await updateUserProfile(updateData);

      if (updateData.username) {
        localStorage.setItem('temp_username', updateData.username as string);
        window.dispatchEvent(new Event('storage'));
      }

      if (passwordChanged) {
        setToast({
          isVisible: true,
          message: 'Senha alterada com sucesso! Redirecionando para login...',
          type: 'success',
        });
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('temp_username');
          sessionStorage.clear();
          window.location.href = '/';
        }, 2500);
        return;
      }

      let message = 'Perfil atualizado com sucesso!';
      if (updateData.username) message += ` Nome: ${updateData.username}.`;
      if (updateData.email) message += ' Email atualizado.';
      setToast({ isVisible: true, message, type: 'success' });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setToast({ isVisible: true, message: 'Erro ao atualizar perfil. Tente novamente.', type: 'error' });
    }
  };

  return (
    <section className={`${styles.header} ${isOthersSection ? styles['others-mode'] : ''}`}>
      <div className={styles.content}>
        {isOthersSection ? (
          <>
            <div className={styles['account-info']}>
              <div className={styles['greeting-section']}>
                <h1 className={`${styles.greeting} ${styles['others-greeting']}`}>
                  Minha conta
                </h1>
              </div>
              <div className={styles['illustration']}>
                <Image
                  src="/Services/account.svg"
                  alt="Ícone da conta"
                  width={690}
                  height={400}
                  loading="eager"
                  priority
                  className={styles['illustration-img']}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
            <div className={styles['profile-wrapper']}>
              <ProfileForm
                userName={userName}
                userEmail={user?.email || 'usuario@exemplo.com'}
                onSave={handleProfileSave}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['greeting-block']}>
              <h1 className={styles.greeting}>{`Olá, ${userName} :)`}</h1>
              <time className={styles.date}>{currentDate}</time>
            </div>
            <div className={styles['balance-wrapper']}>
              <BalanceCard balance={balance} />
            </div>
            <div className={styles['illustration']}>
              <Image
                src="/DashboardHero/ilustration.svg"
                alt="Ilustração do dashboard financeiro"
                width={690}
                height={400}
                loading="eager"
                priority
                className={styles['illustration-img']}
              />
            </div>
          </>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
        duration={toast.message.length > 80 ? 5000 : 4000}
      />
    </section>
  );
};

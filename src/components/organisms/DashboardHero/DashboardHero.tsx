'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/components/molecules/BalanceCard';
import { ProfileForm } from '@/components/organisms/ProfileForm';
import { Toast } from '@/components/atoms/Toast';
import { useDashboard } from '@/contexts/DashboardContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
}

export const DashboardHero = ({
  balance = 0,
  userName = "Usuário"
}: DashboardHeroProps) => {
  const { activeSection } = useDashboard();
  const { user } = useSupabaseAuth();
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'info' | 'error'
  });
  const currentDate = useMemo(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }, []);

  const isOthersSection = activeSection === 'others';

  const handleProfileSave = (data: { name: string; email: string; password: string }) => {
    const originalName = userName;
    const originalEmail = user?.email || "";
    const changes = [];

    if (data.name !== originalName) {
      changes.push(`Nome: "${originalName}" → "${data.name}"`);
    }

    if (data.email !== originalEmail) {
      changes.push(`Email: "${originalEmail}" → "${data.email}"`);
    }

    if (data.password.trim()) {
      changes.push(`Senha alterada`);
    }

    let message = "";
    let type: 'success' | 'info' | 'error' = 'success';

    if (changes.length === 0) {
      message = "Nenhuma alteração foi feita no perfil";
      type = 'info';
    } else if (changes.length === 1) {
      message = `Perfil atualizado! ${changes[0]}`;
      type = 'success';
    } else {
      message = `Perfil atualizado com ${changes.length} alterações: ${changes.join(" • ")}`;
      type = 'success';
    }

    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const handleCloseToast = () => {
    setToast({ isVisible: false, message: '', type: 'success' });
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
                userEmail={user?.email || "usuario@exemplo.com"}
                onSave={handleProfileSave}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['greeting-block']}>
              <h1 className={styles.greeting}>
                {`Olá, ${userName} :)`}
              </h1>
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
        onClose={handleCloseToast}
        duration={toast.message.length > 80 ? 5000 : 4000}
      />
    </section>
  );
};
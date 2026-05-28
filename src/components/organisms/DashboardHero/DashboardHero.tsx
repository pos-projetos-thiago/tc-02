'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/components/molecules/BalanceCard';
import { ProfileForm } from '@/components/organisms/ProfileForm';
import { Toast } from '@/components/atoms/Toast';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { useAuth } from '@/hooks/useJWTAuth';
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
  const { user } = useAuth();
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

  const handleProfileSave = async (data: { name: string; email: string; password: string }) => {
    // TODO: Implementar edição de perfil com JWT API
    // Por enquanto, salvar temporariamente no localStorage
    
    let message = "Perfil atualizado temporariamente!";
    
    if (data.name && data.name !== userName) {
      // Salvar nome temporariamente
      localStorage.setItem('temp_username', data.name);
      message += ` Nome alterado para: ${data.name}.`;
      
      // Trigger re-render forçando evento
      window.dispatchEvent(new Event('storage'));
    }
    if (data.email && data.email !== user?.email) {
      message += ` Email alterado.`;
    }
    if (data.password) {
      message += ` Senha alterada.`;
    }
    
    setToast({
      isVisible: true,
      message: message + " (Mudanças locais apenas)",
      type: 'success'
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
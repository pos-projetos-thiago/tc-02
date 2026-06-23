'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { BalanceCard } from '@/shared/components/molecules';
import { Toast } from '@/shared/components/atoms';
import { updateUserProfile } from '@/shared/lib/api';
import styles from './DashboardHero.module.scss';

export interface DashboardHeroProps {
  balance?: number;
  userName?: string;
  activeSection?: string;
  user?: { email?: string } | null;
}

export const DashboardHero = ({
  balance = 0,
  userName = "Usuário",
  activeSection = 'services',
  user = null
}: DashboardHeroProps) => {
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
    try {
      // Preparar dados para envio à API
      const updateData: Record<string, unknown> = {};
      let passwordChanged = false;
      
      if (data.name && data.name !== userName) {
        updateData.username = data.name;
      }
      if (data.email && data.email !== user?.email) {
        updateData.email = data.email;
      }
      if (data.password) {
        updateData.password = data.password;
        passwordChanged = true;
      }

      // Se não há mudanças, mostrar mensagem
      if (Object.keys(updateData).length === 0) {
        setToast({
          isVisible: true,
          message: "Nenhuma alteração detectada.",
          type: 'info'
        });
        return;
      }

      // Chamar API para atualizar perfil
      await updateUserProfile(updateData);
      
      // Atualizar localStorage se o nome mudou
      if (updateData.username) {
        localStorage.setItem('temp_username', updateData.username as string);
        // Trigger re-render forçando evento
        window.dispatchEvent(new Event('storage'));
      }

      // Se senha foi alterada, fazer logout automático
      if (passwordChanged) {
        setToast({
          isVisible: true,
          message: "Senha alterada com sucesso! Redirecionando para login...",
          type: 'success'
        });
        
        // Aguardar um pouco para mostrar a mensagem, depois fazer logout
        setTimeout(() => {
          // Limpar dados de autenticação
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('temp_username');
          sessionStorage.clear();
          
          // Redirecionar para a página inicial
          window.location.href = '/';
        }, 2500);
        
        return;
      }

      // Construir mensagem de sucesso para outros casos
      let message = "Perfil atualizado com sucesso!";
      if (updateData.username) message += ` Nome: ${updateData.username}.`;
      if (updateData.email) message += ` Email atualizado.`;
      
      setToast({
        isVisible: true,
        message,
        type: 'success'
      });

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setToast({
        isVisible: true,
        message: "Erro ao atualizar perfil. Tente novamente.",
        type: 'error'
      });
    }
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
              <p>Formulário de perfil será carregado aqui</p>
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
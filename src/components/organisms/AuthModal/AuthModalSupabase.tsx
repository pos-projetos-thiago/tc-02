'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { signUpUser, signInUser } from '@/lib/auth/supabase-client-actions';
import styles from './AuthModal.module.scss';

export type AuthModalVariant = 'signup' | 'login';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: AuthModalVariant;
  errorMessage?: string | null;
}

type FieldKey = 'name' | 'email' | 'password';

const AUTH_CONFIG = {
  signup: {
    title: 'Preencha os campos abaixo para criar sua conta corrente!',
    imageSrc: '/Modal/signup.svg',
    imageAlt: 'Ilustração cadastro',
    submitLabel: 'Criar conta',
    buttonVariant: 'accent' as const,
    privacyText: 'Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na Política de Privacidade do banco.',
    inputs: [
      {
        type: 'text' as const,
        fieldKey: 'name' as const,
        placeholder: 'Digite seu nome completo',
        label: 'Nome',
      },
      {
        type: 'email' as const,
        fieldKey: 'email' as const,
        placeholder: 'Digite seu email',
        label: 'Email',
      },
      {
        type: 'password' as const,
        fieldKey: 'password' as const,
        placeholder: 'Digite sua senha (mín. 6 caracteres)',
        label: 'Senha',
      },
    ],
  },
  login: {
    title: 'Login',
    imageSrc: '/Modal/login.svg',
    imageAlt: 'Ilustração login',
    submitLabel: 'Acessar',
    buttonVariant: 'primary' as const,
    forgotPasswordText: 'Esqueci a senha!',
    inputs: [
      {
        type: 'email' as const,
        fieldKey: 'email' as const,
        placeholder: 'Digite seu email',
        label: 'Email',
      },
      {
        type: 'password' as const,
        fieldKey: 'password' as const,
        placeholder: 'Digite sua senha',
        label: 'Senha',
      },
    ],
  },
};

const emptyValues: Record<FieldKey, string> = {
  name: '',
  email: '',
  password: '',
};

export const AuthModalSupabase = ({ isOpen, onClose, variant, errorMessage }: AuthModalProps) => {
  const config = AUTH_CONFIG[variant];
  const router = useRouter();
  const [values, setValues] = useState(emptyValues);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null); // Limpar erro quando usuário digita
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validações client-side
    if (variant === 'signup' && !privacyAccepted) {
      setError('É necessário aceitar a política de privacidade.');
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      
      if (variant === 'signup') {
        result = await signUpUser(values.name.trim(), values.email.trim(), values.password);
      } else {
        result = await signInUser(values.email.trim(), values.password);
      }
      
      if (result.success) {
        // Sucesso - fechar modal e redirecionar
        onClose();
        setValues(emptyValues);
        setPrivacyAccepted(false);
        setError(null);
        
        // Pequeno delay para garantir que o auth state seja atualizado
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        // Mostrar erro
        setError(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const dialogLabel = variant === 'login' ? 'Login' : 'Criar conta corrente';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={dialogLabel}
      fullHeight
      contentClassName={`${styles.content} ${styles[variant]}`}
    >
      <div className={styles.wrapper}>
        <div className={styles.imageWrapper}>
          <Image
            src={config.imageSrc}
            alt={config.imageAlt}
            fill
            sizes="(max-width: 719px) 300px, 355px"
          />
        </div>
        <div className={styles.formWrapper}>
          <h2 id="auth-modal-title" className={styles.title}>
            {config.title}
          </h2>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {(error || errorMessage) && (
              <p className={styles.formError} role="alert">
                {error || (errorMessage ? decodeURIComponent(errorMessage) : '')}
              </p>
            )}
            {config.inputs.map((input, index) => {
              const id = `auth-${variant}-${input.fieldKey}`;
              return (
                <div key={input.fieldKey} className={styles.field}>
                  <label htmlFor={id} className={styles.label}>
                    {input.label}
                  </label>
                  <input
                    id={id}
                    type={input.type}
                    placeholder={input.placeholder}
                    className={styles.input}
                    value={values[input.fieldKey]}
                    onChange={(ev) => handleChange(input.fieldKey, ev.target.value)}
                    disabled={isLoading}
                    autoComplete={
                      input.fieldKey === 'password'
                        ? variant === 'signup'
                          ? 'new-password'
                          : 'current-password'
                        : input.fieldKey === 'email'
                          ? 'email'
                          : 'name'
                    }
                    required
                  />
                  {'forgotPasswordText' in config &&
                    index === config.inputs.length - 1 && (
                      <button
                        type="button"
                        className={styles.forgotPassword}
                        disabled={isLoading}
                      >
                        {config.forgotPasswordText}
                      </button>
                    )}
                </div>
              );
            })}
            {'privacyText' in config && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  disabled={isLoading}
                  required
                />
                <span className={styles.checkboxText}>{config.privacyText}</span>
              </label>
            )}
            <Button 
              variant={config.buttonVariant} 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : config.submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
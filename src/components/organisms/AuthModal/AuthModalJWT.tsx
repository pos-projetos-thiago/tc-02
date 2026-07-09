'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Modal } from '@/components/molecules/Modal/Modal';
import { Button } from '@/components/atoms/Button/Button';
import { useAuth } from '@/hooks/useJWTAuth';
import styles from './AuthModal.module.scss';

interface AuthModalJWTProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'signup' | 'login';
}

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

type FieldKey = 'name' | 'email' | 'password';

const emptyValues: Record<FieldKey, string> = {
  name: '',
  email: '',
  password: '',
};

export function AuthModalJWT({ isOpen, onClose, variant }: AuthModalJWTProps) {
  const config = AUTH_CONFIG[variant];
  const { login, signup } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState(emptyValues);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: FieldKey, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (variant === 'signup' && !privacyAccepted) {
      setError('É necessário aceitar a política de privacidade.');
      return;
    }

    setIsLoading(true);
    
    try {
      if (variant === 'signup') {
        if (!values.name.trim() || !values.email.trim() || !values.password) {
          throw new Error('Todos os campos são obrigatórios');
        }
        if (values.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }

        await signup(values.name.trim(), values.email.trim(), values.password);
      } else {
        if (!values.email.trim() || !values.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        await login(values.email.trim(), values.password);
      }

      handleClose();
      setValues(emptyValues);
      setPrivacyAccepted(false);
      setError('');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setValues(emptyValues);
    setPrivacyAccepted(false);
    setError('');
    setIsLoading(false);
    setShowPassword(false);
    onClose();
  };

  const currentSubmitLabel = isLoading ? 'Processando...' : config.submitLabel;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={variant === 'login' ? 'Login' : 'Criar conta corrente'}
      fullHeight
      contentClassName={`${styles.content} ${styles[variant]}`}
    >
      <div className={styles.wrapper}>
        <div className={styles["image-wrapper"]}>
          <Image
            src={config.imageSrc}
            alt={config.imageAlt}
            fill
            sizes="(max-width: 719px) 300px, 355px"
          />
        </div>
        <div className={styles["form-wrapper"]}>
          <h2 id="auth-modal-title" className={styles.title}>
            {config.title}
          </h2>
          
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && (
              <p className={styles["form-error"]} role="alert">
                {error}
              </p>
            )}
            
            {config.inputs.map((input, index) => {
              const id = `auth-${variant}-${input.fieldKey}`;
              return (
                <div key={input.fieldKey} className={styles.field}>
                  <label htmlFor={id} className={styles.label}>
                    {input.label}
                  </label>
                  {input.type === 'password' ? (
                    <div className={styles['password-shell']}>
                      <input
                        id={id}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={input.placeholder}
                        className={styles['password-input']}
                        value={values[input.fieldKey]}
                        onChange={(ev) => handleChange(input.fieldKey, ev.target.value)}
                        disabled={isLoading}
                        autoComplete={
                          variant === 'signup' ? 'new-password' : 'current-password'
                        }
                        required
                      />
                      <button
                        type="button"
                        className={styles['password-toggle']}
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={isLoading}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 22 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 22 }} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <input
                      id={id}
                      type={input.type}
                      placeholder={input.placeholder}
                      className={styles.input}
                      value={values[input.fieldKey]}
                      onChange={(ev) => handleChange(input.fieldKey, ev.target.value)}
                      disabled={isLoading}
                      autoComplete={
                        input.fieldKey === 'email' ? 'email' : 'name'
                      }
                      required
                    />
                  )}

                </div>
              );
            })}
            
            {variant === 'signup' && 'privacyText' in config && (
              <label className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  disabled={isLoading}
                  required
                />
                <span className={styles["checkbox-text"]}>{config.privacyText}</span>
              </label>
            )}
            
            {variant === 'signup' ? (
              <div className={styles['submit-bar']}>
                <Button
                  variant={config.buttonVariant}
                  type="submit"
                  className={styles['submit-button']}
                  disabled={isLoading}
                >
                  {currentSubmitLabel}
                </Button>
              </div>
            ) : (
              <Button
                variant={config.buttonVariant}
                type="submit"
                className={styles['submit-button']}
                disabled={isLoading}
              >
                {currentSubmitLabel}
              </Button>
            )}
          </form>
        </div>
      </div>
    </Modal>
  );
}
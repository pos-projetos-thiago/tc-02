'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AuthModal.module.scss';

export type AuthModalVariant = 'signup' | 'login';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: AuthModalVariant;
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
        placeholder: 'Digite sua senha',
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

export const AuthModal = ({ isOpen, onClose, variant }: AuthModalProps) => {
  const config = AUTH_CONFIG[variant];
  const { login, signUp } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState(emptyValues);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = useCallback(() => {
    setShowPassword(false);
    onClose();
  }, [onClose]);

  const handleChange = useCallback((key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = values.email.trim();
    const password = values.password;
    const name = values.name.trim();

    try {
      if (variant === 'signup') {
        if (!name || !email || !password) {
          setError('Preencha nome, e-mail e senha.');
          return;
        }
        if (!privacyAccepted) {
          setError('É necessário aceitar a política de privacidade.');
          return;
        }
        
        signUp(name, email, password);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        handleClose();
        setValues(emptyValues);
        setPrivacyAccepted(false);
        router.push('/dashboard');
        return;
      }

      if (!email || !password) {
        setError('Preencha e-mail e senha.');
        return;
      }
      
      console.log('Iniciando processo de login...');
      login(email, password);
      console.log('Login executado, aguardando...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Fechando modal...');
      handleClose();
      setValues(emptyValues);
      console.log('Navegando para dashboard...');
      router.push('/dashboard');
      console.log('Processo de login concluído!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 
        variant === 'signup' ? 'Não foi possível criar a conta.' : 'Não foi possível entrar.';
      setError(message);
    }
  };

  const dialogLabel =
    variant === 'login' ? 'Login' : 'Criar conta corrente';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={dialogLabel}
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
                        autoComplete={
                          variant === 'signup' ? 'new-password' : 'current-password'
                        }
                      />
                      <button
                        type="button"
                        className={styles['password-toggle']}
                        onClick={() => setShowPassword((v) => !v)}
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
                      autoComplete={
                        input.fieldKey === 'email' ? 'email' : 'name'
                      }
                    />
                  )}
                  {'forgotPasswordText' in config &&
                    index === config.inputs.length - 1 && (
                      <button
                        type="button"
                        className={styles["forgot-password"]}
                        onClick={() => setError('Fluxo de recuperação de senha não está disponível nesta demonstração.')}
                      >
                        {config.forgotPasswordText}
                      </button>
                    )}
                </div>
              );
            })}
            {'privacyText' in config && (
              <label className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    setError(null);
                  }}
                />
                <span className={styles["checkbox-text"]}>{config.privacyText}</span>
              </label>
            )}
            {variant === 'signup' ? (
              <div className={styles['submit-bar']}>
                <Button variant={config.buttonVariant} type="submit" className={styles['submit-button']}>
                  {config.submitLabel}
                </Button>
              </div>
            ) : (
              <Button variant={config.buttonVariant} type="submit" className={styles['submit-button']}>
                {config.submitLabel}
              </Button>
            )}
          </form>
        </div>
      </div>
    </Modal>
  );
};

'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { signUpUser, signInUser, resetPassword } from '@/lib/auth/supabase-client-actions';
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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = useCallback(() => {
    setShowPassword(false);
    onClose();
  }, [onClose]);

  const handleChange = useCallback((key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setResetSuccess(false);
  }, []);

  const handleForgotPassword = async () => {
    if (!values.email.trim()) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await resetPassword(values.email.trim());
      
      if (result.success) {
        setResetSuccess(true);
        setError(null);
      } else {
        setError(result.error || 'Erro ao enviar email de recuperação');
      }
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Se está no modo "forgot password", chama a função específica
    if (isForgotPassword) {
      await handleForgotPassword();
      return;
    }
    
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
        handleClose();
        setValues(emptyValues);
        setPrivacyAccepted(false);
        setError(null);
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const dialogLabel = isForgotPassword ? 'Recuperar senha' : 
    (variant === 'login' ? 'Login' : 'Criar conta corrente');

  const currentTitle = isForgotPassword ? 'Recuperar senha' :
    (resetSuccess ? 'Email enviado!' : config.title);

  const currentSubmitLabel = isForgotPassword ? 'Enviar email de recuperação' : 
    (isLoading ? 'Processando...' : config.submitLabel);

  const showInputs = !resetSuccess;

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
            {currentTitle}
          </h2>
          
          {resetSuccess ? (
            <div className={styles["reset-success"]}>
              <p>Solicitação de recuperação processada!</p>
              <p>Se este email estiver cadastrado em nossa plataforma, você receberá um link para redefinir sua senha em alguns minutos.</p>
              <p className={styles["hint-text"]}>Verifique também sua caixa de spam.</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSuccess(false);
                  setValues(emptyValues);
                  setError(null);
                }}
                className={styles["submit-button"]}
              >
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {(error || errorMessage) && (
                <p className={styles["form-error"]} role="alert">
                  {error || (errorMessage ? decodeURIComponent(errorMessage) : '')}
                </p>
              )}
              
              {showInputs && (
                <>
                  {(isForgotPassword ? [{ fieldKey: 'email' as const, label: 'Email', placeholder: 'Digite seu email', type: 'email' as const }] : config.inputs).map((input, index) => {
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
                        {'forgotPasswordText' in config &&
                          index === config.inputs.length - 1 &&
                          !isForgotPassword && (
                            <button
                              type="button"
                              className={styles["forgot-password"]}
                              disabled={isLoading}
                              onClick={() => {
                                setIsForgotPassword(true);
                                setError(null);
                              }}
                            >
                              {config.forgotPasswordText}
                            </button>
                          )}
                      </div>
                    );
                  })}
                  
                  {!isForgotPassword && 'privacyText' in config && (
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
                </>
              )}
              
              {variant === 'signup' && !isForgotPassword ? (
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
                  variant={isForgotPassword ? 'primary' : config.buttonVariant}
                  type="submit"
                  className={styles['submit-button']}
                  disabled={isLoading}
                >
                  {currentSubmitLabel}
                </Button>
              )}
              
              {isForgotPassword && (
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError(null);
                    setValues(emptyValues);
                  }}
                  className={styles["back-button"]}
                  disabled={isLoading}
                >
                  Voltar ao login
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
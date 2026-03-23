'use client';

import Image from 'next/image';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import styles from './AuthModal.module.scss';

export type AuthModalVariant = 'signup' | 'login';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: AuthModalVariant;
}

const AUTH_CONFIG = {
  signup: {
    title: 'Preencha os campos abaixo para criar sua conta corrente!',
    imageSrc: '/Modal/signup.svg',
    imageAlt: 'Ilustração cadastro',
    submitLabel: 'Cadastrar',
    inputs: [
      { type: 'text', placeholder: 'Digite seu nome completo', ariaLabel: 'Digite seu nome completo' },
      { type: 'email', placeholder: 'Digite seu email', ariaLabel: 'Digite seu email' },
      { type: 'password', placeholder: 'Digite sua senha', ariaLabel: 'Digite sua senha' },
    ] as const,
  },
  login: {
    title: 'Login',
    imageSrc: '/Modal/login.svg',
    imageAlt: 'Ilustração login',
    submitLabel: 'Entrar',
    inputs: [
      { type: 'email', placeholder: 'Digite seu email', ariaLabel: 'Digite seu email' },
      { type: 'password', placeholder: 'Digite sua senha', ariaLabel: 'Digite sua senha' },
    ] as const,
  },
};

export const AuthModal = ({ isOpen, onClose, variant }: AuthModalProps) => {
  const config = AUTH_CONFIG[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={config.title}
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
          <h2 className={styles.title}>{config.title}</h2>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {config.inputs.map((input) => (
              <input
                key={input.ariaLabel}
                type={input.type}
                placeholder={input.placeholder}
                className={styles.input}
                aria-label={input.ariaLabel}
              />
            ))}
            <Button variant="primary" type="submit">
              {config.submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

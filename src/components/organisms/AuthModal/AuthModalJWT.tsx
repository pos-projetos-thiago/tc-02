'use client';

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal/Modal';
import { Button } from '@/components/atoms/Button/Button';
import { ProfileInput } from '@/components/atoms/ProfileInput/ProfileInput';
import { useAuth } from '@/hooks/useJWTAuth';
import styles from './AuthModal.module.scss';

interface AuthModalJWTProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'signup' | 'login';
}

export function AuthModalJWT({ isOpen, onClose, variant }: AuthModalJWTProps) {
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (variant === 'signup') {
        // Validation for signup
        if (!formData.username || !formData.email || !formData.password) {
          throw new Error('Todos os campos são obrigatórios');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        if (formData.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }

        await signup(formData.username, formData.email, formData.password);
      } else {
        // Validation for login
        if (!formData.email || !formData.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        await login(formData.email, formData.password);
      }

      // Success - modal will close via redirect
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
  };

  // Reset form when modal opens/closes or variant changes
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.authModal}>
        <h2 className={styles.title}>
          {variant === 'signup' ? 'Criar Conta' : 'Entrar'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {variant === 'signup' && (
            <ProfileInput
              label="Nome completo"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              placeholder="Seu nome"
              required
              disabled={isLoading}
            />
          )}
          
          <ProfileInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="seu@email.com"
            required
            disabled={isLoading}
          />
          
          <ProfileInput
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Sua senha"
            required
            disabled={isLoading}
          />
          
          {variant === 'signup' && (
            <ProfileInput
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirme sua senha"
              required
              disabled={isLoading}
            />
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading 
                ? (variant === 'signup' ? 'Criando...' : 'Entrando...') 
                : (variant === 'signup' ? 'Criar Conta' : 'Entrar')
              }
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
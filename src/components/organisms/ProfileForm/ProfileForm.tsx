'use client';

import { useState } from 'react';
import { ProfileInput } from '@/components/atoms/ProfileInput';
import styles from './ProfileForm.module.scss';

export interface ProfileFormProps {
  userName?: string;
  userEmail?: string;
  onSave?: (data: { name: string; email: string; password: string }) => void;
}

export const ProfileForm = ({
  userName = '',
  userEmail = '',
  onSave
}: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    password: ''
  });

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setFormData(prev => ({ ...prev, password: '' }));
  };

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <form className={styles['profile-form']} onSubmit={handleSave} noValidate>
      <div className={styles['form-fields']}>
        <ProfileInput
          label="Nome"
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="Digite seu nome"
          type="text"
          id="profile-name"
          name="profile_name"
        />

        <ProfileInput
          label="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Digite seu email"
          type="email"
          id="profile-email"
          name="profile_email"
        />

        <ProfileInput
          label="Senha"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="Digite sua nova senha"
          type="password"
          id="profile-password"
          name="profile_password"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`${styles['save-button']} ${!isFormValid ? styles.disabled : ''}`}
        aria-label="Salvar alterações do perfil"
      >
        Salvar alterações
      </button>
    </form>
  );
};
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/atoms/Button';
import styles from './reset-password.module.scss';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type !== 'recovery' || !accessToken) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <h1 className={styles.title}>Senha alterada com sucesso!</h1>
          <p className={styles.message}>
            Sua senha foi alterada com sucesso. Você será redirecionado para o dashboard em instantes.
          </p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/dashboard')}
            className={styles.button}
          >
            Ir para o dashboard
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>Nova senha</h1>
        <p className={styles.subtitle}>
          Digite sua nova senha abaixo
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <div className={styles.error} role="alert" aria-live="polite">
              {error}
            </div>
          )}
          
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Redefinição de senha</legend>
            
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                minLength={6}
                required
                aria-describedby="password-help"
              />
              <small id="password-help" className={styles.help}>
                Mínimo 6 caracteres
              </small>
            </div>
            
            <div className={styles.field}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirmar senha
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Digite sua nova senha novamente"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                minLength={6}
                required
                aria-describedby="confirm-help"
              />
              <small id="confirm-help" className={styles.help}>
                Deve ser igual à senha acima
              </small>
            </div>
          </fieldset>
          
          <Button 
            variant="primary" 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
            aria-describedby="submit-status"
          >
            {isLoading ? 'Alterando...' : 'Alterar senha'}
          </Button>
          
          <div id="submit-status" className={styles.srOnly} aria-live="polite">
            {isLoading ? 'Processando alteração de senha' : ''}
          </div>
        </form>
      </section>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { Loading, LoadingScreen } from '@/components/atoms/Loading';
import { Button } from '@/components/atoms/Button/Button';
import styles from './loading-examples.module.scss';

export default function LoadingExamplesPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);

  const variants = [
    { name: 'Spinner', value: 'spinner' as const },
    { name: 'Dots', value: 'dots' as const },
    { name: 'Pulse', value: 'pulse' as const },
    { name: 'Wave', value: 'wave' as const }
  ];

  const sizes = [
    { name: 'Pequeno', value: 'small' as const },
    { name: 'Médio', value: 'medium' as const },
    { name: 'Grande', value: 'large' as const }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Exemplos de Loading</h1>
      
      <section className={styles.section}>
        <h2>Variantes de Animação</h2>
        <div className={styles.grid}>
          {variants.map(variant => (
            <div key={variant.value} className={styles.card}>
              <h3>{variant.name}</h3>
              <Loading variant={variant.value} size="medium" />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Tamanhos</h2>
        <div className={styles.grid}>
          {sizes.map(size => (
            <div key={size.value} className={styles.card}>
              <h3>{size.name}</h3>
              <Loading variant="pulse" size={size.value} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Com Texto</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Loading 
              variant="spinner" 
              size="medium" 
              text="Carregando dados..." 
            />
          </div>
          <div className={styles.card}>
            <Loading 
              variant="pulse" 
              size="medium" 
              text="Processando..." 
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Tela Cheia</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowFullScreen(true)}
        >
          Mostrar Loading Full Screen
        </Button>
      </section>

      <LoadingScreen 
        isVisible={showFullScreen}
        variant="pulse"
        size="large"
        text="Carregando aplicação..."
      />

      {showFullScreen && (
        <div style={{ 
          position: 'fixed', 
          top: '2rem', 
          right: '2rem', 
          zIndex: 10000 
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowFullScreen(false)}
          >
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
}
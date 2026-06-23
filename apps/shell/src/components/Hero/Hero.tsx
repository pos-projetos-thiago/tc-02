import styles from './Hero.module.scss';
import Image from 'next/image';
import { Button } from '@/shared/components/atoms';

export interface HeroProps {
  onOpenSignUp?: () => void;
  onOpenLogin?: () => void;
}

export const Hero = ({ onOpenSignUp, onOpenLogin }: HeroProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.principal}>
          <h1>Experimente mais liberdade no controle da sua vida financeira. Crie sua conta com a gente!</h1>
          <div className={styles["image-wrapper"]}>
            <Image
              src="/Hero/grafico.svg"
              alt="Gráfico ilustrativo de crescimento financeiro"
              width={635}
              height={435}
              priority
              className={styles["hero-image"]}
            />
          </div>
          <div className={styles["mobile-actions"]}>
            <Button variant="primary-mobile" onClick={onOpenSignUp}>Abrir conta</Button>
            <Button variant="secondary-mobile" onClick={onOpenLogin}>Já tenho conta</Button>
          </div>
        </div>
        <div className={styles.advantages}>
          <h2>Vantagens do nosso banco:</h2>
          <div className={styles['advantages-list']}>
            <div className={styles['advantages-item']}>
              <Image src="/Hero/Advantages/conta.svg" alt="Conta gratuita" width={75} height={55} priority />
              <p>Conta e cartão gratuitos</p>
              <p>Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.</p>
            </div>
            <div className={styles['advantages-item']}>
              <Image src="/Hero/Advantages/saque.svg" alt="Saques sem custo" width={75} height={55} priority />
              <p>Saques sem custo</p>
              <p>Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.</p>
            </div>
            <div className={styles['advantages-item']}>
              <Image src="/Hero/Advantages/ponto.svg" alt="Programa de pontos" width={75} height={55} priority />
              <p>Programa de pontos</p>
              <p>Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!</p>
            </div>
            <div className={styles['advantages-item']}>
              <Image src="/Hero/Advantages/dispositivo.svg" alt="Seguro de dispositivos" width={75} height={55} priority />
              <p>Seguro Dispositivos</p>
              <p>Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
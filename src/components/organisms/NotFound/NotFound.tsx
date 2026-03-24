import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import styles from './NotFound.module.scss';

export const NotFound = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Ops! Não encontramos a página...</h1>
          <p className={styles.description}>
            E olha que exploramos o universo procurando por ela!
            Que tal voltar e tentar novamente?
          </p>
          <Button href="/" variant="accent">
            Voltar ao início
          </Button>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src="/NotFound/404.svg"
            alt="Imagem de página não encontrada"
            fill
            sizes="(max-width: 719px) 310px, 470px"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

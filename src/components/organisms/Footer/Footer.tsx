import styles from './Footer.module.scss';
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.services}>
          <p>Serviços</p>
          <p>Conta corrente</p>
          <p>Conta PJ</p>
          <p>Cartão de crédito</p>
        </div>
        <div className={styles.contact}>
          <p>Contato</p>
          <p>0800 004 250 08</p>
          <p>meajuda@bytebank.com.br</p>
          <p>ouvidoria@bytebank.com.br</p>
        </div>
        <div className={styles.info}>
          <p>Desenvolvido por Thiago</p>
          <Image src="/Footer/logo.svg" alt="Logo Bytebank" width={146} height={32} priority />
          <div className={styles.social}>
            <Image src="/Footer/Media/instagram.svg" alt="Logo Instagram" width={30} height={30} priority />
            <Image src="/Footer/Media/whatsapp.svg" alt="Logo WhatsApp" width={30} height={30} priority />
            <Image src="/Footer/Media/youtube.svg" alt="Logo Youtube" width={30} height={30} priority />
          </div>
        </div>
      </div>
    </footer>
  );
};

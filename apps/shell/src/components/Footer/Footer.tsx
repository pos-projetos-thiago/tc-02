import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2026 Bytebank. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
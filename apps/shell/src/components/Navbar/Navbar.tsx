import styles from './Navbar.module.scss';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1>Bytebank</h1>
        <div className={styles.actions}>
          {/* Auth buttons will be added here */}
        </div>
      </div>
    </nav>
  );
};
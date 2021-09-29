import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>GRAPHENE</h1>
      <span className={styles.header__subtitle}>Create and share beautiful code snippets!</span>
    </header>
  );
}

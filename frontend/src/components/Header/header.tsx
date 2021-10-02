import type { JSXElement } from 'solid-js';
import styles from './header.module.css';
import GithubIcon from '/#/icons/GithubIcon';

export default function Header(): JSXElement {
  return (
    <header class={styles.header}>
      <h1 class={styles.header__title}>GRAPHENE</h1>
      <span class={styles.header__subtitle}>Create and share beautiful code snippets!</span>
      <a class={styles.header__button} href="https://github.com/teknologi-umum/graphene">
        <GithubIcon /> See on Github
      </a>
    </header>
  );
}

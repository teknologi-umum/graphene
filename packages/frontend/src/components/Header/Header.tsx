import { GithubIcon } from '~/icons';
import './Header.scss';

export function Header() {
  return (
    <header class="Header">
      <h1 class="title">GRAPHENE</h1>
      <span class="subtitle">Create and share beautiful code snippets!</span>
      <a class="button" href="https://github.com/teknologi-umum/graphene">
        <GithubIcon /> See on Github
      </a>
    </header>
  );
}

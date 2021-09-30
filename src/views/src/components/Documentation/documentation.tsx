import { For } from 'solid-js';
import OptionItem from '../OptionItem/optionItem';
import styles from './documentation.module.css';

const optionItems = [
  {
    title: 'code',
    desc: 'The code snippet you want to prettify. Use <code>\n</code> for new lines',
    required: true,
    default: 'none',
  },
  {
    title: 'lang',
    desc: 'The language used for highlighting. See shikijs/language. If you leave this field empty, flourite will try its best to guess it.',
    required: false,
    default: '',
    validOptions: '<a href="https://github.com/shikijs/shiki/blob/main/docs/languages.md">See here</a>',
  },
];

export default function Documentation() {
  return (
    <div class={styles.docs}>
      <h1 class={styles.docs__title}>Documentation for Graphene API</h1>
      <For each={optionItems}>{({ title, desc }) => <OptionItem title={title} desc={desc} />}</For>
    </div>
  );
}

import type { JSXElement } from 'solid-js';
import { For } from 'solid-js';
import OptionItem from '../OptionItem/optionItem';
import styles from './documentation.module.css';

export default function Documentation(): JSXElement {
  return (
    <div class={styles.docs}>
      <h2 class={styles.docs__title}>Documentation for Graphene API</h2>
      <section class={styles.docs__items}>
        <For each={optionItems}>
          {({ title, desc, defaultValue, required, validValues }) => (
            <OptionItem
              title={title}
              desc={desc}
              defaultValue={defaultValue}
              required={required}
              validValues={validValues}
            />
          )}
        </For>
      </section>
      <section class={styles.docs__example}>
        <h2 class={styles['docs__example-title']}>Example Request</h2>
        <pre>
          <code>
            {`{
  "code": "import foo from './bar';",
  "theme": "dark-plus",
  "format": "jpeg",
  "lang": "javascript",
  "upscale": 3,
  "lang": "javascript",
  "font": "jetbrains mono",
  "lineNumber": false,
  "border": {
    "thickness": 20,
    "colour": "#efefef"
  }
}`}
          </code>
        </pre>
      </section>
    </div>
  );
}

const optionItems = [
  {
    title: 'code',
    desc: 'The code snippet you want to prettify. Use <code>\\n</code> for newline',
    required: true,
    defaultValue: 'None',
    validValues: 'String',
  },
  {
    title: 'lang',
    desc: 'The language used for highlighting. See shikijs/language. If you leave this field empty, flourite will try its best to guess it.',
    required: false,
    defaultValue: 'Empty String',
    validValues: '<a href="https://github.com/shikijs/shiki/blob/main/docs/languages.md">See here</a>',
  },
  {
    title: 'format',
    desc: "The output format. If you choose svg, you won't get border since the border is created by sharpjs instead of embedding it in the svg.",
    required: false,
    defaultValue: 'png',
    validValues: '<code>jpeg</code>, <code>png</code>, <code>webp</code>, and <code>svg</code>',
  },
  {
    title: 'upscale',
    desc: 'How much do you want to upscale the image. The higher, the better.',
    required: false,
    defaultValue: '1x',
    validValues: '1 - 5',
  },
  {
    title: 'theme',
    desc: 'Colorscheme used to highlight the code.',
    required: false,
    defaultValue: 'github-dark',
    validValues: '<a href="https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes">See here</a>',
  },
  {
    title: 'font',
    desc: 'Colorscheme used to highlight the code.',
    required: false,
    defaultValue: 'JetBrains Mono',
    validValues: '<code>SF Mono</code>, <code>JetBrains Mono</code>, and <code>Fira Code</code>,',
  },
  {
    title: 'lineNumber',
    desc: 'Toggle line number. Might be useful for longer code',
    required: false,
    defaultValue: 'false',
    validValues: '<code>true</code> or <code>false</code>',
  },
  {
    title: 'border.thickness',
    desc: 'The thickness of the border. Zero means no border.',
    required: false,
    defaultValue: '0',
    validValues: '1 - Infinity',
  },
  {
    title: 'border.colour',
    desc: 'The colour of the border in HEX format. Ex: #efefef, #1E2329',
    required: false,
    defaultValue: '#a0adb6',
    validValues: 'Any valid HEX colour',
  },
];

import type { JSXElement } from 'solid-js';
import { For } from 'solid-js';
import { VALID_FONT, VALID_FORMAT } from '#/libs/constant';
import OptionItem from '#/components/OptionItem/optionItem';
import styles from './documentation.module.css';

export default function Documentation(): JSXElement {
  return (
    <div class={styles.docs}>
      <h2 class={styles.docs__title} id="documentation">
        <a href="#documentation">Documentation for Graphene API</a>
      </h2>
      <section class={styles.docs__description}>
        <p>
          Simply send a HTTP POST request to&nbsp;
          <span>
            <code>https://teknologi-umum-graphene.fly.dev/api</code>
          </span>
          &nbsp; with a payload body as specified below.
        </p>
        <p>
          If no <code>Content-Type</code> header was given, the API by default would parse it as JSON. If you don't feel
          like doing JSON, we support URL encoded,
          <a href="https://yaml.org/">YAML</a>, <a href="https://toml.io/en/">TOML</a>, and{' '}
          <a href="https://gura.netlify.app/">Gura</a>. Valid <code>Content-Type</code> values are:
        </p>
        <ul>
          <li>
            JSON: <code>application/json</code>
          </li>
          <li>
            URL encoded: <code>application/x-www-form-urlencoded</code>
          </li>
          <li>
            YAML: <code>application/x-yaml</code> or <code>text/yaml</code>
          </li>
          <li>
            TOML: <code>application/toml</code> or <code>text/x-toml</code>
          </li>
          <li>
            Gura: <code>application/gura</code> or <code>text/gura</code>
          </li>
        </ul>
      </section>
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
        <h2 class={styles['docs__example-title']} id="example">
          <a href="#example">Example Request Body</a>
        </h2>
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

const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
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
    validValues: listFormatter.format(VALID_FORMAT.map((format) => `<code>${format}</code>`)),
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
    validValues: listFormatter.format(VALID_FONT.map((font) => `<code>${font}</code>`)),
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

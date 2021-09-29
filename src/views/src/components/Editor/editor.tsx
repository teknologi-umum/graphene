import Options from '/#/components/Options/options';
import { VALID_FORMAT, VALID_LANGUAGES, VALID_THEMES } from '/#/libs/constant';
import { createSignal } from 'solid-js';
import styles from './editor.module.css';

export default function Editor() {
  const languages = ['Auto Detect'].concat(VALID_LANGUAGES);
  const [selectedLang, setSelectedLang] = createSignal(languages[0]);

  const themes = VALID_THEMES.reduce((acc: string[], curr: string) => {
    const lang = curr.split('-').join(' ');
    return acc.concat(lang);
  }, []);
  const [selectedTheme, setSelectedTheme] = createSignal('Github Dark');

  const format = VALID_FORMAT;
  const [selectedFormat, setSelectedFormat] = createSignal('png');

  return (
    <section class={styles.main}>
      <div class={styles.main__editor}>
        <div class={styles.editor__options}>
          <Options items={languages} selected={selectedLang()} setSelected={setSelectedLang} icon="language" />
          <Options items={format} selected={selectedFormat()} setSelected={setSelectedFormat} icon="palette" />
          <Options items={themes} selected={selectedTheme()} setSelected={setSelectedTheme} icon="palette" />
        </div>
        <textarea class={styles.editor__input} rows="20" placeholder="Paste your code here..." />
      </div>
      <div class={styles.main__preview}>
        <h3 class={styles['preview__preview-title']}>Your image will appear here</h3>
      </div>
    </section>
  );
}

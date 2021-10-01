import { For, JSXElement } from 'solid-js';
import { createSignal } from 'solid-js';
import ColourPicker from '../ColourPicker/colourPicker';
import SettingsPopup from '../SettingsPopup/settingsPopup';
import styles from './editor.module.css';
import Options from '/#/components/Options/options';
import PlayIcon from '/#/icons/PlayIcon';
import { VALID_FONT, VALID_FORMAT, VALID_LANGUAGES, VALID_THEMES, VALID_UPSCALE } from '/#/libs/constant';

export default function Editor(): JSXElement {
  const [code, setCode] = createSignal('');
  const languages = ['Auto Detect'].concat(VALID_LANGUAGES);
  const [selectedLang, setSelectedLang] = createSignal(languages[0]);

  const themes = VALID_THEMES.reduce((acc: string[], curr: string) => {
    const lang = curr.split('-').join(' ');
    return acc.concat(lang);
  }, []);
  const [theme, setTheme] = createSignal('Github Dark');

  const [format, setFormat] = createSignal(VALID_FORMAT[0]);
  const [upscale, setUpscale] = createSignal(VALID_UPSCALE[1]);
  const [colour, setColour] = createSignal('#a0adb6');
  const [font, setFont] = createSignal(VALID_FONT[0]);
  const [lineNumber, setLineNumber] = createSignal('off');

  const submit = () => {
    const body = {
      code: code(),
      lang: selectedLang(),
      theme: theme(),
      format: format(),
      upscale: upscale(),
      border: {
        color: colour(),
        thickness: colour(),
      },
      lineNumber: lineNumber(),
    };

    console.log(body);
  };

  return (
    <section class={styles.main}>
      <div class={styles.main__options}>
        <Options items={themes} selected={theme()} setSelected={setTheme} icon="palette" width="15rem" />
        <Options
          items={languages}
          selected={selectedLang()}
          setSelected={setSelectedLang}
          icon="language"
          width="13rem"
        />
        <Options items={VALID_FONT} selected={font()} setSelected={setFont} icon="font" width="14rem" />
        <Options items={VALID_FORMAT} selected={format()} setSelected={setFormat} icon="format" width="8rem" />
        <ColourPicker selected={colour()} setSelected={setColour} width="2.5rem" height="2.5rem" />
        <SettingsPopup>
          <div class={styles.main__linenr}>
            <span class={styles['main__linenr-label']}>Line Number: </span>
            <input type="checkbox" />
          </div>
          <div class={styles.main__upscales}>
            <For each={VALID_UPSCALE}>{(upscale) => <span class={styles.upscales__item}>{upscale}</span>}</For>
          </div>
        </SettingsPopup>
      </div>
      <div class={styles.main__panes}>
        <div class={styles.main__editor}>
          <textarea
            class={styles.editor__input}
            placeholder="Paste your code here..."
            spellcheck={false}
            onChange={(e) => setCode(e.currentTarget.value)}
          >
            {code}
          </textarea>
          <button class={styles.main__button} onClick={submit}>
            <PlayIcon />
          </button>
        </div>
        <div class={styles.main__preview}>
          <div class={styles['main__preview-placeholder']}>
            <h3 class={styles['main__preview-title']}>Your image will appear here</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

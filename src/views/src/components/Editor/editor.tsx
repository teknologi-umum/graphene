import Options from '/#/components/Options/options';
import { VALID_FONT, VALID_FORMAT, VALID_LANGUAGES, VALID_THEMES, VALID_UPSCALE } from '/#/libs/constant';
import { createSignal, JSXElement } from 'solid-js';
import styles from './editor.module.css';
import ColourPicker from '../ColourPicker/colourPicker';

export default function Editor(): JSXElement {
  const languages = ['Auto Detect'].concat(VALID_LANGUAGES);
  const [selectedLang, setSelectedLang] = createSignal(languages[0]);

  const themes = VALID_THEMES.reduce((acc: string[], curr: string) => {
    const lang = curr.split('-').join(' ');
    return acc.concat(lang);
  }, []);
  const [selectedTheme, setSelectedTheme] = createSignal('Github Dark');

  const [selectedFormat, setSelectedFormat] = createSignal(VALID_FORMAT[0]);
  const [selectedUpscale, setSelectedUpscale] = createSignal(VALID_UPSCALE[1]);
  const [colour, setColour] = createSignal('#a0adb6');
  const [selectedFontFamily, setSelectedFontFamily] = createSignal(VALID_FONT[0]);
  const [lineNumber, setLineNumber] = createSignal('off');

  return (
    <section class={styles.main}>
      <div class={styles.main__options}>
        <Options
          items={themes}
          selected={selectedTheme()}
          setSelected={setSelectedTheme}
          icon="palette"
          width="15rem"
        />
        <Options
          items={languages}
          selected={selectedLang()}
          setSelected={setSelectedLang}
          icon="language"
          width="13rem"
        />
        <Options
          items={VALID_FONT}
          selected={selectedFontFamily()}
          setSelected={setSelectedFontFamily}
          icon="font"
          width="14rem"
        />
        <Options
          items={VALID_FORMAT}
          selected={selectedFormat()}
          setSelected={setSelectedFormat}
          icon="format"
          width="8rem"
        />
        <Options
          items={VALID_UPSCALE}
          selected={selectedUpscale()}
          setSelected={setSelectedUpscale}
          icon="upscale"
          width="6rem"
        />
        <Options items={['on', 'off']} selected={lineNumber()} setSelected={setLineNumber} icon="linenr" width="8rem" />
        <ColourPicker selected={colour()} setSelected={setColour} width="2.5rem" height="2.5rem" />
      </div>
      <div class={styles.main__editor}>
        <textarea class={styles.editor__input} placeholder="Paste your code here..." />
      </div>
      <div class={styles.main__preview}>
        <div class={styles['main__preview-placeholder']}>
          <h3 class={styles['main__preview-title']}>Your image will appear here</h3>
        </div>
      </div>
    </section>
  );
}

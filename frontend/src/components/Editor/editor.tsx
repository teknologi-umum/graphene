import { For, Match, Show, Switch } from 'solid-js';
import type { JSXElement } from 'solid-js';
import { createSignal } from 'solid-js';
import ColourPicker from '../ColourPicker/colourPicker';
import SettingsPopup from '../SettingsPopup/settingsPopup';
import styles from './editor.module.css';
import Options from '/#/components/Options/options';
import PlayIcon from '/#/icons/PlayIcon';
import { BASE_URL, VALID_FONT, VALID_FORMAT, VALID_LANGUAGES, VALID_THEMES, VALID_UPSCALE } from '/#/libs/constant';
import { useWinSize } from '/#/libs/hooks';

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!blob) return reject('No blob provided!');
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      return resolve(reader.result as string);
    });
    if (blob) {
      reader.readAsDataURL(blob);
    }
  });
}

export default function Editor(): JSXElement {
  const winWidth = useWinSize();

  const [image, setImage] = createSignal('');
  const [code, setCode] = createSignal('');

  const languages = ['Auto Detect'].concat(VALID_LANGUAGES);
  const [selectedLang, setSelectedLang] = createSignal(languages[0]);

  const themes = VALID_THEMES.reduce((acc: string[], curr: string) => {
    const lang = curr.replace(/-/g, ' ');
    return acc.concat(lang);
  }, []);
  const [theme, setTheme] = createSignal('Github Dark');

  const [format, setFormat] = createSignal(VALID_FORMAT[0]);
  const [upscale, setUpscale] = createSignal(VALID_UPSCALE[1]);
  const [colour, setColour] = createSignal('#a0adb6');
  const [font, setFont] = createSignal(VALID_FONT[0]);
  const [lineNumber, setLineNumber] = createSignal(false);
  const [borderThickness, setBorderThickness] = createSignal(0);

  const submit = async () => {
    const body = {
      code: code(),
      lang: selectedLang().toLowerCase() === 'auto detect' ? '' : selectedLang(),
      theme: theme().toLowerCase().replace(/\s/g, '-'),
      format: format(),
      upscale: upscale(),
      border: {
        colour: colour(),
        thickness: borderThickness(),
      },
      lineNumber: lineNumber(),
    };

    const imageResponse = await fetch(BASE_URL + '/api', {
      method: 'POST',
      headers: {
        Accept: `image/${format}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const imageBlob = await imageResponse.blob();
    setImage(await blobToBase64(imageBlob));
  };

  return (
    <section class={styles.main}>
      <div class={styles.main__options}>
        {/* :start this copypasta is bad */}
        <Show when={winWidth() > 600}>
          <Options items={themes} selected={theme()} setSelected={setTheme} icon="palette" width="15rem" />
        </Show>
        <Show when={winWidth() > 800}>
          <Options
            items={languages}
            selected={selectedLang()}
            setSelected={setSelectedLang}
            icon="language"
            width="13rem"
          />
        </Show>
        <Show when={winWidth() > 1000}>
          <Options items={VALID_FONT} selected={font()} setSelected={setFont} icon="font" width="14rem" />
        </Show>
        <Show when={winWidth() > 1100}>
          <Options items={VALID_FORMAT} selected={format()} setSelected={setFormat} icon="format" width="8rem" />
        </Show>
        {/* :end this copypasta is bad */}
        <ColourPicker selected={colour()} setSelected={setColour} width="2.5rem" height="2.5rem" />

        <SettingsPopup>
          {/* :start this copypasta is bad */}
          <Show when={winWidth() < 600}>
            <Options items={themes} selected={theme()} setSelected={setTheme} icon="palette" width="15rem" />
          </Show>
          <Show when={winWidth() < 800}>
            <Options
              items={languages}
              selected={selectedLang()}
              setSelected={setSelectedLang}
              icon="language"
              width="13rem"
            />
          </Show>
          <Show when={winWidth() < 1000}>
            <Options items={VALID_FONT} selected={font()} setSelected={setFont} icon="font" width="14rem" />
          </Show>
          <Show when={winWidth() < 1100}>
            <Options items={VALID_FORMAT} selected={format()} setSelected={setFormat} icon="format" width="8rem" />
          </Show>
          {/* :end this copypasta is bad */}

          <div class={styles.main__linenr}>
            <span class={styles['main__linenr-label']}>Line Number: </span>
            <input
              class={styles['main__linenr-checkbox']}
              type="checkbox"
              checked={lineNumber()}
              onChange={() => setLineNumber((prev: boolean) => !prev)}
            />
          </div>
          <div class={styles.main__upscale}>
            <span class={styles['main__upscale-label']}>Upscale:</span>
            <For each={VALID_UPSCALE}>
              {(scale) => (
                <span
                  class={styles.upscale__item}
                  onClick={() => setUpscale(scale)}
                  style={{ color: scale === upscale() ? '#2d3748' : '#718096' }}
                >
                  {scale}x
                </span>
              )}
            </For>
          </div>
          <div class={styles.main__border}>
            <span class={styles['main__border-label']}>Border Thickness:</span>
            <input
              class={styles['main__border-input']}
              type="number"
              min="0"
              value={borderThickness()}
              onChange={(e) => setBorderThickness(e.currentTarget.valueAsNumber)}
            />
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
          <Switch>
            <Match when={image()}>
              <img class={styles['main__preview-img']} src={image()} />
            </Match>
            <Match when={!image()}>
              <div class={styles['main__preview-placeholder']}>
                <h3 class={styles['main__preview-title']}>Your image will appear here</h3>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </section>
  );
}

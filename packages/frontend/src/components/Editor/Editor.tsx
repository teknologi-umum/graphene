import { For, Match, Show, Switch } from 'solid-js';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  LANGUAGES,
  THEMES,
  FONTS,
  IMAGE_FORMATS,
  UPSCALE,
  type Theme,
  type ImageFormat,
  type Language,
  type Upscale,
  type Font,
  DEFAULT_BORDER_COLOR,
} from 'shared';
import { ColourPicker } from '~/components/ColourPicker';
import { SettingsPopup } from '~/components/SettingsPopup';
import { PlayIcon } from '~/icons';
import './Editor.scss';
import { OptionsMenu } from './OptionsMenu';
import { useGenerateImage } from './hooks/useGenerateImage';

type MenuState = {
  language: Language;
  theme: Theme;
  format: ImageFormat;
  upscale: Upscale;
  font: Font;
  showLineNumber: boolean;
  border: {
    colour: string;
    thickness: number;
    radius: number;
  };
};

export function Editor() {
  const { isFetching, errorMessage, hasError, generateImageAsync, image } = useGenerateImage();

  // editor-related state
  const [code, setCode] = createSignal('');

  // menu-related state
  const [selectedOptions, setSelectedOptions] = createStore<MenuState>({
    border: {
      radius: 0,
      thickness: 0,
      colour: DEFAULT_BORDER_COLOR,
    },
    font: FONTS[0],
    format: IMAGE_FORMATS[0],
    language: 'auto-detect',
    showLineNumber: false,
    theme: 'github-dark-dimmed',
    upscale: UPSCALE[1],
  });

  return (
    <section class="Editor" style={{ cursor: isFetching() ? 'wait' : 'auto' }}>
      <Show when={isFetching()}>
        <div class="overlay" />
      </Show>
      <div class="options">
        <OptionsMenu
          theme={{
            items: THEMES,
            selected: selectedOptions.theme,
            onSelect: (theme) => setSelectedOptions({ theme }),
          }}
          language={{
            items: LANGUAGES,
            selected: selectedOptions.language,
            onSelect: (language) => setSelectedOptions({ language }),
          }}
          font={{
            items: FONTS,
            selected: selectedOptions.font,
            onSelect: (font) => setSelectedOptions({ font }),
          }}
          format={{
            items: [...IMAGE_FORMATS],
            selected: selectedOptions.format,
            onSelect: (format) => setSelectedOptions({ format }),
          }}
        />
        <ColourPicker
          selected={selectedOptions.border.colour}
          setSelected={(colour) => setSelectedOptions('border', 'colour', colour)}
          width="2.5rem"
          height="2.5rem"
        />

        <SettingsPopup>
          <OptionsMenu
            popup
            theme={{
              items: THEMES,
              selected: selectedOptions.theme,
              onSelect: (theme) => setSelectedOptions({ theme }),
            }}
            language={{
              items: LANGUAGES,
              selected: selectedOptions.language,
              onSelect: (language) => setSelectedOptions({ language }),
            }}
            font={{
              items: FONTS,
              selected: selectedOptions.font,
              onSelect: (font) => setSelectedOptions({ font }),
            }}
            format={{
              items: [...IMAGE_FORMATS],
              selected: selectedOptions.format,
              onSelect: (format) => setSelectedOptions({ format }),
            }}
          />

          <div class="line-number">
            <span class="line-number-label">Line Number: </span>
            <input
              class="line-number-checkbox"
              type="checkbox"
              checked={selectedOptions.showLineNumber}
              onChange={() => setSelectedOptions({ showLineNumber: !selectedOptions.showLineNumber })}
            />
          </div>
          <div class="upscale">
            <span class="upscale-label">Upscale:</span>
            <For each={UPSCALE}>
              {(upscale) => (
                <span
                  class="upscale-item"
                  onClick={() => setSelectedOptions({ upscale })}
                  style={{ opacity: upscale === selectedOptions.upscale ? 1 : 0.5 }}
                >
                  {upscale}x
                </span>
              )}
            </For>
          </div>
          <div class="border">
            <span class="border-label">Border Thickness:</span>
            <input
              class="border-input"
              type="number"
              min="0"
              value={selectedOptions.border.thickness}
              onChange={(e) => setSelectedOptions('border', 'thickness', e.currentTarget.valueAsNumber)}
            />
          </div>
          <div class="border">
            <span class="border-label">Border Radius:</span>
            <input
              class="border-input"
              type="number"
              min="0"
              value={selectedOptions.border.radius}
              onChange={(e) => setSelectedOptions('border', 'radius', e.currentTarget.valueAsNumber)}
            />
          </div>
        </SettingsPopup>
      </div>
      <div class="panes">
        <div class="editor">
          <textarea
            class="editor-input"
            placeholder="Paste your code here..."
            spellcheck={false}
            onChange={(e) => setCode(e.currentTarget.value)}
          >
            {code()}
          </textarea>
          <button
            class="button"
            onClick={() =>
              generateImageAsync({
                ...selectedOptions,
                code: code(),
                lang: selectedOptions.language,
                lineNumber: selectedOptions.showLineNumber,
              })
            }
            style={{ filter: isFetching() ? 'saturate(0)' : 'none' }}
          >
            <PlayIcon />
          </button>
        </div>
        <div class="preview">
          <Switch>
            <Match when={!hasError && image()}>
              <img class="preview-img" src={image()} />
            </Match>
            <Match when={!hasError && !image()}>
              <div class="preview-placeholder">
                <h3 class="preview-title">Your image will appear here</h3>
              </div>
            </Match>
            <Match when={hasError}>
              <div class="error-placeholder">
                <h3 class="error-title">{errorMessage()}</h3>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </section>
  );
}

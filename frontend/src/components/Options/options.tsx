import type { JSXElement, Setter } from 'solid-js';
import { createSignal, For, Match, Switch } from 'solid-js';
import styles from './options.module.css';
import ArrowIcon from '#/icons/ArrowIcon';
import FontIcon from '#/icons/FontIcon';
import FormatIcon from '#/icons/FormatIcon';
import LanguageIcon from '#/icons/LanguageIcon';
import LineNumberIcon from '#/icons/LineNumberIcon';
import PaletteIcon from '#/icons/PaletteIcon';
import UpscaleIcon from '#/icons/UpscaleIcon';

interface OptionsProps {
  items: string[];
  icon: 'language' | 'palette' | 'format' | 'font' | 'upscale' | 'linenr';
  selected: string;
  setSelected: Setter<string>;
  width: string;
}

export default function Options(props: OptionsProps): JSXElement {
  const [isCandidateVisible, setCandidateVisible] = createSignal(false);
  const [filteredItems, setFilteredItems] = createSignal(props.items);

  // eslint-disable-next-line
  let inputRef: HTMLInputElement | undefined = undefined;

  function filterCandidate(e: InputEvent) {
    const query = (e.currentTarget as HTMLInputElement)?.value;
    setFilteredItems(props.items.filter((item) => item.toLowerCase().includes(query.toLowerCase())));
  }

  return (
    <div class={styles.options} style={{ 'max-width': props.width }}>
      <div class={styles.options__icon}>
        <Switch>
          <Match when={props.icon === 'language'}>
            <LanguageIcon />
          </Match>
          <Match when={props.icon === 'palette'}>
            <PaletteIcon />
          </Match>
          <Match when={props.icon === 'format'}>
            <FormatIcon />
          </Match>
          <Match when={props.icon === 'font'}>
            <FontIcon />
          </Match>
          <Match when={props.icon === 'upscale'}>
            <UpscaleIcon />
          </Match>
          <Match when={props.icon === 'linenr'}>
            <LineNumberIcon />
          </Match>
        </Switch>
      </div>
      <div class={styles['options__input-wrapper']}>
        <input
          class={styles.options__input}
          type="text"
          ref={inputRef}
          onInput={filterCandidate}
          onFocus={(e) => {
            e.currentTarget.value = '';
            setCandidateVisible(true);
          }}
          onBlur={(e) => {
            e.currentTarget.value = props.selected;
            setCandidateVisible(false);
            setFilteredItems(props.items);
          }}
          placeholder={props.selected}
          value={props.selected}
        />
        <ArrowIcon class="arrow" />
        {isCandidateVisible() && (
          <ul class={styles.options__candidates}>
            <For each={filteredItems()}>
              {(item) => (
                <li
                  class={styles.candidate}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    props.setSelected(item);
                    inputRef?.blur();
                  }}
                >
                  {item}
                </li>
              )}
            </For>
          </ul>
        )}
      </div>
    </div>
  );
}

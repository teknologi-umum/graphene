import { createSignal, For, Match, Switch } from 'solid-js';
import LanguageIcon from '/#/icons/LanguageIcon';
import ArrowIcon from '/#/icons/ArrowIcon';
import styles from './options.module.css';
import PaletteIcon from '/#/icons/PaletteIcon';

interface OptionsProps {
  items: string[];
  icon: 'language' | 'palette';
  selected: string;
  setSelected: <U extends string>(v: (U extends Function ? never : U) | ((prev: U) => U)) => U;
}

export default function Options(props: OptionsProps) {
  const [isCandidateVisible, setCandidateVisible] = createSignal(false);
  const [filteredItems, setFilteredItems] = createSignal(props.items);
  let inputRef: HTMLInputElement;

  function filterCandidate(e: InputEvent) {
    const query = (e.currentTarget as HTMLInputElement)?.value;
    setFilteredItems(props.items.filter((item) => item.toLowerCase().includes(query.toLowerCase())));
  }

  return (
    <div class={styles.options}>
      <div class={styles.options__icon}>
        <Switch>
          <Match when={props.icon === 'language'}>
            <LanguageIcon />
          </Match>
          <Match when={props.icon === 'palette'}>
            <PaletteIcon />
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
        <ArrowIcon className="arrow" />
        {isCandidateVisible() && (
          <ul class={styles.options__candidates}>
            <For each={filteredItems()}>
              {(item) => (
                <li
                  class={styles.candidate}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    props.setSelected(item);
                    inputRef.blur();
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

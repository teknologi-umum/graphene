import { createSignal, For, Match, Switch } from 'solid-js';
import { ArrowIcon, FontIcon, FormatIcon, LanguageIcon, ThemeIcon, UpscaleIcon } from '~/icons';
import { normaliseKebabCase } from '~/utils/strip-dash';
import './Options.scss';

export type OptionsProps<TValue extends string> = {
  items: TValue[];
  type: 'language' | 'theme' | 'format' | 'font' | 'upscale';
  selected: TValue;
  onSelect: (value: TValue) => void;
  width: string;
};

export function Options<TValue extends string>(props: OptionsProps<TValue>) {
  const [isCandidateVisible, setCandidateVisible] = createSignal(false);
  // It's okay to lose reactivity here since we only use it as the initial value for the filter
  // eslint-disable-next-line solid/reactivity
  const [filteredItems, setFilteredItems] = createSignal(props.items);

  let inputRef: HTMLInputElement | undefined;

  function filterCandidate(e: InputEvent) {
    const query = (e.currentTarget as HTMLInputElement).value;
    setFilteredItems(
      props.items.filter((item) => normaliseKebabCase(item).toLowerCase().includes(query.toLowerCase())),
    );
  }

  return (
    <div class="Options" style={{ 'max-width': props.width }}>
      <div class="icon">
        <Switch>
          <Match when={props.type === 'language'}>
            <LanguageIcon />
          </Match>
          <Match when={props.type === 'theme'}>
            <ThemeIcon />
          </Match>
          <Match when={props.type === 'format'}>
            <FormatIcon />
          </Match>
          <Match when={props.type === 'font'}>
            <FontIcon />
          </Match>
          <Match when={props.type === 'upscale'}>
            <UpscaleIcon />
          </Match>
        </Switch>
      </div>
      <div class="input-wrapper">
        <input
          class={`input ${props.type === 'format' ? 'uppercased' : 'capitalised'}`}
          type="text"
          ref={inputRef}
          onInput={filterCandidate}
          onFocus={(e) => {
            e.currentTarget.value = '';
            setCandidateVisible(true);
          }}
          onBlur={(e) => {
            e.currentTarget.value = normaliseKebabCase(props.selected);
            setCandidateVisible(false);
            setFilteredItems(props.items);
          }}
          placeholder={normaliseKebabCase(props.selected)}
          value={normaliseKebabCase(props.selected)}
        />
        <ArrowIcon class="arrow" />
        {isCandidateVisible() && (
          <ul class={`candidates ${props.type === 'format' ? 'uppercased' : 'capitalised'}`}>
            <For each={filteredItems()}>
              {(item) => (
                <li
                  class="candidates-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    props.onSelect(item);
                    inputRef?.blur();
                  }}
                >
                  {normaliseKebabCase(item)}
                </li>
              )}
            </For>
          </ul>
        )}
      </div>
    </div>
  );
}

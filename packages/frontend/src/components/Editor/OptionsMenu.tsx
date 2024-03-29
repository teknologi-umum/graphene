import type { Font, ImageFormat, Language, Theme } from 'shared';
import { Show } from 'solid-js';
import { Options, type OptionsProps } from '../Options';
import { useWindowSize } from './hooks/useWindowSize';

type OptionsMenuItem<TValue extends string> = Pick<OptionsProps<TValue>, 'items' | 'selected' | 'onSelect'>;
type OptionsMenuProps = {
  theme: OptionsMenuItem<Theme>;
  language: OptionsMenuItem<Language>;
  font: OptionsMenuItem<Font>;
  format: OptionsMenuItem<ImageFormat>;
  uppercase?: boolean;
  popup?: boolean;
};

export function OptionsMenu(props: OptionsMenuProps) {
  const winWidth = useWindowSize();
  const WIDTH = {
    theme: 600,
    language: 800,
    font: 1000,
    format: 1100,
  };

  return (
    <>
      <Show when={props.popup ? winWidth() <= WIDTH.theme : winWidth() > WIDTH.theme}>
        <Options
          items={props.theme.items}
          selected={props.theme.selected}
          onSelect={(theme) => props.theme.onSelect(theme)}
          type="theme"
          width="15rem"
        />
      </Show>
      <Show when={props.popup ? winWidth() <= WIDTH.language : winWidth() > WIDTH.language}>
        <Options
          items={props.language.items}
          selected={props.language.selected}
          onSelect={(theme) => props.language.onSelect(theme)}
          type="language"
          width="13rem"
        />
      </Show>
      <Show when={props.popup ? winWidth() <= WIDTH.font : winWidth() > WIDTH.font}>
        <Options
          items={props.font.items}
          selected={props.font.selected}
          onSelect={(font) => props.font.onSelect(font)}
          type="font"
          width="14rem"
        />
      </Show>
      <Show when={props.popup ? winWidth() <= WIDTH.format : winWidth() > WIDTH.format}>
        <Options
          items={props.format.items}
          selected={props.format.selected}
          onSelect={(format) => props.format.onSelect(format)}
          type="format"
          width="8rem"
        />
      </Show>
    </>
  );
}

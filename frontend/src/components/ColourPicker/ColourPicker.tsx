import type { JSXElement } from 'solid-js';
import styles from './ColourPicker.module.scss';

type ColorPickerProps = {
  selected: string;
  setSelected: (value: string) => void;
  width: string;
  height: string;
};

export function ColourPicker(props: ColorPickerProps): JSXElement {
  return (
    <input
      class={styles.picker}
      type="color"
      style={{ width: props.width, height: props.height }}
      value={props.selected}
      onInput={(e) => props.setSelected(e.currentTarget.value)}
    />
  );
}

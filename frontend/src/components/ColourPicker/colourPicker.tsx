import type { JSXElement, Setter } from 'solid-js';
import styles from './colourPicker.module.css';

interface ColorPickerProps {
  selected: string;
  setSelected: Setter<string>;
  width: string;
  height: string;
}

export default function ColourPicker(props: ColorPickerProps): JSXElement {
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

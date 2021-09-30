import { JSXElement } from 'solid-js';
import styles from './colourPicker.module.css';

interface ColorPickerProps {
  selected: string;
  setSelected: <T>(state: T) => void;
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
    />
  );
}

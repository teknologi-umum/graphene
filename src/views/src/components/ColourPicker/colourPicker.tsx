import styles from './colourPicker.module.css';

interface ColorPickerProps {
  selected: string;
  setSelected: Function;
  width: string;
  height: string;
}

export default function ColourPicker(props: ColorPickerProps) {
  return <input class={styles.picker} type="color" style={{ width: props.width, height: props.height }} />;
}

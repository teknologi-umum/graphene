import './ColourPicker.scss';

type ColorPickerProps = {
  selected: string;
  setSelected: (value: string) => void;
  width: string;
  height: string;
};

export function ColourPicker(props: ColorPickerProps) {
  return (
    <input
      class="ColourPicker"
      type="color"
      style={{ width: props.width, height: props.height }}
      value={props.selected}
      onInput={(e) => props.setSelected(e.currentTarget.value)}
    />
  );
}

import { JSXElement } from 'solid-js';
import styles from './optionItem.module.css';

interface OptionItemProps {
  title: string;
  desc: string;
  required: boolean;
  defaultValue: string;
  validValues: string;
}

export default function OptionItem(props: OptionItemProps): JSXElement {
  return (
    <div class={styles.item}>
      <span class={styles.item__title}>{props.title}</span>
      <p class={styles.item__desc} innerHTML={props.desc}></p>
      <span class={styles.item__detail}>
        <b>Required</b>: {props.required ? 'Yes' : 'No'}
      </span>
      <span class={styles.item__detail}>
        <b>Default Value</b>: {props.defaultValue}
      </span>
      <span class={styles.item__detail}>
        <b>Valid Values</b>: <span innerHTML={props.validValues}></span>
      </span>
    </div>
  );
}

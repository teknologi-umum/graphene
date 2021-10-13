import type { JSXElement } from 'solid-js';
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
      <span class={styles.item__title} id={props.title}>
        <a href={'#' + props.title}>{props.title}</a>
      </span>
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <p class={styles.item__desc} innerHTML={props.desc}></p>
      <span class={styles.item__detail}>
        <b>Required</b>: {props.required ? 'Yes' : 'No'}
      </span>
      <span class={styles.item__detail}>
        <b>Default Value</b>: {props.defaultValue}
      </span>
      <span class={styles.item__detail}>
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <b>Valid Values</b>: <span innerHTML={props.validValues}></span>
      </span>
    </div>
  );
}

import type { JSXElement } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import styles from './settingsPopup.module.css';
import GearIcon from '#/icons/GearIcon';

export default function SettingsPopup(props: { children: JSXElement[] }): JSXElement {
  const [isPopupVisible, setPopupVisible] = createSignal(false);

  return (
    <div class={styles.settings}>
      <button class={styles.settings__button} onClick={() => setPopupVisible((prev) => !prev)}>
        <GearIcon />
      </button>
      <Show when={isPopupVisible()}>
        <div class={styles.settings__popup} id="popup">
          {props.children}
        </div>
      </Show>
    </div>
  );
}

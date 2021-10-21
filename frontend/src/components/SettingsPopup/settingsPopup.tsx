import type { JSXElement } from 'solid-js';
import { createSignal, Show, onMount } from 'solid-js';
import styles from './settingsPopup.module.css';
import GearIcon from '#/icons/GearIcon';

type HTMLElementRef = HTMLElement | undefined;

export default function SettingsPopup(props: { children: JSXElement[] }): JSXElement {
  const [isPopupVisible, setPopupVisible] = createSignal(false);

  /* eslint-disable */
  let popupRef: HTMLElementRef = undefined;
  let buttonRef: HTMLElementRef = undefined;
  /* eslint-enable */

  onMount(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      !popupRef?.contains(target) && !buttonRef?.contains(target) && setPopupVisible(false);
    };

    document.body.addEventListener('click', onClick);

    return () => document.body.removeEventListener('click', onClick);
  });

  return (
    <div class={styles.settings}>
      <button class={styles.settings__button} onClick={() => setPopupVisible((prev) => !prev)} ref={buttonRef}>
        <GearIcon />
      </button>
      <Show when={isPopupVisible()}>
        <div class={styles.settings__popup} id="popup" ref={popupRef}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}

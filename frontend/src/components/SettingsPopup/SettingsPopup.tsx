import type { JSXElement } from 'solid-js';
import { createSignal, Show, onMount } from 'solid-js';
import GearIcon from '~/icons/GearIcon';
import './SettingsPopup.scss';

export function SettingsPopup(props: { children: JSXElement[] }): JSXElement {
  const [isPopupVisible, setPopupVisible] = createSignal(false);

  let popupRef: HTMLDivElement | undefined;
  let buttonRef: HTMLButtonElement | undefined;

  // hide popup when clicked outside
  onMount(() => {
    const onClick = (e: MouseEvent) => {
      if (popupRef === undefined || buttonRef === undefined) return;
      
      const target = e.target as Node;
      if (!popupRef.contains(target) && !buttonRef.contains(target)) {
        setPopupVisible(false);
      }
    };

    document.body.addEventListener('click', onClick);
    return () => document.body.removeEventListener('click', onClick);
  });

  return (
    <div class="SettingsPopup">
      <button class="settings_button" onClick={() => setPopupVisible((prev) => !prev)} ref={buttonRef}>
        <GearIcon />
      </button>
      <Show when={isPopupVisible()}>
        <div class="popup" id="popup" ref={popupRef}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}

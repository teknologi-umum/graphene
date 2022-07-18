import { Accessor, createSignal, onMount } from 'solid-js';

export const useWindowSize = (): Accessor<number> => {
  const [width, setWidth] = createSignal(window.innerWidth);

  onMount(() => {
    const listener = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  });

  return width;
};

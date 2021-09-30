import { JSXElement } from "solid-js";

export default function ArrowIcon(props: { className: string }): JSXElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="1rem"
      height="1rem"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      class={props.className}
    >
      <g fill="none">
        <path d="M4 9l8 8l8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  );
}

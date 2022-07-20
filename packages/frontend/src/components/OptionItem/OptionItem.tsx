import './OptionItem.scss';

interface OptionItemProps {
  title: string;
  desc: string;
  required: boolean;
  defaultValue: string;
  validValues: string;
}

export function OptionItem(props: OptionItemProps) {
  return (
    <div class="OptionItem">
      <span class="title" id={props.title}>
        <a href={'#' + props.title}>{props.title}</a>
      </span>
      <p class="desc" innerHTML={/* eslint-disable-line -- it's static, it should be safe */ props.desc} />
      <span class="detail">
        <b>Required</b>: {props.required ? 'Yes' : 'No'}
      </span>
      <span class="detail">
        <b>Default Value</b>: {props.defaultValue}
      </span>
      <span class="detail">
        <b>Valid Values</b>:{' '}
        <span innerHTML={/* eslint-disable-line -- it's static, it should be safe */ props.validValues} />
      </span>
    </div>
  );
}

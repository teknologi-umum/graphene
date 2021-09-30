import styles from './optionItem.module.css';

interface OptionItemProps {
  title: string;
  desc: string;
}

export default function OptionItem(props: OptionItemProps) {
  return (
    <div class={styles.item}>
      <span class={styles.item__title}>{props.title}</span>
      <p class={styles.item__desc}>{props.desc}</p>
    </div>
  );
}

import { BlitzCard } from "../model/cards";
import styles from "./Card.module.css";

type Props = {
  card: BlitzCard;
};

export default function Card({ card }: Props) {
  return (
    <div
      className={styles.card}
      style={{
        borderColor: card.color,
      }}
    >
      {card.number}
    </div>
  );
}

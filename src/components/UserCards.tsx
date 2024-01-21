import { type BlitzCard } from "../model/cards";
import styles from "./UserCards.module.css";
import Card from "./Card";

type Props = {
  deck: BlitzCard[];
  pile: BlitzCard[];
};

export default function UserCards({ deck, pile }: Props) {
  const [one, two, three, ...rest] = pile;

  return (
    <div className={styles.container}>
      <div className={styles.restContainer}>
        {rest.map((card, i) => (
          <div
            style={{
              position: "absolute",
              top: `${-i * 1}px`,
            }}
          >
            <Card card={card} />
          </div>
        ))}
      </div>
      <Card card={one} />
      <Card card={two} />
      <Card card={three} />
    </div>
  );
}

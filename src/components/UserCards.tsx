import { type BlitzCard } from "../model/cards";
import styles from "./UserCards.module.css";
import Card from "./Card";
import DraggableCard from "./DraggableCard";

type Props = {
  deck: BlitzCard[];
  pile: BlitzCard[];
};

export default function UserCards({ deck, pile }: Props) {
  const [one, two, three, ...rest] = pile;

  return (
    <div className="flex gap-4 mt-8">
      <div className="w-[71px] relative">
        {rest.map((card, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${-i * 1}px`,
            }}
          >
            {i === rest.length - 1 ? (
              <DraggableCard card={card} />
            ) : (
              <Card card={card} />
            )}
          </div>
        ))}
      </div>
      <DraggableCard card={one} />
      <DraggableCard card={two} />
      <DraggableCard card={three} />
    </div>
  );
}

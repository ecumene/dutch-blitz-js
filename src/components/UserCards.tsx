import { useEffect, useState } from "react";
import { type BlitzCard } from "../model/cards";
import Card from "./Card";
import DraggableCard from "./DraggableCard";

type Props = {
  deck: BlitzCard[];
  pile: BlitzCard[];
};

const Deck = ({ deck }: { deck: BlitzCard[] }) => {
  const [drawnCards, setDrawnCards] = useState<BlitzCard[]>(
    deck.slice(deck.length - 3, deck.length)
  );

  const handleDraw = () => {
    if (drawnCards.length === deck.length) {
      setDrawnCards([]);
    } else {
      setDrawnCards((prev) => [
        ...prev,
        ...deck.slice(deck.length - 3, deck.length),
      ]);
    }
  };

  return (
    <>
      <button onClick={handleDraw}>DRAW!</button>
      <div className="w-[71px] relative">
        {drawnCards.map((card, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${-i * 1}px`,
            }}
          >
            {i === deck.length - 1 ? (
              <DraggableCard card={card} />
            ) : (
              <Card card={card} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default function UserCards({ deck, pile }: Props) {
  const rest = [...pile];
  const one = rest.pop();
  const two = rest.pop();
  const three = rest.pop();

  return (
    <div className="flex gap-4 mt-8">
      <Deck deck={deck} />
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
      {one && <DraggableCard card={one} />}
      {two && <DraggableCard card={two} />}
      {three && <DraggableCard card={three} />}
    </div>
  );
}

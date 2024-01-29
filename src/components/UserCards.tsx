import { useEffect, useState } from "react";
import { type BlitzCard } from "../model/cards";
import Card from "./Card";
import DraggableCard from "./DraggableCard";

type Props = {
  deck: BlitzCard[];
  pile: BlitzCard[];
};

const Pile = ({ pile }: { pile: BlitzCard[] }) => {
  const [end, setEnd] = useState(0);

  const handleDraw = () => {
    const sound = new Audio("/flutter.mp3");
    sound.volume = 0.05;

    sound.play();

    setEnd((end) => (end + 3) % pile.length);
  };

  const drawnCards = pile.slice(0, end + 3);

  return (
    <>
      <button onClick={handleDraw}>DRAW!</button>
      <div className="w-[71px] relative">
        {drawnCards.map((card, i) => (
          <div
            className="z-[999]"
            key={i}
            style={{
              position: "absolute",
              top: `${-i * 1}px`,
            }}
          >
            {i === drawnCards.length - 1 ? (
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
  const rest = [...deck];
  const one = rest.pop();
  const two = rest.pop();
  const three = rest.pop();

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
      {one && <DraggableCard card={one} />}
      {two && <DraggableCard card={two} />}
      {three && <DraggableCard card={three} />}

      <Pile pile={pile} />
    </div>
  );
}

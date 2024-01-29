import { useDroppable } from "@dnd-kit/core";
import { BlitzCardStack } from "../model/cards";
import Card from "./Card";
import clsx from "clsx";
import { useEffect } from "react";

type Props = {
  id: string;
  stack: BlitzCardStack;
};

export default function DroppableStack({ id, stack }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { id, stack } });

  useEffect(() => {
    if (isOver) {
      const woosh = new Audio("/cardwoosh.mp3");
      woosh.volume = 0.05;
      woosh.play();
    }
  }, [isOver]);

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        isOver && "transition-all skew-x-6 opacity-50",
        "relative mt-4 w-[101px] h-[130px]"
      )}
    >
      {stack.cardStack.map((card, i) => (
        <div
          key={i}
          className="z-0"
          style={{
            position: "absolute",
            top: `${-i * 1}px`,
          }}
        >
          <Card card={card} />
        </div>
      ))}
    </div>
  );
}

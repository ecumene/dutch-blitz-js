import { useDroppable } from "@dnd-kit/core";
import { BlitzCardStack } from "../model/cards";
import Card from "./Card";

type Props = {
  id: string;
  stack: BlitzCardStack;
};

export default function DroppableStack({ id, stack }: Props) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      id,
      stack,
    },
  });
  return (
    <div ref={setNodeRef} className="relative mt-4 w-[71px] h-[100px]">
      {stack.cardStack.map((card, i) => (
        <div
          key={i}
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

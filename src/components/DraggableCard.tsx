import { BlitzCard } from "../model/cards";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";

type Props = {
  card: BlitzCard;
};

export default function DraggableCard({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${card.color}-${card.number}-${card.owner}`,
    data: card,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      card={card}
      style={style}
      {...listeners}
      {...attributes}
      className="z-[999]"
    />
  );
}

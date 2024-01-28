import { BlitzCardStackState } from "../model/cards";
import DroppableStack from "./DroppableStack";

type Props = {
  stacks: BlitzCardStackState[];
};
export default function GameStacks({ stacks }: Props) {
  return (
    <div className="flex gap-2">
      {stacks.map(({ id, stack }) => (
        <DroppableStack id={id} stack={stack} />
      ))}
    </div>
  );
}

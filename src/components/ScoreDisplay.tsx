import { ClientState } from "../model/client-state";
import { calcScore } from "../model/mutators";

type Props = {
  user: ClientState;
};
export default function ScoreDisplay({ user }: Props) {
  const { blitzLeft, dutchPlayed, score } = calcScore(user!);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-4">
        <div className="text-2xl">+</div>
        <div>
          <div className="text-lg">{dutchPlayed}</div>
          <div className="text-sm text-gray-600">dutch played</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-2">
        <div className="text-2xl">-</div>
        <div>
          <div className="text-lg">
            {blitzLeft} <span className="text-sm font-bold">x2 </span>
          </div>
          <div className="text-sm text-gray-600">blitz pile left</div>
        </div>
      </div>

      <div className="w-full border-t border-gray-400 my-2"></div>

      <div className="flex items-center space-x-4">
        <div className="text-2xl">=</div>
        <div>
          <div className="text-lg text-red-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { randUserInfo } from "../model/client-state.js";
import { useStacks, useUser } from "../model/subscriptions.js";
import CursorField from "../cursor-field.js";
import UserCards from "../components/UserCards.js";
import { useParams } from "react-router-dom";
import { useReflect } from "../providers.js";
import GameStacks from "../components/GameStacks.js";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
  throw new Error("VITE_REFLECT_URL required");
}

export const Game = () => {
  const initHack = useRef(false);
  const { roomID } = useParams();

  if (!roomID) throw new Error("missing room id");

  const r = useReflect();

  const user = useUser(r);
  // r.mutate.clearRoom();

  const stacks = useStacks(r);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.dispose(async () => {
        // this makes sure that there is only one instance of the reflect client during hmr reloads
        await r.close();
      });
    }

    void (async () => {
      if (!initHack.current) {
        initHack.current = true;
        const userInfo = randUserInfo();
        await r.mutate.initClientState(userInfo);
      }
    })();
  }, []);

  return (
    <div className="absolute box-border p-8 flex flex-col items-start left-0 top-0 w-full h-full bg-[rgb(229,229,229)] overflow-hidden">
      {user && (
        <div className="absolute bottom-0">
          {user.userInfo.name} <UserCards pile={user.pile} deck={user.deck} />
        </div>
      )}
      <GameStacks stacks={stacks} />
      <CursorField r={r} />
    </div>
  );
};

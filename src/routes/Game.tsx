import { useEffect } from "react";
import { randUserInfo } from "../model/client-state.js";
import styles from "../index.module.css";
import { useUser } from "../model/subscriptions.js";
import CursorField from "../cursor-field.js";
import UserCards from "../components/UserCards.js";
import { useParams } from "react-router-dom";
import { useReflect } from "../providers.js";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
  throw new Error("VITE_REFLECT_URL required");
}

export const Game = () => {
  const { roomID } = useParams();

  if (!roomID) throw new Error("missing room id");

  const r = useReflect();

  const user = useUser(r);
  // r.mutate.clearRoom();

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.dispose(async () => {
        // this makes sure that there is only one instance of the reflect client during hmr reloads
        await r.close();
      });
    }

    void (async () => {
      if (!user) {
        const userInfo = randUserInfo();
        await r.mutate.initClientState(userInfo);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      {user && (
        <div className={styles.cards}>
          {user.userInfo.name} <UserCards pile={user.pile} deck={user.deck} />
        </div>
      )}
      <CursorField r={r} />
    </div>
  );
};

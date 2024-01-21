import { Reflect } from "@rocicorp/reflect/client";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { randUserInfo } from "./model/client-state.js";
import CursorField from "./cursor-field.js";
import styles from "./index.module.css";
//hello world
import { mutators } from "./model/mutators.js";
import { useCompetitors, useUser } from "./model/subscriptions.js";
import Providers from "./providers.js";
import UserCards from "./components/UserCards.js";

const userID = nanoid();
const roomID = "my-room";
const incrementKey = "count";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
  throw new Error("VITE_REFLECT_URL required");
}

const r = new Reflect({
  server,
  userID,
  roomID,
  auth: userID,
  mutators,
});

function App() {
  useEffect(() => {
    void (async () => {
      const userInfo = randUserInfo();
      await r.mutate.initClientState(userInfo);
    })();
  }, []);

  const handleButtonClick = () => {
    void r.mutate.increment({ key: incrementKey, delta: 1 });
  };

  const user = useUser(r);
  const others = useCompetitors(r);
  // r.mutate.clearRoom();
  console.log(others);

  // Render app.
  return (
    <Providers>
      <div className={styles.container}>
        {user && (
          <div>
            {user.userInfo.name} <UserCards pile={user.pile} deck={user.deck} />
          </div>
        )}
        {others.map((client) => (
          <div>
            {client.userInfo.name}{" "}
            <UserCards pile={client.pile} deck={client.deck} />
          </div>
        ))}
        <CursorField r={r} />
      </div>
    </Providers>
  );
}

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("root element is null");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.dispose(async () => {
    // this makes sure that there is only one instance of the reflect client during hmr reloads
    await r.close();
    root.unmount();
  });
}

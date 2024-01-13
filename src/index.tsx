import { Reflect } from "@rocicorp/reflect/client";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { randUserInfo } from "./model/client-state.js";
import CursorField from "./cursor-field.js";
import styles from "./index.module.css";
import { mutators } from "./model/mutators.js";
import { useCount } from "./model/subscriptions.js";
import Providers from "./providers.js";
import { SortableContext } from "@dnd-kit/sortable";

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

  const count = useCount(r, incrementKey);

  // Render app.
  return (
    <Providers>
      <div className={styles.container}>
        <img className={styles.logo} src="/reflect.svg" />
        <div className={styles.content}>
          <div className={styles.count}>{count}</div>
          <button onClick={handleButtonClick}>Bonk</button>
          <CursorField r={r} />
        </div>
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

import { useEffect } from "react";
import { Reflect } from "@rocicorp/reflect/client";
import { M } from "./model/mutators.js";
import { useClientState } from "./model/subscriptions.js";
import { usePresence } from "@rocicorp/reflect/react";

export default function CursorField({ r }: { r: Reflect<M> }) {
  useEffect(() => {
    const handler = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
      void r.mutate.setCursor({
        x: pageX,
        y: pageY,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const clientStateIDs = usePresence(r);

  return (
    <>
      {clientStateIDs.map((id) => (
        <Cursor r={r} id={id} key={id} />
      ))}
    </>
  );
}

function Cursor({ r, id }: { r: Reflect<M>; id: string }) {
  const cs = useClientState(r, id);
  if (!cs) return null;

  const { cursor, userInfo } = cs;
  if (!cursor) return null;

  return (
    <div
      key={id}
      className="absolute inset-0 pointer-events-none transition-opacity duration-100 linear"
    >
      <div
        className="absolute cursor-pointer font-sans text-xs font-normal leading-none"
        style={{
          left: cursor.x,
          top: cursor.y,
          overflow: "auto",
        }}
      >
        <div className="inline-block" style={{ transform: "rotate(-127deg)" }}>
          <span className="text-lg" style={{ color: userInfo.color }}>
            ➤
          </span>
        </div>
        <div
          className="block m-1 mt-1 mb-1 ml-4 mr-4 p-1 whitespace-nowrap"
          style={{
            backgroundColor: userInfo.color,
            color: "white",
          }}
        >
          {userInfo.avatar}&nbsp;{userInfo.name}
        </div>
      </div>
    </div>
  );
}

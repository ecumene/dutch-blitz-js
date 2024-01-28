import { Reflect } from "@rocicorp/reflect/client";
import { nanoid } from "nanoid";
import { M, mutators } from "./model/mutators.js";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { BlitzCard, initStackState } from "./model/cards.js";

const getUserID = (room: string) => {
  const localID = localStorage.getItem(`${room}/userID`);
  if (localID) {
    return localID;
  } else {
    const newID = nanoid();
    localStorage.setItem(`${room}/userID`, newID);
    return newID;
  }
};

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
  throw new Error("VITE_REFLECT_URL required");
}

const ReflectContext = React.createContext<Reflect<M>>(null!);

export const useReflect = () => {
  return React.useContext(ReflectContext);
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const { roomID } = useParams();

  if (!roomID) throw new Error("missing room id");

  const userID = getUserID(roomID);

  const reflect = useRef(
    new Reflect({ server, userID, auth: userID, roomID, mutators })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(over, active);
    const card = active?.data.current as BlitzCard;
    if (card && over === null && card.number === 1) {
      reflect.current.mutate.initStackState({
        color: active?.data.current?.color,
        cardStack: [card],
        currentNumber: 1,
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ReflectContext.Provider value={reflect.current}>
        {children}
      </ReflectContext.Provider>
    </DndContext>
  );
}

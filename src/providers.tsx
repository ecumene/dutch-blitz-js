import { Reflect } from "@rocicorp/reflect/client";
import { nanoid } from "nanoid";
import { M, mutators } from "./model/mutators.js";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { BlitzCard, BlitzCardStackState, CardNumber } from "./model/cards.js";

const tunk = new Audio("/tunk.mp3");
tunk.volume = 0.05;

const point = new Audio("/point.mp3");
point.volume = 0.5;

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    reflect.current.mutate.setCarrying();
    const card = active?.data.current as BlitzCard;

    let removeCard = false;
    if (!card) throw new Error("missing card");
    if (over === null) {
      if (card.number === 1) {
        await reflect.current.mutate.initStackState({
          color: active?.data.current?.color,
          cardStack: [card],
          currentNumber: 1,
        });

        removeCard = true;
      }
    } else {
      const { id, stack } = over.data.current as BlitzCardStackState;
      if (
        stack.currentNumber + 1 === card.number &&
        card.color === stack.color
      ) {
        await reflect.current.mutate.appendStack({ id: id, card });
        removeCard = true;
      } else if (card.number === 1) {
        await reflect.current.mutate.initStackState({
          color: active?.data.current?.color,
          cardStack: [card],
          currentNumber: 1,
        });

        removeCard = true;
      }
    }

    if (removeCard) {
      await reflect.current.mutate.removeCard(card);
      point.play();
    } else tunk.play();
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    reflect.current.mutate.setCarrying(active?.data.current as BlitzCard);
  };

  const handleDragCancel = () => {
    reflect.current.mutate.setCarrying();
  };

  return (
    <DndContext
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ReflectContext.Provider value={reflect.current}>
        {children}
      </ReflectContext.Provider>
    </DndContext>
  );
}
